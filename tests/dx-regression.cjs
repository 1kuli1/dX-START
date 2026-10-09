'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const ROOT=path.resolve(__dirname,'..');
const read=p=>fs.readFileSync(path.join(ROOT,p),'utf8');
function check(name,fn){try{fn();console.log('PASS',name);}catch(e){console.error('FAIL',name,e);process.exitCode=1;}}
const app=read('index.html'),hub=read('receiver-hub.html'),pdf=read('guider.html');
const from=(source,a,b)=>{const i=source.indexOf(a),j=source.indexOf(b,i);assert(i>=0&&j>i,'Missing code markers '+a);return source.slice(i,j);};
for(const file of ['index.html','centralen.html','katastrof-dx.html','receiver-hub.html','guider.html','asta.html','dx-help.html','academy/index.html']){
 check('JavaScript syntax '+file,()=>{
  const source=read(file);
  const matches=[...source.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g)];
  for(const m of matches)new Function(m[1]);
 });
}
const logs=new Function(from(app,'function dxHash(s){','function dxSyncStatus(msg,ok){')+'return {dxNormalizeLog,dxMergeLogs};')();
const sample={date:'2026-10-09',time:'18:40',freq:'1008',station:'Radio',rx:'Twente',mode:'AM',notes:'klar'};
check('Numeric JSON import safe',()=>{
 const n=logs.dxNormalizeLog({...sample,freq:1008,station:123,notes:null});
 assert.equal(n.freq,'1008');assert.equal(n.station,'123');assert.equal(n.notes,'');
});
check('Two old copies of the same listening merge',()=>{
 assert.equal(logs.dxMergeLogs([{...sample,saved:'2026-10-09T18:41:00Z'}],[{...sample,saved:'2026-10-09T18:42:00Z'}]).length,1);
});
check('Intentional distinct logs preserve IDs',()=>{
 assert.equal(logs.dxMergeLogs([{...sample,_id:'dx-a'}],[{...sample,_id:'dx-b'}]).length,2);
});
check('Deleted legacy observations cannot revive',()=>{
 const a={...sample,_id:'legacy-a',_deletedAt:'2026-10-09T19:00:00Z'};
 const b={...sample,_id:'legacy-b',_updatedAt:'2026-10-09T18:00:00Z'};
 assert(logs.dxMergeLogs([a],[b])[0]._deletedAt);
});
const textEscape=new Function(from(app,'function esc(s){','function linkifyText(s){')+'return esc;')();
check('Log table escapes HTML and handles numbers',()=>{
 assert.equal(textEscape(1008),'1008');assert(textEscape('<img>').includes('&lt;img&gt;'));
});
const swl=new Function(from(app,'function dxEstimateSinpo(signal){','function saveLog(){')+'return {dxEstimateSinpo,dxMakeSWLReport};')();
check('Only described signals receive proposed SINPO',()=>{
 assert.equal(swl.dxEstimateSinpo(''),'');
 assert.equal(swl.dxEstimateSinpo('S9 mycket stark'),'45444');
});
check('SWL report is a draft, not an automatic send',()=>{
 const q=swl.dxMakeSWLReport({station:'SM1ABC',counterstation:'SM2XYZ',date:'2026-10-09',time:'18:00',freq:'14074',frequencyUnit:'kHz'});
 assert(q.includes('SM1ABC'));assert(q.includes('SM2XYZ'));assert(q.includes('EJ SKICKAD'));
});
check('Public client omits private listening seed and master Drive links',()=>{
 assert(app.includes('const EMBEDDED_VERIFIED_LOGS = []'));
 assert(!app.includes('dx-recovery-seed-2026-10-07.json'));
 assert(!app.includes('docs.google.com/spreadsheets/d/'));
 assert(!fs.existsSync(path.join(ROOT,'dx-recovery-seed-2026-10-07.json')));
});
check('Old unauthenticated Drive sync stays disabled',()=>{
 assert(app.includes('const DX_SYNC_SAFE=false;'));assert(app.includes('const DX_SYNC_URL=null;'));
});
check('All guides have PDF downloads',()=>{
 assert.equal((pdf.match(/onclick="downloadPdf\(this\.dataset\.pdf\)"/g)||[]).length,29);
});
check('Receiver favorites and filters use real storage',()=>{
 assert.equal((hub.match(/class="favorite-btn"/g)||[]).length,49);
 assert(hub.includes('dxReceiverFavoritesV1'));assert(!hub.includes("alert('Favorit sparad')"));
});
check('One PWA includes the central launcher, catastrophe radio and Academy',()=>{
 const manifest=JSON.parse(read('manifest.webmanifest'));
 assert.equal(manifest.start_url,'./centralen.html');
 for(const file of ['centralen.html','katastrof-dx.html','academy/index.html','academy/nyborgare/lektion10.html','academy/sound/noise.wav'])assert(fs.existsSync(path.join(ROOT,file)));
 const worker=read('sw.js');assert(worker.includes('ACADEMY_ROOT'));new Function(worker);
});
check('DX-OS cannot overwrite corrupt shared logbook',()=>{
 // The original DX-OS page is a separate repository; only its presence is tracked
 // in its own test. This suite verifies the main application guards and reminds
 // integrators not to remove the shared-store failure check.
 assert(app.includes('dxLogStorageWarning'));assert(app.includes('if(dxLogStorageWarning){alert(dxLogStorageWarning);return false;}'));
});
if(process.exitCode)process.exit(process.exitCode);
