import {AREAS} from '../src/data.js';
import {addDays} from '../src/engine.js';
export const TODAY='2026-09-07';
export function fixtureDays(today=TODAY) {
 return Array.from({length:43},(_,i)=>({date:addDays(today,i-35),rain:4,temp:15,min:10,max:20,et0:2,wind:10,soil:.3,soilTemp:14,snow:0}));
}
export function apiFixture(today=TODAY) {
 return AREAS.map((area,ai)=>{
  const days=fixtureDays(today);
  const raw={latitude:area.lat,longitude:area.lon,elevation:1000,timezone:'Europe/Rome',daily_units:{time:'iso8601',rain_sum:'mm',showers_sum:'mm',temperature_2m_mean:'°C',temperature_2m_min:'°C',temperature_2m_max:'°C',et0_fao_evapotranspiration:'mm',wind_speed_10m_max:'km/h'},hourly_units:{time:'iso8601',soil_moisture_9_to_27cm:'m³/m³',soil_temperature_18cm:'°C',snow_depth:'m'},daily:{time:days.map(d=>d.date),rain_sum:days.map((d,i)=>ai===1?0:((i%4)+1)*2),showers_sum:days.map(()=>0),temperature_2m_mean:days.map(()=>15),temperature_2m_min:days.map(()=>10),temperature_2m_max:days.map(()=>20),et0_fao_evapotranspiration:days.map(()=>2),wind_speed_10m_max:days.map(()=>12)},hourly:{time:[],soil_moisture_9_to_27cm:[],soil_temperature_18cm:[],snow_depth:[]}};
  for(const d of days)for(let h=0;h<24;h++){raw.hourly.time.push(d.date+'T'+String(h).padStart(2,'0')+':00');raw.hourly.soil_moisture_9_to_27cm.push(.30);raw.hourly.soil_temperature_18cm.push(14);raw.hourly.snow_depth.push(0);}
  return raw;
 });
}
