/* NEXORA – TFG Export: kundenspezifische Zuordnung (Stand Referenz 02.11.2026).
 * Die Regeln wirken ausschließlich auf TFG Ausgang, nicht auf COREOR oder TCM.
 * In Node separat testbar, im Browser als window.NexoraTfgOutboundRules nutzbar.
 */
(function(root,factory){
  const api=factory();
  if (typeof module !== 'undefined' && module.exports) module.exports=api;
  else root.NexoraTfgOutboundRules=api;
})(typeof globalThis !== 'undefined' ? globalThis : this,function(){
  'use strict';
  const clean = value => value == null ? '' : String(value).trim().replace(/\s+/g,' ');
  const normalized = value => clean(value).toLocaleLowerCase('de-DE');
  // Bisher nachgewiesene echte Turn-Out-Formate: Maersk R+8 Ziffern;
  // HAPAG-LLOYD 8 Ziffern. Werte wie „27“, „fuer Maersk“ oder
  // „OOCL Stock“ sind KEINE geprüfte Referenz für die Sonderzuordnung.
  const hasRecognizedRelease = value => /^(?:R\d{8}|\d{8})$/i.test(clean(value));

  function classify(entry){
    const fe=clean(entry?.fe).toUpperCase();
    const carrier=normalized(entry?.carrier);
    const shipper=normalized(entry?.shipper);
    const release=clean(entry?.releaseOrder);
    const isEmpty=fe==='E';
    const hasRelease=hasRecognizedRelease(release);
    const maerskCustomer=/maersk\s+deutschland/.test(shipper);
    const maerskCarrier=/maersk/.test(carrier);
    const hapagCustomer=/hapag[\s-]*lloyd/.test(shipper);
    const hapagCarrier=/hapag[\s-]*lloyd/.test(carrier);

    if (isEmpty && hasRelease && maerskCustomer && maerskCarrier) {
      return {category:'D',liner:'MAE',customerId:'MAE'};
    }
    if (isEmpty && hasRelease && hapagCustomer && hapagCarrier) {
      return {category:'D',liner:'HAP',customerId:'TFG'};
    }
    return {category:'E',liner:'TFG',customerId:'TFG'};
  }

  // Im Beispiel-Zug ist „27“ bei sieben Einheiten ein Platzhalter im
  // Quelldokument und wird im offiziellen TFG-Export leer ausgegeben.
  // Andere freitextliche Angaben werden exakt beibehalten.
  function exportReleaseOrder(value){
    const text=clean(value);
    return !text || text==='27' ? null : text;
  }

  // Der TFG-Referenzexport entfernt bei drei Kundenauftragsnummern den
  // eindeutigen Leercontainer-Suffix „-/-E0-/-LEER“ bzw. „-/-E1-/-LEER“.
  // Sonstige Kundenreferenzen und Teilsuffixe bleiben unverändert.
  function exportBillOfLading(value){
    const text=clean(value);
    return text ? text.replace(/-\/-E[01]-\/-LEER$/i,'') : null;
  }

  return {classify,hasRecognizedRelease,exportReleaseOrder,exportBillOfLading};
});
