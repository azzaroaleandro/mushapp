import {AREAS,SPECIES} from './data.js';
import {isDate} from './engine.js';
export const KEY='mushapp.v1';
export function safeRead(storage,key,fallback){try{return JSON.parse(storage.getItem(key))??fallback;}catch{return fallback;}}
export function safeWrite(storage,key,value){try{storage.setItem(key,JSON.stringify(value));return true;}catch{return false;}}
export function validateEntry(value) {
 if(!value||typeof value!=='object'||!isDate(value.date)||!AREAS.some(a=>a.id===value.area)||!SPECIES.some(s=>s.id===value.species))throw new Error('Data, zona o specie non valide.');
 if(!Number.isInteger(value.count)||value.count<0||value.count>999)throw new Error('Inserisci un numero di ritrovamenti da 0 a 999.');
 if(!Number.isInteger(value.minutes)||value.minutes<1||value.minutes>1440)throw new Error('Durata: da 1 a 1.440 minuti.');
 if(!Number.isInteger(value.people)||value.people<1||value.people>50)throw new Error('Partecipanti: da 1 a 50.');
 if(typeof value.notes!=='string'||value.notes.length>1000)throw new Error('Note troppo lunghe (massimo 1.000 caratteri).');
 return {id:typeof value.id==='string'&&/^[a-zA-Z0-9_-]{1,80}$/.test(value.id)?value.id:crypto.randomUUID(),date:value.date,area:value.area,species:value.species,count:value.count,minutes:value.minutes,people:value.people,notes:value.notes,confirmed:value.confirmed===true};
}
export function parseImport(text) {
 if(text.length>2e6)throw new Error('File troppo grande (massimo 2 MB).');
 const body=JSON.parse(text);
 if(body.version!==1||!Array.isArray(body.entries)||body.entries.length>1000)throw new Error('Formato diario non valido o più di 1.000 uscite.');
 return body.entries.map(validateEntry);
}
export function mergeEntries(current,incoming) {
 const out=new Map(current.map(x=>[x.id,x]));
 for(const entry of incoming){if(!out.has(entry.id))out.set(entry.id,entry);}
 if(out.size>1000)throw new Error('Massimo 1.000 uscite per diario.');
 return [...out.values()].sort((a,b)=>b.date.localeCompare(a.date));
}
