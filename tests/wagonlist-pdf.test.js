'use strict';
const assert=require('node:assert/strict');
const test=require('node:test');
const fs=require('node:fs');
const vm=require('node:vm');
const code=fs.readFileSync(require('node:path').join(__dirname,'../app.js'),'utf8');
const start=code.indexOf('function mitveanWagType(');
const end=code.indexOf('function finalizeTfgTcm(',start);
assert(start>=0&&end>start,'Gemeinsamer Wagenlistenparser nicht gefunden');
const parserCode=code.slice(start,end);
function fakePdf(pages){
  return {getDocument:()=>({promise:Promise.resolve({numPages:pages.length,
    getPage:async (n)=>({getTextContent:async()=>({items:pages[n-1].map((line,i)=>({str:line,transform:[1,0,0,1,12,800-i*14]}))})})
  })})};
}
async function parse(pages){
  const context={pdfjsLib:fakePdf(pages),Uint8Array,Map,Set,Number,String,console};
  vm.runInNewContext(parserCode+'\nthis.__wagonParser=parseMitveanPdf;',context);
  return context.__wagonParser(new Uint8Array([1]));
}
const oldHeader=['OSNABRUECK RBF 02.11.26 MITVEAN Seite 1','Liste Gleisinhalt',
  'Gleis 158 Ort HOR O Wvst','1 2180 4426 204-4 2 B 140 5 17 G 1 3 0,0 Lgs 02 Z50419/2',
  '2 3180 4850 329-2 6 B 267 9 38 G 1 3 0,0 Sggrs 02 Z50419/2'];
const inbound=['OSNABRUECK RBF 02.11.26 MITSVKI Seite 1','Liste Eingangszug',
  'Tag 02 Zug 50419 nach OSNABRUECK RBF',
  '2 1 T 3180 4960 129-3 6 267 34 Sggrss',
  '2 T 3180 4850 286-4 6 268 35 Sggrs'];
const outbound=[
  ['OSNABRUECK RBF 06.11.26 10:23:23 MITSVKI Seite 1','Liste Ausgangszug',
   'Tag 06 Zug Z50417 nach OSNABRUECK RBF Abfahrt Soll 13:00',
   'Gr Lnr Gl DD A Fahrzeugnummer Achs LüP Ges',
   '02 1 157 ST 3180 4850 942-2 6 264 71 3 (H) 10,6 23,6 Sggrs',
   '2 157 ST 2180 4427 367-8 2 141 19 3 0,0 18,7 Lgs',
   '3 157 ST 2180 4435 300-9 2 139 21 3 0,0 20,7 Lgns'],
  ['OSNABRUECK RBF 06.11.26 MITSVKI Seite 2','Liste Ausgangszug',
   'Tag 06 Zug Z50417 nach OSNABRUECK RBF',
   '4 157 ST 3180 4850 276-5 6 268 70 3 0,0 23,4 Sggrs'],
];
test('MITVEAN Gleisinhalt unverändert',async()=>{
 const r=await parse([oldHeader]);
 assert.equal(r.sourceFormat,'MITVEAN'); assert.equal(r.wagonCount,2);assert.equal(r.maxLnr,2);
 assert.equal(r.trainNo,50419); assert.equal(r.date,'02.11.2026');
 assert.equal(r.wagons.get('218044262044').wagType,2140);
});
test('MITSVKI Liste Eingangszug unverändert',async()=>{
 const r=await parse([inbound]);
 assert.equal(r.sourceFormat,'MITSVKI');assert.equal(r.wagonCount,2);
 assert.equal(r.trainNo,50419);
 assert.equal(r.wagons.get('318049601293').wagType,6267);
});
test('MITSVKI Liste Ausgangszug: Gruppenzeile, Folgezeilen, Seitenumbruch, Zugnummer',async()=>{
 const r=await parse(outbound);
 assert.equal(r.sourceFormat,'MITSVKI');assert.equal(r.wagonCount,4);
 assert.equal(r.maxLnr,4);assert.equal(r.trainNo,50417);assert.equal(r.date,'06.11.2026');
 assert.deepEqual(Array.from(r.wagons.values(),w=>w.lnr),[1,2,3,4]);
 assert.deepEqual(Array.from(r.wagons.values(),w=>w.axles),[6,2,2,6]);
 assert.deepEqual(Array.from(r.wagons.values(),w=>w.lup),[264,141,139,268]);
 assert.equal(r.wagons.get('318048509422').wagType,6264);
 assert.equal(r.wagons.get('218044273678').wagType,2141);
});
test('Kopf- und Fußzeilen werden niemals als Wagen missverstanden',async()=>{
 const r=await parse([[...outbound[0], 'Wagen 37 bl 37 lr Achsen 130 Länge 687 m Gewicht 1631 t',
 'Ende der Liste']]);
 assert.equal(r.wagonCount,3);
});
