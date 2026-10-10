const fs=require('fs'),assert=require('node:assert/strict'),{JSDOM}=require('jsdom');
(async()=>{
const dom=new JSDOM(fs.readFileSync('receiver-hub.html','utf8'),{url:'https://example.org/',runScripts:'outside-only'}),w=dom.window;
const data=JSON.parse(fs.readFileSync('receiver-catalog.json','utf8'));assert.ok(data.receivers.length>1000);
w.fetch=async()=>({ok:true,json:async()=>data});w.open=()=>{};
w.eval(fs.readFileSync('receiver-custom.js','utf8'));w.eval(fs.readFileSync('receiver-catalog.js','utf8'));
const search=w.document.getElementById('searchInput');search.value='Sverige';w.document.getElementById('rxCatalogSearch').click();await new Promise(r=>setTimeout(r,50));
let cards=w.document.querySelectorAll('#rxCatalogResults article');assert.ok(cards.length);assert.ok([...cards].every(c=>c.textContent.includes('Sverige')));
const type=w.document.getElementById('rxCatalogType');type.value='KiwiSDR';type.dispatchEvent(new w.Event('change'));assert.ok([...w.document.querySelectorAll('#rxCatalogResults article')].every(c=>c.textContent.includes('KiwiSDR')));
assert.equal(w.localStorage.getItem('dxCustomReceiverFavoritesV1'),null);w.document.querySelector('#rxCatalogResults button').click();assert.equal(JSON.parse(w.localStorage.getItem('dxCustomReceiverFavoritesV1')).length,1);
search.value='Finland';search.dispatchEvent(new w.Event('input'));assert.ok(w.document.querySelector('#rxCatalogResults article').textContent.includes('Finland'));
search.value='Netherlands';type.value='';search.dispatchEvent(new w.Event('input'));assert.ok(w.document.querySelector('#rxCatalogResults article').textContent.includes('Nederländerna'));
search.value='NoSuchCountryXYZ';search.dispatchEvent(new w.Event('input'));assert.equal(w.document.querySelectorAll('#rxCatalogResults article').length,0);
console.log('Catalog: country searches, type selection, optional favorites and empty results passed');w.close();})();
