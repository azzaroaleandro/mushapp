import {CATALOG,EDIBILITY,HEALTH_SOURCE} from './catalog-data.js';
import {MEDIA} from './catalog-media.js';
import {searchTaxa,gbifMedia,safeUrl,MEDIA_HOSTS} from './catalog-api.js?v=0.2.1';
const $=s=>document.querySelector(s);
const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const normalize=s=>s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
export function filterCatalog(query,status='all'){const q=normalize(query.trim());return CATALOG.filter(t=>(status==='all'||t.status===status)&&normalize([t.name,t.latin,...t.aliases].join(' ')).includes(q));}
function badge(status){return '<span class="edibility '+status+'">'+esc(EDIBILITY[status]??EDIBILITY.unknown)+'</span>';}
function imageBlock(taxon,photo=MEDIA[taxon.id]){
 if(!photo)return '<div class="photo-missing">Foto non disponibile<br><span>Apri la fonte per approfondire</span></div>';
 const url=safeUrl(photo.url,MEDIA_HOSTS);
 const source=safeUrl(photo.source,['commons.wikimedia.org','gbif.org','inaturalist.org']);
 if(!url||!source)return '<div class="photo-missing">Foto non disponibile</div>';
 return '<figure class="mushroom-photo"><img src="'+esc(url)+'" alt="Foto di riferimento: '+esc(taxon.latin)+'" loading="lazy" decoding="async"><figcaption><a href="'+esc(source)+'" target="_blank" rel="noopener noreferrer">'+esc(photo.author)+' · '+esc(photo.license)+' ↗</a><span class="photo-error" hidden>Immagine non caricata. Apri la fonte.</span></figcaption></figure>';
}
export function initCatalog(){
 let mode='local',offset=0,total=null,end=true,results=[],controller=null,request=0,selectedKey=null;
 function wireImageErrors(root){root.querySelectorAll('.mushroom-photo img').forEach(img=>{img.addEventListener('error',()=>{img.hidden=true;img.closest('figure').querySelector('.photo-error').hidden=false;});});}
 function local(){
  const rows=filterCatalog($('#catalog-query').value,$('#catalog-status').value);
  $('#catalog-status-message').textContent=rows.length+' schede · selezione introduttiva, non catalogo completo delle specie.';
  $('#catalog-grid').innerHTML=rows.length?rows.map(t=>'<article class="catalog-card">'+imageBlock(t)+'<div class="catalog-card-copy">'+badge(t.status)+'<h2>'+esc(t.name)+'</h2><p class="latin">'+esc(t.latin)+'</p><p>'+esc(t.description)+'</p><button class="text-button" type="button" data-taxon="'+t.id+'">Apri la scheda ↗</button></div></article>').join(''):'<div class="empty"><strong>Nessuna scheda trovata.</strong>Prova un sinonimo o passa all’indice mondiale per cercare altri nomi scientifici.</div>';
  $('#catalog-pagination').hidden=true;wireImageErrors($('#catalog-grid'));
 }
 function show(t){
  selectedKey=null;
  $('#catalog-detail').innerHTML='<div class="dialog-header"><div><span class="eyebrow">SCHEDA DOCUMENTATA · '+t.reviewedAt+'</span><h2 id="catalog-title">'+esc(t.name)+'</h2><p class="latin">'+esc(t.latin)+'</p></div><button type="button" class="close-button" data-close="catalog-dialog" aria-label="Chiudi">×</button></div>'+badge(t.status)+imageBlock(t)+'<p class="catalog-verdict">La classificazione riguarda la specie, non l’esemplare davanti a te.</p><div class="detail-section"><h3>Nomi comuni e sinonimi</h3><p>'+esc([t.name,...t.aliases].join(' · '))+'</p><h3>Una prima conoscenza</h3><p>'+esc(t.description)+'</p></div><div class="catalog-caution"><h3>Da leggere con attenzione</h3><p>'+esc(t.caution)+'</p><h3>Somiglianze da approfondire</h3><p>'+esc(t.similar)+'</p><p>Non è una chiave completa di identificazione. Il confronto fotografico non sostituisce l’esame dell’esemplare intero da parte di un micologo.</p></div><div class="source-list"><a href="'+esc(t.source)+'" target="_blank" rel="noopener noreferrer">Scheda della Provincia di Cuneo ↗</a><a href="'+HEALTH_SOURCE+'" target="_blank" rel="noopener noreferrer">Controllo prima del consumo ↗</a></div>';
  wireImageErrors($('#catalog-detail'));if(!$('#catalog-dialog').open)$('#catalog-dialog').showModal();
 }
 async function world(){
  const current=++request;controller?.abort();controller=new AbortController();
  $('#catalog-status-message').textContent='Consulto l’indice mondiale…';$('#catalog-grid').innerHTML='';$('#catalog-pagination').hidden=true;
  try{
   const body=await searchTaxa($('#catalog-query').value,offset,{signal:controller.signal});if(current!==request)return;
   results=body.results;total=body.count;end=body.end;
   $('#catalog-status-message').textContent=(total!==null?total.toLocaleString('it-IT')+' risultati nell’indice':'Risultati nell’indice')+' · nessuna commestibilità dedotta dai nomi.';
   $('#catalog-grid').innerHTML=results.length?results.map(t=>{const known=CATALOG.find(c=>c.latin.toLowerCase()===t.latin?.toLowerCase());return '<article class="catalog-card world-card"><div class="taxon-monogram" aria-hidden="true">'+esc(t.latin?.slice(0,1))+'</div><div class="catalog-card-copy">'+badge(known?.status??'unknown')+'<h2>'+esc(t.name??t.latin)+'</h2><p class="latin">'+esc(t.latin)+'</p><p>'+esc(t.name?'Nome comune italiano presente nella fonte.':'Nome comune italiano non disponibile nella fonte.')+'</p><p class="small muted">'+esc([t.genus,t.family].filter(Boolean).join(' · '))+'</p><button class="text-button" data-global-taxon="'+t.key+'" type="button">Apri il taxon ↗</button></div></article>';}).join(''):'<div class="empty">Nessun risultato. Nell’indice mondiale prova il nome scientifico: i nomi comuni italiani non sono disponibili per tutte le specie.</div>';
   $('#catalog-pagination').hidden=offset===0&&end;$('#catalog-prev').disabled=offset===0;$('#catalog-next').disabled=end;
   $('#catalog-page').textContent='Pagina '+(offset/24+1);
  }catch(error){if(error.name!=='AbortError'&&current===request){$('#catalog-status-message').textContent='Indice non disponibile: riprova con Cerca. Le schede del bosco restano disponibili.';}}
 }
 function setMode(next){
  mode=next;controller?.abort();request++;offset=0;
  $('#catalog-local').setAttribute('aria-pressed',String(mode==='local'));$('#catalog-world').setAttribute('aria-pressed',String(mode==='world'));
  $('#catalog-status-label').hidden=mode==='world';
  $('#catalog-scope').textContent=mode==='local'?'24 schede curate con riferimenti espliciti. Le fotografie illustrano una specie e non mostrano tutte le sue varianti.':'Ricerca estesa nelle specie del regno Fungi presenti nel backbone GBIF. Non è garantita la completezza di tutte le specie conosciute: tassonomia, nomi comuni, foto e descrizioni possono essere mancanti o cambiare. Richiede internet. La commestibilità resta non verificata fuori dalle schede curate.';
  if(mode==='local')local();else world();
 }
 $('#catalog-local').addEventListener('click',()=>setMode('local'));
 $('#catalog-world').addEventListener('click',()=>setMode('world'));
 $('#catalog-search-form').addEventListener('submit',e=>{e.preventDefault();offset=0;mode==='local'?local():world();});
 $('#catalog-query').addEventListener('input',()=>{if(mode==='local')local();});
 $('#catalog-status').addEventListener('change',local);
 $('#catalog-next').addEventListener('click',()=>{if(!end){offset+=24;world();}});
 $('#catalog-prev').addEventListener('click',()=>{offset=Math.max(0,offset-24);world();});
 $('#catalog-grid').addEventListener('click',async e=>{
  const b=e.target.closest('button');if(!b)return;
  if(b.dataset.taxon){const t=CATALOG.find(x=>x.id===b.dataset.taxon);if(t)show(t);}
  if(b.dataset.globalTaxon){
   const t=results.find(x=>x.key===Number(b.dataset.globalTaxon));if(!t)return;
   const known=CATALOG.find(c=>c.latin.toLowerCase()===t.latin?.toLowerCase());if(known){show(known);return;}
   const key=t.key;selectedKey=key;
   $('#catalog-detail').innerHTML='<div class="dialog-header"><div><span class="eyebrow">INDICE MONDIALE GBIF</span><h2 id="catalog-title">'+esc(t.latin)+'</h2></div><button type="button" class="close-button" data-close="catalog-dialog" aria-label="Chiudi">×</button></div>'+badge('unknown')+'<div id="global-photo" class="photo-missing">Cerco una fotografia con licenza e attribuzione…</div><p>'+esc(t.name??'Nome comune italiano non disponibile nella fonte.')+'</p><p>Taxon del regno Fungi'+(t.genus?', genere '+esc(t.genus):'')+(t.family?', famiglia '+esc(t.family):'')+'.</p><p class="catalog-caution">Non sono disponibili una scheda micologica revisionata né una valutazione della commestibilità in Mushapp. Il nome e l’eventuale fotografia non consentono di decidere se consumarlo.</p><a class="button secondary" href="https://www.gbif.org/species/'+key+'" target="_blank" rel="noopener noreferrer">Apri la scheda completa GBIF ↗</a>';
   if(!$('#catalog-dialog').open)$('#catalog-dialog').showModal();
   try{const photo=await gbifMedia(key,{signal:AbortSignal.timeout(12000)});if(selectedKey===key&&$('#global-photo')){$('#global-photo').outerHTML='<div id="global-photo">'+imageBlock(t,photo)+'</div>';wireImageErrors($('#global-photo'));}}catch{if(selectedKey===key&&$('#global-photo'))$('#global-photo').textContent='Foto non disponibile. Consulta la fonte GBIF.';}
  }
 });
 setMode('local');
}
