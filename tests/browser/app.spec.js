import {test,expect} from '@playwright/test';
import {apiFixture} from '../fixtures.js';
test.beforeEach(async({page})=>{
 await page.clock.setFixedTime(new Date('2026-09-07T10:00:00Z'));
 await page.route('https://api.open-meteo.com/**',route=>route.fulfill({json:apiFixture()}));
});
test('explore, filters, favorites, details, dates and calendar',async({page})=>{
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('/');await page.uncheck('#nearby');await page.selectOption('#region','all');await expect(page.locator('.zone-card')).toHaveCount(13);
 await expect(page.locator('#data-status')).toContainText('acquisiti');
 await expect(page.locator('.zone-list .condition.promising').first()).toBeVisible();
 await expect(page.locator('[data-area-card="taro"]')).toContainText('Giorno normalmente escluso');
 await page.selectOption('#region','TN');await expect(page.locator('.zone-card')).toHaveCount(6);
 await page.locator('[data-save="lagorai"]').click();await page.check('#favorites-only');await expect(page.locator('.zone-card')).toHaveCount(1);
 await page.locator('[data-detail="lagorai"]').click();await expect(page.locator('#zone-dialog').getByRole('heading',{name:'Lagorai · Valsugana',exact:true})).toBeVisible();
 await expect(page.locator('#zone-detail')).toContainText('Non è un’autorizzazione');
 await page.locator('[data-day="2026-09-12"]').click();await expect(page.locator('#zone-detail')).toContainText('molto limitata');
 await page.getByRole('button',{name:'Chiudi',exact:true}).click();
 await page.getByRole('link',{name:'Stagioni',exact:false}).first().click();
 await page.selectOption('#calendar-month','1');await expect(page.locator('#season-cards')).toContainText('Nessun suggerimento forzato');
 await page.selectOption('#calendar-month','3');await expect(page.locator('#season-cards')).toContainText('Marzuolo');
 expect(errors).toEqual([]);
});
test('journal CRUD, zero findings, escaping, persistence and export',async({page})=>{
 await page.goto('/#journal');await page.getByRole('button',{name:'Nuova uscita'}).click();
 await page.locator('[name="count"]').fill('0');await page.locator('[name="notes"]').fill('<img src=x onerror=alert(1)>');
 await page.getByRole('button',{name:'Salva uscita'}).click();await expect(page.locator('#journal-list')).toContainText('0 ritrovamenti');
 await expect(page.locator('#journal-list img')).toHaveCount(0);
 await page.reload();await expect(page.locator('#journal-list')).toContainText('<img src=x onerror=alert(1)>');
 await page.getByRole('button',{name:'Modifica',exact:true}).click();await page.locator('[name="minutes"]').fill('90');
 await page.getByRole('button',{name:'Salva uscita'}).click();await expect(page.locator('#journal-list')).toContainText('90 min');
 const downloadPromise=page.waitForEvent('download');await page.getByRole('button',{name:'Esporta diario'}).click();
 const download=await downloadPromise;expect(download.suggestedFilename()).toBe('mushapp-diario-2026-09-07.json');
 page.once('dialog',d=>d.accept());await page.getByRole('button',{name:'Elimina',exact:true}).click();await expect(page.locator('#journal-list')).toContainText('prima pagina');
});
test('failed weather stays explicitly unavailable and can be retried',async({page})=>{
 await page.route('https://api.open-meteo.com/**',r=>r.fulfill({status:503,json:{error:true}}));
 await page.goto('/');await expect(page.locator('#data-status')).toContainText('non disponibile');
 await expect(page.locator('.condition.promising')).toHaveCount(0);
 await expect(page.locator('.zone-list .condition.unknown')).toHaveCount(4);
 await page.route('https://api.open-meteo.com/**',r=>r.fulfill({json:apiFixture()}));
 await page.getByRole('button',{name:'Aggiorna meteo'}).click();await expect(page.locator('#data-status')).toContainText('acquisiti');
});
test('expired cache suspends recommendations when API is unavailable',async({page})=>{
 await page.addInitScript(()=>localStorage.setItem('mushapp.weather.v2',JSON.stringify({version:2,date:'2026-09-07',fetchedAt:'2026-09-07T00:00:00Z',data:{}})));
 await page.route('https://api.open-meteo.com/**',r=>r.abort());
 await page.goto('/');await expect(page.locator('#data-status')).toContainText('Stime sospese');
 await expect(page.locator('.condition.promising')).toHaveCount(0);
});
test('invalid import reports an error, valid import deduplicates',async({page})=>{
 await page.goto('/#journal');
 await page.locator('#import-journal').setInputFiles({name:'bad.json',mimeType:'application/json',buffer:Buffer.from('{}')});
 await expect(page.locator('#toast')).toContainText('non riuscita');
 const entry={id:'import-one',date:'2026-09-06',area:'taro',species:'edulis',count:0,minutes:60,people:1,notes:'Test',confirmed:false};
 for(let i=0;i<2;i++)await page.locator('#import-journal').setInputFiles({name:'diary.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify({version:1,entries:[entry]}))});
 await expect(page.locator('.journal-entry')).toHaveCount(1);
});
for(const device of [{name:'DESKTOP',width:1440,height:1000},{name:'MOBILE',width:390,height:844}]){
 test('layout and visual record '+device.name,async({page})=>{
  await page.setViewportSize({width:device.width,height:device.height});await page.goto('/');await expect(page.locator('#data-status')).toContainText('acquisiti');
  await page.evaluate(()=>document.fonts.ready);
  await page.waitForTimeout(1800);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth)).toBeTruthy();
  const shot=await page.screenshot({type:'jpeg',quality:65,fullPage:false});const base=shot.toString('base64');
  for(let i=0;i<base.length;i+=6000)console.log('MUSHAPP_SHOT_'+device.name+'_'+String(i/6000).padStart(3,'0')+'='+base.slice(i,i+6000));
  await page.locator('[data-detail="campiglio"]').click();
  expect(await page.locator('#zone-dialog').evaluate(el=>el.scrollWidth<=el.clientWidth)).toBeTruthy();
  await page.keyboard.press('Escape');await expect(page.locator('#zone-dialog')).not.toBeVisible();
 });
}
