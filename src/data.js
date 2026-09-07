import {EXTRA_AREAS} from './places.js';
export const REGIONS = {TN: 'Trentino', ER: 'Emilia-Romagna'};
export const SOURCES = {
  weather: 'https://open-meteo.com/en/docs',
  tn: 'https://www.ufficiostampa.provincia.tn.it/layout/set/print/Comunicati/Raccolta-funghi-il-limite-giornaliero-passa-da-2-a-3-chili-a-persona',
  tnPermits: 'https://www.visittrentino.info/it/articoli/speciale-autunno/andar-per-funghi',
  er: 'https://ambiente.regione.emilia-romagna.it/it/parchi-natura2000/sistema-regionale/funghi-sottobosco-tartufi/le-regole-per-la-raccolta-dei-funghi',
  casentinesi: 'https://www.parcoforestecasentinesi.it/it/vivi-il-parco/attivita/raccolta-funghi',
  science: 'https://italianmycology.unibo.it/article/view/16464',
  water: 'https://www.sciencedirect.com/science/article/pii/S0168192317303441',
  porcini: 'https://www.fungodiborgotaro.com/ita/29/fungo-porcino-igp/post.php?idforum=880118',
  health: 'https://www.ausl.fe.it/ausl-comunica/notizie/funghi-sicurezza-prima-di-tutto-da-30-anni-al-servizio-dei-cittadini-gli-ispettorati-micologici-dellemilia-romagna'
};
// Representative points for broad pilot areas, not verified picking locations.
// Habitat tags are editorial area hypotheses: no stand-level forest inventory is integrated.
export const AREAS = [
 ...EXTRA_AREAS.map(a=>({...a,permit:a.permit??SOURCES.er})),
 {id:'lagorai',name:'Lagorai · Valsugana',region:'TN',lat:46.12,lon:11.48,altitude:'900–1.600 m',hosts:['abete','faggio'],habitat:'Faggete e boschi di abete',terrain:'Versanti montani; quota e microclima cambiano molto.',permit:SOURCES.tnPermits},
 {id:'fiemme',name:'Val di Fiemme',region:'TN',lat:46.29,lon:11.49,altitude:'1.000–1.700 m',hosts:['abete','pino'],habitat:'Boschi di conifere',terrain:'Le quote più alte possono raffreddarsi rapidamente.',permit:SOURCES.tnPermits},
 {id:'sole',name:'Val di Sole',region:'TN',lat:46.33,lon:10.86,altitude:'900–1.600 m',hosts:['abete','faggio'],habitat:'Boschi montani misti',terrain:'Esposizione e umidità variano tra i due versanti.',permit:SOURCES.tnPermits},
 {id:'taro',name:'Val Taro',region:'ER',lat:44.46,lon:9.74,altitude:'500–1.200 m',hosts:['castagno','faggio','quercia'],habitat:'Castagneti e faggete',terrain:'Area ampia tra Borgotaro e Albareto; verificare il tesserino locale.',permit:SOURCES.er},
 {id:'corniglio',name:'Alta Val Parma',region:'ER',lat:44.43,lon:10.06,altitude:'800–1.400 m',hosts:['faggio','castagno'],habitat:'Faggete dell’Appennino',terrain:'Area di Corniglio; parco, riserve e confini hanno regole proprie.',permit:SOURCES.er},
 {id:'casentino',name:'Appennino romagnolo',region:'ER',lat:43.88,lon:11.84,altitude:'700–1.300 m',hosts:['faggio','abete','castagno'],habitat:'Faggete e abetine',terrain:'Settore romagnolo delle Foreste Casentinesi: controllare zone e divieti del parco.',permit:SOURCES.casentinesi}
];
export const SPECIES = [
 {id:'edulis',name:'Porcino comune',latin:'Boletus edulis',short:'Porcino comune',months:[6,7,8,9,10,11],peak:[9,10],hosts:['faggio','abete','castagno','quercia','pino'],temp:[9,19],model:true,note:'Più tipico tra fine estate e autunno, con possibili nascite estive. Boschi di latifoglie e conifere.'},
 {id:'reticulatus',name:'Porcino estivo',latin:'Boletus reticulatus',short:'Porcino estivo',months:[5,6,7,8,9,10],peak:[6,7,9],hosts:['castagno','quercia','faggio'],temp:[14,24],model:true,note:'Specie di periodi più caldi, soprattutto in boschi di latifoglie. Anche chiamato B. aestivalis.'},
 {id:'aereus',name:'Porcino nero',latin:'Boletus aereus',short:'Porcino nero',months:[6,7,8,9,10],peak:[8,9],hosts:['quercia','castagno'],temp:[16,25],model:true,note:'Termofilo: cercare habitat caldi di quercia e castagno. Meno indicativo nei boschi alpini freddi.'},
 {id:'pinophilus',name:'Porcino rosso',latin:'Boletus pinophilus',short:'Porcino rosso',months:[5,6,7,8,9,10],peak:[6,9,10],hosts:['pino','abete','faggio'],temp:[8,18],model:true,note:'Associato anche a faggi e abeti, non soltanto ai pini. Possibili presenze primaverili e autunnali.'},
 {id:'galletti',name:'Gallinacci',latin:'Cantharellus cibarius s.l.',short:'Gallinacci',months:[6,7,8,9,10],peak:[7,8,9],hosts:['faggio','abete','castagno','quercia'],model:false,note:'Gruppo di specie dei boschi di latifoglie e conifere. La stagione locale dipende da acqua e temperatura.'},
 {id:'trombette',name:'Trombette dei morti',latin:'Craterellus cornucopioides',short:'Trombette',months:[8,9,10,11],peak:[9,10,11],hosts:['faggio','quercia','castagno'],model:false,note:'Soprattutto boschi di latifoglie umidi, tra fine estate e autunno.'},
 {id:'marzuolo',name:'Marzuolo',latin:'Hygrophorus marzuolus',short:'Marzuolo',months:[2,3,4,5],peak:[3,4],hosts:['abete','faggio','pino'],model:false,note:'Tra fine inverno e primavera, secondo quota e neve. Ricerca adatta a chi conosce già la specie.'}
];
export const MONTHS = ['Gen','Feb','Mar','Apr','Mag','Giu','Lug','Ago','Set','Ott','Nov','Dic'];
