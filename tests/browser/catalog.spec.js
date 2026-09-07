import {test,expect} from '@playwright/test';
import {apiFixture} from '../fixtures.js';
test.beforeEach(async({page})=>{
 await page.clock.setFixedTime(new Date('2026-09-07T10:00:00Z'));
 await page.route('https://api.open-meteo.com/**',r=>r.fulfill({json:apiFixture()}));
});
test('catalog common-name search, toxic status and detailed source',async({page})=>{
 await page.goto('/#catalog');await expect(page.locator('.catalog-card')).toHaveCount(24);
 await expect(page.locator('.catalog-safety')).toContainText('esemplare identificato');
 await page.locator('#catalog-query').fill('finferlo');await expect(page.locator('.catalog-card')).toHaveCount(1);await expect(page.locator('.catalog-card')).toContainText('Cantharellus cibarius');
 await page.locator('#catalog-query').fill('');await page.selectOption('#catalog-status','deadly');
 await expect(page.locator('.catalog-card')).toHaveCount(4);
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
 await page.locator('#catalog-local').click();await expect(page.locator('.catalog-card')).toHaveCount(24);
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
 await expect(page.locator('.catalog-card')).toHaveCount(24);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBeTruthy();
 await page.locator('[data-taxon="edulis"]').click();
 expect(await page.locator('#catalog-dialog').evaluate(el=>el.scrollWidth<=el.clientWidth)).toBeTruthy();
 await page.keyboard.press('Escape');
 const b=(await page.screenshot({type:'jpeg',quality:65,fullPage:false})).toString('base64');
 for(let i=0;i<b.length;i+=6000)console.log('CATALOG_SHOT_'+String(i/6000).padStart(3,'0')+'='+b.slice(i,i+6000));
});
