import test from 'node:test';
import assert from 'node:assert/strict';
import {validateEntry,parseImport,mergeEntries,safeRead,safeWrite} from '../src/storage.js';
const entry={id:'one',date:'2026-09-06',area:'taro',species:'edulis',count:0,minutes:120,people:2,notes:'Bosco umido',confirmed:false};
test('zero-result outings retain effort and verification status',()=>{
 assert.deepEqual(validateEntry(entry),entry);
});
test('reject malformed dates, counts, unknown territory and excessive notes',()=>{
 for(const change of [{date:'2026-02-30'},{count:-1},{count:1.5},{count:'3'},{area:'outside'},{minutes:0},{people:0},{notes:'a'.repeat(1001)}])assert.throws(()=>validateEntry({...entry,...change}));
});
test('validated import merges without duplicating or overwriting an existing outing',()=>{
 const incoming=parseImport(JSON.stringify({version:1,entries:[{...entry,notes:'changed'},{...entry,id:'two'}]}));
 const merged=mergeEntries([entry],incoming);assert.equal(merged.length,2);assert.equal(merged.find(x=>x.id==='one').notes,'Bosco umido');
 assert.throws(()=>parseImport('{"version":99,"entries":[]}'));
});
test('storage failures are explicit and corrupt JSON recovers',()=>{
 const blocked={getItem(){throw Error('blocked');},setItem(){throw Error('full');}};
 assert.deepEqual(safeRead(blocked,'key',[]),[]);assert.equal(safeWrite(blocked,'key',{}),false);
});
