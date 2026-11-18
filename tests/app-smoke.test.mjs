import test from 'node:test';
import assert from 'node:assert/strict';

// Integração mínima sem navegador; testa roteamento e eventos sem DOM real.
test('app renderiza trilhas e registra evolução preservando chave v0.1',async()=>{
 const elements=new Map();const callbacks={};const store=new Map();
 const base={innerHTML:'',addEventListener(event,cb){callbacks[event]=cb;},querySelectorAll(){return[];}};
 elements.set('content',base);
 elements.set('toast',{textContent:'',style:{display:'none'}});
 elements.set('settings-shortcut',{addEventListener(){}});
 globalThis.document={hidden:false,addEventListener(){},getElementById(id){return elements.get(id)||{checked:true,textContent:'',style:{},value:''};},querySelector(){return {addEventListener(){}}},querySelectorAll(){return[];}};
 globalThis.localStorage={getItem:k=>store.get(k)||null,setItem:(k,v)=>{store.set(k,v);}};
 globalThis.window={addEventListener(){},scrollTo(){}};
 Object.defineProperty(globalThis,'navigator',{value:{},configurable:true});
 globalThis.setInterval=()=>0;
 globalThis.confirm=()=>true;
 const old={schema:1,profile:{name:'Testador',belt:'azul',style:'guarda',goal:'forca',level:'iniciante',equipment:'corpo',days:2,readiness:3,caution:false},history:[{type:'bjj',date:'2026-11-17',duration:45,rounds:2,rpe:5}],workout:null};
 store.set('calistenia_bjj_v1',JSON.stringify(old));
 await import('../app.mjs?smoke=1');
 assert.match(base.innerHTML,/Sua faixa/);
 assert.match(base.innerHTML,/Você ainda não fez backup/);
 assert.match(base.innerHTML,/Testador/);
 const click=(action,id,to)=>callbacks.click({target:{closest(){return {dataset:{action,id,to}};}}});
 click('navigate',null,'habilidades'); assert.match(base.innerHTML,/Progrida com/);
 click('skillView','flexoes'); assert.match(base.innerHTML,/Força de empurrar/);
 click('skillNext','flexoes'); const newState=JSON.parse(store.get('calistenia_bjj_v1'));
 assert.equal(newState.skills.flexoes,1);assert.equal(newState.history.length,1);
 assert.match(base.innerHTML,/Flexão de braços/);
 click('skillsBack');assert.match(base.innerHTML,/1 de 22 etapas registradas/);
 // Registro antigo sem id recebe id e pode ser apagado individualmente.
 const legacyId=newState.history[0].id; assert.ok(legacyId);
 click('navigate',null,'evolucao'); assert.match(base.innerHTML,/Progressões físicas · 1 etapa</); assert.match(base.innerHTML,/data-action="deleteSession"/);
 click('deleteSession',legacyId); assert.equal(JSON.parse(store.get('calistenia_bjj_v1')).history.length,0);
});
