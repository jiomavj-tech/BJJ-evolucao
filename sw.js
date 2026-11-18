/* Cache estático local: sem rastreamento, sem APIs remotas. */
const CACHE='bjj-evolucao-static-v05';
const ASSETS=['./','./index.html','./styles.css','./app.mjs','./core.mjs','./evolution.mjs','./gamification.mjs','./visuals.mjs','./techniques.mjs','./bjj.mjs','./manifest.webmanifest','./assets/icon-192.png','./assets/icon-512.png'];
self.addEventListener('install', event=>{
  event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ASSETS)).then(()=>self.skipWaiting()));
});
self.addEventListener('activate', event=>{
  event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));
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
