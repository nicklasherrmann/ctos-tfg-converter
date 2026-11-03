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
