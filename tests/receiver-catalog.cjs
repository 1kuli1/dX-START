const fs=require('fs'),assert=require('node:assert/strict'),{JSDOM}=require('jsdom');
(async()=>{
const dom=new JSDOM(fs.readFileSync('receiver-hub.html','utf8'),{url:'https://example.org/',runScripts:'outside-only'}),w=dom.window;
const data=JSON.parse(fs.readFileSync('receiver-catalog.json','utf8'));assert.ok(data.receivers.length>1000);
w.fetch=async()=>({ok:true,json:async()=>data});w.open=()=>{};
w.eval(fs.readFileSync('receiver-custom.js','utf8'));w.eval(fs.readFileSync('receiver-catalog.js','utf8'));
await new Promise(r=>setTimeout(r,50));const country=w.document.getElementById('rxCatalogCountry');
assert.equal(w.document.getElementById('searchInput'),null);assert.equal(country.disabled,false);
const codes=new Set(data.receivers.map(r=>r.country).filter(c=>/^[A-Z]{2}$/.test(c)));assert.equal(country.options.length,codes.size+1);assert.equal(w.document.querySelectorAll('#rxCatalogResults article').length,0);
country.value='SE';country.dispatchEvent(new w.Event('change'));
let cards=w.document.querySelectorAll('#rxCatalogResults article');assert.ok(cards.length);assert.ok([...cards].every(c=>c.textContent.includes('Sverige')));
const type=w.document.getElementById('rxCatalogType');type.value='KiwiSDR';type.dispatchEvent(new w.Event('change'));assert.ok([...w.document.querySelectorAll('#rxCatalogResults article')].every(c=>c.textContent.includes('KiwiSDR')));
assert.equal(w.localStorage.getItem('dxCustomReceiverFavoritesV1'),null);w.document.querySelector('#rxCatalogResults button').click();assert.equal(JSON.parse(w.localStorage.getItem('dxCustomReceiverFavoritesV1')).length,1);
country.value='FI';country.dispatchEvent(new w.Event('change'));assert.ok(w.document.querySelector('#rxCatalogResults article').textContent.includes('Finland'));
country.value='NL';type.value='';country.dispatchEvent(new w.Event('change'));assert.ok(w.document.querySelector('#rxCatalogResults article').textContent.includes('Nederländerna'));
console.log('Catalog: automatic full country list, removed search, country/type selection and optional favorites passed');w.close();})();
