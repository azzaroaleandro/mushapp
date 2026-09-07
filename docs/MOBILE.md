# Interfaccia mobile e confronto per aspetto — v0.4

L'app resta statica, pubblicata su GitHub Pages dal solo repository mushapp. Nessun servizio a pagamento o chiave API per le fotografie.

## Uso nel bosco

Nel Catalogo, **Non conosco il nome** apre un confronto guidato. La fotocamera posteriore viene richiesta tramite input file con capture=environment; il comportamento preciso dipende dal telefono. La galleria è disponibile separatamente. Il caricamento è facoltativo.

La foto resta in un object URL nel browser: non viene caricata su un server, analizzata automaticamente o salvata nel diario. Si perde chiudendo o ricaricando la pagina; può essere rimossa prima. Sono ammessi JPEG, PNG e WebP fino a 15 MiB. Le immagini non decodificabili mostrano un errore.

I pulsanti illustrati filtrano le 80 schede per una forma generale osservata dall'utente: pori, lamelle, pieghe, trombetta, corpo tondeggiante, lobi, aculei, corallo, mensola o alveoli. Si possono scegliere più forme; le corrispondenze si uniscono. Non si assegnano probabilità né si identifica un esemplare. Una sola corrispondenza indica soltanto la copertura limitata del catalogo. Le specie tossiche restano comprese: per esempio il gruppo dei pori include Rubroboletus satanas. Nel confronto guidato il filtro di commestibilità della ricerca per nome non viene applicato.

Aprendo una scheda, la foto personale e quella documentata appaiono affiancate. La commestibilità descritta riguarda la specie della scheda, non il fungo fotografato.

Le forme sono un indice divulgativo ricavato dalle fonti micologiche collegate a ciascuna specie; non costituiscono una chiave micologica. Riferimenti rappresentativi:
- https://natura.provincia.cuneo.it/funghi/commestibili/boletus-edulis/
- https://natura.provincia.cuneo.it/funghi/commestibili/cantharellus-cibarius/
- https://natura.provincia.cuneo.it/funghi/commestibili/craterellus-cornucopioides/
- https://natura.provincia.cuneo.it/funghi/funghi-velenosi-e-non-commestibili/scleroderma-citrinum/
- https://natura.provincia.cuneo.it/funghi/funghi-velenosi-e-non-commestibili/gyromitra-esculenta/
- https://www.salute.gov.it/new/it/tema/sistema-di-controllo-della-sicurezza-alimentare/funghi-consumiamoli-sicurezza/

## Layout

Su schermi fino a 820 px: navigazione inferiore con cinque destinazioni, input da 16 px e comandi da almeno 44 px, introduzione breve, proposte a scorrimento orizzontale, pulsanti Elenco/Mappa. Catalogo in due colonne; descrizioni complete nelle schede, copertura e approfondimenti espandibili. Dialoghi adattati all'altezza disponibile e alle aree sicure del telefono.

Le fotografie di riferimento richiedono internet. Il confronto per forme e la foto personale funzionano senza chiamate di identificazione; la disponibilità offline della struttura e dei testi dipende dal primo caricamento del service worker.
