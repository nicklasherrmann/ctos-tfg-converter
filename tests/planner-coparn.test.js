'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const coparn=require('../planner-coparn.js');
const app=fs.readFileSync(path.join(__dirname,'..','app.js'),'utf8');
const match=app.match(/const OUT_HEADERS = \[([\s\S]*?)\];/);
assert.ok(match,'Active TFG-COPARN header declaration not found');
const sourceHeaders=[...match[1].matchAll(/"([^"]+)"/g)].map(m=>m[1]);
assert.equal(sourceHeaders.length,63);
const ctrIndex=sourceHeaders.indexOf('CTR_NO');
const getBaseRows=data=>data.entries.map((e,i)=>sourceHeaders.map(h=>h==='CTR_NO'?e.ctrNo:h==='GROSS'?e.gross:h==='BOOK_NO'?`REF-${i}`:null));
const u=(ctrNo,lengthFt,offsetFt,gross=10000)=>({ctrNo,lengthFt,offsetFt,gross});
const w=(displaySeq,wagonNo,units,centerRuleApplied=false,capacityFt=60)=>({displaySeq,wagonNo,units,centerRuleApplied,capacityFt});
const list={trainNo:50418,date:'02.11.2026',entries:[u('AABB1234567',40,0),u('CCDD2345678',20,0),u('EEFF3456789',40,0),u('GGHH4567890',20,0)]};
const reversed={planned:3,reverse:true,wagons:[
 w(1,'318049530001',[u('CCDD2345678',20,40),u('AABB1234567',40,0)]),
 w(2,'318049530002',[u('EEFF3456789',40,10)],true)
]};
const build=(plan=reversed,data=list,options={track:'411'})=>coparn.build(plan,data,sourceHeaders,getBaseRows,options);

test('v13: 63 unveränderte ursprüngliche Spalten und exakt zwei Planfelder',()=>{
 const out=build();
 assert.equal(out.headers.length,65);
 assert.deepEqual(out.headers.slice(0,63),sourceHeaders);
 assert.deepEqual(out.headers.slice(-2),['Plan Wagon No','Plan Loc']);
 assert.equal(out.rows.length,4);
 for(const row of out.rows)assert.equal(row.length,65);
 assert.equal(out.fieldFormat,'TOPX_LIKE_UNVERIFIED');
 assert.equal(out.track,'411');
});

test('v13: gedrehte physische Reihung, echte Wagennummern, 40ft braucht 2 Slots, Mitte mit M',()=>{
 const out=build();
 assert.deepEqual(out.rows.map(r=>r[ctrIndex]),['AABB1234567','CCDD2345678','EEFF3456789','GGHH4567890']);
 assert.deepEqual(out.rows.map(r=>r.at(-2)),['318049530001','318049530001','318049530002',null]);
 assert.deepEqual(out.rows.map(r=>r.at(-1)),['R 411 01 01 1','R 411 01 03 1','R 411 02 01 M 1',null]);
 assert.equal(out.rows[0][sourceHeaders.indexOf('BOOK_NO')],'REF-0');
 assert.equal(out.rows[1][sourceHeaders.indexOf('BOOK_NO')],'REF-1');
 assert.equal(out.unplanned,1);assert.equal(out.planned,3);assert.equal(out.reverse,true);
});

test('v13: Umkehr wieder aus: erste dargestellte Wagenfolge immer 01, auch wenn echte Wagennummer wechselt',()=>{
 const normal={...reversed,reverse:false,wagons:[
  {...reversed.wagons[1],displaySeq:1},
  {...reversed.wagons[0],displaySeq:2}
 ]};
 const out=build(normal);
 assert.deepEqual(out.rows.map(r=>r[ctrIndex]),['EEFF3456789','AABB1234567','CCDD2345678','GGHH4567890']);
 assert.deepEqual(out.rows.map(r=>r.at(-1)),['R 411 01 01 M 1','R 411 02 01 1','R 411 02 03 1',null]);
 assert.equal(out.rows[0][sourceHeaders.indexOf('BOOK_NO')],'REF-2');
});

test('v13: 20+40 erzeugt Stellplätze 01 und 02, 40+20 erzeugt 01 und 03',()=>{
 const entries=[u('AAAA0000001',20,0),u('BBBB0000002',40,20),u('CCCC0000003',40,0),u('DDDD0000004',20,40)];
 const p={planned:4,wagons:[
  w(1,'318049530001',[entries[0],entries[1]]),
  w(2,'318049530002',[entries[2],entries[3]])
 ]};
 const out=build(p,{...list,entries},{track:'413'});
 assert.deepEqual(out.rows.map(r=>r.at(-1)),[
 'R 413 01 01 1','R 413 01 02 1','R 413 02 01 1','R 413 02 03 1'
 ]);
});

test('v13: zwei 40ft auf 80ft-Wagen: Anfangsslots 01 und 03',()=>{
 const entries=[u('AAAA0000001',40,0),u('BBBB0000002',40,40)];
 const out=build({planned:2,wagons:[w(35,'378045614112',entries,false,80)]},{...list,entries},{track:'413'});
 assert.deepEqual(out.rows.map(r=>r.at(-1)),['R 413 35 01 1','R 413 35 03 1']);
 assert.deepEqual(out.rows.map(r=>r.at(-2)),['378045614112','378045614112']);
});

test('v13: vier 20ft belegen Slots 01 bis 04 auf 80ft-Wagen',()=>{
 const entries=[u('AAAA0000001',20,0),u('BBBB0000002',20,20),u('CCCC0000003',20,40),u('DDDD0000004',20,60)];
 const out=build({planned:4,wagons:[w(7,'318049530007',entries,false,80)]},{...list,entries},{track:'411'});
 assert.deepEqual(out.rows.map(r=>r.at(-1)),[1,2,3,4].map(n=>`R 411 07 0${n} 1`));
});

test('v13: einzelne mittige 20ft/40ft Container werden mit M ausgegeben',()=>{
 const entries=[u('AAAA0000001',20,10),u('BBBB0000002',40,10),u('CCCC0000003',40,20)];
 const out=build({planned:3,wagons:[
  w(1,'318049530001',[entries[0]],true,40),
  w(2,'318049530002',[entries[1]],true,60),
  w(3,'318049530003',[entries[2]],false,80)
 ]},{...list,entries},{track:'411'});
 assert.deepEqual(out.rows.map(r=>r.at(-1)),[
  'R 411 01 01 M 1','R 411 02 01 M 1','R 411 03 01 M 1'
 ]);
});

test('v13: fehlende/ungültige Gleisnummer bricht Export kontrolliert ab',()=>{
 for(const track of [undefined,'','R 411','411A','5','000','411-413','12345']){
  assert.throws(()=>build(reversed,list,{track}),/Gleisnummer/i);
 }
 assert.equal(coparn.trackNumber(' 413 '),'413');
});

test('v13: keine erfundene, doppelte, überlappende oder außerhalb des Wagens liegende Zuordnung',()=>{
 const dup={...reversed,wagons:[w(1,'318049530001',[u('AABB1234567',20,0),u('AABB1234567',20,20)])]};
 assert.throws(()=>build(dup),/doppelt/i);
 assert.throws(()=>build({...reversed,wagons:[w(1,'318049530001',[u('XXXX0000001',20,0)])]}),/unvollständig/i);
 assert.throws(()=>build({...reversed,wagons:[w(1,'318049530001',[u('AABB1234567',40,40)])]}),/Stellplatzlage/);
 assert.throws(()=>build({...reversed,wagons:[w(1,'318049530001',[u('AABB1234567',40,0),u('CCDD2345678',20,20)])]}),/Überlappende/i);
 assert.throws(()=>coparn.build(reversed,list,sourceHeaders.slice(0,62),getBaseRows,{track:'411'}),/63-spaltige/);
});

test('v13: doppelte Containernummern in Quell-COPARN werden abgelehnt',()=>{
 const badList={...list,entries:[list.entries[0],list.entries[0]]};
 assert.throws(()=>build(reversed,badList),/Doppelte/);
});
