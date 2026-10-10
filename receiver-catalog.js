(()=>{
 'use strict';
 const button=document.getElementById('rxCatalogSearch');if(!button)return;
 const country=document.getElementById('rxCatalogCountry'),type=document.getElementById('rxCatalogType'),status=document.getElementById('rxCatalogStatus'),box=document.getElementById('rxCatalogResults'),more=document.getElementById('rxCatalogMore');
 let catalog=null,limit=30,date='';
 const norm=s=>String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
 function address(s){const u=new URL(s);if(!['http:','https:'].includes(u.protocol)||u.username||u.password)throw Error('Invalid address');return u.href;}
 function render(){
  if(!catalog)return;
  const matches=catalog.filter(r=>(!country.value||r.country===country.value)&&(!type.value||r.type===type.value));
  box.replaceChildren();status.textContent=matches.length+' mottagare hittades. Visar '+Math.min(limit,matches.length)+'. Katalog hämtad '+date+'. Tillgänglighet ej kontrollerad.';
  for(const r of matches.slice(0,limit)){
   const card=document.createElement('article');card.className='receiver-card';const h=document.createElement('h4');h.textContent=r.name;
   const detail=document.createElement('p');detail.textContent=[r.countryName,r.place,r.type].filter(Boolean).join(' • ');
   const source=document.createElement('p');source.textContent='Källa: '+r.source+(r.countrySource==='coordinates'?' • Land från koordinater':'');
   const actions=document.createElement('div');actions.className='directory-links';const a=document.createElement('a');a.href=r.url;a.target='_blank';a.rel='noopener noreferrer';a.textContent='Öppna ↗';a.setAttribute('aria-label','Öppna '+r.name+' i ny flik');
   const favorite=document.createElement('button');favorite.type='button';favorite.textContent='☆ Spara favorit';favorite.setAttribute('aria-label','Spara favorit: '+r.name);
   favorite.onclick=()=>{document.getElementById('rxCustomName').value=r.name;document.getElementById('rxCustomUrl').value=r.url;document.getElementById('rxSaveCustom').click();status.textContent=document.getElementById('rxCustomStatus').textContent;};
   actions.append(a,favorite);card.append(h,detail,source,actions);box.append(card);
  }
  more.hidden=matches.length<=limit;
 }
 async function load(showResults=true){
  if(catalog){limit=30;render();return;}
  button.disabled=true;status.textContent='Hämtar mottagarkatalogen…';
  try{
   const response=await fetch('./receiver-catalog.json');if(!response.ok)throw Error('HTTP '+response.status);
   const data=await response.json();if(!Array.isArray(data.receivers))throw Error('Invalid catalog');
   let english;try{english=new Intl.DisplayNames(['en'],{type:'region'});}catch(_){}
   catalog=data.receivers.filter(r=>{try{address(r.url);return true;}catch(_){return false;}}).map(r=>({...r,englishCountry:/^[A-Z]{2}$/.test(r.country)&&english?english.of(r.country):''}));
   date=new Date(data.updated).toLocaleDateString('sv-SE');
   const countries=new Map(catalog.filter(r=>/^[A-Z]{2}$/.test(r.country)).map(r=>[r.country,r.countryName]));
   for(const [code,name] of [...countries].sort((a,b)=>a[1].localeCompare(b[1],'sv'))){const option=document.createElement('option');option.value=code;option.textContent=name;country.append(option);}
   country.disabled=false;type.disabled=false;
   if(showResults)render();else status.textContent=countries.size+' länder finns i katalogen. Välj land och mottagartyp. Katalog hämtad '+date+'.';
  }catch(e){status.textContent='Katalogen kunde inte hämtas. Försök igen eller använd mottagarlistorna och kartorna nedan.';}
  finally{button.disabled=false;}
 }
 button.onclick=()=>load(true);
 country.onchange=type.onchange=()=>{limit=30;render();};more.onclick=()=>{limit+=30;render();};
 load(false);
})();
