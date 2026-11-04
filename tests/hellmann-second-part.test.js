'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

// Aus dem echten Browserprogramm gelesene Funktionen: Die Tests pruefen dieselbe
// Import- und Exportlogik, ohne mit einem zweiten Parser abzuweichen.
const src = fs.readFileSync(path.join(__dirname,'../app.js'),'utf8');
function functionSource(name,next){
  const i = src.indexOf(`function ${name}(`);
  const j = src.indexOf(`function ${next}(`,i+1);
  if (i < 0 || j < 0) throw new Error(`Funktion ${name} nicht gefunden`);
  return src.slice(i,j);
}
const parseSource = functionSource('parseHellmannSecondPart','mergeHellmannSecondPart');
const mergeSource = src.slice(src.indexOf('function mergeHellmannSecondPart('),src.indexOf('async function handleHellmannSecondFile('));
const rowsSource = functionSource('makeHellmannRows','makeMedlogRows');
const headers=['Lfd\nNr','LE  (Container)\nPrefix + Nummer / Empfänger ','LE\nLg /\n\n','LE\nGat','B\nL','LE\nTara  Kg','LadGew \nKg vsl.\nbzw. IST','LE Höhe','Wagennummer','NHM-Nummer','Gefahrgut','Best. Bahnhof'];
const nums=['3180 4953 910-5','3180 4953 280-3','3180 4993 594-9','3180 4955 473-2'];
function matrixFixture(){
 const rows=[['Auftragserteilung zum LE-Versand  (Datum): 04.11.2026'] ,[],[],[],[],[],headers];
 const ctrs=[null,null,null,null,'CCPD 006 670-2','CCPD 006 727-3','CCPD 006 609-2','CCPD 006 648-8','CCPD 006 642-5',null,'CCPD 006 558-4','CCPD 006 354-0','CCPD 006 704-1','CCPD 006 568-7','CCPD 006 712-3','CCPD 006 628-2'];
 for(let i=0;i<16;i++){
  const row = Array(12).fill(null);
  row[0]=i+1;row[1]=ctrs[i];row[4]='B';row[5]=3060;row[6]=[0,0,0,0,0,0,2000,1000,1000,0,2000,1000,0,2500,0,800][i];
  row[8]=nums[Math.floor(i/4)];row[9]=990200;row[11]='Osnarbrück';
  rows.push(row);
 }
 return rows;
}
function createContext(matrix){
 const sandbox={
  XLSX:{read:()=>({SheetNames:['Reg Hafen-Osna'],Sheets:{'Reg Hafen-Osna':{}}}),utils:{sheet_to_json:()=>matrix}},
  clean:value=>value==null?'':String(value).trim(),
  toNumber:value=>value==null||value===''?null:Number(String(value).replace(',','.')),
  normalizeHeader:value=>String(value??'').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/ß/g,'ss').replace(/[^a-z0-9]/g,''),
  excelSerialAtTime:()=>50000,
  HELL_HEADERS:['TRN_NO','ETA','WAG_SEQ_NO','WAG_NO','CTR_NO','FE','Gross'],
  HELL_FIXED:{TRN_OPER_CODE:'DBCARGO',LINER:'HWL'},
 };
 vm.createContext(sandbox);
 vm.runInContext(`${parseSource}\n${mergeSource}\n${rowsSource}`,sandbox);
 return sandbox;
}
function parse(matrix){const context=createContext(matrix);return {part:vm.runInContext('parseHellmannSecondPart(new Uint8Array())',context),context};}

test('alle vier Wagen (einschliesslich unbeladenem ersten Wagen) werden erkannt',()=>{
 const {part}=parse(matrixFixture());
 assert.equal(part.wagonCount,4);
 assert.equal(part.emptyWagonCount,1);
 assert.equal(part.unitCount,11);
 assert.equal(part.wagons.get(7).wagonNo,'318049539105');
 assert.equal(part.wagons.get(7).slots.size,0);
 assert.equal(part.wagons.get(8).wagonNo,'318049532803');
 assert.equal(part.wagons.get(9).wagonNo,'318049935949');
 assert.equal(part.wagons.get(10).wagonNo,'318049554732');
 assert.equal(part.warnings.length,0);
});

test('Zwischenplatz 2 bleibt leer: Plaetze 1,3,4 werden nicht verschoben',()=>{
 const {part}=parse(matrixFixture());
 const wagon=part.wagons.get(9);
 assert.equal(wagon.slots.size,3);
 assert.deepEqual([...wagon.slots.keys()],[1,3,4]);
 assert.equal(wagon.slots.get(1).ctrNo,'CCPD0066425');
 assert.equal(wagon.slots.get(3).ctrNo,'CCPD0065584');
 assert.equal(wagon.slots.get(4).ctrNo,'CCPD0063540');
});

test('Zusammenfuehrung 6+4, Export 40 Slots und Leerwagen WAG_NO',()=>{
 const {part,context}=parse(matrixFixture());
 const baseWagons=new Map(),baseEntries=[];
 const wagCounts=[4,4,3,4,3,4];
 for(let seq=1;seq<=6;seq++){
  const slots=new Map(),wagonNo=String(318049530000+seq);
  for(let slot=1;slot<=wagCounts[seq-1];slot++){
   const e={wagonSeq:seq,wagonNo,slot,ctrNo:'CCPD'+String(8000000+seq*10+slot),fe:'F',gross:7000};
   slots.set(slot,e);baseEntries.push(e);
  }
  baseWagons.set(seq,{wagonNo,slots});
 }
 context.base={wagons:baseWagons,entries:baseEntries,part1Warnings:[],sourceName:'r1nawgl1.pdf',part1SourceName:'r1nawgl1.pdf',trainNo:50020,etaDate:'05.11.2026'};
 context.part2=part;
 const merged=vm.runInContext('mergeHellmannSecondPart(base,part2,"04.11.2026_Osnabrueck.xls")',context);
 assert.equal(merged.wagonCount,10);
 assert.equal(merged.emptyWagonCount,1);
 assert.equal(merged.unitCount,33);
 assert.equal(merged.warnings.length,0);
 context.data=merged;
 const rows=vm.runInContext('makeHellmannRows(data)',context);
 const h=context.HELL_HEADERS;
 const col=key=>h.indexOf(key);
 assert.equal(rows.length,40);
 for(const row of rows.slice(24,28)){
  assert.equal(row[col('WAG_SEQ_NO')],7);
  assert.equal(row[col('WAG_NO')],318049539105);
  assert.equal(row[col('CTR_NO')],null);
 }
 assert.equal(rows[28][col('WAG_SEQ_NO')],8);
 assert.equal(rows[28][col('CTR_NO')],'CCPD0066702');
 assert.equal(rows[33][col('WAG_SEQ_NO')],9);
 assert.equal(rows[33][col('CTR_NO')],null);
 assert.equal(rows[34][col('CTR_NO')],'CCPD0065584');
 assert.equal(rows[35][col('CTR_NO')],'CCPD0063540');
 assert.equal(rows[36][col('WAG_SEQ_NO')],10);
});

test('fuenfter Zusatzwagen bleibt eine Validierungsfehlermeldung',()=>{
 const matrix=matrixFixture();
 const row=[17,null,null,'JWB','B',3060,0,96,'3180 4999 999-9',990200,'','Osnarbrück'];
 matrix.push(row);
 assert.throws(()=>parse(matrix),/mehr als vier Wagen/);
});
