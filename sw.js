/* DX Centralen beta: sidor offline; inga personliga loggar eller externa radioströmmar cachas. */
const CACHE='dx-centralen-beta-v1-20261009';
const SHELL=['./','./index.html','./receiver-hub.html','./asta.html','./dx-help.html','./guider.html','./manifest.webmanifest','./icon-192.png','./icon-512.png','./icon.svg'];
const ALLOWED=new Set(SHELL.map(p=>new URL(p,self.registration.scope).pathname));
self.addEventListener('install',event=>{
 event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(SHELL)));
});
self.addEventListener('activate',event=>{
 event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('dx-centralen-beta-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));
});
self.addEventListener('fetch',event=>{
 const req=event.request,url=new URL(req.url);
 if(req.method!=='GET'||url.origin!==self.location.origin||!ALLOWED.has(url.pathname))return;
 event.respondWith((async()=>{
  const cache=await caches.open(CACHE);
  try{
   const response=await fetch(req);
   if(response.ok && response.type==='basic')await cache.put(req,response.clone());
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