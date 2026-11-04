/* NEXORA Train Planner – experimenteller TFG-COPARN-Export.
 * Baut auf der unveraenderten 63-Spalten-TFG-Exportvorlage auf. Die zwei
 * Zusatzspalten sind vorlaeufige NEXORA-Planungsfelder, KEIN bestaetigtes
 * TOPS-/TopO-/TOPX-Importformat. Lokal im Browser, keine Serveranbindung.
 */
(function(root){
  'use strict';
  const additionalHeaders=['Plan Wagon No','Plan Loc'];
  const norm=value=>String(value??'').trim().toUpperCase().replace(/\s+/g,'');
  const ft=value=>{
    const n=Number(value);
    if(!Number.isFinite(n))throw new Error('Schematische Containerposition fehlt. COPARN-Testdatei nicht erstellt.');
    return String(Number(n.toFixed(2)));
  };
  // Die exakten TOPX-Gleis-/Stellplatzcodes (z.B. R 30 01 1) sind unbekannt.
  // Deshalb bewusst ein klar gekennzeichnetes NEXORA-internes Testformat.
  function planLoc(unit,wagon){
    const start=Number(unit.offsetFt),length=Number(unit.lengthFt),capacity=Number(wagon.capacityFt);
    if(!Number.isFinite(start)||!Number.isFinite(length)||!Number.isFinite(capacity)||
      start<0||length<=0||start+length>capacity+0.00001)
      throw new Error(`Ungueltige Stellplatzlage von ${unit.ctrNo||'Container'}.`);
    return `NEXORA:${ft(start)}-${ft(start+length)}FT${wagon.centerRuleApplied?':MITTIG':''}`;
  }
  function build(plan, listData, baseHeaders, makeBaseRows){
    if(!plan||!Array.isArray(plan.wagons)||!listData||!Array.isArray(listData.entries))
      throw new Error('Erst die Zugverplanung berechnen.');
    if(!Array.isArray(baseHeaders)||baseHeaders.length!==63||typeof makeBaseRows!=='function')
      throw new Error('Die 63-spaltige TFG-COPARN-Vorlage ist nicht verfuegbar.');
    if(additionalHeaders.some(h=>baseHeaders.includes(h)))
      throw new Error('Die TFG-Vorlage enthaelt bereits Planfelder. Doppelten Export abbrechen.');
    const baseRows=makeBaseRows(listData);
    if(baseRows.length!==listData.entries.length||baseRows.some(row=>!Array.isArray(row)||row.length!==baseHeaders.length))
      throw new Error('TFG-COPARN-Zeilen und Ladeliste stimmen nicht ueberein.');
    const ctrIndex=baseHeaders.indexOf('CTR_NO');
    if(ctrIndex<0)throw new Error('CTR_NO fehlt in der Exportvorlage.');
    const sourceMap=new Map();
    baseRows.forEach((row,i)=>{
      const ctr=norm(row[ctrIndex]);
      if(!ctr||sourceMap.has(ctr))throw new Error(`Doppelte/ungueltige Containernummer in der COPARN: ${ctr||'(leer)'}`);
      sourceMap.set(ctr,{row,index:i});
    });
    const headers=[...baseHeaders,...additionalHeaders],rows=[],seen=new Set();
    // Der Export folgt der tatsaechlich gewaehlten physischen Reihung
    // (inkl. Wagenreihung drehen), innerhalb eines Wagens nach FT-Offset.
    for(const wagon of plan.wagons){
      const wagonNo=String(wagon.wagonNo??'').trim();
      if(wagon.units.length&&!/^\d{8,14}$/.test(wagonNo))
        throw new Error('Wagennummer konnte nicht eindeutig erkannt werden.');
      const units=[...wagon.units].sort((a,b)=>Number(a.offsetFt)-Number(b.offsetFt)||a.inputIndex-b.inputIndex);
      for(const unit of units){
        const ctr=norm(unit.ctrNo),source=sourceMap.get(ctr);
        if(!source||seen.has(ctr))throw new Error(`Zuordnung unvollstaendig oder doppelt: ${ctr}`);
        seen.add(ctr);
        rows.push([...source.row,wagonNo,planLoc(unit,wagon)]);
      }
    }
    // Auch rueckgestellte Container bleiben in der COPARN: ihre Planfelder
    // bleiben sichtbar LEER, statt eine nicht existente Zuordnung zu erfinden.
    for(const [ctr,source] of sourceMap){
      if(seen.has(ctr))continue;
      rows.push([...source.row,null,null]);
    }
    if(rows.length!==listData.entries.length||seen.size!==Number(plan.planned))
      throw new Error('Unterschiedliche Containermengen: COPARN-Export abgebrochen.');
    return {headers,rows,planned:seen.size,unplanned:rows.length-seen.size,
      reverse:Boolean(plan.reverse),fieldFormat:'NEXORA_SCHEMATIC_NOT_TOPX',
      trainNo:listData.trainNo,date:listData.date};
  }
  const api={additionalHeaders,planLoc,build};
  root.NexoraPlannerCoparn=api;
  if(typeof module!=='undefined'&&module.exports)module.exports=api;
})(typeof window!=='undefined'?window:globalThis);
