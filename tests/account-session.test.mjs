import test from 'node:test';
import assert from 'node:assert/strict';
import {AccountSession} from '../src/account-session.js';
import {emptyState,userCacheKey,TERMS_VERSION} from '../src/data-model.js';
const user=(uid,verified=true)=>({uid,email:`${uid}@example.test`,emailVerified:verified});
const consent={version:TERMS_VERSION,termsAccepted:true,adultConfirmed:true,acceptedAt:'2026-10-02T12:00:00Z'};
const clone=value=>JSON.parse(JSON.stringify(value));
function fixture(){
 const saved=new Map(),cache=new Map(),writes=[];
 const api={current:null,accepted:true,fail:null,gate:null,
  async consent(){return api.accepted?consent:null;},
  async acceptTerms(){api.accepted=true;},
  async openStore(){const uid=api.current.uid;const previous=saved.get(uid)||{revision:0,state:emptyState()};let revision=previous.revision;let disposed=false;
   return {initial:clone(previous.state),get revision(){return revision;},dispose(){disposed=true;},async save(state){if(disposed)throw new Error('disposed');if(api.gate)await api.gate;if(api.fail)throw api.fail;writes.push({uid,state:clone(state)});revision++;saved.set(uid,{revision,state:clone(state)});}};
  },
  async signOut(){api.current=null;},async removeAccount(){saved.delete(api.current.uid);api.current=null;}
 };
 const storage={getItem:key=>cache.get(key)||null,setItem:(key,value)=>cache.set(key,value),removeItem:key=>cache.delete(key)};
 const session=new AccountSession(api,{storage});
 const open=async u=>{api.current=u;await session.open(u);};
 return {api,session,open,saved,cache,writes};
}
test('bloqueia leitura de dados antes da confirmação de e-mail e do aceite',async()=>{
 const f=fixture();let reads=0;f.api.openStore=async()=>{reads++;throw new Error('não deveria ler');};
 await f.open(user('a',false));assert.equal(f.session.phase,'verify');assert.equal(reads,0);
 f.api.accepted=false;await f.open(user('a'));assert.equal(f.session.phase,'consent');assert.equal(reads,0);
});
test('trocar a conta limpa dados e não reaproveita pendências de outra pessoa',async()=>{
 const f=fixture();await f.open(user('a'));f.api.fail=new Error('unavailable');
 const data=emptyState();data.rides.push({id:'privado',date:'2026-10-02',amount:99});f.session.save(data);await f.session.flush();
 assert(f.cache.has(userCacheKey('a')));f.api.fail=null;await f.open(user('b'));
 assert.equal(f.session.state.rides.length,0);assert.equal(f.session.pending,null);assert(f.cache.has(userCacheKey('a')));
});
test('escritas sequenciais não perdem alteração feita durante o envio',async()=>{
 const f=fixture();await f.open(user('a'));let release;f.api.gate=new Promise(resolve=>release=resolve);
 const first=emptyState();first.goal=400;f.session.save(first);
 const second=clone(first);second.goal=500;f.session.save(second);release();await f.session.flush();
 assert.deepEqual(f.writes.map(w=>w.state.goal),[400,500]);assert.equal(f.session.pending,null);assert.equal(f.cache.size,0);
});
test('falha de rede mantém a alteração e permite reenviar',async()=>{
 const f=fixture();await f.open(user('a'));f.api.fail=new Error('unavailable');const data=emptyState();data.goal=550;
 f.session.save(data);await f.session.flush();assert.equal(f.session.pending.goal,550);assert(f.session.error);
 f.api.fail=null;await f.session.retry();assert.equal(f.saved.get('a').state.goal,550);assert.equal(f.session.pending,null);
});
test('restaura pendência somente quando a revisão da conta coincide',async()=>{
 const f=fixture();const data=emptyState();data.goal=650;f.cache.set(userCacheKey('a'),JSON.stringify({uid:'a',revision:0,state:data}));
 await f.open(user('a'));await f.session.flush();assert.equal(f.saved.get('a').state.goal,650);
});
test('revisão diferente exige decisão antes de sobrescrever a nuvem',async()=>{
 const f=fixture();const data=emptyState();data.goal=650;f.cache.set(userCacheKey('a'),JSON.stringify({uid:'a',revision:0,state:data}));
 f.saved.set('a',{revision:2,state:emptyState()});await f.open(user('a'));
 assert.equal(f.session.phase,'conflict');assert.equal(f.writes.length,0);
 await f.session.useServerCopy();assert.equal(f.session.phase,'ready');assert.equal(f.session.state.goal,300);assert.equal(f.cache.size,0);
});
test('resposta de leitura atrasada não exibe dados da conta anterior',async()=>{
 const f=fixture();let release;const waiting=new Promise(resolve=>release=resolve);const original=f.api.consent;
 f.api.consent=async()=>{await waiting;return original();};
 const old=f.open(user('a'));await f.open(null);release();await old;
 assert.equal(f.session.phase,'signedout');assert.equal(f.session.user,null);assert.equal(f.session.state.rides.length,0);
});
test('sair com falha de envio preserva os dados até decisão explícita',async()=>{
 const f=fixture();await f.open(user('a'));f.api.fail=new Error('unavailable');f.session.save(emptyState());await f.session.flush();
 await assert.rejects(()=>f.session.logout());assert.equal(f.session.phase,'ready');
 await f.session.logout({keepPending:true});assert.equal(f.session.phase,'signedout');assert(f.cache.has(userCacheKey('a')));
});

test('armazenamento local indisponível não promete cópia persistente',async()=>{
 const f=fixture();f.session.storage=undefined;await f.open(user('a'));
 f.api.fail=new Error('unavailable');f.session.save(emptyState());await f.session.flush();
 assert.equal(f.session.cacheOK,false);assert(f.session.pending);
});

test('exclusão parcial bloqueia novas edições e permite concluir depois',async()=>{
 const f=fixture();await f.open(user('a'));
 f.api.removeAccount=async()=>{throw new Error('data/deletion-incomplete');};
 await assert.rejects(()=>f.session.removeAccount('senha'));
 assert.equal(f.session.phase,'deletion');assert.equal(f.session.store,null);
 f.session.save(emptyState());assert.equal(f.session.pending,null);
 f.api.removeAccount=async()=>{};await f.session.removeAccount('senha');
 assert.equal(f.session.phase,'signedout');
});

test('exclusão iniciada em outro acesso tem prioridade sobre o aceite',async()=>{
 const f=fixture();f.api.consent=async()=>({deletionRequested:true});
 f.api.openStore=async()=>{throw new Error('não deve abrir');};
 await f.open(user('a'));assert.equal(f.session.phase,'deletion');
});
