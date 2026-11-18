import test from 'node:test';
import assert from 'node:assert/strict';
import {EXERCISES,BY_ID,DEFAULT_PROFILE,validateImport} from '../core.mjs';
import {TRACKS,skillIndex,skillCompleted,weeklyLoad,stageAllowed,recordedSets,visualGuide} from '../evolution.mjs';

test('trilhas usam apenas ids existentes e sem duplicação interna',()=>{
 const ids=new Set(EXERCISES.map(e=>e.id));
 for(const t of TRACKS){assert.ok(t.stages.length>=3);assert.equal(new Set(t.stages.map(s=>s.id)).size,t.stages.length);for(const s of t.stages){assert.ok(ids.has(s.id));assert.ok(s.criterion.length>10);}}
});
test('evolução é manual, mantém registros antigos e protege valores inválidos',()=>{
 const t=TRACKS[0];assert.equal(skillIndex({},t),0);assert.equal(skillIndex({[t.id]:-20},t),0);
 assert.equal(skillIndex({[t.id]:99},t),t.stages.length);
 assert.equal(skillCompleted({[t.id]:1}),1);
 assert.ok(validateImport({schema:1,profile:{...DEFAULT_PROFILE},history:[]}));
 assert.ok(validateImport({schema:1,profile:{...DEFAULT_PROFILE},history:[],skills:{[t.id]:2}}));
 assert.equal(validateImport({schema:1,profile:{...DEFAULT_PROFILE},history:[],skills:{[t.id]:'2'}}),false);
});
test('avalia disponibilidade por nivel, estrutura e cautela',()=>{
 assert.equal(stageAllowed(BY_ID['flexao-parede'],DEFAULT_PROFILE),true);
 assert.equal(stageAllowed(BY_ID['barra'],DEFAULT_PROFILE),false);
 assert.equal(stageAllowed(BY_ID['barra'],{...DEFAULT_PROFILE,level:'intermediario',equipment:'barra'}),true);
 assert.equal(stageAllowed(BY_ID['shrimp'],{...DEFAULT_PROFILE,level:'intermediario',caution:true}),false);
});
test('carga semanal usa registros reais sem alterar histórico ou fazer diagnóstico',()=>{
 const now=new Date('2026-11-17T12:00:00');
 const history=[...Array.from({length:4},(_,i)=>({type:'bjj',date:`2026-11-${14+i}`,duration:60,rpe:7})),{type:'bjj',date:'2026-10-01',duration:60,rpe:10}];
 const snapshot=JSON.stringify(history);const load=weeklyLoad(history,now);
 assert.equal(load.bjj,4);assert.equal(load.minutes,240);assert.equal(load.high,true);
 assert.equal(weeklyLoad([],now).high,false);assert.equal(snapshot,JSON.stringify(history));
 assert.equal(recordedSets([{type:'fisico',items:[{id:'flexao',done:3}]}],'flexao'),3);
});
test('guias visuais são originais, rotulados e só aparecem em movimentos contemplados',()=>{
 assert.match(visualGuide(BY_ID['agachamento']),/<svg/);
 assert.match(visualGuide(BY_ID['flexao']),/esquemática/);
 assert.equal(visualGuide(BY_ID['toalha']),'');
});
