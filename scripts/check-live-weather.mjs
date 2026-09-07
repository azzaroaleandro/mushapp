import {writeFile} from 'node:fs/promises';
import {fetchWeather} from '../src/weather.js';
import {AREAS,SPECIES} from '../src/data.js';
import {assess,dateInRome} from '../src/engine.js';
const bundle=await fetchWeather();
const rows=AREAS.map(area=>{
 const data=bundle.data[area.id],result=assess(area,SPECIES[0],data?.days??[],dateInRome());
 return {area:area.id,days:data?.days.length??0,elevation:data?.elevation??null,level:result.level,rain14:result.features.r14,soil:result.features.soilNow,error:bundle.errors[area.id]??null};
});
console.log('LIVE_WEATHER_RESULT='+JSON.stringify({fetchedAt:bundle.fetchedAt,rows}));
if(rows.some(row=>row.days<36||row.error))throw new Error('Incomplete live API response');
await writeFile('live-weather-check.json',JSON.stringify({fetchedAt:bundle.fetchedAt,rows},null,2));
