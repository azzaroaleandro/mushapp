# Catalogo, province e proposte — v0.2

La v0.2 mantiene tutto il lavoro in azzaroaleandro/mushapp e nei suoi runner remoti GitHub Actions.

## Catalogo
Sono presenti **24 schede curate**, con nome scientifico, nomi comuni/sinonimi, fotografia, autore/licenza, breve descrizione, commestibilità documentata della specie e cautele sulle confusioni. Le descrizioni sono sintesi originali; ogni scheda rimanda alla corrispondente pagina della [Provincia di Cuneo](https://natura.provincia.cuneo.it/funghi/). La selezione include specie commestibili, a commestibilità condizionata, non commestibili, tossiche e potenzialmente mortali.

Le fotografie provengono da Wikimedia Commons, selezionate da pagine del taxon o dalla relativa categoria, con licenza di riuso esplicita e attribuzione conservata in src/catalog-media.js. Sono fotografie di riferimento identificate nella fonte, non immagini generate e non una conferma micologica di un esemplare dell'utente. I link permettono di controllare descrizione originale, autore e licenza. L'immagine viene caricata da Wikimedia; non garantiamo disponibilità offline delle foto.

**Non esiste una scheda fotografica completa e aggiornata per ogni specie fungina conosciuta.** L'app non dichiara tale completezza. Per ampliare la ricerca integra l'indice mondiale del backbone GBIF via Species API, limitando i risultati al regno Fungi, rango SPECIES e stato ACCEPTED. Il backbone ha una propria copertura e data di aggiornamento: anche questa fonte non equivale a tutte le specie conosciute. Nomi comuni italiani, descrizioni e fotografie possono mancare.

Nell'indice mondiale le specie esterne alle schede curate hanno sempre lo stato **Commestibilità non verificata**. Non deduciamo commestibilità dal nome scientifico, dalla tassonomia o dall'immagine. Le schede GBIF esterne sono collegate per approfondire. Un eventuale media GBIF è mostrato solo con autore, licenza Creative Commons adatta e URL HTTPS di un fornitore consentito.

Fonti tecniche: [Species API GBIF](https://techdocs.gbif.org/en/openapi/v1/species), [descrizione della ricerca dei nomi](https://data-blog.gbif.org/post/gbif-species-api/). Le fotografie richiedono internet; la ricerca mondiale ha paginazione, gestione degli errori e annullamento delle richieste superate.

## Commestibilità e uso nel bosco
Il catalogo è didattico. La classificazione riguarda una specie identificata, non il fungo che l'utente tiene in mano. La [raccomandazione del Ministero della Salute](https://www.salute.gov.it/new/it/tema/sistema-di-controllo-della-sicurezza-alimentare/funghi-consumiamoli-sicurezza/) è di fare controllare il raccolto da un micologo, senza affidarsi ad app o giudizi su semplici fotografie.

La v0.2 non contiene riconoscimento automatico da foto, assaggi, ricette di detossificazione o una funzione “posso mangiarlo?”. La commestibilità di una specie non elimina i problemi di identificazione, conservazione, preparazione o tolleranza individuale. Non riproduciamo vecchie affermazioni delle fonti che presentano una specie come impossibile da confondere.

## Province e Campiglio
I filtri comprendono Trento e le nove province dell'Emilia-Romagna. **La copertura effettiva è di 13 aree pilota**, non un inventario completo dei boschi provinciali. Ferrara, Ravenna e Rimini hanno un filtro ma nessuna area pilota in questa versione: l'app mostra uno stato vuoto, senza inventare punti.

Alle sei aree della v0.1 si aggiungono Campiglio–Vallesinella, bassa Val Nambrone, alta Val Rendena–Carisolo, alta Val Nure, Ramiseto, Frassinoro e Lizzano in Belvedere. Sono riferimenti editoriali per aree ampie; coordinate, quote e habitat non sono particelle certificate. La mappa OSM consente di esplorare il territorio ma non include poligoni di raccolta autorizzata o percorsi validati.

All'avvio viene selezionato il Trentino con un raggio indicativo di **40 km in linea d'aria da Madonna di Campiglio**. La distanza non è quella stradale e non è un tempo di viaggio. Scegliendo Emilia-Romagna, il vincolo di vicinanza viene disattivato.

Per Campiglio e Val Rendena la [fonte turistica ufficiale](https://www.campigliodolomiti.it/it/raccolta-funghi/raccolta-funghi-in-zona-campiglio?landing=232) distingue il permesso ordinario dalle condizioni nei settori del Parco Adamello Brenta dei Comuni associati. Riporta requisiti per residenti o soggiorni turistici di almeno cinque giorni consecutivi. Le schede espongono questo vincolo senza presumere residenza, durata del soggiorno o diritto dell'utente alla raccolta.

## Proposte automatiche
L'app confronta oggi e i successivi sette giorni. Per ogni area seleziona il giorno con il miglior punteggio sperimentale, preferendo il più vicino nel tempo a parità di segnali; mostra al massimo sei aree diverse. I filtri regione, provincia e vicinanza vengono rispettati. La data dei filtri continua a governare l'elenco e il dettaglio; le proposte dichiarano esplicitamente il loro intervallo di otto giorni.

Non suggerisce aree senza dati, con dati scaduti, con soli segnali deboli o per specie senza modello. Le giornate normalmente escluse in Emilia-Romagna non entrano fra le proposte, pur lasciando visibili i dati meteo nell'elenco. Lo stato del diritto di raccolta resta sempre **Da verificare**.

Una proposta aggiorna la data selezionata e apre la scheda corretta. Il punteggio rimane quello sperimentale documentato in METODO.md: nessuna percentuale, presenza certa o resa in kg.
