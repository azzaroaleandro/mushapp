export const HEALTH_SOURCE='https://www.salute.gov.it/new/it/tema/sistema-di-controllo-della-sicurezza-alimentare/funghi-consumiamoli-sicurezza/';
export const EDIBILITY={"edible":"Commestibile · specie","conditional":"Commestibilità condizionata","inedible":"Non commestibile","toxic":"Velenoso / tossico","deadly":"Velenoso · anche mortale","unknown":"Commestibilità non verificata"};
export const CATALOG=[
  {
    "id": "edulis",
    "latin": "Boletus edulis",
    "name": "Porcino comune",
    "aliases": [
      "Porcino",
      "Bolè"
    ],
    "status": "edible",
    "source": "https://natura.provincia.cuneo.it/funghi/commestibili/boletus-edulis/",
    "description": "Boschi di latifoglie e conifere; più tipico fra fine estate e autunno. Presenta pori sotto il cappello e un reticolo sul gambo.",
    "caution": "Il solo cappello marrone non identifica un porcino. Confrontare l’intero esemplare con un micologo.",
    "similar": "Boletus reticulatus, Tylopilus felleus e altri boleti.",
    "reviewedAt": "2026-09-07"
  },
  {
    "id": "reticulatus",
    "latin": "Boletus reticulatus",
    "name": "Porcino estivo",
    "aliases": [
      "Boletus aestivalis",
      "Porcino reticolato"
    ],
    "status": "edible",
    "source": "https://natura.provincia.cuneo.it/funghi/commestibili/boletus-aestivalis/",
    "description": "Porcino dei periodi più caldi, con pori chiari che maturando diventano giallo-verdastri e un reticolo evidente sul gambo.",
    "caution": "Il nome B. aestivalis è usato come sinonimo. L’aspetto cambia con età e siccità.",
    "similar": "Altri porcini e boleti dal cappello bruno.",
    "reviewedAt": "2026-09-07"
  },
  {
    "id": "aereus",
    "latin": "Boletus aereus",
    "name": "Porcino nero",
    "aliases": [
      "Bronzino"
    ],
    "status": "edible",
    "source": "https://natura.provincia.cuneo.it/funghi/commestibili/boletus-aereus/",
    "description": "Porcino dal cappello tipicamente scuro, associato soprattutto a boschi caldi di quercia e castagno.",
    "caution": "Il colore è variabile e non basta a distinguere una specie.",
    "similar": "Altri porcini e boleti bruni.",
    "reviewedAt": "2026-09-07"
  },
  {
    "id": "pinophilus",
    "latin": "Boletus pinophilus",
    "name": "Porcino rosso",
    "aliases": [
      "Porcino dei pini"
    ],
    "status": "edible",
    "source": "https://natura.provincia.cuneo.it/funghi/commestibili/boletus-pinophilus/",
    "description": "Porcino dai toni spesso rossastri, presente anche sotto faggio e abete. Il nome comune non indica un’associazione esclusiva con i pini.",
    "caution": "Valutare tutte le caratteristiche, non soltanto colore e albero vicino.",
    "similar": "Boletus edulis e altri porcini.",
    "reviewedAt": "2026-09-07"
  },
  {
    "id": "cibarius",
    "latin": "Cantharellus cibarius",
    "name": "Gallinaccio",
    "aliases": [
      "Finferlo",
      "Galletto",
      "Galletti"
    ],
    "status": "edible",
    "source": "https://natura.provincia.cuneo.it/funghi/commestibili/cantharellus-cibarius/",
    "description": "Fungo dei boschi di latifoglie e conifere, con rilievi simili a pieghe sotto il cappello. Il nome comune comprende talvolta specie vicine.",
    "caution": "Esiste una pericolosa confusione con Omphalotus olearius. Una foto dall’alto non mostra i caratteri necessari.",
    "similar": "Omphalotus olearius, tossico; altri Cantharellus.",
    "reviewedAt": "2026-09-07"
  },
  {
    "id": "cornucopioides",
    "latin": "Craterellus cornucopioides",
    "name": "Trombetta dei morti",
    "aliases": [
      "Trombette",
      "Imbutini"
    ],
    "status": "edible",
    "source": "https://natura.provincia.cuneo.it/funghi/commestibili/craterellus-cornucopioides/",
    "description": "Specie cava e imbutiforme, di consistenza sottile. Cresce spesso in gruppi nei boschi umidi di latifoglie, soprattutto in autunno.",
    "caution": "Il nome popolare non indica tossicità. La scheda descrive la specie, non verifica ciò che hai raccolto.",
    "similar": "Altri funghi imbutiformi scuri.",
    "reviewedAt": "2026-09-07"
  },
  {
    "id": "procera",
    "latin": "Macrolepiota procera",
    "name": "Mazza di tamburo",
    "aliases": [
      "Parasole",
      "Bubbola maggiore"
    ],
    "status": "edible",
    "source": "https://natura.provincia.cuneo.it/funghi/commestibili/macrolepiota-procera/",
    "description": "Fungo slanciato di radure e margini boschivi, con gambo squamato e anello. La fonte lo classifica commestibile.",
    "caution": "Non estendere la classificazione alle piccole Lepiota o ad altri funghi a forma di parasole.",
    "similar": "Lepiota e Chlorophyllum: comprendono specie tossiche o mortali.",
    "reviewedAt": "2026-09-07"
  },
  {
    "id": "cyanoxantha",
    "latin": "Russula cyanoxantha",
    "name": "Colombina maggiore",
    "aliases": [
      "Colombina viola"
    ],
    "status": "edible",
    "source": "https://natura.provincia.cuneo.it/funghi/commestibili/russula-cyanoxantha/",
    "description": "Russula dei boschi di latifoglie e conifere, descritta con lamelle bianche e flessibili. La colorazione del cappello è variabile.",
    "caution": "Non determinare una Russula dal colore e non assaggiare funghi per riconoscerli.",
    "similar": "Altre Russula, comprese specie non commestibili.",
    "reviewedAt": "2026-09-07"
  },
  {
    "id": "mellea",
    "latin": "Armillaria mellea",
    "name": "Chiodino",
    "aliases": [
      "Chiodini",
      "Famigliole"
    ],
    "status": "conditional",
    "source": "https://natura.provincia.cuneo.it/funghi/commestibili/armillaria-mellea/",
    "description": "Cresce spesso in gruppi su ceppi, radici e alberi. Il gambo porta un anello; la stagione è prevalentemente autunnale.",
    "caution": "La commestibilità è condizionata alla corretta identificazione e preparazione. Può causare intossicazioni; la scheda non fornisce una procedura domestica.",
    "similar": "Hypholoma fasciculare, tossico, e Galerina marginata, mortale.",
    "reviewedAt": "2026-09-07"
  },
  {
    "id": "caesarea",
    "latin": "Amanita caesarea",
    "name": "Ovolo buono",
    "aliases": [
      "Ovulo buono"
    ],
    "status": "edible",
    "source": "https://natura.provincia.cuneo.it/funghi/commestibili/amanita-caesarea/",
    "description": "Amanita ricercata nei boschi caldi di latifoglie. Nella forma sviluppata presenta toni arancio e gialli.",
    "caution": "Lo stadio chiuso può essere confuso con amanite mortali. Non raccogliere o consumare un ovolo basandoti su questa scheda.",
    "similar": "Amanita phalloides e Amanita verna, mortali.",
    "reviewedAt": "2026-09-07"
  },
  {
    "id": "phalloides",
    "latin": "Amanita phalloides",
    "name": "Amanita falloide",
    "aliases": [
      "Tignosa verdognola"
    ],
    "status": "deadly",
    "source": "https://natura.provincia.cuneo.it/funghi/funghi-velenosi-e-non-commestibili/amanita-phalloides/",
    "description": "Amanita presente soprattutto nei boschi di latifoglie, con lamelle chiare, anello e volva. Esistono variazioni cromatiche anche molto chiare.",
    "caution": "VELENOSA MORTALE. Il colore, l’odore e una somiglianza fotografica non escludono il pericolo.",
    "similar": "Amanita caesarea allo stadio chiuso e alcune Russula.",
    "reviewedAt": "2026-09-07"
  },
  {
    "id": "verna",
    "latin": "Amanita verna",
    "name": "Tignosa primaverile",
    "aliases": [
      "Amanita di primavera"
    ],
    "status": "deadly",
    "source": "https://natura.provincia.cuneo.it/funghi/funghi-velenosi-e-non-commestibili/amanita-verna/",
    "description": "Amanita bianca, con lamelle chiare, anello e volva, legata soprattutto a boschi di latifoglie.",
    "caution": "VELENOSA MORTALE. Non confondere i giovani esemplari chiusi con ovoli commestibili.",
    "similar": "Amanita caesarea allo stadio chiuso; altre amanite bianche.",
    "reviewedAt": "2026-09-07"
  },
  {
    "id": "muscaria",
    "latin": "Amanita muscaria",
    "name": "Ovolo malefico",
    "aliases": [
      "Amanita muscaria"
    ],
    "status": "toxic",
    "source": "https://natura.provincia.cuneo.it/funghi/funghi-velenosi-e-non-commestibili/amanita-muscaria/",
    "description": "Amanita appariscente di boschi montani, latifoglie e conifere. Le verruche del cappello possono mancare e i colori variare.",
    "caution": "VELENOSA. Non è adatta al consumo né a preparazioni sperimentali.",
    "similar": "Altre Amanita; l’assenza di verruche non rende sicuro un esemplare.",
    "reviewedAt": "2026-09-07"
  },
  {
    "id": "pantherina",
    "latin": "Amanita pantherina",
    "name": "Tignosa bruna",
    "aliases": [
      "Amanita panterina"
    ],
    "status": "toxic",
    "source": "https://natura.provincia.cuneo.it/funghi/funghi-velenosi-e-non-commestibili/amanita-pantherina/",
    "description": "Amanita con lamelle bianche, gambo chiaro e base bulbosa, descritta con residui del velo sul cappello.",
    "caution": "VELENOSA. La forma dell’anello o un singolo carattere non consentono un’identificazione sicura a un principiante.",
    "similar": "Altre Amanita, comprese specie di aspetto simile.",
    "reviewedAt": "2026-09-07"
  },
  {
    "id": "satanas",
    "latin": "Rubroboletus satanas",
    "name": "Boleto satanico",
    "aliases": [
      "Boletus satanas",
      "Porcino malefico"
    ],
    "status": "toxic",
    "source": "https://natura.provincia.cuneo.it/funghi/funghi-velenosi-e-non-commestibili/boletus-satanas/",
    "description": "Boleto di boschi caldi di latifoglie, con pori che possono diventare rossastri e gambo robusto. Boletus satanas è il nome storico.",
    "caution": "VELENOSO. Non dedurre commestibilità o tossicità dal solo viraggio al blu: non è una regola generale.",
    "similar": "Altri boleti con pori rossi e gambo robusto.",
    "reviewedAt": "2026-09-07"
  },
  {
    "id": "orellanus",
    "latin": "Cortinarius orellanus",
    "name": "Cortinario orellano",
    "aliases": [],
    "status": "deadly",
    "source": "https://natura.provincia.cuneo.it/funghi/funghi-velenosi-e-non-commestibili/cortinarius-orellanus/",
    "description": "Cortinario dei boschi di latifoglie; lamelle e toni rugginosi cambiano con la maturazione.",
    "caution": "VELENOSO MORTALE. I sintomi possono comparire molto tardi: il benessere iniziale non esclude l’intossicazione.",
    "similar": "Numerosi cortinari simili; la valutazione richiede competenza specialistica.",
    "reviewedAt": "2026-09-07"
  },
  {
    "id": "esculenta",
    "latin": "Gyromitra esculenta",
    "name": "Falsa spugnola",
    "aliases": [
      "Giromitra"
    ],
    "status": "toxic",
    "source": "https://natura.provincia.cuneo.it/funghi/funghi-velenosi-e-non-commestibili/gyromitra-esculenta/",
    "description": "Specie tipicamente primaverile legata a boschi di conifere e residui legnosi. L’aspetto può ricordare le spugnole.",
    "caution": "TOSSICA E PERICOLOSA. Il termine scientifico esculenta non è una garanzia di commestibilità.",
    "similar": "Morchella e altre specie chiamate spugnole.",
    "reviewedAt": "2026-09-07"
  },
  {
    "id": "fasciculare",
    "latin": "Hypholoma fasciculare",
    "name": "Falso chiodino",
    "aliases": [
      "Falsi chiodini",
      "Falsa famigliola"
    ],
    "status": "toxic",
    "source": "https://natura.provincia.cuneo.it/funghi/funghi-velenosi-e-non-commestibili/hypholoma-fasciculare/",
    "description": "Fungo che cresce in gruppi sul legno; le lamelle cambiano dal giallastro a tonalità più scure.",
    "caution": "VELENOSO. La crescita in cespi non identifica i chiodini commestibili.",
    "similar": "Armillaria mellea e altri funghi lignicoli.",
    "reviewedAt": "2026-09-07"
  },
  {
    "id": "involutus",
    "latin": "Paxillus involutus",
    "name": "Paxillo involuto",
    "aliases": [
      "Carcateppa"
    ],
    "status": "deadly",
    "source": "https://natura.provincia.cuneo.it/funghi/funghi-velenosi-e-non-commestibili/paxillus-involutus/",
    "description": "Fungo con margine del cappello involuto e lamelle decorrenti che possono macchiarsi di bruno.",
    "caution": "TOSSICO, POTENZIALMENTE MORTALE. Non affidarsi a tradizioni di consumo o precedenti assaggi senza conseguenze.",
    "similar": "Altri funghi a lamelle decorrenti.",
    "reviewedAt": "2026-09-07"
  },
  {
    "id": "emetica",
    "latin": "Russula emetica",
    "name": "Colombina rossa",
    "aliases": [],
    "status": "toxic",
    "source": "https://natura.provincia.cuneo.it/funghi/funghi-velenosi-e-non-commestibili/russula-emetica/",
    "description": "Russula con gambo e lamelle chiari, cappello spesso rosso e carne fragile.",
    "caution": "NON COMMESTIBILE, TOSSICA. Il colore rosso non è una chiave per classificare tutte le Russula. Non assaggiare.",
    "similar": "Altre Russula rosse.",
    "reviewedAt": "2026-09-07"
  },
  {
    "id": "citrinum",
    "latin": "Scleroderma citrinum",
    "name": "Scleroderma",
    "aliases": [
      "Falsa vescia"
    ],
    "status": "inedible",
    "source": "https://natura.provincia.cuneo.it/funghi/funghi-velenosi-e-non-commestibili/scleroderma-citrinum/",
    "description": "Corpo fruttifero tondeggiante con superficie spessa e scagliosa, presente in gruppi nei boschi.",
    "caution": "NON COMMESTIBILE; può provocare disturbi gastrointestinali. La forma a palla non prova che sia una vescia commestibile.",
    "similar": "Altri funghi globosi.",
    "reviewedAt": "2026-09-07"
  },
  {
    "id": "sinuatum",
    "latin": "Entoloma sinuatum",
    "name": "Entoloma livido",
    "aliases": [
      "Entoloma lividum"
    ],
    "status": "toxic",
    "source": "https://natura.provincia.cuneo.it/funghi/funghi-velenosi-e-non-commestibili/entoloma-sinuatum/",
    "description": "Entoloma a lamelle, trattato dalla fonte provinciale fra i funghi velenosi.",
    "caution": "VELENOSO. Le somiglianze con altri funghi chiari rendono inadeguato il solo confronto fotografico.",
    "similar": "Funghi chiari a lamelle, inclusi alcuni commestibili.",
    "reviewedAt": "2026-09-07"
  },
  {
    "id": "xanthodermus",
    "latin": "Agaricus xanthodermus",
    "name": "Prataiolo velenoso",
    "aliases": [],
    "status": "toxic",
    "source": "https://natura.provincia.cuneo.it/funghi/funghi-velenosi-e-non-commestibili/agaricus-xanthodermus/",
    "description": "Agaricus incluso fra i funghi velenosi, simile a specie comunemente chiamate prataioli.",
    "caution": "VELENOSO. Il nome prataiolo e il luogo di crescita non garantiscono commestibilità.",
    "similar": "Agaricus campestris e altri Agaricus.",
    "reviewedAt": "2026-09-07"
  },
  {
    "id": "campestris",
    "latin": "Agaricus campestris",
    "name": "Prataiolo",
    "aliases": [
      "Prataiolo comune"
    ],
    "status": "edible",
    "source": "https://natura.provincia.cuneo.it/funghi/commestibili/agaricus-campestris/",
    "description": "Specie tipica di ambienti erbosi e pascoli, inclusa nel catalogo per confronto con funghi incontrati ai margini del bosco.",
    "caution": "Non tutti i prataioli sono commestibili. Verificare l’esemplare intero con un esperto.",
    "similar": "Agaricus xanthodermus e amanite bianche.",
    "reviewedAt": "2026-09-07"
  }
];
