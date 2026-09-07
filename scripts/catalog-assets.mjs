import {CATALOG} from '../src/catalog-data.js';
const headers={'User-Agent':'Mushapp/0.2 (https://github.com/azzaroaleandro/mushapp; educational species catalogue)'};
async function json(url){const r=await fetch(url,{headers,signal:AbortSignal.timeout(20000)});if(!r.ok)throw new Error('HTTP '+r.status+' '+new URL(url).hostname);return r.json();}
const text=html=>String(html??'').replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim();
const media={};
for(const taxon of CATALOG){
 try{
  const query=new URLSearchParams({action:'query',format:'json',redirects:'1',prop:'pageimages',piprop:'name',titles:taxon.latin});
  const body=await json('https://en.wikipedia.org/w/api.php?'+query);
  const page=Object.values(body.query?.pages??{}).find(p=>p.pageimage);
  if(!page)throw new Error('No page image');
  const p=new URLSearchParams({action:'query',format:'json',prop:'imageinfo',iiprop:'url|extmetadata',iiurlwidth:'640',titles:'File:'+page.pageimage});
  const file=await json('https://commons.wikimedia.org/w/api.php?'+p);
  const info=Object.values(file.query?.pages??{})[0]?.imageinfo?.[0],meta=info?.extmetadata;
  if(!info||!meta)throw new Error('No Commons metadata');
  const license=text(meta.LicenseShortName?.value),author=text(meta.Artist?.value);
  if(!/^(CC BY|CC0|Public domain)/i.test(license)||!author)throw new Error('License or attribution unavailable: '+license);
  media[taxon.id]={url:info.thumburl??info.url,original:info.url,source:info.descriptionurl,author,license,licenseUrl:meta.LicenseUrl?.value??null,title:page.pageimage,caption:taxon.latin};
  console.log('PHOTO_OK '+taxon.id);
 }catch(error){console.log('PHOTO_ERROR '+taxon.id+' '+error.message);}
 await new Promise(r=>setTimeout(r,250));
}
console.log('CATALOG_MEDIA_JSON='+JSON.stringify(media));
console.log('CATALOG_PHOTO_COUNT='+Object.keys(media).length);
const search=await json('https://api.gbif.org/v1/species/search?highertaxonKey=5&rank=SPECIES&status=ACCEPTED&datasetKey=d7dddbf4-2cf0-4f39-9b2a-bb099caae36c&limit=2&q=Boletus');
console.log('GBIF_CHECK='+JSON.stringify({count:search.count,results:search.results.map(r=>({key:r.key,canonicalName:r.canonicalName,kingdom:r.kingdom,rank:r.rank,taxonomicStatus:r.taxonomicStatus}))}));
