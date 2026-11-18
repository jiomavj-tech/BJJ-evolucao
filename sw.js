/* Cache estático local: sem rastreamento, sem APIs remotas. */
const CACHE='bjj-evolucao-static-v07b';
const ASSETS=['./','./index.html','./styles.css','./app.mjs','./core.mjs','./evolution.mjs','./gamification.mjs','./visuals.mjs','./techniques.mjs','./bjj.mjs','./positions.mjs','./quick.mjs','./drawings.mjs','./manifest.webmanifest','./assets/icon-192.png','./assets/icon-512.png',
  './assets/ex/afundo-0.jpg','./assets/ex/afundo-1.jpg','./assets/ex/agachamento-0.jpg','./assets/ex/agachamento-1.jpg','./assets/ex/agachamento-caixa-0.jpg','./assets/ex/agachamento-caixa-1.jpg','./assets/ex/barra-0.jpg','./assets/ex/barra-1.jpg','./assets/ex/bike-0.jpg','./assets/ex/bike-1.jpg','./assets/ex/caminhada-0.jpg','./assets/ex/caminhada-1.jpg','./assets/ex/deadbug-0.jpg','./assets/ex/deadbug-1.jpg','./assets/ex/escapula-0.jpg','./assets/ex/escapula-1.jpg','./assets/ex/farmer-0.jpg','./assets/ex/farmer-1.jpg','./assets/ex/flexao-0.jpg','./assets/ex/flexao-1.jpg','./assets/ex/flexao-parede-0.jpg','./assets/ex/flexao-parede-1.jpg','./assets/ex/gato-vaca-0.jpg','./assets/ex/gato-vaca-1.jpg','./assets/ex/lateral-0.jpg','./assets/ex/lateral-1.jpg','./assets/ex/legpress-0.jpg','./assets/ex/legpress-1.jpg','./assets/ex/marcha-0.jpg','./assets/ex/marcha-1.jpg','./assets/ex/pallof-0.jpg','./assets/ex/pallof-1.jpg','./assets/ex/ponte-gluteo-0.jpg','./assets/ex/ponte-gluteo-1.jpg','./assets/ex/ponte-uni-0.jpg','./assets/ex/ponte-uni-1.jpg','./assets/ex/prancha-0.jpg','./assets/ex/prancha-1.jpg','./assets/ex/puxada-0.jpg','./assets/ex/puxada-1.jpg','./assets/ex/remada-maquina-0.jpg','./assets/ex/remada-maquina-1.jpg','./assets/ex/stepup-0.jpg','./assets/ex/stepup-1.jpg','./assets/ex/supino-0.jpg','./assets/ex/supino-1.jpg','./assets/ex/suspensao-0.jpg','./assets/ex/terra-romeno-0.jpg','./assets/ex/terra-romeno-1.jpg'];
self.addEventListener('install', event=>{
  event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ASSETS)).then(()=>self.skipWaiting()));
});
self.addEventListener('activate', event=>{
  event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE&&!k.startsWith('calistenia-bjj-licensed-images')).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));
});
self.addEventListener('fetch', event=>{
  if(event.request.method!=='GET')return;
  const url=new URL(event.request.url);
  if(url.origin==='https://exercise-dataset.com'&&url.pathname.startsWith('/images/flat/')){
    event.respondWith(caches.open('calistenia-bjj-licensed-images-v03').then(cache=>cache.match(event.request).then(cached=>cached||fetch(event.request).then(response=>{
      if(response.ok||response.type==='opaque')cache.put(event.request,response.clone()).catch(()=>{});
      return response;
    }))));return;
  }
  if(url.origin!==self.location.origin)return;
  if(event.request.mode==='navigate'){
    event.respondWith(fetch(event.request).then(response=>{
      if(response.ok){const copy=response.clone();caches.open(CACHE).then(cache=>cache.put('./index.html',copy));}
      return response;
    }).catch(()=>caches.match('./index.html')));
    return;
  }
  event.respondWith(caches.match(event.request).then(cached=>cached||fetch(event.request).then(response=>{
    if(response.ok){const copy=response.clone();caches.open(CACHE).then(cache=>cache.put(event.request,copy));}
    return response;
  })));
});
