import test from 'node:test';
import assert from 'node:assert/strict';
import {AREAS,SPECIES} from '../src/data.js';
import {assess,features,addDays,dateInRome,isDate,seasonalSpecies,legalContext} from '../src/engine.js';
import {fixtureDays,TODAY} from './fixtures.js';
const area=AREAS[0],species=SPECIES[0];
test('complete wet mild history produces favorable experimental signals',()=>{
 const r=assess(area,species,fixtureDays(),TODAY,TODAY);
 assert.equal(r.level,'promising');assert.equal(r.confidence,'Limitata');assert.equal(r.features.r14,56);assert.equal(r.features.balance,28);
});
test('missing daily rainfall never becomes zero or a positive recommendation',()=>{
 const days=fixtureDays();days[25].rain=null;
 const r=assess(area,species,days,TODAY,TODAY);assert.equal(r.level,'unknown');assert.equal(r.features.r14,null);
});
test('missing dates fail the complete-history gate',()=>{
 const days=fixtureDays().filter(d=>d.date!==addDays(TODAY,-20));
 assert.equal(assess(area,species,days,TODAY,TODAY).level,'unknown');
});
test('empty weather and expired weather have no rank',()=>{
 assert.equal(assess(area,species,[],TODAY,TODAY).rank,-1);
 assert.equal(assess(area,species,fixtureDays(),TODAY,TODAY,true).rank,-1);
});
test('target day and later rain are excluded from antecedent windows',()=>{
 const days=fixtureDays(),before=features(days,TODAY);
 for(const day of days.filter(d=>d.date>=TODAY))day.rain=900;
 assert.equal(features(days,TODAY).r14,before.r14);
 assert.equal(features(days,addDays(TODAY,1)).r14,952);
});
test('frost and snow suppress favorable recommendations',()=>{
 for(const field of ['min','snow']){const days=fixtureDays();days.find(d=>d.date===TODAY)[field]=field==='min'?-2:.2;
 assert.equal(assess(area,species,days,TODAY,TODAY).level,'low');}
});
test('unknown soil or target weather caps otherwise positive score',()=>{
 const days=fixtureDays();days.forEach(d=>d.soil=null);
 assert.equal(assess(area,species,days,TODAY,TODAY).level,'mixed');
 const d2=fixtureDays();d2.find(d=>d.date===TODAY).snow=null;
 assert.equal(assess(area,species,d2,TODAY,TODAY).confidence,'Molto limitata');
});
test('species habitat and winter season gates',()=>{
 assert.equal(assess(AREAS[1],SPECIES.find(s=>s.id==='aereus'),fixtureDays(),TODAY,TODAY).label,'Habitat da verificare');
 const winter='2026-01-07';assert.equal(assess(area,species,fixtureDays(winter),winter,winter).label,'Fuori finestra tipica');
 assert.deepEqual(seasonalSpecies(SPECIES,1),[]);
 assert.ok(seasonalSpecies(SPECIES,3).some(s=>s.id==='marzuolo'));
});
test('other species do not inherit an unvalidated porcini model',()=>{
 assert.equal(assess(area,SPECIES.find(s=>s.id==='galletti'),fixtureDays(),TODAY,TODAY).label,'Solo calendario');
});
test('prolonged drought lowers score and future horizon lowers confidence',()=>{
 const days=fixtureDays();days.slice(7,24).forEach(d=>d.rain=0);
 const r=assess(area,species,days,TODAY,TODAY);assert.ok(r.reasons.some(s=>s.includes('secca prolungata')));
 assert.equal(assess(area,species,fixtureDays(),addDays(TODAY,5),TODAY).confidence,'Molto limitata');
});
test('Rome dates, leap years and DST preserve calendar windows',()=>{
 assert.equal(dateInRome(new Date('2026-09-06T23:30:00Z')),TODAY);
 assert.equal(addDays('2026-03-29',1),'2026-03-30');assert.equal(addDays('2024-02-28',1),'2024-02-29');
 assert.equal(isDate('2026-02-30'),false);assert.equal(isDate('bad'),false);
});
test('regional weekdays never imply legal authorization',()=>{
 const er=AREAS.find(a=>a.region==='ER');assert.match(legalContext(er,TODAY).day,/normalmente escluso/);
 assert.match(legalContext(er,addDays(TODAY,1)).day,/Non conferma/);
 assert.equal(legalContext(area,TODAY).status,'Da verificare');
});
