'use strict';
const assert=require('node:assert/strict');
const {allocate,parseYardLocation,classifyWagon,isEmptyHapag}=require('../planner-engine.js');
const w=(lnr,axles,lup)=>({lnr,wagonNo:String(100000000000+lnr),axles,lup});
const u=(ctrNo,pod,lengthFt,gross=12000)=>({ctrNo,pod,destinationRaw:pod,lengthFt,gross});
function check(plan,units){
  assert.equal(plan.planned+plan.unplanned.length,units.length);
  for(const wagon of plan.wagons){
    assert(wagon.units.every(unit=>unit.destination===wagon.destination));
    assert(wagon.units.reduce((n,c)=>n+c.lengthFt,0)<=wagon.capacityFt);
    if(Number(wagon.axles)===2)
      assert(wagon.units.reduce((n,c)=>n+c.gross,0)<=20000,`2-Achser ${wagon.wagonNo} zu schwer`);
    for(const unit of wagon.units){
      assert(unit.offsetFt>=0&&unit.offsetFt+unit.lengthFt<=wagon.capacityFt);
    }
  }
}
assert.equal(classifyWagon(w(1,2,140)),40);
assert.equal(classifyWagon(w(1,4,196)),60);
assert.equal(classifyWagon(w(1,6,263)),80);
assert.equal(parseYardLocation('K 30  C   4').position,30);
assert.equal(parseYardLocation('K 30  C   4').level,4);
assert.equal(parseYardLocation('412 18 01 1 (Rail Out)').valid,false);
{
  const units=[u('A1','CTA',20)];
  const p=allocate([w(1,2,140)],units);
  assert.equal(p.wagons[0].units[0].offsetFt,10);
  assert.equal(p.wagons[0].centerRuleApplied,true);
  assert.equal(p.wagons[0].units[0].yardLocation,'COMMUNITY');
  check(p,units);
}
for(const ft of [20,40]){
  const units=[u('B'+ft,'CTA',ft)];
  const p=allocate([w(1,4,196)],units);
  assert.equal(p.wagons[0].units[0].offsetFt,(60-ft)/2);
  assert.equal(p.wagons[0].centerRuleApplied,true);
  check(p,units);
}
{
  const units=[u('AA','CTA',40),u('AB','CTA',20),u('BA','CTB',40),u('BB','CTB',40)];
  const p=allocate([w(1,4,196),w(2,6,267),w(3,2,140)],units);
  assert.equal(p.planned,4);
  check(p,units);
}
{
  const units=[u('AA','CTA',40),u('AA','CTA',40),u('BB','CTA',45)];
  const p=allocate([w(1,6,263)],units);
  assert.equal(p.planned,1);
  assert.equal(p.unplanned.length,2);
  check(p,units);
}
{
  const units=[u('AA','CTA',40),u('AB','CTA',40)];
  const p=allocate([w(1,6,263)],[...units],[{ctrNo:'AA',location:'K 30 C 4'}]);
  assert.equal(p.yardMatches,1);
  assert.equal(p.wagons[0].units.find(x=>x.ctrNo==='AA').yardLocation,'K 30 C 4');
  assert.equal(p.wagons[0].units.find(x=>x.ctrNo==='AB').yardLocation,'COMMUNITY');
  check(p,units);
}
console.log('NEXORA Train Planner: alle Engine-Tests bestanden.');

// Color rule: only empty HAPAG containers are green (source fields are optional).
assert.equal(isEmptyHapag({fe:'E',carrier:'HAPAG-LLOYD'}),true);
assert.equal(isEmptyHapag({fe:'E',carrier:'Hapag Lloyd AG'}),true);
assert.equal(isEmptyHapag({fe:'E',carrier:'MAERSK',shipper:'HAPAG-LLOYD AG'}),false);
assert.equal(isEmptyHapag({fe:'E',shipper:'HAPAG-LLOYD AG'}),true);
assert.equal(isEmptyHapag({fe:'F',carrier:'HAPAG-LLOYD'}),false);
assert.equal(isEmptyHapag({fe:'E',carrier:'CMA CGM'}),false);
assert.equal(isEmptyHapag({fe:'E',ctrNo:'HLBU9999999'}),false);

// v6: Der einzige verfügbare Wagen muss dem Vollcontainer vorbehalten sein.
{
  const units=[{...u('EMPTY','CTB',40),fe:'E'},{...u('FULL','CTA',40),fe:'F'}];
  const p=allocate([w(1,2,140)],units);
  assert.equal(p.plannedFull,1);
  assert.equal(p.plannedEmpty,0);
  assert.equal(p.wagons[0].units[0].ctrNo,'FULL');
  assert.equal(p.unplanned[0].ctrNo,'EMPTY');
  check(p,units);
}
// Leercontainer dürfen freie Restkapazität eines Vollcontainer-Wagens nutzen.
{
  const units=[{...u('FULL','CTA',40),fe:'F'},{...u('EMPTY','CTA',20),fe:'E'}];
  const p=allocate([w(1,4,196)],units);
  assert.equal(p.plannedFull,1);
  assert.equal(p.plannedEmpty,1);
  assert.equal(p.wagons[0].assignedFt,60);
  check(p,units);
}
// Auch wenn Leereinheiten zuerst in der Datei stehen, werden mehrere
// Vollcontainer mit unterschiedlichen Zielen grundsätzlich vorgezogen.
{
  const units=[{...u('E1','EKOM',40),fe:'E'},
    {...u('F1','CTA',40),fe:'F'}, {...u('F2','BK',40),fe:'F'},
    {...u('E2','EKOM',40),fe:'E'}];
  const p=allocate([w(1,2,140),w(2,2,140)],units);
  assert.equal(p.plannedFull,2);
  assert.equal(p.plannedEmpty,0);
  check(p,units);
}
// Das Umkehren der Zugreihung dreht nicht nur das Bild, sondern die Wagen-
// positionsberechnung; das Zugende der tatsächlichen Reihenfolge bleibt 100.
{
  const wagons=[w(1,2,140),w(2,6,267),w(3,4,196)];
  const entries=[{...u('F1','CTA',40),fe:'F'}];
  const normal=allocate(wagons,entries);
  const reverse=allocate(wagons,entries,[],{reverse:true});
  assert.deepEqual(normal.wagons.map(w=>w.lnr),[1,2,3]);
  assert.deepEqual(reverse.wagons.map(w=>w.lnr),[3,2,1]);
  assert.equal(reverse.reverse,true);
  assert.ok(Math.abs(reverse.wagons[reverse.wagons.length-1].positionEnd-100)<1e-9);
  assert.ok(reverse.wagons[0].positionCenter<reverse.wagons[2].positionCenter);
  check(reverse,entries);
}
// Die Nähe zum Yard wird nach dem Drehen erneut anhand der neuen Positionen berechnet.
{
  const wagons=[w(1,2,140),w(2,2,140)];
  const entries=[{...u('NEAR100','CTA',40),fe:'F'}];
  const yard=[{ctrNo:'NEAR100',location:'K 99 A 1'}];
  const normal=allocate(wagons,entries,yard);
  const reversed=allocate(wagons,entries,yard,{reverse:true});
  assert.equal(normal.wagons.find(w=>w.units.length)?.lnr,2);
  assert.equal(reversed.wagons.find(w=>w.units.length)?.lnr,1);
}

// v7: Die angezeigte Wagenposition zählt IMMER von links nach rechts ab 1.
// Die Original-Laufnummer aus MITVEAN bleibt für Sortierung/Zuordnung erhalten.
{
  const wagons=[w(1,2,140),w(2,6,267),w(3,4,196)];
  const entries=[{...u('F1','CTA',40),fe:'F'}];
  for(const reverse of [false,true]){
    const p=allocate(wagons,entries,[],{reverse});
    assert.deepEqual(p.wagons.map(w=>w.displaySeq),[1,2,3]);
    assert.deepEqual(p.wagons.map(w=>w.wagonNo),
      (reverse?[...wagons].reverse():wagons).map(w=>w.wagonNo));
    assert.deepEqual(p.wagons.map(w=>w.lnr),reverse?[3,2,1]:[1,2,3]);
    assert.ok(Math.abs(p.wagons.at(-1).positionEnd-100)<1e-9);
  }
}

// v9: Gefahrgut (UN-Nummer) aus optionaler TFG-Spalte, inklusive Text-/Zahlvarianten.
const {parseHazard,isHazardous}=require('../planner-engine.js');
assert.deepEqual(parseHazard('N'),{hazardous:false,unNo:'',hazardRaw:'N',requiresReview:false});
assert.equal(parseHazard('UN 1203').unNo,'1203');
assert.equal(parseHazard(1993).hazardous,true);
assert.equal(parseHazard('UN-1993').unNo,'1993');
assert.equal(parseHazard('J').requiresReview,true);
assert.equal(isHazardous({hazardRaw:'UN 1203'}),true);
assert.equal(isHazardous({hazardRaw:'N'}),false);
// Alle Gefahreinheiten dürfen nur mit normalen Einheiten desselben Ziels kombiniert werden.
{
  const entries=[
    {...u('HAZ1','CTA',20),fe:'F',hazardRaw:'UN 1203'},
    {...u('HAZ2','CTA',20),fe:'F',hazardRaw:'1993'},
    {...u('NORMAL','CTA',20),fe:'F',hazardRaw:'N'}
  ];
  const p=allocate([w(1,4,196)],entries);
  assert.equal(p.planned,2);
  assert.equal(p.unplanned.length,1);
  assert.equal(p.wagons[0].units.filter(isHazardous).length,1);
  assert(p.wagons[0].units.some(c=>c.ctrNo==='NORMAL'));
  check(p,entries);
}
// Gefahrgut darf nicht als Restplatz zu einem bereits mit Gefahrgut belegten
// Vollcontainer-Wagen hinzugefügt werden; ein anderer normaler Leercontainer schon.
{
  const entries=[
    {...u('HAZF','CTA',40),fe:'F',hazardRaw:'UN 1203'},
    {...u('HAZE','CTA',20),fe:'E',hazardRaw:'UN 1993'},
    {...u('NORMAL_E','CTA',20),fe:'E',hazardRaw:'N'}
  ];
  const p=allocate([w(1,4,196)],entries);
  assert.equal(p.plannedFull,1);
  assert.equal(p.plannedEmpty,1);
  assert.equal(p.unplanned.length,1);
  assert.equal(p.unplanned[0].ctrNo,'HAZE');
  assert.equal(p.wagons[0].units.filter(isHazardous).length,1);
  check(p,entries);
}
// Auch auf 80-Fuß-Wagen dürfen die zwei nächsten UN-Einheiten nicht
// gemeinsam landen, wohl aber ein UN-Container mit weiteren normalen 20-Fuß.
{
  const entries=[
    {...u('UN1','CTA',20),fe:'F',hazardRaw:'UN 1203'},
    {...u('UN2','CTA',20),fe:'F',hazardRaw:'UN 1993'},
    {...u('REG1','CTA',20),fe:'F'},
    {...u('REG2','CTA',20),fe:'F'}
  ];
  const p=allocate([w(1,6,267)],entries);
  assert.equal(p.planned,3);
  assert.equal(p.wagons[0].units.filter(isHazardous).length,1);
  check(p,entries);
}
// Zielbahnhof, Vollcontainer-Vorrang, Gefahrgut und gedrehte Reihung zugleich.
{
  const entries=[
    {...u('D1','CTA',40),fe:'F',hazardRaw:'UN 1203'},
    {...u('D2','CTA',40),fe:'F',hazardRaw:'UN 1993'},
    {...u('E','BK',40),fe:'E'}
  ];
  const p=allocate([w(1,2,140),w(2,2,140)],entries,[],{reverse:true});
  assert.equal(p.plannedFull,2);
  assert.equal(p.plannedEmpty,0);
  assert.equal(p.unplanned[0].ctrNo,'E');
  assert.deepEqual(p.wagons.map(x=>x.displaySeq),[1,2]);
  check(p,entries);
}
// C/D sind tatsächlich eigenständige Yard-Standorte ohne Unterteilung.
assert.equal(parseYardLocation(' C ').position,15);
assert.equal(parseYardLocation('c').approximate,true);
assert.equal(parseYardLocation('D').position,75);
assert.equal(parseYardLocation(' d ').zone,'D');
assert.equal(parseYardLocation('CFS').valid,false);
assert.equal(parseYardLocation('K 30 C 4').position,30);
assert.equal(parseYardLocation('K 30 C 4').approximate,false);
// C nahe 15 / D nahe 75; Reefer bleiben identisch.
{
  const wagons=Array.from({length:34},(_,i)=>w(i+1,4,196));
  const entries=[
    {...u('YC','CTA',40),fe:'F',type:'RF'},
    {...u('YD','CTA',40),fe:'F',type:'DC'}
  ];
  const p=allocate(wagons,entries,[{ctrNo:'YC',location:'C'},{ctrNo:'YD',location:'D'}]);
  const c=p.wagons.find(x=>x.units.some(u=>u.ctrNo==='YC'));
  const d=p.wagons.find(x=>x.units.some(u=>u.ctrNo==='YD'));
  assert(c&&d);
  assert(Math.abs(c.positionCenter-15)<6);
  assert(Math.abs(d.positionCenter-75)<6);
  assert.equal(p.yardMatches,2);
  assert.equal(c.units[0].yardApproximate,true);
  check(p,entries);
}
// COMMUNITY vorzugsweise 12..95; außerhalb möglich, wenn es keine Alternative gibt.
{
  const wagons=Array.from({length:34},(_,i)=>w(i+1,4,196));
  const entries=[{...u('COM','CTA',40),fe:'F'}];
  const p=allocate(wagons,entries);
  const wagon=p.wagons.find(w=>w.units.length);
  assert(wagon.positionCenter>=12&&wagon.positionCenter<=95);
  assert.equal(p.communityExceptions,0);
  check(p,entries);
}
{
  const entries=[{...u('COM','CTA',40),fe:'F'}];
  const p=allocate([w(1,2,140)],entries);
  assert.equal(p.planned,1);
  assert(p.wagons[0].positionCenter>95);
  assert.equal(p.communityExceptions,1);
  check(p,entries);
}
// COMMUNITY darf die harten Gefahrgut- und Ziel-Regeln nicht überstimmen.
{
  const entries=[{...u('H1','CTA',20),hazardRaw:'UN 1203'},
    {...u('H2','CTA',20),hazardRaw:'UN 1993'},
    {...u('COM2','CTA',20)}];
  const p=allocate([w(1,4,196)],entries);
  assert.equal(p.planned,2);
  assert.equal(p.wagons[0].units.filter(isHazardous).length,1);
  check(p,entries);
}
console.log('NEXORA v9: Gefahrgut- und Yard/COMMUNITY-Regressionsfälle bestanden.');

// v10: Betriebsvorgabe für 2-Achser – insgesamt maximal 20.000 kg Containerbrutto.
{
  const units=[u('EQ20A','CTA',20,10000),u('EQ20B','CTA',20,10000)];
  const plan=allocate([w(1,2,140)],units);
  assert.equal(plan.planned,2);
  assert.equal(plan.wagons[0].assignedGrossKg,20000);
  assert.equal(plan.wagons[0].maxContainerGrossKg,20000);
  check(plan,units);
}
// Bereits ein Kilogramm über der Grenze muss die zweite Einheit zurückstehen.
{
  const units=[u('OVER1','CTA',20,10001),u('OVER2','CTA',20,10000)];
  const plan=allocate([w(1,2,140)],units);
  assert.equal(plan.planned,1);
  assert.equal(plan.unplanned.length,1);
  check(plan,units);
}
// Ein zu schwerer Einzelcontainer darf NICHT auf einen 2-Achser, auch bei 40 Fuß.
{
  const units=[u('TOOHEAVY','CTA',40,20001)];
  const plan=allocate([w(1,2,140)],units);
  assert.equal(plan.planned,0);
  assert.match(plan.unplanned[0].reason,/20\.000 kg/);
  check(plan,units);
}
// Andere vorhandene Wagen nutzen: 22t wird zum 4-Achser umgeplant.
{
  const units=[u('22TON','CTA',40,22000)];
  const wagons=[w(1,2,140),w(2,4,196)];
  const plan=allocate(wagons,units,[{ctrNo:'22TON',location:'K 98 A 1'}]);
  assert.equal(plan.planned,1);
  assert.equal(plan.wagons.find(w=>w.units.length).axles,4);
  check(plan,units);
}
// Schwere 20-Fuß-Kombination am Yard darf nicht die einzige geprüfte
// Kombination sein: Zwei etwas weiter entfernte leichte Einheiten passen.
{
  const units=[u('HEAVY','CTA',20,19000),u('LIGHT1','CTA',20,9000),u('LIGHT2','CTA',20,9000)];
  const plan=allocate([w(1,2,140)],units,[
    {ctrNo:'HEAVY',location:'K 99 A 1'},
    {ctrNo:'LIGHT1',location:'K 60 A 1'},
    {ctrNo:'LIGHT2',location:'K 58 A 1'}]);
  assert.equal(plan.planned,2);
  assert.deepEqual(plan.wagons[0].units.map(u=>u.ctrNo).sort(),['LIGHT1','LIGHT2']);
  check(plan,units);
}
// Restplätze: nach einem vollen 12-t-20-Fuß-Container darf ein leerer
// 9-t-Container NICHT hinzu; ein 8-t-Container ist dagegen erlaubt.
{
  const units=[{...u('FULL12','CTA',20,12000),fe:'F'},
    {...u('EMPTY9','CTA',20,9000),fe:'E'},
    {...u('EMPTY8','CTA',20,8000),fe:'E'}];
  const plan=allocate([w(1,2,140)],units);
  assert.equal(plan.plannedFull,1);
  assert.equal(plan.plannedEmpty,1);
  assert.deepEqual(plan.wagons[0].units.map(u=>u.ctrNo).sort(),['EMPTY8','FULL12']);
  check(plan,units);
}
// Beim nachträglichen Tausch dürfen keine Überladungen entstehen.
// Beides zusammen mit Gefahrgut und gedrehter Wagenreihung.
{
  const units=[{...u('UN20','CTA',20,11000),fe:'F',hazardRaw:'UN 1203'},
    {...u('NON20','CTA',20,9000),fe:'F'},
    {...u('HEAVY40','CTA',40,29000),fe:'F'}];
  const plan=allocate([w(1,2,140),w(2,4,196)],units,[],{reverse:true});
  assert.equal(plan.planned,3);
  assert(plan.wagons.find(w=>w.axles===2).assignedGrossKg<=20000);
  assert(plan.wagons.find(w=>w.axles===4).assignedGrossKg>=29000);
  assert.deepEqual(plan.wagons.map(w=>w.displaySeq),[1,2]);
  check(plan,units);
}
console.log('NEXORA v10: 2-Achser-Bruttogewichtsgrenze bestanden.');
