"""Build a dated receiver catalog from public directory snapshots.
Usage: python3 scripts/build-receiver-catalog.py RECEIVERBOOK_HTML FMDX_JSON NATURAL_EARTH_GEOJSON
Country for Receiverbook is inferred from coordinates, never from station names.
Natural Earth geographic data is public domain; https://www.naturalearthdata.com/about/terms-of-use/
"""
import json,re,sys,html
from pathlib import Path
from datetime import datetime,timezone
rb,fm,geo=map(Path,sys.argv[1:4]);features=json.loads(geo.read_text())['features'];polys=[]
for f in features:
 prop=f['properties'];code=prop.get('ISO_A2_EH',prop.get('ISO_A2',''));name=prop.get('NAME_SV') or prop['ADMIN']
 coords=f['geometry']['coordinates'];coords=coords if f['geometry']['type']=='MultiPolygon' else [coords]
 for rings in coords:
  ring=rings[0];xs=[p[0] for p in ring];ys=[p[1] for p in ring];polys.append((min(xs),min(ys),max(xs),max(ys),rings,code,name))
def inside(x,y,ring):
 on=False
 for i in range(len(ring)):
  ax,ay=ring[i-1][:2];bx,by=ring[i][:2]
  if (ay>y)!=(by>y) and x<(bx-ax)*(y-ay)/(by-ay)+ax:on=not on
 return on
def country(x,y):
 for a,b,c,d,rings,code,name in polys:
  if a<=x<=c and b<=y<=d and inside(x,y,rings[0]) and not any(inside(x,y,r) for r in rings[1:]):return code,name
 return '', 'Land ej fastställt'
def clean(s):return re.sub(r'\s+',' ',html.unescape(re.sub('<[^>]*>',' ',str(s)))).strip()[:240]
def valid(url):return str(url).startswith(('http://','https://'))
data=[];seen=set();sites=json.loads(re.search(r'var\s+receivers\s*=\s*(\[.*?\]);',rb.read_text(),re.S)[1])
for site in sites:
 xy=site.get('location',{}).get('coordinates',[]);code,name=country(*xy[:2]) if len(xy)>=2 else ('','Land ej fastställt')
 for rx in site.get('receivers',[]):
  url=rx.get('url','')
  if not valid(url) or url in seen:continue
  seen.add(url);data.append({'name':clean(rx.get('label') or site['label']),'place':clean(site.get('label','')),'url':url,'type':rx.get('type','Annan'),'country':code,'countryName':name,'countrySource':'coordinates','source':'Receiverbook'})
for rx in json.loads(fm.read_text())['dataset']:
 url=rx.get('url','')
 if not valid(url) or url in seen:continue
 seen.add(url);code=str(rx.get('country','')).upper();name=rx.get('countryName','Land ej fastställt')
 for f in features:
  if f['properties'].get('ISO_A2_EH')==code:name=f['properties'].get('NAME_SV') or name;break
 data.append({'name':clean(rx.get('name','FM-mottagare')),'place':clean(rx.get('city','')),'url':url,'type':'FM-DX','country':code,'countryName':name,'countrySource':'directory','source':'FMDX.org'})
result={'updated':datetime.now(timezone.utc).isoformat(),'sources':['https://www.receiverbook.de/map','https://servers.fmdx.org/api'],'countryData':'Natural Earth 1:10m (public domain)','receivers':data}
Path('receiver-catalog.json').write_text(json.dumps(result,ensure_ascii=False,separators=(',',':'))+'\n');print('Receivers:',len(data),'countries:',len({r['country'] for r in data if r['country']}))
