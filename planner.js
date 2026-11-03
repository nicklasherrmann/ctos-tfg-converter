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
      <button id="plannerDownload" class="ghost-btn" type="button">Planungsentwurf als CSV ↓</button></div>
      <div id="plannerWarnings"></div>
      <div class="planner-legend"><span><i class="planner-legend-dot"></i> Farben kennzeichnen Zielterminals</span><span>Positionen 1–100 · Wagenende bei 100</span></div>
      <div id="plannerWagonList" class="planner-wagon-list"></div>
      <div class="planner-unplanned"><h4>Nicht verplante Container</h4><div id="plannerUnplanned"></div></div>
    </div>`;
  panel.parentNode.insertBefore(page,panel.nextSibling);
  const $=id=>document.getElementById(id);
  const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const kg=n=>n===null||n===undefined||!Number.isFinite(Number(n))?'–':Math.round(Number(n)).toLocaleString('de-DE')+' kg';
  const pos=n=>Number.isFinite(n)?n.toFixed(1).replace('.',','):'–';
  const colors=['#176da8','#0c8e83','#a07122','#8c5faf','#a45b77','#416c9c','#a95c48'];
  const colorByDestination=new Map();
  const color=d=>{if(!colorByDestination.has(d))colorByDestination.set(d,colors[colorByDestination.size%colors.length]);return colorByDestination.get(d);};
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
    const background=color(w.destination);
    return `<div class="planner-unit" style="--dest:${background}">
      <div class="planner-unit-head"><span>${esc(w.destination)} · ${u.lengthFt}'</span><span>${esc(u.fe==='E'?'LEER':u.fe==='F'?'VOLL':'')}</span></div>
      <strong>${esc(u.ctrNo)}</strong>
      <div class="planner-unit-meta"><span title="Yardposition">⌖ ${esc(u.yardLocation)}</span><span title="Bruttogewicht">⚖ ${esc(kg(u.gross))}</span></div>
    </div>`;
  }
  function wagonView(w,index){
    const cap=w.capacityFt,assigned=w.units.length>0;
    const segments=cap?w.units.map(u=>`<div class="planner-slot" style="left:${100*u.offsetFt/cap}%;width:${100*u.lengthFt/cap}%;--dest:${color(w.destination)}" title="${esc(u.ctrNo)} · ${u.lengthFt} Fuß"><span>${u.lengthFt}'</span></div>`).join(''):'';
    const deck=cap?`<div class="planner-deck" aria-label="Schematische Stellplätze">${segments}</div>`:'<div class="planner-deck planner-unknown">Bauart / Stellplätze unbekannt</div>';
    return `<article class="planner-wagon ${assigned?'':'planner-wagon-empty'}">
      <div class="planner-wagon-top"><span class="planner-wagon-number">${esc(w.lnr||index+1)}</span>
        <div class="planner-wagon-ident"><strong>${esc(w.wagonNo)}</strong>
          <small>${esc(w.axles)} Achsen · LüP ${pos(Number(w.lup)/10)} m · ${cap?cap+"' Modell":"Kapazität unbekannt"} · Gleisposition ≈ ${pos(w.positionCenter)}</small></div>
        <div class="planner-wagon-route">${assigned?`<i style="background:${color(w.destination)}"></i> ${esc(w.destination)}`:'Nicht belegt'}</div></div>
      ${deck}
      ${assigned?`<div class="planner-unit-grid">${w.units.map(u=>unitView(u,w)).join('')}</div>`:''}
      <div class="planner-wagon-bottom"><span>${assigned?`${w.units.length} Container · ${w.assignedFt}/${cap} Fuß`:'Kein Container eingeplant'}</span>
        <span><b>Ladungsgewicht: ${esc(kg(w.assignedGrossKg||0))}</b></span>
        ${w.centerRuleApplied?'<span class="planner-centred">Einzelbeladung mittig</span>':''}</div>
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
    $('plannerWagonList').innerHTML=plan.wagons.map(wagonView).join('');
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
