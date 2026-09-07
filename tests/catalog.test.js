import test from 'node:test';
import assert from 'node:assert/strict';
import {CATALOG,EDIBILITY} from '../src/catalog-data.js';
import {filterCatalog} from '../src/catalog.js';
import {normalizeTaxa,gbifSearchUrl,safeUrl,gbifMedia} from '../src/catalog-api.js';
test('all curated species have explicit sourced edibility and cautions',()=>{
 assert.equal(CATALOG.length,24);assert.equal(new Set(CATALOG.map(t=>t.id)).size,24);
 for(const t of CATALOG){assert.ok(EDIBILITY[t.status]);assert.ok(t.source.startsWith('https://natura.provincia.cuneo.it/'));assert.ok(t.caution.length>30);assert.ok(t.similar.length>10);}
 assert.equal(CATALOG.find(t=>t.id==='phalloides').status,'deadly');
 assert.equal(CATALOG.find(t=>t.id==='esculenta').status,'toxic');
 assert.equal(CATALOG.find(t=>t.id==='mellea').status,'conditional');
});
test('catalog searches common names, scientific names and synonyms',()=>{
 assert.ok(filterCatalog('finferlo').some(t=>t.latin==='Cantharellus cibarius'));
 assert.ok(filterCatalog('Boletus aestivalis').some(t=>t.id==='reticulatus'));
 assert.equal(filterCatalog('porcino','deadly').length,0);
 assert.ok(filterCatalog('','deadly').every(t=>t.status==='deadly'));
});
test('world search is restricted to accepted species in fungi',()=>{
 const url=new URL(gbifSearchUrl('Boletus',24));assert.equal(url.searchParams.get('highertaxonKey'),'5');assert.equal(url.searchParams.get('offset'),'24');
 const a={key:1,canonicalName:'Amanita phalloides',kingdom:'Fungi',rank:'SPECIES',taxonomicStatus:'ACCEPTED'};
 const result=normalizeTaxa({count:3,endOfRecords:true,results:[a,{...a,key:2,kingdom:'Animalia'},{...a,key:3,taxonomicStatus:'SYNONYM'}]});
 assert.equal(result.results.length,1);assert.equal(result.results[0].status,'unknown');assert.equal(result.results[0].name,null);
});
test('external media requires permitted HTTPS host, credit and license',async()=>{
 assert.equal(safeUrl('javascript:alert(1)',['gbif.org']),null);
 assert.equal(safeUrl('https://gbif.org.attacker.example/a',['gbif.org']),null);
 const fetcher=async()=>({ok:true,json:async()=>({results:[{identifier:'https://upload.wikimedia.org/example.jpg',license:'All rights reserved',creator:'Photographer'}]})});
 assert.equal(await gbifMedia(1,{fetcher}),null);
});
