/* NEXORA Train Planner — unverbindlicher Entwurf, KEINE Verladefreigabe.
   Reine Berechnungslogik, ohne Abhängigkeit von DOM oder Backend. */
(function (root) {
  'use strict';
  const calibrationMeters = 700; // Nutzerangabe: 700 m reichen ungefähr von Yardposition 1 bis 100.
  const fieldWidth = 99;
  const stable = (a,b) => String(a).localeCompare(String(b),'de',{numeric:true});
  // TFG Excel: Leercontainer = L -> FE = E. Reeder is optional.
  // Never infer a HAPAG affiliation merely from a container prefix (e.g. HLBU).
  function isEmptyHapag(unit) {
    if (String(unit?.fe || '').trim().toUpperCase() !== 'E') return false;
    const owner = String(unit?.carrier || unit?.shipper || '').trim().toUpperCase();
    return /HAPAG[\s-]*LLOYD|\bHAPAG\b/.test(owner);
  }
  function classifyWagon(w) {
    const ax=Number(w.axles), lup=Number(w.lup); // LüP aus MITVEAN in Dezimetern
    if (ax===2 && lup>=137 && lup<=142) return 40;
    if (ax===4 && lup>=193 && lup<=201) return 60;
    if (ax===4 && lup>=255 && lup<=261) return 80;
    if (ax===6 && lup>=259 && lup<=271) return 80;
    return null; // unbekannt: nicht verplanen
  }
  function parseYardLocation(value) {
    const raw=String(value??'').trim().replace(/\s+/g,' ');
    // Bsp. "K 30 C 4", "A 15 B 1", "D2H 99 D 2"; kein Ableiten aus Rail-Out/Sondercode.
    const match=raw.match(/^([A-Z][A-Z0-9]{0,4})\s+(\d{1,3})\s+([A-Z])\s+([1-9]\d?)$/i);
    if (!match) return {raw,valid:false,position:null,level:null};
    const position=Number(match[2]),level=Number(match[4]);
    if (position<1||position>100||level>9) return {raw,valid:false,position:null,level:null};
    return {raw,valid:true,zone:match[1].toUpperCase(),position,row:match[3].toUpperCase(),level};
  }
  function normalizeYard(rows) {
    const byCtr=new Map(), warnings=[], duplicates=new Set();
    for (const item of rows||[]) {
      const ctrNo=String(item.ctrNo||'').trim().toUpperCase().replace(/\s/g,'');
      if (!ctrNo)continue;
      if (byCtr.has(ctrNo)){duplicates.add(ctrNo);continue;}
      const parsed=parseYardLocation(item.location);
      byCtr.set(ctrNo, {...parsed,ctrNo});
    }
    if(duplicates.size)warnings.push(`${duplicates.size} Containernummern kommen mehrfach im Yard-Abzug vor. Erste Position verwendet.`);
    return {byCtr,warnings};
  }
  function normalizeUnits(entries, yardRows) {
    const lookup=normalizeYard(yardRows), seen=new Set(), unplanned=[], groups=new Map();
    let yardMatches=0, unknownMatches=0;
    for(let i=0;i<entries.length;i++){
      const e=entries[i];
      const ctrNo=String(e.ctrNo||'').trim().toUpperCase().replace(/\s/g,'');
      const destination=String(e.pod||'').trim();
      const destinationRaw=String(e.destinationRaw||destination).trim();
      const lengthFt=Number(e.lengthFt);
      const gross=Number(e.gross);
      const yard=lookup.byCtr.get(ctrNo);
      const yardPosition=yard?.valid?yard.position:null;
      if(yardPosition!==null) yardMatches++;
      else if(yard) unknownMatches++;
      const unit={...e,inputIndex:i,ctrNo,destination,destinationRaw,lengthFt,
        gross:Number.isFinite(gross)&&gross>0?gross:null,
        yardLocation:yard?.valid?yard.raw:'COMMUNITY',yardPosition,
        yardLevel:yard?.valid?yard.level:null,
        yardSource:yard?.valid?'YARD':(yard?'NICHT_ZUORDENBAR':'COMMUNITY')};
      let reason='';
      if(!ctrNo) reason='Containernummer fehlt';
      else if(seen.has(ctrNo))reason='Doppelte Containernummer';
      seen.add(ctrNo);
      if(!reason&&!destination)reason='Zielbahnhof unbekannt';
      if(!reason&&![20,40].includes(lengthFt))reason=`Containerlänge ${e.lengthFt||'?'} nicht unterstützt`;
      if(!reason&&unit.gross===null)reason='Bruttogewicht fehlt oder ist ungültig';
      if(reason){unplanned.push({...unit,reason});continue;}
      if(!groups.has(destination))groups.set(destination,[]);
      groups.get(destination).push(unit);
    }
    return {groups,unplanned,yardMatches,unknownMatches,yardEntries:lookup.byCtr.size,yardWarnings:lookup.warnings};
  }
  function wagonLayout(wagons, reverse=false){
    const sorted=[...wagons].map(w=>({...w,capacityFt:classifyWagon(w),destination:null,
      units:[],assignedFt:0,assignedGrossKg:0,centerRuleApplied:false})).sort((a,b)=>Number(a.lnr)-Number(b.lnr));
    if(reverse)sorted.reverse();
    const totalMeters=sorted.reduce((s,w)=>s+(Number(w.lup)||0)/10,0);
    // Position 100 = letztes Wagenende. Länge wird von rechts nach links abgetragen.
    let cursor=100-totalMeters*fieldWidth/calibrationMeters;
    for(const w of sorted){
      const lengthMeters=(Number(w.lup)||0)/10;
      w.positionStart=cursor;
      w.positionEnd=cursor+lengthMeters*fieldWidth/calibrationMeters;
      w.positionCenter=(w.positionStart+w.positionEnd)/2;
      cursor=w.positionEnd;
    }
    return {wagons:sorted,totalMeters};
  }
  function placements(pack,w){
    const total=pack.reduce((s,u)=>s+u.lengthFt,0);
    const centered=pack.length===1 && ((w.axles===2&&w.capacityFt===40&&pack[0].lengthFt===20) ||
      (w.axles===4&&w.capacityFt===60&&[20,40].includes(pack[0].lengthFt)));
    const ordered=[...pack].sort((a,b)=>b.lengthFt-a.lengthFt || a.inputIndex-b.inputIndex);
    let cursor=(w.capacityFt-total)/2;
    return {units:ordered.map(u=>{const x={...u,offsetFt:cursor};cursor+=u.lengthFt;return x;}),centered};
  }
  function choosePack(w,remaining,variation){
    if(!w.capacityFt)return null;
    const near=arr=>arr.sort((a,b)=>{
      const da=a.yardPosition===null?60:Math.abs(a.yardPosition-w.positionCenter);
      const db=b.yardPosition===null?60:Math.abs(b.yardPosition-w.positionCenter);
      return da-db || a.inputIndex-b.inputIndex;
    });
    const twenties=near(remaining.filter(u=>u.lengthFt===20));
    const forties=near(remaining.filter(u=>u.lengthFt===40));
    let best=null;
    for(let n40=0;n40<=Math.min(2,forties.length,Math.floor(w.capacityFt/40));n40++){
      for(let n20=0;n20<=Math.min(4,twenties.length,Math.floor((w.capacityFt-40*n40)/20));n20++){
        const ft=n40*40+n20*20;if(!ft)continue;
        const selected=[...forties.slice(0,n40),...twenties.slice(0,n20)];
        const known=selected.filter(u=>u.yardPosition!==null);
        const travel=known.reduce((s,u)=>s+Math.abs(u.yardPosition-w.positionCenter),0);
        const avg=known.length?travel/known.length:0;
        // Hauptziel: vollständige Auslastung / wenig verschenkten Wagenplatz;
        // bei vergleichbarer Auslastung die Nähe zum Yard maximieren.
        const util=ft/w.capacityFt;
        const score=ft*12 - (w.capacityFt-ft)*7 - avg*(variation===2?2.0:1.0)
          - (known.length?travel*.15:0) + (variation===1?n20*.25:n40*.25);
        if(!best||score>best.score)best={selected,ft,score,travel,avg,util};
      }
    }
    return best;
  }
  function travel(w, units) {
    return units.reduce((sum,u)=>sum+(u.yardPosition===null?0:Math.abs(u.yardPosition-w.positionCenter)),0);
  }
  function assignUnits(w, units) {
    const result=placements(units,w);
    w.units=result.units;
    w.destination=w.units.length?w.units[0].destination:null;
    w.assignedFt=w.units.reduce((s,u)=>s+u.lengthFt,0);
    w.assignedGrossKg=w.units.reduce((s,u)=>s+u.gross,0);
    w.centerRuleApplied=result.centered;
  }
  function improveLocality(wagons) {
    // Verteilung zunächst vollständig ermitteln; erst danach überflüssige
    // Yard-Fahrten durch lokale Vertauschung ohne Zielmix oder Mengenverlust reduzieren.
    // Keine Kran-Arbeitslastverteilung als eigenes Ziel.
    for (let pass=0;pass<5;pass++) {
      let changed=false;
      // Ganze Wagenbelegungen tauschen, wenn sie auf den neuen Wagen passen.
      for(let i=0;i<wagons.length;i++)for(let j=i+1;j<wagons.length;j++) {
        const a=wagons[i],b=wagons[j];
        if(!a.units.length||!b.units.length||
           a.capacityFt<b.assignedFt||b.capacityFt<a.assignedFt)continue;
        const before=travel(a,a.units)+travel(b,b.units);
        const after=travel(a,b.units)+travel(b,a.units);
        if(after+0.00001<before) {
          const aa=a.units,bb=b.units;
          assignUnits(a,bb);assignUnits(b,aa);
          changed=true;
        }
      }
      // Einzelne Container gleicher Länge dürfen zwischen Wagen DESSELBEN
      // Zielterminals getauscht werden. Stellplatzlängen bleiben unverändert.
      for(let i=0;i<wagons.length;i++)for(let j=i+1;j<wagons.length;j++) {
        const a=wagons[i],b=wagons[j];
        if(!a.units.length||!b.units.length||a.destination!==b.destination)continue;
        outer:for(let ai=0;ai<a.units.length;ai++)for(let bi=0;bi<b.units.length;bi++) {
          const au=a.units[ai],bu=b.units[bi];
          if(au.lengthFt!==bu.lengthFt)continue;
          const before=travel(a,[au])+travel(b,[bu]);
          const after=travel(a,[bu])+travel(b,[au]);
          if(after+0.00001<before) {
            const aUnits=[...a.units],bUnits=[...b.units];
            aUnits[ai]=bu;bUnits[bi]=au;
            assignUnits(a,aUnits);assignUnits(b,bUnits);
            changed=true;
            break outer;
          }
        }
      }
      if(!changed)break;
    }
  }
  function simulate(layout, groups, mode){
    const wagons=layout.wagons.map(w=>({...w,units:[]}));
    const avail=wagons.filter(w=>w.capacityFt!==null);
    const unplanned=[];
    const makeWork=(wantEmpty)=>[...groups.entries()].map(([destination,entries])=>{
      const units=entries.filter(u=>(String(u.fe||'').trim().toUpperCase()==='E')===wantEmpty);
      const known=units.filter(u=>u.yardPosition!==null);
      return {destination,units,ft:units.reduce((s,u)=>s+u.lengthFt,0),
        center:known.reduce((s,u)=>s+u.yardPosition,0)/(known.length||1)};
    }).filter(g=>g.units.length);
    const sortWork=work=>{
      if(mode===1)work.sort((a,b)=>a.ft-b.ft || stable(a.destination,b.destination));
      else if(mode===2)work.sort((a,b)=>a.center-b.center || b.ft-a.ft);
      else work.sort((a,b)=>b.ft-a.ft || stable(a.destination,b.destination));
      return work;
    };
    const fullWork=sortWork(makeWork(false));
    const emptyWork=sortWork(makeWork(true));
    // Verbindliche Priorität: Erst sämtliche Vollcontainer verplanen.
    // Ein Leercontainer darf KEINEN Platz belegen, der noch für einen passenden
    // Vollcontainer benötigt wird. Erst danach werden Leercontainer ergänzt.
    function putOnFreeWagons(group,reason){
      while(group.units.length && avail.length){
        const options=avail.map(w=>({wagon:w,pack:choosePack(w,group.units,mode)})).filter(x=>x.pack);
        if(!options.length)break;
        options.sort((a,b)=>b.pack.score-a.pack.score || a.pack.travel-b.pack.travel ||
          a.wagon.positionCenter-b.wagon.positionCenter);
        const {wagon,pack}=options[0];
        assignUnits(wagon,pack.selected);
        const used=new Set(pack.selected.map(u=>u.inputIndex));
        group.units=group.units.filter(u=>!used.has(u.inputIndex));
        avail.splice(avail.indexOf(wagon),1);
      }
      for(const u of group.units)unplanned.push({...u,reason});
    }
    for(const group of fullWork){
      putOnFreeWagons(group,'Vollcontainer: kein verfügbarer passender Wagen / Stellplatz für diesen Zielbahnhof');
    }
    // Nur nach der Verplanung aller Vollcontainer: Leereinheiten möglichst
    // in freie Restplätze von Wagen desselben Zielbahnhofs ergänzen.
    for(const group of emptyWork){
      for(const w of wagons){
        if(!group.units.length)break;
        if(!w.units.length || w.destination!==group.destination)continue;
        const remainingFt=w.capacityFt-w.assignedFt;
        if(remainingFt<20)continue;
        const pack=choosePack({...w,capacityFt:remainingFt},group.units,mode);
        if(!pack)continue;
        assignUnits(w,[...w.units,...pack.selected]);
        const used=new Set(pack.selected.map(u=>u.inputIndex));
        group.units=group.units.filter(u=>!used.has(u.inputIndex));
      }
    }
    for(const group of emptyWork){
      putOnFreeWagons(group,'Leercontainer zurückgestellt: kein verbleibender passender Stellplatz');
    }
    improveLocality(wagons);
    const planned=wagons.reduce((s,w)=>s+w.units.length,0);
    const plannedFull=wagons.reduce((s,w)=>s+w.units.filter(u=>String(u.fe||'').trim().toUpperCase()!=='E').length,0);
    const plannedEmpty=planned-plannedFull;
    const totalDistance=wagons.reduce((s,w)=>s+w.units.reduce((acc,u)=>acc+
      (u.yardPosition===null?0:Math.abs(u.yardPosition-w.positionCenter)),0),0);
    const yardPlanned=wagons.reduce((s,w)=>s+w.units.filter(u=>u.yardPosition!==null).length,0);
    const unusedSpace=wagons.reduce((s,w)=>s+(w.units.length?(w.capacityFt-w.assignedFt):0),0);
    return {wagons,unplanned,planned,plannedFull,plannedEmpty,totalDistance,yardPlanned,unusedSpace};
  }
  function allocate(wagonInput, entriesInput, yardInput=[], options={}){
    const reverse=Boolean(options && options.reverse);
    const layout=wagonLayout(wagonInput,reverse);
    const normalized=normalizeUnits(entriesInput,yardInput);
    const attempts=[0,1,2].map(m=>simulate(layout,normalized.groups,m));
    // Die Priorität der Vollcontainer schlägt die Gesamtanzahl und die Yardnähe.
    attempts.sort((a,b)=>b.plannedFull-a.plannedFull || b.planned-a.planned ||
      a.unusedSpace-b.unusedSpace || a.totalDistance-b.totalDistance);
    const best=attempts[0];
    const unplanned=[...normalized.unplanned,...best.unplanned];
    const wagons=best.wagons;
    return {wagons,unplanned,planned:best.planned,plannedFull:best.plannedFull,
      plannedEmpty:best.plannedEmpty,reverse,total:entriesInput.length,
      destinations:[...normalized.groups.keys()],activeWagons:wagons.filter(w=>w.units.length).length,
      totalGrossKg:wagons.reduce((s,w)=>s+w.assignedGrossKg,0),
      capacityFt:wagons.reduce((s,w)=>s+(w.capacityFt||0),0),
      usedFt:wagons.reduce((s,w)=>s+(w.assignedFt||0),0),
      totalMeters:layout.totalMeters,estimatedTravelPositions:best.totalDistance,
      yardPlanned:best.yardPlanned,yardMatches:normalized.yardMatches,
      yardEntries:normalized.yardEntries,unknownMatches:normalized.unknownMatches,
      yardWarnings:normalized.yardWarnings,unknownWagons:wagons.filter(w=>w.capacityFt===null),
      loadLimitsVerified:false,loadPositionsVerified:false};
  }
  const engine={classifyWagon,parseYardLocation,normalizeYard,allocate,isEmptyHapag};
  root.NexoraPlannerEngine=engine;
  if(typeof module!=='undefined'&&module.exports)module.exports=engine;
})(typeof window!=='undefined'?window:globalThis);
