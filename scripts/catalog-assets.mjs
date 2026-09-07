import {CATALOG} from '../src/catalog-data.js';
import {MEDIA} from '../src/catalog-media.js';
const headers={'User-Agent':'Mushapp/0.2 (https://github.com/azzaroaleandro/mushapp; educational species catalogue)'};
async function json(url){const r=await fetch(url,{headers,signal:AbortSignal.timeout(20000)});if(!r.ok)throw new Error('HTTP '+r.status+' '+new URL(url).hostname);return r.json();}
const text=html=>String(html??'').replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim();
async function infoFor(file,taxon){
 const p=new URLSearchParams({action:'query',format:'json',prop:'imageinfo',iiprop:'url|extmetadata',iiurlwidth:'640',titles:file});
 const body=await json('https://commons.wikimedia.org/w/api.php?'+p);
 const info=Object.values(body.query?.pages??{})[0]?.imageinfo?.[0],meta=info?.extmetadata;
 if(!info||!meta)return null;
 const license=text(meta.LicenseShortName?.value),author=text(meta.Artist?.value);
 if(!/^(CC BY|CC0|Public domain)/i.test(license)||!author)return null;
 return {url:info.thumburl??info.url,original:info.url,source:info.descriptionurl,author,license,licenseUrl:meta.LicenseUrl?.value??null,title:file,caption:taxon.latin};
}
const media={...MEDIA};
for(const taxon of CATALOG){
 if(media[taxon.id])continue;
 try{
  for(const lang of ['en','it']){
   const p=new URLSearchParams({action:'query',format:'json',redirects:'1',prop:'pageimages',piprop:'name',titles:taxon.latin});
   const body=await json('https://'+lang+'.wikipedia.org/w/api.php?'+p),page=Object.values(body.query?.pages??{}).find(p=>p.pageimage);
   if(page){const info=await infoFor('File:'+page.pageimage,taxon);if(info){media[taxon.id]=info;break;}}
  }
  if(!media[taxon.id]){
   const p=new URLSearchParams({action:'query',format:'json',list:'categorymembers',cmtitle:'Category:'+taxon.latin,cmtype:'file',cmlimit:'30'});
   const category=await json('https://commons.wikimedia.org/w/api.php?'+p);
   for(const candidate of category.query?.categorymembers??[]){
    if(!/\.(jpg|jpeg|png)$/i.test(candidate.title))continue;
    const info=await infoFor(candidate.title,taxon);
    if(info){media[taxon.id]=info;break;}
   }
  }
  console.log((media[taxon.id]?'PHOTO_OK ':'PHOTO_ERROR ')+taxon.id);
 }catch(error){console.log('PHOTO_ERROR '+taxon.id+' '+error.message);}
}
console.log('CATALOG_MEDIA_JSON='+JSON.stringify(media));
console.log('CATALOG_PHOTO_COUNT='+Object.keys(media).length);
if(Object.keys(media).length!==CATALOG.length)throw new Error('Missing licensed photographs');
const search=await json('https://api.gbif.org/v1/species/search?highertaxonKey=5&rank=SPECIES&status=ACCEPTED&datasetKey=d7dddbf4-2cf0-4f39-9b2a-bb099caae36c&limit=2&q=Boletus');
console.log('GBIF_CHECK='+JSON.stringify({count:search.count,results:search.results.map(r=>({key:r.key,canonicalName:r.canonicalName,kingdom:r.kingdom,rank:r.rank,taxonomicStatus:r.taxonomicStatus}))}));
