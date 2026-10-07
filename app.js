pdfjsLib.GlobalWorkerOptions.workerSrc =
  "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";

const HEADERS = [
  "TRN_OPER_CODE","TRN_DEST_STN","R_D","TRN_NO","ETA","TRN_LENGTH","WAG_SEQ_NO","WAG_NO",
  "WAG_TYPE","CTR_NO","ISO","FE","GROSS","LINER","CUSTOMER_ID","CATEGORY","FPOD","BOOK_NO",
  "BILL_OF_LADING","TRN_SRC_STN","ETD","MAX_TRAILING_TONS","MAX_TEU","TRN_COMMENTS","TRN_HEIGHT",
  "CTR_LOCATION","CTR_SRC_STN","CTR_DEST_STN","LENGTH","HEIGHT","TYPE","POD","EXIT_CALL_SIGN",
  "EXIT_OUT_VOYAGE","SEAL","RELEASE_ORDER","SPECIAL_HANDLING_CD","REEFER_TEMP","MAX_TEMP","MIN_TEMP",
  "TEMP_UNIT","VGM_FLG","VGM_AM","OOG_TOP","OOG_LEFT","OOG_RIGHT","OOG_FRONT","OOG_BACK","IMO1",
  "UNO1","IMO2","UNO2","IMO3","UNO3","IMO4","UNO4","IMO5","UNO5","CTR_NO_BUNDLE1","CTR_NO_BUNDLE2",
  "CTR_NO_BUNDLE3","CTR_NO_BUNDLE4","CTR_NO_BUNDLE5","BREAKBULK_ID","BREAKBULK_QTY","COMMENTS","DAMAGE_CD"
];

const FIXED = {
  TRN_OPER_CODE: "DBCARGO",
  TRN_DEST_STN: "DEOSN",
  R_D: "R",
  TRN_LENGTH: 700,
  LINER: "TFG",
  CUSTOMER_ID: "TFG",
  CATEGORY: "I"
};


const OUT_HEADERS = [
  "TRN_NO","ETD","CTR_NO","ISO","FE","GROSS","CATEGORY","LINER","CUSTOMER_ID","FPOD","POD",
  "PLACE_OF_DELIVERY","LLPOD","RELEASE_ORDER","BOOK_NO","ETD_CUST","CALL_SIGN","IN_VOYAGE","OUT_VOYAGE",
  "EXIT_CALL_SIGN","EXIT_OUT_VOYAGE","DUMMY_NO","ACTION_CODE","POL","BILL_OF_LADING","SEAL_NO","SEAL_TYPE",
  "SEAL_NO2","SEAL_TYPE2","SEAL_NO3","SEAL_TYPE3","SEAL_NO4","SEAL_TYPE4","SEAL_NO5","SEAL_TYPE5",
  "SPECIAL_HANDLING_CD","REEFER_TEMP","TEMP_UNIT","OOG_TOP","OOG_LEFT","OOG_RIGHT","OOG_FRONT","OOG_BACK",
  "DGS_CLASS","UN_NO","DGS_CLASS2","UN_NO2","DGS_CLASS3","UN_NO3","DGS_CLASS4","UN_NO4","DGS_CLASS5",
  "UN_NO5","COMMENTS","DAMAGE_CD","DAMAGE_CD2","DAMAGE_CD3","DAMAGE_CD4","DAMAGE_CD5","VGM_FLG",
  "VGM_GROSS","VGM_AM","TARE"
];

const OUT_FIXED = { TRN_NO: 50418, CATEGORY: "E", LINER: "TFG", CUSTOMER_ID: "TFG" };

const DESTINATION_MAP = {
  "CT 2": "CT2E",
  "CT 4": "CT4E",
  "EUK EKOM": "EUK",
  "HHL BK": "CTB",
  "HHL CTA": "CTA",
  "HHL TCT": "TCT",
  "JWP WHV": "JWP"
};

const OUT_SHEET_NAME = "COPARN-Export-Example-RBS";

const HELL_HEADERS = [
  "TRN_OPER_CODE","TRN_DEST_STN","R_D","TRN_NO","ETA","TRN_LENGTH","WAG_SEQ_NO","WAG_NO",
  "WAG_TYPE","CTR_NO","RELEASE_ORDER","ISO","FE","Gross","LINER","CUSTOMER_ID","CATEGORY","CTR_LOCATION",
  "FPOD","BOOK_NO","BILL_OF_LADING","TRN_SRC_STN","ETD","MAX_TRAILING_TONS","MAX_TEU","TRN_COMMENTS",
  "TRN_HEIGHT","CTR_SRC_STN","CTR_DEST_STN","LENGTH","HEIGHT","TYPE","POD","EXIT_CALL_SIGN","EXIT_OUT_VOYAGE",
  "SEAL","SPECIAL_HANDLING_CD","REEFER_TEMP","MAX_TEMP","MIN_TEMP","TEMP_UNIT","VGM_FLG","VGM_AM","OOG_TOP",
  "OOG_LEFT","OOG_RIGHT","OOG_FRONT","OOG_BACK","IMO1","UNO1","IMO2","UNO2","IMO3","UNO3","IMO4","UNO4",
  "IMO5","UNO5","CTR_NO_BUNDLE1","CTR_NO_BUNDLE2","CTR_NO_BUNDLE3","CTR_NO_BUNDLE4","CTR_NO_BUNDLE5",
  "BREAKBULK_ID","BREAKBULK_QTY","COMMENTS","DAMAGE_CD"
];

const HELL_FIXED = {
  TRN_OPER_CODE: "DBCARGO",
  TRN_DEST_STN: "DEOSN",
  R_D: "R",
  TRN_LENGTH: 700,
  ISO: "20SB",
  LINER: "HWL",
  CUSTOMER_ID: "HWL",
  CATEGORY: "I"
};


const SHEET_NAME = "SETG-TCM-COMBITRAC-20210827-610";

const el = (id) => document.getElementById(id);
const dropzone = el("dropzone");
const fileInput = el("fileInput");
const working = el("working");
const result = el("result");
const errorBox = el("errorBox");
const downloadBtn = el("downloadBtn");

const statsBox = document.querySelector(".stats");
const previewHead = document.querySelector(".table-card thead tr");
const previewSubtitle = document.querySelector(".table-head p");
const rulesBox = document.querySelector(".rules");
const panel = document.querySelector(".panel");
const heroText = document.querySelector(".hero p");
const heroFrom = document.querySelector(".hero-badge span:first-child");

let mode = "inbound";

let parsedState = null;

setupModeSwitcher();
applyModeUi();


function setupModeSwitcher() {
  const style = document.createElement("style");
  style.textContent = ".mode-switch{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:14px} .mode-btn{display:grid;grid-template-columns:auto 1fr;grid-template-rows:auto auto;column-gap:12px;row-gap:2px;align-items:center;padding:14px 16px;border:1px solid var(--line);border-radius:14px;background:#0b1320;color:var(--text);text-align:left;transition:.18s ease} .mode-btn:hover{border-color:#355071;background:#0e1929}.mode-btn.active{border-color:rgba(59,130,246,.7);background:linear-gradient(145deg,rgba(59,130,246,.13),rgba(11,19,32,.9));box-shadow:inset 0 0 0 1px rgba(59,130,246,.08)} .mode-kicker{grid-row:1/3;display:grid;place-items:center;width:42px;height:42px;border-radius:11px;background:#13233a;color:#7eb2ff;font-size:10px;font-weight:900;letter-spacing:.08em} .mode-title{font-size:13px;font-weight:800}.mode-desc{font-size:10px;color:#72839b} @media(max-width:900px){.mode-switch{grid-template-columns:1fr}}";
  document.head.appendChild(style);
  const switcher = document.createElement("div");
  switcher.className = "mode-switch";
  switcher.innerHTML = '<button id="modeInbound" class="mode-btn active" type="button"><span class="mode-kicker">TFG</span><span class="mode-title">Eingang</span><span class="mode-desc">Elisch PDF → TCM Excel</span></button>' +
    '<button id="modeOutbound" class="mode-btn" type="button"><span class="mode-kicker">TFG</span><span class="mode-title">Ausgang</span><span class="mode-desc">Ladeliste Excel → Export Excel</span></button>' +
    '<button id="modeHellmann" class="mode-btn" type="button"><span class="mode-kicker">HWL</span><span class="mode-title">Hellmann Eingang</span><span class="mode-desc">Wagenliste PDF → TCM Excel</span></button>';
  panel.parentNode.insertBefore(switcher, panel);
  el("modeInbound").addEventListener("click", () => setMode("inbound"));
  el("modeOutbound").addEventListener("click", () => setMode("outbound"));
  el("modeHellmann").addEventListener("click", () => setMode("hellmann"));
}

function setMode(nextMode) {
  if (mode === nextMode) return;
  mode = nextMode;
  el("modeInbound").classList.toggle("active", mode === "inbound");
  el("modeOutbound").classList.toggle("active", mode === "outbound");
  el("modeHellmann").classList.toggle("active", mode === "hellmann");
  reset();
  applyModeUi();
}

function applyModeUi() {
  const expectsPdf = mode === "inbound" || mode === "hellmann";
  fileInput.accept = expectsPdf ? ".pdf,application/pdf" : ".xlsx,.xls,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel";
  if (mode === "inbound") {
    document.querySelector(".dropzone h3").textContent = "Elisch-PDF hier ablegen";
    document.querySelector(".file-hint").textContent = "Nur PDF · keine Server-Übertragung";
    document.querySelector(".working strong").textContent = "PDF wird ausgewertet…";
    document.querySelector(".working span").textContent = "Wagen, Ladeeinheiten und Referenzen werden erkannt.";
    heroFrom.textContent = "PDF";
    heroText.textContent = "Elisch-PDF hochladen, Daten prüfen und die fertige TCM-Datei als Excel herunterladen. Die PDF verlässt dabei nicht deinen Browser.";
  } else if (mode === "outbound") {
    document.querySelector(".dropzone h3").textContent = "TFG-Ladeliste hier ablegen";
    document.querySelector(".file-hint").textContent = "Excel (.xlsx/.xls) · keine Server-Übertragung";
    document.querySelector(".working strong").textContent = "Ladeliste wird ausgewertet…";
    document.querySelector(".working span").textContent = "Container, Zielterminals und Exportdaten werden erkannt.";
    heroFrom.textContent = "XLSX";
    heroText.textContent = "TFG-Ladeliste hochladen, Exportdaten prüfen und die fertige TFG-Exportdatei als Excel herunterladen. Die Datei bleibt lokal in deinem Browser.";
  } else {
    document.querySelector(".dropzone h3").textContent = "Hellmann-Wagenliste hier ablegen";
    document.querySelector(".file-hint").textContent = "Nur PDF · Landshut → Osnabrück wird automatisch gefiltert";
    document.querySelector(".working strong").textContent = "Hellmann-PDF wird ausgewertet…";
    document.querySelector(".working span").textContent = "Nur Landshut → Osnabrück wird verarbeitet; Lehrte wird ignoriert.";
    heroFrom.textContent = "PDF";
    heroText.textContent = "Hellmann-Wagenliste hochladen. Das Tool übernimmt ausschließlich Landshut → Osnabrück, bereitet Wagen 7–10 vor und erstellt die HWL-TCM-Datei.";
  }
}

["dragenter","dragover"].forEach(evt => {
  dropzone.addEventListener(evt, e => {
    e.preventDefault();
    dropzone.classList.add("drag");
  });
});
["dragleave","drop"].forEach(evt => {
  dropzone.addEventListener(evt, e => {
    e.preventDefault();
    dropzone.classList.remove("drag");
  });
});
dropzone.addEventListener("drop", e => {
  const f = e.dataTransfer?.files?.[0];
  if (f) handleFile(f);
});
dropzone.addEventListener("click", () => fileInput.click());
dropzone.addEventListener("keydown", e => {
  if (e.key === "Enter" || e.key === " ") fileInput.click();
});
fileInput.addEventListener("change", () => {
  const f = fileInput.files?.[0];
  if (f) handleFile(f);
});
el("resetBtn").addEventListener("click", reset);
el("errorResetBtn").addEventListener("click", reset);
downloadBtn.addEventListener("click", downloadExcel);

function showOnly(target) {
  [dropzone, working, result, errorBox].forEach(x => x.classList.add("hidden"));
  target.classList.remove("hidden");
}

function reset() {
  parsedState = null;
  fileInput.value = "";
  el("previewBody").innerHTML = "";
  el("warnings").innerHTML = "";
  el("warnings").classList.add("hidden");
  showOnly(dropzone);
}

async function handleFile(file) {
  const expectsPdf = mode === "inbound" || mode === "hellmann";
  if (expectsPdf && (!file || (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")))) {
    return showError("Bitte eine PDF-Datei auswählen.");
  }
  if (mode === "outbound" && (!file || !/\.(xlsx|xls)$/i.test(file.name))) {
    return showError("Bitte eine Excel-Ladeliste (.xlsx oder .xls) auswählen.");
  }
  showOnly(working);
  try {
    const bytes = new Uint8Array(await file.arrayBuffer());
    if (mode === "inbound") {
      const parsed = await parseElischPdf(bytes);
      if (!parsed.trainNo) throw new Error("Keine Zugnummer/TrainID erkannt.");
      if (!parsed.date) throw new Error("Kein Listendatum erkannt.");
      if (!parsed.entries.length) throw new Error("Keine Ladeeinheiten erkannt.");
      parsedState = { ...parsed, sourceName: file.name, mode };
    } else if (mode === "outbound") {
      const parsed = parseLadeliste(bytes);
      if (!parsed.date) throw new Error("Kein Versandtag erkannt.");
      if (!parsed.entries.length) throw new Error("Keine Containerzeilen erkannt.");
      parsedState = { ...parsed, sourceName: file.name, mode };
    } else {
      const parsed = await parseHellmannPdf(bytes);
      if (!parsed.trainNo) throw new Error("Keine Zugnummer/TrainID erkannt.");
      if (!parsed.date) throw new Error("Kein Versanddatum erkannt.");
      if (!parsed.entries.length) throw new Error("Keine Ladeeinheiten für Landshut → Osnabrück erkannt.");
      parsedState = { ...parsed, sourceName: file.name, mode };
    }
    renderResult(parsedState);
  } catch (err) {
    console.error(err);
    showError(err?.message || "Unbekannter Fehler beim Lesen der Datei.");
  }
}

function showError(message) {
  const title = errorBox.querySelector("h3");
  if (title) title.textContent = mode === "outbound" ? "Excel-Datei konnte nicht verarbeitet werden" : "PDF konnte nicht verarbeitet werden";
  el("errorMessage").textContent = message;
  showOnly(errorBox);
}

async function parseElischPdf(bytes) {
  const pdf = await pdfjsLib.getDocument({ data: bytes }).promise;

  let trainNo = null;
  let date = null;
  let lastWagon = null;
  let wagonSeq = 0;
  let candidateRows = 0;
  const entries = [];
  const warnings = [];

  for (let pageNo = 1; pageNo <= pdf.numPages; pageNo++) {
    const page = await pdf.getPage(pageNo);
    const tc = await page.getTextContent();

    const items = tc.items
      .filter(i => i.str && i.str.trim())
      .map(i => ({
        text: i.str.trim(),
        x: Number(i.transform[4]),
        y: Number(i.transform[5])
      }));

    if (!date) {
      for (const item of items) {
        const m = item.text.match(/\b(\d{2}\.\d{2}\.\d{4})\b/);
        if (m) { date = m[1]; break; }
      }
    }

    if (!trainNo) {
      const t = items.find(i => /^\d{5}\/$/.test(i.text));
      if (t) trainNo = Number(t.text.slice(0, -1));
    }

    const prefixes = items
      .filter(i => i.x >= 108 && i.x <= 146 && /^[A-Z]{4}$/.test(i.text))
      .sort((a,b) => b.y - a.y); // PDF.js y grows bottom-up

    for (const prefix of prefixes) {
      const line = items.filter(i => Math.abs(i.y - prefix.y) <= 2.6);

      const pick = (xmin, xmax, regex) =>
        line.find(i => i.x >= xmin && i.x < xmax && regex.test(i.text));

      const leNo = pick(145, 210, /^\d{7}$/);
      if (!leNo) continue;
      candidateRows++;

      const book = pick(330, 402, /^\d{10}$/);
      const bl = pick(460, 480, /^[BL]$/);
      const gross = pick(480, 530, /^\d{3,6}$/);
      const wagon = pick(0, 90, /^\d{12}$/);

      if (!book || !bl || !gross) {
        warnings.push(`Seite ${pageNo}: ${prefix.text}${leNo.text} konnte nicht vollständig gelesen werden.`);
        continue;
      }

      if (wagon) {
        if (wagon.text !== lastWagon) {
          wagonSeq++;
          lastWagon = wagon.text;
        }
      }

      if (!lastWagon) {
        warnings.push(`Seite ${pageNo}: Für ${prefix.text}${leNo.text} wurde keine Wagennummer gefunden.`);
        continue;
      }

      entries.push({
        trainNo,
        wagonSeq,
        wagonNo: lastWagon,
        ctrNo: `${prefix.text}${leNo.text}`, // bewusst String → führende Null bleibt erhalten
        fe: bl.text === "B" ? "F" : "E",
        gross: Number(gross.text),
        bookNo: Number(book.text)
      });
    }
  }

  const uniqueWagons = new Set(entries.map(e => e.wagonNo)).size;

  if (candidateRows !== entries.length) {
    warnings.push(`${candidateRows} Ladeeinheiten-Zeilen erkannt, aber nur ${entries.length} vollständig übernommen.`);
  }

  if (wagonSeq !== uniqueWagons) {
    warnings.push(`Wagensequenz (${wagonSeq}) und eindeutige Wagen (${uniqueWagons}) weichen voneinander ab.`);
  }

  return {
    trainNo,
    date,
    entries,
    wagonCount: uniqueWagons,
    unitCount: entries.length,
    warnings
  };
}


async function parseHellmannPdf(bytes) {
  const pdf = await pdfjsLib.getDocument({ data: bytes }).promise;
  let trainNo = null;
  let shipDate = null;
  let currentWagon = null;
  let wagonSeq = 0;
  let osnPages = 0;
  const entries = [];
  const warnings = [];
  const wagons = new Map();

  for (let pageNo = 1; pageNo <= pdf.numPages; pageNo++) {
    const page = await pdf.getPage(pageNo);
    const tc = await page.getTextContent();
    const items = tc.items.filter(i => i.str && i.str.trim()).map(i => ({
      text: i.str.trim(), x: Number(i.transform[4]), y: Number(i.transform[5])
    }));

    const pageText = items.map(i => i.text).join(" ").toUpperCase();
    const isOsnabrueck = pageText.includes("OSNABRUECK") && pageText.includes("CTOS");
    if (!isOsnabrueck) continue;
    osnPages++;

    if (!trainNo) {
      const t = items.find(i => /^\d{5}\/$/.test(i.text));
      if (t) trainNo = Number(t.text.slice(0, -1));
    }
    if (!shipDate) {
      const d = items.find(i => /^\d{2}\.\d{2}\.\d{2}$/.test(i.text));
      if (d) {
        const parts = d.text.split(".");
        shipDate = parts[0] + "." + parts[1] + ".20" + parts[2];
      }
    }

    const wagonAnchors = items.filter(i => i.x >= 35 && i.x <= 110 && /^\d{12}$/.test(i.text))
      .map(i => ({ type:"wagon", y:i.y, wagonNo:i.text }));
    const containerPrefixes = items.filter(i => i.x >= 120 && i.x <= 155 && /^[A-Z]{4}$/.test(i.text))
      .map(i => ({ type:"container", y:i.y, prefix:i.text }));
    const events = wagonAnchors.concat(containerPrefixes).sort((a,b) => {
      if (Math.abs(a.y - b.y) < 2.5) return a.type === "wagon" ? -1 : 1;
      return b.y - a.y;
    });

    for (const event of events) {
      if (event.type === "wagon") {
        if (event.wagonNo !== currentWagon) {
          wagonSeq++;
          currentWagon = event.wagonNo;
          if (!wagons.has(wagonSeq)) wagons.set(wagonSeq, { wagonNo:currentWagon, slots:new Map() });
        }
        continue;
      }
      if (!currentWagon || wagonSeq < 1) {
        warnings.push("Seite " + pageNo + ": Ladeeinheit " + event.prefix + " ohne zugeordneten Wagen.");
        continue;
      }

      const line = items.filter(i => Math.abs(i.y - event.y) <= 3.2);
      const pick = (xmin, xmax, regex) => line.find(i => i.x >= xmin && i.x < xmax && regex.test(i.text));
      const leNo = pick(150, 210, /^\d{7}$/);
      const slot = pick(110, 135, /^[1-4]$/);
      const nhm = pick(285, 340, /^\d{6}$/);
      const gross = pick(395, 445, /^\d{3,6}$/);

      if (!leNo || !slot || !nhm || !gross) {
        warnings.push("Seite " + pageNo + ": " + event.prefix + (leNo ? leNo.text : "") + " konnte nicht vollständig gelesen werden.");
        continue;
      }
      const fe = nhm.text === "993200" ? "E" : nhm.text === "990200" ? "F" : "";
      if (!fe) warnings.push("Seite " + pageNo + ": Unbekannter NHM-Code " + nhm.text + " bei " + event.prefix + leNo.text + ".");

      const entry = {
        wagonSeq: wagonSeq,
        wagonNo: currentWagon,
        slot: Number(slot.text),
        ctrNo: event.prefix + leNo.text,
        fe: fe,
        gross: Number(gross.text)
      };
      entries.push(entry);
      if (!wagons.has(wagonSeq)) wagons.set(wagonSeq, { wagonNo:currentWagon, slots:new Map() });
      wagons.get(wagonSeq).slots.set(entry.slot, entry);
    }
  }

  if (!osnPages) throw new Error("Keine Relation mit Ziel OSNABRUECK HAFEN CTOS gefunden.");
  const unique = new Set(entries.map(e => e.ctrNo));
  if (unique.size !== entries.length) warnings.push("Doppelte Ladeeinheiten erkannt.");

  return {
    trainNo: trainNo,
    date: shipDate,
    etaDate: shipDate ? addDaysToGermanDate(shipDate, 1) : null,
    entries: entries,
    wagons: wagons,
    wagonCount: wagons.size,
    unitCount: entries.length,
    osnPages: osnPages,
    warnings: warnings
  };
}

function addDaysToGermanDate(dateString, days) {
  const p = parseGermanDate(dateString);
  const d = new Date(Date.UTC(p.year, p.month - 1, p.day + days));
  return String(d.getUTCDate()).padStart(2,"0") + "." + String(d.getUTCMonth()+1).padStart(2,"0") + "." + d.getUTCFullYear();
}
function normalizeHeader(value) {
  return clean(value)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ß/g, "ss")
    .replace(/[^a-z0-9]/g, "");
}

const OUTBOUND_COLUMNS = [
  { key:"bookNo", label:"Container Referenznummer", aliases:["containerreferenznummer","containerreferenznr","containerreferenz","containereferenznummer","containerref","icnummer","iknummer","iknr","ikno"] },
  { key:"billOfLading", label:"Kundenauftragsnummer", aliases:["kundenauftragsnummer","kundenauftragsnr","kundenauftrag"] },
  { key:"destination", label:"Ankunftsladestelle", aliases:["ankunftsladestelle","ankunftladeort","ladestelleankunft"] },
  { key:"ctrNo", label:"Containernummer", aliases:["containernummer","containernr","containerno","container"] },
  { key:"type", label:"Containertyp", aliases:["containertyp","containertype","containerart"] },
  { key:"length", label:"Cont.länge", aliases:["contlange","containerlange","containerlaenge","contlaenge"] },
  { key:"height", label:"Containerhöhe", aliases:["containerhohe","containerhoehe","conthohe","conthoehe"] },
  { key:"gross", label:"Brutto Gewicht", aliases:["bruttogewicht","bruttogew","brutto","grossweight"] },
  { key:"emptyFlag", label:"Leercontainer", aliases:["leercontainer","leer","leerkennzeichen"] },
  { key:"releaseOrder", label:"Turn Out Referenz", aliases:["turnoutreferenz","turnoutreference","turnoutref","turnout"] },
  { key:"date", label:"Versandtag", aliases:["versandtag","versanddatum","shippingdate"] }
];

function identifyHeaderRow(matrix) {
  let best = { row:-1, score:-1, indices:{} };
  const maxRows = Math.min(matrix.length, 30);

  for (let r = 0; r < maxRows; r++) {
    const normalized = (matrix[r] || []).map(normalizeHeader);
    const indices = {};
    let score = 0;

    for (const col of OUTBOUND_COLUMNS) {
      const pos = normalized.findIndex(h => col.aliases.includes(h));
      if (pos >= 0) {
        indices[col.key] = pos;
        score++;
      }
    }

    if (score > best.score) best = { row:r, score, indices };
  }
  return best;
}

function parseLadeliste(bytes) {
  const wb = XLSX.read(bytes, { type:"array", cellDates:false, raw:true });
  const ws = wb.Sheets[wb.SheetNames[0]];
  if (!ws) throw new Error("Die Arbeitsmappe enthält kein Tabellenblatt.");

  const matrix = XLSX.utils.sheet_to_json(ws, { header:1, defval:null, raw:true });
  if (!matrix.length) throw new Error("Die Ladeliste ist leer.");

  const headerMatch = identifyHeaderRow(matrix);
  const missing = OUTBOUND_COLUMNS.filter(c => headerMatch.indices[c.key] === undefined);

  if (headerMatch.row < 0 || missing.length) {
    const detected = headerMatch.row >= 0
      ? (matrix[headerMatch.row] || []).map(clean).filter(Boolean).slice(0,18).join(" | ")
      : "";
    throw new Error(
      `Pflichtspalten fehlen: ${missing.map(c => c.label).join(", ")}` +
      (detected ? `. Erkannte Überschriften: ${detected}` : "")
    );
  }

  const idx = headerMatch.indices;
  const entries = [], warnings = [], dates = new Set(), destinations = new Set();

  for (let r = headerMatch.row + 1; r < matrix.length; r++) {
    const row = matrix[r];
    const ctrNo = clean(row[idx.ctrNo]);
    if (!ctrNo) continue;

    const date = normalizeDate(row[idx.date]);
    if (date) dates.add(date);

    const destinationRaw = clean(row[idx.destination]);
    const destination = DESTINATION_MAP[destinationRaw];
    if (destinationRaw) destinations.add(destinationRaw);
    if (!destination) warnings.push(`Zeile ${r+1}: Unbekannte Ankunftsladestelle „${destinationRaw || "leer"}“.`);

    const type = clean(row[idx.type]).toUpperCase();
    const length = clean(row[idx.length]);
    const height = clean(row[idx.height]);
    const iso = mapIso(type,length,height);
    if (!iso) warnings.push(`Zeile ${r+1}: ISO-Code für ${type}/${length}/${height} nicht bekannt.`);

    const emptyFlag = clean(row[idx.emptyFlag]).toUpperCase();
    const fe = emptyFlag === "V" ? "F" : emptyFlag === "L" ? "E" : "";
    if (!fe) warnings.push(`Zeile ${r+1}: Leercontainer-Wert „${emptyFlag || "leer"}“ nicht erkannt.`);

    const releaseOrder = clean(row[idx.releaseOrder]);

    entries.push({
      ctrNo,
      iso,
      fe,
      gross:toNumber(row[idx.gross]),
      pod:destination || "",
      releaseOrder,
      bookNo:clean(row[idx.bookNo]),
      billOfLading:clean(row[idx.billOfLading]),
      date
    });
  }

  if (dates.size > 1) warnings.push(`Mehrere Versandtage erkannt: ${[...dates].join(", ")}.`);
  return {
    trainNo:50418,
    date:[...dates][0] || null,
    entries,
    unitCount:entries.length,
    destinationCount:destinations.size,
    warnings
  };
}

function mapIso(type,length,height) {
  if (type === "DC" && length === "20") return "22G0";
  if (type === "DC" && length === "40" && height === "86") return "42G0";
  if (type === "DC" && length === "40" && height === "96") return "45G0";
  if (type === "OT" && length === "40" && height === "96") return "45OT";
  if (type === "RF" && length === "40" && height === "96") return "45RT";
  return "";
}

function clean(value) { return value === null || value === undefined ? "" : String(value).trim(); }
function toNumber(value) {
  if (value === null || value === undefined || value === "") return null;
  const n = Number(String(value).replace(",", "."));
  return Number.isFinite(n) ? n : null;
}
function pad2(n) { return String(n).padStart(2,"0"); }
function normalizeDate(value) {
  if (value === null || value === undefined || value === "") return null;
  if (typeof value === "number") {
    const d = XLSX.SSF.parse_date_code(value);
    return d ? `${pad2(d.d)}.${pad2(d.m)}.${d.y}` : null;
  }
  const m = clean(value).match(/^(\d{2})\.(\d{2})\.(\d{4})/);
  return m ? `${m[1]}.${m[2]}.${m[3]}` : null;
}

function renderResult(data) {
  el("fileName").textContent = data.sourceName;
  el("previewCount").textContent = `${data.unitCount} Zeilen`;

  const stats = mode === "inbound"
    ? [["Zugnummer",data.trainNo],["Datum",data.date],["Wagen",data.wagonCount],["Ladeeinheiten",data.unitCount]]
    : [["Zugnummer","50418"],["ETD",`${data.date} 20:00`],["Container",data.unitCount],["Zielterminals",data.destinationCount]];
  statsBox.innerHTML = stats.map(([label,value]) => `<article><span>${escapeHtml(label)}</span><strong>${escapeHtml(value ?? "–")}</strong></article>`).join("");

  const columns = mode === "inbound"
    ? [["SEQ",r=>r.wagonSeq],["WAG_NO",r=>r.wagonNo],["CTR_NO",r=>r.ctrNo],["FE",r=>r.fe],["GROSS",r=>formatNumber(r.gross)],["BOOK_NO",r=>r.bookNo]]
    : [["CTR_NO",r=>r.ctrNo],["ISO",r=>r.iso],["FE",r=>r.fe],["GROSS",r=>formatNumber(r.gross)],["POD",r=>r.pod],["BILL_OF_LADING",r=>r.billOfLading]];
  previewHead.innerHTML = columns.map(([h]) => `<th>${escapeHtml(h)}</th>`).join("");
  el("previewBody").innerHTML = data.entries.map(r => `<tr>${columns.map(([,get]) => `<td>${escapeHtml(get(r) ?? "")}</td>`).join("")}</tr>`).join("");
  previewSubtitle.textContent = mode === "inbound" ? "Erkannte TCM-Eingangsdaten" : "Erkannte TFG-Exportdaten";
  rulesBox.innerHTML = (mode === "inbound"
    ? [["LINER","TFG"],["ETA","12:00"],["Leading Zero","erhalten"]]
    : [["TRN_NO","50418"],["ETD","20:00"],["LINER","TFG"]])
    .map(([k,v]) => `<span>${escapeHtml(k)}: <b>${escapeHtml(v)}</b></span>`).join("");

  const warnBox = el("warnings");
  if (data.warnings.length) {
    warnBox.innerHTML = data.warnings.map(w => `⚠ ${escapeHtml(w)}`).join("<br>");
    warnBox.classList.remove("hidden");
    el("statusIcon").className = "status-icon warn";
    el("statusIcon").textContent = "!";
    el("resultTitle").textContent = "Datei verarbeitet – bitte Hinweise prüfen";
  } else {
    warnBox.classList.add("hidden");
    el("statusIcon").className = "status-icon ok";
    el("statusIcon").textContent = "✓";
    el("resultTitle").textContent = "Datei erfolgreich verarbeitet";
  }
  el("resetBtn").textContent = "Andere Datei";
  showOnly(result);
}

function formatNumber(n) {
  return new Intl.NumberFormat("de-DE").format(n);
}

function escapeHtml(s) {
  return String(s)
    .replaceAll("&","&amp;")
    .replaceAll("<","&lt;")
    .replaceAll(">","&gt;")
    .replaceAll('"',"&quot;");
}

function parseGermanDate(s) {
  const m = /^(\d{2})\.(\d{2})\.(\d{4})$/.exec(s);
  if (!m) throw new Error("Ungültiges Datum.");
  return { day:Number(m[1]), month:Number(m[2]), year:Number(m[3]) };
}

function excelSerialAtNoon(dateString) {
  const {day,month,year} = parseGermanDate(dateString);
  const excelEpoch = Date.UTC(1899, 11, 30, 0, 0, 0);
  const target = Date.UTC(year, month - 1, day, 12, 0, 0);
  return (target - excelEpoch) / 86400000;
}

function makeExcelRows(data) {
  const eta = excelSerialAtNoon(data.date);

  return data.entries.map(e => {
    const row = Object.fromEntries(HEADERS.map(h => [h, null]));

    Object.assign(row, FIXED, {
      TRN_NO: data.trainNo,
      ETA: eta,
      WAG_SEQ_NO: e.wagonSeq,
      WAG_NO: Number(e.wagonNo),
      CTR_NO: e.ctrNo,
      FE: e.fe,
      GROSS: e.gross,
      BOOK_NO: e.bookNo
    });

    return HEADERS.map(h => row[h]);
  });
}


function excelSerialAtTime(dateString, hour, minute = 0) {
  const {day,month,year} = parseGermanDate(dateString);
  const excelEpoch = Date.UTC(1899, 11, 30, 0, 0, 0);
  const target = Date.UTC(year, month - 1, day, hour, minute, 0);
  return (target - excelEpoch) / 86400000;
}

function makeOutboundRows(data) {
  const etd = excelSerialAtTime(data.date,20);
  return data.entries.map(e => {
    const row = Object.fromEntries(OUT_HEADERS.map(h => [h,null]));
    Object.assign(row,OUT_FIXED,{
      ETD:etd, CTR_NO:e.ctrNo, ISO:e.iso, FE:e.fe, GROSS:e.gross,
      POD:e.pod, PLACE_OF_DELIVERY:e.pod, RELEASE_ORDER:e.releaseOrder || null,
      BOOK_NO:e.bookNo, BILL_OF_LADING:e.billOfLading || null
    });
    return OUT_HEADERS.map(h => row[h]);
  });
}

function downloadExcel() {
  if (!parsedState) return;

  try {
    downloadBtn.disabled = true;

    if (mode === "inbound") {
      const rows = makeExcelRows(parsedState);
      const ws = XLSX.utils.aoa_to_sheet([HEADERS, ...rows], { cellDates:false });

      for (let r = 2; r <= rows.length + 1; r++) {
        const c = ws[`E${r}`];
        if (c) { c.t = "n"; c.z = "dd.mm.yyyy hh:mm"; }
        const ctr = ws[`J${r}`];
        if (ctr) ctr.t = "s";
      }

      ws["!cols"] = HEADERS.map((h, i) => {
        if (i === 7) return { wch: 15 };
        if (i === 9) return { wch: 16 };
        if (i === 17) return { wch: 14 };
        if (i === 4) return { wch: 19 };
        return { wch: Math.min(Math.max(h.length + 2, 10), 24) };
      });

      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, SHEET_NAME);
      XLSX.writeFile(wb, `CTOS-TCM-IN-TFG - ${parsedState.date}.xlsx`, { bookType:"xlsx", compression:true });
    } else {
      const rows = makeOutboundRows(parsedState);
      const ws = XLSX.utils.aoa_to_sheet([OUT_HEADERS, ...rows], { cellDates:false });

      for (let r = 2; r <= rows.length + 1; r++) {
        const etd = ws[`B${r}`];
        if (etd) { etd.t = "n"; etd.z = "dd.mm.yyyy hh:mm"; }
        const ctr = ws[`C${r}`];
        if (ctr) ctr.t = "s";
        const release = ws[`N${r}`];
        if (release) release.t = "s";
        const bol = ws[`Y${r}`];
        if (bol) bol.t = "s";
      }

      ws["!cols"] = OUT_HEADERS.map((h, i) => {
        if (i === 1) return { wch: 19 };
        if (i === 2) return { wch: 16 };
        if (i === 13 || i === 24) return { wch: 22 };
        return { wch: Math.min(Math.max(h.length + 2, 10), 24) };
      });

      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, OUT_SHEET_NAME);
      XLSX.writeFile(wb, `TFG EXPORT ${parsedState.date}.xlsx`, { bookType:"xlsx", compression:true });
    }
  } catch (err) {
    console.error(err);
    alert("Die Excel-Datei konnte nicht erstellt werden: " + (err?.message || err));
  } finally {
    downloadBtn.disabled = false;
  }
}
