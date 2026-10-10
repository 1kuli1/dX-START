const {JSDOM}=require('jsdom');const fs=require('fs');const assert=require('node:assert/strict');
const html=fs.readFileSync('receiver-hub.html','utf8');const dom=new JSDOM(html,{url:'https://example.org/dX-START/',runScripts:'outside-only'});const w=dom.window;const opened=[];w.open=(...a)=>opened.push(a);
w.eval(fs.readFileSync('receiver-custom.js','utf8'));
const key='dxCustomReceiverFavoritesV1';const url=w.document.getElementById('rxCustomUrl');const name=w.document.getElementById('rxCustomName');const form=w.document.getElementById('rxCustomForm');const save=w.document.getElementById('rxSaveCustom');
w.localStorage.setItem('dxLogs','untouched');url.value='http://radio.example:8073/?f=1008am';name.value='<img src=x onerror=alert(1)>';
form.dispatchEvent(new w.Event('submit',{cancelable:true}));assert.equal(opened[0][0],url.value);assert.equal(w.localStorage.getItem(key),null);
save.click();assert.equal(JSON.parse(w.localStorage.getItem(key)).length,1);assert.equal(w.document.querySelector('#rxCustomFavorites img'),null);
save.click();assert.equal(JSON.parse(w.localStorage.getItem(key)).length,1);
url.value='javascript:alert(1)';form.dispatchEvent(new w.Event('submit',{cancelable:true}));assert.equal(opened.length,1);
w.document.querySelector('#rxCustomFavorites button').click();assert.deepEqual(JSON.parse(w.localStorage.getItem(key)),[]);
w.localStorage.setItem(key,'corrupt');url.value='https://radio.example/';save.click();assert.equal(w.localStorage.getItem(key),'corrupt');assert.equal(w.localStorage.getItem('dxLogs'),'untouched');
for(const href of ['http://rx.kiwisdr.com/','http://map.kiwisdr.com/','https://websdr.org/','https://servers.fmdx.org/','https://instances.ubersdr.org/']){const a=[...w.document.querySelectorAll('a')].find(x=>x.href===href);assert.ok(a);assert.equal(a.target,'_blank');}
console.log('Receiver choice: optional saving, URL/port fidelity, duplicate, removal, XSS, corrupt data and directory links passed');w.close();
