/* NEXORA Train Planner – experimenteller TFG-COPARN-Export (v13).
 * 63 originale Spalten plus Plan Wagon No und Plan Loc. Das Schema
 * R <Gleis> <Wagenfolge> <Startslot> [M] <Ebene> ist anhand von TOPX-
 * Screenshots rekonstruiert, NICHT als TOPS-Importformat bestaetigt.
 * Reine lokale Datei; nie automatisch an TOPS/TopO/TOPX senden.
 */
(function(root){
  'use strict';
  const additionalHeaders=['Plan Wagon No','Plan Loc'];
  const norm=value=>String(value??'').trim().toUpperCase().replace(/\s+/g,'');
  function trackNumber(value){
    const valueText=String(value??'').trim();
    if(!/^\d{2,4}$/.test(valueText)||Number(valueText)===0)
      throw new Error('Bitte vor dem COPARN-Testexport eine gültige numerische TOPX-Gleisnummer eingeben (z. B. 411 oder 413).');
    return valueText;
  }
  function physicalWagonSeq(wagon){
    const seq=Number(wagon.displaySeq);
    if(!Number.isInteger(seq)||seq<1||seq>99)
      throw new Error('TOPX-Wagenfolge fehlt oder liegt außerhalb 01–99.');
    return String(seq).padStart(2,'0');
  }
  function validateUnit(unit,wagon){
    const start=Number(unit.offsetFt),length=Number(unit.lengthFt),capacity=Number(wagon.capacityFt);
    if(!Number.isFinite(start)||!Number.isFinite(length)||!Number.isFinite(capacity)||
      start<0||![20,40].includes(length)||capacity<length||start+length>capacity+0.00001)
      throw new Error(`Ungültige schematische Stellplatzlage von ${unit.ctrNo||'Container'}.`);
    return {start,length,capacity};
  }
  function planLoc(track,wagon,startSlot,centered){
    const gleis=trackNumber(track),seq=physicalWagonSeq(wagon);
    if(!Number.isInteger(startSlot)||startSlot<1||startSlot>99)
      throw new Error('Ungültige TOPX-Anfangsstellplatznummer.');
    const slot=String(startSlot).padStart(2,'0');
    // 01 M ist aus dem beobachteten TOPX-Beispiel für mittige Einzelbeladung.
    return `R ${gleis} ${seq} ${slot}${centered?' M':''} 1`;
  }
  function build(plan,listData,baseHeaders,makeBaseRows,options){
    if(!plan||!Array.isArray(plan.wagons)||!listData||!Array.isArray(listData.entries))
      throw new Error('Erst die Zugverplanung berechnen.');
    if(!Array.isArray(baseHeaders)||baseHeaders.length!==63||typeof makeBaseRows!=='function')
      throw new Error('Die 63-spaltige TFG-COPARN-Vorlage ist nicht verfügbar.');
    if(additionalHeaders.some(h=>baseHeaders.includes(h)))
      throw new Error('Die TFG-Vorlage enthält bereits Planfelder. Doppelten Export abbrechen.');
    const gleis=trackNumber(options?.track);
    const baseRows=makeBaseRows(listData);
    if(baseRows.length!==listData.entries.length||baseRows.some(row=>!Array.isArray(row)||row.length!==baseHeaders.length))
      throw new Error('TFG-COPARN-Zeilen und Ladeliste stimmen nicht überein.');
    const ctrIndex=baseHeaders.indexOf('CTR_NO');
    if(ctrIndex<0)throw new Error('CTR_NO fehlt in der Exportvorlage.');
    const sourceMap=new Map();
    baseRows.forEach((row,i)=>{
      const ctr=norm(row[ctrIndex]);
      if(!ctr||sourceMap.has(ctr))throw new Error(`Doppelte/ungültige Containernummer in der COPARN: ${ctr||'(leer)'}`);
      sourceMap.set(ctr,{row,index:i});
    });
    const headers=[...baseHeaders,...additionalHeaders],rows=[],seen=new Set(),wagonSeqSet=new Set();
    // Physische Reihenfolge des aktuell berechneten Plans; Wagenfolge ist 01..N
    // auch wenn die Wagenreihung gedreht wurde (v7). Echte WAG_NO bleibt erhalten.
    for(const wagon of plan.wagons){
      const wagonNo=String(wagon.wagonNo??'').trim();
      if(!Array.isArray(wagon.units))throw new Error('Wageneinheiten fehlen im Ladeplan.');
      if(!wagon.units.length)continue;
      if(!/^\d{8,14}$/.test(wagonNo))
        throw new Error('Wagennummer konnte nicht eindeutig erkannt werden.');
      const seq=physicalWagonSeq(wagon);
      if(wagonSeqSet.has(seq))throw new Error('Die angezeigte Wagenfolge ist nicht eindeutig.');
      wagonSeqSet.add(seq);
      const units=[...wagon.units].sort((a,b)=>Number(a.offsetFt)-Number(b.offsetFt)||a.inputIndex-b.inputIndex);
      let nextSlot=1,previousEnd=-1;
      const centered=units.length===1&&(Boolean(wagon.centerRuleApplied)||
        (Number(units[0].offsetFt)>0 && Number(units[0].lengthFt)<Number(wagon.capacityFt)));
      for(const unit of units){
        const {start,length,capacity}=validateUnit(unit,wagon);
        if(start+0.00001<previousEnd)throw new Error('Überlappende Containerlage – COPARN-Testexport abgebrochen.');
        previousEnd=start+length;
        const ctr=norm(unit.ctrNo),source=sourceMap.get(ctr);
        if(!source||seen.has(ctr))throw new Error(`Zuordnung unvollständig oder doppelt: ${ctr}`);
        const usedSlots=length/20;
        if(nextSlot+usedSlots-1>capacity/20)
          throw new Error('Mehr TOPX-Stellplätze belegt als Wagenkapazität.');
        seen.add(ctr);
        rows.push([...source.row,wagonNo,planLoc(gleis,wagon,nextSlot,centered)]);
        nextSlot+=usedSlots;
      }
    }
    // Nicht verplante Einheiten unverändert in COPARN behalten, Planfelder leer.
    for(const [ctr,source] of sourceMap){
      if(seen.has(ctr))continue;
      rows.push([...source.row,null,null]);
    }
    if(rows.length!==listData.entries.length||seen.size!==Number(plan.planned))
      throw new Error('Unterschiedliche Containermengen: COPARN-Export abgebrochen.');
    return {headers,rows,planned:seen.size,unplanned:rows.length-seen.size,
      reverse:Boolean(plan.reverse),fieldFormat:'TOPX_LIKE_UNVERIFIED',track:gleis,
      trainNo:listData.trainNo,date:listData.date};
  }
  const api={additionalHeaders,trackNumber,planLoc,build};
  root.NexoraPlannerCoparn=api;
  if(typeof module!=='undefined'&&module.exports)module.exports=api;
})(typeof window!=='undefined'?window:globalThis);
