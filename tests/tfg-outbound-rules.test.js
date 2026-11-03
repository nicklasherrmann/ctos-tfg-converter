'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const {classify,hasRecognizedRelease,exportReleaseOrder,exportBillOfLading}=require('../tfg-outbound-rules.js');
const route=(fe,carrier,shipper,releaseOrder)=>classify({fe,carrier,shipper,releaseOrder});

test('Maersk – Sonderzuordnung nur bei Leer, Auftraggeber und gültiger Turn-Out-Referenz',()=>{
  assert.deepEqual(route('E','Maersk','Maersk Deutschland A/S Co.KG','R24627816'),{category:'D',liner:'MAE',customerId:'MAE'});
  assert.deepEqual(route('E','MAE MAERSK LINE','LOGWIN AIR + OCEAN DEUTSCHLANDGMBH','fuer Maersk'),{category:'E',liner:'TFG',customerId:'TFG'});
  assert.deepEqual(route('E','Maersk','Maersk Deutschland A/S Co.KG','27'),{category:'E',liner:'TFG',customerId:'TFG'});
  assert.deepEqual(route('E','Maersk','Maersk Deutschland A/S Co.KG',''),{category:'E',liner:'TFG',customerId:'TFG'});
  assert.deepEqual(route('F','Maersk','Maersk Deutschland A/S Co.KG','R24627816'),{category:'E',liner:'TFG',customerId:'TFG'});
  assert.deepEqual(route('E','Maersk','LOGWIN','R24627816'),{category:'E',liner:'TFG',customerId:'TFG'});
});

test('HAPAG – eigene Liner-Zuordnung; keine automatische Umstellung der vollen Container',()=>{
  assert.deepEqual(route('E','HAPAG-LLOYD','HAPAG-LLOYD AGAREA GERMANYTD CENTER HAMBURG','46750272'),{category:'D',liner:'HAP',customerId:'TFG'});
  assert.deepEqual(route('F','HAPAG-LLOYD','HAPAG-LLOYD AG','29402802'),{category:'E',liner:'TFG',customerId:'TFG'});
  assert.deepEqual(route('E','HAPAG-LLOYD','HAPAG-LLOYD AG','OOCL Stock'),{category:'E',liner:'TFG',customerId:'TFG'});
});

test('unbekannte oder fehlende Reeder/Auftraggeber → TFG-Fallback',()=>{
  assert.deepEqual(classify({fe:'E',releaseOrder:'R24627816'}),{category:'E',liner:'TFG',customerId:'TFG'});
  assert.deepEqual(classify({fe:'F'}),{category:'E',liner:'TFG',customerId:'TFG'});
});

test('Release-Prüfung und belegter Platzhalter 27',()=>{
  assert.equal(hasRecognizedRelease('R24627816'),true);
  assert.equal(hasRecognizedRelease('46750272'),true);
  for(const s of ['27','fuer Maersk','OOCL Stock','',null])assert.equal(hasRecognizedRelease(s),false);
  assert.equal(exportReleaseOrder('27'),null);
  assert.equal(exportReleaseOrder(' 27 '),null);
  assert.equal(exportReleaseOrder('fuer Maersk'),'fuer Maersk');
  assert.equal(exportReleaseOrder('OOCL Stock'),'OOCL Stock');
  assert.equal(exportReleaseOrder('46750272'),'46750272');
});

test('Kundenauftragsnummern – nur den belegten E0/E1-LEER-Suffix entfernen',()=>{
  assert.equal(exportBillOfLading('TB2600064216-/-E1-/-LEER'),'TB2600064216');
  assert.equal(exportBillOfLading('S02847083 NZB-/-E1-/-LEER'),'S02847083 NZB');
  assert.equal(exportBillOfLading('CSLU6129024-/-E0-/-LEER'),'CSLU6129024');
  assert.equal(exportBillOfLading('TB2600053364-/-1'),'TB2600053364-/-1');
  assert.equal(exportBillOfLading('TB2600064216-/-E2-/-LEER'),'TB2600064216-/-E2-/-LEER');
  assert.equal(exportBillOfLading(''),null);
});
