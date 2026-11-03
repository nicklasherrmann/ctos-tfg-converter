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
