import {emptyState,hasAcceptedTerms,TERMS_VERSION,authError} from './data-model.js';
import {connectFirebase} from './firebase-service.js';
import {AccountSession} from './account-session.js';
import {legalDocument} from './legal-documents.js';

'use strict';
const paths={money:'<path d="M12 2.5v19"/><path d="M16.8 6H9.9a3.1 3.1 0 0 0 0 6.2h4.2a3.1 3.1 0 0 1 0 6.2H6.8"/>',wheel:'<circle cx="12" cy="12" r="8.8"/><circle cx="12" cy="12" r="3.1"/><path d="M3.2 12h5.7M15.1 12h5.7M12 15.1v5.7"/>',trash:'<path d="M4 7h16"/><path d="M6.5 7 7.5 20h9l1-13"/><path d="M9.5 7V4h5v3M10 11v6M14 11v6"/>',receipt:'<path d="M6 3h12v18l-3-2-3 2-3-2-3 2z"/><path d="M9 8h6M9 12h6"/>',share:'<path d="M12 3v12M8.5 6.5 12 3l3.5 3.5"/><path d="M5 13v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6"/>',copy:'<rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h8"/>',chat:'<path d="M21 11.5a8.5 8.5 0 0 1-12.6 7.4L3 21l2.1-5.4A8.5 8.5 0 1 1 21 11.5Z"/>',bolt:'<path d="M13 3 5 13.5h5.2L9 21l8-10.5h-5.2L13 3Z"/>',battery:'<rect x="2" y="7" width="15" height="10" rx="2.5"/><path d="M20 10.5v3M6 12h7"/>',refresh:'<path d="M20.5 12a8.5 8.5 0 1 1-2.6-6.1"/><path d="M20.6 4.2v4.6H16"/>',grid:'<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>',route:'<circle cx="5" cy="5" r="2"/><circle cx="19" cy="19" r="2"/><path d="M7 5h9a4 4 0 0 1 0 8H8a3 3 0 0 0 0 6h9"/>',wallet:'<path d="M20 8V5a2 2 0 0 0-2-2H5a3 3 0 0 0 0 6h15v11H5a3 3 0 0 1-3-3V6M20 12h-5v5h5M16 14.5h.1"/>',car:'<path d="M5 9l2-5h10l2 5M3 11l2-2h14l2 2v7H3zM5 18v2M19 18v2M6 13h2M16 13h2M3 16h18"/>',chart:'<path d="M4 3v17h17M8 15v-4M13 15V7M18 15V4"/>',plus:'<path d="M12 5v14M5 12h14"/>',arrowup:'<path d="M7 17L17 7M7 7h10v10"/>',arrowdown:'<path d="M7 7l10 10M7 17h10V7"/>',chevron:'<path d="M9 5l7 7-7 7"/>',clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',user:'<circle cx="12" cy="8" r="3.8"/><path d="M4.5 20.5a7.5 7.5 0 0 1 15 0"/>',gear:'<circle cx="12" cy="12" r="3.2"/><path d="M19.2 14.6a1.6 1.6 0 0 0 .32 1.77l.06.06a1.94 1.94 0 1 1-2.74 2.74l-.06-.06a1.6 1.6 0 0 0-1.77-.32 1.6 1.6 0 0 0-.97 1.47v.17a1.94 1.94 0 1 1-3.88 0v-.09a1.6 1.6 0 0 0-1.05-1.46 1.6 1.6 0 0 0-1.77.32l-.06.06a1.94 1.94 0 1 1-2.74-2.74l.06-.06a1.6 1.6 0 0 0 .32-1.77 1.6 1.6 0 0 0-1.47-.97H3.2a1.94 1.94 0 1 1 0-3.88h.09a1.6 1.6 0 0 0 1.46-1.05 1.6 1.6 0 0 0-.32-1.77l-.06-.06a1.94 1.94 0 1 1 2.74-2.74l.06.06a1.6 1.6 0 0 0 1.77.32h.08a1.6 1.6 0 0 0 .97-1.47V3.2a1.94 1.94 0 1 1 3.88 0v.09a1.6 1.6 0 0 0 .97 1.47 1.6 1.6 0 0 0 1.77-.32l.06-.06a1.94 1.94 0 1 1 2.74 2.74l-.06.06a1.6 1.6 0 0 0-.32 1.77v.08a1.6 1.6 0 0 0 1.47.97h.17a1.94 1.94 0 1 1 0 3.88h-.09a1.6 1.6 0 0 0-1.46.97z"/>',play:'<path d="M8 4l12 8-12 8z"/>',pause:'<rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/>',stop:'<rect x="5" y="5" width="14" height="14" rx="2"/>',flag:'<path d="M5 21V4m0 1c5-6 9 5 15 0v10c-6 5-10-6-15 0"/>',edit:'<path d="M14 5l5 5M4 20l5-1L20 8a3.5 3.5 0 0 0-5-5L4 14z"/>',tool:'<path d="M14 6a5 5 0 0 0-6 6l-5 5a2.8 2.8 0 0 0 4 4l5-5a5 5 0 0 0 6-6l-3 3-4-4z"/>',drop:'<path d="M12 3s-7 8-7 12a7 7 0 0 0 14 0c0-4-7-12-7-12z"/>',check:'<path d="M5 12l4 4L19 6"/>',info:'<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7h.01"/>',close:'<path d="M6 6l12 12M6 18L18 6"/>',fuel:'<path d="M3 21V4h11v17M1 21h15M3 10h11M14 11h2a2 2 0 0 1 2 2v4a2 2 0 0 0 4 0V8l-4-4M19 5v4h3"/>',calendar:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 3v4M17 3v4M3 11h18M7 15h2M15 15h2"/>',filter:'<path d="M3 5h18M6 12h12M10 19h4"/>',road:'<path d="M6 3L2 21M18 3l4 18M12 3v3M12 10v4M12 18v3"/>'};
const icon=n=>`<svg viewBox="0 0 24 24" aria-hidden="true">${paths[n]||paths.grid}</svg>`;
function hydrateIcons(root=document){root.querySelectorAll('[data-icon]').forEach(el=>el.innerHTML=icon(el.dataset.icon));}
const $=id=>document.getElementById(id);
const money=n=>Number(n).toLocaleString('pt-BR',{style:'currency',currency:'BRL'});
const number=n=>Number(n).toLocaleString('pt-BR',{maximumFractionDigits:1});
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function localDate(d=new Date()){return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;}
const dateAt=delta=>{const d=new Date();d.setDate(d.getDate()+delta);return localDate(d);};
const prettyDate=d=>new Date(d+'T12:00:00').toLocaleDateString('pt-BR',{day:'2-digit',month:'2-digit',year:'numeric'});
const shortDate=d=>d===localDate()?'Hoje':new Date(d+'T12:00:00').toLocaleDateString('pt-BR',{day:'2-digit',month:'2-digit'});
const uid=()=>globalThis.crypto?.randomUUID?.()||Date.now().toString(36)+Math.random().toString(36).slice(2);
const DEFAULT_PLATFORMS=['Uber','99','Particular'];
const platformList=()=>Array.isArray(state.platforms)&&state.platforms.length?state.platforms:DEFAULT_PLATFORMS.slice();
let state=emptyState(),cloud=null,session=null,bootError=null,authBusy=false;
let consentRecord=null,consentPending=false;
const hasConsent=()=>hasAcceptedTerms(consentRecord);
let view='inicio',period='today',rideFilter='Todas',expenseFilter='Todas',toastTimer;
const navigation=[['inicio','Início','grid'],['corridas','Corridas','route'],['financeiro','Financeiro','money'],['carro','Meu carro','wheel']];
/* telas que não ficam na barra de baixo: abrem a partir da tela-mãe */
const SUBVIEWS={'config':{label:'Configurações',back:'inicio'},
 'config-plano':{label:'Escolha seu plano',back:'config'},
 'config-conta':{label:'Conta e dados',back:'config'},
 'config-suporte':{label:'Falar com o suporte',back:'config'},
 'corridas-jornadas':{label:'Jornadas',parent:'corridas'},
 'corridas-historico':{label:'Histórico de Corridas',parent:'corridas'},
 'carro-manutencao':{label:'Painel de Manutenção',parent:'carro'},
 'carro-manutencoes':{label:'Adicionar Manutenção',parent:'carro'},
 'corridas-comprovante':{label:'Gerar Comprovante',parent:'corridas'},
 'corridas-comprovantes':{label:'Comprovantes gerados',parent:'corridas',back:'corridas-comprovante'},
 'financeiro-historico':{label:'Histórico de Gastos',parent:'financeiro'},
 'financeiro-relatorios':{label:'Relatórios',parent:'financeiro'}};
function selectedDate(date,p=period){if(date>localDate())return false;if(p==='today')return date===localDate();if(p==='week')return date>=dateAt(-6);return date.slice(0,7)===localDate().slice(0,7);}
function totals(p=period){const rides=state.rides.filter(r=>selectedDate(r.date,p)),expenses=state.expenses.filter(e=>selectedDate(e.date,p)),shifts=state.shifts.filter(s=>selectedDate(s.date,p));const revenue=rides.reduce((a,r)=>a+r.amount,0),cost=expenses.reduce((a,e)=>a+e.amount,0),km=shifts.reduce((a,s)=>a+s.endKm-s.startKm,0)+(state.activeShift&&selectedDate(state.activeShift.date,p)?journeyKm(state.activeShift):0);let minutes=shifts.reduce((a,s)=>a+s.minutes,0);if(state.activeShift&&selectedDate(state.activeShift.date,p))minutes+=shiftMinutes(state.activeShift);return{rides,expenses,revenue,cost,balance:revenue-cost,km,minutes};}
const hours=m=>`${Math.floor(m/60)}h${String(Math.floor(m%60)).padStart(2,'0')}`;
/* Uma jornada por dia: a data é o que liga a corrida à jornada dela, sem
   precisar carimbar cada lançamento. */
const journeyRides=j=>j?state.rides.filter(r=>r.date===j.date).sort((a,b)=>(b.date+b.time).localeCompare(a.date+a.time)):[];
/* A jornada é do dia: nada do relógio passa da meia-noite dela. O fim é a
   meia-noite seguinte, montada pelo calendário em vez de somar 24 horas, que
   erraria num dia de mudança de horário. */
const dayEnd=date=>{const d=new Date(date+'T00:00:00');d.setDate(d.getDate()+1);return d.getTime();};
/* O tempo é o que já foi contado mais o trecho que está correndo agora. Em
   pausa, runningSince é nulo e o relógio simplesmente não anda — por isso dá
   para pausar e voltar quantas vezes quiser sem inflar o total. */
const shiftMinutes=(j,ate=Date.now())=>Math.max(0,(j.worked||0)+(j.runningSince?Math.max(0,Math.min(ate,dayEnd(j.date))-j.runningSince)/60000:0));
const journeyMinutes=j=>j.minutes!=null?j.minutes:shiftMinutes(j);
const journeyKm=j=>j.endKm!=null?j.endKm-j.startKm:Math.max(0,state.km-j.startKm);
/* Encerrar não é o fim do dia: a jornada de hoje continua sendo a jornada de
   hoje, e dá para retomá-la quantas vezes quiser. O que fecha de vez é a
   virada da meia-noite — aí ela vai para a lista e não se mexe mais. */
const journeyLive=j=>!!state.activeShift&&j===state.activeShift;
const journeyOpen=j=>journeyLive(j)&&j.endKm==null;
const journeyRunning=j=>journeyOpen(j)&&!!j.runningSince;
const journeyPaused=j=>journeyOpen(j)&&!j.runningSince;
const journeyEnded=j=>journeyLive(j)&&j.endKm!=null;
/* Ninguém precisa lembrar de encerrar: ao virar o dia a jornada é guardada de
   vez — com o tempo contado até a meia-noite, se ela ainda estava correndo. */
function closeStaleShift(){
 const a=state.activeShift;
 if(!a||a.date===localDate())return false;
 const encerrada=a.endKm!=null;
 const fim=encerrada?a.endKm:Math.max(a.startKm,state.km);
 state.shifts.push({id:a.id,date:a.date,startKm:a.startKm,
  endKm:fim,
  minutes:encerrada?(a.worked||0):shiftMinutes(a,dayEnd(a.date)),
  auto:!encerrada});
 state.activeShift=null;
 /* Quem estava rodando na virada não teve como dar a leitura final: o app
    fecha com o último km que conhece e guarda o pedido para perguntar. Quem
    já tinha encerrado deu a leitura dele; aí não há o que perguntar. */
 if(!encerrada)state.askKm={id:a.id,date:a.date,startKm:a.startKm,km:fim};
 /* quem encerrou já sabe que encerrou; o aviso é para quem esqueceu */
 return encerrada?'fim':'auto';
}
let journeysOpen=null,journeyMonthsOpen=null;
/* Os anos que dá para escolher: os que têm lançamento, mais o ano corrente —
   que entra sozinho quando o ano vira, sem ninguém precisar cadastrar nada. */
const yearsOf=datas=>[...new Set([...datas.map(d=>Number(String(d).slice(0,4))),new Date().getFullYear()])].sort((a,b)=>b-a);
const yearSelect=(id,anos,atual)=>`<select id="${id}" aria-label="Escolher o ano">${anos.map(a=>`<option ${a===atual?'selected':''}>${a}</option>`).join('')}</select>`;
const monthLabel=mes=>new Date(Number(mes.slice(0,4)),Number(mes.slice(5,7))-1,1).toLocaleDateString('pt-BR',{month:'short'}).replace('.','')+'/'+mes.slice(0,4);
const dayLabel=date=>date.slice(8,10)+'/'+date.slice(5,7);
/* "Qui · 02/10": o dia da semana ajuda a reconhecer o dia sem ocupar a linha
   (a maiúscula vem do capitalize da própria caixa). */
const dayHead=date=>new Date(date+'T12:00:00').toLocaleDateString('pt-BR',{weekday:'short'}).replace('.','')+' · '+dayLabel(date);
/* As listas já vêm da mais recente para a mais antiga, então juntar as vizinhas
   do mesmo dia basta: a ordem dos dias sai certa sozinha. */
function byDay(itens){const dias=[];for(const x of itens){const u=dias[dias.length-1];if(u&&u[0]===x.date)u[1].push(x);else dias.push([x.date,[x]]);}return dias;}
function toggleJourneyMonth(mes){
 if(journeyMonthsOpen===null)journeyMonthsOpen=new Set();
 journeyMonthsOpen.has(mes)?journeyMonthsOpen.delete(mes):journeyMonthsOpen.add(mes);
 render();
}
function toggleJourney(date){
 if(journeysOpen===null)journeysOpen=new Set();
 journeysOpen.has(date)?journeysOpen.delete(date):journeysOpen.add(date);
 render();
}
/* Cores fixas por nome: a mesma plataforma sai sempre com o mesmo crachá. */
const PLATFORM_COLORS=[['#23405c','#cfe6ff'],['#3f3057','#e3d0ff'],['#1e4a3f','#c7f3d9'],['#54402a','#ffe0c2'],['#4f2b36','#ffd2dd'],['#3a4522','#e2f3bd']];
function platformInitials(name){
 const parts=String(name).trim().split(/\s+/).filter(Boolean);
 if(!parts.length)return '?';
 if(/^[0-9]/.test(parts[0]))return parts[0].slice(0,2);
 return (parts.length>1?parts[0][0]+parts[1][0]:parts[0].slice(0,2)).toUpperCase();
}
function platformHash(name){let h=0;for(const ch of String(name))h=(h*31+ch.codePointAt(0))>>>0;return h;}
const platformLogo=p=>{
 if(p==='99')return '<div class="platform-logo n99" aria-hidden="true">99</div>';
 if(p==='Particular')return '<div class="platform-logo particular" aria-hidden="true">P</div>';
 if(p==='Uber')return '<div class="platform-logo" aria-hidden="true">U</div>';
 const [bg,fg]=PLATFORM_COLORS[platformHash(p)%PLATFORM_COLORS.length];
 return `<div class="platform-logo custom" style="background:${bg};color:${fg}" aria-hidden="true">${esc(platformInitials(p))}</div>`;
};
function formError(msg){if($('form-error'))$('form-error').textContent=msg;}
function platformsBody(){
 const list=platformList();
 return `<p class="dialog-intro">Acrescente as plataformas que rodam na sua cidade. Elas passam a aparecer ao registrar uma corrida, no filtro do histórico e nos relatórios.</p>
 <div class="platform-list">${list.map(name=>{
  const rides=state.rides.filter(r=>r.platform===name).length;
  return `<div class="platform-row">${platformLogo(name)}<div class="platform-row-name"><strong>${esc(name)}</strong><span class="small muted">${rides?`${rides} ${rides===1?'corrida registrada':'corridas registradas'}`:'sem corridas ainda'}</span></div>${list.length>1?`<button type="button" class="icon-btn" data-platform-remove="${esc(name)}" aria-label="Remover ${esc(name)}">${icon('close')}</button>`:''}</div>`;
 }).join('')}</div>
 <p class="dialog-intro">Não achou a sua na lista? Acrescente abaixo.</p>
 <form id="platform-form"><div class="form-grid">${field('Nome da plataforma','name','text','','required maxlength="24" placeholder="Ex.: DriveIn" autocomplete="off"',true)}</div><p class="form-error" id="form-error" role="alert"></p><div class="form-actions"><button type="button" class="btn secondary" data-action="close">Fechar</button><button type="submit" class="btn primary">Adicionar</button></div></form>`;
}
function showPlatforms(){openDialog('Plataformas de corrida',platformsBody());}
function repaintPlatforms(){$('dialog-body').innerHTML=platformsBody();}
/* Remover uma plataforma que já tem corridas deixaria esses lançamentos órfãos
   no filtro e nos relatórios, então isso fica bloqueado enquanto houver alguma. */
function removePlatform(name){
 const list=platformList();
 if(list.length<=1)return formError('Deixe ao menos uma plataforma na lista.');
 const rides=state.rides.filter(r=>r.platform===name).length;
 if(rides)return formError(`${name} tem ${rides} ${rides===1?'corrida registrada':'corridas registradas'}. Apague ou mude essas corridas antes de remover a plataforma.`);
 state.platforms=list.filter(p=>p!==name);
 if(rideFilter===name)rideFilter='Todas';
 save();repaintPlatforms();render();toast(`${name} saiu das suas plataformas.`);
}
function title(heading,subtitle,buttons=''){return `<div class="page-title centered"><div><p class="eyebrow">${view==='inicio'?new Date().toLocaleDateString('pt-BR',{weekday:'long',day:'numeric',month:'long'}):'SEU ESPAÇO AO VOLANTE'}</p><h1>${heading}</h1><p class="subtitle">${subtitle}</p></div>${buttons?`<div class="actions">${buttons}</div>`:''}</div>`;}
function button(label,action,ic='plus',cls='primary'){return `<button class="btn ${cls}" data-action="${action}">${icon(ic)}${label}</button>`;}
function periodButtons(){return `<div class="period" role="group" aria-label="Período"><button data-period="today" class="${period==='today'?'active':''}" aria-pressed="${period==='today'}">Hoje</button><button data-period="week" class="${period==='week'?'active':''}" aria-pressed="${period==='week'}">7 dias</button><button data-period="month" class="${period==='month'?'active':''}" aria-pressed="${period==='month'}">Mês</button></div>`;}
function status(s){const days=s.nextDate?Math.ceil((new Date(s.nextDate+'T12:00:00')-new Date(localDate()+'T12:00:00'))/86400000):null;const km=s.nextKm==null?null:s.nextKm-state.km;if(km===null&&days===null)return{cls:'none',label:'Sem registro',detail:'Informe a última revisão e o próximo prazo.',rank:0};if(km!==null&&km<=0||days!==null&&days<=0)return{cls:'bad',label:'Vencido',detail:km!==null&&km<=0?km===0?'Revisão prevista para a quilometragem atual.':`Passou ${number(-km)} km do prazo.`:days===0?'Revisão prevista para hoje.':`Passou ${-days} dias do prazo.`,rank:3};if(km!==null&&km<=1000||days!==null&&days<=30)return{cls:'warn',label:'Próximo',detail:km!==null&&km<=1000?`Faltam ${number(km)} km para a revisão.`:`Faltam ${days} dias para a revisão.`,rank:2};return{cls:'ok',label:'Em dia',detail:km!==null?`Faltam ${number(km)} km para a revisão.`:`Faltam ${days} dias para a revisão.`,rank:1};}
function tag(s){return `<span class="tag ${s.cls}">${s.label}</span>`;}
function home(){
/* O Início mostra o dia, sempre: sem seletor, o período não vale aqui. */
 const t=totals('today'),todayR=state.rides.filter(r=>r.date===localDate()).reduce((a,r)=>a+r.amount,0),todayC=state.expenses.filter(e=>e.date===localDate()).reduce((a,e)=>a+e.amount,0),balance=todayR-todayC,pct=Math.min(100,Math.max(0,balance/state.goal*100)),remaining=Math.max(0,state.goal-balance);
 const services=[...state.services].sort((a,b)=>status(b).rank-status(a).rank).slice(0,3);
 const jor=state.activeShift;
 return title('Seu dia, em números.','Mais clareza para cada quilômetro.',button('Adicionar gasto','expense','plus','secondary')+button('Nova corrida','ride'))+
 (!state.vehicle&&state.vehicleNudge!=='off'?`<section class="panel nudge"><div class="nudge-copy"><h3>Cadastre seu carro — se quiser</h3></div><div class="car-actions">${button('Cadastrar carro','addVehicle','plus')}${button('Agora não','dismissNudge','close','quiet')}</div></section>`:'')+
 `<div class="section-row"><span class="caption">Visão geral</span></div>
 <div class="overview-top"><section class="panel balance"><div><div class="balance-top"><span>Seu resultado hoje</span>${icon('arrowup')}</div><div class="balance-number mono"><span class="currency">R$</span>${numberBR(t.balance)}</div></div><div class="balance-breakdown"><div><span class="circle-icon">${icon('arrowup')}</span><div><p>Ganhos</p><strong class="mono">${money(t.revenue)}</strong></div></div><div><span class="circle-icon">${icon('arrowdown')}</span><div><p>Gastos</p><strong class="mono">${money(t.cost)}</strong></div></div></div></section>
 <section class="panel panel-pad goal-card"><button class="icon-btn goal-edit" data-action="goal" aria-label="Editar meta diária">${icon('edit')}</button><div class="goal-body"><div class="goal-ring-col"><h2>Meta do dia</h2><div class="goal-ring" role="img" aria-label="${Math.min(balance>=state.goal?100:99,Math.round(pct))}% da meta diária"><svg viewBox="0 0 120 120"><circle cx="60" cy="60" r="50" stroke="#35412e"/><circle cx="60" cy="60" r="50" stroke="var(--lime)" stroke-dasharray="${pct*3.14159} 314.159"/></svg><div class="ring-value"><strong class="mono">${Math.min(balance>=state.goal?100:99,Math.round(pct))}%</strong><span>concluído</span></div></div></div><div class="goal-copy"><p>Objetivo de resultado</p><strong class="mono">${money(state.goal)}</strong><p>${remaining>0?`Faltam <span class="positive">${money(remaining)}</span><br>para chegar lá.`:'<span class="positive">Meta alcançada!</span><br>Seu trabalho rendeu.'}</p></div></div><div class="goal-foot">${icon('flag')}A meta considera os gastos de hoje.</div></section></div>
 <section class="panel journey"><div class="journey-label"><span class="square-icon">${icon('clock')}</span><div><h3>Sua Jornada</h3><p>${!jor?'Resumo de hoje':journeyRunning(jor)?'Em andamento':journeyEnded(jor)?'Encerrada — dá para continuar hoje':'Em pausa'}</p></div></div><div class="journey-values"><div class="metric"><small>Tempo</small><strong class="mono">${hours(t.minutes)}</strong></div><div class="metric"><small>Distância</small><strong class="mono">${number(t.km)} <span>km</span></strong></div><div class="metric"><small>Resultado/h</small><strong class="mono">${t.minutes>0?money(t.balance/(t.minutes/60)):'—'}</strong></div></div><div class="journey-actions">${!jor?button('Iniciar jornada','startShift','play','secondary small-btn')
  :journeyEnded(jor)?button('Continuar jornada','reopenShift','play','secondary small-btn')
  :journeyRunning(jor)?button('Pausar','pauseShift','pause','secondary small-btn')+button('Encerrar','endShift','stop','secondary small-btn')
  :button('Continuar','resumeShift','play','secondary small-btn')+button('Encerrar','endShift','stop','secondary small-btn')}</div></section>
 <div class="dashboard-bottom"><section class="panel panel-pad"><div class="card-heading"><h2>Próximas Revisões</h2><span class="muted">${icon('tool')}</span></div>${services.map(s=>`<div class="service-mini"><div class="service-mini-head"><h3>${esc(s.name)}</h3>${tag(status(s))}</div><p>${status(s).detail}</p></div>`).join('')}<button class="btn quiet" style="margin-top:8px;font-size:13px" data-view="carro">Acompanhar meu carro ${icon('chevron')}</button></section></div>`;
}
const numberBR=n=>Number(n).toLocaleString('pt-BR',{minimumFractionDigits:2,maximumFractionDigits:2});
/* R$ 10.120,00 não cabe no mesmo corpo que R$ 46,06: o tamanho cai por faixa
   de comprimento, senão o valor vaza para fora do card. */
const valueSize=v=>{const n=String(v).length;return n>12?' vlong':n>9?' vmed':'';};
function summaryCard(label,value,note='',color=''){return `<div class="panel summary-card"><p>${label}</p><strong class="mono ${color}${valueSize(value)}">${value}</strong>${note?`<small>${note}</small>`:''}</div>`;}
function ridesPage(){const t=totals();return title('Cada corrida conta.','Seus ganhos, organizados em um só lugar.',button('Plataformas','platforms','plus','secondary')+button('Nova corrida','ride'))+`<div class="section-row"><span class="caption">Resumo de corridas</span>${periodButtons()}</div><div class="summary-grid centered">${summaryCard('Total recebido',money(t.revenue),'','positive')}${summaryCard('Corridas registradas',t.rides.length)}${summaryCard('Média por corrida',money(t.rides.length?t.revenue/t.rides.length:0))}</div><button class="btn secondary page-link" data-view="corridas-historico">${icon('calendar')}Histórico de Corridas${icon('chevron')}</button><button class="btn secondary page-link" ${temPremium()?'data-view="corridas-comprovante"':'data-action="premiumAviso"'}>${icon('receipt')}Gerar Comprovante${temPremium()?'':'<span class="page-note">Plano pago</span>'}${icon('chevron')}</button>`;}
const categories=['Combustível','Recarga elétrica','Alimentação','Manutenção','Estacionamento','Pedágio','Lavagem','Aluguel','Outros'];
function financePage(){const t=totals(),fuel=t.expenses.filter(e=>e.category==='Combustível'||e.category==='Recarga elétrica').reduce((a,e)=>a+e.amount,0);return title('Seu dinheiro em ordem.','Entenda para onde vai o dinheiro do seu trabalho.',button('Adicionar gasto','expense'))+`<div class="section-row"><span class="caption accent">Resumo de gastos</span>${periodButtons()}</div><div class="summary-grid centered">${summaryCard('Gastos registrados',money(t.cost),'','negative')}${summaryCard(isElectric()?'Recarga elétrica':'Combustível e recarga',money(fuel))}${summaryCard('Gasto por km',t.km?money(t.cost/t.km):'—')}</div><button class="btn secondary page-link" data-view="financeiro-historico">${icon('calendar')}Histórico de Gastos${icon('chevron')}</button><button class="btn secondary page-link" data-view="financeiro-relatorios">${icon('chart')}Relatórios${icon('chevron')}</button>`;}
/* ===== Histórico de Gastos =====
   Tela própria, com um ano por vez e cada mês numa caixa que abre e fecha —
   assim uma lista longa não empurra o resto da tela de Gastos para baixo. */
let historyYear=new Date().getFullYear(),historyOpen=null,expenseDaysOpen=null;
let journeyYear=new Date().getFullYear(),maintenanceYear=new Date().getFullYear(),maintenanceMonthsOpen=null,maintenanceOpen=null;
const monthName=(y,m)=>new Date(y,m,1).toLocaleDateString('pt-BR',{month:'long'});
const expenseYearList=()=>state.expenses.filter(e=>Number(e.date.slice(0,4))===historyYear&&(expenseFilter==='Todas'||e.category===expenseFilter))
 .sort((a,b)=>b.date.localeCompare(a.date));
function toggleHistoryMonth(m){
 if(historyOpen===null)historyOpen=new Set();
 if(expenseDaysOpen===null)expenseDaysOpen=new Set();
 if(historyOpen.has(m))historyOpen.delete(m);
 else{historyOpen.add(m);abrirDiaDoMes(expenseYearList(),m,expenseDaysOpen);}
 render();
}
function toggleExpenseDay(d){
 if(expenseDaysOpen===null)expenseDaysOpen=new Set();
 expenseDaysOpen.has(d)?expenseDaysOpen.delete(d):expenseDaysOpen.add(d);
 render();
}
function expenseHistoryPage(){
 /* O ano corrente entra sempre na lista, tenha lançamento ou não: assim que
    vira o ano, 2027 aparece sozinho, depois 2028, e por aí vai. */
 const anos=yearsOf(state.expenses.map(e=>e.date));
 if(!anos.includes(historyYear))historyYear=anos[0];
 const doAno=expenseYearList();
 const meses=[...new Set(doAno.map(e=>Number(e.date.slice(5,7))-1))].sort((a,b)=>b-a);
 if(historyOpen===null)historyOpen=new Set(meses.length?[meses[0]]:[]);
 if(expenseDaysOpen===null)expenseDaysOpen=new Set(doAno.length?[doAno[0].date]:[]);
 const total=doAno.reduce((a,e)=>a+e.amount,0);
 return title('Histórico de Gastos','Escolha o ano e abra o mês que quiser conferir.')+
 `<div class="list-toolbar history-bar"><h2 class="accent">Lançamentos</h2>${yearSelect('history-year',anos,historyYear)}<select id="expense-filter" aria-label="Filtrar gastos por categoria">${['Todas',...categories].map(x=>`<option ${expenseFilter===x?'selected':''}>${esc(x)}</option>`).join('')}</select></div>
 <div class="history-total"><span>Total no ano${expenseFilter==='Todas'?'':' · '+esc(expenseFilter)}</span><strong class="mono negative">${money(total)}</strong></div>
 ${meses.length?meses.map(m=>{
  const itens=doAno.filter(e=>Number(e.date.slice(5,7))-1===m),soma=itens.reduce((a,e)=>a+e.amount,0),aberto=historyOpen.has(m);
  return `<div class="fold-box ${aberto?'open':''}"><button type="button" class="fold-head" data-month="${m}" aria-expanded="${aberto}">
   <span class="fold-chevron">${icon('chevron')}</span>
   <span class="fold-name"><strong>${monthName(historyYear,m)}</strong><small>${itens.length} ${itens.length===1?'lançamento':'lançamentos'}</small></span>
   <span class="fold-total mono">${money(soma)}</span></button>
   ${aberto?`<div class="fold-body">${byDay(itens).map(([dia,doDia])=>{
    const somaDia=doDia.reduce((a,e)=>a+e.amount,0),abertoDia=expenseDaysOpen.has(dia);
    return `<div class="fold-box ${abertoDia?'open':''}"><button type="button" class="fold-head" data-expense-day="${esc(dia)}" aria-expanded="${abertoDia}">
     <span class="fold-chevron">${icon('chevron')}</span>
     <span class="fold-name"><strong>${dayHead(dia)}</strong><small>${doDia.length} ${doDia.length===1?'lançamento':'lançamentos'}</small></span>
     <span class="fold-total mono">${money(somaDia)}</span></button>
     ${abertoDia?`<div class="fold-body">${doDia.map(e=>`<div class="fold-row"><strong>${esc(e.description||e.category)}</strong><span class="mono">${money(e.amount)}</span></div>`).join('')}</div>`:''}</div>`;
   }).join('')}</div>`:''}</div>`;
 }).join(''):`<p class="empty">Nenhum gasto ${expenseFilter==='Todas'?'':'de '+esc(expenseFilter)+' '}em ${historyYear}.</p>`}`;
}
function escolherPlano(id){if(id!=='gratis')toast('As assinaturas ainda estão em preparação. Nenhuma cobrança foi feita.');}
/* ===== Configurações =====
   Plano, conta e suporte. O e-mail do suporte fica nesta constante: é uma linha
   só para trocar quando o endereço de verdade existir. */
const SUPORTE_EMAIL='lucroindrive@gmail.com';
const PREMIUM=['Gerar Comprovante, e o botão de comprovante no Histórico de Corridas','Consulta à Tabela FIPE','Sem anúncios'];
const PLANOS=[
 ['gratis','Grátis','R$ 0','',['Corridas, gastos e jornadas','Painel de manutenção e manutenções avulsas','Histórico e relatórios']],
 ['mensal','Mensal','R$ 14,99','',['Tudo o que o Grátis tem',...PREMIUM]],
 ['anual','Anual','R$ 99,99','Economize R$ 79,89 em relação a doze meses do plano mensal.',['Tudo o que o Grátis tem',...PREMIUM]]
];
/* O premium libera o comprovante e a FIPE. Quem está no Grátis continua vendo
   os dois caminhos — escondê-los faria o recurso sumir sem explicação —, só que
   eles levam aos planos em vez de abrir. */
const temPremium=()=>state.plan!=='gratis';
function settingsPage(){
 const atual=(PLANOS.find(([id])=>id===state.plan)||PLANOS[0])[1];
 const conta=state.account&&state.account.email;
 return title('Configurações','Plano, conta e suporte.')+
 `<button class="btn secondary page-link" data-view="config-plano">${icon('bolt')}Escolha seu plano<span class="page-note">${esc(atual)}</span>${icon('chevron')}</button>
 <button class="btn secondary page-link" data-view="config-conta">${icon('user')}Conta e dados${icon('chevron')}</button>
 <button class="btn secondary page-link" data-view="config-suporte">${icon('chat')}Falar com o suporte${icon('chevron')}</button>`;
}
function planPage(){
 return title('Escolha seu plano','O plano marcado é o que está em uso.')+
 `<div class="plan-list">${PLANOS.map(([id,nome,preco,extra,itens])=>{
  const atual=state.plan===id;
  return `<button type="button" class="panel plan-card ${atual?'atual':''}" data-plan="${id}" aria-pressed="${atual}">
   <span class="plan-top"><strong>${nome}</strong>${atual?'<span class="tag ok">Seu plano</span>':''}</span>
   <span class="plan-price mono">${preco}</span>
   ${extra?`<small class="plan-extra">${extra}</small>`:''}
   <span class="plan-itens">${itens.map(x=>`<span>${icon('check')}${esc(x)}</span>`).join('')}</span></button>`;
 }).join('')}</div>
 <p class="small muted center-text plan-note">As assinaturas estão em preparação. Nesta versão, não há cobrança nem contratação de planos pagos.</p>`;
}
function accountPage(){
 const conta=state.account&&state.account.email;
 return title('Conta e dados','Onde fica a sua conta e como sair dela.')+
 `<div class="panel panel-pad config-box">
  <p class="small muted">Sua conta</p>
  <strong class="config-email">${conta?esc(conta):'Sua conta'}</strong>
  <p class="small muted" style="margin-top:6px">Registros vinculados à sua conta do LucroInDrive.</p><div class="config-actions">${button('Exportar meus dados','exportData','download','secondary')}</div>
  <div class="config-actions">${button('Sair da conta','logout','arrowup','secondary')}${button('Excluir a conta','askDeleteAccount','trash','quiet danger')}</div>
 </div>`;
}
function supportPage(){
 return title('Falar com o suporte','Escreva quando precisar.')+
 `<div class="panel panel-pad config-box">
  <p class="body-text">Dúvidas, erro no catálogo de motores ou sugestão?</p>
  <p class="body-text">Escreva para <a href="mailto:${SUPORTE_EMAIL}">${SUPORTE_EMAIL}</a>.</p>
  <p class="body-text">Se for erro de catálogo, conte a marca, o modelo, o ano e a motorização — ajuda a corrigir para todo mundo.</p>
 </div>`;
}
/* ===== Histórico de Corridas =====
   Mesmo molde do histórico de gastos: escolhe o ano, filtra pela plataforma e
   abre o mês. A diferença é o botão de comprovante em cada corrida. */
let rideYear=new Date().getFullYear(),rideHistoryOpen=null,rideDaysOpen=null;
/* a mesma lista que a tela usa, para o toque no mês saber quais são os dias */
const rideYearList=()=>state.rides.filter(r=>Number(r.date.slice(0,4))===rideYear&&(rideFilter==='Todas'||r.platform===rideFilter))
 .sort((a,b)=>(b.date+b.time).localeCompare(a.date+a.time));
/* Abrir um mês já mostra o dia mais recente dele: sem isso, abrir um mês antigo
   mostraria só nomes de dias e pediria um toque a mais para ver qualquer coisa.
   Se a pessoa já tinha um dia daquele mês aberto, a escolha dela fica. */
function abrirDiaDoMes(lista,mes,abertos){
 if([...abertos].some(d=>Number(d.slice(5,7))-1===mes))return;
 const x=lista.find(i=>Number(i.date.slice(5,7))-1===mes);
 if(x)abertos.add(x.date);
}
function toggleRideMonth(m){
 if(rideHistoryOpen===null)rideHistoryOpen=new Set();
 if(rideDaysOpen===null)rideDaysOpen=new Set();
 if(rideHistoryOpen.has(m))rideHistoryOpen.delete(m);
 else{rideHistoryOpen.add(m);abrirDiaDoMes(rideYearList(),m,rideDaysOpen);}
 render();
}
function toggleRideDay(d){
 if(rideDaysOpen===null)rideDaysOpen=new Set();
 rideDaysOpen.has(d)?rideDaysOpen.delete(d):rideDaysOpen.add(d);
 render();
}
function rideHistoryPage(){
 const anos=yearsOf(state.rides.map(r=>r.date));
 if(!anos.includes(rideYear))rideYear=anos[0];
 const doAno=rideYearList();
 const meses=[...new Set(doAno.map(r=>Number(r.date.slice(5,7))-1))].sort((a,b)=>b-a);
 if(rideHistoryOpen===null)rideHistoryOpen=new Set(meses.length?[meses[0]]:[]);
 if(rideDaysOpen===null)rideDaysOpen=new Set(doAno.length?[doAno[0].date]:[]);
 const total=doAno.reduce((a,r)=>a+r.amount,0);
 return title('Histórico de Corridas','Escolha o ano e abra o mês que quiser conferir.')+
 `<div class="list-toolbar history-bar"><h2 class="accent">Corridas</h2>${yearSelect('ride-year',anos,rideYear)}<select id="ride-filter" aria-label="Filtrar corridas por plataforma">${['Todas',...platformList()].map(x=>`<option ${rideFilter===x?'selected':''}>${esc(x)}</option>`).join('')}</select></div>
 <div class="history-total"><span>Total no ano${rideFilter==='Todas'?'':' · '+esc(rideFilter)}</span><strong class="mono positive">${money(total)}</strong></div>
 ${meses.length?meses.map(m=>{
  const itens=doAno.filter(r=>Number(r.date.slice(5,7))-1===m),soma=itens.reduce((a,r)=>a+r.amount,0),aberto=rideHistoryOpen.has(m);
  return `<div class="fold-box ${aberto?'open':''}"><button type="button" class="fold-head" data-ride-month="${m}" aria-expanded="${aberto}">
   <span class="fold-chevron">${icon('chevron')}</span>
   <span class="fold-name"><strong>${monthName(rideYear,m)}</strong><small>${itens.length} ${itens.length===1?'corrida':'corridas'}</small></span>
   <span class="fold-total mono">${money(soma)}</span></button>
   ${aberto?`<div class="fold-body">${byDay(itens).map(([dia,doDia])=>{
    const somaDia=doDia.reduce((a,r)=>a+r.amount,0),abertoDia=rideDaysOpen.has(dia);
    return `<div class="fold-box ${abertoDia?'open':''}"><button type="button" class="fold-head" data-ride-day="${esc(dia)}" aria-expanded="${abertoDia}">
     <span class="fold-chevron">${icon('chevron')}</span>
     <span class="fold-name"><strong>${dayHead(dia)}</strong><small>${doDia.length} ${doDia.length===1?'corrida':'corridas'}</small></span>
     <span class="fold-total mono">${money(somaDia)}</span></button>
     ${abertoDia?`<div class="fold-body">${doDia.map(r=>`<div class="fold-row"><span class="journey-ride">${platformLogo(r.platform)}<strong>${esc(r.platform)}</strong></span>
      <span class="ride-end"><span class="mono">${money(r.amount)}</span><button type="button" class="icon-btn ride-receipt" ${temPremium()?`data-ride-receipt="${esc(r.id)}"`:'data-action="premiumAviso"'} aria-label="Gerar Comprovante da corrida de ${money(r.amount)} na ${esc(r.platform)} em ${prettyDate(r.date)}">${icon('receipt')}</button></span></div>`).join('')}</div>`:''}</div>`;
   }).join('')}</div>`:''}</div>`;
 }).join(''):`<p class="empty">Nenhuma corrida ${rideFilter==='Todas'?'':'na '+esc(rideFilter)+' '}em ${rideYear}.</p>`}`;
}
/* O comprovante já nasce com o valor e a data da corrida; o trajeto é o que
   só o motorista sabe. */
function receiptFromRide(id){
 const r=state.rides.find(x=>x.id===id);
 if(!r)return;
 receiptDraft={...blankReceipt(),amount:String(r.amount),date:r.date};
 go('corridas-comprovante');
 toast('Valor e data da corrida preenchidos. Falta o trajeto.');
}
/* ===== Jornadas =====
   Um dia de trabalho por caixa, com as corridas registradas nele. */
function journeysPage(){
 const tudo=[...(state.activeShift?[state.activeShift]:[]),...state.shifts].sort((a,b)=>b.date.localeCompare(a.date));
 const anos=yearsOf(tudo.map(j=>j.date));
 if(!anos.includes(journeyYear))journeyYear=anos[0];
 const todas=tudo.filter(j=>Number(j.date.slice(0,4))===journeyYear);
 const meses=[...new Set(todas.map(j=>j.date.slice(0,7)))];
 if(journeyMonthsOpen===null)journeyMonthsOpen=new Set(meses.length?[meses[0]]:[]);
 if(journeysOpen===null)journeysOpen=new Set(todas.length?[todas[0].date]:[]);
 const ganhoAno=todas.reduce((a,j)=>a+journeyRides(j).reduce((x,r)=>x+r.amount,0),0);
 return title('Suas jornadas','Escolha o ano, abra o mês e depois o dia para ver as corridas.')+
 `<div class="list-toolbar centered"><h2 class="accent">Jornadas</h2><div class="toolbar-filters">${yearSelect('journey-year',anos,journeyYear)}</div></div>
 <div class="history-total"><span>Ganhos em ${journeyYear}</span><strong class="mono positive">${money(ganhoAno)}</strong></div>`+
 (meses.length?meses.map(mes=>{
  const doMes=todas.filter(j=>j.date.startsWith(mes));
  const ganhos=doMes.reduce((a,j)=>a+journeyRides(j).reduce((x,r)=>x+r.amount,0),0);
  const aberto=journeyMonthsOpen.has(mes);
  return `<div class="fold-box ${aberto?'open':''}"><button type="button" class="fold-head" data-journey-month="${esc(mes)}" aria-expanded="${aberto}">
   <span class="fold-chevron">${icon('chevron')}</span>
   <span class="fold-name"><strong>${monthLabel(mes)}</strong><small>${doMes.length} ${doMes.length===1?'jornada':'jornadas'}</small></span>
   <span class="fold-total mono">${money(ganhos)}</span></button>
   ${aberto?`<div class="fold-body">${doMes.map(journeyBox).join('')}</div>`:''}</div>`;
 }).join(''):`<p class="empty">Nenhuma jornada registrada em ${journeyYear}.</p>`);
}
function journeyBox(j){
 const corridas=journeyRides(j),ganhos=corridas.reduce((a,r)=>a+r.amount,0),aberta=journeysOpen.has(j.date);
 const marca=journeyRunning(j)?' <span class="tag ok">Em andamento</span>':journeyPaused(j)?' <span class="tag warn">Em pausa</span>':journeyEnded(j)?' <span class="tag none">Encerrada hoje</span>':j.auto?' <span class="tag none">Encerrada na virada do dia</span>':'';
 return `<div class="fold-box ${aberta?'open':''}"><button type="button" class="fold-head" data-journey="${esc(j.date)}" aria-expanded="${aberta}">
  <span class="fold-chevron">${icon('chevron')}</span>
  <span class="fold-name"><strong>Jornada ${dayLabel(j.date)}${marca}</strong>
  <small>${corridas.length} ${corridas.length===1?'corrida':'corridas'} · ${hours(journeyMinutes(j))} · ${number(journeyKm(j))} km</small></span>
  <span class="fold-total mono">${money(ganhos)}</span></button>
  ${aberta?`<div class="fold-body">${corridas.length?corridas.map(r=>`<div class="fold-row"><span class="journey-ride">${platformLogo(r.platform)}<strong>${esc(r.platform)}</strong></span><span class="mono">${money(r.amount)}</span></div>`).join(''):'<p class="empty">Nenhuma corrida registrada nesta jornada.</p>'}</div>`:''}</div>`;
}
/* ===== Comprovante de corrida =====
   O texto é fixo; o motorista preenche carro, trajeto, valor e data. O envio
   sai pelo compartilhamento do próprio aparelho — é dali que saem WhatsApp,
   Bluetooth e o resto —, com link do WhatsApp e cópia como alternativas. */
let receiptDraft=null,receiptsOpen=null;
function blankReceipt(){
 const v=state.vehicle;
 return {car:v?[vehicleName(v),v.plate?formatPlate(v.plate):null].filter(Boolean).join(' · '):'',
  from:'',to:'',amount:'',date:localDate()};
}
function receiptText(r){
 return ['COMPROVANTE DE CORRIDA','',
  `Data: ${prettyDate(r.date)}`,
  `Veículo: ${r.car||'—'}`,
  `Saída: ${r.from||'—'}`,
  `Chegada: ${r.to||'—'}`,
  `Valor pago: ${money(Number(r.amount)||0)}`,'',
  'Corrida realizada e paga. Obrigado pela preferência!',
  'Comprovante gerado no app LucroInDrive.'].join('\n');
}
function readReceiptDraft(){
 const el=$('receipt-form');
 if(!el||!receiptDraft)return;
 const d=new FormData(el);
 ['car','from','to','amount','date'].forEach(k=>{if(d.has(k))receiptDraft[k]=String(d.get(k));});
}
function receiptPage(){
 if(!temPremium())return title('Gerar Comprovante','Este recurso é dos planos Mensal e Anual.')+premiumBloco();
 if(!receiptDraft)receiptDraft=blankReceipt();
 const d=receiptDraft;
 return title('Gerar Comprovante','Preencha os dados da corrida e envie o comprovante para o passageiro.')+
 `<button class="btn secondary page-link" data-view="corridas-comprovantes">${icon('receipt')}Comprovantes gerados${icon('chevron')}</button>
 <form id="receipt-form"><div class="form-grid">
 ${field('Carro','car','text',d.car,'required maxlength="60" placeholder="Ex.: Hyundai HB20 · ABC-1234"',true)}
 ${field('Local de saída','from','text',d.from,'required maxlength="80" placeholder="Ex.: Rua das Flores, 120"',true)}
 ${field('Local de chegada','to','text',d.to,'required maxlength="80" placeholder="Ex.: Aeroporto, terminal 2"',true)}
 ${field('Valor pago (R$)','amount','number',d.amount,'required min="0.01" max="999999" step="0.01" inputmode="decimal" placeholder="0,00"')}
 ${field('Data','date','date',d.date,`required max="${localDate()}"`)}
 </div>
 <p class="caption accent" style="margin:22px 0 9px">Como o passageiro vai receber</p>
 <pre class="receipt-preview" id="receipt-preview">${esc(receiptText(d))}</pre>
 <p class="form-error" id="form-error" role="alert"></p>
 <div class="form-actions"><button type="submit" class="btn primary">${icon('receipt')}Gerar Comprovante</button></div></form>`;
}
/* O mesmo bloco serve ao comprovante e à FIPE: diz o que falta e leva aos planos. */
function premiumBloco(){
 return `<div class="panel panel-pad config-box center-text"><p class="body-text">No plano pago você gera comprovantes para o passageiro, consulta a Tabela FIPE e fica sem anúncios.</p>${button('Ver os planos','verPlanos','bolt')}</div>`;
}
function receiptsPage(){
 const todos=[...state.receipts].sort((a,b)=>(b.date+b.id).localeCompare(a.date+a.id));
 if(receiptsOpen===null)receiptsOpen=new Set(todos.length?[todos[0].id]:[]);
 return title('Comprovantes gerados','Seus comprovantes ficam guardados na sua conta.')+
 (todos.length?todos.map(r=>{
  const aberto=receiptsOpen.has(r.id);
  return `<div class="fold-box ${aberto?'open':''}"><div class="fold-top"><button type="button" class="fold-head" data-receipt="${esc(r.id)}" aria-expanded="${aberto}">
   <span class="fold-chevron">${icon('chevron')}</span>
   <span class="fold-name"><strong>${prettyDate(r.date)}</strong><small>${esc(r.from)} → ${esc(r.to)}</small></span>
   <span class="fold-total mono">${money(r.amount)}</span></button>
   <button type="button" class="icon-btn fold-del" data-receipt-remove="${esc(r.id)}" aria-label="Excluir o comprovante de ${prettyDate(r.date)}">${icon('trash')}</button></div>
   ${aberto?`<div class="fold-body"><pre class="receipt-preview">${esc(receiptText(r))}</pre>${shareButtons(r.id)}</div>`:''}</div>`;
 }).join(''):'<p class="empty">Nenhum comprovante gerado ainda.</p>');
}
function shareButtons(id){
 return `<div class="share-row">
  <button type="button" class="btn secondary" data-share="whatsapp" data-receipt-id="${esc(id)}">${icon('chat')}WhatsApp</button>
  <button type="button" class="btn secondary" data-share="system" data-receipt-id="${esc(id)}">${icon('share')}Compartilhar</button>
  <button type="button" class="btn secondary" data-share="copy" data-receipt-id="${esc(id)}">${icon('copy')}Copiar texto</button>
 </div><p class="small muted" style="margin-top:10px">“Compartilhar” abre a lista do seu aparelho — é por ali que saem o Bluetooth e os outros aplicativos.</p>`;
}
function shareReceipt(acao,id){
 const r=state.receipts.find(x=>x.id===id);
 if(!r)return;
 const texto=receiptText(r);
 if(acao==='whatsapp')return void window.open('https://wa.me/?text='+encodeURIComponent(texto),'_blank','noopener');
 if(acao==='system'){
  if(navigator.share)return void navigator.share({title:'Comprovante de corrida',text:texto}).catch(()=>{});
  return copyReceipt(texto,'Este navegador não abre a lista de compartilhamento. O texto foi copiado.');
 }
 copyReceipt(texto,'Texto do comprovante copiado.');
}
function copyReceipt(texto,msg){
 const pronto=()=>toast(msg);
 if(navigator.clipboard&&navigator.clipboard.writeText)return void navigator.clipboard.writeText(texto).then(pronto).catch(()=>toast('Não deu para copiar. Selecione o texto acima.'));
 toast('Não deu para copiar. Selecione o texto acima.');
}
let receiptToRemove=null;
function askRemoveReceipt(id){
 const r=state.receipts.find(x=>x.id===id);
 if(!r)return;
 receiptToRemove=id;
 openDialog('Excluir comprovante?',`<p class="dialog-intro">O comprovante de ${prettyDate(r.date)} — ${esc(r.from)} → ${esc(r.to)}, ${money(r.amount)} — sai deste navegador. Quem já recebeu a mensagem continua com ela.</p><div class="form-actions"><button class="btn secondary" data-action="close">Cancelar</button><button class="btn danger" data-action="removeReceipt">Excluir</button></div>`);
}
function toggleReceipt(id){
 if(receiptsOpen===null)receiptsOpen=new Set();
 receiptsOpen.has(id)?receiptsOpen.delete(id):receiptsOpen.add(id);
 render();
}
function reportsPage(){const t=totals(),platforms=platformList().map(name=>({name,value:t.rides.filter(r=>r.platform===name).reduce((a,r)=>a+r.amount,0)})),costs=categories.map(name=>({name,value:t.expenses.filter(e=>e.category===name).reduce((a,e)=>a+e.amount,0)})).filter(x=>x.value>0);return title('Uma visão do seu trabalho.','Compare ganhos e gastos e acompanhe seus resultados.')+`<div class="section-row"><span class="caption">Resumo do período</span>${periodButtons()}</div><div class="summary-grid centered">${summaryCard('Resultado do período',money(t.balance),'','positive')}${summaryCard('Resultado por hora',t.minutes?money(t.balance/(t.minutes/60)):'—',hours(t.minutes)+' de trabalho')}${summaryCard('Resultado por km',t.km?money(t.balance/t.km):'—',number(t.km)+' km em jornadas encerradas')}</div><div class="report-grid"><section class="panel panel-pad"><h2>Ganhos por plataforma</h2>${platforms.map(p=>`<div class="breakdown-row"><div class="breakdown-label"><span>${esc(p.name)}</span><strong class="mono">${money(p.value)}</strong></div><div class="progress-track"><div class="progress-fill" style="width:${t.revenue?p.value/t.revenue*100:0}%"></div></div></div>`).join('')}<p class="small muted">Participação nos ganhos do período selecionado.</p></section></div><section class="panel panel-pad expense-breakdown"><h2>Onde você gastou</h2>${costs.map(p=>`<div class="breakdown-row"><div class="breakdown-label"><span>${esc(p.name)}</span><strong class="mono">${money(p.value)}</strong></div><div class="progress-track"><div class="progress-fill" style="width:${t.cost?p.value/t.cost*100:0}%"></div></div></div>`).join('')||'<p class="empty">Nenhum gasto neste período.</p>'}</section><p class="data-warning">O resultado considera somente os valores registrados. Custos não lançados e depreciação do carro não estão incluídos.</p>`;}
const mailIcon='<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="3"/><path d="m4 7 8 6 8-6"/></svg>';
const lockIcon='<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="10" width="14" height="11" rx="3"/><path d="M8 10V7a4 4 0 0 1 8 0v3M12 14v3"/></svg>';
function passwordEye(visible){return '<svg viewBox="0 0 24 24" aria-hidden="true">'+(visible?'<path d="m3 3 18 18M10 5h2c6 0 10 7 10 7a19 19 0 0 1-4 4M6 6c-3 2-4 6-4 6s4 7 10 7c2 0 3-.5 4-1M10 10a3 3 0 0 0 4 4"/>':'<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/>')+'</svg>';}
function googleIcon(){return '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="#4285F4" d="M23 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.2a5.3 5.3 0 0 1-2.3 3.5v2.9h3.7C21.8 18.9 23 15.9 23 12.3z"/><path fill="#34A853" d="M12 24c3.1 0 5.7-1 7.6-2.8l-3.7-2.9c-1 .7-2.3 1.1-3.9 1.1-3 0-5.5-2-6.4-4.7H1.8v3C3.7 21.4 7.6 24 12 24z"/><path fill="#FBBC05" d="M5.6 14.7a7.2 7.2 0 0 1 0-4.6v-3H1.8a12 12 0 0 0 0 10.6l3.8-3z"/><path fill="#EA4335" d="M12 4.8c1.7 0 3.2.6 4.4 1.7l3.3-3.3C17.7 1.2 15.1 0 12 0 7.6 0 3.7 2.6 1.8 6.1l3.8 3C6.5 6.7 9 4.8 12 4.8z"/></svg>';}
function loginScreen(){return `
 <div class="login-brand"><span class="brand-name">Lucro<span>In</span>Drive</span></div>
 <section aria-labelledby="login-heading"><div class="login-intro"><h1 id="login-heading">Entrar na sua conta</h1><p>Acompanhe seus ganhos e cuide do seu carro.</p></div>
 <button class="btn google-login" data-action="googleLogin" ${!cloud?'disabled':''}>${googleIcon()}Continuar com o Google</button>
 <div class="auth-divider">ou entre com e-mail</div>
 <form id="login-form">
 <div class="login-fields"><div class="field"><label for="login-email">E-mail</label><div class="login-input">${mailIcon}<input id="login-email" name="email" type="email" inputmode="email" required maxlength="254" placeholder="voce@email.com" autocomplete="username" autocapitalize="none" spellcheck="false"></div></div>
 <div class="field"><label for="login-password">Senha</label><div class="login-input">${lockIcon}<input id="login-password" name="password" type="password" required maxlength="128" placeholder="Sua senha" autocomplete="current-password"><button type="button" id="password-toggle" class="password-toggle" data-action="togglePassword" aria-label="Mostrar senha" aria-pressed="false">${passwordEye(false)}</button></div></div></div>
 <p class="form-error" id="auth-error" role="alert">${bootError?esc(authError(bootError)):''}</p>
 <button class="btn primary login-submit" type="submit" ${!cloud?'disabled':''}>Entrar ${icon('arrowup')}</button>
 </form>
 <div class="auth-links"><div class="auth-signup"><span>Ainda não tem conta?</span><button class="auth-link" data-action="createAccount" ${!cloud?'disabled':''}>Criar conta</button></div><span class="auth-separator" aria-hidden="true"></span><button class="auth-link" data-action="recoverPassword" ${!cloud?'disabled':''}>Esqueci minha senha</button></div>
 ${bootError?'<button class="auth-link auth-retry" data-action="reloadApp">Tentar novamente</button>':''}
 <p class="login-note">Seus registros, na sua conta.</p>
 <div class="login-legal"><button class="auth-link" data-action="readTerms">Termos de Uso</button><button class="auth-link" data-action="readPrivacy">Privacidade</button></div>
 </section>`;}

function gateScreen(){
 const phase=session?.phase||'loading';
 if(bootError||phase==='signedout')return loginScreen();
 const brand='<div class="login-brand"><span class="brand-name">Lucro<span>In</span>Drive</span></div>';
 if(phase==='loading')return brand+'<section class="auth-message" aria-live="polite"><span class="auth-spinner" aria-hidden="true"></span><h1>Carregando sua conta</h1><p>Aguarde um instante.</p></section>';
 if(phase==='verify')return brand+`<section class="auth-message"><span class="auth-symbol">${mailIcon}</span><h1>Confirme seu e-mail</h1><p>Abra a mensagem de confirmação enviada para <strong>${esc(session.user.email)}</strong> e toque no link. Confira também a pasta de spam.</p><p class="form-error" id="auth-error" role="alert"></p><button class="btn primary" data-action="checkVerification">Já confirmei meu e-mail</button><button class="btn secondary" data-action="resendVerification">Reenviar confirmação</button><button class="auth-link" data-action="logout">Voltar ao login</button></section>`;
 if(phase==='consent')return termsScreen();
 if(phase==='deletion')return brand+`<section class="auth-message"><h1>Concluir exclusão da conta</h1><p>A exclusão foi iniciada, mas não terminou. Parte dos registros pode já ter sido removida. Confirme sua identidade novamente para concluir.</p><p class="form-error" id="auth-error" role="alert"></p><button class="btn primary" data-action="askDeleteAccount">Continuar exclusão</button><button class="auth-link" data-action="logoutKeepPending">Sair da conta</button></section>`;
 if(phase==='conflict')return brand+`<section class="auth-message"><h1>Há alterações em outro acesso</h1><p>Baixe uma cópia dos registros pendentes neste navegador. Depois, você pode carregar os dados mais recentes da sua conta.</p><p class="form-error" id="auth-error" role="alert"></p><button class="btn primary" data-action="exportPending">Baixar alterações pendentes</button><button class="btn secondary" data-action="askUseServerCopy">Carregar dados da conta</button><button class="auth-link" data-action="logoutKeepPending">Sair e manter pendências neste navegador</button></section>`;
 return brand+`<section class="auth-message"><h1>Não foi possível abrir sua conta</h1><p>${esc(authError(session.error))}</p><p class="form-error" id="auth-error" role="alert"></p><button class="btn primary" data-action="retrySession">Tentar novamente</button><button class="auth-link" data-action="logoutKeepPending">Sair da conta</button></section>`;
}

function termsScreen(){return `
 <div class="terms-top"><button class="icon-btn terms-back" data-action="logout" aria-label="Voltar ao login">${icon('chevron')}</button><span class="brand-name">Lucro<span>In</span>Drive</span></div>
 <section aria-labelledby="terms-heading"><div class="terms-hero"><p class="eyebrow">PRIMEIRO ACESSO</p><h1 id="terms-heading">Antes de começar</h1><p>Leia os documentos e confirme abaixo para acessar o LucroInDrive.</p></div>
 <p class="terms-required">CONFIRMAÇÃO OBRIGATÓRIA</p>
 <form id="consent-form"><div class="consent-card"><label class="consent-choice" for="consent-confirm"><span class="consent-copy"><strong id="consent-label">Tenho 18 anos ou mais e aceito os termos</strong><small id="consent-description">Declaro ser maior de idade e aceitar os Termos de Uso e a Política de Privacidade.</small></span><span class="consent-switch"><input id="consent-confirm" name="consent" type="checkbox" role="switch" required aria-labelledby="consent-label" aria-describedby="consent-description" ${consentPending?'checked':''}><span class="consent-track" aria-hidden="true"></span></span></label>
 <div class="terms-documents"><button type="button" class="auth-link" data-action="readTerms">Ler os Termos de Uso ${icon('chevron')}</button><button type="button" class="auth-link" data-action="readPrivacy">Ler a Política de Privacidade ${icon('chevron')}</button></div></div>
 <p class="form-error" id="auth-error" role="alert"></p><button id="consent-enter" class="btn primary terms-continue" type="submit" ${consentPending?'':'disabled'}>Entrar no app ${icon('arrowup')}</button><p class="terms-status" id="consent-status" role="status">${consentPending?'Tudo pronto para continuar.':'Confirme sua idade e o aceite para continuar.'}</p></form>
 <p class="terms-demo">Versão de testes · seu aceite fica registrado na sua conta.</p></section>`;}

function showLegalDocument(kind){openDialog(kind==='terms'?'Termos de Uso':'Política de Privacidade',`<article class="legal-document"><span class="tag none">Versão de testes · ${prettyDate(TERMS_VERSION)}</span>${legalDocument(kind)}</article><button class="btn primary legal-close" data-action="close">Voltar</button>`);}

function showAuthError(error){
 const target=$('form-error')||$('auth-error');
 if(target)target.textContent=authError(error);else toast(authError(error));
}
async function authAction(action){
 if(authBusy)return;
 authBusy=true;
 const controls=[...document.querySelectorAll('#view button,#dialog button,#dialog input,#view input')].filter(el=>!el.disabled);
 controls.forEach(el=>el.disabled=true);
 const error=$('form-error')||$('auth-error');if(error)error.textContent='';
 try{return await action();}catch(error){showAuthError(error);}finally{authBusy=false;controls.forEach(el=>{if(el.isConnected)el.disabled=false;});if($('consent-enter'))$('consent-enter').disabled=!consentPending;}
}
function showSignup(){openDialog('Criar sua conta',form('signup-form','Use seu e-mail. Vamos enviar um link para confirmar o endereço.',field('E-mail','email','email','','required maxlength="254" autocomplete="email" autocapitalize="none" spellcheck="false" placeholder="voce@email.com"',true)+field('Senha','password','password','','required minlength="8" maxlength="128" autocomplete="new-password" placeholder="Use pelo menos 8 caracteres"',true)+field('Confirmar senha','confirmPassword','password','','required minlength="8" maxlength="128" autocomplete="new-password"',true),'Criar conta'));}
function showRecovery(){openDialog('Recuperar senha',form('recovery-form','Informe o e-mail usado no cadastro para receber as instruções.',field('E-mail','email','email','','required maxlength="254" autocomplete="email" autocapitalize="none" placeholder="voce@email.com"',true),'Enviar instruções'));}
function completeConsent(){if(!$('consent-confirm')?.checked)return;return authAction(()=>session.accept());}
function save(){session?.save(state);}
function updateStorageNote(){
 const note=$('storage-note'),banner=$('sync-banner');
 if(!session||session.phase!=='ready'){if(banner)banner.hidden=true;return;}
 const pending=!!session.pending||!!session.writing;
 if(note)note.textContent=session.error?'Alterações pendentes de envio.':pending?'Salvando na sua conta…':'Registros salvos na sua conta.';
 if(banner){
  banner.hidden=!session.error;
  banner.innerHTML=session.error?`<p>${esc(authError(session.error))}</p><div class="sync-actions"><button class="btn secondary" data-action="retrySync">Tentar novamente</button><button class="auth-link" data-action="exportData">Baixar cópia</button></div>`:'';
 }
 if(!session.cacheOK&&pending&&note)note.textContent='Alterações pendentes. Mantenha esta página aberta até terminar o envio.';
}
function exportData(pending=false){
 const data=pending?(session?.pending||state):state;
 const blob=new Blob([JSON.stringify({app:'LucroInDrive',exportedAt:new Date().toISOString(),pending,state:data},null,2)],{type:'application/json'});
 const url=URL.createObjectURL(blob),link=document.createElement('a');link.href=url;link.download=`lucroindrive-${pending?'pendentes-':''}${localDate()}.json`;link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
}
function askDeleteAccount(){
 const password=session.user.providerData?.some(p=>p.providerId==='password');
 openDialog('Excluir sua conta',form('delete-account-form','Esta ação remove sua conta, o carro e todos os seus registros no LucroInDrive. Exporte uma cópia antes, se quiser guardar o histórico.',field('Digite EXCLUIR para confirmar','confirmation','text','','required pattern="EXCLUIR" autocomplete="off"',true)+(password?field('Sua senha atual','password','password','','required autocomplete="current-password"',true):'<p class="small muted">O Google vai solicitar uma nova confirmação da sua identidade.</p>'),'Excluir definitivamente'));
}
async function handleAuthForm(formEl,d){
 switch(formEl.id){
  case 'login-form':await cloud.signIn(d.email,d.password);formEl.reset();break;
  case 'signup-form':if(d.password!==d.confirmPassword){formError('As senhas precisam ser iguais.');return;}await cloud.signUp(d.email,d.password);formEl.reset();break;
  case 'recovery-form':await cloud.recover(d.email);formEl.reset();openDialog('Confira seu e-mail','<p class="dialog-intro">Se houver uma conta com esse endereço, você receberá as instruções para redefinir a senha. Confira também a pasta de spam.</p><button class="btn primary" data-action="close">Voltar ao login</button>');break;
  case 'delete-account-form':if(d.confirmation!=='EXCLUIR')return;await session.removeAccount(d.password||'');formEl.reset();toast('Conta e registros excluídos.');break;
 }
}
function onAccountChange(current){
 if($('dialog').open)closeDialog();
 state=current.state;consentRecord=current.consent;consentPending=false;
 if(current.phase==='ready'){normalizeState();state.account={email:current.user.email||'',uid:current.user.uid};}
 else {vehicleDraft=null;receiptDraft=null;receiptToRemove=null;maintenanceToRemove=null;resetFipeState();}
 render();$('main').scrollTo({top:0});
}
async function startAccount(){
 render();
 try {
  const response=await fetch('/firebase-config.json',{cache:'no-store'});
  if(!response.ok)throw new Error('app/not-configured');
  const config=await response.json();
  cloud=await connectFirebase(config);
  let storage;try{storage=window.localStorage;}catch{}
  session=new AccountSession(cloud,{storage,onChange:onAccountChange,onStatus:updateStorageNote});
  session.start();
 }catch(error){bootError=error;render();}
}

function render(){
const ready=session?.phase==='ready';
$('app-shell').classList.toggle('auth-mode',!ready);
$('app-shell').classList.toggle('terms-mode',session?.phase==='consent');
if(!ready){const route=session?.phase==='consent'?'termos':session?.phase==='verify'?'verificar-email':'login';if(location.hash!=='#'+route)history.replaceState(null,'','#'+route);$('view').innerHTML=gateScreen();document.title='LucroInDrive — Acesso';updateStorageNote();return;}
if(['#login','#termos','#verificar-email'].includes(location.hash))history.replaceState(null,'','#inicio');
anotarTrilha();const route=location.hash.slice(1);view=navigation.some(n=>n[0]===route)||SUBVIEWS[route]?route:'inicio';const sub=SUBVIEWS[view],navView=sub?sub.parent:view,pageName=sub?sub.label:navigation.find(n=>n[0]===view)[1];$('desktop-nav').innerHTML=navigation.map(([v,l,i])=>`<button data-view="${v}" class="${navView===v?'active':''}" ${navView===v?'aria-current="page"':''}>${icon(i)}${l}</button>`).join('');$('mobile-nav').innerHTML=navigation.map(([v,l,i])=>`<button data-view="${v}" class="${navView===v?'active':''}" ${navView===v?'aria-current="page"':''}>${icon(i)}<span>${l}</span></button>`).join('');$('breadcrumb-name').textContent=pageName;$('topbar-back').hidden=!sub;$('side-car-name').textContent=state.vehicle?[vehicleName(state.vehicle),state.vehicle.year].filter(Boolean).join(' · '):'Nenhum carro cadastrado';$('side-km').textContent=number(state.km)+' km registrados';$('header-date').textContent=new Date().toLocaleDateString('pt-BR',{day:'2-digit',month:'short',year:'numeric'});$('view').innerHTML=({inicio:home,corridas:ridesPage,financeiro:financePage,carro:carPage,config:settingsPage,'config-plano':planPage,'config-conta':accountPage,'config-suporte':supportPage,'corridas-jornadas':journeysPage,'corridas-historico':rideHistoryPage,'carro-manutencao':maintenancePage,'carro-manutencoes':maintenanceLogPage,'corridas-comprovante':receiptPage,'corridas-comprovantes':receiptsPage,'financeiro-historico':expenseHistoryPage,'financeiro-relatorios':reportsPage})[view]();document.title='LucroInDrive — '+pageName;updateStorageNote();maybeAskStaleKm();}
function go(v){if(location.hash==='#'+v){render();return;}location.hash=v;}
/* Onde a pessoa esteve, na ordem. Cada entrada do histórico recebe um número e
   a trilha diz qual tela é cada número. Com isso a seta do app volta de
   verdade quando a tela anterior já é o destino; antes ela empilhava outra
   entrada, e aí o botão do aparelho reavançava para a tela recém-deixada. */
let trilha=[],passo=-1;
function anotarTrilha(){
 const st=history.state;
 if(st&&typeof st.passo==='number')passo=st.passo;
 else{passo+=1;trilha.length=passo;try{history.replaceState({passo},'');}catch{}}
 trilha[passo]=location.hash.slice(1);
}
const telaAnterior=()=>passo>0?trilha[passo-1]:null;
window.addEventListener('hashchange',()=>{render();$('main').scrollTo({top:0,behavior:'instant'});});
function toast(msg){clearTimeout(toastTimer);$('toast').textContent=msg;$('toast').classList.remove('hidden');toastTimer=setTimeout(()=>$('toast').classList.add('hidden'),4200);}
let returnFocus=null;
function openDialog(title,body){returnFocus=document.activeElement;$('dialog-title').textContent=title;$('dialog-body').innerHTML=body;if(!$('dialog').open)$('dialog').showModal();}
function closeDialog(){$('dialog').close();}
/* A pergunta da virada do dia aparece assim que dá para mostrá-la: ao abrir o
   app ou na hora, se ele estava aberto. Pergunta-se uma vez — o pedido sai do
   estado quando a caixa abre, então recarregar não vira interrogatório. */
let staleAsk=null;
function askStaleKm(){
 const a=state.askKm;if(!a)return;
 staleAsk=a;state.askKm=null;save();
 openDialog('Jornada encerrada na virada do dia',
  `<p class="dialog-intro">O dia virou com a jornada de ${prettyDate(a.date)} aberta, então ela foi encerrada com ${number(a.km)} km — a última leitura que o app conhecia. Informe o km do fim da jornada para acertar a distância daquele dia.</p>
   <form id="stale-km-form"><div class="form-grid">${field('Quilometragem no fim da jornada','km','number',a.km,`required min="${a.startKm}" max="9999999" step="1" inputmode="numeric"`,true)}</div>
   <p class="form-error" id="form-error" role="alert"></p>
   <div class="form-actions"><button type="button" class="btn secondary" data-action="close">Manter ${number(a.km)} km</button><button type="submit" class="btn primary">Salvar km</button></div></form>`);
}
function maybeAskStaleKm(){if(state.askKm&&!$('dialog').open)askStaleKm();}
$('dialog').addEventListener('close',()=>{fipeDialogOpen=false;vehicleDraft=null;receiptToRemove=null;maintenanceToRemove=null;if(returnFocus?.isConnected)returnFocus.focus();});
/* O "*" sai do próprio required do campo, para a marca não depender de
   alguém lembrar de pôr nos dois lugares. Ele é decorativo: quem usa leitor de
   tela já ouve a obrigatoriedade pelo required. */
const reqMark=extra=>/\brequired\b/.test(String(extra))?'<span class="req" aria-hidden="true">*</span>':'';
function field(label,name,type='text',value='',extra='',full=false){return `<div class="field ${full?'full':''}"><label for="f-${name}">${label}${reqMark(extra)}</label><input id="f-${name}" name="${name}" type="${type}" value="${esc(value)}" ${extra}></div>`;}
function selectField(label,name,options,extra=''){return `<div class="field"><label for="f-${name}">${label}${reqMark(extra)}</label><select id="f-${name}" name="${name}" ${extra}>${options.map(x=>`<option>${esc(x)}</option>`).join('')}</select></div>`;}
function form(id,intro,fields,submit='Salvar'){return `<p class="dialog-intro">${intro}</p><form id="${id}"><div class="form-grid">${fields}</div><p class="form-error" id="form-error" role="alert"></p><div class="form-actions"><button type="button" class="btn secondary" data-action="close">Cancelar</button><button type="submit" class="btn primary">${submit}</button></div></form>`;}
function showRide(){openDialog('Nova corrida',form('ride-form','Informe o valor que você recebeu pela corrida.',selectField('Plataforma','platform',platformList())+field('Valor recebido (R$)','amount','number','','required min="0.01" max="999999" step="0.01" inputmode="decimal" placeholder="0,00"')+field('Distância da corrida (km)','km','number','','required min="0" max="10000" step="0.1" inputmode="decimal" placeholder="0"')+selectField('Recebimento','payment',['Pela plataforma','Pix','Dinheiro','Cartão'])+field('Data','date','date',localDate(),`required max="${localDate()}"`)+field('Horário','time','time',new Date().toTimeString().slice(0,5),'required'),'Adicionar corrida'));}
function showExpense(){openDialog('Adicionar gasto',form('expense-form','Registre uma despesa do seu trabalho ou do seu carro.',selectField('Categoria','category',categories)+field('Valor (R$)','amount','number','','required min="0.01" max="999999" step="0.01" inputmode="decimal" placeholder="0,00"')+field('Descrição','description','text','','maxlength="100" placeholder="Ex.: abastecimento"',true)+field('Data','date','date',localDate(),`required max="${localDate()}"`,true),'Adicionar gasto'));}
function showService(id){const s=state.services.find(s=>s.id===id);if(!s)return;openDialog('Registrar revisão',form('service-form','O valor informado entra nos gastos uma única vez, vinculado a este serviço.',`<input type="hidden" name="serviceId" value="${esc(id)}">`+field('Serviço','name','text',s.name,'readonly',true)+field('Data do serviço','date','date',localDate(),`required max="${localDate()}"`)+field('Quilometragem do serviço','km','number',state.km,'required min="0" max="9999999" step="1" inputmode="numeric"')+field('Valor total (R$)','amount','number','','min="0" max="999999" step="0.01" inputmode="decimal" placeholder="Opcional"')+field('Oficina','shop','text','','maxlength="100" placeholder="Opcional"')+field('Próxima revisão (km)','nextKm','number','','min="1" max="9999999" step="1" inputmode="numeric" placeholder="Ex.: 90000"')+field('Próxima revisão (data)','nextDate','date','','')+'<p class="small muted" style="grid-column:1/-1">Defina pelo menos um próximo prazo: quilometragem ou data.</p>','Salvar revisão'));}
/* ============================================================
   MEU CARRO — cadastro do veículo e Tabela FIPE
   O cadastro é opcional: o resto do app funciona sem ele. Ele existe
   porque a consulta à FIPE precisa de marca, modelo e ano, e porque o
   painel de manutenção muda conforme o motor. Marcas e modelos vêm do
   catálogo do TMyCar, ampliado aqui com as linhas elétricas e híbridas:
   muita gente roda em aplicativo com carro elétrico, e essas famílias
   não existiam no catálogo original.
   ============================================================ */
const CATALOG=(()=>{try{return JSON.parse($('catalogo').textContent);}catch{return {};}})();
const BRANDS=Object.keys(CATALOG);
const OTHER='__outro__';
const FUELS=['Flex','Gasolina','Etanol','Diesel','Híbrido','Híbrido plug-in','Elétrico'];
const GEARS=['Não informar','Manual','Automático'];
const COLORS=[['#edeff3','Branco'],['#b0b4ba','Prata'],['#767d87','Cinza'],['#15181d','Preto'],['#b4232b','Vermelho'],['#1f4fa8','Azul'],['#1e6e4b','Verde'],['#8a6a3e','Marrom']];
const maxYear=()=>new Date().getFullYear()+1;
const versionsOf=(brand,model)=>(CATALOG[brand]&&CATALOG[brand][model])||[];
const versionBase=v=>v.c?v.c.toFixed(1)+(v.t?' turbo':''):'';
const versionOption=v=>[versionBase(v)||'Motor elétrico',v.f,v.a0===v.a1?v.a0:`${v.a0}-${v.a1}`].join(' · ');
const colorName=hex=>(COLORS.find(c=>c[0]===hex)||[null,'Cor não informada'])[1];
const plateOK=p=>/^[A-Z]{3}[0-9]{4}$/.test(p)||/^[A-Z]{3}[0-9][A-Z][0-9]{2}$/.test(p);
const formatPlate=p=>/^[A-Z]{3}[0-9]{4}$/.test(p)?p.slice(0,3)+'-'+p.slice(3):p;
/* elétrico não troca óleo de motor; híbrido troca e ainda tem bateria de tração */
const powertrain=fuel=>fuel==='Elétrico'?'eletrico':/^Híbrido/.test(fuel||'')?'hibrido':'combustao';
const vehicleBrand=v=>v.brand===OTHER?(v.brandOther||'').trim():v.brand;
const vehicleModel=v=>(v.brand===OTHER||v.model===OTHER)?(v.modelOther||'').trim():v.model;
const vehicleName=v=>[vehicleBrand(v),vehicleModel(v)].filter(Boolean).join(' ');
const vehicleSpec=v=>[v.version,v.fuel,v.gear&&v.gear!=='Não informar'?v.gear:null,v.year].filter(Boolean).join(' · ');
/* a FIPE descreve a versão dentro do nome ("1.0 Turbo Flex"), então é assim que comparamos */
const vehicleEngineText=v=>v.cc?Number(v.cc).toFixed(1)+(v.turbo?' turbo':''):'';

/* ---- painel de manutenção conforme o motor ---- */
/* Cada filtro tem o próprio ritmo, então cada um é um item. O de cabine é o
   único que todo carro tem; os outros três dependem de motor a combustão e
   somem do painel quando o carro é elétrico. */
const SERVICE_PLANS={
 combustao:[['oil','Óleo do motor','drop'],['filter-oil','Filtro de óleo','filter'],['filter-air','Filtro de ar do motor','filter'],['filter-fuel','Filtro de combustível','filter'],['filter-cabin','Filtro de cabine','filter'],['brake','Fluido de freio','tool'],['coolant','Arrefecimento','drop'],['tires','Pneus e alinhamento','tool']],
 hibrido:[['oil','Óleo do motor','drop'],['filter-oil','Filtro de óleo','filter'],['filter-air','Filtro de ar do motor','filter'],['filter-fuel','Filtro de combustível','filter'],['filter-cabin','Filtro de cabine','filter'],['brake','Fluido de freio','tool'],['coolant','Arrefecimento','drop'],['battery','Bateria de tração','battery'],['tires','Pneus e alinhamento','tool']],
 eletrico:[['filter-cabin','Filtro de cabine','filter'],['brake','Fluido de freio','tool'],['coolant','Arrefecimento da bateria','drop'],['reducer','Óleo do redutor','drop'],['battery','Bateria de tração','battery'],['tires','Pneus e alinhamento','tool']]
};
/* De "Filtros" num item só para um item por filtro. */
const RENAMED_SERVICES={filters:'filter-oil',cabin:'filter-cabin'};
/* Ao mudar o tipo de motor, os itens que continuam no plano conservam o que já
   foi registrado. Um carro novo começa sem registro: inventar prazo de revisão
   de um carro que o app não conhece seria pior do que não mostrar nada. */
function applyServicePlan(kind,fresh){
 const before=new Map((state.services||[]).map(s=>[s.id,s]));
 state.services=(SERVICE_PLANS[kind]||SERVICE_PLANS.combustao).map(([id,name,ic])=>{
  const old=!fresh&&before.get(id);
  return old?Object.assign({},old,{name,icon:ic}):{id,name,icon:ic,lastKm:null,lastDate:null,nextKm:null,nextDate:null};
 });
 state.servicePlan=kind;
}
const vehiclePlan=()=>state.vehicle?powertrain(state.vehicle.fuel):(state.servicePlan||'combustao');
const isElectric=()=>vehiclePlan()==='eletrico';

/* ---- formulário de cadastro ---- */
let vehicleDraft=null;
function blankDraft(){return {brand:'',brandOther:'',model:'',modelOther:'',versionIdx:'',versionOther:'',version:'',cc:null,turbo:false,fuel:'Flex',gear:'Não informar',year:'',plate:'',color:COLORS[0][0],km:''};}
function pickField(label,name,options,value,extra='',full=false){
 return `<div class="field ${full?'full':''}"><label for="f-${name}">${label}${reqMark(extra)}</label><select id="f-${name}" name="${name}" ${extra}>${options.map(o=>{
  const val=Array.isArray(o)?o[0]:o,txt=Array.isArray(o)?o[1]:o;
  return `<option value="${esc(val)}" ${String(val)===String(value??'')?'selected':''}>${esc(txt)}</option>`;
 }).join('')}</select></div>`;
}
function showVehicle(edit){
 vehicleDraft=edit&&state.vehicle?Object.assign(blankDraft(),state.vehicle,{km:String(state.km||'')}):blankDraft();
 openDialog(edit&&state.vehicle?'Editar carro':'Cadastrar carro',vehicleFormHtml());
}
function vehicleFormHtml(){
 const d=vehicleDraft,brandFree=d.brand===OTHER;
 const models=brandFree?[]:Object.keys(CATALOG[d.brand]||{});
 const modelFree=brandFree||d.model===OTHER;
 const versions=modelFree?[]:versionsOf(d.brand,d.model);
 let f=pickField('Marca','brand',[['','Selecione a marca']].concat(BRANDS.map(b=>[b,b]),[[OTHER,'Outra marca']]),d.brand,'required');
 f+=brandFree?field('Qual é a marca?','brandOther','text',d.brandOther,'required maxlength="40" placeholder="Ex.: Zeekr"')
   :pickField('Modelo','model',[['','Selecione o modelo']].concat(models.map(m=>[m,m]),[[OTHER,'Outro modelo']]),d.model,d.brand?'required':'disabled');
 if(modelFree)f+=field('Qual é o modelo?','modelOther','text',d.modelOther,'required maxlength="40" placeholder="Ex.: Dolphin Mini"');
 if(versions.length){
  f+=pickField('Versão','versionIdx',[['','Selecione a versão']].concat(versions.map((x,i)=>[String(i),versionOption(x)]),[[OTHER,'Outra versão']]),d.versionIdx,'',true);
  if(d.versionIdx===OTHER)f+=field('Qual é a versão?','versionOther','text',d.versionOther,'maxlength="40" placeholder="Ex.: 1.0 turbo"',true);
 }else{
  f+=field('Versão','versionOther','text',d.versionOther,'maxlength="40" placeholder="Ex.: 1.0 turbo"',true);
 }
 f+=pickField('Combustível','fuel',FUELS,d.fuel);
 f+=field('Ano do modelo','year','number',d.year,`min="1950" max="${maxYear()}" step="1" inputmode="numeric" placeholder="${maxYear()-4}"`);
 f+=pickField('Câmbio','gear',GEARS,d.gear);
 f+=field('Placa','plate','text',d.plate,'maxlength="8" placeholder="ABC1D23" autocomplete="off" autocapitalize="characters" spellcheck="false" style="text-transform:uppercase"');
 f+=field('Quilometragem atual','km','number',d.km,`min="0" max="9999999" step="1" inputmode="numeric" placeholder="${number(state.km)}"`);
 f+=`<div class="field full"><label>Cor</label><div class="swatch">${COLORS.map(([hex,nome])=>`<button type="button" data-color="${hex}" aria-pressed="${d.color===hex}" aria-label="${nome}" title="${nome}" style="background:${hex}"></button>`).join('')}</div></div>`;
 return form('vehicle-form','Cadastro opcional. Ele serve para consultar a Tabela FIPE e para montar o painel de manutenção certo para o seu motor.',f,state.vehicle?'Salvar alterações':'Salvar carro');
}
/* Baixar o odômetro é permitido: o número do computador de bordo pode ter sido
   lido errado, e travar o campo obriga a conviver com o erro. Mas nunca em
   silêncio — o aviso aparece enquanto se digita e conta o que muda. */
function repaintKmWarning(){
 const campo=$('f-km'),caixa=$('km-warn');
 if(!campo||!caixa)return;
 const novo=Number(campo.value);
 const volta=campo.value!==''&&Number.isFinite(novo)&&novo<state.km;
 caixa.hidden=!volta;
 if(!volta)return void(caixa.innerHTML='');
 const j=state.activeShift;
 const jornada=j&&novo<j.startKm?` A jornada aberta começou aos ${number(j.startKm)} km, então a distância de hoje volta a zero.`:'';
 caixa.innerHTML=`<div class="msgbox warn" style="margin:0">Isso volta o odômetro de ${number(state.km)} km para ${number(novo)} km. Confira o número no computador de bordo: os prazos das revisões são contados a partir dele.${jornada}</div>`;
}
function readVehicleDraft(){
 const el=$('vehicle-form');if(!el||!vehicleDraft)return;
 const data=new FormData(el);
 ['brand','brandOther','model','modelOther','versionIdx','versionOther','fuel','gear','year','plate','km'].forEach(k=>{if(data.has(k))vehicleDraft[k]=String(data.get(k));});
}
function syncVehicleDraft(changed){
 const d=vehicleDraft;
 if(changed==='brand'){d.model='';d.modelOther='';d.versionIdx='';d.versionOther='';}
 if(changed==='model'){d.versionIdx='';d.versionOther='';}
 if(changed==='brand'||changed==='model'||changed==='versionIdx'){
  const ver=versionsOf(d.brand,d.model)[Number(d.versionIdx)];
  if(ver){d.cc=ver.c;d.turbo=!!ver.t;d.fuel=ver.f;}
  else{d.cc=null;d.turbo=false;}
 }
}
function repaintVehicleForm(focus){
 $('dialog-body').innerHTML=vehicleFormHtml();
 const target=focus&&$('f-'+focus);
 if(target)target.focus({preventScroll:true});
}
/* "1.0 turbo", "1,4 TSI" — tira a cilindrada e o turbo do que a pessoa digitou */
function parseVersion(text){
 const s=String(text||'');
 const m=s.match(/(\d)[.,](\d)/);
 return {cc:m?Number(m[1]+'.'+m[2]):null,turbo:/turbo|tsi|tgdi|thp|tce|gdi-?t/i.test(s)};
}

/* ---- tela Meu carro ---- */
function vehicleHero(v){
 const plan=powertrain(v.fuel);
 const label=plan==='eletrico'?'CARRO ELÉTRICO':plan==='hibrido'?'CARRO HÍBRIDO':'SEU VEÍCULO';
 return `<section class="panel car-hero">
 <div class="car-description"><span class="eyebrow muted" style="font-size:10px">${label}</span><h2>${esc(vehicleName(v))}</h2>
 <p>${esc(vehicleSpec(v))||'Versão, ano e câmbio não informados'}</p>
 ${v.plate||v.color?`<div class="car-badges">${v.plate?`<span class="plate">${esc(formatPlate(v.plate))}</span>`:''}${v.color?`<span class="color-dot" style="background:${esc(v.color)}"></span><span class="small muted">${esc(colorName(v.color))}</span>`:''}</div>`:''}</div>
 <div class="car-tools"><button class="icon-btn" data-action="editVehicle" aria-label="Editar o cadastro do carro">${icon('edit')}</button><button class="icon-btn car-del" data-action="removeVehicle" aria-label="Remover o carro">${icon('trash')}</button></div>
 <div class="car-km"><div><small>Quilometragem atual</small><strong class="mono">${number(state.km)} <span style="font-size:14px;font-weight:400">km</span></strong></div><button class="btn quiet small-btn" data-action="odometer">${icon('edit')}Atualizar km</button></div></section>`;
}
function carPage(){
 const v=state.vehicle;
 const head=title('Cuide de quem te leva.','Revisões, quilometragem e valor do seu carro.',
  v?'':button('Cadastrar carro','addVehicle'));
 return head+(v?vehicleHero(v):'')+
 `<button class="btn secondary page-link" data-view="carro-manutencao">${icon('tool')}Painel de Manutenção${icon('chevron')}</button>`+
 `<button class="btn secondary page-link" data-view="carro-manutencoes">${icon('plus')}Adicionar Manutenção${icon('chevron')}</button>`+
 `<div class="car-grid">${fipeCard()}</div>`;
}
function maintenancePage(){
 return title('Painel de Manutenção','Cada revisão com o prazo que o seu carro pede.')+
 `<div class="maintenance-grid">${state.services.map(s=>`<article class="panel maintenance-card"><div class="maintenance-top"><div class="maintenance-name"><span class="square-icon">${icon(s.icon)}</span><h3>${esc(s.name)}</h3></div>${tag(status(s))}</div><div class="maintenance-data"><div><small>Última revisão</small><strong>${s.lastKm!=null?number(s.lastKm)+' km':'Sem registro'}</strong><small>${s.lastDate?prettyDate(s.lastDate):'—'}</small></div><div><small>Próxima revisão</small><strong>${s.nextKm!=null?number(s.nextKm)+' km':s.nextDate?'Por data':'A definir'}</strong><small>${s.nextDate?prettyDate(s.nextDate):s.nextKm!=null?'Prazo por quilometragem':'Prazo não definido'}</small></div></div><div class="maintenance-bottom"><p>${status(s).detail}</p><button class="btn secondary small-btn" data-service="${esc(s.id)}">Registrar revisão</button></div></article>`).join('')}</div>`;
}

/* Serviço avulso: o que foi feito, quanto custou e com quantos km. Diferente do
   painel, que acompanha os prazos dos itens de revisão. */
function maintenanceLogPage(){
 const tudo=[...(state.maintenance||[])].sort((a,b)=>(b.date+b.id).localeCompare(a.date+a.id));
 const anos=yearsOf(tudo.map(m=>m.date));
 if(!anos.includes(maintenanceYear))maintenanceYear=anos[0];
 const lista=tudo.filter(m=>Number(m.date.slice(0,4))===maintenanceYear);
 const meses=[...new Set(lista.map(m=>m.date.slice(0,7)))];
 if(maintenanceMonthsOpen===null)maintenanceMonthsOpen=new Set(meses.length?[meses[0]]:[]);
 if(maintenanceOpen===null)maintenanceOpen=new Set(lista.length?[lista[0].id]:[]);
 const total=lista.reduce((a,m)=>a+m.amount,0);
 return title('Adicionar Manutenção','Anote o que foi feito, quanto custou e com quantos km.')+
 `<form id="maintenance-form"><div class="form-grid">
 ${field('O que foi feito','description','text','','required maxlength="100" placeholder="Ex.: Troca da pastilha de freio"',true)}
 ${field('Valor (R$)','amount','number','','required min="0.01" max="999999" step="0.01" inputmode="decimal" placeholder="0,00"')}
 ${field('Quilometragem','km','number',state.km,'required min="0" max="9999999" step="1" inputmode="numeric"')}
 ${field('Data','date','date',localDate(),`required max="${localDate()}"`)}
 ${field('Oficina','shop','text','','maxlength="60" placeholder="Opcional"')}
 </div>
 <p class="form-error" id="form-error" role="alert"></p>
 <div class="form-actions"><button type="submit" class="btn primary">${icon('plus')}Salvar manutenção</button></div></form>
 <p class="small muted center-text" style="margin:14px 0 24px">O valor entra no Financeiro como gasto de Manutenção, junto com os lançamentos do dia a dia.</p>
 <div class="list-toolbar centered"><h2 class="accent">Manutenções registradas</h2><div class="toolbar-filters">${yearSelect('maintenance-year',anos,maintenanceYear)}</div></div>
 <div class="history-total"><span>Total em ${maintenanceYear}</span><strong class="mono negative">${money(total)}</strong></div>
 ${meses.length?meses.map(mes=>{
  const doMes=lista.filter(m=>m.date.startsWith(mes)),soma=doMes.reduce((a,m)=>a+m.amount,0),aberto=maintenanceMonthsOpen.has(mes);
  return `<div class="fold-box ${aberto?'open':''}"><button type="button" class="fold-head" data-maintenance-month="${esc(mes)}" aria-expanded="${aberto}">
   <span class="fold-chevron">${icon('chevron')}</span>
   <span class="fold-name"><strong>${monthLabel(mes)}</strong><small>${doMes.length} ${doMes.length===1?'manutenção':'manutenções'}</small></span>
   <span class="fold-total mono">${money(soma)}</span></button>
   ${aberto?`<div class="fold-body">${doMes.map(maintenanceBox).join('')}</div>`:''}</div>`;
 }).join(''):`<p class="empty">Nenhuma manutenção registrada em ${maintenanceYear}.</p>`}`;
}
function maintenanceBox(m){
 const aberta=maintenanceOpen.has(m.id);
 return `<div class="fold-box ${aberta?'open':''}"><div class="fold-top"><button type="button" class="fold-head" data-maintenance="${esc(m.id)}" aria-expanded="${aberta}">
  <span class="fold-chevron">${icon('chevron')}</span>
  <span class="fold-name plain"><strong>${esc(m.description)}</strong><small>${number(m.km)} km · ${prettyDate(m.date)}</small></span>
  <span class="fold-total mono">${money(m.amount)}</span></button>
  <button type="button" class="icon-btn fold-del" data-maintenance-remove="${esc(m.id)}" aria-label="Excluir a manutenção ${esc(m.description)}">${icon('trash')}</button></div>
  ${aberta?`<div class="fold-body"><div class="fold-row"><strong>Oficina</strong><span>${m.shop?esc(m.shop):'Não informada'}</span></div>
   <div class="fold-row"><strong>Lançado nos gastos</strong><span class="mono">Manutenção · ${money(m.amount)}</span></div></div>`:''}</div>`;
}
function toggleMaintenanceMonth(mes){
 if(maintenanceMonthsOpen===null)maintenanceMonthsOpen=new Set();
 maintenanceMonthsOpen.has(mes)?maintenanceMonthsOpen.delete(mes):maintenanceMonthsOpen.add(mes);
 render();
}
function toggleMaintenance(id){
 if(maintenanceOpen===null)maintenanceOpen=new Set();
 maintenanceOpen.has(id)?maintenanceOpen.delete(id):maintenanceOpen.add(id);
 render();
}
let maintenanceToRemove=null;
function askRemoveMaintenance(id){
 const m=(state.maintenance||[]).find(x=>x.id===id);
 if(!m)return;
 maintenanceToRemove=id;
 openDialog('Excluir manutenção?',`<p class="dialog-intro">${esc(m.description)} — ${number(m.km)} km, ${money(m.amount)} — sai daqui e o gasto também sai do Financeiro.</p><div class="form-actions"><button class="btn secondary" data-action="close">Cancelar</button><button class="btn danger" data-action="removeMaintenance">Excluir</button></div>`);
}

/* ---- Tabela FIPE (consulta real, API pública da Parallelum) ---- */
const FIPE_API='https://fipe.parallelum.com.br/api/v2/cars';
const FIPE_SITE='https://veiculos.fipe.org.br/';
let fipeState={status:'idle',message:'',models:[],all:[],years:[],filter:'',step:'models',matched:false,brandCode:null,brandName:'',modelCode:null,modelName:'',pending:null};
let fipeBrands=null,fipeDialogOpen=false;
function resetFipeState(){fipeState={status:'idle',message:'',models:[],all:[],years:[],filter:'',step:'models',matched:false,brandCode:null,brandName:'',modelCode:null,modelName:'',pending:null};}
/* A API pode devolver "CitroÃ«n" em vez de "Citroën"; sem reparar, a marca nunca casa. */
const repairText=s=>{
 const t=String(s??'');
 if(!/[ÃÂ]/.test(t))return t;
 try{const r=decodeURIComponent(escape(t));return /�/.test(r)?t:r;}catch{return t;}
};
const fipeKey=s=>repairText(s||'').normalize('NFD').replace(/[̀-ͯ]/g,'').toLowerCase().replace(/^(vw|gm)\s*-\s*/,'').replace(/[^a-z0-9]/g,'');
const codeOf=x=>x&&(x.code??x.codigo);
const nameOf=x=>repairText(x&&(x.name??x.nome));
const listOf=d=>Array.isArray(d)?d:(d&&(d.models||d.modelos||d.years||d.anos))||[];
/* Algumas montadoras têm mais de um cadastro na FIPE: a Towner da EFFA está sob Hafei. */
const FIPE_BRAND_ALIASES={effa:['hafei']};
function fipeBrandCandidates(brand){
 const target=fipeKey(brand),alias=FIPE_BRAND_ALIASES[target]||[];
 const score=x=>{
  const n=fipeKey(nameOf(x));
  if(n===target)return 0;
  if(n.includes(target)||target.includes(n))return 1;
  const i=alias.findIndex(a=>n===a||n.includes(a));
  return i>=0?10+i:999;
 };
 return (fipeBrands||[]).filter(x=>score(x)<999).sort((a,b)=>score(a)-score(b));
}
/* O catálogo agrupa linhas comerciais; a FIPE enumera cada versão.
   "Série 3" vira 320i/330i, "Corolla Hybrid" vira "Corolla Altis Hybrid...". */
function modelMatches(name,v){
 const n=fipeKey(name),brand=fipeKey(vehicleBrand(v)),model=vehicleModel(v);
 if(!n||!model)return false;
 if(n.includes(fipeKey(model)))return true;
 const parts=(String(model).normalize('NFD').replace(/[̀-ͯ]/g,'').toLowerCase().match(/[a-z0-9]+/g)||[]).filter(t=>t.length>=2);
 if(parts.length>1&&parts.every(t=>n.includes(t)))return true;
 const m=fipeKey(model);
 if(brand==='citroen'&&m==='c3aircross')return n.startsWith('aircross');
 if(brand==='bmw'&&m==='serie1')return /^(1m|11[468]|12[0358]|13[05]|m135|m140)/.test(n);
 if(brand==='bmw'&&m==='serie3')return /^(31[68]|32[0358]|33[05]|340|m3)/.test(n);
 if(brand==='bmw'&&m==='serie5')return /^(52[0358]|53[05]|54[05]|550|m5)/.test(n);
 if(brand==='mercedesbenz'&&m==='classea')return /^a\d{2,3}/.test(n);
 if(brand==='mercedesbenz'&&m==='classec')return /^c\d{2,3}/.test(n);
 if(brand==='mercedesbenz'&&m==='classee')return /^e\d{2,3}/.test(n);
 if(brand==='effa'&&m==='motorsm100')return n.startsWith('m100');
 return false;
}
async function fipeGet(url){
 const owner=session?.generation,vehicle=state.vehicle,requestState=fipeState;
 const r=await fetch(url,{headers:{Accept:'application/json'}});
 if(owner!==session?.generation||vehicle!==state.vehicle||requestState!==fipeState)throw Object.assign(new Error('Consulta cancelada.'),{code:'fipe/cancelled'});
 if(r.status===429)throw new Error('A FIPE atingiu o limite de consultas de hoje. Tente novamente amanhã ou anote o valor à mão.');
 if(!r.ok)throw new Error('A FIPE respondeu '+r.status+'.');
 const result=await r.json();
 if(owner!==session?.generation||vehicle!==state.vehicle||requestState!==fipeState)throw Object.assign(new Error('Consulta cancelada.'),{code:'fipe/cancelled'});
 return result;
}
function fipeFail(e){
 if(e?.code==='fipe/cancelled')return;
 let msg=e&&e.message?e.message:'Não deu para falar com a Tabela FIPE.';
 /* Safari diz "Load failed" e o Chrome "Failed to fetch" quando o ambiente
    bloqueia a chamada externa: traduzir, senão a mensagem não ajuda ninguém. */
 if(/failed to fetch|load failed|networkerror|cors/i.test(msg))
  msg='O ambiente onde o app está aberto bloqueou a consulta externa. Isso costuma acontecer dentro de visualizadores; na página aberta direto no navegador, a consulta funciona.';
 fipeState.status='error';fipeState.message=msg;
 paintFipe();
}
function paintFipe(){
 if(view==='carro')render();
 if(fipeDialogOpen&&$('dialog').open)$('dialog-body').innerHTML=fipePicker();
}
/* O câmbio aparece dentro do nome da versão, nunca em campo próprio. Por isso
   ele serve para PRIORIZAR, jamais para esconder versões de nome ambíguo. */
function gearInName(name){
 const n=String(name||'').normalize('NFD').replace(/[̀-ͯ]/g,'').toLowerCase();
 if(/\b(aut|automatico|cvt|dsg|dct|tiptronic|steptronic|powershift|dual(?:ogic)?|easytronic|at)\b|i[- ]?motion|s[- ]?tronic/.test(n))return 'Automático';
 if(/\b(manual|mec|mecanico|mt)\b/.test(n))return 'Manual';
 return null;
}
function gearScore(name,gear){
 if(!gear||gear==='Não informar')return 0;
 const found=gearInName(name);
 return !found?0:found===gear?3:-3;
}
function byGear(items,gear){
 return (items||[]).map((item,order)=>({item,order,score:gearScore(nameOf(item),gear)}))
  .sort((a,b)=>b.score-a.score||a.order-b.order).map(x=>x.item);
}
function bestModel(items,v){
 const engine=vehicleEngineText(v),cc=engine.match(/(\d\.\d)/),turbo=/turbo/i.test(engine);
 const cand=items.filter(x=>modelMatches(nameOf(x),v));
 if(!cand.length)return null;
 const score=x=>{
  const n=String(nameOf(x)||'');
  let p=0;
  if(cc&&n.includes(cc[1]))p+=10;
  if(turbo===/turbo|tsi|tgdi|thp|tce/i.test(n))p+=4;
  p+=gearScore(n,v.gear);
  p-=Math.abs(n.length-28)/40;
  return p;
 };
 return cand.slice().sort((a,b)=>score(b)-score(a))[0];
}
/* A FIPE não tem código de combustível para elétrico: o tipo escolhido no
   cadastro ordena as opções, mas nunca elimina nenhuma. */
function fuelScore(name,fuel){
 const n=fipeKey(name);
 if(fuel==='Elétrico'&&/eletric/.test(n))return 0;
 if(fuel==='Diesel'&&n.includes('diesel'))return 0;
 if(fuel==='Etanol'&&(n.includes('alcool')||n.includes('etanol')))return 0;
 if(/^Híbrido/.test(fuel||'')&&/hibrid/.test(n))return 0;
 if(n.includes('flex'))return 1;
 if(n.includes('gasolina'))return 2;
 return 3;
}
/* O documento do carro pode trazer 2016/2017: fabricação 2016, ano-modelo 2017.
   A FIPE consulta só o ano-modelo. Tentamos o ano informado e, se o modelo não
   existir nele, oferecemos o ano seguinte para confirmação — nunca escolhemos
   silenciosamente por conta própria. */
async function fipeFindInYear(v,brands,year){
 for(const b of brands){
  const all=listOf(await fipeGet(`${FIPE_API}/brands/${codeOf(b)}/years`));
  const years=all.filter(x=>String(codeOf(x)||'').startsWith(String(year)+'-'));
  if(!years.length)continue;
  const ordered=[...years].sort((a,b2)=>fuelScore(nameOf(a),v.fuel)-fuelScore(nameOf(b2),v.fuel));
  for(const y of ordered){
   const models=listOf(await fipeGet(`${FIPE_API}/brands/${codeOf(b)}/years/${codeOf(y)}/models`));
   const model=bestModel(models,v);
   if(model)return {brand:b,model,year:y,searched:year};
  }
 }
 return null;
}
async function fipeAuto(){
 const v=state.vehicle;
 if(!v)return;
 if(!v.year)return fipeList();
 resetFipeState();
 fipeState.status='loading';
 fipeState.message=`Procurando ${vehicleName(v)} ${v.year} na Tabela FIPE…`;
 paintFipe();
 try{
  if(!fipeBrands)fipeBrands=listOf(await fipeGet(FIPE_API+'/brands'));
  const brands=fipeBrandCandidates(vehicleBrand(v));
  if(!brands.length)throw new Error(`A FIPE não lista a marca ${vehicleBrand(v)}. Escolha outra marca no cadastro ou anote o valor à mão.`);
  const year=Number(v.year);
  let found=await fipeFindInYear(v,brands,year);
  if(found)return fipeSavePrice(found.brand,found.model,found.year);
  const next=await fipeFindInYear(v,brands,year+1);
  if(next){
   fipeState.status='confirm';
   fipeState.pending=next;
   fipeState.message='';
   return paintFipe();
  }
  throw new Error(`A FIPE não devolveu ${vehicleName(v)} em ${v.year} nem em ${year+1}.`);
 }catch(e){fipeFail(e);}
}
function fipeConfirmYear(){
 const p=fipeState.pending;
 if(!p)return fipeAuto();
 fipeState.pending=null;
 fipeSavePrice(p.brand,p.model,p.year,p.searched);
}
async function fipeSavePrice(brand,model,year,searchedYear){
 const v=state.vehicle;
 if(!v)return;
 fipeState.status='loading';
 fipeState.message='Buscando o valor da versão escolhida…';
 paintFipe();
 try{
  const d=await fipeGet(`${FIPE_API}/brands/${codeOf(brand)}/models/${codeOf(model)}/years/${codeOf(year)}`);
  const modelYear=d.modelYear??d.AnoModelo;
  v.fipe={
   brandCode:codeOf(brand),brandName:nameOf(brand),
   modelCode:codeOf(model),modelName:nameOf(model),yearCode:codeOf(year),
   value:repairText(d.price??d.Valor),
   brand:repairText(d.brand??d.Marca),
   model:repairText(d.model??d.Modelo),
   modelYear,
   registeredYear:searchedYear&&String(modelYear)!==String(v.year)?v.year:null,
   fuel:repairText(d.fuel??d.Combustivel),
   code:d.codeFipe??d.CodigoFipe,
   month:repairText(d.referenceMonth??d.MesReferencia),
   at:localDate(),manual:false
  };
  resetFipeState();
  save();
  if(fipeDialogOpen){fipeDialogOpen=false;closeDialog();}
  render();
  toast('Cotação da FIPE atualizada.');
 }catch(e){fipeFail(e);}
}
async function fipeRefresh(){
 const v=state.vehicle,f=v&&v.fipe;
 if(!f||!f.yearCode)return fipeAuto();
 fipeState.status='loading';
 fipeState.message='Atualizando a cotação…';
 paintFipe();
 /* com o código FIPE salvo a consulta é direta: 1 requisição em vez de 4 */
 if(f.code){
  try{
   const d=await fipeGet(`${FIPE_API}/${encodeURIComponent(f.code)}/years/${f.yearCode}`);
   v.fipe=Object.assign({},f,{
    value:repairText(d.price??f.value),model:repairText(d.model??f.model),
    modelYear:d.modelYear??f.modelYear,fuel:repairText(d.fuel??f.fuel),
    month:repairText(d.referenceMonth??f.month),at:localDate(),manual:false
   });
   resetFipeState();save();render();toast('Cotação da FIPE atualizada.');
   return;
  }catch(e){if(e?.code==='fipe/cancelled')return;/* o código pode não existir na tabela nova: cai no caminho longo */}
 }
 if(f.brandCode&&f.modelCode)return fipeSavePrice({code:f.brandCode,name:f.brandName},{code:f.modelCode,name:f.modelName},{code:f.yearCode});
 return fipeAuto();
}
async function fipeList(){
 const v=state.vehicle;
 if(!v)return;
 resetFipeState();
 fipeState.status='loading';
 fipeState.message='Carregando as versões da FIPE…';
 fipeDialogOpen=true;
 openDialog('Escolher na Tabela FIPE',fipePicker());
 paintFipe();
 try{
  if(!fipeBrands)fipeBrands=listOf(await fipeGet(FIPE_API+'/brands'));
  const brands=fipeBrandCandidates(vehicleBrand(v));
  if(!brands.length)throw new Error(`A FIPE não tem a marca ${vehicleBrand(v)} na lista dela.`);
  /* usa o cadastro da marca que realmente contém o modelo; se nenhum contém,
     mantém a primeira lista para a pessoa ainda poder procurar à mão */
  let used=null,all=[],hits=[];
  for(const b of brands){
   const items=listOf(await fipeGet(`${FIPE_API}/brands/${codeOf(b)}/models`));
   const found=items.filter(x=>modelMatches(nameOf(x),v));
   if(!used){used=b;all=items;hits=found;}
   if(found.length){used=b;all=items;hits=found;break;}
  }
  fipeState.brandCode=codeOf(used);fipeState.brandName=nameOf(used);
  fipeState.all=byGear(all,v.gear);
  fipeState.models=byGear(hits.length?hits:all,v.gear);
  fipeState.matched=hits.length>0;
  fipeState.status='ready';fipeState.step='models';
 }catch(e){return fipeFail(e);}
 paintFipe();
}
async function fipePickModel(code,name){
 fipeState.modelCode=code;fipeState.modelName=name;
 fipeState.status='loading';fipeState.message='Carregando os anos dessa versão…';
 paintFipe();
 try{
  fipeState.years=listOf(await fipeGet(`${FIPE_API}/brands/${fipeState.brandCode}/models/${code}/years`));
  fipeState.status='ready';fipeState.step='years';
 }catch(e){return fipeFail(e);}
 paintFipe();
}
function fipePickYear(code){
 return fipeSavePrice({code:fipeState.brandCode,name:fipeState.brandName},{code:fipeState.modelCode,name:fipeState.modelName},{code});
}
function fipeOptions(){
 const q=fipeKey(fipeState.filter);
 const rows=q?fipeState.all.filter(x=>fipeKey(nameOf(x)).includes(q)):fipeState.models;
 if(!rows.length)return '<p class="empty">Nenhuma versão com esse texto. Apague a busca para ver a lista inteira.</p>';
 return rows.slice(0,150).map(x=>`<button type="button" data-fipe-model="${esc(codeOf(x))}" data-fipe-name="${esc(nameOf(x))}">${esc(nameOf(x))}${icon('chevron')}</button>`).join('');
}
function fipePicker(){
 const v=state.vehicle;
 if(!v)return '<p class="body-text">Cadastre o carro primeiro.</p>';
 if(fipeState.status==='loading')return `<div class="loading"><span class="spin"></span>${esc(fipeState.message||'Carregando…')}</div>`;
 if(fipeState.status==='error')return `<div class="msgbox bad">${esc(fipeState.message)}</div><div class="form-actions"><button type="button" class="btn secondary" data-action="close">Fechar</button><button type="button" class="btn primary" data-action="fipeList">Tentar de novo</button></div>`;
 if(fipeState.step==='years'){
  const years=fipeState.years||[];
  const likely=v.year?years.filter(x=>String(nameOf(x)||'').startsWith(String(v.year))):[];
  const rest=years.filter(x=>likely.indexOf(x)<0);
  return `<p class="dialog-intro">Versão: <b>${esc(fipeState.modelName)}</b>. Agora escolha o ano e o combustível como a FIPE registra.</p>
  ${likely.length?`<div class="msgbox info">Seu cadastro diz <b>${esc(v.year)}</b> — deixei essas opções no topo.</div>`:''}
  <div class="opt-list">${likely.concat(rest).map(x=>`<button type="button" data-fipe-year="${esc(codeOf(x))}">${esc(nameOf(x))}${icon('chevron')}</button>`).join('')}</div>
  <div class="form-actions"><button type="button" class="btn secondary" data-action="fipeList">Voltar às versões</button></div>`;
 }
 return `<p class="dialog-intro">A FIPE separa cada versão do ${esc(vehicleModel(v)||'carro')}. Escolha a sua — é ela que define o valor.</p>
 ${fipeState.matched&&!fipeState.filter.trim()?`<div class="msgbox info">Deixei na lista ${fipeState.models.length===1?'a versão que combina':`as ${fipeState.models.length} versões que combinam`} com <b>${esc(vehicleModel(v))}</b>. Se a sua não estiver aqui, use a busca.</div>`:''}
 <div class="field full"><label for="fipe-search">Buscar na marca ${esc(fipeState.brandName||'')}</label><input id="fipe-search" type="search" value="${esc(fipeState.filter)}" placeholder="Ex.: 1.0 turbo flex" autocomplete="off" autocorrect="off" spellcheck="false"></div>
 <div class="opt-list" id="fipe-options">${fipeOptions()}</div>
 <div class="form-actions"><button type="button" class="btn secondary" data-action="close">Fechar</button><button type="button" class="btn primary" data-action="fipeManual">Anotar o valor à mão</button></div>`;
}
const fipeWhen=at=>{
 const days=Math.round((new Date(localDate()+'T12:00:00')-new Date(at+'T12:00:00'))/86400000);
 return days<=0?'consultado hoje':days===1?'consultado ontem':days<30?`consultado há ${days} dias`:'consultado em '+prettyDate(at);
};
/* A caixa da FIPE recolhe os detalhes, nunca a cotação: o título, o rótulo e o
   valor ficam sempre à vista — é o que se quer ver de relance. */
let fipeOpen=true;
function fipeCard(){
 const v=state.vehicle,f=v&&v.fipe;
 let topo,body,badge='';
 if(!temPremium()){
  topo='<p class="eyebrow">RECURSO DO PLANO PAGO</p>';
  body=premiumBloco();
 }else if(!v){
  topo='<p class="eyebrow">PRECISA DO CARRO CADASTRADO</p>';
  body=`<p class="body-text">A Tabela FIPE localiza o veículo pela marca, pelo modelo e pelo ano. Cadastre o carro para consultar o valor de referência.</p>${button('Cadastrar carro','addVehicle')}`;
 }else if(fipeState.status==='loading'){
  topo='<p class="eyebrow">CONSULTANDO</p>';
  body=`<div class="loading"><span class="spin"></span>${esc(fipeState.message||'Falando com a Tabela FIPE…')}</div>`;
 }else if(fipeState.status==='confirm'){
  const p=fipeState.pending||{};
  const found=String(p.searched||'');
  topo='<p class="eyebrow">CONFIRME O ANO</p>';
  body=`<div class="msgbox warn">A FIPE não achou ${esc(vehicleName(v))} <b>${esc(v.year)}</b>, mas achou como <b>${esc(v.year)}/${esc(found)}</b> — fabricado em ${esc(v.year)} e registrado como ano-modelo ${esc(found)}.</div>
  <p class="body-text">Confira no documento do carro. A cotação só abre depois da sua confirmação.</p>
  ${button(`Confirmar ${v.year}/${found}`,'fipeConfirmYear','check')}${button('Escolher na lista','fipeList','filter','secondary')}${button('Anotar o valor','fipeManual','edit','quiet')}`;
 }else if(fipeState.status==='error'&&!(f&&f.value)){
  topo='<p class="eyebrow">NÃO DEU PARA CONSULTAR</p>';
  body=`<div class="msgbox warn">${esc(fipeState.message)}</div><p class="body-text">Dá para escolher a versão na lista da FIPE ou anotar o valor à mão.</p>
  ${button('Escolher na lista','fipeList','filter')}${button('Tentar de novo','fipeAuto','refresh','secondary')}${button('Anotar o valor','fipeManual','edit','quiet')}`;
 }else if(f&&f.value){
  badge=f.manual?'<span class="tag none">Anotado por você</span>':'<span class="tag ok">Consultado</span>';
  const stale=!f.manual&&f.month&&!fipeKey(f.month).includes(fipeKey(new Date().toLocaleDateString('pt-BR',{month:'long'})));
  topo=`<p class="eyebrow">VALOR DE REFERÊNCIA</p><div class="fipe-price mono">${esc(f.value)}</div>`;
  body=`${fipeState.status==='error'?`<div class="msgbox warn"><b>Não deu para atualizar agora.</b> ${esc(fipeState.message)} Abaixo está a última cotação salva na sua conta.</div>`:''}
  <p class="small muted" style="margin-bottom:22px">${f.manual?'Valor anotado por você':`Tabela de ${esc((f.month||'—').trim())}`}${f.at?' · '+fipeWhen(f.at):''}</p>
  ${f.registeredYear?`<div class="msgbox info">Cadastro <b>${esc(f.registeredYear)}</b> · ano-modelo FIPE <b>${esc(f.modelYear)}</b>, confirmado por você.</div>`:''}
  ${stale?`<div class="msgbox info">A FIPE publica uma tabela nova todo mês. Esta é de ${esc((f.month||'').trim())}.</div>`:''}
  <div class="fipe-spec"><span>Modelo</span><b>${esc(f.model||vehicleModel(v))}</b></div>
  ${f.modelYear?`<div class="fipe-spec"><span>Ano do modelo</span><b>${esc(f.modelYear)}</b></div>`:''}
  ${f.fuel?`<div class="fipe-spec"><span>Combustível na FIPE</span><b>${esc(f.fuel)}</b></div>`:''}
  ${f.code?`<div class="fipe-spec"><span>Código FIPE</span><b class="mono">${esc(f.code)}</b></div>`:''}
  <p class="fipe-disclaimer">A FIPE é uma média de mercado, não uma avaliação do seu carro: estado, quilometragem e histórico mudam o preço real.</p>
  ${f.manual?button('Consultar a FIPE','fipeAuto','chart'):button('Atualizar cotação','fipeRefresh','refresh','secondary')}
  ${button('Escolher outra versão','fipeList','filter','quiet')}`;
 }else{
  topo='<p class="eyebrow">VALOR DE REFERÊNCIA</p>';
  body=`<p class="body-text">${v.year?'A consulta usa marca, modelo e ano do seu cadastro e traz o valor da tabela do mês.':'Sem o ano do modelo a busca automática não roda. Informe o ano no cadastro ou escolha a versão direto na lista da FIPE.'}</p>
  ${v.year?button('Consultar a FIPE','fipeAuto','chart'):''}${button('Escolher na lista','fipeList','filter',v.year?'secondary':'primary')}${button('Anotar o valor','fipeManual','edit','quiet')}`;
 }
 return `<aside class="panel fipe-card"><button type="button" class="icon-btn fold-toggle fipe-toggle ${fipeOpen?'open':''}" data-action="toggleFipe" aria-expanded="${fipeOpen}" aria-label="${fipeOpen?'Esconder os detalhes da FIPE':'Mostrar os detalhes da FIPE'}">${icon('chevron')}</button>
 <div class="card-heading"><h2>Tabela FIPE</h2>${badge}</div>${topo}${fipeOpen?body:''}</aside>`;
}

/* ---- estados salvos por versões anteriores do esboço ---- */
function normalizeState(){
 if(!Array.isArray(state.services))state.services=[];
 if(state.vehicle===undefined)state.vehicle=null;
 if(!state.servicePlan)state.servicePlan=state.vehicle?powertrain(state.vehicle.fuel):'combustao';
 if(!state.vehicleNudge)state.vehicleNudge='on';
 if(!Array.isArray(state.platforms)||!state.platforms.length)state.platforms=DEFAULT_PLATFORMS.slice();
 if(!Array.isArray(state.receipts))state.receipts=[];
 if(!Array.isArray(state.maintenance))state.maintenance=[];
 if(!PLANOS.some(([id])=>id===state.plan))state.plan='gratis';
 if(state.account===undefined)state.account=null;
 /* jornada salva antes da pausa existir: o que já tinha corrido continua correndo */
 if(state.activeShift&&state.activeShift.runningSince===undefined){
  state.activeShift.worked=0;
  state.activeShift.runningSince=state.activeShift.startedAt;
 }
 /* salvo quando encerrar era definitivo: a jornada de hoje volta a ser a de
    hoje, encerrada mas ainda à mão até a virada */
 if(!state.activeShift){
  const hoje=localDate(),i=state.shifts.findIndex(s=>s.date===hoje&&!s.auto);
  if(i>=0){const s=state.shifts.splice(i,1)[0];
   state.activeShift={id:s.id,date:s.date,startKm:s.startKm,startedAt:s.startedAt||Date.now(),worked:s.minutes||0,runningSince:null,endKm:s.endKm,endedAt:s.endedAt||Date.now()};}
 }
 closeStaleShift();
 /* o registro do antigo item "Filtros" fica com o filtro de óleo, que é o que
    se troca junto com o óleo; depois o plano é remontado para o motor em uso */
 state.services.forEach(s=>{if(RENAMED_SERVICES[s.id])s.id=RENAMED_SERVICES[s.id];});
 const plano=vehiclePlan();
 if((SERVICE_PLANS[plano]||[]).some(([id])=>!state.services.some(s=>s.id===id)))applyServicePlan(plano);
 if(rideFilter!=='Todas'&&!platformList().includes(rideFilter))rideFilter='Todas';
}
const actions={
 logout:()=>authAction(()=>session.logout()),
 logoutKeepPending:()=>authAction(()=>session.logout({keepPending:true})),
 retrySession:()=>authAction(()=>session.open(session.user)),
 reloadApp:()=>location.reload(),
 readTerms:()=>showLegalDocument('terms'),readPrivacy:()=>showLegalDocument('privacy'),
 togglePassword:()=>{const input=$('login-password'),button=$('password-toggle'),show=input.type==='password';input.type=show?'text':'password';button.setAttribute('aria-label',show?'Ocultar senha':'Mostrar senha');button.setAttribute('aria-pressed',String(show));button.innerHTML=passwordEye(show);},
 googleLogin:()=>authAction(()=>cloud.google()),createAccount:showSignup,recoverPassword:showRecovery,
 resendVerification:()=>authAction(async()=>{await cloud.resendVerification();toast('Confirmação reenviada. Confira seu e-mail.');}),
 checkVerification:()=>authAction(async()=>{if(!await session.checkVerification())toast('O e-mail ainda não foi confirmado. Abra o link da mensagem e tente novamente.');}),
 retrySync:()=>authAction(()=>session.retry()),exportData:()=>exportData(),exportPending:()=>exportData(true),
 askUseServerCopy:()=>openDialog('Carregar os dados da conta?','<p class="dialog-intro">As alterações pendentes deste navegador serão descartadas. Baixe uma cópia antes de continuar.</p><div class="form-actions"><button class="btn secondary" data-action="close">Cancelar</button><button class="btn primary" data-action="useServerCopy">Carregar dados da conta</button></div>'),
 useServerCopy:()=>authAction(()=>session.useServerCopy()),
 ride:showRide,expense:showExpense,close:closeDialog,goal:()=>openDialog('Sua meta diária',form('goal-form','Quanto você quer alcançar depois de descontar os gastos do dia?',field('Meta de resultado (R$)','goal','number',state.goal,'required min="1" max="999999" step="0.01" inputmode="decimal"',true),'Salvar meta')),odometer:()=>{openDialog('Atualizar quilometragem',form('odometer-form','Informe o número que aparece no odômetro do carro. Os prazos das revisões serão atualizados.',field('Quilometragem atual','km','number',state.km,'required min="0" max="9999999" step="1" inputmode="numeric"',true)+'<div class="field full" id="km-warn" hidden></div>','Atualizar km'));repaintKmWarning();},startShift:()=>{if(state.activeShift)return toast(journeyEnded(state.activeShift)?'A jornada de hoje foi encerrada. Toque em Continuar jornada para voltar a ela.':'Você já tem uma jornada em andamento.');openDialog('Iniciar jornada',form('start-form','Registre a quilometragem antes de começar. A distância será calculada ao encerrar.',field('Quilometragem inicial','km','number',state.km,`required min="${state.km}" max="9999999" step="1" inputmode="numeric"`,true),'Iniciar jornada'));},endShift:()=>{if(!state.activeShift)return;openDialog('Encerrar jornada',form('end-form',`Saída aos ${number(state.activeShift.startKm)} km. A leitura final também atualizará o painel de manutenção. Se voltar a rodar hoje, dá para continuar esta mesma jornada.`,field('Quilometragem final','km','number',state.km,`required min="${Math.max(state.km,state.activeShift.startKm)}" max="9999999" step="1" inputmode="numeric"`,true),'Encerrar jornada'));},pauseShift:()=>{const a=state.activeShift;if(!a)return toast('Não há jornada em andamento.');if(!a.runningSince)return toast('A jornada já está pausada.');a.worked=shiftMinutes(a);a.runningSince=null;save();render();toast('Jornada pausada. O tempo parou de contar.');},
resumeShift:()=>{const a=state.activeShift;if(!a)return toast('Não há jornada para continuar.');if(a.endKm!=null)return actions.reopenShift();if(a.runningSince)return toast('A jornada já está correndo.');a.runningSince=Date.now();save();render();toast('Jornada retomada. Bom trabalho!');},
/* Voltar a uma jornada encerrada: a leitura final deixa de valer e o relógio
   anda de novo de onde parou. A saída continua sendo a mesma, então a
   distância do dia segue sendo do começo ao fim, sem dobra. */
reopenShift:()=>{const a=state.activeShift;if(!a)return toast('Não há jornada de hoje para continuar.');if(a.endKm==null)return actions.resumeShift();a.endKm=null;a.endedAt=null;a.runningSince=Date.now();save();render();toast('Jornada retomada. Ela só fecha de vez quando o dia virar.');},
platforms:showPlatforms,addVehicle:()=>showVehicle(false),editVehicle:()=>showVehicle(true),
removeVehicle:()=>openDialog('Remover o carro?',`<p class="dialog-intro">O cadastro do carro e a cotação salva da FIPE saem da sua conta. Corridas, gastos e jornadas continuam como estão.</p><div class="form-actions"><button class="btn secondary" data-action="close">Cancelar</button><button class="btn danger" data-action="confirmRemoveVehicle">Remover carro</button></div>`),
confirmRemoveVehicle:()=>{state.vehicle=null;resetFipeState();save();closeDialog();render();toast('Carro removido. Você pode cadastrar de novo quando quiser.');},
dismissNudge:()=>{state.vehicleNudge='off';save();render();},
premiumAviso:()=>openDialog('Recurso do plano pago',`<p class="dialog-intro">O comprovante de corrida e a consulta à Tabela FIPE fazem parte dos planos Mensal e Anual. O plano pago também tira os anúncios.</p><div class="form-actions"><button class="btn secondary" data-action="close">Agora não</button><button class="btn primary" data-action="verPlanos">Ver os planos</button></div>`),
verPlanos:()=>{closeDialog();go('config-plano');},
askDeleteAccount:askDeleteAccount,toggleFipe:()=>{fipeOpen=!fipeOpen;render();},back:()=>{const sub=SUBVIEWS[view];const destino=sub?(sub.back||sub.parent||'inicio'):'inicio';if(telaAnterior()===destino)return void history.back();go(destino);},removeReceipt:()=>{state.receipts=state.receipts.filter(r=>r.id!==receiptToRemove);if(receiptsOpen)receiptsOpen.delete(receiptToRemove);receiptToRemove=null;save();closeDialog();render();toast('Comprovante excluído.');},
removeMaintenance:()=>{const id=maintenanceToRemove;if(!id)return;state.maintenance=(state.maintenance||[]).filter(m=>m.id!==id);state.expenses=state.expenses.filter(e=>e.maintenanceId!==id);if(maintenanceOpen)maintenanceOpen.delete(id);maintenanceMonthsOpen=null;historyOpen=null;maintenanceToRemove=null;save();closeDialog();render();toast('Manutenção excluída. O gasto saiu junto.');},
fipeAuto:fipeAuto,fipeList:fipeList,fipeRefresh:fipeRefresh,fipeConfirmYear:fipeConfirmYear,
fipeManual:()=>{
 const v=state.vehicle;
 if(!v)return toast('Cadastre o carro para anotar a cotação.');
 fipeDialogOpen=false;
 const atual=v.fipe&&v.fipe.manual&&Number.isFinite(v.fipe.valueNumber)?v.fipe.valueNumber:'';
 openDialog('Anotar o valor da FIPE',form('fipe-manual-form','Consultou no site da FIPE? Anote aqui o valor que apareceu. Ele fica salvo na sua conta.',field('Valor (R$)','value','number',atual,'required min="0.01" max="9999999" step="0.01" inputmode="decimal" placeholder="0,00"')+field('Ano do modelo','modelYear','number',v.year||'',`min="1950" max="${maxYear()}" step="1" inputmode="numeric"`)+`<p class="small muted" style="grid-column:1/-1">A consulta oficial fica em <a href="${FIPE_SITE}" target="_blank" rel="noopener noreferrer">veiculos.fipe.org.br</a>.</p>`,'Salvar valor'));
},
about:()=>openDialog('LucroInDrive','<p class="dialog-intro">Corridas, gastos e manutenção organizados na sua conta. Versão de testes com autenticação e armazenamento no Firebase.</p><p class="body-text">Suporte: <a href="mailto:lucroindrive@gmail.com">lucroindrive@gmail.com</a></p><button class="btn primary" data-action="close">Voltar</button>')};
const AUTH_ACTIONS=new Set(['logout','logoutKeepPending','retrySession','reloadApp','readTerms','readPrivacy','togglePassword','googleLogin','createAccount','recoverPassword','resendVerification','checkVerification','close','exportPending','askUseServerCopy','useServerCopy','askDeleteAccount']);
document.addEventListener('click',e=>{const el=e.target.closest('button');if(!el||el.disabled)return;if(session?.phase!=='ready'&&!AUTH_ACTIONS.has(el.dataset.action))return;if(el.dataset.view)go(el.dataset.view);if(el.dataset.plan)escolherPlano(el.dataset.plan);if(el.dataset.period){period=el.dataset.period;render();}if(el.dataset.service)showService(el.dataset.service);if(el.dataset.month!==undefined)toggleHistoryMonth(Number(el.dataset.month));if(el.dataset.rideMonth!==undefined)toggleRideMonth(Number(el.dataset.rideMonth));if(el.dataset.rideDay)toggleRideDay(el.dataset.rideDay);if(el.dataset.expenseDay)toggleExpenseDay(el.dataset.expenseDay);if(el.dataset.rideReceipt)receiptFromRide(el.dataset.rideReceipt);if(el.dataset.journeyMonth)toggleJourneyMonth(el.dataset.journeyMonth);if(el.dataset.journey)toggleJourney(el.dataset.journey);if(el.dataset.receipt)toggleReceipt(el.dataset.receipt);if(el.dataset.receiptRemove)askRemoveReceipt(el.dataset.receiptRemove);if(el.dataset.maintenanceMonth)toggleMaintenanceMonth(el.dataset.maintenanceMonth);if(el.dataset.maintenance)toggleMaintenance(el.dataset.maintenance);if(el.dataset.maintenanceRemove)askRemoveMaintenance(el.dataset.maintenanceRemove);if(el.dataset.share)shareReceipt(el.dataset.share,el.dataset.receiptId);if(el.dataset.platformRemove)removePlatform(el.dataset.platformRemove);if(el.dataset.color&&vehicleDraft){readVehicleDraft();vehicleDraft.color=el.dataset.color;repaintVehicleForm();}if(el.dataset.fipeModel)fipePickModel(el.dataset.fipeModel,el.dataset.fipeName||'');if(el.dataset.fipeYear)fipePickYear(el.dataset.fipeYear);if(el.dataset.action&&actions[el.dataset.action])actions[el.dataset.action]();});
document.addEventListener('change',e=>{if(e.target.id==='consent-confirm'){consentPending=e.target.checked;$('consent-enter').disabled=!consentPending;$('consent-status').textContent=consentPending?'Tudo pronto para continuar.':'Confirme sua idade e o aceite para continuar.';}if(e.target.id==='ride-filter'){rideFilter=e.target.value;rideHistoryOpen=null;rideDaysOpen=null;render();}if(e.target.id==='ride-year'){rideYear=Number(e.target.value);rideHistoryOpen=null;rideDaysOpen=null;render();}if(e.target.id==='history-year'){historyYear=Number(e.target.value);historyOpen=null;expenseDaysOpen=null;render();}if(e.target.id==='journey-year'){journeyYear=Number(e.target.value);journeyMonthsOpen=null;journeysOpen=null;render();}if(e.target.id==='maintenance-year'){maintenanceYear=Number(e.target.value);maintenanceMonthsOpen=null;maintenanceOpen=null;render();}if(e.target.id==='expense-filter'){expenseFilter=e.target.value;historyOpen=null;expenseDaysOpen=null;render();}if(vehicleDraft&&e.target.form&&e.target.form.id==='vehicle-form'&&['brand','model','versionIdx','fuel'].includes(e.target.name)){readVehicleDraft();syncVehicleDraft(e.target.name);repaintVehicleForm(e.target.name);}});
document.addEventListener('input',e=>{if(e.target.id==='f-km'&&e.target.form&&e.target.form.id==='odometer-form')repaintKmWarning();if(e.target.id==='fipe-search'){fipeState.filter=e.target.value;if($('fipe-options'))$('fipe-options').innerHTML=fipeOptions();}if(receiptDraft&&e.target.form&&e.target.form.id==='receipt-form'){readReceiptDraft();if($('receipt-preview'))$('receipt-preview').textContent=receiptText(receiptDraft);}});
document.addEventListener('submit',e=>{
 e.preventDefault();const formEl=e.target;if(authBusy)return;if(!formEl.checkValidity()){formEl.reportValidity();return;}const d=Object.fromEntries(new FormData(formEl)),fail=m=>formError(m);let message='';
 if(['login-form','signup-form','recovery-form','delete-account-form'].includes(formEl.id)){void authAction(()=>handleAuthForm(formEl,d));return;}
 if(formEl.id==='consent-form'){completeConsent();return;}
 if(session?.phase!=='ready')return;
 if(d.date&&d.date>localDate())return fail('Escolha hoje ou uma data anterior.');
 switch(formEl.id){
 case 'ride-form':state.rides.push({id:uid(),platform:d.platform,amount:Number(d.amount),km:Number(d.km),date:d.date,time:d.time,payment:d.payment});message='Corrida adicionada. Seus ganhos foram atualizados.';break;
 case 'expense-form':state.expenses.push({id:uid(),category:d.category,amount:Number(d.amount),description:d.description.trim()||d.category,date:d.date});message='Gasto adicionado ao seu resumo.';break;
 case 'goal-form':state.goal=Number(d.goal);message='Meta diária atualizada.';break;
 case 'odometer-form':{const novo=Number(d.km),antes=state.km;state.km=novo;message=novo<antes?`Odômetro voltou de ${number(antes)} km para ${number(novo)} km. Os prazos das revisões foram recalculados.`:'Quilometragem e prazos de manutenção atualizados.';break;}
 case 'start-form':if(state.activeShift)return fail('Já existe uma jornada de hoje. Continue a dela em vez de abrir outra.');state.km=Number(d.km);state.activeShift={id:uid(),date:localDate(),startKm:Number(d.km),startedAt:Date.now(),worked:0,runningSince:Date.now(),endKm:null};message='Jornada iniciada. Você pode pausar, encerrar e voltar quando quiser.';break;
 case 'end-form':{const a=state.activeShift;if(!a)return fail('Não há uma jornada em andamento.');a.worked=shiftMinutes(a);a.runningSince=null;a.endKm=Number(d.km);a.endedAt=Date.now();state.km=Number(d.km);message='Jornada encerrada. Se voltar a rodar hoje, é só continuar: ela fecha de vez na virada do dia.';break;}
 case 'stale-km-form':{const a=staleAsk;if(!a)return fail('Jornada não encontrada.');const j=state.shifts.find(x=>x.id===a.id);if(!j)return fail('Jornada não encontrada.');const km=Number(d.km);if(km<j.startKm)return fail(`A leitura do fim não pode ser menor que a da saída (${number(j.startKm)} km).`);j.endKm=km;state.km=Math.max(state.km,km);staleAsk=null;message=`Jornada de ${prettyDate(j.date)} fechada com ${number(km)} km.`;break;}
 case 'service-form':{const s=state.services.find(s=>s.id===d.serviceId);if(!s)return fail('Serviço não encontrado.');const km=Number(d.km),nextKm=d.nextKm?Number(d.nextKm):null,amount=d.amount?Number(d.amount):0;if(!nextKm&&!d.nextDate)return fail('Informe a próxima quilometragem ou a próxima data.');if(nextKm!==null&&nextKm<=km)return fail('A próxima quilometragem precisa ser maior que a do serviço.');if(d.nextDate&&d.nextDate<=d.date)return fail('A próxima data precisa ser posterior à data do serviço.');if(s.lastDate&&d.date<s.lastDate)return fail('A data precisa ser igual ou posterior à última revisão registrada.');if(s.lastKm!=null&&km<s.lastKm)return fail('A quilometragem não pode ser menor que a da última revisão.');s.lastKm=km;s.lastDate=d.date;s.nextKm=nextKm;s.nextDate=d.nextDate||null;state.km=Math.max(state.km,km);state.serviceHistory=state.serviceHistory||[];const serviceRecordId=uid();state.serviceHistory.push({id:serviceRecordId,serviceId:s.id,date:d.date,km,amount,shop:d.shop.trim(),nextKm,nextDate:d.nextDate||null});if(amount>0)state.expenses.push({id:uid(),category:'Manutenção',description:s.name+(d.shop.trim()?' · '+d.shop.trim():''),date:d.date,amount,serviceId:serviceRecordId});message=amount>0?'Revisão salva e valor incluído nos gastos.':'Revisão salva. Próximos prazos atualizados.';break;}
 case 'maintenance-form':{
  const desc=String(d.description||'').trim().replace(/\s+/g,' ');
  const valor=Number(d.amount),km=Number(d.km),oficina=String(d.shop||'').trim();
  if(!desc)return fail('Escreva o que foi feito.');
  if(!Number.isFinite(valor)||valor<=0)return fail('Informe quanto custou.');
  if(!Number.isFinite(km)||km<0||km>9999999)return fail('Informe a quilometragem só em números.');
  const registro={id:uid(),date:d.date,description:desc,km,amount:valor,shop:oficina};
  state.maintenance=state.maintenance||[];
  state.maintenance.push(registro);
  /* mesma regra dos gastos do dia a dia: entra no Financeiro pela data */
  state.expenses.push({id:uid(),category:'Manutenção',description:desc+(oficina?' · '+oficina:''),date:d.date,amount:valor,maintenanceId:registro.id});
  state.km=Math.max(state.km,km);
  maintenanceYear=Number(d.date.slice(0,4));maintenanceMonthsOpen=null;maintenanceOpen=null;historyOpen=null;expenseDaysOpen=null;
  message='Manutenção registrada e lançada nos gastos.';
  break;
 }
 case 'platform-form':{
  const nome=String(d.name||'').trim().replace(/\s+/g,' ');
  if(!nome)return fail('Digite o nome da plataforma.');
  const lista=platformList();
  if(lista.length>=12)return fail('São até 12 plataformas. Remova alguma para acrescentar outra.');
  const chave=x=>x.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
  if(lista.some(x=>chave(x)===chave(nome)))return fail(`${nome} já está na sua lista.`);
  state.platforms=[...lista,nome];
  save();repaintPlatforms();render();
  const campo=$('f-name');if(campo)campo.focus();
  toast(`${nome} entrou nas suas plataformas.`);
  return;
 }
 case 'receipt-form':{
  readReceiptDraft();
  const r=receiptDraft,valor=Number(r.amount);
  if(!String(r.car).trim())return fail('Informe o carro.');
  if(!String(r.from).trim())return fail('Informe o local de saída.');
  if(!String(r.to).trim())return fail('Informe o local de chegada.');
  if(!Number.isFinite(valor)||valor<=0)return fail('Informe o valor pago.');
  const comprovante={id:uid(),date:r.date,car:String(r.car).trim(),from:String(r.from).trim(),to:String(r.to).trim(),amount:valor};
  state.receipts.push(comprovante);
  receiptDraft=null;
  receiptsOpen=new Set([comprovante.id]);
  save();
  go('corridas-comprovantes');
  toast('Comprovante gerado e guardado. Agora é só enviar.');
  return;
 }
 case 'vehicle-form':{
  readVehicleDraft();
  const dr=vehicleDraft,antigo=state.vehicle;
  const marca=dr.brand===OTHER?dr.brandOther.trim():dr.brand;
  if(!marca)return fail('Escolha a marca na lista ou digite qual é.');
  const modelo=(dr.brand===OTHER||dr.model===OTHER)?dr.modelOther.trim():dr.model;
  if(!modelo)return fail('Escolha o modelo na lista ou digite qual é.');
  const ano=String(dr.year).trim()===''?null:Number(dr.year);
  if(ano!==null&&(!Number.isInteger(ano)||ano<1950||ano>maxYear()))return fail(`Informe um ano entre 1950 e ${maxYear()}.`);
  const placa=String(dr.plate).trim().toUpperCase().replace(/[^A-Z0-9]/g,'');
  if(placa&&!plateOK(placa))return fail('A placa tem sete caracteres: ABC1234 ou ABC1D23.');
  const km=String(dr.km).trim()===''?null:Number(dr.km);
  if(km!==null&&(!Number.isFinite(km)||km<0||km>9999999))return fail('Informe a quilometragem só em números.');
  const escolhida=versionsOf(dr.brand,dr.model)[Number(dr.versionIdx)];
  const digitada=parseVersion(dr.versionOther);
  const anoTxt=ano?String(ano):'';
  /* mudar marca, modelo ou ano invalida a cotação que estava salva */
  const mesmoCarro=!!antigo&&antigo.brand===dr.brand&&antigo.brandOther===dr.brandOther.trim()&&antigo.model===dr.model&&antigo.modelOther===dr.modelOther.trim()&&String(antigo.year||'')===anoTxt;
  const planoAntes=vehiclePlan(),primeiro=!antigo;
  state.vehicle={brand:dr.brand,brandOther:dr.brandOther.trim(),model:dr.model,modelOther:dr.modelOther.trim(),
   versionIdx:dr.versionIdx,versionOther:dr.versionOther.trim(),version:escolhida?versionBase(escolhida):dr.versionOther.trim(),
   cc:escolhida?escolhida.c:digitada.cc,turbo:escolhida?!!escolhida.t:digitada.turbo,
   fuel:dr.fuel,gear:dr.gear,year:anoTxt,plate:placa,color:dr.color,
   fipe:mesmoCarro&&antigo.fipe?antigo.fipe:null};
  if(km!==null)state.km=km;
  const plano=powertrain(dr.fuel);
  if(primeiro||plano!==planoAntes)applyServicePlan(plano,primeiro);
  else state.servicePlan=plano;
  resetFipeState();
  message=primeiro
   ?(plano==='eletrico'?'Carro elétrico cadastrado. O painel de manutenção veio sem troca de óleo e começou sem registros.'
     :'Carro cadastrado. O painel de manutenção começou sem registros — informe cada revisão conforme fizer.')
   :(plano!==planoAntes?'Cadastro atualizado. O painel de manutenção mudou para o novo tipo de motor.':'Cadastro do carro atualizado.');
  break;
 }
 case 'fipe-manual-form':{
  const v=state.vehicle;
  if(!v)return fail('Cadastre o carro primeiro.');
  const n=Number(d.value);
  if(!Number.isFinite(n)||n<=0)return fail('Informe um valor maior que zero.');
  v.fipe={value:money(n),valueNumber:n,manual:true,at:localDate(),
   model:vehicleModel(v),modelYear:d.modelYear||v.year||null,fuel:v.fuel,month:null,code:null};
  resetFipeState();
  message='Valor da FIPE anotado na sua conta.';
  break;
 }
 default:return;
 }
 save();closeDialog();render();toast(message);
});
/* o ícone do app mora no --icon-app do CSS; o favicon e o atalho da tela
   inicial pegam dali, para o arquivo não carregar a imagem duas vezes */
const iconURL=getComputedStyle(document.documentElement).getPropertyValue('--icon-app').trim().replace(/^url\(["']?/,'').replace(/["']?\)$/,'');
['app-icon','app-icon-touch'].forEach(id=>{if($(id))$(id).href=iconURL;});
/* "Adicionar à tela de início": o manifesto é montado aqui para reaproveitar a
   mesma imagem embutida. Os PNG maiores entram quando a pasta icones/ está
   publicada junto; quem abre o arquivo solto fica com o ícone de 192. */
$('app-manifest').href='/manifest.webmanifest';
hydrateIcons();void startAccount();
window.addEventListener('online',()=>{if(session?.phase==='ready'&&session.error)void session.retry();});
window.addEventListener('beforeunload',event=>{if(session?.pending||session?.writing){event.preventDefault();event.returnValue='';}});
setInterval(()=>{
 if(session?.phase!=='ready'||!hasConsent())return;
 const fechou=closeStaleShift();
 if(fechou){save();if(!$('dialog').open)render();return;}
 if(state.activeShift&&journeyRunning(state.activeShift)&&view==='inicio'&&!$('dialog').open)render();
},60000);
