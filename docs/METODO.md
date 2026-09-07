# Metodo e ricerca — Mushapp 0.1
Data della ricognizione: **7 settembre 2026**. Territori: provincia di Trento ed Emilia-Romagna. Le informazioni normative sono un punto di partenza, da ricontrollare presso l'ente competente per l'uscita.

## Che cosa possiamo stimare
La domanda “dove troverò più porcini?” comprende tre problemi diversi:
1. **Habitat compatibile**: alberi ospiti, suolo, quota e microclima.
2. **Condizioni di fruttificazione**: acqua disponibile, temperature, andamento delle settimane precedenti.
3. **Possibilità di ritrovamento**: presenza effettiva, sforzo di ricerca, accessibilità, altri raccoglitori e capacità di osservazione.

La prima versione confronta soltanto segnali del secondo punto, preceduti da un filtro indicativo per stagione e habitat. Non misura il micelio, la presenza dei carpofori o la resa in kg. Un'area prima nell'elenco non è un luogo di raccolta accertato.

## Risultati della ricerca
**Non c'è una regola universale dei dieci giorni dopo la pioggia.** La fruttificazione risponde a interazioni fra acqua, temperatura e condizioni precedenti. Studi in bosco mostrano relazioni con finestre e ritardi diversi, spesso aggregati mensili: non giustificano un conto alla rovescia identico per ogni versante. [Karavani et al., 2018](https://www.sciencedirect.com/science/article/pii/S0168192317303441).

Le risposte possono cambiare tra popolamenti e specie. La ricerca nei boschi italiani supporta l'attenzione al contesto forestale e alle interazioni meteorologiche. [Salerni et al., Italian Mycology, 2023](https://italianmycology.unibo.it/article/view/16464), [Salerni e Perini, 2004](https://www.sciencedirect.com/science/article/pii/S0378112704005213).

La presenza o attività del micelio non equivale alla comparsa di corpi fruttiferi: vanno trattati come fenomeni distinti. [Frontiers in Soil Science, 2023](https://www.frontiersin.org/journals/soil-science/articles/10.3389/fsoil.2023.1159793/full).

### Parametri da considerare
| Parametro | Perché conta | Stato nella v0.1 |
|---|---|---|
| Specie e alberi ospiti | I porcini sono ectomicorrizici; gli habitat non sono intercambiabili | Profili delle quattro specie; habitat editoriali delle aree, non verificati per particella |
| Pioggia e distribuzione | Un singolo temporale non descrive la disponibilità d'acqua delle settimane successive | Cumulata liquida 7/14/28 giorni e giorni con pioggia |
| Siccità antecedente | La ripresa dopo un lungo periodo asciutto può essere diversa | Massima sequenza con meno di 1 mm/giorno in 28 giorni, proxy sperimentale |
| Umidità del suolo | Più vicina alla disponibilità d'acqua del terreno rispetto alla sola umidità dell'aria | Modello a 9–27 cm, andamento recente; nessun sensore nel bosco |
| Temperatura aria/suolo | Governa stagionalità e risposta al contesto idrico | Media aria su 7 giorni; suolo a 18 cm come informazione |
| Bilancio idrico | Pioggia senza considerare essiccamento può essere ingannevole | Pioggia − ET₀ su 14 giorni; ET₀ non è evapotraspirazione reale del bosco |
| Vento, radiazione, umidità aria | Influenzano essiccamento e comfort; variabili correlate | Vento del giorno visibile; altri effetti solo indiretti nel proxy ET₀ |
| Quota, esposizione, pendenza | Cambiano calore, neve, drenaggio e irraggiamento | Quote indicative; esposizione e pendenza non integrate |
| Suolo e lettiera | Tessitura, pH, profondità e drenaggio influenzano l'acqua | Non integrati; non inferiti dal valore assoluto di umidità |
| Gelo e neve | Possono rendere il periodo poco favorevole | Minima prevista e neve al suolo modellata |
| Stato del bosco | Gestione, disturbi e ospiti vivi possono cambiare il sito | Non integrato |
| Ritrovamenti e sforzo | Servono alla verifica dell'ipotesi, inclusi gli zeri | Diario privato; nessuna raccolta centralizzata o calibrazione |

La temperatura del suolo non aggiunge un secondo punteggio a quella dell'aria, per evitare di contare due volte segnali correlati. Mancano comunque molte variabili decisive: l'affidabilità resta limitata.

### Porcini e calendario
I quattro nomi non sono sinonimi:
- **Boletus edulis**: latifoglie e conifere; spesso rappresentativo a fine estate/autunno, con possibilità estive.
- **B. reticulatus**, anche B. aestivalis: più legato a periodi caldi, soprattutto latifoglie.
- **B. aereus**: termofilo, in particolare quercia e castagno.
- **B. pinophilus**: anche faggio e abete; il nome non limita l'ospite al pino.

Fonte territoriale per i profili: [Consorzio Fungo di Borgotaro IGP](https://www.fungodiborgotaro.com/ita/29/fungo-porcino-igp/post.php?idforum=880118). Gli intervalli mensili in data.js sono sintesi editoriali ampie, non calendari validati separatamente per Trentino ed Emilia-Romagna.

Il catalogo comprende inoltre gallinacci, trombette e marzuolo. Il calendario non consiglia un esemplare da mangiare. In gennaio non forza alcuna specie. Per queste tre voci non viene calcolato l'indice dei porcini. Fonti di orientamento: [Cantharellus, Parco dei Monti Lucretili](https://parcolucretili.it/cantharellus-cibarius-fungo-commestibile/), [Craterellus, Funghi Italiani](https://enciclopedia.funghiitaliani.it/termine.php?show=3023), [Hygrophorus marzuolus, Funghi Italiani](https://enciclopedia.funghiitaliani.it/termine.php?show=3043).

## Dati e geografia implementati
L'app interroga [Open-Meteo Forecast API](https://open-meteo.com/en/docs) con:
- sei coppie di coordinate indicative, timezone Europe/Rome;
- 35 giorni passati e 8 giorni futuri;
- rain_sum + showers_sum per la pioggia liquida, temperature medie/minime/massime, ET₀, vento;
- variabili orarie di umidità del suolo a 9–27 cm, temperatura a 18 cm e neve al suolo.

**Anche i giorni passati sono dati modellistici archiviati**, non pioggia misurata da pluviometri. Best Match può combinare modelli; risoluzione e quota di griglia non corrispondono al singolo bosco. Una quota modellata rappresenta il punto, non l'intera fascia altimetrica dell'area.

Il codice verifica le unità, conserva null e richiede almeno 18 valori orari validi per aggregare un giorno di suolo. Un errore in una zona non cancella quelle valide. Nessun meteo inventato viene usato come fallback.

La cache nel browser è riusabile automaticamente per 30 minuti, nello stesso giorno italiano. In caso di errore una copia precedente è esplicitamente datata; dopo 6 ore l'indice viene sospeso. L'aggiornamento torna disponibile con un pulsante. Quando l'app torna visibile ricontrolla data e anzianità. Il service worker conserva soltanto la shell; non scarica mappe offline.

Le aree sono **Lagorai–Valsugana, Val di Fiemme, Val di Sole, Val Taro, Alta Val Parma e Appennino romagnolo**. Coordinate, fasce di quota e habitat sono rappresentativi e non costituiscono un inventario forestale o un confine amministrativo verificato. Le mappe OSM non sono una mappa del diritto di raccolta.

## Regola sperimentale, versione 0.1.0
Le seguenti soglie sono **ipotesi di prodotto da testare**, non valori biologici certificati dagli studi citati.

Per il giorno D si usano finestre che terminano a D−1. Se D è futuro, parte della finestra contiene previsioni. L'interfaccia lo dichiara. Non vengono inclusi D o giorni successivi nelle cumulate antecedenti.

1. Senza 28 giorni completi di pioggia, 7 di temperatura e 14 di ET₀: non valutabile.
2. Per specie prive di modello: solo calendario.
3. Fuori finestra mensile, senza ospite indicativo coerente, con minima del giorno ≤0 °C o neve >0,01 m: nessun segnale favorevole.
4. Pioggia 14 giorni ≥20 mm e almeno tre giorni ≥2 mm: +2; altrimenti ≥10 mm: +1.
5. Pioggia meno ET₀ su 14 giorni ≥−5 mm: +1.
6. Aria media 7 giorni nel campo esplorativo della specie: +1. Campi: edulis 9–19 °C; reticulatus 14–24; aereus 16–25; pinophilus 8–18.
7. Differenza dell'umidità media tra gli ultimi tre giorni e i primi tre della finestra di sette giorni ≥−0,01 m³/m³: +1.
8. Sequenza di almeno 14 giorni con pioggia <1 mm: −1.
9. Suolo incompleto o dati del giorno incompleti: massimo 3 punti e affidabilità molto limitata.
10. Totale ≥4: segnali favorevoli; 2–3: contrastanti; inferiore: deboli. A partire dal quarto giorno futuro l'affidabilità diventa molto limitata.

Il numero interno serve soltanto all'ordinamento e alle classi; **non viene trasformato in una percentuale**. Non è corretto dire “80% di probabilità di porcini” sulla base di questo metodo. Per i pari merito l'ordine è alfabetico, senza aggiungere precisione apparente.

## Normativa e sicurezza nel prodotto
- Trentino: il limite generale è passato da 2 a 3 kg dal 2 agosto 2025. Alcune pagine meno aggiornate riportano ancora 2 kg. [Comunicazione ufficiale Provincia](https://www.ufficiostampa.provincia.tn.it/layout/set/print/Comunicati/Raccolta-funghi-il-limite-giornaliero-passa-da-2-a-3-chili-a-persona). [Informazioni territoriali e permessi](https://www.visittrentino.info/it/articoli/speciale-autunno/andar-per-funghi).
- Emilia-Romagna: quadro generale 3 kg, martedì/giovedì/sabato/domenica e tesserino territoriale; esistono deroghe, regole su orari, dimensioni, residenti e aree specifiche. [Regione Emilia-Romagna](https://ambiente.regione.emilia-romagna.it/it/parchi-natura2000/sistema-regionale/funghi-sottobosco-tartufi/le-regole-per-la-raccolta-dei-funghi).
- Per le aree protette bisogna leggere il regolamento specifico: [Parco Foreste Casentinesi](https://www.parcoforestecasentinesi.it/it/vivi-il-parco/attivita/raccolta-funghi).

Lo stato della legalità resta **Da verificare**, anche quando la giornata rientra nel calendario generale. Residenza, permesso e confini non vengono determinati automaticamente.

L'app non offre riconoscimento fotografico o verdetti di commestibilità. Integra un rimando al [controllo micologico delle aziende sanitarie](https://www.ausl.fe.it/ausl-comunica/notizie/funghi-sicurezza-prima-di-tutto-da-30-anni-al-servizio-dei-cittadini-gli-ispettorati-micologici-dellemilia-romagna).

## Come migliorare la previsione
1. Integrare osservazioni e qualità dei dati [Meteotrentino](https://dati.meteotrentino.it/) e [ARPAE ERG5](https://dati.arpae.it/dataset/erg5-interpolazione-su-griglia-di-dati-meteo), senza chiamare osservato ciò che è interpolato o modellato. Valutare copertura, ritardo, autorizzazioni e costi.
2. Usare [carte forestali regionali](https://ambiente.regione.emilia-romagna.it/it/parchi-natura2000/foreste/quadro-conoscitivo/inventari-e-carte-forestali/le-carte-forestali-in-emilia-romagna) e terreno per veri poligoni boschivi. [Copernicus Forest Type](https://land.copernicus.eu/en/products/high-resolution-layer-forests-and-tree-cover?tab=forest_type) distingue categorie forestali ma non sostituisce un inventario degli ospiti.
3. Raccogliere con consenso uscite positive e negative, durata, numero di cercatori, identificazione esperta e condizioni. Un posto non visitato non è un'assenza. [Guida GBIF ai dati di campionamento](https://docs.gbif.org/guide-publishing-survey-data/en/).
4. Confrontare il sistema con una baseline semplice di stagione e pioggia; separare anni e territori tra training e test. Conservare l'ora di emissione delle previsioni: usare il meteo conosciuto al momento dell'uscita evita informazione futura.
5. Misurare calibrazione, falsi segnali e utilità pratica, poi eventualmente produrre probabilità calibrate con intervalli d'incertezza.

La v0.1 non include addestramento, monitoraggio in background, account, condivisione di punti precisi, inventari boschivi o percorsi pedonali verificati. Sono sviluppi da realizzare, non funzionalità già presenti.
