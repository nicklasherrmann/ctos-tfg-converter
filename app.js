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



const HWL_OUT_HEADERS = [
  "TRN_NO","ETD","CTR_NO","ISO","FE","GROSS","CATEGORY","LINER","CUSTOMER_ID","FPOD","POD","PLACE_OF_DELIVERY","LLPOD",
  "BOOK_NO","BILL_OF_LADING","CALL_SIGN","TARE","IN_VOYAGE","OUT_VOYAGE","EXIT_CALL_SIGN","EXIT_OUT_VOYAGE","ETD_CUST","POL",
  "DUMMY_NO","ACTION_CODE","RELEASE_ORDER","SEAL_NO","SEAL_TYPE","SEAL_NO2","SEAL_TYPE2","SEAL_NO3","SEAL_TYPE3","SEAL_NO4",
  "SEAL_TYPE4","SEAL_NO5","SEAL_TYPE5","SPECIAL_HANDLING_CD","REEFER_TEMP","TEMP_UNIT","OOG_TOP","OOG_LEFT","OOG_RIGHT","OOG_FRONT",
  "OOG_BACK","DGS_CLASS","UN_NO","DGS_CLASS2","UN_NO2","DGS_CLASS3","UN_NO3","DGS_CLASS4","UN_NO4","DGS_CLASS5","UN_NO5","COMMENTS",
  "DAMAGE_CD","DAMAGE_CD2","DAMAGE_CD3","DAMAGE_CD4","DAMAGE_CD5","VGM_FLG","VGM_GROSS","VGM_AM",123
];
const HWL_OUT_FIXED = { TRN_NO:50020, ISO:"20SB", FE:"F", GROSS:12000, CATEGORY:"E", LINER:"HWL", CUSTOMER_ID:"HWL" };
const HWL_OUT_SHEET_NAME = "COPARN-Export-Example-RBS";

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

const TFG_LOGO_DATA = "data:image/png;base64,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";
const HWL_LOGO_DATA = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAUAAAAFACAMAAAD6TlWYAAADAFBMVEVHcEwATJcATJcATJcATJcATJcATJcATJcATJcATJcATJcATJcATJcATJcATJcATJcATJcATJcATJcATJcATJcATJcATJcATJcATJcATJcATJcATJcATJcATJcATJcATJcATJcATJcATJcATJcATJcATJcATJcATJcATJcATJcATJcATJcATJcATJcATJcATJcATJcATJcATJcATJcATJcATJcATJcATJcATJcATJcATJcATJcATJcATJcATJcATJcATJcATJcATJcATJcATJcATJcATJcATJcATJcATJcATJcATJcATJcATJcATJcATJcATJcATJcATJcATJcATJcATJcATJcATJcATJcATJcATJcATJcATJcATJcATJcATJcATJcATJcATJcATJcATJcATJcATJcATJcATJcATJcATJcATJcATJcATJcATJcATJcATJcATJcATJcATJcATJcATJcATJcATJcATJcATJcATJcATJcATJcATJcATJcATJcATJcATJcATJcATJcATJcATJcATJcATJcATJcATJcATJcATJcATJcATJcATJcATJcATJcATJcATJcATJcATJcATJcATJcATJcATJcATJcATJcATJcATJcATJcATJcATJcATJcATJcATJcATJcATJcATJcATJcATJcATJcATJcATJcATJcATJcATJcATJcATJcATJcATJcATJcATJcATJcATJcATJcATJcATJcATJcATJcATJcATJcATJcATJcATJcATJcATJcATJcATJcATJcATJcATJcATJcATJcATJcATJcATJcATJcATJcATJcATJcATJcATJcATJcATJcATJfncfMzAAABAHRSTlMA0vLj5+/s+vT59fz9//74+/fx8+726eHmtaPJe+vt0d7wwte4vyC0Ko3f292LpuCs5UUvfuSrWNgrISjTYc8xxtATk5uoodpgyjuOnHW7uiI2hFo0dp2fsydzilxZPIlSw7FG3KLoHDh5Y14zlU0/cFXOwYGGQ3yy1oyIemxqaG9ySKRUlHiFgl+eW69igLl3klZpQcuWpWeRvoeYPUx9p8yag2vqdI9uUKkdrnFkZr1RT2VXrT7HqtVdf81ANdSXsBZt4rxCN7eQEjDASknZ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";
let mode = null;
let activeBrand = null;

let parsedState = null;

setupModeSwitcher();
showBrandLanding();


function setupModeSwitcher() {
  const style = document.createElement("style");
  style.textContent = ".brand-landing{margin:18px 0 0}.brand-intro{text-align:center;margin:34px auto 26px;max-width:720px}.brand-intro h2{font-size:clamp(34px,5vw,56px);margin:0 0 12px;letter-spacing:-.05em}.brand-intro p{color:var(--muted);font-size:14px}.brand-grid{display:grid;grid-template-columns:1fr 1fr;gap:18px}.brand-card{min-height:330px;border:1px solid var(--line);border-radius:24px;background:linear-gradient(155deg,rgba(59,130,246,.08),rgba(11,19,32,.95));display:flex;flex-direction:column;align-items:center;justify-content:center;gap:18px;padding:32px;color:var(--text);cursor:pointer;transition:.2s ease}.brand-card:hover{transform:translateY(-3px);border-color:#4c6f9c;box-shadow:0 20px 55px rgba(0,0,0,.28)}.brand-card img{max-width:72%;max-height:150px;object-fit:contain;filter:drop-shadow(0 8px 24px rgba(0,0,0,.2))}.brand-card.hwl img{max-width:150px}.brand-card strong{font-size:22px}.brand-card span{font-size:12px;color:#8092aa}.mode-shell{display:flex;align-items:center;gap:12px;margin-bottom:14px}.mode-back{white-space:nowrap}.mode-switch{display:grid;grid-template-columns:1fr 1fr;gap:10px;flex:1}.mode-btn{display:grid;grid-template-columns:auto 1fr;grid-template-rows:auto auto;column-gap:12px;row-gap:2px;align-items:center;padding:14px 16px;border:1px solid var(--line);border-radius:14px;background:#0b1320;color:var(--text);text-align:left;transition:.18s ease}.mode-btn:hover{border-color:#355071;background:#0e1929}.mode-btn.active{border-color:rgba(59,130,246,.7);background:linear-gradient(145deg,rgba(59,130,246,.13),rgba(11,19,32,.9));box-shadow:inset 0 0 0 1px rgba(59,130,246,.08)}.mode-kicker{grid-row:1/3;display:grid;place-items:center;width:42px;height:42px;border-radius:11px;background:#13233a;color:#7eb2ff;font-size:10px;font-weight:900;letter-spacing:.08em}.mode-title{font-size:13px;font-weight:800}.mode-desc{font-size:10px;color:#72839b}@media(max-width:760px){.brand-grid,.mode-switch{grid-template-columns:1fr}.mode-shell{align-items:stretch;flex-direction:column}.brand-card{min-height:240px}}";
  document.head.appendChild(style);
  const landing = document.createElement("section");
  landing.id = "brandLanding";
  landing.className = "brand-landing";
  landing.innerHTML = '<div class="brand-intro"><div class="eyebrow">CTOS TOOL</div><h2>Welchen Partner möchtest du bearbeiten?</h2><p>Wähle TFG oder HWL. Danach stehen jeweils Eingang und Ausgang zur Verfügung.</p></div>' +
    '<div class="brand-grid"><button id="brandTFG" class="brand-card" type="button"><img alt="TFG Transfracht" src="' + TFG_LOGO_DATA + '"><strong>TFG</strong><span>Eingang & Ausgang</span></button>' +
    '<button id="brandHWL" class="brand-card hwl" type="button"><img alt="Hellmann Worldwide Logistics" src="' + HWL_LOGO_DATA + '"><strong>HWL</strong><span>Eingang & Ausgang</span></button></div>';
  document.querySelector(".hero").parentNode.insertBefore(landing, document.querySelector(".hero"));

  const shell = document.createElement("div");
  shell.id = "modeShell";
  shell.className = "mode-shell hidden";
  shell.innerHTML = '<button id="brandBack" class="ghost-btn mode-back" type="button">← Partner wählen</button><div class="mode-switch">' +
    '<button id="modeInbound" data-brand="tfg" class="mode-btn" type="button"><span class="mode-kicker">TFG</span><span class="mode-title">Eingang</span><span class="mode-desc">Elisch PDF → TCM Excel</span></button>' +
    '<button id="modeOutbound" data-brand="tfg" class="mode-btn" type="button"><span class="mode-kicker">TFG</span><span class="mode-title">Ausgang</span><span class="mode-desc">Ladeliste Excel → Export Excel</span></button>' +
    '<button id="modeHellmann" data-brand="hwl" class="mode-btn" type="button"><span class="mode-kicker">HWL</span><span class="mode-title">Eingang</span><span class="mode-desc">Wagenliste PDF → TCM Excel</span></button>' +
    '<button id="modeHwlOutbound" data-brand="hwl" class="mode-btn" type="button"><span class="mode-kicker">HWL</span><span class="mode-title">Ausgang</span><span class="mode-desc">Ladeliste Excel → Export Excel</span></button></div>';
  panel.parentNode.insertBefore(shell, panel);
  el("brandTFG").addEventListener("click", () => selectBrand("tfg"));
  el("brandHWL").addEventListener("click", () => selectBrand("hwl"));
  el("brandBack").addEventListener("click", showBrandLanding);
  el("modeInbound").addEventListener("click", () => setMode("inbound"));
  el("modeOutbound").addEventListener("click", () => setMode("outbound"));
  el("modeHellmann").addEventListener("click", () => setMode("hellmann"));
  el("modeHwlOutbound").addEventListener("click", () => setMode("hwlOutbound"));
}

function showBrandLanding() {
  activeBrand = null; mode = null; parsedState = null;
  el("brandLanding").classList.remove("hidden");
  el("modeShell").classList.add("hidden");
  document.querySelector(".hero").classList.add("hidden");
  panel.classList.add("hidden");
  document.querySelector(".brand h1").textContent = "CTOS Converter";
  document.querySelector(".brand p").textContent = "Import & Export";
}

function selectBrand(brand) {
  activeBrand = brand;
  el("brandLanding").classList.add("hidden");
  el("modeShell").classList.remove("hidden");
  document.querySelector(".hero").classList.remove("hidden");
  panel.classList.remove("hidden");
  document.querySelectorAll(".mode-btn").forEach(btn => btn.classList.toggle("hidden", btn.dataset.brand !== brand));
  document.querySelector(".brand h1").textContent = brand === "tfg" ? "TFG Converter" : "HWL Converter";
  document.querySelector(".brand p").textContent = brand === "tfg" ? "TFG Import & Export" : "HWL Import & Export";
  setMode(brand === "tfg" ? "inbound" : "hellmann");
}

function setMode(nextMode) {
  mode = nextMode;
  ["modeInbound","modeOutbound","modeHellmann","modeHwlOutbound"].forEach(id => el(id).classList.toggle("active", id === ({inbound:"modeInbound",outbound:"modeOutbound",hellmann:"modeHellmann",hwlOutbound:"modeHwlOutbound"}[mode])));
  reset();
  applyModeUi();
}

function applyModeUi() {
  const expectsPdf = mode === "inbound" || mode === "hellmann";
  fileInput.accept = expectsPdf ? ".pdf,application/pdf" : ".xlsx,.xls,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel";
  if (mode === "inbound") {
    document.querySelector(".hero h2").textContent = "TFG-Eingang konvertieren.";
    document.querySelector(".dropzone h3").textContent = "Elisch-PDF hier ablegen";
    document.querySelector(".file-hint").textContent = "Nur PDF · keine Server-Übertragung";
    document.querySelector(".working strong").textContent = "PDF wird ausgewertet…";
    document.querySelector(".working span").textContent = "Wagen, Ladeeinheiten und Referenzen werden erkannt.";
    heroFrom.textContent = "PDF";
    heroText.textContent = "Elisch-PDF hochladen, Daten prüfen und die fertige TCM-Datei als Excel herunterladen.";
  } else if (mode === "outbound") {
    document.querySelector(".hero h2").textContent = "TFG-Ausgang konvertieren.";
    document.querySelector(".dropzone h3").textContent = "TFG-Ladeliste hier ablegen";
    document.querySelector(".file-hint").textContent = "Excel (.xlsx/.xls) · keine Server-Übertragung";
    document.querySelector(".working strong").textContent = "Ladeliste wird ausgewertet…";
    document.querySelector(".working span").textContent = "Container, Zielterminals und Exportdaten werden erkannt.";
    heroFrom.textContent = "XLSX";
    heroText.textContent = "TFG-Ladeliste hochladen, Exportdaten prüfen und die fertige TFG-Exportdatei herunterladen.";
  } else if (mode === "hellmann") {
    document.querySelector(".hero h2").textContent = "HWL-Eingang konvertieren.";
    document.querySelector(".dropzone h3").textContent = "Hellmann-Wagenliste hier ablegen";
    document.querySelector(".file-hint").textContent = "Nur PDF · Landshut → Osnabrück wird automatisch gefiltert";
    document.querySelector(".working strong").textContent = "Hellmann-PDF wird ausgewertet…";
    document.querySelector(".working span").textContent = "Nur Landshut → Osnabrück wird verarbeitet; Lehrte wird ignoriert.";
    heroFrom.textContent = "PDF";
    heroText.textContent = "Hellmann-Wagenliste hochladen. Wagen 7–10 werden bereits als leere Plätze vorbereitet.";
  } else {
    document.querySelector(".hero h2").textContent = "HWL-Ausgang konvertieren.";
    document.querySelector(".dropzone h3").textContent = "HWL-Ladeliste hier ablegen";
    document.querySelector(".file-hint").textContent = "Excel (.xlsx/.xls) · 40 feste Verladeplätze";
    document.querySelector(".working strong").textContent = "HWL-Ladeliste wird ausgewertet…";
    document.querySelector(".working span").textContent = "REG- und LDH-Plätze werden positionsgetreu übernommen; nichts rutscht nach.";
    heroFrom.textContent = "XLSX";
    heroText.textContent = "HWL-Ladeliste hochladen. Das Tool erzeugt exakt 40 positionsfeste Exportplätze und ignoriert nicht verladenen Überhang.";
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
  if (expectsPdf && (!file || (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")))) return showError("Bitte eine PDF-Datei auswählen.");
  if (!expectsPdf && (!file || !/\.(xlsx|xls)$/i.test(file.name))) return showError("Bitte eine Excel-Datei (.xlsx oder .xls) auswählen.");
  showOnly(working);
  try {
    const bytes = new Uint8Array(await file.arrayBuffer());
    if (mode === "inbound") {
      const parsed = await parseElischPdf(bytes);
      if (!parsed.trainNo) throw new Error("Keine Zugnummer/TrainID erkannt.");
      if (!parsed.date) throw new Error("Kein Listendatum erkannt.");
      if (!parsed.entries.length) throw new Error("Keine Ladeeinheiten erkannt.");
      parsedState = { ...parsed, sourceName:file.name, mode };
    } else if (mode === "outbound") {
      const parsed = parseLadeliste(bytes);
      if (!parsed.date) throw new Error("Kein Versandtag erkannt.");
      if (!parsed.entries.length) throw new Error("Keine Containerzeilen erkannt.");
      parsedState = { ...parsed, sourceName:file.name, mode };
    } else if (mode === "hellmann") {
      const parsed = await parseHellmannPdf(bytes);
      if (!parsed.trainNo) throw new Error("Keine Zugnummer/TrainID erkannt.");
      if (!parsed.date) throw new Error("Kein Versanddatum erkannt.");
      if (!parsed.entries.length) throw new Error("Keine Ladeeinheiten für Landshut → Osnabrück erkannt.");
      parsedState = { ...parsed, sourceName:file.name, mode };
    } else {
      const parsed = parseHwlLadeliste(bytes);
      if (!parsed.date) throw new Error("Kein Datum in der HWL-Ladeliste erkannt.");
      parsedState = { ...parsed, sourceName:file.name, mode };
    }
    renderResult(parsedState);
  } catch (err) {
    console.error(err);
    showError(err?.message || "Unbekannter Fehler beim Lesen der Datei.");
  }
}

function showError(message) {
  const title = errorBox.querySelector("h3");
  if (title) title.textContent = (mode === "outbound" || mode === "hwlOutbound") ? "Excel-Datei konnte nicht verarbeitet werden" : "PDF konnte nicht verarbeitet werden";
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

function parseHwlLadeliste(bytes) {
  const wb = XLSX.read(bytes, { type:"array", cellDates:false, raw:true });
  const ws = wb.Sheets[wb.SheetNames[0]];
  if (!ws) throw new Error("Die Arbeitsmappe enthält kein Tabellenblatt.");
  const matrix = XLSX.utils.sheet_to_json(ws, { header:1, defval:null, raw:true });
  if (matrix.length < 20) throw new Error("Die HWL-Ladeliste hat nicht die erwartete Struktur.");

  let date = normalizeDate(matrix?.[0]?.[1]);
  if (!date) {
    for (let r = 0; r < Math.min(matrix.length,5) && !date; r++) {
      for (let c = 0; c < Math.min((matrix[r]||[]).length,6) && !date; c++) date = normalizeDate(matrix[r][c]);
    }
  }

  const slots = [];
  let position = 1;
  const addSlot = (rowIndex, colIndex, area) => {
    const raw = clean(matrix?.[rowIndex]?.[colIndex]);
    const digits = raw.replace(/\D/g,"");
    const ctrNo = digits ? "CCPD" + digits.padStart(7,"0") : "";
    slots.push({ position:position++, area, sourceRow:rowIndex+1, sourceColumn:colIndex===0?"A":"D", wbNo:digits, ctrNo });
  };

  for (let r = 2; r <= 9; r++) addSlot(r,0,"REG");
  for (let r = 2; r <= 9; r++) addSlot(r,3,"REG");
  for (let r = 11; r <= 26; r++) addSlot(r,0,"LDH");
  for (let r = 11; r <= 18; r++) addSlot(r,3,"LDH");

  const ignored = [];
  for (let r = 19; r <= 26; r++) {
    const raw = clean(matrix?.[r]?.[3]);
    if (raw) ignored.push(raw);
  }

  return {
    trainNo:50020, date, slots, entries:slots, unitCount:slots.filter(s=>s.ctrNo).length, slotCount:40,
    regLoaded:slots.filter(s=>s.area==="REG" && s.ctrNo).length,
    ldhLoaded:slots.filter(s=>s.area==="LDH" && s.ctrNo).length,
    emptySlots:slots.filter(s=>!s.ctrNo).length,
    ignoredCount:ignored.length, ignoredUnits:ignored, warnings:[]
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
  let stats, columns, previewRows, subtitle, rules, previewLabel;

  if (mode === "inbound") {
    previewLabel = data.unitCount + " Zeilen";
    stats = [["Zugnummer",data.trainNo],["Datum",data.date],["Wagen",data.wagonCount],["Ladeeinheiten",data.unitCount]];
    columns = [["SEQ",r=>r.wagonSeq],["WAG_NO",r=>r.wagonNo],["CTR_NO",r=>r.ctrNo],["FE",r=>r.fe],["GROSS",r=>formatNumber(r.gross)],["BOOK_NO",r=>r.bookNo]];
    previewRows = data.entries;
    subtitle = "Erkannte TCM-Eingangsdaten";
    rules = [["LINER","TFG"],["ETA","12:00"],["Leading Zero","erhalten"]];
  } else if (mode === "outbound") {
    previewLabel = data.unitCount + " Zeilen";
    stats = [["Zugnummer","50418"],["ETD",data.date + " 20:00"],["Container",data.unitCount],["Zielterminals",data.destinationCount]];
    columns = [["CTR_NO",r=>r.ctrNo],["ISO",r=>r.iso],["FE",r=>r.fe],["GROSS",r=>formatNumber(r.gross)],["POD",r=>r.pod],["BILL_OF_LADING",r=>r.billOfLading]];
    previewRows = data.entries;
    subtitle = "Erkannte TFG-Exportdaten";
    rules = [["TRN_NO","50418"],["ETD","20:00"],["LINER","TFG"]];
  } else if (mode === "hellmann") {
    previewLabel = data.unitCount + " Zeilen";
    stats = [["Zugnummer",data.trainNo],["ETA",data.etaDate + " 04:00"],["Wagen erkannt",data.wagonCount],["Ladeeinheiten",data.unitCount]];
    columns = [["SEQ",r=>r.wagonSeq],["WAG_NO",r=>r.wagonNo],["SLOT",r=>r.slot],["CTR_NO",r=>r.ctrNo],["FE",r=>r.fe],["Gross",r=>formatNumber(r.gross)]];
    previewRows = data.entries;
    subtitle = "Landshut → Osnabrück · Lehrte wurde ignoriert";
    rules = [["LINER","HWL"],["ETA","+1 Tag · 04:00"],["Wagen 7–10","vorbereitet"]];
  } else {
    previewLabel = "40 Verladeplätze";
    stats = [["Zugnummer","50020"],["ETD",data.date + " 20:00"],["Beladen",data.unitCount + " / 40"],["Nicht verladen",data.ignoredCount]];
    columns = [["PLATZ",r=>r.position],["BEREICH",r=>r.area],["QUELLE",r=>r.sourceColumn + r.sourceRow],["WB-NR",r=>r.wbNo],["CTR_NO",r=>r.ctrNo],["STATUS",r=>r.ctrNo ? "verladen" : "frei"]];
    previewRows = data.slots;
    subtitle = "40 feste Plätze · REG und LDH bleiben positionsgetreu";
    rules = [["TRN_NO","50020"],["ETD","20:00"],["GROSS","12000"],["Überhang","ignoriert"]];
  }

  el("previewCount").textContent = previewLabel;
  statsBox.innerHTML = stats.map(([label,value]) => "<article><span>" + escapeHtml(label) + "</span><strong>" + escapeHtml(value ?? "–") + "</strong></article>").join("");
  previewHead.innerHTML = columns.map(([h]) => "<th>" + escapeHtml(h) + "</th>").join("");
  el("previewBody").innerHTML = previewRows.map(r => "<tr>" + columns.map(([,get]) => "<td>" + escapeHtml(get(r) ?? "") + "</td>").join("") + "</tr>").join("");
  previewSubtitle.textContent = subtitle;
  rulesBox.innerHTML = rules.map(([k,v]) => "<span>" + escapeHtml(k) + ": <b>" + escapeHtml(v) + "</b></span>").join("");

  const warnBox = el("warnings");
  const localWarnings = [...(data.warnings || [])];
  if (mode === "hwlOutbound" && data.ignoredCount) localWarnings.push(data.ignoredCount + " zusätzliche Einheit(en) außerhalb der 40 Verladeplätze wurden bewusst nicht exportiert.");
  if (localWarnings.length) {
    warnBox.innerHTML = localWarnings.map(w => "⚠ " + escapeHtml(w)).join("<br>");
    warnBox.classList.remove("hidden");
    el("statusIcon").className = "status-icon warn";
    el("statusIcon").textContent = "!";
    el("resultTitle").textContent = mode === "hwlOutbound" ? "HWL-Ladeliste positionsgetreu verarbeitet" : "Datei verarbeitet – bitte Hinweise prüfen";
  } else {
    warnBox.classList.add("hidden");
    el("statusIcon").className = "status-icon ok";
    el("statusIcon").textContent = "✓";
    el("resultTitle").textContent = mode === "hellmann" ? "Osnabrück-Abschnitt erfolgreich verarbeitet" : "Datei erfolgreich verarbeitet";
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

function makeHellmannRows(data) {
  const eta = excelSerialAtTime(data.etaDate, 4);
  const rows = [];
  for (let seq = 1; seq <= 10; seq++) {
    const wagon = data.wagons.get(seq);
    for (let slot = 1; slot <= 4; slot++) {
      const entry = wagon?.slots.get(slot) || null;
      const row = Object.fromEntries(HELL_HEADERS.map(h => [h, null]));
      Object.assign(row, HELL_FIXED, {
        TRN_NO: data.trainNo,
        ETA: eta,
        WAG_SEQ_NO: seq,
        WAG_NO: wagon?.wagonNo ? Number(wagon.wagonNo) : null,
        CTR_NO: entry?.ctrNo || null,
        FE: entry?.fe || null,
        Gross: entry?.gross ?? null
      });
      rows.push(HELL_HEADERS.map(h => row[h]));
    }
  }
  return rows;
}
function makeHwlOutboundRows(data) {
  const etd = excelSerialAtTime(data.date, 20);
  return data.slots.map(slot => {
    const row = Object.fromEntries(HWL_OUT_HEADERS.map(h => [h, null]));
    if (slot.ctrNo) {
      Object.assign(row, HWL_OUT_FIXED, {
        ETD: etd,
        CTR_NO: slot.ctrNo,
        FPOD: slot.area,
        POD: slot.area,
        PLACE_OF_DELIVERY: slot.area,
        LLPOD: slot.area
      });
    }
    return HWL_OUT_HEADERS.map(h => row[h]);
  });
}
function downloadExcel() {
  if (!parsedState) return;
  try {
    downloadBtn.disabled = true;
    if (mode === "inbound") {
      const rows = makeExcelRows(parsedState);
      const ws = XLSX.utils.aoa_to_sheet([HEADERS, ...rows], { cellDates:false });
      for (let r = 2; r <= rows.length + 1; r++) { const c=ws["E"+r]; if(c){c.t="n";c.z="dd.mm.yyyy hh:mm";} const ctr=ws["J"+r]; if(ctr) ctr.t="s"; }
      ws["!cols"] = HEADERS.map((h,i)=>({wch:i===4?19:i===7?15:i===9?16:i===17?14:Math.min(Math.max(h.length+2,10),24)}));
      const wb=XLSX.utils.book_new(); XLSX.utils.book_append_sheet(wb,ws,SHEET_NAME);
      XLSX.writeFile(wb,"CTOS-TCM-IN-TFG - "+parsedState.date+".xlsx",{bookType:"xlsx",compression:true});
    } else if (mode === "outbound") {
      const rows = makeOutboundRows(parsedState);
      const ws = XLSX.utils.aoa_to_sheet([OUT_HEADERS, ...rows], { cellDates:false });
      for (let r=2;r<=rows.length+1;r++){const etd=ws["B"+r];if(etd){etd.t="n";etd.z="dd.mm.yyyy hh:mm";} const ctr=ws["C"+r];if(ctr)ctr.t="s"; const release=ws["N"+r];if(release)release.t="s"; const bol=ws["Y"+r];if(bol)bol.t="s";}
      ws["!cols"]=OUT_HEADERS.map((h,i)=>({wch:i===1?19:i===2?16:(i===13||i===24)?22:Math.min(Math.max(h.length+2,10),24)}));
      const wb=XLSX.utils.book_new(); XLSX.utils.book_append_sheet(wb,ws,OUT_SHEET_NAME);
      XLSX.writeFile(wb,"TFG EXPORT "+parsedState.date+".xlsx",{bookType:"xlsx",compression:true});
    } else if (mode === "hellmann") {
      const rows = makeHellmannRows(parsedState);
      const ws = XLSX.utils.aoa_to_sheet([HELL_HEADERS, ...rows], { cellDates:false });
      for (let r=2;r<=rows.length+1;r++){const eta=ws["E"+r];if(eta){eta.t="n";eta.z="dd.mm.yyyy hh:mm";} const ctr=ws["J"+r];if(ctr)ctr.t="s";}
      ws["!cols"]=HELL_HEADERS.map((h,i)=>({wch:i===4?19:i===7?15:i===9?16:Math.min(Math.max(h.length+2,10),24)}));
      const wb=XLSX.utils.book_new(); XLSX.utils.book_append_sheet(wb,ws,SHEET_NAME);
      XLSX.writeFile(wb,"CTOS-TCM-IN-HWL "+parsedState.etaDate+".xlsx",{bookType:"xlsx",compression:true});
    } else {
      const rows = makeHwlOutboundRows(parsedState);
      const ws = XLSX.utils.aoa_to_sheet([HWL_OUT_HEADERS, ...rows], { cellDates:false });
      for (let r=2;r<=rows.length+1;r++){const etd=ws["B"+r];if(etd){etd.t="n";etd.z="dd.mm.yyyy hh:mm";} const ctr=ws["C"+r];if(ctr)ctr.t="s";}
      ws["!cols"]=HWL_OUT_HEADERS.map((h,i)=>({wch:i===1?19:i===2?16:Math.min(Math.max(String(h).length+2,10),24)}));
      const wb=XLSX.utils.book_new(); XLSX.utils.book_append_sheet(wb,ws,HWL_OUT_SHEET_NAME);
      XLSX.writeFile(wb,"HWL EXPORT "+parsedState.date+".xlsx",{bookType:"xlsx",compression:true});
    }
  } catch (err) {
    console.error(err);
    alert("Die Excel-Datei konnte nicht erstellt werden: " + (err?.message || err));
  } finally { downloadBtn.disabled = false; }
}
