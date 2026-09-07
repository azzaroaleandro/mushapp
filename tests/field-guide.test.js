import test from 'node:test';
import assert from 'node:assert/strict';
import {CATALOG} from '../src/catalog-data.js';
import {SHAPES,shapeMatches,validatePhoto} from '../src/field-guide.js';
test('shape groups cover every curated reference, including dangerous lookalikes',()=>{
 for(const t of CATALOG)assert.ok(SHAPES.some(s=>shapeMatches(t.id,[s.id])),t.id);
 const pores=CATALOG.filter(t=>shapeMatches(t.id,['pores']));
 assert.equal(pores.length,16);assert.ok(pores.some(t=>t.id==='satanas'));
 assert.ok(shapeMatches('phalloides',['gills']));
 assert.equal(CATALOG.filter(t=>shapeMatches(t.id,[])).length,CATALOG.length);
});
test('uncertain observations can include multiple shapes, without ranking edibility',()=>{
 assert.ok(shapeMatches('cibarius',['ridges','gills']));assert.ok(shapeMatches('phalloides',['ridges','gills']));
 assert.equal(shapeMatches('edulis',['gills']),false);
 assert.equal(shapeMatches('edulis',['not-a-shape']),false);
});
test('photo input rejects unsupported and oversized files',()=>{
 assert.equal(validatePhoto({type:'image/jpeg',size:1000}),'');
 assert.ok(validatePhoto({type:'image/svg+xml',size:100}));
 assert.ok(validatePhoto({type:'image/jpeg',size:16*1024*1024}));
 assert.ok(validatePhoto({type:'image/heic',size:100}));
});

test('additional shapes cover spines, coral, brackets and honeycomb without hiding lookalikes',()=>{
 for(const [id,shape] of [['repandum','spines'],['rufescens','spines'],['botrytis','coral'],['formosa','coral'],['versicolor','brackets'],['morchella','honeycomb']])assert.ok(shapeMatches(id,[shape]),id);
 assert.ok(shapeMatches('ostreatus',['gills']));
 assert.ok(shapeMatches('ostreatus',['brackets']));
 for(const t of CATALOG)for(const shape of t.shapes)assert.ok(SHAPES.some(s=>s.id===shape),t.id);
});
