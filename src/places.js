export const PROVINCES=[
 {id:'TN',name:'Trento',region:'TN'},{id:'PC',name:'Piacenza',region:'ER'},{id:'PR',name:'Parma',region:'ER'},
 {id:'RE',name:'Reggio Emilia',region:'ER'},{id:'MO',name:'Modena',region:'ER'},{id:'BO',name:'Bologna',region:'ER'},
 {id:'FE',name:'Ferrara',region:'ER'},{id:'RA',name:'Ravenna',region:'ER'},{id:'FC',name:'Forlì-Cesena',region:'ER'},{id:'RN',name:'Rimini',region:'ER'}
];
export const CAMPIGLIO={lat:46.23,lon:10.827,name:'Madonna di Campiglio'};
export const CAMPIGLIO_RULES='https://www.campigliodolomiti.it/it/raccolta-funghi/raccolta-funghi-in-zona-campiglio?landing=232';
export const EXTRA_AREAS=[
 {id:'campiglio',name:'Campiglio · boschi di Vallesinella',region:'TN',province:'TN',lat:46.213,lon:10.839,altitude:'1.300–1.700 m',hosts:['abete','faggio'],habitat:'Boschi montani misti e abetine',terrain:'Area indicativa a sud di Madonna di Campiglio, nel contesto del Parco Adamello Brenta. Verificare regole e accessi locali.',permit:CAMPIGLIO_RULES},
 {id:'nambrone',name:'Val Nambrone · fascia bassa',region:'TN',province:'TN',lat:46.203,lon:10.768,altitude:'1.000–1.500 m',hosts:['abete','faggio'],habitat:'Boschi montani della Val Rendena',terrain:'Punto indicativo della valle, non sentiero né posto di raccolta verificato. Accessi e divieti possono variare.',permit:CAMPIGLIO_RULES},
 {id:'rendena',name:'Alta Val Rendena · Carisolo',region:'TN',province:'TN',lat:46.177,lon:10.742,altitude:'800–1.300 m',hosts:['abete','faggio'],habitat:'Boschi misti dei versanti',terrain:'Fascia più bassa rispetto a Campiglio. Quote, esposizione e particelle devono essere verificate sul posto.',permit:CAMPIGLIO_RULES},
 {id:'valnure',name:'Alta Val Nure',region:'ER',province:'PC',lat:44.622,lon:9.544,altitude:'800–1.300 m',hosts:['faggio','castagno'],habitat:'Faggete e castagneti appenninici',terrain:'Area pilota indicativa del Piacentino; verificare tesserino, proprietà e restrizioni territoriali.'},
 {id:'ramiseto',name:'Appennino reggiano · Ramiseto',region:'ER',province:'RE',lat:44.41,lon:10.279,altitude:'700–1.200 m',hosts:['faggio','castagno'],habitat:'Boschi di latifoglie',terrain:'Area ampia del Reggiano; verificare confini del parco e regolamenti locali.'},
 {id:'frassinoro',name:'Appennino modenese · Frassinoro',region:'ER',province:'MO',lat:44.275,lon:10.571,altitude:'900–1.400 m',hosts:['faggio','castagno'],habitat:'Faggete e boschi misti',terrain:'Punto pilota nel Modenese, senza accessi o luoghi di raccolta verificati.'},
 {id:'lizzano',name:'Alto Reno · Lizzano in Belvedere',region:'ER',province:'BO',lat:44.16,lon:10.863,altitude:'800–1.300 m',hosts:['faggio','castagno'],habitat:'Faggete e castagneti',terrain:'Area dell’Appennino bolognese: controllare aree protette e tesserino competente.'}
];
export function distanceKm(a,b=CAMPIGLIO){const rad=x=>x*Math.PI/180;const p=rad(b.lat-a.lat),q=rad(b.lon-a.lon);const h=Math.sin(p/2)**2+Math.cos(rad(a.lat))*Math.cos(rad(b.lat))*Math.sin(q/2)**2;return 6371*2*Math.atan2(Math.sqrt(h),Math.sqrt(1-h));}
export function provinceFor(area){return area.province??(area.region==='TN'?'TN':area.id==='casentino'?'FC':'PR');}
export function inTerritory(area,region,province='all',nearby=false){return (region==='all'||area.region===region)&&(province==='all'||provinceFor(area)===province)&&(!nearby||distanceKm(area)<=40);}
