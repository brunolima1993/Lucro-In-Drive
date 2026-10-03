// Usado SOMENTE pelo servidor local de testes na porta 4181; não entra no build.
import {emptyState,TERMS_VERSION} from '/data-model.js';
export async function connectFirebase(){
 let observer,current=null,accepted=false,data=emptyState(),revision=0;
 const user={uid:'local-fixture',email:'conta-ficticia@example.test',emailVerified:false,providerData:[{providerId:'password'}]};
 const notify=()=>observer(current);
 return {
  watch(callback){observer=callback;queueMicrotask(notify);return()=>{};},
  async signIn(){current={...user};notify();},async signUp(){current={...user};notify();},
  async google(){current={...user,emailVerified:true,providerData:[{providerId:'google.com'}]};notify();},
  async recover(){},async resendVerification(){},async checkVerification(){current.emailVerified=true;return current;},
  async signOut(){current=null;notify();},async removeAccount(){data=emptyState();current=null;notify();},
  async consent(){return accepted?{version:TERMS_VERSION,termsAccepted:true,adultConfirmed:true,acceptedAt:new Date().toISOString()}:null;},
  async acceptTerms(){accepted=true;},
  async openStore(){return{initial:JSON.parse(JSON.stringify(data)),get revision(){return revision;},dispose(){},async save(next){data=JSON.parse(JSON.stringify(next));revision++;}};}
 };
}
