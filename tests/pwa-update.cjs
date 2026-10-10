const {JSDOM}=require('jsdom');
const fs=require('node:fs');const assert=require('node:assert/strict');
const code=fs.readFileSync('pwa-update.js','utf8');
async function run(waiting){
 const dom=new JSDOM('<body><script src="https://example.org/dX-START/pwa-update.js"></script></body>',{url:'https://example.org/dX-START/',runScripts:'outside-only'});
 const w=dom.window;const messages=[];
 const worker={state:'installed',postMessage:m=>messages.push(m)};
 const reg={waiting:waiting?worker:null,update:async()=>{},addEventListener:()=>{}};
 Object.defineProperty(w.document,'currentScript',{value:w.document.querySelector('script')});
 Object.defineProperty(w.document,'visibilityState',{value:'visible'});
 Object.defineProperty(w.navigator,'serviceWorker',{value:{controller:waiting?{}:null,register:async()=>reg,addEventListener:()=>{}}});
 w.localStorage.setItem('dxLogs','[{"station":"Test"}]');w.localStorage.setItem('settings','original');
 w.eval(code);w.dispatchEvent(new w.Event('load'));await new Promise(r=>setTimeout(r,20));
 if(waiting){
  const buttons=w.document.querySelectorAll('button');assert.equal(buttons[0].textContent,'Uppdatera');
  buttons[1].click();assert.equal(messages.length,0);assert.equal(w.document.querySelector('[role=status]'),null);
  w.document.dispatchEvent(new w.Event('visibilitychange'));
  w.document.querySelector('button').click();assert.deepEqual(JSON.parse(JSON.stringify(messages)),[{type:'DX_ACTIVATE_UPDATE'}]);
 }else assert.equal(w.document.querySelector('[role=status]'),null);
 assert.equal(w.localStorage.getItem('dxLogs'),'[{"station":"Test"}]');assert.equal(w.localStorage.getItem('settings'),'original');dom.window.close();
}
(async()=>{await run(true);await run(false);const sw=fs.readFileSync('sw.js','utf8');assert.match(sw,/DX_ACTIVATE_UPDATE/);assert.doesNotMatch(sw,/indexedDB|localStorage/);console.log('PWA: update, later, first install and stored data checks passed');})();
