import test from 'node:test';
import assert from 'node:assert/strict';
import {recommend} from '../src/recommendations.js';
import {AREAS,SPECIES} from '../src/data.js';
import {distanceKm,provinceFor,inTerritory,PROVINCES} from '../src/places.js';
import {fixtureDays,TODAY} from './fixtures.js';
const bundle={data:Object.fromEntries(AREAS.map(a=>[a.id,{days:fixtureDays()}]))};
test('Campiglio focus includes nearby sites and excludes remote regions',()=>{
 const rows=recommend({areas:AREAS,species:SPECIES[0],bundle,today:TODAY});
 assert.ok(rows.some(r=>r.area.id==='campiglio'));assert.ok(rows.every(r=>r.distance<=40));assert.equal(new Set(rows.map(r=>r.area.id)).size,rows.length);
 assert.equal(distanceKm({lat:46.23,lon:10.827}),0);assert.equal(PROVINCES.length,10);
});
test('no suggestions are invented without data or for unsupported species',()=>{
 assert.deepEqual(recommend({areas:AREAS,species:SPECIES[0],bundle:null,today:TODAY}),[]);
 assert.deepEqual(recommend({areas:AREAS,species:SPECIES[0],bundle,today:TODAY,stale:true}),[]);
 assert.deepEqual(recommend({areas:AREAS,species:SPECIES.find(s=>!s.model),bundle,today:TODAY}),[]);
});
test('provincial filtering and general collection weekdays constrain suggestions',()=>{
 const rows=recommend({areas:AREAS,species:SPECIES[0],bundle,today:TODAY,nearby:false,region:'ER',province:'PR'});
 assert.ok(rows.length>0);assert.ok(rows.every(r=>provinceFor(r.area)==='PR'));assert.ok(rows.every(r=>r.date!=='2026-09-07'));assert.ok(rows.every(r=>r.legal.status==='Da verificare'));
 assert.equal(inTerritory(AREAS[0],'ER','PR',false),false);
 assert.deepEqual(recommend({areas:AREAS,species:SPECIES[0],bundle,today:TODAY,nearby:false,province:'FE'}),[]);
});
