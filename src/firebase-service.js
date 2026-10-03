import {TERMS_VERSION,emptyState,partitionState,restoreState,changesBetween} from './data-model.js';

export async function connectFirebase(configuration) {
  const config = configuration?.firebase;
  if (!config?.apiKey || !config?.projectId || !config?.appId || !config?.authDomain) throw new Error('app/not-configured');
  const [appSdk,authSdk,dbSdk] = await Promise.all([
    import('https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js'),
    import('https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js'),
    import('https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js')
  ]);
  const app = appSdk.initializeApp(config);
  const auth = authSdk.getAuth(app);
  const db = dbSdk.getFirestore(app);
  auth.languageCode = 'pt-BR';
  await authSdk.setPersistence(auth,authSdk.browserLocalPersistence);
  const google = new authSdk.GoogleAuthProvider();
  google.setCustomParameters({prompt:'select_account'});
  const profileRef = uid => dbSdk.doc(db,'users',uid,'private','consent');
  const metaRef = uid => dbSdk.doc(db,'users',uid,'private','state');
  const deletionRef = uid => dbSdk.doc(db,'users',uid,'private','deletion');
  const recordRef = (uid,id) => dbSdk.doc(db,'users',uid,'records',id);
  const actionSettings = {url:new URL('/#login',location.origin).href,handleCodeInApp:false};
  const identity = () => {
    const user = auth.currentUser;
    if (!user) throw new Error('auth/requires-recent-login');
    return user;
  };
  const service = {
    watch: handler => authSdk.onAuthStateChanged(auth,handler),
    user: identity,
    signIn: (email,password) => authSdk.signInWithEmailAndPassword(auth,email.trim(),password),
    google: () => authSdk.signInWithPopup(auth,google),
    async signUp(email,password) {
      const result = await authSdk.createUserWithEmailAndPassword(auth,email.trim(),password);
      await authSdk.sendEmailVerification(result.user,actionSettings);
    },
    async recover(email) {
      try {await authSdk.sendPasswordResetEmail(auth,email.trim(),actionSettings);}
      catch(error) {if(error.code !== 'auth/user-not-found') throw error;}
    },
    resendVerification: () => authSdk.sendEmailVerification(identity(),actionSettings),
    async checkVerification() {
      const user = identity();
      await authSdk.reload(user);
      await authSdk.getIdToken(user,true);
      return user;
    },
    signOut: () => authSdk.signOut(auth),
    async consent() {
      const deleting = await dbSdk.getDocFromServer(deletionRef(identity().uid));
      if(deleting.exists())return {deletionRequested:true};
      const snap = await dbSdk.getDocFromServer(profileRef(identity().uid));
      if (!snap.exists()) return null;
      const data = snap.data();
      return {...data,acceptedAt:data.acceptedAt?.toDate().toISOString()};
    },
    async acceptTerms() {
      const ref = profileRef(identity().uid);
      await dbSdk.setDoc(ref,{version:TERMS_VERSION,termsAccepted:true,adultConfirmed:true,acceptedAt:dbSdk.serverTimestamp()});
      return service.consent();
    },
    async openStore() {
      const uid = identity().uid;
      let revision = 0, baseline = partitionState(emptyState()), disposed = false;
      // O manifesto e todos os meses são lidos na mesma transação.
      const initial = await dbSdk.runTransaction(db,async tx => {
        const meta = await tx.get(metaRef(uid));
        if (!meta.exists()) return emptyState();
        const data = meta.data();
        const snapshots = await Promise.all(data.documents.map(id => tx.get(recordRef(uid,id))));
        const docs = {};
        for (let i=0;i<snapshots.length;i++) {
          if (!snapshots[i].exists()) throw new Error('data/invalid-record');
          docs[data.documents[i]] = snapshots[i].data().payload;
        }
        revision = data.revision;
        baseline = {settings:data.settings,documents:docs};
        return restoreState(data.settings,docs);
      });
      return {
        initial,
        get revision() {return revision;},
        dispose() {disposed = true;},
        async save(state) {
          if (disposed || identity().uid !== uid) throw new Error('auth/requires-recent-login');
          const next = partitionState(state);
          const changes = changesBetween(baseline,next);
          if (!changes.length && baseline.settings === next.settings && revision) return;
          if (changes.length > 450) throw new Error('data/month-too-large');
          const expected = revision;
          await dbSdk.runTransaction(db,async tx => {
            const current = await tx.get(metaRef(uid));
            if ((current.exists() ? current.data().revision : 0) !== expected) throw new Error('data/conflict');
            for (const change of changes) {
              if (change.value === null) tx.delete(recordRef(uid,change.id));
              else tx.set(recordRef(uid,change.id),{payload:change.value,updatedAt:dbSdk.serverTimestamp()});
            }
            tx.set(metaRef(uid),{revision:expected+1,settings:next.settings,documents:Object.keys(next.documents).sort(),updatedAt:dbSdk.serverTimestamp()});
          });
          baseline = next;
          revision = expected+1;
        }
      };
    },
    async removeAccount(password) {
      const user = identity();
      if (user.providerData.some(p => p.providerId === 'password')) {
        await authSdk.reauthenticateWithCredential(user,authSdk.EmailAuthProvider.credential(user.email,password));
      } else {
        await authSdk.reauthenticateWithPopup(user,google);
      }
      try {
      await dbSdk.setDoc(deletionRef(user.uid),{requestedAt:dbSdk.serverTimestamp()});
      const records = await dbSdk.getDocsFromServer(dbSdk.collection(db,'users',user.uid,'records'));
      for (let i=0;i<records.docs.length;i+=400) {
        const batch = dbSdk.writeBatch(db);
        records.docs.slice(i,i+400).forEach(snap => batch.delete(snap.ref));
        await batch.commit();
      }
      const cleanup=dbSdk.writeBatch(db);
      cleanup.delete(metaRef(user.uid));
      cleanup.delete(profileRef(user.uid));
      cleanup.delete(deletionRef(user.uid));
      await cleanup.commit();
      await authSdk.deleteUser(user);
      }catch(cause){throw new Error('data/deletion-incomplete',{cause});}
    }
  };
  return service;
}
