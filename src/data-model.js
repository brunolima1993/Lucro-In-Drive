export const DATA_GROUPS = ['rides','expenses','shifts','maintenance','receipts','serviceHistory'];
export const TERMS_VERSION = '2026-10-02';
const copy = value => JSON.parse(JSON.stringify(value));
const canonical = value => Array.isArray(value) ? value.map(canonical) : value && typeof value === 'object' ? Object.fromEntries(Object.keys(value).sort().map(key=>[key,canonical(value[key])])) : value;
export function emptyState() {
  return {version:1,goal:300,km:0,plan:'gratis',account:null,rides:[],expenses:[],shifts:[],maintenance:[],receipts:[],serviceHistory:[],activeShift:null,platforms:['Uber','99','Particular'],vehicle:null,servicePlan:'combustao',vehicleNudge:'on',services:[]};
}
export function hasAcceptedTerms(record) {
  return record?.version === TERMS_VERSION && record.termsAccepted === true && record.adultConfirmed === true && typeof record.acceptedAt === 'string' && Number.isFinite(Date.parse(record.acceptedAt));
}
export function partitionState(state) {
  const settings = copy(state);
  delete settings.account;
  delete settings.seedDate;
  // Planos pagos só poderão ser liberados pelo servidor após integrar a cobrança.
  settings.plan = 'gratis';
  const documents = {};
  for (const group of DATA_GROUPS) {
    delete settings[group];
    for (const item of state[group] || []) {
      if (!item.id || !/^\d{4}-\d{2}-\d{2}$/.test(item.date || '')) throw new Error('data/invalid-record');
      const id = `${group}_${item.date.slice(0,7)}`;
      (documents[id] ||= []).push(copy(item));
    }
  }
  for (const [id, records] of Object.entries(documents)) {
    documents[id] = JSON.stringify(canonical(records));
    if (new TextEncoder().encode(documents[id]).length > 700000) throw new Error('data/month-too-large');
  }
  return {settings:JSON.stringify(canonical(settings)),documents:Object.fromEntries(Object.entries(documents).sort(([a],[b])=>a.localeCompare(b)))};
}
export function restoreState(settings, documents) {
  const state = {...emptyState(),...JSON.parse(settings || '{}')};
  for (const group of DATA_GROUPS) state[group] = [];
  for (const [id, json] of Object.entries(documents)) {
    const group = DATA_GROUPS.find(name => id.startsWith(name + '_'));
    if (!group) throw new Error('data/invalid-record');
    const records = JSON.parse(json);
    if (!Array.isArray(records)) throw new Error('data/invalid-record');
    state[group].push(...records);
  }
  state.account = null;
  return state;
}
export function changesBetween(previous, next) {
  return [...new Set([...Object.keys(previous.documents),...Object.keys(next.documents)])]
    .filter(id => previous.documents[id] !== next.documents[id])
    .map(id => ({id,value:next.documents[id] ?? null}));
}
export function userCacheKey(uid) {
  if (typeof uid !== 'string' || !uid || /[\/\s]/.test(uid)) throw new Error('data/invalid-user');
  return `lucroindrive.account.v1.${uid}`;
}
export function authError(error) {
  const code = error?.code || error?.message;
  return ({
    'auth/invalid-credential':'E-mail ou senha incorretos.',
    'auth/user-not-found':'E-mail ou senha incorretos.',
    'auth/wrong-password':'E-mail ou senha incorretos.',
    'auth/invalid-email':'Confira o endereço de e-mail.',
    'auth/email-already-in-use':'Não foi possível criar a conta. Tente entrar ou recuperar a senha.',
    'auth/weak-password':'Use uma senha com pelo menos 8 caracteres.',
    'auth/password-does-not-meet-requirements':'A senha não atende aos requisitos de segurança. Use ao menos 8 caracteres, letras e números.',
    'auth/too-many-requests':'Muitas tentativas. Aguarde alguns minutos e tente novamente.',
    'auth/network-request-failed':'Confira sua conexão e tente novamente.',
    'auth/popup-closed-by-user':'A entrada com Google foi cancelada.',
    'auth/cancelled-popup-request':'Já existe uma janela de entrada aberta.',
    'auth/popup-blocked':'Permita a janela do Google no navegador e tente novamente.',
    'auth/account-exists-with-different-credential':'Entre pelo método usado no cadastro desta conta.',
    'auth/unauthorized-domain':'O acesso ainda não foi habilitado neste endereço.',
    'auth/operation-not-allowed':'Esta forma de entrada ainda não está disponível.',
    'auth/user-disabled':'Esta conta está desativada. Entre em contato com o suporte.',
    'auth/requires-recent-login':'Entre novamente na sua conta para concluir essa ação.',
    'permission-denied':'Não foi possível acessar os dados da sua conta. Entre novamente ou fale com o suporte.',
    'unavailable':'Sem conexão com o servidor. Suas alterações pendentes continuam neste navegador.',
    'data/conflict':'Sua conta foi atualizada em outro acesso. Baixe as alterações pendentes antes de carregar os dados mais recentes.',
    'data/deletion-incomplete':'A exclusão não terminou. Tente continuar a exclusão para remover os registros restantes e o acesso.',
    'data/month-too-large':'Este mês atingiu o limite de armazenamento. Exporte seus registros e entre em contato com o suporte.',
    'app/not-configured':'Estamos preparando o acesso. Tente novamente mais tarde.'
  })[code] || 'Não foi possível concluir. Tente novamente em alguns instantes.';
}
