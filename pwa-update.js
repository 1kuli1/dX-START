/* Updates never clear localStorage or IndexedDB. Reload only on the user's request. */
(()=>{
 'use strict';
 if(!('serviceWorker' in navigator)||!(location.protocol==='https:'||location.hostname==='localhost'))return;
 const script=document.currentScript;
 const workerURL=new URL('sw.js',script.src);
 let registration,waiting,requested=false,banner;
 function show(worker){
  waiting=worker;
  if(banner)banner.remove();
  banner=document.createElement('section');
  banner.setAttribute('role','status');
  banner.setAttribute('aria-label','Programuppdatering');
  banner.style.cssText='position:fixed;bottom:12px;left:12px;right:12px;max-width:650px;margin:auto;padding:18px;background:#fff;color:#172333;border:2px solid #145d79;border-radius:12px;box-shadow:0 4px 24px #0005;z-index:100000;font:16px/1.5 system-ui';
  const text=document.createElement('p');
  text.textContent='Ny version finns. Sparade loggar och inställningar behålls. Spara det du arbetar med innan du uppdaterar. Övriga öppna flikar uppdateras när du öppnar dem igen.';
  banner.append(text);
  const update=document.createElement('button');
  update.type='button';update.textContent='Uppdatera';
  update.style.cssText='min-height:44px;padding:10px 18px;margin:4px;background:#145d79;color:white;border:2px solid #145d79;border-radius:6px;font:inherit';
  update.addEventListener('click',()=>{
   if(!waiting||waiting.state==='redundant'){banner.remove();return;}
   requested=true;update.disabled=true;update.textContent='Uppdaterar…';
   waiting.postMessage({type:'DX_ACTIVATE_UPDATE'});
  });
  const later=document.createElement('button');
  later.type='button';later.textContent='Senare';
  later.style.cssText='min-height:44px;padding:10px 18px;margin:4px;background:white;color:#172333;border:2px solid #145d79;border-radius:6px;font:inherit';
  later.addEventListener('click',()=>banner.remove());
  banner.append(update,later);document.body.append(banner);
 }
 navigator.serviceWorker.addEventListener('controllerchange',()=>{
  if(requested){requested=false;location.reload();}
 });
 async function start(){
  try{
   registration=await navigator.serviceWorker.register(workerURL.href,{scope:new URL('./',workerURL).href,updateViaCache:'none'});
   if(registration.waiting&&navigator.serviceWorker.controller)show(registration.waiting);
   registration.addEventListener('updatefound',()=>{
    const installing=registration.installing;if(!installing)return;
    installing.addEventListener('statechange',()=>{
     if(installing.state==='installed'&&navigator.serviceWorker.controller&&registration.waiting)show(registration.waiting);
    });
   });
   await registration.update();
  }catch(error){console.warn('Uppdateringskontroll kunde inte genomföras',error);}
 }
 if(document.readyState==='complete')start();else window.addEventListener('load',start,{once:true});
 document.addEventListener('visibilitychange',()=>{
  if(document.visibilityState==='visible'&&registration){
   if(registration.waiting&&navigator.serviceWorker.controller)show(registration.waiting);
   registration.update().catch(()=>{});
  }
 });
})();
