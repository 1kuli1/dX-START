/* DXportalen beta: sidor offline; inga personliga loggar eller externa radioströmmar cachas. */
const CACHE='dxportalen-v19-20261010-asta-help';
const SHELL=['./','./index.html','./centralen.html','./katastrof-dx.html','./receiver-hub.html','./asta.html','./dx-help.html','./guider.html','./HF_hjalp_nyborjare.pdf','./kom-igang.html','./academy/index.html','./academy/lektioner.html','./academy/nyborgare/index.html','./pwa-update.js','./receiver-custom.js','./receiver-catalog.js','./receiver-catalog.json','./manifest.webmanifest','./icon-192.png','./icon-512.png','./icon.svg'];
const ALLOWED=new Set(SHELL.map(p=>new URL(p,self.registration.scope).pathname));
const ACADEMY_ROOT=new URL('./academy/',self.registration.scope).pathname;
self.addEventListener('install',event=>{
 event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(SHELL)));
});
self.addEventListener('message',event=>{
 if(event.data && event.data.type==='DX_ACTIVATE_UPDATE') event.waitUntil(self.skipWaiting());
});
self.addEventListener('activate',event=>{
 event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>(k.startsWith('dx-centralen-beta-')||k.startsWith('dxportalen-'))&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));
});
self.addEventListener('fetch',event=>{
 const req=event.request,url=new URL(req.url);
 if(req.method!=='GET'||url.origin!==self.location.origin||(!ALLOWED.has(url.pathname)&&!url.pathname.startsWith(ACADEMY_ROOT)))return;
 event.respondWith((async()=>{
  const cache=await caches.open(CACHE);
  try{
   const response=await fetch(req);
   if(response.ok && response.type==='basic'){try{await cache.put(req,response.clone());}catch(e){console.warn('Offline-kopia kunde inte uppdateras',e);}}
   return response;
  }catch(error){
   const saved=await cache.match(req,{ignoreSearch:true});
   if(saved)return saved;
   if(req.mode==='navigate'){
     const home=await cache.match(new URL('./index.html',self.registration.scope));
     if(home)return home;
   }
   throw error;
  }
 })());
});
