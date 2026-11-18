/** Calistenia + BJJ v0.2 — trilhas de habilidades e carga registrada. Código original. */
export const TRACKS = Object.freeze([
  {id:'flexoes',title:'Força de empurrar',subtitle:'Flexões progressivas para estabilidade e controle',focus:'Base e controle',stages:[
    {id:'flexao-parede',criterion:'Realizar 3 séries de 12 repetições com ritmo controlado e sem dor.'},
    {id:'flexao',criterion:'Realizar 3 séries de 10 repetições com alinhamento e amplitude controlada.'},
    {id:'flexao-tempo',criterion:'Realizar 3 séries de 8 repetições com descida lenta sem perder técnica.'}
  ]},
  {id:'puxadas',title:'Força de puxada',subtitle:'Costas e braços para controles e pegadas',focus:'Guarda e pegadas',stages:[
    {id:'escapula',criterion:'Controlar 3 séries de 15 retrações escapulares sem elevar o pescoço.'},
    {id:'remada-isom',criterion:'Sustentar 3 séries de 25 segundos sem prender a respiração.'},
    {id:'remada-elastico',criterion:'Fazer 3 séries de 12 remadas suaves com elástico bem ancorado.'},
    {id:'barra',criterion:'Fazer 3 séries de 6 barras assistidas com apoio seguro e boa técnica.'}
  ]},
  {id:'quadril',title:'Controle de quadril',subtitle:'Ponte, mobilidade e movimentos úteis à guarda',focus:'Guarda e raspagens',stages:[
    {id:'ponte-gluteo',criterion:'Fazer 3 séries de 12 repetições sem desconforto na lombar.'},
    {id:'quadril90',criterion:'Executar 2 séries de 6 trocas por lado com controle e sem forçar amplitude.'},
    {id:'shrimp',criterion:'Executar 3 séries de 6 movimentos por lado com controle.'},
    {id:'ponte-uni',criterion:'Executar 3 séries de 8 pontes por lado mantendo o quadril nivelado.'}
  ]},
  {id:'base',title:'Força de base e pernas',subtitle:'Apoio, deslocamentos e estabilidade unilateral',focus:'Passagem e quedas',stages:[
    {id:'agachamento-caixa',criterion:'Fazer 3 séries de 12 sem perder o equilíbrio.'},
    {id:'stepup',criterion:'Subir e descer degrau estável em 3 séries de 8 por lado.'},
    {id:'agachamento',criterion:'Executar 3 séries de 12 com boa postura e controle.'},
    {id:'afundo',criterion:'Completar 3 séries de 8 por lado com estabilidade e apoio se necessário.'}
  ]},
  {id:'tronco',title:'Estabilidade do tronco',subtitle:'Transferir força sem perder o controle da postura',focus:'Raspagens e defesa',stages:[
    {id:'deadbug',criterion:'Completar 3 séries de 10 por lado sem perder o controle do tronco.'},
    {id:'bird-dog',criterion:'Completar 3 séries de 6 por lado com quadril estável.'},
    {id:'prancha',criterion:'Sustentar 3 séries de 25 segundos sem perder alinhamento.'},
    {id:'lateral',criterion:'Sustentar 3 séries de 25 segundos por lado com respiração contínua.'}
  ]},
  {id:'pegada',title:'Resistência de pegada',subtitle:'Pegada com progressão gradual de equipamento e carga',focus:'Controle do kimono',stages:[
    {id:'toalha',criterion:'Apertar a toalha por 3 séries de 30 segundos sem dor nas mãos.'},
    {id:'suspensao',criterion:'Fazer 3 suspensões controladas de 20 segundos com barra segura.'},
    {id:'farmer',criterion:'Caminhar com halteres em 3 séries de 30 segundos com carga leve e postura estável.'}
  ]}
]);
const LEVELS={iniciante:1,intermediario:2,avancado:3};
const GEAR={corpo:['corpo'],barra:['corpo','barra'],academia:['corpo','barra','academia']};
const CAUTION_IDS=new Set(['terra-romeno','sprawl','ponte-uni','shrimp']);
export function stageAllowed(ex,profile){return Boolean(ex&&GEAR[profile.equipment]?.includes(ex.gear)&&ex.level<=(LEVELS[profile.level]||1)&&!(profile.caution&&CAUTION_IDS.has(ex.id)));}
export function skillIndex(skills,track){const raw=skills?.[track.id];return Number.isInteger(raw)&&raw>=0?Math.min(raw,track.stages.length):0;}
export function skillCompleted(skills){return TRACKS.reduce((n,t)=>n+skillIndex(skills,t),0);}
export function weeklyLoad(history,now=new Date()){
 const start=new Date(now.getFullYear(),now.getMonth(),now.getDate()-6);const end=new Date(now.getFullYear(),now.getMonth(),now.getDate()+1);
 const items=(Array.isArray(history)?history:[]).filter(s=>{const t=new Date(`${s.date}T12:00:00`);return !Number.isNaN(t.valueOf())&&t>=start&&t<end;});
 const bjj=items.filter(s=>s.type==='bjj');const phys=items.filter(s=>s.type==='fisico');
 const minutes=bjj.reduce((n,s)=>n+(Number(s.duration)||0),0);
 const hard=bjj.filter(s=>Number(s.rpe)>=8).length;
 // Limiares apenas operacionais; não são medida de sobrecarga clínica ou fadiga real.
 const high=minutes>=240||hard>=3||bjj.length>=5;
 return {bjj:bjj.length,physical:phys.length,minutes,hard,status:high?'alta':bjj.length>=2||minutes>=120?'moderada':'leve',high};
}
export function recordedSets(history,exerciseId){return (Array.isArray(history)?history:[]).filter(s=>s.type==='fisico').reduce((n,s)=>n+(s.items||[]).filter(i=>i.id===exerciseId).reduce((a,i)=>a+(Number(i.done)||0),0),0);}

// Diagramas originais simplificados: guias de postura, não vídeos ou análise de técnica.
const people={
 squat:[`<circle cx="86" cy="42" r="13"/><path d="M86 55 L86 109 M86 74 L63 98 M86 74 L110 94 M86 109 L68 148 L60 159 M86 109 L110 148 L120 159"/>`,
 `<circle cx="86" cy="67" r="13"/><path d="M86 80 L110 118 M92 95 L68 116 M96 97 L116 122 M110 118 L151 127 L146 159 M110 118 L69 127 L66 159"/>`],
 push:[`<circle cx="164" cy="70" r="12"/><path d="M152 80 L84 95 L28 137 M142 82 L151 133 L163 146 M84 95 L28 137"/>`,
 `<circle cx="164" cy="106" r="12"/><path d="M152 114 L84 115 L28 137 M144 116 L152 141 L163 148 M84 115 L28 137"/>`],
 bridge:[`<circle cx="50" cy="125" r="13"/><path d="M63 129 L115 139 L157 130 M157 130 L180 154 L191 155 M105 137 L106 152"/>`,
 `<circle cx="50" cy="125" r="13"/><path d="M63 129 L116 86 L159 113 M159 113 L180 154 L192 155 M79 113 L86 152"/>`]
};
export function visualGuide(ex){
 const type=['agachamento','agachamento-caixa','stepup'].includes(ex.id)?'squat':['flexao','flexao-parede','flexao-tempo'].includes(ex.id)?'push':['ponte-gluteo','ponte-uni'].includes(ex.id)?'bridge':null;
 if(!type)return '';
 const labels=type==='squat'?['Posição inicial','Flexão controlada']:type==='push'?['Braços estendidos','Descer com controle']:['Quadril apoiado','Elevação controlada'];
 const p=people[type];return `<div class="movement-guide"><div class="eyebrow">Guia visual simplificado</div><svg viewBox="0 0 470 205" role="img" aria-label="Duas posições ilustrativas do movimento; siga também o texto e os cuidados"><g stroke="currentColor" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" fill="none"><path stroke-opacity=".3" d="M12 170 H218 M244 170 H457"/><g transform="translate(12,0)">${p[0]}</g><g transform="translate(252,0)">${p[1]}</g><path stroke-width="2" stroke-dasharray="4 7" d="M221 95 H241"/></g><g fill="currentColor" font-size="13" font-weight="600" text-anchor="middle"><text x="114" y="196">${labels[0]}</text><text x="346" y="196">${labels[1]}</text></g></svg><p class="tiny muted">Ilustração esquemática; não substitui demonstração presencial. Ajuste a variação ao exercício descrito.</p></div>`;
}
