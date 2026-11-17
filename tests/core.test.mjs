import test from 'node:test';
import assert from 'node:assert/strict';
import {EXERCISES,BY_ID,DEFAULT_PROFILE,makePlan,validateImport,validateSession,summarize} from '../core.mjs';

test('catálogo mantém identificadores únicos e descrição adequada',()=>{
  assert.equal(new Set(EXERCISES.map(e=>e.id)).size,EXERCISES.length);
  assert.ok(EXERCISES.length>=35);
  for(const e of EXERCISES){assert.ok(e.id&&e.name&&e.steps.length>0&&e.caution&&e.dose);assert.equal(BY_ID[e.id],e);}
});

test('todos os perfis geram exercícios adequados a equipamento e nível',()=>{
 const levels={iniciante:1,intermediario:2,avancado:3},gear={corpo:['corpo'],barra:['corpo','barra'],academia:['corpo','barra','academia']};
 for(const level of Object.keys(levels))for(const equipment of Object.keys(gear))for(const style of ['guarda','passagem','quedas','geral'])for(const goal of ['forca','resistencia','mobilidade'])for(const days of [2,3]){
  const plan=makePlan({...DEFAULT_PROFILE,level,equipment,style,goal,days});assert.equal(plan.days.length,days);
  for(const day of plan.days){assert.ok(day.items.length>=4,`${level}/${equipment}/${style}/${goal}`);assert.equal(new Set(day.items.map(e=>e.id)).size,day.items.length);for(const e of day.items){assert.ok(gear[equipment].includes(e.gear),e.id);assert.ok(e.level<=levels[level],e.id);}}
 }
});

test('energia baixa não prescreve sessões de força ou circuitos pesados',()=>{
 for (const readiness of [1,2]){
 const plan=makePlan({...DEFAULT_PROFILE,readiness});assert.equal(plan.recovery,true);assert.equal(plan.days.length,1);assert.ok(plan.days[0].items.every(e=>['mobilidade','aquecimento','recuperacao'].includes(e.category)));
 }
});

test('opção de cautela exclui exercícios selecionados',()=>{
 for(const goal of ['forca','resistencia','mobilidade']){const plan=makePlan({...DEFAULT_PROFILE,level:'avancado',equipment:'academia',style:'guarda',goal,days:3,caution:true});assert.ok(!plan.days.flatMap(d=>d.items).some(e=>['terra-romeno','sprawl','ponte-uni','shrimp'].includes(e.id)));}
});

test('histórico pode ser exportado e validado',()=>{
 const history=[{type:'bjj',date:'2026-11-17',duration:60,rounds:3,rpe:7},{type:'fisico',date:'2026-11-15',duration:25,items:[],rpe:5}];
 assert.ok(validateImport({schema:1,profile:{...DEFAULT_PROFILE},history}));
 assert.equal(summarize(history,new Date('2026-11-17T12:00:00')).minutes,85);
 assert.equal(validateImport({schema:2,profile:{},history}),false);
 assert.equal(validateImport({schema:1,profile:{},history:[{type:'invalido',date:'2026-11-17',duration:10}]}),false);
 assert.equal(validateSession({type:'fisico',duration:30,items:[]}),true);
 assert.equal(validateSession({type:'fisico',duration:-3,items:[]}),false);
});
