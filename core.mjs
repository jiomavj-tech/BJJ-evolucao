import { validBeltState, validBjjSession } from './bjj.mjs';
import { validTechState } from './techniques.mjs';
import { validGameplan } from './gameplan.mjs';
import { validInjuries } from './injuries.mjs';
/** Núcleo independente de interface — Calistenia + BJJ 0.1 */
export const VERSION = 1;
export const DEFAULT_PROFILE = Object.freeze({
  name: '', belt: 'branca', style: 'guarda', goal: 'forca', level: 'iniciante',
  equipment: 'corpo', days: 2, readiness: 3, caution: false
});

// Cada exercício tem um único identificador. Todos os treinos apontam para estes registros.
// time: true -> prescrição em segundos; time: false -> repetições.
export const EXERCISES = [
  {id:'marcha',name:'Marcha ativa e articulações',category:'aquecimento',level:1,gear:'corpo',focus:['geral'],pattern:'aquecimento',sets:1,dose:'3–5 min',time:true,why:'Elevar gradualmente a temperatura corporal.',steps:['Marche no lugar em ritmo confortável.','Faça movimentos suaves de ombros, tornozelos e quadril.'],caution:'Evite movimentos que provoquem dor.'},
  {id:'gato-vaca',name:'Mobilidade gato-vaca',category:'mobilidade',level:1,gear:'corpo',focus:['quadril','tronco'],pattern:'mobilidade',sets:2,dose:'6–8 ciclos',why:'Explorar movimentos controlados da coluna.',steps:['Apoie mãos e joelhos no chão.','Alterne lentamente entre flexão e extensão confortáveis.'],caution:'Não force amplitude nem trabalhe com dor irradiada.'},
  {id:'quadril90',name:'Troca de quadril 90/90',category:'mobilidade',level:1,gear:'corpo',focus:['quadril','guarda'],pattern:'mobilidade',sets:2,dose:'6 por lado',why:'Ganhar controle ativo das rotações do quadril.',steps:['Sente com os joelhos dobrados a 90 graus.','Troque lentamente o lado dos joelhos mantendo postura confortável.'],caution:'Reduza a amplitude se houver desconforto no quadril ou lombar.'},
  {id:'toracica',name:'Rotação torácica em quatro apoios',category:'mobilidade',level:1,gear:'corpo',focus:['tronco'],pattern:'mobilidade',sets:2,dose:'6 por lado',why:'Trabalhar mobilidade torácica e controle.',steps:['Em quatro apoios, coloque uma mão na nuca.','Gire o tronco suavemente sem puxar o pescoço.'],caution:'Faça amplitudes pequenas se necessário.'},
  {id:'respirar',name:'Respiração diafragmática',category:'recuperacao',level:1,gear:'corpo',focus:['geral'],pattern:'respiracao',sets:2,dose:'60 s',time:true,why:'Desacelerar ao final da sessão.',steps:['Fique deitado ou sentado confortavelmente.','Respire de forma tranquila, sem prender o ar.'],caution:'Interrompa em caso de tontura ou falta de ar.'},
  {id:'prancha',name:'Prancha frontal',category:'forca',level:1,gear:'corpo',focus:['tronco','guarda'],pattern:'core',sets:3,dose:'15–25 s',time:true,why:'Estabilidade do tronco.',steps:['Apoie antebraços e pontas dos pés; use joelhos se necessário.','Mantenha respiração livre e coluna neutra.'],caution:'Interrompa se houver dor lombar.'},
  {id:'lateral',name:'Prancha lateral (ajoelhada)',category:'forca',level:1,gear:'corpo',focus:['tronco','base'],pattern:'core',sets:3,dose:'15–25 s/lado',time:true,why:'Resistir à inclinação lateral do tronco.',steps:['Apoie um antebraço e o joelho inferior.','Eleve o quadril e sustente sem prender o ar.'],caution:'Não faça se houver dor no ombro.'},
  {id:'deadbug',name:'Dead bug',category:'forca',level:1,gear:'corpo',focus:['tronco','guarda'],pattern:'core',sets:3,dose:'6–10 por lado',why:'Controle de tronco com braços e pernas em movimento.',steps:['Deite de costas e eleve braços e pernas.','Estenda lentamente membros opostos sem perder o controle do tronco.'],caution:'Reduza a alavanca se a lombar incomodar.'},
  {id:'bird-dog',name:'Bird dog',category:'forca',level:1,gear:'corpo',focus:['tronco','base'],pattern:'core',sets:3,dose:'6 por lado',why:'Coordenação e estabilidade.',steps:['Em quatro apoios, estenda braço e perna opostos.','Segure 2 segundos sem girar o quadril.'],caution:'Execute somente na amplitude confortável.'},
  {id:'flexao-parede',name:'Flexão inclinada na parede',category:'forca',level:1,gear:'corpo',focus:['empurrar','base'],pattern:'empurrar',sets:3,dose:'8–12',why:'Fortalecimento gradual de peitoral e tríceps.',steps:['Posicione as mãos na parede na altura do peito.','Flexione os cotovelos e empurre de volta controladamente.'],caution:'Não force punhos ou ombros.'},
  {id:'flexao',name:'Flexão de braços',category:'forca',level:2,gear:'corpo',focus:['empurrar','base'],pattern:'empurrar',sets:3,dose:'6–12',why:'Força de empurrar.',steps:['Mãos um pouco além da largura dos ombros.','Desça com controle e empurre mantendo o corpo alinhado.'],caution:'Use apoio elevado para reduzir a dificuldade.'},
  {id:'flexao-tempo',name:'Flexão com descida lenta',category:'forca',level:3,gear:'corpo',focus:['empurrar'],pattern:'empurrar',sets:3,dose:'5–8',why:'Trabalhar controle e força.',steps:['Desça por aproximadamente 3 segundos.','Suba sem perder o alinhamento.'],caution:'Evite se não domina a flexão convencional.'},
  {id:'agachamento-caixa',name:'Sentar e levantar de um banco',category:'forca',level:1,gear:'corpo',focus:['pernas','base'],pattern:'perna',sets:3,dose:'8–12',why:'Força de pernas com amplitude ajustável.',steps:['Sente e levante de banco firme sem impulso exagerado.','Mantenha os pés apoiados.'],caution:'Não utilize banco instável.'},
  {id:'agachamento',name:'Agachamento livre',category:'forca',level:2,gear:'corpo',focus:['pernas','base'],pattern:'perna',sets:3,dose:'8–12',why:'Força de membros inferiores.',steps:['Afaste os pés em posição confortável.','Agache dentro da amplitude controlada e retorne.'],caution:'Reduza amplitude e volume em caso de dor.'},
  {id:'afundo',name:'Afundo com apoio',category:'forca',level:2,gear:'corpo',focus:['pernas','base','quedas'],pattern:'perna',sets:3,dose:'6–10/lado',why:'Estabilidade unilateral e força de pernas.',steps:['Segure apoio firme se preciso.','Flexione suavemente joelhos e retorne.'],caution:'Evite impactos e perda de equilíbrio.'},
  {id:'ponte-gluteo',name:'Ponte de glúteos no chão',category:'forca',level:1,gear:'corpo',focus:['quadril','guarda'],pattern:'quadril',sets:3,dose:'10–15',why:'Ativação de glúteos e extensão de quadril.',steps:['Deite com joelhos dobrados e pés apoiados.','Eleve quadril de forma lenta, sem hiperestender a lombar.'],caution:'Interrompa se a lombar incomodar.'},
  {id:'ponte-uni',name:'Ponte de glúteos unilateral',category:'forca',level:3,gear:'corpo',focus:['quadril','guarda'],pattern:'quadril',sets:3,dose:'6–10/lado',why:'Força unilateral de quadril.',steps:['Parta da ponte simples.','Eleve uma perna, mantendo o quadril nivelado.'],caution:'Faça somente após dominar a ponte bilateral.'},
  {id:'toalha',name:'Aperto de toalha',category:'forca',level:1,gear:'corpo',focus:['pegada','guarda'],pattern:'pegada',sets:3,dose:'20–30 s',time:true,why:'Resistência de pegada, sem usar ancoragem.',steps:['Enrole uma toalha nas mãos.','Aperte de modo firme e confortável e relaxe ao final.'],caution:'Evite se houver dor nos dedos ou tendões.'},
  {id:'remada-isom',name:'Remada isométrica com toalha sob os pés',category:'forca',level:1,gear:'corpo',focus:['puxar','pegada'],pattern:'puxar',sets:3,dose:'15–25 s',time:true,why:'Treinar tensão de puxada sem barra.',steps:['Sente com os joelhos levemente flexionados e a toalha sob os pés.','Puxe as pontas em direção ao tronco enquanto os pés resistem.'],caution:'Não faça movimentos bruscos ou prenda a respiração.'},
  {id:'escapula',name:'Retração escapular em pé',category:'forca',level:1,gear:'corpo',focus:['puxar','tronco'],pattern:'puxar',sets:3,dose:'10–15',why:'Controle dos músculos da parte alta das costas.',steps:['Em pé, mantenha braços junto ao corpo.','Aproxime suavemente as escápulas e solte.'],caution:'Evite elevar ou contrair demais o pescoço.'},
  {id:'shrimp',name:'Fuga de quadril (shrimp)',category:'drill',level:2,gear:'corpo',focus:['guarda','quadril'],pattern:'drill',sets:3,dose:'5–8/lado',why:'Coordenação do movimento usado nas fugas e ajustes de guarda.',steps:['Deite de costas com joelhos dobrados.','Empurre o solo e desloque quadril lateralmente sem pressa.'],caution:'Evite caso cause sintomas na lombar.'},
  {id:'technical-stand',name:'Levantada técnica',category:'drill',level:2,gear:'corpo',focus:['quedas','base'],pattern:'drill',sets:3,dose:'5/lado',why:'Levantar protegendo base e equilíbrio.',steps:['Sente com uma mão e o pé contrário apoiados.','Eleve quadril, recolha a perna livre e levante com controle.'],caution:'Faça devagar; use apoio se necessário.'},
  {id:'base-shift',name:'Troca de base no solo',category:'drill',level:1,gear:'corpo',focus:['passagem','base'],pattern:'drill',sets:3,dose:'6 por lado',why:'Controle e transferência de peso.',steps:['Em quatro apoios, transfira suavemente o peso.','Mude a posição de base sem perder estabilidade.'],caution:'Não aplique pressão excessiva nos punhos.'},
  {id:'sprawl',name:'Sprawl controlado',category:'drill',level:3,gear:'corpo',focus:['quedas','condicionamento'],pattern:'drill',sets:3,dose:'5–8',why:'Coordenação de defesa de queda.',steps:['Em pé, apoie as mãos no chão e leve os pés para trás.','Volte de modo controlado, sem bater o quadril no chão.'],caution:'Evite com dor lombar, no punho ou sobrecarga excessiva.'},
  {id:'stepup',name:'Subida em degrau baixo',category:'forca',level:1,gear:'corpo',focus:['pernas','quedas'],pattern:'perna',sets:3,dose:'8/lado',why:'Força e estabilidade unilateral.',steps:['Suba em degrau estável e baixo.','Desça devagar, mantendo o controle.'],caution:'Use apoio e altura baixa.'},
  {id:'caminhada',name:'Caminhada em ritmo confortável',category:'condicionamento',level:1,gear:'corpo',focus:['condicionamento'],pattern:'cardio',sets:1,dose:'10–20 min',time:true,why:'Construir base aeróbica de baixo impacto.',steps:['Escolha ritmo que permita conversar.','Diminua a intensidade caso fique ofegante demais.'],caution:'Interrompa diante de tontura, falta de ar anormal ou dor no peito.'},
  {id:'intervalo-marcha',name:'Marcha intervalada',category:'condicionamento',level:1,gear:'corpo',focus:['condicionamento'],pattern:'cardio',sets:5,dose:'40 s / 40 s leve',time:true,why:'Introdução ao trabalho intervalado.',steps:['Alterne 40 s de marcha ativa e 40 s mais leves.','Mantenha esforço moderado.'],caution:'Em dia de fadiga intensa, prefira descanso.'},
  {id:'saltitos',name:'Polichinelos sem salto',category:'condicionamento',level:1,gear:'corpo',focus:['condicionamento','base'],pattern:'cardio',sets:3,dose:'30–45 s',time:true,why:'Condicionamento leve e coordenação.',steps:['Abra e feche as pernas alternadamente, sem saltar.','Mova os braços em ritmo controlado.'],caution:'Diminua a cadência se houver incômodo.'},
  {id:'barra',name:'Barra fixa assistida',category:'forca',level:2,gear:'barra',focus:['puxar','pegada'],pattern:'puxar',sets:3,dose:'4–8',why:'Força específica de puxada.',steps:['Use apoio para reduzir o peso sustentado.','Puxe com controle e desça lentamente.'],caution:'Use estrutura fixada e inspecionada; não force mãos ou ombros.'},
  {id:'suspensao',name:'Suspensão na barra',category:'forca',level:2,gear:'barra',focus:['pegada','puxar'],pattern:'pegada',sets:3,dose:'10–20 s',time:true,why:'Resistência de pegada e ombros.',steps:['Segure barra estável e mantenha escápulas controladas.','Apoie os pés para reduzir carga se necessário.'],caution:'Não use em estruturas improvisadas.'},
  {id:'remada-elastico',name:'Remada com elástico',category:'forca',level:1,gear:'barra',focus:['puxar','pegada'],pattern:'puxar',sets:3,dose:'10–15',why:'Puxada horizontal com resistência ajustável.',steps:['Prenda elástico a ponto seguro na altura do peito.','Traga cotovelos para trás mantendo ombros relaxados.'],caution:'Verifique ancoragem e integridade do elástico.'},
  {id:'pallof',name:'Pallof press com elástico',category:'forca',level:2,gear:'barra',focus:['tronco','base'],pattern:'core',sets:3,dose:'8/lado',why:'Resistir à rotação do tronco.',steps:['Com elástico lateralmente ancorado, fique em pé.','Estenda os braços à frente sem girar o tronco.'],caution:'Verifique a ancoragem; não force rotações.'},
  {id:'remada-maquina',name:'Remada sentada na máquina',category:'musculacao',level:1,gear:'academia',focus:['puxar','pegada'],pattern:'puxar',sets:3,dose:'8–12',why:'Força de puxada com carga controlada.',steps:['Ajuste banco e pegada à sua altura.','Puxe e devolva o peso com controle.'],caution:'Use carga que preserve técnica; peça orientação presencial.'},
  {id:'puxada',name:'Puxada alta na polia',category:'musculacao',level:1,gear:'academia',focus:['puxar','pegada'],pattern:'puxar',sets:3,dose:'8–12',why:'Força vertical de puxada.',steps:['Ajuste a máquina e segure a barra.','Traga em direção ao peito sem inclinar demais.'],caution:'Evite puxar atrás da nuca.'},
  {id:'supino',name:'Supino com halteres',category:'musculacao',level:2,gear:'academia',focus:['empurrar'],pattern:'empurrar',sets:3,dose:'8–10',why:'Desenvolver força de empurrar.',steps:['Deite no banco e estabilize os ombros.','Empurre halteres com controle, sem perder alinhamento.'],caution:'Peça auxílio com carga elevada.'},
  {id:'legpress',name:'Leg press com amplitude confortável',category:'musculacao',level:1,gear:'academia',focus:['pernas','base'],pattern:'perna',sets:3,dose:'8–12',why:'Força de pernas com apoio.',steps:['Ajuste banco e amplitude que mantenham a lombar apoiada.','Empurre controladamente sem travar os joelhos.'],caution:'Evite amplitudes que arredondem a lombar.'},
  {id:'terra-romeno',name:'Levantamento romeno leve',category:'musculacao',level:3,gear:'academia',focus:['quadril','pernas'],pattern:'quadril',sets:3,dose:'6–10',why:'Força posterior de quadril.',steps:['Com halteres leves, faça movimento de quadril para trás.','Mantenha coluna neutra e volte.'],caution:'Exige técnica orientada; evite com sintomas lombares.'},
  {id:'farmer',name:'Caminhada com halteres',category:'musculacao',level:2,gear:'academia',focus:['pegada','tronco'],pattern:'pegada',sets:3,dose:'20–30 s',time:true,why:'Pegada e estabilidade sob carga.',steps:['Segure halteres leves a moderados.','Caminhe com passos controlados e postura estável.'],caution:'Evite cargas elevadas com dor na coluna.'},
  {id:'bike',name:'Bicicleta ergométrica leve',category:'condicionamento',level:1,gear:'academia',focus:['condicionamento'],pattern:'cardio',sets:1,dose:'10–20 min',time:true,why:'Condicionamento aeróbico com baixo impacto.',steps:['Ajuste banco e postura.','Pedale mantendo esforço confortável.'],caution:'Interrompa se houver sintomas anormais.'}
];

export const BY_ID = Object.fromEntries(EXERCISES.map(e=>[e.id,e]));
export const LABELS = {
 style:{guarda:'Guarda e raspagens',passagem:'Passagem e controle',quedas:'Quedas e luta em pé',geral:'Preparação geral'},
 goal:{forca:'Força e estabilidade',resistencia:'Resistência',mobilidade:'Mobilidade e movimento'},
 level:{iniciante:'Iniciante',intermediario:'Intermediário',avancado:'Avançado'},
 gear:{corpo:'Peso corporal',barra:'Barra e elásticos',academia:'Academia'},
 category:{aquecimento:'Aquecimento',forca:'Força',musculacao:'Musculação',drill:'Drill de BJJ',mobilidade:'Mobilidade',condicionamento:'Condicionamento',recuperacao:'Recuperação'}
};
const L = {iniciante:1, intermediario:2, avancado:3};
const accessible = {corpo:['corpo'],barra:['corpo','barra'],academia:['corpo','barra','academia']};
const styleDrills = {guarda:['shrimp','ponte-gluteo','quadril90'],passagem:['base-shift','technical-stand','quadril90'],quedas:['technical-stand','stepup','base-shift'],geral:['base-shift','ponte-gluteo','quadril90']};
const patterns = {
 forca: [ ['puxar','pegada','core'], ['perna','empurrar','quadril'], ['puxar','perna','core'] ],
 resistencia: [ ['cardio','perna','empurrar'], ['puxar','core','cardio'], ['cardio','quadril','pegada'] ],
 mobilidade: [ ['mobilidade','core','quadril'], ['mobilidade','perna','puxar'], ['mobilidade','core','empurrar'] ]
};
const prefer = {
 puxar:['remada-maquina','remada-elastico','barra','remada-isom','escapula'],
 pegada:['farmer','suspensao','toalha'],
 empurrar:['supino','flexao-tempo','flexao','flexao-parede'],
 perna:['legpress','afundo','agachamento','stepup','agachamento-caixa'],
 quadril:['terra-romeno','ponte-uni','ponte-gluteo'],
 core:['pallof','lateral','deadbug','bird-dog','prancha'],
 cardio:['bike','intervalo-marcha','saltitos','caminhada'],
 mobilidade:['quadril90','toracica','gato-vaca']
};
export function safe(ex, profile) {
 if (!ex) return false;
 if (!accessible[profile.equipment]?.includes(ex.gear)) return false;
 if (ex.level > (L[profile.level] || 1)) return false;
 if (profile.caution && ['terra-romeno','sprawl','ponte-uni','shrimp'].includes(ex.id)) return false;
 return true;
}
export function pick(pattern, profile, used = new Set()) {
 const pool = prefer[pattern] || [];
 // A escolha de preferências muda conforme a estrutura e o nível do aluno.
 return pool.map(id=>BY_ID[id]).find(ex=>safe(ex,profile) && !used.has(ex.id)) ||
   EXERCISES.find(ex=>ex.pattern===pattern && safe(ex,profile) && !used.has(ex.id)) || null;
}
export function makePlan(profile) {
 const p = {...DEFAULT_PROFILE,...profile};
 const recovery = p.readiness<=2;
 if (recovery) {
  const ids = p.readiness===1 ? ['respirar','gato-vaca','quadril90'] : ['marcha','gato-vaca','quadril90','respirar'];
  return {recovery:true,why:p.readiness===1?'Energia muito baixa: a proposta é descanso ou movimentos leves opcionais.':'Energia reduzida: somente mobilidade leve, se estiver bem.',days:[{title:'Recuperação opcional',subtitle:'Sem treino de força ou intervalado',items:ids.map(id=>BY_ID[id])}]};
 }
 const count=Math.min(3,Math.max(2,Number(p.days)||2));
 const days=[];
 for (let i=0;i<count;i++) {
  const used = new Set();
  const items = [BY_ID['marcha']]; used.add('marcha');
  const dayPattern=patterns[p.goal]?.[i] || patterns.forca[i];
  for (const slot of dayPattern) {
   const ex=pick(slot,p,used);
   if(ex){items.push(ex);used.add(ex.id);}
  }
  const drills = styleDrills[p.style] || styleDrills.geral;
  const drill=drills.map(id=>BY_ID[id]).find(ex=>safe(ex,p) && !used.has(ex.id));
  if(drill){items.push(drill);used.add(drill.id);}
  const cool=['quadril90','toracica','gato-vaca'].map(id=>BY_ID[id]).find(ex=>safe(ex,p)&&!used.has(ex.id));
  if(cool)items.push(cool);
  days.push({title:['Sessão A · Força e controle','Sessão B · Movimento e resistência','Sessão C · Complementar'][i],subtitle:'Intercale com recuperação e seus treinos de tatame',items});
 }
 return {recovery:false,why:'Plano inicial indicativo. Ajuste volume, esforço e pausas à sua recuperação.',days};
}

export function validateSession(session) {
 return session && session.type==='fisico' && Number.isFinite(session.duration) && session.duration>=1 && session.duration<=300 && Array.isArray(session.items);
}
export function summarize(history, now = new Date()) {
 const recent = history.filter(s=>{const d = new Date(s.date+'T12:00:00');return !isNaN(d) && ((now-d)/(864e5))>=-1 && ((now-d)/(864e5))<30;});
 const bjj=recent.filter(s=>s.type==='bjj'); const phys=recent.filter(s=>s.type==='fisico');
 return {bjj:bjj.length,physical:phys.length,minutes:recent.reduce((n,s)=>n+(Number(s.duration)||0),0),rounds:bjj.reduce((n,s)=>n+(Number(s.rounds)||0),0)};
}
export function isoLocalDate(date = new Date()) { const y=date.getFullYear(),m=String(date.getMonth()+1).padStart(2,'0'),d=String(date.getDate()).padStart(2,'0');return `${y}-${m}-${d}`; }
export function validateImport(data) {
 if (!data || data.schema!==VERSION || !data.profile || typeof data.profile!=='object' || !Array.isArray(data.history)) return false;
 if (!validBeltState(data.belt) || !validTechState(data.techniques) || !validGameplan(data.gameplan) || !validInjuries(data.injuries)) return false;
 if (data.skills!==undefined && (!data.skills || typeof data.skills!=='object' || Array.isArray(data.skills) || Object.keys(data.skills).length>20 || Object.values(data.skills).some(n=>!Number.isInteger(n)||n<0||n>6))) return false;
 const p=data.profile;
 if (typeof p.name!=='string' || p.name.length>48 ||
     !Object.keys(LABELS.style).includes(p.style) ||
     !Object.keys(LABELS.goal).includes(p.goal) ||
     !Object.keys(LABELS.level).includes(p.level) ||
     !Object.keys(LABELS.gear).includes(p.equipment) ||
     !['branca','azul','roxa','marrom','preta','outro'].includes(p.belt) ||
     ![2,3].includes(p.days) || ![1,2,3,4,5].includes(p.readiness) ||
     typeof p.caution!=='boolean') return false;
 if (data.history.length>30000 || data.history.some(s=>
     !s || !['bjj','fisico'].includes(s.type) ||
     typeof s.date!=='string' || !/^\d{4}-\d\d-\d\d$/.test(s.date) ||
     !Number.isFinite(Number(s.duration)) || Number(s.duration)<0 || Number(s.duration)>300 ||
     (s.note!==undefined && (typeof s.note!=='string'||s.note.length>1000)) ||
     (s.title!==undefined && (typeof s.title!=='string'||s.title.length>100)) ||
     (s.items!==undefined && (!Array.isArray(s.items)||s.items.length>100)) ||
     (s.rounds!==undefined && (!Number.isInteger(s.rounds)||s.rounds<0||s.rounds>30)) ||
     (s.rpe!==undefined && (!Number.isInteger(s.rpe)||s.rpe<1||s.rpe>10)) ||
     (s.type==='bjj' && !validBjjSession(s))
 )) return false;
 return true;
}
