import test from 'node:test';
import assert from 'node:assert/strict';
import {apiFixture,TODAY} from './fixtures.js';
import {normalizeWeather,weatherUrl,fetchWeather,cacheAge,usableCache} from '../src/weather.js';
test('API URL uses Rome, history and explicit wind units',()=>{
 const url=new URL(weatherUrl());assert.equal(url.searchParams.get('past_days'),'35');assert.equal(url.searchParams.get('timezone'),'Europe/Rome');assert.equal(url.searchParams.get('latitude').split(',').length,13);
});
test('adapter normalizes numeric rain and modeled soil',()=>{
 const raw=apiFixture()[0],data=normalizeWeather(raw);assert.equal(data.days.length,43);assert.equal(data.days[0].rain,2);assert.ok(Math.abs(data.days[0].soil-.3)<1e-9);
 raw.daily.rain_sum[0]=null;assert.equal(normalizeWeather(raw).days[0].rain,null);
 raw.daily.rain_sum[0]='4';assert.equal(normalizeWeather(raw).days[0].rain,null);
});
test('unexpected units fail explicitly',()=>{
 const raw=apiFixture()[0];raw.daily_units.wind_speed_10m_max='m/s';assert.throws(()=>normalizeWeather(raw),/Unità/);
});
test('insufficient hourly coverage produces missing soil',()=>{
 const raw=apiFixture()[0];raw.hourly.soil_moisture_9_to_27cm.fill(null,0,10);
 assert.equal(normalizeWeather(raw).days[0].soil,null);
});
test('batch adapter retains partial success and fails on wrong area count',async()=>{
 const raw=apiFixture();raw[1].daily=null;
 const bundle=await fetchWeather({fetcher:async()=>({ok:true,json:async()=>raw})});
 assert.equal(Object.keys(bundle.data).length,12);assert.equal(Object.keys(bundle.errors).length,1);
 await assert.rejects(fetchWeather({fetcher:async()=>({ok:true,json:async()=>[]})}),/incompleta/);
});
test('rate limiting and invalid cache never masquerade as fresh data',async()=>{
 await assert.rejects(fetchWeather({fetcher:async()=>({ok:false,status:429})}),/limite/);
 const now=Date.parse(TODAY+'T10:00:00Z');
 assert.equal(cacheAge({fetchedAt:'nonsense'},now),Infinity);
 assert.equal(usableCache({version:2,date:TODAY,data:{},fetchedAt:TODAY+'T09:45:00Z'},now),true);
 assert.equal(usableCache({version:2,date:TODAY,data:{},fetchedAt:TODAY+'T09:00:00Z'},now),false);
});
