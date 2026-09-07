import {CATALOG} from './catalog-data.js?v=0.4.0';
export const SHAPES=[
 {id:'pores',name:'A spugna',detail:'Pori sotto il cappello',path:'M7 12c1-7 17-7 18 0M7 12h18M9 15h.1m4 0h.1m4 0h.1m4 0h.1m-10 4h.1m4 0h.1m4 0h.1M14 22v5h4v-5'},
 {id:'gills',name:'A lamelle',detail:'Lamine sottili sotto',path:'M5 14c1-10 21-10 22 0M5 14h22M8 15l6 5m-2-6 3 6m5-6-3 6m7-5-6 5M14 21v6h4v-6'},
 {id:'ridges',name:'A pieghe',detail:'Rilievi spessi e irregolari',path:'M5 9q5 5 11 2t11-2M7 13l6 7m-3-7 3 2 3 5m7-7-5 7m3-6 3 3M14 20v7h4v-7'},
 {id:'funnel',name:'A trombetta',detail:'Imbuto cavo',path:'M5 7q11 9 22 0M5 7l9 17v3h4v-3l9-17M10 9q6 3 12 0'},
 {id:'round',name:'A palla',detail:'Corpo tondeggiante',path:'M6 19C3 4 28 3 26 19q-2 9-10 8Q8 28 6 19M10 11h.1m8-2h.1m4 7h.1m-9 5h.1m5 2h.1'},
 {id:'folded',name:'A lobi',detail:'Superficie molto ripiegata',path:'M8 20C0 16 7 4 12 7c2-7 10-3 10 1 7-1 9 11 2 13M12 10q-6 4 0 7m4-9q7 5 1 9m7-4q-5 3-2 6M13 21v7h7v-7'},
 {"id":"spines","name":"Ad aculei","detail":"Piccole spine sotto","path":"M5 12c2-9 20-9 22 0H5m3 1 1 7 2-7m2 0 1 8 2-8m2 0 1 7 2-7m2 0 1 6 2-6M14 22v5h4v-5"},
 {"id":"coral","name":"A corallo","detail":"Rametti o cespo","path":"M16 28V14m0 8-8-7V8m0 5-4-4m4 0 3-5m5 12 8-6V5m0 6 4-4m-12 9-3-6V4m3 16 8-1 3-6"},
 {"id":"brackets","name":"A mensola","detail":"Ventagli sul legno","path":"M9 3v26m0-21c13-9 24 8 3 8H9m0 2c14-6 20 8 2 8H9M4 3v26"},
 {"id":"honeycomb","name":"Ad alveoli","detail":"Cavità a nido d’ape","path":"M12 22C-1 16 10 3 16 3s17 15 4 19m-8 0v6h8v-6M16 5l-4 4 4 4 4-4-4-4m-5 8-3 4 5 4 3-4-5-4m10 0-5 4 3 4 5-4-3-4"}
];
const SHAPES_BY_ID=new Map(CATALOG.map(t=>[t.id,t.shapes]));
export function shapeMatches(id,selected=[]){return selected.length===0||selected.some(shape=>SHAPES_BY_ID.get(id)?.includes(shape));}
export function validatePhoto(file){
 if(!file)return 'Scegli una fotografia.';
 if(!['image/jpeg','image/png','image/webp'].includes(file.type))return 'Usa una foto JPEG, PNG o WebP. Per HEIC, esporta prima una copia JPEG.';
 if(file.size>15*1024*1024)return 'La foto supera 15 MB. Scegli una copia più piccola.';
 return '';
}
export function initFieldGuide({onChange,onToggle}){
 const $=s=>document.querySelector(s);
 let photo=null,version=0;
 const selected=new Set();
 $('#shape-options').innerHTML=SHAPES.map(s=>'<button type="button" data-shape="'+s.id+'" aria-pressed="false"><svg viewBox="0 0 32 32" aria-hidden="true"><path d="'+s.path+'"/></svg><span>'+s.name+'<small>'+s.detail+'</small></span></button>').join('');
 function update(){document.querySelectorAll('[data-shape]').forEach(b=>b.setAttribute('aria-pressed',String(selected.has(b.dataset.shape))));onChange();}
 $('#shape-options').addEventListener('click',e=>{const b=e.target.closest('[data-shape]');if(!b)return;selected.has(b.dataset.shape)?selected.delete(b.dataset.shape):selected.add(b.dataset.shape);update();});
 $('#shape-reset').addEventListener('click',()=>{selected.clear();update();});
 $('#catalog-observe').addEventListener('click',()=>onToggle(true));
 $('#field-back').addEventListener('click',()=>onToggle(false));
 function clear(){version++;if(photo)URL.revokeObjectURL(photo);photo=null;$('#field-photo-preview').removeAttribute('src');$('#field-photo-frame').hidden=true;$('#field-photo-error').textContent='';$('#field-photo-state').textContent='Foto facoltativa: puoi iniziare anche dai disegni.';}
 $('#field-photo-remove').addEventListener('click',clear);
 async function load(file){
  const error=validatePhoto(file);if(error){$('#field-photo-error').textContent=error;return;}
  const current=++version,url=URL.createObjectURL(file),img=new Image();
  $('#field-photo-state').textContent='Apro la foto sul telefono…';
  try{img.src=url;await img.decode();if(current!==version){URL.revokeObjectURL(url);return;}
   if(photo)URL.revokeObjectURL(photo);photo=url;$('#field-photo-preview').src=url;$('#field-photo-frame').hidden=false;
   $('#field-photo-error').textContent='';$('#field-photo-state').textContent='Foto pronta per il confronto. Nessuna analisi automatica.';
  }catch{URL.revokeObjectURL(url);if(current===version){$('#field-photo-error').textContent='Non riesco ad aprire questa immagine. Prova una foto JPEG.';$('#field-photo-state').textContent=photo?'La foto precedente resta disponibile.':'Foto non caricata.';}}
 }
 for(const id of ['field-camera','field-gallery'])$('#'+id).addEventListener('change',e=>{const file=e.target.files?.[0];if(file)load(file);e.target.value='';});
 return {selected:()=>[...selected],photo:()=>photo,reset:()=>{selected.clear();update();}};
}
