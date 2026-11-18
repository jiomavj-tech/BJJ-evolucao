/** v0.3 — regras de XP e agenda; sem dependências nem chamadas à rede. */
export const DEFAULT_REMINDERS={enabled:false,time:'18:00',days:[1,3,5],duration:35,water:false,waterInterval:180,notify:false,lastWorkout:'',lastWater:''};
export function normalizeReminders(input){
 const v=input&&typeof input==='object'&&!Array.isArray(input)?input:{};
 const days=Array.isArray(v.days)?[...new Set(v.days.filter(n=>Number.isInteger(n)&&n>=0&&n<=6))].sort():DEFAULT_REMINDERS.days;
 return {enabled:v.enabled===true,time:/^([01]\d|2[0-3]):[0-5]\d$/.test(v.time||'')?v.time:DEFAULT_REMINDERS.time,days,
 duration:[20,30,35,45,60,90].includes(v.duration)?v.duration:35,water:v.water===true,
 waterInterval:[120,180,240].includes(v.waterInterval)?v.waterInterval:180,notify:v.notify===true,
 lastWorkout:typeof v.lastWorkout==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(v.lastWorkout)?v.lastWorkout:'',
 lastWater:typeof v.lastWater==='string'&&v.lastWater.length<24?v.lastWater:''};
}
export const AWARDS=[
 {id:'primeira',icon:'🥇',name:'Primeiro treino',desc:'Registre a primeira sessão física ou de BJJ.',test:c=>c.sessions>=1},
 {id:'constancia',icon:'🔥',name:'Em movimento',desc:'Registre treinos em 5 dias distintos.',test:c=>c.days>=5},
 {id:'tatame',icon:'🥋',name:'Presença no tatame',desc:'Registre 5 treinos de jiu-jitsu.',test:c=>c.bjj>=5},
 {id:'forca',icon:'💪',name:'Construindo força',desc:'Complete 30 séries de preparação física.',test:c=>c.sets>=30},
 {id:'habilidade',icon:'🎯',name:'Primeira progressão',desc:'Registre uma etapa com técnica controlada.',test:c=>c.skills>=1},
 {id:'meta',icon:'📅',name:'Meta semanal',desc:'Cumpra sua meta de dias em uma semana.',test:c=>c.completedWeeks>=1},
 {id:'regular',icon:'🌱',name:'Semanas consistentes',desc:'Cumpra sua meta semanal durante 3 semanas seguidas.',test:c=>c.streak>=3}
];
const monday=(date)=>{const d=new Date(date.getFullYear(),date.getMonth(),date.getDate());d.setDate(d.getDate()-(d.getDay()+6)%7);return d;};
const weekKey=d=>{const x=monday(d);return [x.getFullYear(),String(x.getMonth()+1).padStart(2,'0'),String(x.getDate()).padStart(2,'0')].join('-');};
const validDay=s=>/^\d{4}-\d{2}-\d{2}$/.test(s||'')&&!Number.isNaN(new Date(s+'T12:00:00').valueOf());
export function gamification(history=[],skills={},goal=2,now=new Date()){
 const sessions=Array.isArray(history)?history.filter(s=>s&&validDay(s.date)&&['bjj','fisico'].includes(s.type)):[];
 const grouped=new Map(),dates=new Set(),bjjDates=new Set(),weekly=new Map();let xp=0,sets=0,bjj=0,eligibleSessions=0;
 for(const s of sessions){
  const key=s.date+'|'+s.type;const count=grouped.get(key)||0;grouped.set(key,count+1);
  if(count>=2)continue; // evita inflação por múltiplos registros iguais em um dia
  const date=new Date(s.date+'T12:00:00');if(date>now)continue;
  eligibleSessions++;dates.add(s.date);const wk=weekKey(date);weekly.set(wk,(weekly.get(wk)||new Set()).add(s.date));
  if(s.type==='bjj'){bjj++;bjjDates.add(s.date);xp+=20;}
  else{
   const items=Array.isArray(s.items)?s.items:[];
   const total=items.reduce((a,e)=>a+Math.min(12,Math.max(0,Number(e.planned)||0)),0);
   const done=items.reduce((a,e)=>a+Math.min(12,Math.max(0,Math.min(Number(e.done)||0,Number(e.planned)||0))),0);
   sets+=done;xp+=done*5+(total>0&&done/total>=0.7?30:10);
  }
 }
 const skillCount=Object.values(skills||{}).reduce((n,v)=>n+(Number.isInteger(v)&&v>0?Math.min(10,v):0),0);
 xp+=skillCount*40;
 const minGoal=Math.min(7,Math.max(1,Number(goal)||2));const today=monday(now);let streak=0;
 for(let i=0;i<52;i++){
  const wk=new Date(today);wk.setDate(wk.getDate()-7*i);
  const count=weekly.get(weekKey(wk))?.size||0;
  if(i===0&&count<minGoal)continue; // semana atual incompleta não quebra sequência
  if(count>=minGoal)streak++;else break;
 }
 const currentWeekDays=weekly.get(weekKey(now))?.size||0;
 // Meta semanal conta assim que os dias elegíveis forem registrados, sem exigir treino diário.
 const completedWeeks=[...weekly.values()].filter(set=>set.size>=minGoal).length;
 xp+=completedWeeks*50;
 const LEVELS=[{name:'Iniciante',xp:0},{name:'Em movimento',xp:100},{name:'Constante',xp:250},{name:'Preparação',xp:500},{name:'Foco no tatame',xp:900},{name:'Veterano',xp:1500},{name:'Referência',xp:2500}];
 const level=LEVELS.reduce((acc,p)=>xp>=p.xp?p:acc,LEVELS[0]);const ix=LEVELS.findIndex(l=>l.name===level.name),next=LEVELS[ix+1]||null;
 const context={sessions:eligibleSessions,days:dates.size,bjj,sets,skills:skillCount,streak,completedWeeks};
 return {xp,level:level.name,next,progress:next?(xp-level.xp)/(next.xp-level.xp):1,badges:AWARDS.filter(a=>a.test(context)),context,currentWeekDays,weeklyGoal:minGoal,streak};
}
export function nextWorkoutDate(rem,now=new Date()){
 const days=Array.isArray(rem?.days)?rem.days:[];
 if(!days.length)return null;const [h,m]=String(rem.time||'18:00').split(':').map(Number);
 if(!Number.isInteger(h)||h<0||h>23||!Number.isInteger(m)||m<0||m>59)return null;
 for(let i=0;i<8;i++){const date=new Date(now.getFullYear(),now.getMonth(),now.getDate()+i,h,m);if(days.includes(date.getDay())&&date>now)return date;}
 return null;
}
const localFormat=d=>[d.getFullYear(),String(d.getMonth()+1).padStart(2,'0'),String(d.getDate()).padStart(2,'0')].join('')+'T'+[d.getHours(),d.getMinutes(),d.getSeconds()].map(n=>String(n).padStart(2,'0')).join('');
export function calendarUrl(rem,now=new Date()){
 const start=nextWorkoutDate(rem,now);if(!start)return null;
 const end=new Date(start.getTime()+Math.max(10,Math.min(180,Number(rem.duration)||35))*60000);
 const qs=new URLSearchParams({action:'TEMPLATE',text:'Calistenia + BJJ | preparação física',dates:localFormat(start)+'/'+localFormat(end),ctz:'America/Sao_Paulo',details:'Treino de calistenia e preparação física para o jiu-jitsu. Ajuste à recuperação; abrir aplicativo: https://jiomavj-tech.github.io/BJJ-evolucao/'});
 return 'https://calendar.google.com/calendar/render?'+qs.toString();
}
export function calendarIcs(rem,now=new Date()){
 const start=nextWorkoutDate(rem,now);if(!start)return null;
 const end=new Date(start.getTime()+Math.max(10,Math.min(180,Number(rem.duration)||35))*60000);
 const days=['SU','MO','TU','WE','TH','FR','SA'];const by=(rem.days||[]).filter(n=>Number.isInteger(n)&&n>=0&&n<=6).map(n=>days[n]).join(',');
 const uid='calistenia-bjj-'+localFormat(start)+'@jiomavj-tech.github.io';
 const utc=d=>d.toISOString().replace(/[-:]/g,'').replace(/\.\d{3}/,'');
 const esc=s=>String(s).replace(/\\/g,'\\\\').replace(/;/g,'\\;').replace(/,/g,'\\,').replace(/\n/g,'\\n');
 return ['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Calistenia BJJ//Calendario 0.3//PT-BR','CALSCALE:GREGORIAN','BEGIN:VEVENT','UID:'+uid,'DTSTAMP:'+utc(now),'DTSTART:'+utc(start),'DTEND:'+utc(end),'RRULE:FREQ=WEEKLY;BYDAY='+by,'SUMMARY:'+esc('Calistenia + BJJ | preparação física'),'DESCRIPTION:'+esc('Treino do app. Regule a intensidade conforme a recuperação. Ao importar, confirme as notificações no calendário.'),'BEGIN:VALARM','ACTION:DISPLAY','DESCRIPTION:Horário do seu treino de calistenia + BJJ','TRIGGER:-PT15M','END:VALARM','END:VEVENT','END:VCALENDAR',''].join('\r\n');
}
export function inQuietTime(h){return h<8||h>=22;}
