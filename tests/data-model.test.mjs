import test from 'node:test';
import assert from 'node:assert/strict';
import {emptyState,partitionState,restoreState,changesBetween,userCacheKey,hasAcceptedTerms,TERMS_VERSION,authError} from '../src/data-model.js';

test('conta nova não contém dados fictícios nem jornada ativa',()=>{
 const state=emptyState();
 for(const key of ['rides','expenses','shifts','receipts','maintenance','services'])assert.deepEqual(state[key],[]);
 assert.equal(state.km,0);assert.equal(state.activeShift,null);assert.equal(state.account,null);
});
test('meses separados preservam corridas, gastos, veículos e revisões',()=>{
 const state=emptyState();
 state.rides=[{id:'a',date:'2026-10-02',amount:20},{id:'b',date:'2026-09-30',amount:35}];
 state.expenses=[{id:'e',date:'2026-10-02',amount:10}];
 state.vehicle={brand:'BYD',fuel:'Elétrico'};
 state.account={email:'teste@example.test',uid:'user-a'};
 const packed=partitionState(state),restored=restoreState(packed.settings,packed.documents);
 assert.deepEqual(Object.keys(packed.documents),['expenses_2026-10','rides_2026-09','rides_2026-10']);
 assert.deepEqual(restored.rides.map(r=>r.id).sort(),['a','b']);
 assert.equal(restored.expenses[0].amount,10);assert.deepEqual(restored.vehicle,state.vehicle);
 assert.equal(restored.account,null);assert(!packed.settings.includes('teste@example.test'));
});
test('atualiza só os meses alterados e remove mês vazio',()=>{
 const state=emptyState();state.rides=[{id:'a',date:'2026-10-02',amount:20},{id:'b',date:'2026-09-30',amount:35}];
 const before=partitionState(state);state.rides.shift();
 assert.deepEqual(changesBetween(before,partitionState(state)),[{id:'rides_2026-10',value:null}]);
});
test('aceite exige versão atual, maioridade e data válida',()=>{
 const valid={version:TERMS_VERSION,termsAccepted:true,adultConfirmed:true,acceptedAt:'2026-10-02T12:00:00.000Z'};
 assert.equal(hasAcceptedTerms(valid),true);
 for(const extra of [{version:'old'},{adultConfirmed:false},{termsAccepted:false},{acceptedAt:'inválida'}])assert.equal(hasAcceptedTerms({...valid,...extra}),false);
});
test('cache usa o identificador da conta, nunca uma chave global',()=>{
 assert.notEqual(userCacheKey('a'),userCacheKey('b'));assert.throws(()=>userCacheKey(''));
 assert.throws(()=>userCacheKey('a/b'));
});
test('limita meses grandes antes do limite de documento do Firestore',()=>{
 const state=emptyState();state.rides=[{id:'a',date:'2026-10-02',description:'x'.repeat(710000)}];
 assert.throws(()=>partitionState(state),/data\/month-too-large/);
});
test('mensagens de login não distinguem e-mail inexistente de senha incorreta',()=>{
 assert.equal(authError({code:'auth/user-not-found'}),authError({code:'auth/wrong-password'}));
});
