// Code.gs — da incollare nell'editor Apps Script del tuo foglio Google

const SHEET_NAME = 'Spese';
const CATEGORIE = ['Cibo', 'Trasporti', 'Casa', 'Salute', 'Svago', 'Altro'];

function doGet() {
  return HtmlService.createHtmlOutputFromFile('Index')
    .setTitle('Le mie spese')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

function getSheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow(['Data', 'Descrizione', 'Importo', 'Categoria']);
    sheet.setFrozenRows(1);
  }
  // Compatibilità con il foglio della versione precedente
  if (!sheet.getRange('D1').getValue()) sheet.getRange('D1').setValue('Categoria');
  sheet.getRange('A1:D1').setFontWeight('bold');
  return sheet;
}

function aggiungiSpesa(descrizione, importo, categoria) {
  const cat = CATEGORIE.indexOf(categoria) >= 0 ? categoria : 'Altro';
  // Descrizione opzionale: se vuota usa il nome della categoria
  const desc = String(descrizione || '').trim() || cat;
  const valore = Number(importo);
  
  if (!isFinite(valore) || valore <= 0) throw new Error('Inserisci un importo valido.');

  const sheet = getSheet_();
  sheet.appendRow([new Date(), desc, valore, cat]);
  const riga = sheet.getLastRow();
  sheet.getRange(riga, 1).setNumberFormat('dd/MM/yyyy HH:mm');
  sheet.getRange(riga, 3).setNumberFormat('#,##0.00 [$€-410]');
  return { ok: true };
}

// Restituisce tutte le spese: il riepilogo mensile viene calcolato nella pagina
function leggiSpese() {
  const sheet = getSheet_();
  const ultima = sheet.getLastRow();
  const righe = ultima < 2 ? [] : sheet.getRange(2, 1, ultima - 1, 4).getValues()
    .map((r, i) => {
      let rawDate = r[0];
      let ts = 0;
      if (rawDate instanceof Date) {
        ts = rawDate.getTime();
      } else if (typeof rawDate === 'string') {
        const parti = rawDate.match(/(\d{2})\/(\d{2})\/(\d{4}) (\d{2}):(\d{2})/);
        if (parti) {
          ts = new Date(parti[3], parti[2] - 1, parti[1], parti[4], parti[5]).getTime();
        } else {
          ts = new Date(rawDate).getTime();
        }
      }
      return {
        riga: i + 2,
        ts: ts,
        descrizione: r[1],
        importo: Number(r[2]),
        categoria: r[3] || 'Altro'
      };
    });
  return { righe, categorie: CATEGORIE };
}

// Elimina una riga, solo se corrisponde ancora alla spesa che l'utente ha visto
function eliminaSpesa(riga, ts) {
  const sheet = getSheet_();
  if (riga < 2 || riga > sheet.getLastRow()) throw new Error('Spesa non trovata. Ricarica la pagina.');
  const attuale = new Date(sheet.getRange(riga, 1).getValue()).getTime();
  if (attuale !== ts) throw new Error('Il foglio è cambiato. Ricarica la pagina.');
  sheet.deleteRow(riga);
  return { ok: true };
}
