import {emptyState,hasAcceptedTerms,userCacheKey,partitionState} from './data-model.js';

const clone = value => JSON.parse(JSON.stringify(value));
const equivalent = (a,b) => JSON.stringify(partitionState(a)) === JSON.stringify(partitionState(b));

// Mantém alterações pendentes por UID e impede respostas de uma conta de
// atualizar a tela de outra. Escritas são sequenciais e detectam conflitos.
export class AccountSession {
  constructor(service,{storage,onChange,onStatus}={}) {
    this.service=service; this.storage=storage; this.onChange=onChange||(()=>{}); this.onStatus=onStatus||(()=>{});
    this.phase='loading'; this.user=null; this.state=emptyState(); this.consent=null;
    this.generation=0; this.pending=null; this.writing=null; this.store=null; this.error=null;
    this.cacheOK=true;
  }
  start() {this.unsubscribe=this.service.watch(user=>{void this.open(user);});}
  emit() {this.onChange(this);}
  status() {this.onStatus(this);}
  readCache(uid) {
    try {return JSON.parse(this.storage?.getItem(userCacheKey(uid))||'null');}
    catch {this.cacheOK=false; return null;}
  }
  cache() {
    if(!this.user||!this.store)return;
    if(!this.storage){this.cacheOK=false;return;}
    try {
      if(this.pending)this.storage?.setItem(userCacheKey(this.user.uid),JSON.stringify({uid:this.user.uid,revision:this.store.revision,state:this.pending}));
      else this.storage?.removeItem(userCacheKey(this.user.uid));
      this.cacheOK=true;
    } catch {this.cacheOK=false;}
  }
  async open(user,{discardPending=false}={}) {
    const generation=++this.generation;
    this.store?.dispose(); this.store=null; this.pending=null; this.writing=null;
    this.state=emptyState(); this.consent=null; this.user=user; this.error=null;
    this.phase=user?'loading':'signedout'; this.emit();
    if(!user)return;
    if(!user.emailVerified){this.phase='verify';this.emit();return;}
    try {
      const consent=await this.service.consent();
      if(generation!==this.generation)return;
      this.consent=consent;
      if(consent?.deletionRequested){this.phase='deletion';this.emit();return;}
      if(!hasAcceptedTerms(consent)){this.phase='consent';this.emit();return;}
      const store=await this.service.openStore();
      if(generation!==this.generation){store.dispose();return;}
      this.store=store;this.state=store.initial;
      const cached=this.readCache(user.uid);
      if(!discardPending&&cached?.uid===user.uid&&cached.state){
        if(equivalent(cached.state,store.initial)){
          this.pending=null;this.cache();
        }else{
          this.pending=cached.state;
          if(cached.revision!==store.revision){
            this.error=new Error('data/conflict');this.phase='conflict';this.emit();return;
          }
          this.state=cached.state;
        }
      }else if(discardPending){this.cache();}
      this.state.account={email:user.email||'',uid:user.uid};
      this.phase='ready';this.emit();
      if(this.pending)void this.flush();
    }catch(error){if(generation===this.generation){this.error=error;this.phase='error';this.emit();}}
  }
  async accept() {
    if(this.phase!=='consent')return;
    const generation=this.generation;
    await this.service.acceptTerms();
    if(generation===this.generation)await this.open(this.user);
  }
  async checkVerification(){const user=await this.service.checkVerification();await this.open(user);return user.emailVerified;}
  save(state) {
    if(this.phase!=='ready'||!this.store)return;
    this.state=state;this.pending=clone(state);this.cache();this.status();
    if(!this.error)void this.flush();
  }
  async flush() {
    if(this.writing)return this.writing;
    if(!this.pending||!this.store||this.error)return;
    const store=this.store,generation=this.generation;
    const task=(async()=>{
      while(this.pending&&generation===this.generation){
        const snapshot=this.pending;
        try {
          await store.save(snapshot);
          if(generation!==this.generation)return;
          if(this.pending===snapshot)this.pending=null;
          this.cache();
        }catch(error){
          if(generation!==this.generation)return;
          this.error=error;
          if(error.message==='data/conflict'){this.phase='conflict';this.emit();}
          break;
        }
      }
    })();
    this.writing=task;this.status();
    try {await task;} finally {if(generation===this.generation){this.writing=null;this.status();}}
  }
  async retry(){this.error=null;await this.flush();this.status();}
  async logout({keepPending=false}={}) {
    if(!keepPending){await this.flush();if(this.pending)throw this.error||new Error('unavailable');}
    this.cache();
    await this.service.signOut();
    await this.open(null);
  }
  async removeAccount(password) {
    await this.flush();
    if(this.pending)throw this.error||new Error('unavailable');
    const uid=this.user.uid;
    try {await this.service.removeAccount(password);}
    catch(error){
      if(error.message==='data/deletion-incomplete'){
        this.store?.dispose();this.store=null;this.state=emptyState();
        this.error=error;this.phase='deletion';this.emit();
      }
      throw error;
    }
    try{this.storage?.removeItem(userCacheKey(uid));}catch{}
    await this.open(null);
  }
  async useServerCopy(){await this.open(this.user,{discardPending:true});}
}
