/* NEXORA – TFG Train Planner. Lokale Verarbeitung, bestehende Converter unverändert. */
(function(){
  'use strict';
  const panel=document.querySelector('.panel');
  const page=document.createElement('section');
  page.id='plannerPage';page.className='planner hidden';
  page.innerHTML=`
    <div class="planner-head"><div class="planner-eyebrow">TFG · AUSGANG</div>
      <h3>Train Planner <span class="planner-beta">BETA · PRÜFENTWURF</span></h3>
      <p>Wagenliste und TFG-Ladeliste laden. Der Yard-Abzug ist optional und kann jederzeit ergänzt werden.</p></div>
    <div class="planner-alert"><strong>Keine Verladefreigabe</strong>
      Die Zuteilung ist ein unverbindlicher Planungsentwurf. Die zulässigen Verriegelungspositionen,
      tatsächlichen Wagenlastgrenzen, Achslastverteilung, Containerkombinationen und Gefahrgutvorgaben
      sind noch nicht technisch geprüft. Vor einer realen Verladung fachlich freigeben lassen.</div>
    <div class="planner-uploads">
      <label class="planner-upload" for="plannerWagons"><span>01 · PFLICHT</span><strong>MITVEAN-Wagenliste</strong><small id="plannerWagonName">Wagenlisten-PDF auswählen</small><input id="plannerWagons" type="file" accept=".pdf,application/pdf"></label>
      <label class="planner-upload" for="plannerList"><span>02 · PFLICHT</span><strong>TFG-Ladeliste</strong><small id="plannerListName">Excel-Datei · Blatt „Export“</small><input id="plannerList" type="file" accept=".xlsx,.xls"></label>
      <label class="planner-upload planner-upload-optional" for="plannerYard"><span>03 · OPTIONAL</span><strong>Yard-Abzug</strong><small id="plannerYardName">Ohne Yard-Abzug = COMMUNITY</small><input id="plannerYard" type="file" accept=".xlsx,.xls"></label>
    </div>
    <div class="planner-controls"><label><input type="checkbox" id="plannerDemoDates"> Abweichende Listendaten für einen reinen Demonstrationstest zulassen</label>
      <div class="planner-actions"><button id="plannerRemoveYard" class="ghost-btn hidden" type="button">Yard-Abzug entfernen</button>
      <button id="plannerRun" class="primary-btn" type="button">Verplanung berechnen →</button></div></div>
    <div id="plannerMessage" class="planner-message hidden" role="status" aria-live="polite"></div>
    <div id="plannerOutput" class="hidden">
      <div id="plannerMetrics" class="planner-metrics"></div>
      <div class="planner-output-head"><div><h4>Grafischer Zug · Wagenfolge</h4><p>Alle Containerdaten direkt sichtbar. Schematische Positionen, nicht maßstabsgetreue Verriegelung.</p></div>
      <div class="planner-export-actions"><button id="plannerPrint" class="primary-btn" type="button" title="Gesamten Zug auf einer DIN-A4-Seite im Querformat drucken oder als PDF speichern">Steckübersicht drucken · DIN A4</button><button id="plannerDownload" class="ghost-btn" type="button">Planungsentwurf als CSV ↓</button></div></div>
      <div id="plannerWarnings"></div>
      <div class="planner-legend planner-legend-v2"><span><i class="planner-legend-red"></i> Container</span><span><i class="planner-legend-green"></i> Leere HAPAG-Container</span><span>Gleisposition 1–100 · Zugende bei 100</span></div>
      <section class="planner-train-panel" aria-label="Horizontaler Zugladeplan">
        <div class="planner-train-titlebar"><span class="planner-title-icon" aria-hidden="true">▣</span><strong>TFG · Zugverplanung</strong><span class="planner-train-status">SCHEMATISCHER ENTWURF</span></div>
        <div class="planner-train-toolbar"><span id="plannerTrainInfo">Zugansicht</span><div class="planner-train-nav"><button id="plannerScrollLeft" class="planner-scroll-button" type="button" title="Nach links scrollen" aria-label="Nach links scrollen">◀</button><button id="plannerScrollRight" class="planner-scroll-button" type="button" title="Nach rechts scrollen" aria-label="Nach rechts scrollen">▶</button></div></div>
        <div id="plannerWagonList" class="planner-wagon-list" tabindex="0" role="region" aria-label="Zug mit horizontaler Scrollfunktion"><div id="plannerWagonTrack" class="planner-wagon-track"></div></div>
        <div class="planner-train-footer"><span>← Seitlich scrollen · Pfeiltasten oder Scrollleiste →</span><span>Reihenfolge gemäß MITVEAN · nicht maßstabsgerecht</span></div>
      </section>
      <div class="planner-unplanned"><h4>Nicht verplante Container</h4><div id="plannerUnplanned"></div></div>
    </div>`;
  panel.parentNode.insertBefore(page,panel.nextSibling);
  const $=id=>document.getElementById(id);
  const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const kg=n=>n===null||n===undefined||!Number.isFinite(Number(n))?'–':Math.round(Number(n)).toLocaleString('de-DE')+' kg';
  const pos=n=>Number.isFinite(n)?n.toFixed(1).replace('.',','):'–';
  let parsed=null,latest=null;
  function showMessage(message,kind='error'){
    const b=$('plannerMessage');b.className='planner-message '+kind;b.textContent=message;
  }
  function activate(){page.classList.remove('hidden');panel.classList.add('hidden');}
  function deactivate(){page.classList.add('hidden');}
  window.NexoraPlanner={activate,deactivate};
  function headerKey(v){return String(v??'').toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]/g,'');}
  function parseYardFile(bytes){
    const workbook=XLSX.read(bytes,{type:'array',cellDates:false,raw:true});
    for(const name of workbook.SheetNames){
      const sheet=workbook.Sheets[name];
      const matrix=XLSX.utils.sheet_to_json(sheet,{header:1,defval:null,raw:true});
      for(let r=0;r<Math.min(matrix.length,12);r++){
        const headers=(matrix[r]||[]).map(headerKey);
        const number=headers.findIndex(x=>['containerno','containernummer','ctrno'].includes(x));
        const location=headers.findIndex(x=>['location','currentlocation','yardposition','standort','aktuellestandort'].includes(x));
        if(number<0||location<0)continue;
        const rows=[];
        for(let i=r+1;i<matrix.length;i++){
          const row=matrix[i]||[];
          const ctrNo=String(row[number]??'').trim();
          if(ctrNo)rows.push({ctrNo,location:String(row[location]??'').trim()});
        }
        if(!rows.length)throw new Error('Der Yard-Abzug enthält keine Containernummern.');
        return {rows,sheet:name};
      }
    }
    throw new Error('Yard-Abzug: Spalten „Container No“ und „Location“ (oder „Current Location“) nicht erkannt.');
  }
  function triggerInput(id){const input=$(id);input.click();}
  for(const [fileId,labelId] of [['plannerWagons','plannerWagonName'],['plannerList','plannerListName'],['plannerYard','plannerYardName']]){
    const input=$(fileId);
    input.addEventListener('change',async()=>{
      $(labelId).textContent=input.files?.[0]?.name||'Datei auswählen';
      if(fileId==='plannerYard'){
        $('plannerRemoveYard').classList.toggle('hidden',!input.files?.length);
        if(parsed && input.files?.length)await runPlanning(true);
      }else{parsed=null;latest=null;$('plannerOutput').classList.add('hidden');}
    });
    const surface=input.closest('.planner-upload');
    for(const evt of ['dragenter','dragover'])surface.addEventListener(evt,e=>{e.preventDefault();surface.classList.add('drag');});
    for(const evt of ['dragleave','drop'])surface.addEventListener(evt,e=>{e.preventDefault();surface.classList.remove('drag');});
    surface.addEventListener('drop',e=>{
      const file=e.dataTransfer?.files?.[0];if(!file)return;
      const dt=new DataTransfer();dt.items.add(file);input.files=dt.files;
      input.dispatchEvent(new Event('change'));
    });
  }
  $('plannerRemoveYard').addEventListener('click',async()=>{
    $('plannerYard').value='';$('plannerYardName').textContent='Ohne Yard-Abzug = COMMUNITY';
    $('plannerRemoveYard').classList.add('hidden');
    if(parsed)await runPlanning(true);
  });
  function unitView(u,w){
    const green=window.NexoraPlannerEngine.isEmptyHapag(u);
    const style=`left:${100*u.offsetFt/w.capacityFt}%;width:${100*u.lengthFt/w.capacityFt}%`;
    const fullInfo=`${w.destination} · ${u.ctrNo} · ${u.lengthFt} Fuß · ${u.yardLocation} · ${kg(u.gross)}${green?' · Leerer HAPAG-Container':''}`;
    return `<div class="planner-container-v2 ${green?'planner-container-hapag':'planner-container-red'}" style="${style}" title="${esc(fullInfo)}" aria-label="${esc(fullInfo)}">
      <div class="planner-container-head"><span>${esc(w.destination)} · ${u.lengthFt}'</span><span>${esc(u.fe==='E'?'L':u.fe==='F'?'V':'')}</span></div>
      <strong class="planner-container-no">${esc(u.ctrNo)}</strong>
      <span class="planner-container-yard">${esc(u.yardLocation||'COMMUNITY')}</span>
      <span class="planner-container-weight">${esc(kg(u.gross))}</span>
    </div>`;
  }
  function wagonView(w,index){
    const cap=w.capacityFt,assigned=w.units.length>0;
    const size=cap||40;
    const deck=cap?`<div class="planner-deck-v2" aria-label="Schematische Containerpositionen">${w.units.map(u=>unitView(u,w)).join('')}${!assigned?'<span class="planner-free">FREI</span>':''}</div>`:
      '<div class="planner-deck-v2 planner-deck-unknown">STELLPLÄTZE UNBEKANNT</div>';
    const n=Math.max(2,Math.min(6,Number(w.axles)||2));
    const wheels=Array.from({length:n},(_,i)=>`<i class="planner-wheel" style="left:${8+84*(i/(n-1))}%"></i>`).join('');
    const width=size*6.3;
    return `<article class="planner-wagon-v2 ${assigned?'':'planner-wagon-empty-v2'}" style="width:${width}px" aria-label="Wagen ${esc(w.lnr||index+1)}, ${esc(w.wagonNo)}">
      <div class="planner-wagon-head-v2"><div class="planner-wagon-ref"><span>WAGEN ${esc(w.lnr||index+1)}</span><strong>${esc(w.wagonNo)}</strong></div>
        <div class="planner-wagon-target">${assigned?esc(w.destination):'—'}</div></div>
      <div class="planner-wagon-spec"><span>${esc(w.axles)}A · ${cap?`${cap}'`:'Typ ?'}</span><span>${pos(w.positionStart)}–${pos(w.positionEnd)}</span></div>
      ${deck}
      <div class="planner-undercarriage"><div class="planner-carriage-frame"></div>${wheels}</div>
      <div class="planner-wagon-summary"><strong>${esc(kg(w.assignedGrossKg||0))}</strong><span>${w.units.length} Container</span></div>
      ${w.centerRuleApplied?'<div class="planner-wagon-centered">Mittige Einzelbeladung</div>':'<div class="planner-wagon-centered placeholder">&nbsp;</div>'}
    </article>`;
  }
  function render(plan,notes){
    $('plannerOutput').classList.remove('hidden');
    const metrics=[['Wagen',plan.wagons.length],['Container verplant',`${plan.planned} / ${plan.total}`],
      ['Container offen',plan.unplanned.length],['Ziele',plan.destinations.length],
      ['Ladungsgewicht',kg(plan.totalGrossKg)],['Yard-Standorte',`${plan.yardMatches} / ${plan.total}`]];
    $('plannerMetrics').innerHTML=metrics.map(([label,value])=>`<div><span>${esc(label)}</span><strong>${esc(value)}</strong></div>`).join('');
    const warnings=[
      'Nur Verplanungsvorschlag: keine geprüften Lastgrenzen, Achslasten, zulässigen Containerkombinationen und konkreten Verriegelungspositionen.',
      ...notes,
      ...plan.yardWarnings,
      ...(plan.unknownWagons.length?[`${plan.unknownWagons.length} Wagen ohne eindeutig zuordenbare Stellplatzkapazität bleiben unbeladen.`]:[]),
      ...(plan.unknownMatches?[`${plan.unknownMatches} Einheiten mit nicht als Yardposition lesbarem Standort wurden als COMMUNITY behandelt.`]:[]),
      ...(plan.yardEntries&&!plan.yardMatches?['Der Yard-Abzug enthält keine passenden, auswertbaren Stellplätze zu den Containern der Ladeliste.']:[])
    ];
    $('plannerWarnings').innerHTML=warnings.map(n=>`<p>⚠ ${esc(n)}</p>`).join('');
    const view=$('plannerWagonList');
    const previousScroll=view.scrollLeft;
    $('plannerWagonTrack').innerHTML=plan.wagons.map(wagonView).join('');
    $('plannerTrainInfo').textContent=`${plan.wagons.length} Wagen · ${plan.planned} Container · ${pos(plan.totalMeters)} m Zuglänge`;
    // Keep the viewed portion when the optional Yard extract re-optimizes a plan.
    view.scrollLeft=previousScroll;
    $('plannerUnplanned').innerHTML=plan.unplanned.length?`<div class="planner-table-wrap"><table><thead><tr><th>Container</th><th>Ziel</th><th>Yard</th><th>Größe</th><th>Gewicht</th><th>Grund</th></tr></thead><tbody>`+
      plan.unplanned.map(u=>`<tr><td>${esc(u.ctrNo)}</td><td>${esc(u.destination)}</td><td>${esc(u.yardLocation)}</td><td>${esc(u.lengthFt)}'</td><td>${esc(kg(u.gross))}</td><td>${esc(u.reason)}</td></tr>`).join('')+'</tbody></table></div>':
      '<p>Alle geeigneten Container wurden im Entwurf einem Wagen zugeordnet.</p>';
  }
  async function runPlanning(reuse){
    const wagonFile=$('plannerWagons').files?.[0],listFile=$('plannerList').files?.[0],yardFile=$('plannerYard').files?.[0];
    if(!wagonFile||!listFile)return showMessage('Bitte MITVEAN-Wagenliste und TFG-Ladeliste auswählen. Der Yard-Abzug ist optional.');
    if(!/\.pdf$/i.test(wagonFile.name)||!/\.(xlsx|xls)$/i.test(listFile.name))return showMessage('Benötigt werden eine MITVEAN-PDF und eine TFG-Excel-Datei.');
    if(yardFile&&!/\.(xlsx|xls)$/i.test(yardFile.name))return showMessage('Der Yard-Abzug muss eine Excel-Datei sein.');
    const btn=$('plannerRun');btn.disabled=true;btn.textContent='Verplanung wird berechnet …';
    try{
      if(!reuse||!parsed){
        const wagonData=await parseMitveanPdf(new Uint8Array(await wagonFile.arrayBuffer()));
        const listData=parseLadeliste(new Uint8Array(await listFile.arrayBuffer()));
        if(!listData.entries.length)throw new Error('Die TFG-Ladeliste enthält keine erkennbaren Container.');
        const notes=[];
        if(wagonData.date&&listData.date&&wagonData.date!==listData.date){
          if(!$('plannerDemoDates').checked)throw new Error(`Unterschiedliche Listendaten: Wagen ${wagonData.date}, Ladung ${listData.date}. Nur für einen Test „Demonstration“ aktivieren.`);
          notes.push(`Unterschiedliche Listendaten (${wagonData.date} / ${listData.date}). Nur zu Testzwecken verwenden.`);
        }
        if(wagonData.wagons.size!==wagonData.maxLnr)notes.push('Wagenlaufnummern enthalten möglicherweise Lücken; Wagenfolge prüfen.');
        if(listFile&&listData.warnings?.length)notes.push(...listData.warnings);
        if(wagonData.warnings?.length)notes.push(...wagonData.warnings);
        parsed={wagonData,listData,notes};
      }
      let yardRows=[];
      if(yardFile){
        const yd=parseYardFile(new Uint8Array(await yardFile.arrayBuffer()));
        yardRows=yd.rows;
      }
      const plan=window.NexoraPlannerEngine.allocate([...parsed.wagonData.wagons.values()],parsed.listData.entries,yardRows);
      if(plan.planned+plan.unplanned.length!==plan.total)throw new Error('Zuordnungsfehler: Containermengen stimmen nicht überein.');
      if(plan.wagons.some(w=>w.units.some(u=>u.destination!==w.destination)))throw new Error('Interner Fehler: Zielbahnhöfe auf demselben Wagen vermischt.');
      latest={plan};render(plan,parsed.notes);
      showMessage(yardFile?`Entwurf berechnet. ${plan.yardMatches} von ${plan.total} Containern mit Yardposition; übrige COMMUNITY.`:
        `Entwurf berechnet. Alle Container haben zunächst Standort COMMUNITY. Yard-Abzug kann nachträglich ergänzt werden.`,'success');
    }catch(err){console.error(err);showMessage(err?.message||'Verplanung fehlgeschlagen.');if(!reuse)$('plannerOutput').classList.add('hidden');}
    finally{btn.disabled=false;btn.textContent='Verplanung berechnen →';}
  }
  $('plannerRun').addEventListener('click',()=>runPlanning(false));
  const scrollView=$('plannerWagonList');
  for (const [id,direction] of [['plannerScrollLeft',-1],['plannerScrollRight',1]]) {
    $(id).addEventListener('click',()=>scrollView.scrollBy({left:direction*Math.max(450,Math.round(scrollView.clientWidth*.72)),behavior:'smooth'}));
  }
  scrollView.addEventListener('keydown',e=>{
    if(e.key!=='ArrowLeft'&&e.key!=='ArrowRight')return;
    e.preventDefault();scrollView.scrollBy({left:e.key==='ArrowRight'?310:-310,behavior:'smooth'});
  });
  // A4 landscape / single sheet. Separate print-only SVG avoids printing only
  // the currently visible slice of the horizontal (overflow-x) train track.
  // Wagon and container rectangles are strictly SCHEMATIC; no technical approval.
  const svgText=(v)=>esc(v);
  const svgn=(v)=>Number(v).toFixed(2);
  function partitionForPrint(wagons,rowCount){
    // Consecutive wagon groups, balanced by their real coupling lengths (LüP).
    // Preserves MITVEAN order and keeps the scale consistent on every line.
    const size=w=>Math.max(10,Number(w.lup)/10||20);
    const groups=[],total=wagons.reduce((a,w)=>a+size(w),0);
    let index=0,remaining=total;
    for(let row=0;row<rowCount;row++){
      const rest=rowCount-row;
      if(rest===1){groups.push(wagons.slice(index));break;}
      const target=remaining/rest;
      let running=0,stop=index;
      // Leave at least one wagon for each remaining line.
      while(stop<wagons.length-(rest-1)){
        const next=size(wagons[stop]);
        if(stop>index && Math.abs(target-running)<Math.abs(target-running-next))break;
        running+=next;stop++;
        if(running>=target)break;
      }
      stop=Math.max(index+1,stop);
      const group=wagons.slice(index,stop);
      groups.push(group);index=stop;remaining-=group.reduce((a,w)=>a+size(w),0);
    }
    return groups;
  }
  function buildPrintSvg(plan){
    const wagonCount=plan.wagons.length;
    const totalMeters=plan.wagons.reduce((a,w)=>a+Math.max(10,Number(w.lup)/10||20),0);
    const rowCount=Math.max(1,Math.min(9,Math.max(Math.ceil(totalMeters/180),Math.ceil(wagonCount/10))));
    const groups=partitionForPrint(plan.wagons,rowCount);
    const maxMeters=Math.max(...groups.map(g=>g.reduce((a,w)=>a+Math.max(10,Number(w.lup)/10||20),0)),1);
    const maxPieces=Math.max(...groups.map(g=>g.length),1);
    const horizontalScale=Math.min((1090-6*(maxPieces-1))/maxMeters,10);
    const slotWidth=1090;
    const rowStart=108,rowBottom=705,rowHeight=(rowBottom-rowStart)/rowCount;
    const rowFactor=Math.min(1,rowHeight/149);
    const svg=[];
    const box=(x,y,w,h,color,stroke='none',sw=0,rad=0)=>`<rect x="${svgn(x)}" y="${svgn(y)}" width="${svgn(w)}" height="${svgn(h)}" rx="${rad}" fill="${color}" stroke="${stroke}" stroke-width="${sw}"/>`;
    const txt=(x,y,value,size=11,color='#273f51',bold=false,opts='')=>`<text x="${svgn(x)}" y="${svgn(y)}" font-size="${svgn(size)}" font-family="Arial, Helvetica, sans-serif" fill="${color}" font-weight="${bold?700:400}" ${opts}>${svgText(value)}</text>`;
    svg.push(`<svg xmlns="http://www.w3.org/2000/svg" width="1140" height="792" viewBox="0 0 1140 792" role="img" aria-label="A4 Steckübersicht mit ${wagonCount} Wagen, Wagenfolge und schematischen 20- und 40-Fuß-Stellplätzen">`);
    svg.push(box(0,0,1140,792,'#ffffff'));
    svg.push(box(12,10,1116,54,'#d3e8f5','#95b6cd',1,5));
    svg.push(txt(27,32,'NEXORA  ·  TFG TRAIN PLANNER',18,'#164568',true));
    svg.push(txt(27,51,'STECKÜBERSICHT · GESAMTZUG',13,'#164568',true));
    svg.push(txt(1110,33,'DIN A4  ·  QUERFORMAT  ·  1 SEITE',11,'#365d79',true,'text-anchor="end"'));
    svg.push(txt(1110,51,`${wagonCount} Wagen   |   ${plan.planned}/${plan.total} Container   |   ${pos(plan.totalMeters)} m`,11,'#365d79',false,'text-anchor="end"'));
    svg.push(box(12,70,1116,29,'#fff2df','#e4ad65',1,3));
    svg.push(txt(24,89,'PRÜFENTWURF · Keine Verladefreigabe: Verriegelungspositionen, Achslasten, Traglast und Kombinationen vor Ort prüfen.',12,'#834d1b',true));
    let displayed=0;
    groups.forEach((group,rowIndex)=>{
      const y=rowStart+rowIndex*rowHeight;
      const h=rowHeight*rowFactor;
      svg.push(box(12,y+1,1116,rowHeight-3,rowIndex%2===0?'#f6f9fc':'#ffffff','#dce6ed',0.8,2));
      const first=group[0]?.lnr ?? displayed+1;
      const last=group[group.length-1]?.lnr??displayed+group.length;
      svg.push(txt(25,y+14*rowFactor,`WAGEN ${first}–${last}  →`,11*rowFactor,'#2d5a78',true));
      let x=27;
      const deckY=y+49*rowFactor,deckH=42*rowFactor;
      group.forEach((w,j)=>{
        const wagonLength=Math.max(10,Number(w.lup)/10||20);
        const width=wagonLength*horizontalScale;
        const frameX=x+1, frameW=Math.max(12,width-4);
        const destination=w.destination||'–';
        const n=String(w.wagonNo||'');
        svg.push(txt(x+2,y+27*rowFactor,`${w.lnr||displayed+j+1}`,10.4*rowFactor,'#163e5b',true));
        svg.push(txt(x+frameW-2,y+27*rowFactor,destination,9.5*rowFactor,'#b83b41',true,'text-anchor="end"'));
        // Wagon number is written in full, and shrunk slightly only when needed.
        const numberSize=Math.min(10.1,Math.max(6.8,(frameW-3)/(Math.max(n.length,1)*.61)))*rowFactor;
        svg.push(txt(x+2,y+40*rowFactor,n,numberSize,'#213b50',true));
        svg.push(box(frameX,deckY,frameW,deckH,'#f3f6f8','#8195a4',1,1));
        const capacity=Number(w.capacityFt)||0;
        if(capacity>0){
          for(let feet=20;feet<capacity;feet+=20){
            const slotX=frameX+(frameW*(feet/capacity));
            svg.push(`<path d="M ${svgn(slotX)} ${svgn(deckY)} V ${svgn(deckY+deckH)}" stroke="#c4d1da" stroke-width="1"/>`);
          }
          for(const u of w.units){
            const xUnit=frameX+(Number(u.offsetFt)/capacity)*frameW;
            const wUnit=(Number(u.lengthFt)/capacity)*frameW;
            const hue=window.NexoraPlannerEngine.isEmptyHapag(u)?'#238450':'#c93841';
            svg.push(box(xUnit+0.6,deckY+1,Math.max(1,wUnit-1.2),deckH-2,hue,'#ffffff',.8,1));
            const textSize=Math.max(7,Math.min(12, wUnit/2.4))*rowFactor;
            svg.push(txt(xUnit+wUnit/2,deckY+deckH/2+textSize*.32,`${u.lengthFt}'`,textSize,'#ffffff',true,'text-anchor="middle"'));
          }
        }else{
          svg.push(txt(x+frameW/2,deckY+deckH/2+3*rowFactor,'?',10*rowFactor,'#627a8c',true,'text-anchor="middle"'));
        }
        const railY=deckY+deckH+4*rowFactor;
        svg.push(box(frameX,railY,frameW,3*rowFactor,'#6f8494'));
        const wheels=Math.max(2,Math.min(6,Number(w.axles)||2));
        for(let a=0;a<wheels;a++){
          const xx=frameX+frameW*(.09+.82*(a/(wheels-1)));
          svg.push(`<circle cx="${svgn(xx)}" cy="${svgn(railY+8*rowFactor)}" r="${svgn(3.2*rowFactor)}" fill="#344a59"/>`);
        }
        const noteY=y+119*rowFactor;
        if(w.centerRuleApplied)svg.push(txt(x+frameW/2,noteY,'MITTIG',9.8*rowFactor,'#107a55',true,'text-anchor="middle"'));
        else if(!w.units.length)svg.push(txt(x+frameW/2,noteY,'FREI',9*rowFactor,'#72879a',true,'text-anchor="middle"'));
        else svg.push(txt(x+frameW/2,noteY,`${w.units.map(u=>u.lengthFt+"'").join(' + ')}`,8.5*rowFactor,'#4b6274',true,'text-anchor="middle"'));
        x+=width+6;
      });
      displayed+=group.length;
    });
    svg.push(box(12,715,1116,63,'#edf5fa','#c7dbe8',.8,3));
    svg.push(box(26,727,15,13,'#c93841')); svg.push(txt(48,738,'Container',11,'#2d5068',true));
    svg.push(box(158,727,15,13,'#238450')); svg.push(txt(180,738,'Leer HAPAG',11,'#2d5068',true));
    svg.push(box(317,727,15,13,'#e3eaf0','#8195a4',1));svg.push(txt(339,738,'Freier Platz',11,'#2d5068',true));
    svg.push(txt(512,738,'MITTIG = mittige Einzelbeladung',10.5,'#2d5068',true));
    svg.push(txt(1112,738,`${plan.unplanned.length} nicht verplante Container`,10.5,plan.unplanned.length?'#b83b41':'#44657d',true,'text-anchor="end"'));
    svg.push(txt(26,756,'Wagenfolge: Von links nach rechts; nächste Zeile wieder links beginnen. Zugende liegt bei Position 100.',11,'#476780'));
    svg.push(txt(26,771,'Nur schematische Lage auf dem Wagen – Verriegelungs- und Lastgrenzen nicht validiert. Nicht als Steck-/Verladefreigabe nutzen.',10.6,'#99571f',true));
    svg.push('</svg>');
    return svg.join('');
  }
  const printSheet=document.createElement('div');
  printSheet.id='plannerPrintSheet';printSheet.className='planner-print-sheet';
  printSheet.setAttribute('aria-hidden','true');
  document.body.appendChild(printSheet);
  $('plannerPrint').addEventListener('click',()=>{
    if(!latest?.plan){showMessage('Erst die Verplanung berechnen, dann den Ladeplan drucken.');return;}
    printSheet.innerHTML=buildPrintSvg(latest.plan);
    window.print();
  });

  $('plannerDownload').addEventListener('click',()=>{
    if(!latest)return;
    const rows=[['HINWEIS','WAGENFOLGE','WAG_NO','ACHSSEN','LUEP_DM','GLEIS_POSITION','ZIELBAHNHOF','CONTAINER','FT','YARD_POSITION','GROSS_KG','SCHEMATISCHER_VERSATZ_FT','WAGEN_LADUNG_KG','ANMERKUNG']];
    for(const w of latest.plan.wagons){
      if(!w.units.length)rows.push(['PRÜFENTWURF',w.lnr,w.wagonNo,w.axles,w.lup,pos(w.positionCenter),'','','','','','','0','Wagen nicht beladen']);
      for(const u of w.units)rows.push(['PRÜFENTWURF',w.lnr,w.wagonNo,w.axles,w.lup,pos(w.positionCenter),w.destination,u.ctrNo,u.lengthFt,u.yardLocation,u.gross,u.offsetFt,w.assignedGrossKg,'NICHT ZUM VERLADEN FREIGEGEBEN']);
    }
    for(const u of latest.plan.unplanned)rows.push(['OFFEN','','','','','',u.destination,u.ctrNo,u.lengthFt,u.yardLocation,u.gross,'','',u.reason]);
    const csv='\uFEFF'+rows.map(r=>r.map(v=>'"'+String(v??'').replace(/"/g,'""')+'"').join(';')).join('\r\n');
    const url=URL.createObjectURL(new Blob([csv],{type:'text/csv;charset=utf-8'}));
    const a=document.createElement('a');a.href=url;a.download='NEXORA_TrainPlanner_PRUEFENTWURF.csv';document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),2000);
  });
})();
