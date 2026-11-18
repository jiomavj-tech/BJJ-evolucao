/** Ilustrações RepDB Free Tier: uso em aplicativos permitido com crédito visível.
 * Fonte https://github.com/RepDB/exercise-dataset — licença LICENSE-DATA.md.
 * Não copie o conjunto completo para outro repositório ou API. Não usar como referência para IA generativa.
 * Mapas correspondem a posições de referência, com adaptações indicadas nas legendas.
 */
const ROOT='https://exercise-dataset.com/images/flat/';
// [arquivo início, arquivo posição seguinte (ou null), descrição]
const MATCH={
 'quadril90':['90-90-switch-start.webp','90-90-switch-peak.webp','Troca de quadril 90/90'],
 'gato-vaca':['cat-cow-main.webp',null,'Mobilidade gato-vaca, imagem de referência'],
 'prancha':['plank-main.webp',null,'Prancha frontal estática'],
 'deadbug':['dead-bug-start.webp','dead-bug-peak.webp','Dead bug'],
 'bird-dog':['bird-dog-start.webp','bird-dog-peak.webp','Bird dog'],
 'flexao-parede':['wall-push-ups-start.webp','wall-push-ups-peak.webp','Flexão na parede'],
 'flexao':['push-up-start.webp','push-up-peak.webp','Flexão convencional'],
 'flexao-tempo':['push-up-start.webp','push-up-peak.webp','Flexão convencional — ritmo lento não mostrado pela imagem'],
 'agachamento':['bodyweight-squat-start.webp','bodyweight-squat-peak.webp','Agachamento livre'],
 'ponte-gluteo':['glute-bridge-start.webp','glute-bridge-peak.webp','Ponte de glúteos bilateral'],
 'stepup':['step-ups-start.webp','step-ups-peak.webp','Subida em degrau, ajuste a altura ao seu nível'],
 'pallof':['banded-pallof-press-start.webp','banded-pallof-press-peak.webp','Pallof press com elástico'],
 'remada-maquina':['seated-cable-row-start.webp','seated-cable-row-peak.webp','Remada na polia sentada'],
 'puxada':['lat-pulldown-start.webp','lat-pulldown-peak.webp','Puxada alta na polia'],
 'legpress':['leg-press-start.webp','leg-press-peak.webp','Leg press convencional'],
 'bike':['stationary-bike-main.webp',null,'Bicicleta ergométrica']
};
// Fotos locais (funcionam offline): Free Exercise DB, domínio público (Unlicense).
// https://github.com/yuhonas/free-exercise-db — duas fotos por exercício: início e fim do movimento.
const LOCAL={
 'gato-vaca':'Mobilidade em quatro apoios (gato)','prancha':'Prancha frontal','lateral':'Prancha lateral — na foto, com joelhos estendidos',
 'deadbug':'Dead bug','flexao-parede':'Flexão com apoio elevado','flexao':'Flexão de braços','flexao-tempo':['flexao','Flexão — desça devagar, em 3 a 4 segundos'],
 'agachamento':'Agachamento livre','afundo':'Afundo parado (split squat)','ponte-gluteo':'Ponte de glúteos','ponte-uni':'Ponte de glúteos unilateral',
 'stepup':'Subida no degrau — na foto, com halteres e degrau alto','barra':'Barra assistida com elástico','pallof':'Pallof press — na foto, com polia',
 'remada-maquina':'Remada sentada na polia','puxada':'Puxada alta','supino':'Supino com halteres','legpress':'Leg press',
 'terra-romeno':'Levantamento romeno — na foto, com barra','farmer':'Caminhada do fazendeiro','bike':'Bicicleta ergométrica'
};
export function matchCount(){return new Set([...Object.keys(LOCAL),...Object.keys(MATCH)]).size;}
/** Mídia do exercício: primeiro as fotos locais (offline); senão, RepDB (fica guardada no celular depois da 1ª vez). */
export function remoteImages(ex){
 const loc=LOCAL[ex.id];
 if(loc){const [file,caption]=Array.isArray(loc)?loc:[ex.id,loc];return {photos:[`./assets/ex/${file}-0.jpg`,`./assets/ex/${file}-1.jpg`],caption,source:'Free Exercise DB (domínio público)',offline:true};}
 const match=MATCH[ex.id];if(!match)return null;
 return {photos:match[1]?[ROOT+match[0],ROOT+match[1]]:[ROOT+match[0]],caption:match[2],source:'RepDB (repdb.co), licença Free Tier',offline:false};
}
const escH=t=>String(t).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
/** Animação de 2 quadros (início ↔ fim), como um gif leve. */
export function animatedPhoto(ref,cls=''){
 if(!ref)return '';
 const rp=ref.offline?'':' referrerpolicy="no-referrer"';
 if(ref.photos.length<2)return `<div class="anim ${cls}"><img src="${ref.photos[0]}" alt="${escH(ref.caption)}" loading="lazy" decoding="async"${rp}></div>`;
 return `<div class="anim two ${cls}" role="img" aria-label="${escH(ref.caption)}: início e fim do movimento"><img src="${ref.photos[0]}" alt="" loading="lazy" decoding="async"${rp}><img src="${ref.photos[1]}" alt="" loading="lazy" decoding="async"${rp}></div>`;
}
export function imagesHtml(ex){const ref=remoteImages(ex);if(!ref)return '';
 const caption=escH(ref.caption);
 const credit=ref.offline?'Fotos: Free Exercise DB, domínio público. Disponíveis offline.':'Imagens: RepDB. Precisam de internet na primeira vez; depois ficam guardadas no celular. <a href="https://repdb.co" target="_blank" rel="noopener noreferrer">Exercise data by RepDB (repdb.co)</a>';
 return `<div class="real-demo"><div class="eyebrow">Como fazer</div>${animatedPhoto(ref,'big')}<p class="small">${caption}. A imagem alterna entre o início e o fim do movimento. Confira os passos e cuidados abaixo.</p><p class="tiny muted">${credit}</p></div>`;
}
const drawings={
 shrimp:{title:'Fuga de quadril — vista superior esquemática',parts:[
  {head:[42,71],hip:[103,91],shoulder:[70,82],feet:[[156,50],[156,129]],arrows:[]},
  {head:[42,70],hip:[102,64],shoulder:[71,80],feet:[[148,37],[157,109]],arrows:[[108,101,111,65]]},
  {head:[42,71],hip:[105,33],shoulder:[72,78],feet:[[142,16],[172,86]],arrows:[[104,90,106,42]]}
 ],labels:['Deitado, pés apoiados','Eleve e vire o quadril','Desloque o quadril para trás']},
 'technical-stand':{title:'Levantada técnica — esquema de transição',parts:[
  {head:[64,71],hip:[101,104],shoulder:[75,87],feet:[[154,125],[131,145]],arrows:[]},
  {head:[60,53],hip:[101,86],shoulder:[79,64],feet:[[155,129],[142,143]],arrows:[[101,114,99,72]]},
  {head:[83,29],hip:[101,91],shoulder:[92,50],feet:[[101,144],[132,145]],arrows:[[83,80,84,36]]}
 ],labels:['Sente com apoio firme','Eleve quadril e recolha a perna','Erga-se com equilíbrio']},
 'base-shift':{title:'Troca de base — referência esquemática',parts:[
  {head:[86,63],hip:[108,104],shoulder:[90,82],feet:[[54,139],[146,134]],arrows:[]},
  {head:[95,63],hip:[95,105],shoulder:[100,82],feet:[[43,132],[149,136]],arrows:[[106,107,81,107]]},
  {head:[106,63],hip:[83,104],shoulder:[108,85],feet:[[45,131],[151,141]],arrows:[]}
 ],labels:['Base estável','Transfira o peso','Reorganize os apoios']}
};
export function bjjDiagram(ex){const data=drawings[ex.id];if(!data)return '';
 const parts=data.parts.map((p,i)=>{
  const base=i*200;
  const feet=p.feet.map(([x,y])=>`<path d="M ${p.hip[0]} ${p.hip[1]} L ${x} ${y}"/>`).join('');
  const arrow=p.arrows.map(([x1,y1,x2,y2])=>`<path class="arrow" d="M ${x1} ${y1} L ${x2} ${y2}"/><path class="arrow" d="M ${x2-5} ${y2+8} L ${x2} ${y2} L ${x2+6} ${y2+8}"/>`).join('');
  return `<g transform="translate(${base},0)"><rect x="5" y="6" width="190" height="164" rx="14" fill="#1b2d23" stroke="#42634d"/><g stroke="#c7eaa4" stroke-width="8" fill="none" stroke-linecap="round" stroke-linejoin="round"><circle cx="${p.head[0]}" cy="${p.head[1]}" r="12"/><path d="M ${p.shoulder[0]} ${p.shoulder[1]} L ${p.hip[0]} ${p.hip[1]}"/>${feet}<path d="M ${p.shoulder[0]} ${p.shoulder[1]} L ${p.shoulder[0]-24} ${p.shoulder[1]+29} M ${p.shoulder[0]} ${p.shoulder[1]} L ${p.shoulder[0]+6} ${p.shoulder[1]+36}"/></g><g stroke="#f2bb81" stroke-width="4" fill="none" stroke-linecap="round">${arrow}</g><text x="100" y="165" fill="#f0f5ec" font-size="11" text-anchor="middle">${data.labels[i]}</text></g>`;
 }).join('');
 return `<div class="bjj-guide"><div class="eyebrow">${data.title}</div><svg role="img" aria-label="Três posições esquemáticas: ${data.labels.join(', ')}" viewBox="0 0 600 178">${parts}</svg><p class="guide-info">Diagrama orientativo, não representa execução fiel em vídeo. Para drills de BJJ, confirme a técnica com seu professor antes de praticar.</p></div>`;
}
