import {assess,addDays,legalContext} from './engine.js';
import {distanceKm,inTerritory} from './places.js';
export function recommend({areas,species,bundle,today,region='all',province='all',nearby=true,stale=false,limit=6}){
 const eligible=areas.filter(a=>inTerritory(a,region,province,nearby));
 const byArea=eligible.map(area=>{
  const choices=Array.from({length:8},(_,i)=>{
   const date=addDays(today,i),assessment=assess(area,species,bundle?.data?.[area.id]?.days??[],date,today,stale);
   const weekday=new Date(date+'T12:00:00Z').getUTCDay();
   const normallyClosed=area.region==='ER'&&![0,2,4,6].includes(weekday);
   return {area,date,assessment,normallyClosed,distance:distanceKm(area),legal:legalContext(area,date)};
  }).filter(x=>x.assessment.rank>=2&&!x.normallyClosed);
  return choices.sort((a,b)=>b.assessment.rank-a.assessment.rank||a.date.localeCompare(b.date))[0];
 }).filter(Boolean);
 return byArea.sort((a,b)=>b.assessment.rank-a.assessment.rank||a.date.localeCompare(b.date)||a.distance-b.distance).slice(0,limit);
}
