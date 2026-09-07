import {AREAS} from './data.js';
import {finite,mean,dateInRome} from './engine.js';
const DAILY=['rain_sum','showers_sum','temperature_2m_mean','temperature_2m_min','temperature_2m_max','et0_fao_evapotranspiration','wind_speed_10m_max'];
const HOURLY=['soil_moisture_9_to_27cm','soil_temperature_18cm','snow_depth'];
export function weatherUrl(areas=AREAS) {
 const p=new URLSearchParams({latitude:areas.map(a=>a.lat).join(','),longitude:areas.map(a=>a.lon).join(','),daily:DAILY.join(','),hourly:HOURLY.join(','),past_days:'35',forecast_days:'8',timezone:'Europe/Rome',wind_speed_unit:'kmh'});
 return 'https://api.open-meteo.com/v1/forecast?'+p;
}
function value(v,min,max){return finite(v)&&v>=min&&v<=max?v:null;}
export function normalizeWeather(raw) {
 if(!raw?.daily?.time?.length||!raw?.daily_units||raw.timezone!=='Europe/Rome') throw new Error('Formato meteo non valido.');
 const units=raw.daily_units,hu=raw.hourly_units??{};
 for(const [k,u] of Object.entries({rain_sum:'mm',showers_sum:'mm',temperature_2m_mean:'°C',temperature_2m_min:'°C',temperature_2m_max:'°C',et0_fao_evapotranspiration:'mm',wind_speed_10m_max:'km/h'})){
  if(units[k]!==u)throw new Error('Unità meteo inattesa: '+k);
 }
 const hourly=new Map();
 (raw.hourly?.time??[]).forEach((time,i)=>{
  const date=time.slice(0,10);
  if(!hourly.has(date))hourly.set(date,{soil:[],soilTemp:[],snow:[]});
  const h=hourly.get(date);
  h.soil.push(hu.soil_moisture_9_to_27cm==='m³/m³'?value(raw.hourly.soil_moisture_9_to_27cm?.[i],0,1):null);
  h.soilTemp.push(hu.soil_temperature_18cm==='°C'?value(raw.hourly.soil_temperature_18cm?.[i],-50,65):null);
  h.snow.push(hu.snow_depth==='m'?value(raw.hourly.snow_depth?.[i],0,20):null);
 });
 const average = arr => {const good=(arr??[]).filter(finite);return good.length>=18?mean(good):null;};
 const days=raw.daily.time.map((date,i)=>{
  const d=raw.daily,h=hourly.get(date),rain=value(d.rain_sum?.[i],0,1500),showers=value(d.showers_sum?.[i],0,1500);
  return {date,rain:finite(rain)&&finite(showers)?rain+showers:null,temp:value(d.temperature_2m_mean?.[i],-60,65),min:value(d.temperature_2m_min?.[i],-60,65),max:value(d.temperature_2m_max?.[i],-60,65),et0:value(d.et0_fao_evapotranspiration?.[i],0,40),wind:value(d.wind_speed_10m_max?.[i],0,400),soil:average(h?.soil),soilTemp:average(h?.soilTemp),snow:average(h?.snow)};
 });
 return {days,elevation:finite(raw.elevation)?Math.round(raw.elevation):null,latitude:raw.latitude,longitude:raw.longitude};
}
export async function fetchWeather({fetcher=fetch,areas=AREAS}={}) {
 const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),25000);
 try{
  const response=await fetcher(weatherUrl(areas),{signal:controller.signal,cache:'no-store'});
  if(!response.ok)throw new Error(response.status===429?'Il servizio meteo ha raggiunto il limite di richieste. Riprova più tardi.':'Servizio meteo non disponibile ('+response.status+').');
  const body=await response.json();
  const rows=Array.isArray(body)?body:[body];
  if(rows.length!==areas.length)throw new Error('Risposta meteo incompleta.');
  const data={},errors={};
  rows.forEach((row,i)=>{try{data[areas[i].id]=normalizeWeather(row);}catch(e){errors[areas[i].id]=e.message;}});
  if(!Object.keys(data).length)throw new Error('Dati meteo non utilizzabili. Riprova più tardi.');
  return {version:1,date:dateInRome(),fetchedAt:new Date().toISOString(),data,errors};
 }catch(e){if(e.name==='AbortError')throw new Error('Il servizio meteo impiega troppo tempo. Riprova.');throw e;}
 finally{clearTimeout(timer);}
}
export function cacheAge(bundle,now=Date.now()) {const age=now-Date.parse(bundle?.fetchedAt);return Number.isFinite(age)&&age>=0?age:Infinity;}
export function usableCache(bundle,now=Date.now()){return bundle?.version===1 && bundle?.date===dateInRome(new Date(now)) && cacheAge(bundle,now)<30*60e3 && !!bundle.data;}
