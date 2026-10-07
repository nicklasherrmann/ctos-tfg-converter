# CTOS · TFG Converter

Statische Web-App zur lokalen Konvertierung einer TFG-Elisch-PDF in die TCM-Excel-Struktur.

## Fachliche Regeln

- `TRN_OPER_CODE = DBCARGO`
- `TRN_DEST_STN = DEOSN`
- `R_D = R`
- `TRN_LENGTH = 700`
- `LINER = TFG`
- `CUSTOMER_ID = TFG`
- `CATEGORY = I`
- `ETA = Listendatum 12:00`
- `B` aus der PDF → `FE = F`
- `L` aus der PDF → `FE = E`
- `CTR_NO = LE-Ze + LE-Nr`
- Führende Nullen der LE-Nr. bleiben erhalten.
- `WAG_SEQ_NO` steigt nur bei einer neuen Wagennummer.
- Nicht benötigte TCM-Felder bleiben leer.

## Nutzung

`index.html` über einen Webserver / Netlify öffnen. Die PDF-Verarbeitung läuft vollständig im Browser.

## Dateien

- `index.html` – Oberfläche
- `styles.css` – Layout
- `app.js` – PDF-Parser + XLSX-Export

## Abhängigkeiten

Werden per CDN geladen:

- PDF.js 3.11.174
- SheetJS 0.18.5
