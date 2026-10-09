# Tracker spese con Google Sheets

Una piccola web app per registrare le spese dal telefono o dal computer. I dati vengono salvati direttamente in un foglio Google, senza server e senza database. Funziona interamente con Google Apps Script.

## Funzionalità

- Inserimento di una spesa con importo, categoria e descrizione
- Salvataggio automatico in un Google Sheet, con data e ora
- Riepilogo mensile con totale e ripartizione per categoria
- Elenco delle spese del mese, con possibilità di eliminarle
- Interfaccia adatta ai dispositivi mobili

## Come funziona

La pagina (`Index.html`) viene servita da Google Apps Script e comunica con lo script (`Code.gs`) tramite `google.script.run`. Lo script legge e scrive nel foglio a cui è collegato, quindi non servono chiavi API né configurazioni CORS.

## Installazione

1. Crea un nuovo Google Sheet.
2. Vai su **Estensioni → Apps Script**.
3. Incolla il contenuto di `Code.gs` nel file `Codice.gs` dell'editor.
4. Aggiungi un file HTML chiamato esattamente `Index` (**+ → HTML**) e incolla il contenuto di `Index.html`.
5. Clicca su **Deploy → Nuova distribuzione → App web**:
   - *Esegui come*: **Me**
   - *Chi ha accesso*: **Solo io** (consigliato)
6. Autorizza i permessi richiesti e apri l'URL generato.

Al primo salvataggio viene creato in automatico il foglio `Spese` con le colonne Data, Descrizione, Importo e Categoria.

## Personalizzazione

Le categorie si modificano nella costante `CATEGORIE` all'inizio di `Code.gs`:

```js
const CATEGORIE = ['Cibo', 'Trasporti', 'Casa', 'Salute', 'Svago', 'Altro'];
```

Dopo ogni modifica al codice, crea una nuova versione della distribuzione (**Deploy → Gestisci distribuzioni → Modifica → Nuova versione**). L'URL resta lo stesso.

## Privacy e sicurezza

- Il codice non contiene credenziali né dati personali.
- La web app scrive nel foglio con i permessi di chi la distribuisce. Se la imposti su "Chiunque", chiunque conosca l'URL può aggiungere o eliminare spese: tienilo riservato oppure usa "Solo io".
- Non pubblicare l'URL della tua distribuzione né il link al tuo foglio.

## Struttura

```
├── Code.gs      # Backend: scrive e legge il foglio
├── Index.html   # Interfaccia utente
└── README.md
```

## Licenza

MIT. Vedi il file `LICENSE`.
