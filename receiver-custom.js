(()=>{
 'use strict';
 const key='dxCustomReceiverFavoritesV1';
 const form=document.getElementById('rxCustomForm');if(!form)return;
 const status=document.getElementById('rxCustomStatus');
 function validURL(value){
  const url=new URL(value.trim());
  if(!['http:','https:'].includes(url.protocol)||url.username||url.password)throw Error('Ange en fullständig http- eller https-adress utan inloggningsuppgifter.');
  return url.href;
 }
 function read(){
  const data=JSON.parse(localStorage.getItem(key)||'[]');
  if(!Array.isArray(data))throw Error('Sparade egna favoriter kunde inte läsas.');
  return data;
 }
 function render(){
  const box=document.getElementById('rxCustomFavorites');box.replaceChildren();
  try{
   const items=read();if(!items.length)return;
   const heading=document.createElement('h3');heading.textContent='Mina egna mottagarfavoriter';box.append(heading);
   for(const item of items){
    const row=document.createElement('div');row.className='directory-links';
    const a=document.createElement('a');a.href=validURL(item.url);a.textContent='Öppna '+String(item.name);a.target='_blank';a.rel='noopener noreferrer';
    const remove=document.createElement('button');remove.type='button';remove.textContent='Ta bort favorit';remove.setAttribute('aria-label','Ta bort favorit: '+String(item.name));
    remove.onclick=()=>{try{localStorage.setItem(key,JSON.stringify(read().filter(x=>x.url!==item.url)));render();status.textContent='Favoriten är borttagen.';}catch(e){status.textContent='Favoriten kunde inte tas bort: '+e.message;}};
    row.append(a,remove);box.append(row);
   }
  }catch(e){status.textContent='Egna favoriter kunde inte läsas. Befintliga uppgifter har bevarats.';}
 }
 form.addEventListener('submit',event=>{
  event.preventDefault();try{const url=validURL(document.getElementById('rxCustomUrl').value);window.open(url,'_blank','noopener,noreferrer');status.textContent='Mottagaren öppnas i en ny flik. Ingen favorit har sparats.';}catch(e){status.textContent=e.message;}
 });
 document.getElementById('rxSaveCustom').addEventListener('click',()=>{
  try{
   const url=validURL(document.getElementById('rxCustomUrl').value);
   const name=document.getElementById('rxCustomName').value.trim();if(!name)throw Error('Ange ett namn för favoriten.');
   const items=read();const old=items.find(x=>x.url===url);if(old)old.name=name;else items.push({name,url});
   localStorage.setItem(key,JSON.stringify(items));render();status.textContent='Favoriten är sparad på denna enhet.';
  }catch(e){status.textContent='Favoriten kunde inte sparas: '+e.message;}
 });
 window.addEventListener('storage',event=>{if(event.key===key)render();});render();
})();
