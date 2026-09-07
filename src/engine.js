export const MODEL_VERSION = '0.1.0-experimental';
export const dateInRome = (date = new Date()) => new Intl.DateTimeFormat('en-CA', {timeZone:'Europe/Rome',year:'numeric',month:'2-digit',day:'2-digit'}).format(date);
export function addDays(iso, n) {const d=new Date(iso+'T12:00:00Z');d.setUTCDate(d.getUTCDate()+n);return d.toISOString().slice(0,10);}
export function isDate(value) {return typeof value==='string' && /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(value+'T12:00:00Z')) && new Date(value+'T12:00:00Z').toISOString().slice(0,10)===value;}
export const finite = value => typeof value==='number' && Number.isFinite(value);
export const mean = values => values.length && values.every(finite) ? values.reduce((a,b)=>a+b,0)/values.length : null;
const total = values => values.length && values.every(finite) ? values.reduce((a,b)=>a+b,0) : null;
export function windowBefore(days, date, n) {return Array.from({length:n},(_,i)=>days?.find(d=>d.date===addDays(date,i-n)) ?? {date:addDays(date,i-n)});}
export function features(days, date) {
 const w28=windowBefore(days,date,28), w14=w28.slice(-14), w7=w28.slice(-7);
 const target=days?.find(d=>d.date===date);
 const r7=total(w7.map(d=>d.rain)),r14=total(w14.map(d=>d.rain)),r28=total(w28.map(d=>d.rain));
 const et14=total(w14.map(d=>d.et0)),t7=mean(w7.map(d=>d.temp));
 const soilNow=mean(w7.slice(-3).map(d=>d.soil)),soilBefore=mean(w7.slice(0,3).map(d=>d.soil));
 const soilTemp=mean(w7.map(d=>d.soilTemp));
 let dryRun=0,maxDryRun=0;
 for(const d of w28){if(finite(d.rain)&&d.rain<1){dryRun++;maxDryRun=Math.max(maxDryRun,dryRun);}else dryRun=0;}
 return {r7,r14,r28,et14,balance:finite(r14)&&finite(et14)?r14-et14:null,t7,soilNow,
 soilTrend:finite(soilNow)&&finite(soilBefore)?soilNow-soilBefore:null,soilTemp,maxDryRun,
 wetDays:w14.filter(d=>finite(d.rain)&&d.rain>=2).length,
 complete:[r7,r14,r28,t7,et14].every(finite),
 frost:finite(target?.min)&&target.min<=0,
 snow:finite(target?.snow)&&target.snow>0.01,
 wind:target?.wind??null,
 targetKnown:!!target&&[target.min,target.max,target.wind,target.snow].every(finite)};
}
export function assess(area,species,days,date,today=dateInRome(),stale=false) {
 const x=features(days,date),month=Number(date.slice(5,7));
 const inSeason=species.months.includes(month), habitat=area.hosts.some(h=>species.hosts.includes(h));
 const forecastDays=Math.max(0,Math.round((new Date(date+'T12:00:00Z')-new Date(today+'T12:00:00Z'))/864e5));
 const result={features:x,inSeason,habitat,forecastDays,rank:-1,level:'unknown',label:'Dati insufficienti',reasons:[],confidence:'Limitata',version:MODEL_VERSION};
 if(!x.complete||stale){result.reasons.push(stale?'Dati meteo scaduti: aggiorna prima di confrontare le zone.':'Servono 28 giorni completi di pioggia e i dati termici e di evaporazione.');return result;}
 if(!species.model){return {...result,label:'Solo calendario',reasons:['Per questa specie non è ancora disponibile un indice di condizioni. Il meteo resta consultabile.']};}
 if(!inSeason){return {...result,level:'low',label:'Fuori finestra tipica',rank:0,reasons:['Il mese è fuori dalla finestra stagionale indicativa; le eccezioni locali non sono escluse.']};}
 if(!habitat){return {...result,level:'low',label:'Habitat da verificare',rank:0,reasons:['Nell’area pilota non è indicato un habitat ospite coerente con la specie.']};}
 if(x.frost||x.snow){return {...result,level:'low',label:'Freddo o neve',rank:0,reasons:[x.snow?'Il modello segnala neve al suolo.':'Il modello segnala una minima pari o inferiore a 0 °C.']};}
 // All cutoffs and weights below are product hypotheses, NOT validated biological thresholds.
 let score=0;
 if(x.r14>=20&&x.wetDays>=3){score+=2;result.reasons.push('Pioggia distribuita nelle ultime due settimane.');}
 else if(x.r14>=10){score++;result.reasons.push('Un po’ di pioggia recente; distribuzione da valutare.');}
 else result.reasons.push('Poca pioggia nelle ultime due settimane.');
 if(x.balance>=-5){score++;result.reasons.push('Pioggia vicina o superiore all’ET₀ di riferimento.');}
 else result.reasons.push('Il bilancio pioggia − ET₀ indica pressione di essiccamento.');
 if(x.t7>=species.temp[0]&&x.t7<=species.temp[1]){score++;result.reasons.push('Temperatura nel campo esplorativo della specie.');}
 else result.reasons.push('Temperatura fuori dal campo esplorativo della specie.');
 if(finite(x.soilTrend)&&x.soilTrend>=-0.01){score++;result.reasons.push('Umidità del suolo modellata stabile o in crescita.');}
 else result.reasons.push(finite(x.soilTrend)?'Umidità del suolo modellata in calo.':'Umidità del suolo non disponibile.');
 if(x.maxDryRun>=14){score--;result.reasons.push('Una fase secca prolungata può ritardare la ripresa.');}
 const limited=!finite(x.soilTrend)||!finite(x.soilTemp)||!x.targetKnown;
 if(limited){score=Math.min(score,3);result.confidence='Molto limitata';result.reasons.push('Mancano dati del suolo o dati della giornata: confronto incompleto.');}
 if(forecastDays>=4){result.confidence='Molto limitata';result.reasons.push('A questa distanza aumenta l’incertezza del meteo.');}
 return {...result,rank:Math.max(0,score),level:score>=4?'promising':score>=2?'mixed':'low',label:score>=4?'Segnali favorevoli':score>=2?'Segnali contrastanti':'Segnali deboli'};
}
export function seasonalSpecies(species,month) {return species.filter(s=>s.months.includes(month)).sort((a,b)=>Number(b.peak.includes(month))-Number(a.peak.includes(month)));}
export function legalContext(area,date) {
 const weekday=new Date(date+'T12:00:00Z').getUTCDay();
 if(area.region==='TN') return {status:'Da verificare',summary:'Quadro generale Trentino: fino a 3 kg a persona al giorno, dalle 7 alle 19. Per i non residenti è generalmente richiesto il permesso comunale.',day:'Verifica Comune, eventuali esenzioni e aree vietate.'};
 return {status:'Da verificare',summary:'Quadro generale Emilia-Romagna: fino a 3 kg al giorno, martedì, giovedì, sabato e domenica; tesserino territoriale e deroghe locali.',day:[0,2,4,6].includes(weekday)?'Giorno nel calendario regionale generale. Non conferma il diritto di raccolta.':'Giorno normalmente escluso dal calendario regionale generale. Verifica eventuali deroghe personali e locali.'};
}
