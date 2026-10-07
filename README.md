# CTOS · TFG Converter

Browser-Tool zur Konvertierung einer TFG-Elisch-PDF in die CTOS-TCM-Excelstruktur.

## Regeln
- TRN_OPER_CODE = DBCARGO
- TRN_DEST_STN = DEOSN
- R_D = R
- TRN_LENGTH = 700
- LINER = TFG
- CUSTOMER_ID = TFG
- CATEGORY = I
- ETA = Listendatum, 12:00 Uhr
- PDF B → FE F
- PDF L → FE E
- CTR_NO = LE-Ze + LE-Nr
- Führende Nullen der LE-Nr. bleiben erhalten
- WAG_SEQ_NO erhöht sich nur bei einer neuen Wagennummer

Die PDF-Verarbeitung findet lokal im Browser statt.