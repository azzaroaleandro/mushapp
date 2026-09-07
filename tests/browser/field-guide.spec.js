import {test,expect} from '@playwright/test';
import {apiFixture} from '../fixtures.js';
test.beforeEach(async({page})=>{
 await page.clock.setFixedTime(new Date('2026-09-07T10:00:00Z'));
 await page.route('https://api.open-meteo.com/**',r=>r.fulfill({json:apiFixture()}));
});
test('unknown-name flow uses shapes and never hides toxic references through edible filter',async({page})=>{
 await page.goto('/#catalog');await page.selectOption('#catalog-status','edible');
 await page.locator('#catalog-observe').click();
 await expect(page.locator('#catalog-search-form')).toBeHidden();
 await expect(page.locator('#field-guide')).toBeVisible();
 await page.locator('[data-shape="pores"]').click();
 await expect(page.locator('.catalog-card')).toHaveCount(5);
 await expect(page.locator('[data-taxon="satanas"]')).toBeVisible();
 await expect(page.locator('#catalog-grid .edibility')).toHaveCount(0);
 await expect(page.locator('#catalog-status-message')).toContainText('nessuna identificazione automatica');
 await page.locator('[data-shape="gills"]').click();
 await expect(page.locator('[data-taxon="phalloides"]')).toBeVisible();
 await page.locator('#shape-reset').click();await expect(page.locator('.catalog-card')).toHaveCount(24);
 await page.locator('#field-back').click();await expect(page.locator('#catalog-search-form')).toBeVisible();
 await expect(page.locator('#catalog-status')).toHaveValue('edible');
});
test('local photo can be compared, removed and is never uploaded or persisted',async({page})=>{
 const posts=[];page.on('request',r=>{if(r.method()==='POST')posts.push(r.url());});
 await page.goto('/#catalog');await page.locator('#catalog-observe').click();
 await expect(page.locator('#field-camera')).toHaveAttribute('capture','environment');
 const png=Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+/l9sAAAAASUVORK5CYII=','base64');
 await page.locator('#field-gallery').setInputFiles({name:'reference.png',mimeType:'image/png',buffer:png});
 await expect(page.locator('#field-photo-state')).toContainText('Foto pronta');
 await expect(page.locator('#field-photo-preview')).toHaveAttribute('src',/^blob:/);
 await page.locator('[data-taxon="edulis"]').click();await expect(page.locator('#catalog-dialog .photo-comparison img')).toHaveCount(2);
 await expect(page.locator('#catalog-dialog')).toContainText('La tua foto · da identificare');
 await page.keyboard.press('Escape');await page.locator('#field-photo-remove').click();await expect(page.locator('#field-photo-frame')).toBeHidden();
 await page.locator('#field-gallery').setInputFiles({name:'bad.png',mimeType:'image/png',buffer:Buffer.from('not an image')});
 await expect(page.locator('#field-photo-error')).toContainText('Non riesco');
 await page.reload();await page.locator('#catalog-observe').click();await expect(page.locator('#field-photo-frame')).toBeHidden();
 expect(posts).toEqual([]);
});
for(const width of [320,390,768]){
 test('field UI and map switching at width '+width,async({page})=>{
  await page.setViewportSize({width,height:844});await page.goto('/');
  await expect(page.locator('#data-status')).toContainText('acquisiti');
  await expect(page.locator('.map-column')).toBeHidden();
  await page.locator('#show-map').click();await expect(page.locator('.map-column')).toBeVisible();await expect(page.locator('.zone-column')).toBeHidden();
  await page.locator('#show-list').click();await expect(page.locator('.zone-column')).toBeVisible();
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBeTruthy();
  const nav=await page.locator('.sidebar nav a').evaluateAll(els=>els.map(e=>({w:e.getBoundingClientRect().width,h:e.getBoundingClientRect().height})));
  expect(nav.every(r=>r.w>=44&&r.h>=44)).toBeTruthy();
  await page.goto('/#catalog');await page.locator('#catalog-observe').click();
  await page.locator('[data-shape="pores"]').click();
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBeTruthy();
  await page.locator('[data-taxon="satanas"]').click();
  expect(await page.locator('#catalog-dialog').evaluate(e=>e.scrollWidth<=e.clientWidth)).toBeTruthy();
  await page.keyboard.press('Escape');
  if(width===390){await page.evaluate(()=>window.scrollTo(0,0));const b=(await page.screenshot({type:'jpeg',quality:65})).toString('base64');
   for(let i=0;i<b.length;i+=6000)console.log('FIELD_SHOT_'+String(i/6000).padStart(3,'0')+'='+b.slice(i,i+6000));}
 });
}
