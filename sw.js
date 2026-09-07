const CACHE='mushapp-shell-v7';
const FILES=['./','./index.html','./styles.css?v=0.4.0','./icon.svg','./manifest.webmanifest','./src/app.js?v=0.4.1','./src/data.js','./src/places.js','./src/catalog.js?v=0.4.1','./src/field-guide.js?v=0.4.0','./src/catalog-data.js?v=0.4.0','./src/catalog-media.js?v=0.4.0','./src/catalog-api.js?v=0.2.1','./src/recommendations.js','./src/engine.js','./src/weather.js','./src/storage.js'];
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(FILES))));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('mushapp-shell-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',event=>{
 const url=new URL(event.request.url);
 if(event.request.method!=='GET'||url.origin!==self.location.origin)return;
 // Weather and third-party maps are never cached by the service worker.
 const known=FILES.some(file=>new URL(file,self.registration.scope).pathname===url.pathname);
 if(!known)return;
 event.respondWith(fetch(event.request).then(response=>{if(response.ok){const copy=response.clone();event.waitUntil(caches.open(CACHE).then(cache=>cache.put(event.request,copy)));}return response;}).catch(()=>caches.match(event.request).then(cached=>cached||Response.error())));
});
