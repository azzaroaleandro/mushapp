export const GBIF_BACKBONE='d7dddbf4-2cf0-4f39-9b2a-bb099caae36c';
export function gbifSearchUrl(query='',offset=0){const p=new URLSearchParams({q:query.trim(),highertaxonKey:'5',rank:'SPECIES',status:'ACCEPTED',datasetKey:GBIF_BACKBONE,limit:'24',offset:String(offset)});return 'https://api.gbif.org/v1/species/search?'+p;}
export function normalizeTaxa(body){
 if(!body||!Array.isArray(body.results))throw new Error('Risposta del catalogo non valida.');
 return {count:Number.isFinite(body.count)?body.count:null,end:body.endOfRecords===true,results:body.results.filter(r=>r.kingdom==='Fungi'&&r.rank==='SPECIES'&&r.taxonomicStatus==='ACCEPTED'&&Number.isInteger(r.key)).map(r=>({key:r.key,latin:r.canonicalName??r.scientificName,name:r.vernacularNames?.find(n=>n.language==='ita'||n.language==='it')?.vernacularName??null,family:r.family??null,genus:r.genus??null,status:'unknown'}))};
}
export async function searchTaxa(query,offset=0,{fetcher=fetch,signal}={}){const r=await fetcher(gbifSearchUrl(query,offset),{signal});if(!r.ok)throw new Error('Indice mondiale temporaneamente non disponibile.');return normalizeTaxa(await r.json());}
export function safeUrl(url,hosts){try{const u=new URL(url);return u.protocol==='https:'&&hosts.some(h=>u.hostname===h||u.hostname.endsWith('.'+h))?u.href:null;}catch{return null;}}
export async function gbifMedia(key,{fetcher=fetch,signal}={}){
 const response=await fetcher('https://api.gbif.org/v1/species/'+Number(key)+'/media',{signal});
 if(!response.ok)return null;
 const data=await response.json();
 const item=data.results?.find(m=>safeUrl(m.identifier,['upload.wikimedia.org','static.inaturalist.org','inaturalist-open-data.s3.amazonaws.com'])&&/^https?:\/\/creativecommons.org\/(licenses\/by(-sa)?\/|publicdomain\/)/.test(m.license??'')&&m.creator);
 if(!item)return null;
 return {url:item.identifier,author:item.creator,license:item.license,source:item.references??'https://www.gbif.org/species/'+key};
}
