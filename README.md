# NEXORA – CTOS Import & Export Platform

Statische Webanwendung zur **lokalen** Verarbeitung der TFG-, HWL-, MEDLOG- und CTOS-Dateiformate.
Der bestehende Converter ist erhalten geblieben. Neu hinzugekommen ist der **TFG Train Planner (Beta)**.

## Train Planner – Version 1

Unter **TFG → Train Planner** werden die folgenden Dateien verarbeitet:

1. **MITVEAN-/MITSVKI-Wagenliste als PDF – erforderlich.** Liefert Wagennummern, Achszahl, LüP und Reihenfolge.
2. **TFG-Ladeliste als XLSX – erforderlich.** Verwendet das Blatt `Export`; `Direkttruck` bleibt ausdrücklich außen vor. Benötigt Containernummer, Ankunftsladestelle, 20'/40'-Länge und Bruttogewicht.
3. **Yard-Abzug als XLSX – optional.** Erwartet `Container No` und `Location` bzw. `Current Location`; zum Beispiel `K 30 C 4`. Ohne standortbezogenen Treffer wird `COMMUNITY` angezeigt.

Nach der ersten Berechnung lässt sich die Yard-Datei hinzufügen oder entfernen, **ohne Wagen- und Ladeliste erneut auswählen zu müssen**. Beim Ergänzen wird der Entwurf automatisch neu berechnet.

### Bisherige Regeln

- **Zielbahnhofreinheit:** Nie verschiedene Zielterminals auf demselben Wagen.
- **Mittige Einzelbeladung (schematisch):** 2-achsiger 40'-Wagen mit einzelnem 20'-Container; 4-achsiger 60'-Wagen mit einzelnem 20'- oder 40'-Container.
- **Standortnähe:** Wenn Yardpositionen bekannt sind, werden näher gelegene geeignete Wagen bevorzugt. Keine Optimierung auf eine gleichmäßige Kranarbeitsverteilung.
- **Positionierung am Zug:** Der letzte Wagen endet ungefähr bei Yardposition 100. Für die schematische Skala werden 700 Meter gleich 99 Yardpositionen angenommen.
- **Ungeklärte Daten:** Ungültige Gewichte, unbekannte Ziele, doppelte Nummern oder nicht unterstützte Containergrößen werden zur Nachprüfung ausgelistet.

Die Übersicht zeigt für jeden Container Zielterminal, Containernummer, Yardposition/`COMMUNITY` und Gewicht. Je Wagen zeigt sie Nummer, Achszahl, angenommene 40-/60-/80-Fuß-Kapazität, ungefähre Gleisposition und Summe des **Container-Bruttogewichts**. Ein Export als CSV ist möglich und ausdrücklich `PRÜFENTWURF` gekennzeichnet.

**WICHTIG: Keine Verladefreigabe!** Wagenkapazitäten sind vorläufige Größenklassen aus Achsen und LüP. Tatsächliche Ladepositionen, Verriegelungskombinationen, Lastgrenzentafeln, Achs-/Drehgestellbelastungen, Gefahrgut und sonstige betriebliche Anforderungen werden **nicht technisch verifiziert**. Ein erzeugter Entwurf darf nicht ungeprüft für eine reale Verladung verwendet werden.

### Status / nächste Ausbaustufen

- [x] Wagen- und Containerimport, Verteilung und Vorschau
- [x] Zielbahnhofreinheit und mittige Einzelbeladung als Modellregel
- [x] Optionaler Yard-Abzug, nachträgliche Neuoptimierung
- [x] Sichtbare Containerdetails und Wagengewichtssummen
- [x] CSV-Prüfentwurf
- [ ] Wagenbaureihen-spezifische Lade- und Lastgrenzendatenbank
- [ ] Technisch genehmigte Verriegelungspositionen und Lastverteilung
- [ ] Interaktive manuelle Umplanung / Drag-and-drop
- [ ] Kalibrierte Entfernungsmatrix, Umstapelungs- und Kranablaufmodell
- [ ] Erstellung einer verbindlichen Ladeanweisung nach betrieblicher Freigabe

## Installation / Betrieb

Inhalt des Archivs auf einen statischen Webserver oder Netlify legen. `index.html` öffnen. Es ist kein Backend erforderlich. Die bestehenden externen Script-Bibliotheken PDF.js 3.11.174 und SheetJS 0.18.5 werden wie bisher über CDN geladen. Bei normalem Betrieb sind daher diese CDNs erreichbar zu halten.

## Entwickler / Test

- `app.js`: bestehende Parser und Converter; zusätzlicher TFG-Planermodus und Wiederverwendung der Parser
- `planner-engine.js`: reine Allokationslogik ohne Browserabhängigkeiten
- `planner.js`: Upload, Import Yard, Darstellung, CSV
- `planner.css`: Planner-Layout
- `tests/planner-engine.test.js`: künstliche Testfälle, ausführbar mit `node tests/planner-engine.test.js`

Die vom Nutzer bereitgestellten Beispiel-, Zug- und Yarddateien sind **nicht** im Archiv enthalten.


## A4-Steckübersicht (v3)

Im TFG Train Planner ist nach einer berechneten Verplanung der Button
**„Steckübersicht drucken · DIN A4“** verfügbar. Das Browser-Druckfenster
zeigt den gesamten Zug auf **einer A4-Seite im Querformat**, auf mehrere
Lesereihen verteilt, in unveränderter Wagenreihenfolge. Pro Wagen werden
Wagennummer, Zielbahnhof sowie schematische Containerlängen (20'/40')
und bei mittiger Einzelbeladung „MITTIG“ ausgegeben. Rote Container sind
Standard; leere HAPAG-LLOYD-Container grün. Die Seite kann direkt gedruckt
oder über „Als PDF speichern“ archiviert werden. Die Darstellung ist ein
**prüfpflichtiger Entwurf und keine Verladefreigabe**; zugelassene
Verriegelungspositionen und Lastgrenzen müssen extern geprüft werden.


## v4 Ergänzung
- In der horizontalen Zugansicht steht unter der 20'/40'-Angabe nun in kleiner Schrift die vollständige Containernummer.
- In der A4-Steckübersicht wird die Containernummer ebenfalls unter der Größenangabe innerhalb des Containers dargestellt.


## v5 – 20-Fuß-Kennzeichnung
- Containerkennzeichen von 20-Fuß-Einheiten werden in der Zugansicht und im A4-Ausdruck auf zwei Zeilen umgebrochen (z. B. HLBU / 1234567).
- 40-Fuß-Einheiten behalten ihre Containernummer in einer Zeile.
- Die Darstellung ändert weder die eingelesene Containernummer noch Planung, Datenabgleich oder Export.


## v6: Betriebsprioritäten und Zugorientierung
- Vollcontainer werden **vor Leercontainern** verplant. Erst danach werden leere Container in freie Restplätze derselben Zielrelation bzw. auf noch freie Wagen gelegt. Dadurch können Leereinheiten Vollcontainer nicht verdrängen.
- Über **„Wagenreihung drehen“** wird die eingelesene MITVEAN-Wagenfolge bei Bedarf umgekehrt. Die Wagen behalten ihre Wagennummern und Laufnummern. Gleis-/Yardpositionen und die Optimierung werden aus der umgekehrten tatsächlichen Reihenfolge **neu berechnet**, ohne die Dateien erneut hochzuladen.
- Die A4-Steckübersicht folgt ebenfalls der tatsächlichen eingestellten Wagenreihenfolge.
- Unverändert: keine technische Verladefreigabe; Lastgrenzen und Verriegelungspositionen müssen extern geprüft werden.

## v7 – fortlaufende Wagenanzeige
Die linke Seite der Zugansicht und die A4-Steckübersicht beginnen auch bei gedrehter Reihung stets mit „WAGEN 1“. Die folgende Wagenzahl entspricht der Position in der tatsächlich dargestellten physischen Reihung, nicht der ursprünglichen MITVEAN-Laufnummer. Wagenidentität/Wagennummer, tatsächliche Richtung und Yard-Optimierung bleiben unverändert. Auch die CSV-Spalte `WAGENFOLGE` zeigt diese fortlaufende Position.


## v8 – TFG-Ausgang: MAE/HAP-Sonderzuordnung
Die Felder `CATEGORY`, `LINER`, `CUSTOMER_ID` werden nur für den TFG-Export
anhand von Leerstatus, Reeder, Auftraggeber und **tatsächlicher Turn-Out-Referenz**
bestimmt. Die Beispielregeln aus dem Export vom 02.11.2026:

- Leere Maersk-Container mit Auftraggeber Maersk Deutschland und erkannter Turn-Out-Referenz (`R` + 8 Ziffern / 8 Ziffern): `D / MAE / MAE`.
- Leere HAPAG-LLOYD-Container mit Auftraggeber HAPAG-LLOYD und erkannter Turn-Out-Referenz: `D / HAP / TFG`.
- Alle übrigen: `E / TFG / TFG`. Somit bleibt z. B. `MRSU0064125` mit
  der Freitextangabe „fuer Maersk“ bei `E / TFG / TFG`.
- Die Zeichenfolge `27` wird wie in der vorliegenden Referenz als leere
  `RELEASE_ORDER` ausgegeben. Andere Werte (einschließlich „fuer Maersk“)
  werden beibehalten.
- Die Bedingungen sind auf das vorliegende Referenzformat abgestimmt. Bei
  bislang unbekannten Turn-Out-Formaten muss die Zuordnung geprüft werden.
- Drei im Referenzexport belegte `BILL_OF_LADING`-Endungen (`-/-E0-/-LEER` und `-/-E1-/-LEER`) werden entfernt; andere Anhänge bleiben bestehen.
- Die Zuordnung ist in der TFG-Ausgangsvorschau sichtbar.

Die Quelldateien und personenbezogene Daten sind nicht im Repository.
Der TFG-Eingang, andere Converter und der Train Planner bleiben unverändert.

Tests: `node --test tests/tfg-outbound-rules.test.js`.


## v9 – Gefahrgut, Yard-C/D und COMMUNITY-Priorisierung
- Gefahrgut in der TFG-Ausgangsladeliste aus der optionalen Spalte `Gefahrgut` bzw. einer `UN-Nummer` erkennen. Sobald ein Gefahrguthinweis vorliegt, darf **maximal ein** Gefahrgutcontainer auf einem Wagen stehen. Ein Nicht-Gefahrgutcontainer desselben Zielterminals darf die Restkapazität nutzen. Das gilt auch nach lokalen Tauschen/Neuoptimierung und bei gedrehter Wagenreihung. Gefährliche Kennzeichnungen ohne klare UN-Nummer erzeugen einen Prüfhilfe-Hinweis und werden vorsorglich als Gefahrgut behandelt.
- Im Yard-Abzug bedeutet ein alleinstehendes `C` die angenäherte Gleisposition **15**, `D` die angenäherte Gleisposition **75**. Das gilt **für alle Container, auch Reefer**. Detaillierte numerische Yardpositionen bleiben unverändert.
- `COMMUNITY` ohne konkrete Yardposition: Wagenmittelpunkt **bevorzugt 12–95** (weiche Optimierung mit Ausnahmen; Container werden nicht allein deshalb abgewiesen). Eventuelle Ausnahmebelegungen werden angezeigt.
- CSV-Prüfexport: zusätzliche Spalten `GEFAHRGUT` und `UN_NUMMER`; die grafische und A4-Darstellung markiert UN-Einheiten.
- Unverändert: Vollcontainer vor Leercontainern, Zielbahnhofreinheit, mittige Einzelladung, Reihungsumkehrung, Wagenzählung 1…, A4 Querformat.
- Weiterhin **nur prüfpflichtiger Entwurf**; RID, Ladungssicherung, Sperr-/Trennvorschriften und tatsächliche Wagenspezifikationen werden nicht technisch geprüft.


## v10 – 2-Achser: maximal 20 t Container-Bruttogewicht
- **Verbindliche betriebliche Sicherheitsgrenze:** Auf Wagen mit **2 Achsen** darf die **Summe der Bruttogewichte aller verladenen Container höchstens 20.000 kg** betragen (Wagen-Eigengewicht ist nicht Bestandteil dieser Ladungssumme).
- Die Gewichtsbeschränkung gilt für jede Belegungsphase: Vollcontainer, Leercontainer auf Restplätzen, erneute Optimierung und Vertauschung von ganzen Belegungen oder einzelnen Containern.
- Bei 2-Achsern werden auch weiter entfernte, leichtere Containerkombinationen berücksichtigt; ist ein Container für 2-Achser zu schwer, wird ein geeigneter 4-/6-Achser bevorzugt, soweit die bestehenden Regeln das zulassen.
- In der Zugansicht werden bei 2-Achsern **max. 20 t** und **max. 20.000 kg** kenntlich gemacht. Die A4-Übersicht nennt die Regel ebenfalls; im CSV-Prüfentwurf gibt es die zusätzliche Spalte `MAX_CONTAINERBRUTTO_KG`.
- Für **4- und 6-achsige Wagen** wird hier ausdrücklich **kein** pauschaler Grenzwert erfunden: maßgebliche tatsächliche Lastgrenzen, Achslastverteilung und zugelassene Verriegelungskombinationen sind weiterhin fachlich zu prüfen. Der Entwurf ist keine Verladefreigabe.
- Unverändert: Gefahrgut, Zieltrennung, Vollcontainer-Vorrang, Yard- und COMMUNITY-Priorität, Zugreihungsumkehr, A4-Druck, TFG-Export und andere Converter.


## NEXORA v11 – Hellmann Eingang: Leerwagen und Stellplätze

- Die Regensburg-Zusatzliste erkennt alle Wagen **über die 12-stellige Wagennummer**,
  auch wenn kein Container zugeordnet ist. Physische Wagen bleiben in Quellreihenfolge
  auf den vorbereiteten Plätzen 7–10.
- Vier Zusatzwagen werden richtig als vier Wagen gezählt (mit separater Anzahl Leerwagen);
  die Summen und die Vorschau berücksichtigen unbeladene Wagen.
- Die Lfd.-Nr. der vierergruppierten Quelle bestimmt den Stellplatz. Leere Zwischenplätze
  werden **nicht** zusammengeschoben (1, 3, 4 bleibt 1, 3, 4).
- Null, drei oder vier beladene Stellplätze sind regulär; es gibt keine irreführende Warnung
  für Teilbelegung. Fehlende Wagennummern oder uneindeutige Plätze werden weiter gemeldet.
- Der TCM-Export bleibt bei zehn Wagen und vier Slots je Wagen (40 Zeilen); Leerwagen
  tragen Wagennummer und Platzfolge, aber keine Containerdaten.
- Beispiel 04.11.2026: PDF 6 Wagen / 22 Ladeeinheiten, XLS 4 Wagen / 11 Ladeeinheiten
  (darunter 1 leerer Wagen), zusammen 10 Wagen / 33 Ladeeinheiten.


## v12 – experimentelle TFG-COPARN aus dem Train Planner

Nach erfolgter Wagen-/Containerverplanung bietet der Train Planner den Button **COPARN mit Ladeplan (Test)** neben der A4-Druckfunktion. Die XLSX-Datei verwendet das bestehende, unveraenderte 63-spaltige TFG-COPARN-Layout auf dem Tabellenblatt `COPARN-Export-Example-RBS` und haengt **genau zwei** Testfelder an: `Plan Wagon No` und `Plan Loc`. Die Zeilen folgen der aktuell angezeigten Wagenfolge und der schematischen Position links nach rechts (auch bei umgekehrter Wagenreihung). Vollstaendig verplante Container erhalten ihre echte Wagennummer. Nicht verplante Container bleiben enthalten, haben aber leere Planfelder. **`Plan Loc` enthaelt absichtlich das NEXORA-interne Testformat `NEXORA:10-50FT:MITTIG` oder `NEXORA:0-20FT`**; es ist *kein* bestaetigter TOPX-Code. Der Dateiname enthaelt `TEST` und `NICHT_EINSPIELEN`. Diese Datei darf nicht ohne ausdrueckliche Bestaetigung durch RBS/TOPS in den produktiven Import eingestellt werden. Die eigentlichen NEXORA-Planungs- und TFG-Ausgangsregeln bleiben unveraendert.

## v13 – TOPX-ähnliche Stellplatzcodierung für COPARN-Testexport

- Im Train Planner vor dem **COPARN-Testdownload** eine **reale TOPX-Gleisnummer**
  eingeben (z. B. `411`, `413`). Ohne gültige Gleisnummer findet kein Export statt.
- Die bisherigen **63 TFG-COPARN-Spalten** bleiben in Inhalt und Reihenfolge
  unverändert. Nur `Plan Wagon No` und `Plan Loc` folgen als Spalten 64/65.
- `Plan Wagon No`: echte vollständige Wagennummer aus MITVEAN, **als Text**.
- `Plan Loc`: aus TOPX-Screenshots abgeleitete Zeichenfolge `R <Gleis> <Wagenfolge> <Anfangsplatz> [M] 1`.
  Beispiel `R 413 35 03 1` für Wagenfolge 35, Beginn Stellplatz 03 auf Gleis 413;
  `R 411 06 01 M 1` für mittige Einzelbelegung auf Wagen 6.
- Die **Wagenfolge** ist die links beginnende, 1-basierte physische Folge des
  berechneten Plans, auch bei gedrehter Wagenreihung. Ein 20-ft-Container
  belegt einen Anfangsplatz, ein 40-ft-Container zwei Plätze; bei zwei 40-ft-
  Containern sind die Anfangsplätze daher `01` und `03`.
- Der Planer entscheidet nur schematisch über die Ladeeinheiten. Die tatsächliche
  RBS-TOPX-Verriegelungs-/Slot-Geometrie und die Übernahme dieser Zeichenfolge
  über **TOPS/TOPO-COPARN sind nicht bestätigt**. Diese Datei ist nur für eine
  freigegebene IT/RBS-Testumgebung bestimmt; keinesfalls ungeprüft auf einen
  produktiven Zug importieren. Der Dateiname trägt `TEST` und `NICHT_EINSPIELEN`.
- Mehrere Container auf einem Wagen werden anhand ihrer schematischen Positionen
  links nach rechts kodiert; überlappende Einheiten werden abgewiesen.
  Nicht verplante Container behalten leere Planfelder. A4-Druck, Train-Planner-
  Algorithmus und sämtliche übrigen Converter bleiben unverändert.


## NEXORA v14 – MITSVKI „Liste Ausgangszug“

Der gemeinsame Wagenlisten-PDF-Parser unterstützt zusätzlich zum bisherigen MITVEAN
„Liste Gleisinhalt“ und MITSVKI „Liste Eingangszug“ nun auch MITSVKI
„Liste Ausgangszug“ mit den Feldern `Gr Lnr Gl DD A Fahrzeugnummer Achs LüP`.
Die zusätzlichen Zeilenfelder `Gleis` und `ST` werden berücksichtigt;
`Lnr`, zwölfstellige Wagenkennung, Achszahl und LüP in dm bleiben exakt erhalten.
Zugnummern wie `Tag 06 Zug Z50417` werden ebenfalls ausgelesen.
Beide Nutzeroberflächen (TFG TCM-Finalisierung und Train Planner) akzeptieren
dasselbe PDF. Kein neuer Pflichtschritt und keine geänderte Planungsregel.

**Verifikation:** Original-PDF vom 06.11.2026, Z50417, 37 Wagen,
130 Achsen, DB-Summenfeld 687 Meter. Die Summe der 37 einzeln gelisteten
LüP-Werte beträgt 688,6 Meter; der Planner nutzt die einzelnen LüP-Werte
und keine pauschal gerundete Länge.
Wagen-/Containerzulässigkeit bleibt ein prüfpflichtiger Verplanungsvorschlag.
