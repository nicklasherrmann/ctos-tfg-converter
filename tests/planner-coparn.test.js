'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const coparn=require('../planner-coparn.js');
const app=fs.readFileSync(path.join(__dirname,'..','app.js'),'utf8');
// Schema aus der aktiven TFG-Exportdeklaration statt einer zweiten Kopie.
const match=app.match(/const OUT_HEADERS = \[([\s\S]*?)\];/);
assert.ok(match,'Active TFG-COPARN header declaration not found');
const sourceHeaders=[...match[1].matchAll(/"([^"]+)"/g)].map(m=>m[1]);
assert.equal(sourceHeaders.length,63);
const ctrIndex=sourceHeaders.indexOf('CTR_NO');
const getBaseRows=data=>data.entries.map((u,i)=>sourceHeaders.map(h=>h==='CTR_NO'?u.ctrNo:h==='GROSS'?u.gross:h==='BOOK_NO'?`REF-${i}`:null));
const u=(ctrNo,lengthFt,offsetFt,gross=10000)=>({ctrNo,lengthFt,offsetFt,gross});
const w=(displaySeq,wagonNo,units,centerRuleApplied=false,capacityFt=60)=>({displaySeq,wagonNo,units,centerRuleApplied,capacityFt});
const list={trainNo:50418,date:'02.11.2026',entries:[u('AABB1234567',40,0),u('CCDD2345678',20,0),u('EEFF3456789',40,0),u('GGHH4567890',20,0)]};
const reversePlan={planned:3,reverse:true,wagons:[
  w(1,'318049530001',[u('CCDD2345678',20,40),u('AABB1234567',40,0)],false),
  w(2,'318049530002',[u('EEFF3456789',40,10)],true)
]};

test('v12: genau 63 unveraenderte Basisspalten plus zwei neue TOPX-Vorplanfelder',()=>{
 const out=coparn.build(reversePlan,list,sourceHeaders,getBaseRows);
 assert.equal(out.headers.length,65);
 assert.deepEqual(out.headers.slice(0,63),sourceHeaders);
 assert.deepEqual(out.headers.slice(-2),['Plan Wagon No','Plan Loc']);
 assert.equal(out.rows.length,4);
 for(const row of out.rows)assert.equal(row.length,65);
});

test('v12: physische Reihenfolge, echte Wagennummer und versetzte Stellplatzangaben',()=>{
 const out=coparn.build(reversePlan,list,sourceHeaders,getBaseRows);
 assert.deepEqual(out.rows.map(r=>r[ctrIndex]),['AABB1234567','CCDD2345678','EEFF3456789','GGHH4567890']);
 assert.deepEqual(out.rows.map(r=>r.at(-2)),['318049530001','318049530001','318049530002',null]);
 assert.deepEqual(out.rows.map(r=>r.at(-1)),['NEXORA:0-40FT','NEXORA:40-60FT','NEXORA:10-50FT:MITTIG',null]);
 assert.equal(out.rows[0][sourceHeaders.indexOf('BOOK_NO')],'REF-0');
 assert.equal(out.rows[1][sourceHeaders.indexOf('BOOK_NO')],'REF-1');
 assert.equal(out.unplanned,1);assert.equal(out.planned,3);assert.equal(out.reverse,true);
});

test('v12: originale Quellreihen bleiben intakt, auch nach physischer Umkehr',()=>{
 const out=coparn.build({...reversePlan,wagons:[...reversePlan.wagons].reverse(),reverse:false},list,sourceHeaders,getBaseRows);
 assert.deepEqual(out.rows.map(r=>r[ctrIndex]),['EEFF3456789','AABB1234567','CCDD2345678','GGHH4567890']);
 assert.equal(out.rows[0][sourceHeaders.indexOf('BOOK_NO')],'REF-2');
});

test('v12: keine doppelte, erfundene oder ungültig versetzte Zuordnung',()=>{
 const dup={...reversePlan,wagons:[w(1,'318049530001',[u('AABB1234567',20,0),u('AABB1234567',20,20)])]};
 assert.throws(()=>coparn.build(dup,list,sourceHeaders,getBaseRows),/doppelt/i);
 assert.throws(()=>coparn.build({...reversePlan,wagons:[w(1,'318049530001',[u('XXXX0000001',20,0)])]},list,sourceHeaders,getBaseRows),/unvollstaendig/i);
 assert.throws(()=>coparn.build({...reversePlan,wagons:[w(1,'318049530001',[u('AABB1234567',40,40)])]},list,sourceHeaders,getBaseRows),/Stellplatzlage/);
 assert.throws(()=>coparn.build(reversePlan,list,sourceHeaders.slice(0,62),getBaseRows),/63-spaltige/);
});

test('v12: keine doppelte Containernummer in Quell-COPARN',()=>{
 const badList={...list,entries:[list.entries[0],list.entries[0]]};
 assert.throws(()=>coparn.build(reversePlan,badList,sourceHeaders,getBaseRows),/Doppelte/);
});
