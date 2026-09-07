# Mushapp 🍄
**[Apri Mushapp](https://azzaroaleandro.github.io/mushapp/)** · [Pull request della prima versione](https://github.com/azzaroaleandro/mushapp/pull/1)

Il bosco, al momento giusto. Una web app in italiano per preparare uscite a funghi in **Trentino (provincia di Trento)** ed **Emilia-Romagna**.

## Versione 0.2
Nuovo [catalogo fotografico](https://azzaroaleandro.github.io/mushapp/#catalog) con 24 schede curate e ricerca nell’indice mondiale GBIF; filtri provinciali, 13 aree pilota, Campiglio come riferimento iniziale e proposte automatiche per i prossimi otto giorni. [Dettagli, fonti e limiti della v0.2](docs/CATALOGO.md).

## Funzionalità di base
- Tredici aree pilota, mappa, filtri per territorio, specie, giorno e preferiti.
- Meteo Open-Meteo: 35 giorni antecedenti e 8 giorni di previsione; dati reali del servizio, senza risultati dimostrativi nell'app.
- Confronto sperimentale dei segnali ambientali per quattro specie di porcino, con motivazioni e limiti leggibili.
- Pioggia su 7/14/28 giorni, bilancio pioggia − ET₀, temperature e umidità del suolo modellata, gelo e neve.
- Calendario indicativo anche per gallinacci, trombette e marzuolo; nessun indice di fruttificazione per queste specie.
- Diario privato nel browser: uscite anche a zero, durata, partecipanti, verifica della specie, modifica, eliminazione, importazione ed esportazione JSON.
- Collegamenti a regole territoriali e controllo micologico; nessuna autorizzazione implicita alla raccolta.
- Interfaccia responsive e shell offline con manifest. Mappe e nuovi dati meteo richiedono la rete; l'installazione dipende dal browser.

**Non è un modello validato di presenza o resa.** Le aree, i loro habitat e le quote sono indicativi. L'app non identifica funghi né ne certifica la commestibilità. Per il metodo e la ricerca: [METODO.md](docs/METODO.md).

## Repository e lavoro remoto
Tutto il codice e le verifiche del progetto appartengono esclusivamente a questo repository. La prima implementazione è stata scritta attraverso le API GitHub, senza clonare il progetto o eseguirlo sul computer dell'utente. Le verifiche vengono eseguite nei runner remoti di **GitHub Actions**.

Non servono chiavi API per il prototipo personale: rispettare [termini e limiti di Open-Meteo](https://open-meteo.com/en/terms) e [politica tile OpenStreetMap](https://operations.osmfoundation.org/policies/tiles/). Per uso commerciale o molti utenti servirà un accordo/servizio adatto e un backend di cache.

## Verifiche remote
Il workflow **Verify Mushapp** esegue:
1. Test Node del motore, dell'adattatore meteo e del diario.
2. Test Chromium di navigazione, filtri, diario, import/export, errori, dati scaduti e layout desktop/mobile.
3. Produzione degli artifact **mushapp-site** (app statica) e **browser-report**.

I test del browser usano meteo sintetico dichiarato nelle fixture, esclusivamente nei test. Non dimostrano l'accuratezza micologica del modello. Le immagini nei log sono schermate di verifica con quei dati.

## Pubblicazione
L'anteprima è pubblicata su **https://azzaroaleandro.github.io/mushapp/** tramite GitHub Pages, dal branch **codex/mushapp-v1**, cartella **/ (root)**. Il branch principale conserva il punto di partenza, mentre la [PR #1](https://github.com/azzaroaleandro/mushapp/pull/1) raccoglie il lavoro da revisionare.

GitHub Pages aggiorna l'anteprima quando cambia il branch sorgente. I file sono compatibili con il sottopercorso /mushapp/. Non ci sono backend o segreti nel sito. Dopo l'integrazione della PR si potrà spostare la sorgente Pages su main.

Il workflow manuale **Publish GitHub Pages** resta disponibile come alternativa per passare in futuro alla sorgente **GitHub Actions**: richiede che il workflow sia presente nel branch principale e che Settings → Pages sia configurato con tale sorgente. Non va usato insieme alla modalità corrente da branch.

## Verifica della prima versione
Il 7 settembre 2026 sono passati **22 test del motore, dati e diario**, **7 test Chromium**, oltre alla verifica del servizio meteo reale su tutte le sei aree (43 giorni per area). [Esecuzione verificata](https://github.com/azzaroaleandro/mushapp/actions/runs/34111205177).

L'anteprima pubblicata è stata aperta e controllata anche nel browser con il servizio Open-Meteo effettivo e le mappe OpenStreetMap. Queste verifiche dimostrano il funzionamento tecnico del prototipo, non l'accuratezza biologica delle stime.

## Struttura
- src/data.js: aree, specie e fonti.
- src/engine.js: regole sperimentali trasparenti.
- src/weather.js: API, unità, normalizzazione e validità della cache.
- src/storage.js: diario e validazione.
- src/app.js, index.html, styles.css: interfaccia.
- sw.js: sola shell offline; non memorizza tile o risposte meteo.
- tests/: test automatici e fixture.
- docs/METODO.md: evidenza, ipotesi e sviluppi necessari.

Il diario resta nel dispositivo e nel browser in uso. Non esistono ancora account, condivisione automatica tra amici, salvataggi cloud o sincronizzazione. Il codice pubblico non contiene diari o coordinate personali.
