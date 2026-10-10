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

/* Shared Asta shortcut on every DX page, independent of PWA support. */
(()=>{
 'use strict';
 const source=document.currentScript;
 if(!source?.src)return;
 const astaURL=new URL('asta.html',source.src);
 function addShortcut(){
  if(document.getElementById('dx-asta-shortcut'))return;
  const style=document.createElement('style');
  style.textContent=`
   html{scroll-padding-bottom:100px}
   #dx-asta-space{height:88px;flex-shrink:0}
   #dx-asta-shortcut,#dx-asta-shortcut:visited{position:fixed;right:max(12px,env(safe-area-inset-right));bottom:calc(12px + env(safe-area-inset-bottom));z-index:9990;display:flex;align-items:center;gap:8px;min-height:52px;box-sizing:border-box;padding:8px 14px;border:2px solid #fff;border-radius:30px;background:#facc15;color:#111827;text-decoration:none;font:700 17px/1.2 system-ui,sans-serif;box-shadow:0 3px 14px #0008}
   #dx-asta-shortcut:focus-visible{outline:3px solid #38bdf8;outline-offset:4px}
   #dx-asta-shortcut:hover{background:#fde68a}
   #dx-asta-shortcut svg{width:30px;height:30px;flex:none}
   #dx-asta-shortcut[hidden]{display:none}
   @media print{#dx-asta-shortcut,#dx-asta-space{display:none}}
  `;
  document.head.append(style);
  const link=document.createElement('a');link.id='dx-asta-shortcut';
  const onAsta=location.pathname===astaURL.pathname;
  link.href=onAsta?'#question':astaURL.href;
  link.setAttribute('aria-label',onAsta?'Asta – gå till din fråga':'Fråga Asta – öppnas i en ny flik');
  link.title='Fråga Asta';
  if(!onAsta){link.target='_blank';link.rel='noopener';}
  link.innerHTML='<svg viewBox="0 0 32 32" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 5V2M12 2h8"/><rect x="5" y="7" width="22" height="18" rx="6"/><path d="M2 13v6M30 13v6M11 29v-4M21 29v-4M12 20h8"/><circle cx="11" cy="14" r="1.5" fill="currentColor"/><circle cx="21" cy="14" r="1.5" fill="currentColor"/></svg><span>Asta</span>';
  if(onAsta)link.addEventListener('click',()=>document.getElementById('question')?.focus());
  const space=document.createElement('div');space.id='dx-asta-space';space.setAttribute('aria-hidden','true');
  document.body.append(space,link);
  // Keep the shortcut out of the way while the onscreen keyboard is open.
  const viewport=window.visualViewport;
  if(viewport){const adjust=()=>{link.hidden=window.innerHeight-viewport.height>150;};viewport.addEventListener('resize',adjust);adjust();}
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',addShortcut,{once:true});else addShortcut();
})();
