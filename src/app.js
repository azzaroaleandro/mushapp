import {AREAS,SPECIES,REGIONS,MONTHS,SOURCES} from './data.js';
import {assess,addDays,dateInRome,finite,seasonalSpecies,legalContext,windowBefore} from './engine.js';
import {fetchWeather,cacheAge,usableCache} from './weather.js';
import {safeRead,safeWrite,validateEntry,parseImport,mergeEntries,KEY} from './storage.js';
const $=selector=>document.querySelector(selector);
const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const number=(value,digits=0)=>finite(value)?value.toLocaleString('it-IT',{maximumFractionDigits:digits}):'—';
const formatDate=(date,options={day:'numeric',month:'short'})=>new Intl.DateTimeFormat('it-IT',{...options,timeZone:'Europe/Rome'}).format(new Date(date+'T12:00:00Z'));
let storage;try{storage=window.localStorage;}catch{storage={getItem:()=>null,setItem:()=>{throw new Error('Storage non disponibile');}};}
const saved=safeRead(storage,KEY,{});
const validEntries=[];
for(const entry of Array.isArray(saved.entries)?saved.entries:[]){try{validEntries.push(validateEntry(entry));}catch{/* Ignore invalid stored entries; imports show explicit errors. */}}
const state={today:dateInRome(),date:dateInRome(),region:'all',species:'edulis',favorites:new Set(Array.isArray(saved.favorites)?saved.favorites.filter(id=>AREAS.some(a=>a.id===id)):[]),entries:validEntries.slice(0,1000),weather:null,loading:false,error:'',month:Number(dateInRome().slice(5,7)),view:'explore',selectedArea:null};
let map,markerLayer,toastTimer;
function notify(message){$('#toast').textContent=message;$('#toast').hidden=false;clearTimeout(toastTimer);toastTimer=setTimeout(()=>{$('#toast').hidden=true;},5000);}
function persist(){const ok=safeWrite(storage,KEY,{entries:state.entries,favorites:[...state.favorites]});if(!ok)notify('Salvataggio nel browser non riuscito. Esporta il diario prima di chiudere.');return ok;}
function getSpecies(){return SPECIES.find(s=>s.id===state.species);}
function daysFor(area){const days=state.weather?.data?.[area.id]?.days;return Array.isArray(days)?days:[];}
function stale(){return state.weather&&cacheAge(state.weather)>6*60*60e3;}
function resultFor(area,date=state.date){return assess(area,getSpecies(),daysFor(area),date,state.today,!!stale());}
function visibleAreas(){return AREAS.filter(a=>(state.region==='all'||a.region===state.region)&&(!$('#favorites-only').checked||state.favorites.has(a.id))).map(area=>({area,result:resultFor(area)})).sort((a,b)=>b.result.rank-a.result.rank||a.area.name.localeCompare(b.area.name,'it'));}
function options(items,selected){return items.map(x=>'<option value="'+esc(x.id)+'"'+(x.id===selected?' selected':'')+'>'+esc(x.name)+'</option>').join('');}
function metric(value,label){return '<div><div class="metric-value">'+value+'</div><div class="metric-label">'+label+'</div></div>';}
function renderDates(){
 $('#date').innerHTML=Array.from({length:8},(_,i)=>{const date=addDays(state.today,i);return '<option value="'+date+'"'+(date===state.date?' selected':'')+'>'+(i===0?'Oggi':i===1?'Domani':formatDate(date,{weekday:'short',day:'numeric',month:'short'}))+'</option>';}).join('');
 $('#today-label').textContent=formatDate(state.today,{weekday:'long',day:'numeric',month:'long'});
}
function renderStatus(){
 const el=$('#data-status');el.classList.toggle('error',!!state.error);
 if(state.loading){el.textContent='Leggo le ultime settimane e le previsioni per le sei zone…';return;}
 if(!state.weather){el.textContent=state.error||'Meteo non ancora disponibile.';return;}
 const age=cacheAge(state.weather),time=new Intl.DateTimeFormat('it-IT',{hour:'2-digit',minute:'2-digit',timeZone:'Europe/Rome'}).format(new Date(state.weather.fetchedAt));
 el.innerHTML='<span class="status-dot"></span>'+esc(state.error?state.error+' Ultimi dati salvati: ':'')+'Open-Meteo · acquisiti '+esc(formatDate(state.weather.fetchedAt.slice(0,10)))+' alle '+time+' · dati da modelli, anche per i giorni passati.'+(age>30*60e3?' Copia precedente, '+Math.round(age/60e3)+' min fa.':'')+(stale()?' Stime sospese: dati più vecchi di 6 ore.':'')+(Object.keys(state.weather.errors??{}).length?' Alcune zone hanno dati incompleti.':'');
}
function renderZones(){
 const rows=visibleAreas();
 $('#zone-heading').textContent=rows.length+' zone pilota';
 $('#zone-list').innerHTML=rows.length?rows.map(({area,result},i)=>{
  const x=result.features;
  return '<article class="zone-card '+(i===0&&result.rank>=4?'featured':'')+'" data-area-card="'+area.id+'"><div class="zone-card-top"><div><div class="zone-region">'+REGIONS[area.region]+' · '+area.altitude+'</div><h3>'+area.name+'</h3></div><button class="save-button" type="button" data-save="'+area.id+'" aria-label="'+(state.favorites.has(area.id)?'Rimuovi':'Salva')+' '+area.name+'" aria-pressed="'+state.favorites.has(area.id)+'">'+(state.favorites.has(area.id)?'★':'☆')+'</button></div><p class="zone-habitat">'+area.habitat+'</p><span class="condition '+result.level+'">'+result.label+'</span><div class="zone-metrics">'+metric(number(x.r14)+' <small>mm</small>','Pioggia · 14 gg prima')+metric(number(x.t7,1)+'°','Aria media · 7 gg prima')+metric(finite(x.soilTrend)?(x.soilTrend>.005?'↗':x.soilTrend<-.005?'↘':'→'):'—','Suolo · andamento')+'</div><div class="card-bottom"><span>Stima sperimentale</span><button class="text-button" data-detail="'+area.id+'">Esplora la zona <span aria-hidden="true">↗</span></button></div></article>';
 }).join(''):'<div class="empty"><strong>Il tuo prossimo posto è da scegliere.</strong>Salva una zona con la stella oppure cambia il territorio.</div>';
 renderStatus();renderMap(rows);renderTeaser();
}
function initMap(){
 if(map||!window.L)return;
 $('#map').replaceChildren();
 map=window.L.map('map',{scrollWheelZoom:false}).setView([45.12,10.7],7);
 window.L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:16,attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'}).addTo(map);
 markerLayer=window.L.layerGroup().addTo(map);renderMap(visibleAreas());
}
function renderMap(rows){
 if(!map)return;
 markerLayer.clearLayers();
 rows.forEach(({area,result},i)=>{
  const marker=window.L.marker([area.lat,area.lon],{icon:window.L.divIcon({className:'map-pin '+result.level,html:String(i+1),iconSize:[30,30]}),title:area.name,alt:area.name}).addTo(markerLayer);
  const popup=document.createElement('div');
  popup.innerHTML='<strong>'+area.name+'</strong><br>'+REGIONS[area.region]+' · area indicativa<br><span>'+result.label+'</span><br><button class="button secondary" type="button">Dettagli della zona</button>';
  popup.querySelector('button').addEventListener('click',()=>showArea(area.id));marker.bindPopup(popup);
 });
 if(rows.length)map.fitBounds(rows.map(r=>[r.area.lat,r.area.lon]),{padding:[35,35],maxZoom:9,animate:false});
}
function renderTeaser(){
 const month=Number(state.date.slice(5,7)),active=seasonalSpecies(SPECIES,month).slice(0,3);
 $('#season-teaser').innerHTML='<div><span class="eyebrow">NEL BOSCO A '+new Intl.DateTimeFormat('it-IT',{month:'long'}).format(new Date(state.date+'T12:00:00')).toUpperCase()+'</span><p>'+esc(active.length?active.map(s=>s.name).join(' · '):'Una stagione per osservare: nessuna specie del catalogo nella finestra tipica.')+'</p></div><a href="#calendar">Scopri le stagioni ↗</a>';
}
function showArea(id){
 const area=AREAS.find(a=>a.id===id);if(!area)return;
 state.selectedArea=id;const result=resultFor(area),x=result.features,rule=legalContext(area,state.date),model=state.weather?.data?.[id],selected=daysFor(area).find(d=>d.date===state.date);
 const history=windowBefore(daysFor(area),state.date,14),maxRain=Math.max(5,...history.map(d=>finite(d.rain)?d.rain:0));
 const trend=finite(x.soilTrend)?(x.soilTrend>=0?'+':'')+number(x.soilTrend,3)+' m³/m³':'—';
 $('#zone-detail').innerHTML='<div class="dialog-header"><div><span class="eyebrow">'+REGIONS[area.region]+' · AREA PILOTA</span><h2 id="zone-title">'+area.name+'</h2><span class="condition '+result.level+'">'+result.label+'</span></div><button type="button" class="close-button" data-close="zone-dialog" aria-label="Chiudi">×</button></div><p class="detail-subtitle">'+area.habitat+' · fascia esplorativa '+area.altitude+'<br>'+getSpecies().name+' · '+formatDate(state.date,{weekday:'long',day:'numeric',month:'long'})+'</p><div class="detail-metrics">'+metric(number(x.r7)+' mm','Pioggia · 7 gg prima')+metric(number(x.r14)+' mm','Pioggia · 14 gg prima')+metric(number(x.r28)+' mm','Pioggia · 28 gg prima')+metric(number(x.balance)+' mm','Pioggia − ET₀ · 14 gg')+metric(number(x.soilTemp,1)+' °C','Suolo a 18 cm · 7 gg')+metric(trend,'Umidità suolo · variazione')+'</div><p class="small muted">Finestre antecedenti al giorno scelto, che è escluso. Per le date future contengono anche previsioni. Il suolo a 9–27 cm è modellato, non misurato nel bosco.</p><h3>Perché questi segnali</h3><ul class="reason-list">'+result.reasons.map(r=>'<li>'+esc(r)+'</li>').join('')+'</ul><p class="small muted">Affidabilità '+result.confidence.toLowerCase()+': modello sperimentale non calibrato su ritrovamenti locali. Nessuna probabilità di raccolta.</p><div class="detail-section"><h3>I prossimi otto giorni</h3><div class="timeline">'+Array.from({length:8},(_,i)=>{const d=addDays(state.today,i),r=resultFor(area,d);return '<button class="day-tile '+(d===state.date?'selected':'')+'" data-day="'+d+'" aria-label="'+esc(formatDate(d)+': '+r.label)+'" aria-pressed="'+(d===state.date)+'">'+formatDate(d,{weekday:'short'})+'<span class="signal '+r.level+'"></span>'+formatDate(d,{day:'numeric',month:'short'})+'</button>';}).join('')+'</div><p class="small muted">Colori: verde = favorevoli · ocra = contrastanti · grigio = deboli o non valutabili. Apri il giorno per leggere la motivazione.</p></div><div class="detail-section"><h3>La pioggia prima dell’uscita</h3><div class="rain-chart" role="img" aria-label="Grafico della pioggia nei 14 giorni precedenti; valori disponibili nella tabella sotto">'+history.map(d=>'<div class="rain-bar '+(d.date>=state.today?'forecast':'')+'" style="height:'+(finite(d.rain)?Math.max(2,d.rain/maxRain*85):2)+'px" title="'+d.date+': '+number(d.rain,1)+' mm"></div>').join('')+'</div><div class="chart-labels"><span>'+formatDate(history[0].date)+'</span><span>'+formatDate(history.at(-1).date)+'</span></div><details><summary class="small">Leggi i valori giornalieri</summary><div class="calendar-scroll"><table><thead><tr><th>Data</th><th>Pioggia</th><th>Tipo di dato</th></tr></thead><tbody>'+history.map(d=>'<tr><td>'+formatDate(d.date)+'</td><td>'+number(d.rain,1)+' mm</td><td>'+(d.date>=state.today?'Previsione':'Modello archiviato')+'</td></tr>').join('')+'</tbody></table></div></details></div><div class="detail-section"><h3>Prepara l’uscita</h3><p>'+area.terrain+'</p><p>Meteo del giorno: '+number(selected?.min,1)+'–'+number(selected?.max,1)+' °C · vento massimo '+number(selected?.wind)+' km/h.'+(finite(selected?.wind)&&selected.wind>=40?' Vento sostenuto: valuta con attenzione le condizioni del percorso.':'')+'</p><p class="small muted">Non sono integrati bollettini di allerta, stato dei sentieri, proprietà o accessi. Il punto meteo rappresenta l’area, non la fascia intera; quota del modello: '+number(model?.elevation)+' m.</p></div><div class="detail-section rule-warning"><h3>Permessi e raccolta · '+rule.status+'</h3><p>'+rule.summary+'</p><p><strong>'+rule.day+'</strong></p><p>Non è un’autorizzazione alla raccolta. Controlla regole in vigore, residenza, territorio e zone protette prima di partire.</p><a class="button secondary" href="'+area.permit+'" target="_blank" rel="noopener noreferrer">Regole e permessi ufficiali ↗</a></div><div class="detail-section"><button class="button" data-log="'+area.id+'">Annota un’uscita qui</button></div>';
 const dialog=$('#zone-dialog');if(!dialog.open)dialog.showModal();
}
function renderCalendar(){
 const active=seasonalSpecies(SPECIES,state.month);
 $('#season-cards').innerHTML=active.length?active.map(s=>'<article class="species-card"><span class="tag">'+(s.peak.includes(state.month)?'Periodo rappresentativo':'Possibile finestra stagionale')+'</span><h3>'+s.name+'</h3><span class="latin">'+s.latin+'</span><p>'+s.note+'</p><p class="small muted">Alberi ospiti indicativi: '+s.hosts.join(', ')+'.</p><button class="text-button" data-species="'+s.id+'">'+(s.model?'Esplora le condizioni meteo':'Esplora gli habitat pilota')+' ↗</button></article>').join(''):'<div class="empty"><strong>Il bosco si prende il suo tempo.</strong>Questo mese non ha una specie tipica nel nostro catalogo. Nessun suggerimento forzato.</div>';
 $('#calendar-table').innerHTML='<caption class="small muted">Stagionalità indicativa; non differenziata per singola quota</caption><thead><tr><th>Specie</th>'+MONTHS.map((m,i)=>'<th class="'+(i+1===state.month?'current-month':'')+'">'+m+'</th>').join('')+'</tr></thead><tbody>'+SPECIES.map(s=>'<tr><th scope="row">'+s.name+'</th>'+MONTHS.map((m,i)=>'<td class="'+(i+1===state.month?'current-month':'')+'">'+(s.months.includes(i+1)?'<span class="'+(s.peak.includes(i+1)?'peak-dot':'season-dot')+'" aria-label="'+(s.peak.includes(i+1)?'Periodo rappresentativo':'Finestra tipica')+'">●</span>':'<span aria-label="Fuori finestra">·</span>')+'</td>').join('')+'</tr>').join('')+'</tbody>';
}
function renderJournal(){
 const entries=[...state.entries].sort((a,b)=>b.date.localeCompare(a.date));
 $('#journal-list').innerHTML=entries.length?entries.map(e=>'<article class="journal-entry"><div><span class="eyebrow">'+formatDate(e.date,{day:'numeric',month:'long',year:'numeric'})+'</span><h3>'+AREAS.find(a=>a.id===e.area).name+'</h3><span class="latin">'+SPECIES.find(s=>s.id===e.species).name+'</span><p>'+e.count+' ritrovamenti annotati · '+e.minutes+' min · '+e.people+' '+(e.people===1?'persona':'persone')+'<br>'+(e.confirmed?'Identificazione verificata da un esperto (dichiarazione personale).':'Identificazione non verificata.')+'</p>'+(e.notes?'<p>'+esc(e.notes)+'</p>':'')+'</div><div class="entry-actions"><button class="text-button" data-edit="'+esc(e.id)+'">Modifica</button><button class="text-button danger" data-delete="'+esc(e.id)+'">Elimina</button></div></article>').join(''):'<div class="empty"><strong>La prima pagina profuma di bosco.</strong>Registra la tua prima uscita, anche se non hai trovato nulla.</div>';
 $('#export-journal').disabled=!entries.length;
}
function openEntry(areaId,entry){
 const form=$('#entry-form');form.reset();
 form.elements.id.value=entry?.id??'';
 form.elements.date.value=entry?.date??state.today;form.elements.date.max=state.today;
 form.elements.area.innerHTML=options(AREAS,entry?.area??areaId??AREAS[0].id);
 form.elements.species.innerHTML=options(SPECIES,entry?.species??state.species);
 for(const key of ['count','minutes','people','notes'])if(entry)form.elements[key].value=entry[key];
 form.elements.confirmed.checked=entry?.confirmed??false;
 $('#entry-title').textContent=entry?'Modifica uscita':'Una nuova uscita';$('#entry-error').textContent='';
 if($('#zone-dialog').open)$('#zone-dialog').close();$('#entry-dialog').showModal();
}
function renderMethod(){
 $('#method-content').innerHTML='<div class="method-grid"><article class="panel"><span class="eyebrow">01 · LE CONDIZIONI</span><h2>Leggiamo più di un temporale.</h2><p>Confrontiamo pioggia distribuita e cumulata su 7, 14 e 28 giorni, temperatura media, pioggia meno ET₀, umidità modellata del suolo e periodi asciutti. Freddo e neve possono rendere sfavorevole la finestra.</p><p>L’ET₀ descrive una superficie erbosa di riferimento: non è l’evaporazione reale del bosco. Umidità e temperatura del suolo arrivano da modelli meteorologici.</p></article><article class="panel"><span class="eyebrow">02 · L’HABITAT</span><h2>Prima viene il bosco.</h2><p>I porcini vivono in associazione con gli alberi. Distinguiamo B. edulis, B. reticulatus, B. aereus e B. pinophilus, con ospiti e finestre stagionali diverse.</p><p>Le sei aree hanno habitat e quote indicativi, da verificare sul campo. Non abbiamo ancora integrato carte forestali, suolo, esposizione e pendenza per singolo versante.</p></article><article class="panel"><span class="eyebrow">03 · IL CONFRONTO</span><h2>Segnali, senza percentuali inventate.</h2><p>“Favorevoli”, “contrastanti” e “deboli” sono classi di una regola sperimentale, non probabilità. Non esiste una soglia universale di pioggia, temperatura o attesa dopo un temporale.</p><p>Soglie, pesi e mesi sono ipotesi di prodotto documentate nel repository. L’affidabilità resta limitata anche quando il meteo sembra favorevole. Per le altre specie è disponibile soltanto il calendario.</p></article><article class="panel"><span class="eyebrow">04 · I DATI CHE MANCANO</span><h2>Lasciamo spazio all’incertezza.</h2><p>Non misuriamo nascite, raccolti, pressione di altri cercatori, umidità sotto la lettiera o presenza del micelio. I dati mancanti non diventano zeri. Dopo sei ore senza aggiornamento, sospendiamo il confronto.</p><p>Le uscite con durata, partecipanti, zero ritrovamenti e identificazione verificata serviranno a valutare un futuro modello. Il diario attuale rimane nel tuo browser e non addestra automaticamente alcun sistema.</p></article></div><article class="panel"><h2>Prima di raccogliere</h2><p class="small">Controlla permesso, giornate, orari, quantità e divieti del Comune o dell’ente parco. Le schede mostrano un quadro generale consultato il 7 settembre 2026, che può cambiare. Un punto sulla mappa non conferma che la raccolta sia consentita.</p><p class="small">Questa app non identifica funghi né stabilisce se siano commestibili. Per gli esemplari raccolti, rivolgiti al servizio micologico dell’azienda sanitaria; soprattutto alle prime uscite, cerca insieme a una persona esperta.</p><div class="source-list"><a href="'+SOURCES.tn+'" target="_blank" rel="noopener noreferrer">Provincia di Trento: limite di raccolta ↗</a><a href="'+SOURCES.er+'" target="_blank" rel="noopener noreferrer">Emilia-Romagna: regole ↗</a><a href="'+SOURCES.casentinesi+'" target="_blank" rel="noopener noreferrer">Foreste Casentinesi ↗</a><a href="'+SOURCES.health+'" target="_blank" rel="noopener noreferrer">Controllo micologico ↗</a></div></article><article class="panel"><h2>Fonti aperte, metodo leggibile.</h2><p class="small">Meteo: Open-Meteo, attribuzione CC BY 4.0; dati di modelli numerici, non osservazioni di stazione. Mappa: © OpenStreetMap contributors. Le richieste a meteo, mappe e caratteri tipografici comunicano ai rispettivi fornitori i normali dati di connessione. Non richiediamo posizione GPS o account.</p><div class="source-list"><a href="'+SOURCES.weather+'" target="_blank" rel="noopener noreferrer">API e variabili meteo ↗</a><a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noopener noreferrer">Licenza dati meteo ↗</a><a href="'+SOURCES.science+'" target="_blank" rel="noopener noreferrer">Ricerca sui boschi italiani ↗</a><a href="'+SOURCES.water+'" target="_blank" rel="noopener noreferrer">Acqua e fruttificazione ↗</a><a href="'+SOURCES.porcini+'" target="_blank" rel="noopener noreferrer">Le quattro specie di porcino ↗</a><a href="https://github.com/azzaroaleandro/mushapp/blob/codex/mushapp-v1/docs/METODO.md" target="_blank" rel="noopener noreferrer">Metodo completo e limiti ↗</a></div></article>';
}
function route(){
 const raw=location.hash.slice(1),view=['explore','calendar','journal','method'].includes(raw)?raw:'explore';
 state.view=view;document.querySelectorAll('.view').forEach(el=>{el.hidden=el.id!=='view-'+view;});
 document.querySelectorAll('[data-nav]').forEach(el=>{const active=el.dataset.nav===view;el.classList.toggle('active',active);if(active)el.setAttribute('aria-current','page');else el.removeAttribute('aria-current');});
 $('#page-label').textContent={explore:'Esplora i boschi',calendar:'Le stagioni',journal:'Il mio diario',method:'Come funziona'}[view];
 if(view==='calendar')renderCalendar();if(view==='journal')renderJournal();if(view==='explore'&&map)setTimeout(()=>map.invalidateSize(),0);
 if(raw!=='zone-list')window.scrollTo({top:0,behavior:'instant'});
}
async function loadWeather(force=false){
 if(state.loading)return;
 if(!force){const cached=safeRead(storage,'mushapp.weather.v1',null);if(usableCache(cached)){state.weather=cached;renderZones();return;}}
 state.loading=true;state.error='';$('#refresh').disabled=true;renderStatus();
 try{state.weather=await fetchWeather();safeWrite(storage,'mushapp.weather.v1',state.weather);}
 catch(e){state.error=e.message;if(!state.weather){const cached=safeRead(storage,'mushapp.weather.v1',null);if(cached?.version===1&&cached.data&&finite(cacheAge(cached)))state.weather=cached;}}
 finally{state.loading=false;$('#refresh').disabled=false;renderZones();if($('#zone-dialog').open)showArea(state.selectedArea);}
}
$('#species').innerHTML=options(SPECIES,state.species);
$('#calendar-month').innerHTML=MONTHS.map((m,i)=>'<option value="'+(i+1)+'"'+(i+1===state.month?' selected':'')+'>'+m+'</option>').join('');
renderDates();renderMethod();renderZones();renderJournal();route();initMap();loadWeather();
window.addEventListener('load',()=>{initMap();if(!map)$('#map').innerHTML='<div class="map-loading">Mappa non disponibile. Puoi comunque esplorare tutte le zone dall’elenco.</div>';});
window.addEventListener('hashchange',route);
$('#region').addEventListener('change',e=>{state.region=e.target.value;renderZones();});
$('#species').addEventListener('change',e=>{state.species=e.target.value;renderZones();});
$('#date').addEventListener('change',e=>{state.date=e.target.value;renderZones();});
$('#favorites-only').addEventListener('change',renderZones);
$('#refresh').addEventListener('click',()=>loadWeather(true));
$('#calendar-month').addEventListener('change',e=>{state.month=Number(e.target.value);renderCalendar();});
$('#new-entry').addEventListener('click',()=>openEntry());
document.addEventListener('click',e=>{
 const b=e.target.closest('button');if(!b)return;
 if(b.dataset.close)$('#'+b.dataset.close).close();
 if(b.dataset.save){const id=b.dataset.save;state.favorites.has(id)?state.favorites.delete(id):state.favorites.add(id);persist();renderZones();const next=document.querySelector('[data-save="'+id+'"]');next?.focus();}
 if(b.dataset.detail)showArea(b.dataset.detail);
 if(b.dataset.day){state.date=b.dataset.day;$('#date').value=state.date;renderZones();showArea(state.selectedArea);}
 if(b.dataset.log)openEntry(b.dataset.log);
 if(b.dataset.species){state.species=b.dataset.species;$('#species').value=state.species;location.hash='explore';renderZones();notify('Confronto per i prossimi otto giorni. Il calendario mensile resta indicativo.');}
 if(b.dataset.edit)openEntry(null,state.entries.find(x=>x.id===b.dataset.edit));
 if(b.dataset.delete&&window.confirm('Eliminare questa uscita dal diario di questo browser?')){state.entries=state.entries.filter(x=>x.id!==b.dataset.delete);persist();renderJournal();}
});
$('#entry-form').addEventListener('submit',e=>{
 e.preventDefault();const form=e.currentTarget,data=new FormData(form);
 try{
  if(data.get('date')>state.today)throw new Error('Registra soltanto uscite già effettuate.');
  const entry=validateEntry({id:data.get('id'),date:data.get('date'),area:data.get('area'),species:data.get('species'),count:Number(data.get('count')),minutes:Number(data.get('minutes')),people:Number(data.get('people')),notes:data.get('notes'),confirmed:data.get('confirmed')==='on'});
  if(!state.entries.some(x=>x.id===entry.id)&&state.entries.length>=1000)throw new Error('Diario pieno: esporta le uscite e libera spazio.');
  state.entries=state.entries.filter(x=>x.id!==entry.id).concat(entry);
  const ok=persist();renderJournal();$('#entry-dialog').close();location.hash='journal';if(ok)notify('Uscita salvata nel tuo diario.');
 }catch(error){$('#entry-error').textContent=error.message;}
});
$('#export-journal').addEventListener('click',()=>{
 const blob=new Blob([JSON.stringify({version:1,exportedAt:new Date().toISOString(),entries:state.entries},null,2)],{type:'application/json'});
 const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='mushapp-diario-'+state.today+'.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
});
$('#import-journal').addEventListener('change',async e=>{
 const file=e.target.files?.[0];if(!file)return;
 try{if(file.size>2e6)throw new Error('File troppo grande (massimo 2 MB).');const entries=parseImport(await file.text());if(entries.some(x=>x.date>state.today))throw new Error('Il file contiene uscite future.');const old=state.entries.length;state.entries=mergeEntries(state.entries,entries);const ok=persist();renderJournal();if(ok)notify((state.entries.length-old)+' uscite aggiunte; duplicati ignorati.');}catch(error){notify('Importazione non riuscita: '+error.message);}finally{e.target.value='';}
});
document.addEventListener('visibilitychange',()=>{
 if(document.hidden)return;
 const today=dateInRome();if(today!==state.today){state.today=today;state.date=today;renderDates();renderZones();loadWeather(true);}
 else if(state.weather&&cacheAge(state.weather)>30*60e3)loadWeather(true);
});
setInterval(()=>{if(!document.hidden&&state.weather){renderStatus();if(stale())renderZones();}},60000);
if('serviceWorker' in navigator)navigator.serviceWorker.register('./sw.js').catch(()=>{/* App remains usable without offline shell. */});
