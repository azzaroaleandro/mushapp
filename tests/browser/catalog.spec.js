import {MEDIA} from '../../src/catalog-media.js';
import {CATALOG} from '../../src/catalog-data.js';
import {test,expect} from '@playwright/test';
import {apiFixture} from '../fixtures.js';
test.beforeEach(async({page})=>{
 await page.clock.setFixedTime(new Date('2026-09-07T10:00:00Z'));
 await page.route('https://api.open-meteo.com/**',r=>r.fulfill({json:apiFixture()}));
});
test('catalog common-name search, toxic status and detailed source',async({page})=>{
 await page.goto('/#catalog');await expect(page.locator('.catalog-card')).toHaveCount(CATALOG.length);
 await expect(page.locator('.catalog-safety')).toContainText('esemplare identificato');
 await page.locator('#catalog-query').fill('finferlo');await expect(page.locator('.catalog-card')).toHaveCount(2);await expect(page.locator('#catalog-grid')).toContainText('Cantharellus cibarius');await expect(page.locator('#catalog-grid')).toContainText('Hygrophoropsis aurantiaca');
 await page.locator('#catalog-query').fill('');await page.selectOption('#catalog-status','deadly');
 await expect(page.locator('.catalog-card')).toHaveCount(CATALOG.filter(t=>t.status==='deadly').length);
 await page.locator('[data-taxon="phalloides"]').click();
 await expect(page.locator('#catalog-dialog')).toContainText('VELENOSA MORTALE');
 await expect(page.locator('#catalog-dialog .source-list a').first()).toHaveAttribute('href',/provincia.cuneo.it/);
 await page.keyboard.press('Escape');
});
test('world search has pagination, unknown edibility and robust failures',async({page})=>{
 await page.route('https://api.gbif.org/v1/species/search?**',r=>r.fulfill({json:{count:48,endOfRecords:false,results:[{key:99,canonicalName:'Testus fungalensis',kingdom:'Fungi',rank:'SPECIES',taxonomicStatus:'ACCEPTED',family:'Testaceae'}]}}));
 await page.route('https://api.gbif.org/v1/species/99/media',r=>r.fulfill({json:{results:[]}}));
 await page.goto('/#catalog');await page.locator('#catalog-world').click();
 await expect(page.locator('#catalog-grid')).toContainText('Commestibilità non verificata');
 await page.locator('[data-global-taxon="99"]').click();await expect(page.locator('#catalog-dialog')).toContainText('Foto non disponibile');
 await page.keyboard.press('Escape');await page.locator('#catalog-next').click();await expect(page.locator('#catalog-page')).toContainText('2');
 await page.route('https://api.gbif.org/v1/species/search?**',r=>r.abort());
 await page.locator('#catalog-search-form button').click();await expect(page.locator('#catalog-status-message')).toContainText('Indice non disponibile');
 await page.locator('#catalog-local').click();await expect(page.locator('.catalog-card')).toHaveCount(CATALOG.length);
});
test('Campiglio defaults, provinces and recommendation open the correct day',async({page})=>{
 await page.goto('/');await expect(page.locator('#nearby')).toBeChecked();await expect(page.locator('#region')).toHaveValue('TN');
 await expect(page.locator('[data-area-card="campiglio"]')).toBeVisible();
 await expect(page.locator('.suggestion-card')).not.toHaveCount(0);
 const button=page.locator('[data-suggest]').first(),date=await button.getAttribute('data-suggest-date');
 await button.click();await expect(page.locator('#date')).toHaveValue(date);await expect(page.locator('#zone-dialog')).toBeVisible();await page.keyboard.press('Escape');
 await page.selectOption('#region','ER');await page.selectOption('#province','MO');
 await expect(page.locator('.zone-card')).toHaveCount(1);await expect(page.locator('.zone-card')).toContainText('Frassinoro');
 await page.selectOption('#province','FE');await expect(page.locator('.zone-card')).toHaveCount(0);
});
test('mobile catalog and recommendations fit the viewport',async({page})=>{
 await page.setViewportSize({width:390,height:844});await page.goto('/#catalog');
 await expect(page.locator('.catalog-card')).toHaveCount(CATALOG.length);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBeTruthy();
 await page.locator('[data-taxon="edulis"]').click();
 expect(await page.locator('#catalog-dialog').evaluate(el=>el.scrollWidth<=el.clientWidth)).toBeTruthy();
 await page.keyboard.press('Escape');
 const b=(await page.screenshot({type:'jpeg',quality:65,fullPage:false})).toString('base64');
 for(let i=0;i<b.length;i+=6000)console.log('CATALOG_SHOT_'+String(i/6000).padStart(3,'0')+'='+b.slice(i,i+6000));
});

test('expanded catalogue has matching counts, new photos, sources and unknown status',async({page})=>{
 await page.goto('/#catalog');
 await expect(page.locator('#catalog-local')).toContainText(String(CATALOG.length));
 await expect(page.locator('#catalog-status-message')).toContainText('80 di 80');
 await page.locator('#catalog-query').fill('pioppino');
 await expect(page.locator('.catalog-card')).toHaveCount(1);
 await expect(page.locator('#catalog-status-message')).toContainText('1 di 80');
 await expect(page.locator('.catalog-card img')).toHaveAttribute('alt',/Cyclocybe aegerita/);
 await page.locator('#catalog-query').fill('marzuolo');
 await page.locator('[data-taxon="marzuolus"]').click();
 await expect(page.locator('#catalog-dialog .source-list a').first()).toContainText('AMINT');
 await expect(page.locator('#catalog-dialog .source-list a').first()).toHaveAttribute('href',/funghiitaliani.it/);
 await page.keyboard.press('Escape');
 await page.locator('#catalog-query').fill('');await page.selectOption('#catalog-status','unknown');
 await expect(page.locator('.catalog-card')).toHaveCount(1);
 await expect(page.locator('.catalog-card')).toContainText('Sparassis crispa');
});

test('all catalogue photographs decode and retain their real visual references',async({page})=>{
 test.setTimeout(180000);
 await page.setViewportSize({width:1200,height:1000});await page.goto('/#catalog');
 await expect(page.locator('.catalog-card')).toHaveCount(CATALOG.length);
 const photos=await page.locator('.mushroom-photo img').evaluateAll(imgs=>imgs.map(i=>({url:i.src,alt:i.alt})));
 const outcomes=await page.evaluate(async photos=>{
  const results=[];
  for(let i=0;i<photos.length;i+=4){
   results.push(...await Promise.all(photos.slice(i,i+4).map(async p=>{
    const probe=new Image();probe.src=p.url;
    try{await Promise.race([probe.decode(),new Promise((_,reject)=>setTimeout(()=>reject(Error('timeout')),12000))]);return {...p,ok:probe.naturalWidth>0,width:probe.naturalWidth,height:probe.naturalHeight};}
    catch{return {...p,ok:false};}
   })));
  }
  return results;
 },photos);
 console.log('CATALOG_PHOTO_AUDIT='+JSON.stringify(outcomes));
 expect(outcomes.filter(p=>!p.ok)).toEqual([]);
 // A temporary contact sheet is only applied to this verification page.
 await page.addStyleTag({content:'.app-shell{display:block!important;max-width:none!important}.sidebar,.view> :not(#catalog-grid),.topbar{display:none!important}main,.main-content{margin:0!important;padding:8px!important;max-width:none!important}.catalog-grid{display:grid!important;grid-template-columns:repeat(8,minmax(0,1fr))!important;gap:5px!important}.catalog-card{min-width:0!important}.mushroom-photo img{height:90px!important;width:100%!important;object-fit:contain!important}.mushroom-photo{height:auto!important;aspect-ratio:auto!important}.mushroom-photo figcaption,.catalog-card .edibility,.catalog-card button,.catalog-card h2{display:none!important}.catalog-card-copy{padding:4px!important}.catalog-card .latin{font-size:10px!important;line-height:1.2!important;margin:0!important}'});
 await page.locator('.mushroom-photo img').evaluateAll(imgs=>imgs.forEach(i=>{i.loading='eager';}));
 await page.evaluate(async()=>{await Promise.all([...document.querySelectorAll('.mushroom-photo img')].map(i=>i.decode().catch(()=>{})));});
 const retries=page.locator('.photo-error:not([hidden]) [data-retry-photo]');
 for(const button of await retries.all())await button.click();
 await expect(page.locator('.mushroom-photo img[hidden]')).toHaveCount(0);
 await page.evaluate(async()=>{await Promise.all([...document.querySelectorAll('.mushroom-photo img')].map(i=>i.decode()));});
 const b=(await page.screenshot({type:'jpeg',quality:75,fullPage:true})).toString('base64');
 for(let i=0;i<b.length;i+=6000)console.log('CATALOG_ALL_SHOT_'+String(i/6000).padStart(3,'0')+'='+b.slice(i,i+6000));
});

test('a temporarily failed photo can be retried without losing catalogue filters',async({page})=>{
 let attempts=0;
 await page.route(MEDIA.edulis.url,r=>{
  attempts++;
  return attempts===1?r.abort():r.fulfill({contentType:'image/png',body:Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+/l9sAAAAASUVORK5CYII=','base64')});
 });
 await page.goto('/#catalog');
 const card=page.locator('.catalog-card').filter({has:page.locator('[data-taxon="edulis"]')});
 await expect(card.locator('[data-retry-photo]')).toBeVisible();
 await card.locator('[data-retry-photo]').click();
 await expect(card.locator('.photo-error')).toBeHidden();
 await expect(card.locator('img')).toBeVisible();
 expect(await card.locator('img').evaluate(i=>i.naturalWidth)).toBeGreaterThan(0);
 await expect(page.locator('#catalog-status-message')).toContainText('80 di 80');
});
