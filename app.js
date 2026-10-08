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

const MED_FIXED = {
  TRN_OPER_CODE: "MEDLOG",
  TRN_DEST_STN: "DEOSN",
  R_D: "R",
  TRN_LENGTH: 700,
  WAG_TYPE: 6264,
  LINER: "MED",
  CUSTOMER_ID: "MED",
  CATEGORY: "I"
};
const MED_SHEET_NAME = "Tabelle1";



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

const TFG_LOGO_DATA = "https://www.transfracht.com/resource/blob/8748624/a6e0cac5cfbf5b88dd4f0cf7cb7342c4/TFG-data.jpg";
const HWL_LOGO_DATA = "https://images.seeklogo.com/logo-png/38/1/hellmann-logo-png_seeklogo-387871.png";
const MED_LOGO_DATA = "https://images.seeklogo.com/logo-png/34/1/medlog-transport-logistics-logo-png_seeklogo-349013.png";
let mode = null;
let activeBrand = null;

let parsedState = null;

setupModeSwitcher();
showBrandLanding();


function setupModeSwitcher() {
  const style = document.createElement("style");
  style.textContent = `
    .brand-landing{margin:4px 0 0}
    .brand-intro{max-width:760px;margin:56px auto 34px;text-align:center}
    .brand-intro .eyebrow{margin-bottom:14px}
    .brand-intro h2{margin:0;font-size:clamp(42px,5.4vw,68px);line-height:.98;letter-spacing:-.055em;color:#102033}
    .brand-intro p{max-width:620px;margin:20px auto 0;color:#67788b;font-size:15px;line-height:1.65}
    .brand-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:20px;max-width:1120px;margin:0 auto}
    .brand-card{position:relative;min-height:300px;padding:24px;border:1px solid #dbe3ec;border-radius:18px;background:#fff;color:#102033;display:flex;flex-direction:column;align-items:stretch;justify-content:space-between;text-align:left;box-shadow:0 14px 40px rgba(31,52,77,.08);transition:transform .2s ease,border-color .2s ease,box-shadow .2s ease;overflow:hidden}
    .brand-card::before{content:"";position:absolute;inset:0 auto 0 0;width:5px;background:#0b5cab;opacity:.95}
    .brand-card:hover{transform:translateY(-4px);border-color:#aac4df;box-shadow:0 22px 56px rgba(31,52,77,.14)}
    .brand-logo-wrap{height:158px;border-radius:12px;background:#f7f9fb;border:1px solid #e7edf3;display:flex;align-items:center;justify-content:center;padding:22px 30px;overflow:hidden}
    .brand-logo-wrap img{display:block;max-width:82%;max-height:104px;object-fit:contain}
    .brand-card.hwl .brand-logo-wrap img{max-width:118px;max-height:118px}
    .med-wordmark{font-size:34px;font-weight:900;letter-spacing:-.045em;color:#0b5cab}
    .brand-card.med .brand-logo-wrap{background:linear-gradient(145deg,#f9fbfd,#eef4f9)}
    .brand-card.med .brand-logo-wrap img{max-width:82%;max-height:92px}
    .mode-switch.single{grid-template-columns:1fr;max-width:560px}
    .brand-card-copy{display:flex;align-items:flex-end;justify-content:space-between;gap:18px;padding:20px 4px 2px}
    .brand-card-copy strong{display:block;font-size:27px;letter-spacing:-.035em}
    .brand-card-copy span{display:block;margin-top:5px;color:#7d8d9f;font-size:12px}
    .brand-arrow{display:grid;place-items:center;width:38px;height:38px;border-radius:50%;background:#0b5cab;color:#fff;font-size:18px;flex:0 0 auto}
    .mode-shell{display:flex;align-items:center;gap:14px;margin:0 0 22px}
    .mode-back{white-space:nowrap}
    .mode-switch{display:grid;grid-template-columns:1fr 1fr;gap:12px;flex:1}
    .mode-btn{display:grid;grid-template-columns:auto 1fr auto;grid-template-rows:auto auto;column-gap:12px;row-gap:2px;align-items:center;padding:16px 17px;border:1px solid #dbe3ec;border-radius:12px;background:#fff;color:#102033;text-align:left;box-shadow:0 6px 18px rgba(31,52,77,.05);transition:.18s ease}
    .mode-btn:hover{border-color:#aac4df;box-shadow:0 10px 26px rgba(31,52,77,.09)}
    .mode-btn.active{border-color:#0b5cab;box-shadow:inset 0 0 0 1px #0b5cab}
    .mode-kicker{grid-row:1/3;display:grid;place-items:center;width:42px;height:42px;border-radius:9px;background:#eaf2fb;color:#0b5cab;font-size:10px;font-weight:900;letter-spacing:.08em}
    .mode-title{font-size:14px;font-weight:800}
    .mode-desc{font-size:11px;color:#77889a}
    .mode-btn::after{content:"→";grid-row:1/3;grid-column:3;color:#0b5cab;font-size:18px}
    .hellmann-part2{margin:14px 0 0;padding:16px;border:1px solid #dbe4ed;border-radius:12px;background:#f8fbfe}
    .hellmann-part2-head{display:flex;align-items:center;justify-content:space-between;gap:16px}
    .hellmann-part2-copy{display:flex;align-items:flex-start;gap:12px}
    .hellmann-part2-icon{display:grid;place-items:center;width:36px;height:36px;border-radius:9px;background:#eaf2fb;color:#0b5cab;font-size:13px;font-weight:900;flex:0 0 auto}
    .hellmann-part2 h4{margin:0;font-size:13px;color:#15304e}
    .hellmann-part2 p{margin:4px 0 0;color:#74869a;font-size:11px;line-height:1.5}
    .hellmann-part2-meta{display:flex;flex-wrap:wrap;gap:7px;margin-top:12px}
    .hellmann-part2-meta span{padding:6px 8px;border:1px solid #dbe4ed;border-radius:7px;background:#fff;color:#66788c;font-size:10px}
    .hellmann-part2.done{border-color:rgba(24,166,122,.25);background:rgba(24,166,122,.055)}
    .hellmann-part2.done .hellmann-part2-icon{background:rgba(24,166,122,.11);color:#15835f}
    .hellmann-part2.error{border-color:rgba(216,91,114,.25);background:rgba(216,91,114,.055)}
    .hellmann-part2-drop{margin-top:14px;min-height:126px;border:1.5px dashed #b8c9d9;border-radius:10px;background:#fff;display:flex;align-items:center;justify-content:center;text-align:center;padding:18px;transition:.18s ease;outline:none}
    .hellmann-part2-drop:hover,.hellmann-part2-drop:focus,.hellmann-part2-drop.drag{border-color:#0b5cab;background:#f1f7fd;box-shadow:inset 0 0 0 1px rgba(11,92,171,.05)}
    .hellmann-part2-drop strong{display:block;color:#15304e;font-size:13px}
    .hellmann-part2-drop span{display:block;margin-top:5px;color:#7d8d9f;font-size:10px;line-height:1.45}
    .hellmann-part2-drop .drop-symbol{width:34px;height:34px;margin:0 auto 9px;border-radius:8px;background:#eaf2fb;color:#0b5cab;display:grid;place-items:center;font-size:18px}
    .hellmann-part2.done .hellmann-part2-drop{border-style:solid;border-color:rgba(24,166,122,.22);background:#fff}
    @media(max-width:760px){.hellmann-part2-head{align-items:stretch;flex-direction:column}.hellmann-part2-head .ghost-btn{width:100%}}
    @media(max-width:900px){.brand-grid{grid-template-columns:1fr}.mode-switch{grid-template-columns:1fr}.mode-shell{align-items:stretch;flex-direction:column}.brand-card{min-height:250px}.brand-intro{margin-top:30px}.brand-intro h2{font-size:42px}}
  `;
  document.head.appendChild(style);

  const landing = document.createElement("section");
  landing.id = "brandLanding";
  landing.className = "brand-landing";
  landing.innerHTML = '<div class="brand-intro"><div class="eyebrow">CTOS TOOL</div><h2>Partner auswählen.</h2><p>Wähle den gewünschten Verkehrspartner. Anschließend stehen dir die passenden Funktionen für Eingang und Ausgang zur Verfügung.</p></div>' +
    '<div class="brand-grid"><button id="brandTFG" class="brand-card" type="button"><div class="brand-logo-wrap"><img alt="TFG Transfracht" src="' + TFG_LOGO_DATA + '"></div><div class="brand-card-copy"><div><strong>TFG</strong><span>Transfracht · Eingang & Ausgang</span></div><span class="brand-arrow">→</span></div></button>' +
    '<button id="brandHWL" class="brand-card hwl" type="button"><div class="brand-logo-wrap"><img alt="Hellmann Worldwide Logistics" src="' + HWL_LOGO_DATA + '"></div><div class="brand-card-copy"><div><strong>HWL</strong><span>Hellmann · Eingang & Ausgang</span></div><span class="brand-arrow">→</span></div></button>' +
    '<button id="brandMED" class="brand-card med" type="button"><div class="brand-logo-wrap"><img alt="MEDLOG" src="' + MED_LOGO_DATA + '"></div><div class="brand-card-copy"><div><strong>MEDLOG</strong><span>MED · Eingang</span></div><span class="brand-arrow">→</span></div></button></div>';
  document.querySelector(".hero").parentNode.insertBefore(landing, document.querySelector(".hero"));

  const shell = document.createElement("div");
  shell.id = "modeShell";
  shell.className = "mode-shell hidden";
  shell.innerHTML = '<button id="brandBack" class="ghost-btn mode-back" type="button">← Partner</button><div class="mode-switch">' +
    '<button id="modeInbound" data-brand="tfg" class="mode-btn" type="button"><span class="mode-kicker">TFG</span><span class="mode-title">Eingang</span><span class="mode-desc">Elisch PDF → TCM Excel</span></button>' +
    '<button id="modeOutbound" data-brand="tfg" class="mode-btn" type="button"><span class="mode-kicker">TFG</span><span class="mode-title">Ausgang</span><span class="mode-desc">Ladeliste Excel → Export Excel</span></button>' +
    '<button id="modeHellmann" data-brand="hwl" class="mode-btn" type="button"><span class="mode-kicker">HWL</span><span class="mode-title">Eingang</span><span class="mode-desc">PDF + Zusatzliste → TCM Excel</span></button>' +
    '<button id="modeHwlOutbound" data-brand="hwl" class="mode-btn" type="button"><span class="mode-kicker">HWL</span><span class="mode-title">Ausgang</span><span class="mode-desc">Ladeliste Excel → Export Excel</span></button>' +
    '<button id="modeMedInbound" data-brand="med" class="mode-btn" type="button"><span class="mode-kicker">MED</span><span class="mode-title">Eingang</span><span class="mode-desc">Train Composition → TCM Excel</span></button></div>';
  panel.parentNode.insertBefore(shell, panel);
  const part2 = document.createElement("div");
  part2.id = "hellmannPart2";
  part2.className = "hellmann-part2 hidden";
  part2.innerHTML = '<div class="hellmann-part2-head"><div class="hellmann-part2-copy"><span class="hellmann-part2-icon">2</span><div><h4 id="hellmannPart2Title">Teil 2 · Regensburg → Osnabrück</h4><p id="hellmannPart2Text">Separate Wagenliste für Wagen 7–10 hinzufügen.</p></div></div><button id="hellmannPart2Btn" class="ghost-btn" type="button">Datei auswählen</button></div><div id="hellmannPart2Drop" class="hellmann-part2-drop" tabindex="0" role="button"><div><div class="drop-symbol">↓</div><strong id="hellmannPart2DropTitle">Zusatzliste hier hineinziehen</strong><span id="hellmannPart2DropText">.xls oder .xlsx · auch direkt aus einer Mail, wenn der Browser den Anhang als Datei bereitstellt</span></div></div><div id="hellmannPart2Meta" class="hellmann-part2-meta"></div><input id="hellmannPart2Input" type="file" accept=".xls,.xlsx,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" hidden>';
  document.querySelector(".result .actions").parentNode.insertBefore(part2, document.querySelector(".result .actions"));
  el("brandTFG").addEventListener("click", () => selectBrand("tfg"));
  el("brandHWL").addEventListener("click", () => selectBrand("hwl"));
  el("brandMED").addEventListener("click", () => selectBrand("med"));
  el("brandBack").addEventListener("click", showBrandLanding);
  el("modeInbound").addEventListener("click", () => setMode("inbound"));
  el("modeOutbound").addEventListener("click", () => setMode("outbound"));
  el("modeHellmann").addEventListener("click", () => setMode("hellmann"));
  el("modeHwlOutbound").addEventListener("click", () => setMode("hwlOutbound"));
  el("modeMedInbound").addEventListener("click", () => setMode("medInbound"));
  el("hellmannPart2Btn").addEventListener("click", () => el("hellmannPart2Input").click());
  el("hellmannPart2Input").addEventListener("change", () => {
    const file = el("hellmannPart2Input").files?.[0];
    if (file) handleHellmannSecondFile(file);
  });
  const part2Drop = el("hellmannPart2Drop");
  ["dragenter","dragover"].forEach(evt => part2Drop.addEventListener(evt, e => {
    e.preventDefault();
    e.stopPropagation();
    part2Drop.classList.add("drag");
  }));
  ["dragleave","drop"].forEach(evt => part2Drop.addEventListener(evt, e => {
    e.preventDefault();
    e.stopPropagation();
    part2Drop.classList.remove("drag");
  }));
  part2Drop.addEventListener("drop", e => {
    const file = e.dataTransfer?.files?.[0];
    if (file) handleHellmannSecondFile(file);
    else renderHellmannPart2Error("Der Browser hat aus dem Drop keine Datei erhalten. In diesem Fall bitte den Anhang anklicken oder kurz lokal speichern.");
  });
  part2Drop.addEventListener("click", () => el("hellmannPart2Input").click());
  part2Drop.addEventListener("keydown", e => {
    if (e.key === "Enter" || e.key === " ") { e.preventDefault(); el("hellmannPart2Input").click(); }
  });
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
  document.querySelector(".mode-switch").classList.toggle("single", brand === "med");
  const titles = { tfg:"TFG Converter", hwl:"HWL Converter", med:"MEDLOG Converter" };
  const subtitles = { tfg:"TFG Import & Export", hwl:"HWL Import & Export", med:"MEDLOG Eingang" };
  document.querySelector(".brand h1").textContent = titles[brand] || "CTOS Converter";
  document.querySelector(".brand p").textContent = subtitles[brand] || "Import & Export";
  setMode(brand === "tfg" ? "inbound" : brand === "hwl" ? "hellmann" : "medInbound");
}

function setMode(nextMode) {
  mode = nextMode;
  const map = {
    inbound:"modeInbound",
    outbound:"modeOutbound",
    hellmann:"modeHellmann",
    hwlOutbound:"modeHwlOutbound",
    medInbound:"modeMedInbound"
  };
  ["modeInbound","modeOutbound","modeHellmann","modeHwlOutbound","modeMedInbound"].forEach(id => el(id).classList.toggle("active", id === map[mode]));
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
    heroText.textContent = "Zuerst die Landshut-PDF hochladen. Anschließend kann die separate Regensburg-Liste für Wagen 7–10 direkt ergänzt werden.";
  } else if (mode === "medInbound") {
    document.querySelector(".hero h2").textContent = "MEDLOG-Eingang konvertieren.";
    document.querySelector(".dropzone h3").textContent = "MEDLOG Train Composition hier ablegen";
    document.querySelector(".file-hint").textContent = "Excel (.xlsx/.xls) · Blatt Outbound wird automatisch verwendet";
    document.querySelector(".working strong").textContent = "MEDLOG-Datei wird ausgewertet…";
    document.querySelector(".working span").textContent = "Wagen, Container, ISO-Codes und Gewichte werden aus Outbound übernommen.";
    heroFrom.textContent = "XLSX";
    heroText.textContent = "MEDLOG Train Composition hochladen. ISO-Codes werden vorerst unverändert aus der Quelle übernommen; fehlendes Gewicht wird mit 10.000 kg ergänzt.";
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
  if (el("hellmannPart2Input")) el("hellmannPart2Input").value = "";
  if (el("hellmannPart2")) el("hellmannPart2").classList.add("hidden");
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
      parsedState = { ...parsed, sourceName:file.name, part1SourceName:file.name, part1Warnings:[...(parsed.warnings || [])], mode };
    } else if (mode === "medInbound") {
      const parsed = parseMedlogInbound(bytes);
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
  if (title) title.textContent = (mode === "outbound" || mode === "hwlOutbound" || mode === "medInbound") ? "Excel-Datei konnte nicht verarbeitet werden" : "PDF konnte nicht verarbeitet werden";
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
function parseHellmannSecondPart(bytes) {
  const wb = XLSX.read(bytes, { type:"array", cellDates:false, raw:true });
  const ws = wb.Sheets[wb.SheetNames[0]];
  if (!ws) throw new Error("Die Zusatzliste enthält kein Tabellenblatt.");
  const matrix = XLSX.utils.sheet_to_json(ws, { header:1, defval:null, raw:true });
  if (!matrix.length) throw new Error("Die Zusatzliste ist leer.");

  let headerRow = -1;
  let idx = null;
  for (let r = 0; r < Math.min(matrix.length, 30); r++) {
    const headers = (matrix[r] || []).map(normalizeHeader);
    const find = test => headers.findIndex(test);
    const candidate = {
      ctr: find(h => h.includes("lecontainer") && h.includes("prefix")),
      bl: find(h => h === "bl"),
      tara: find(h => h.includes("tara")),
      load: find(h => h.includes("ladgew")),
      wagon: find(h => h.includes("wagennummer")),
      nhm: find(h => h.includes("nhmnummer") || h === "nhm"),
      destination: find(h => h.includes("bestbahnhof")),
      length: find(h => h.startsWith("lelg")),
      type: find(h => h.startsWith("legat")),
      height: find(h => h.includes("lehohe") || h.includes("lehoehe"))
    };
    if (candidate.ctr >= 0 && candidate.bl >= 0 && candidate.tara >= 0 && candidate.load >= 0 && candidate.wagon >= 0 && candidate.nhm >= 0) {
      headerRow = r;
      idx = candidate;
      break;
    }
  }
  if (headerRow < 0) throw new Error("Die Spalten der Regensburg-Zusatzliste konnten nicht erkannt werden.");

  let sourceDate = null;
  for (let r = 0; r < Math.min(matrix.length, headerRow + 1) && !sourceDate; r++) {
    for (const value of (matrix[r] || [])) {
      const m = clean(value).match(/\b(\d{2}\.\d{2}\.\d{4})\b/);
      if (m) { sourceDate = m[1]; break; }
    }
  }

  const warnings = [];
  const groups = new Map();
  const wagonOrder = [];
  const taras = new Set();

  for (let r = headerRow + 1; r < matrix.length; r++) {
    const row = matrix[r] || [];
    const ctrNo = clean(row[idx.ctr]).toUpperCase().replace(/[^A-Z0-9]/g, "");
    if (!/^[A-Z]{4}\d{7}$/.test(ctrNo)) continue;

    const wagonNo = clean(row[idx.wagon]).replace(/\D/g, "");
    if (!/^\d{12}$/.test(wagonNo)) {
      warnings.push("Zeile " + (r + 1) + ": Wagennummer zu " + ctrNo + " konnte nicht erkannt werden.");
      continue;
    }

    const tara = toNumber(row[idx.tara]);
    const loadWeight = toNumber(row[idx.load]);
    if (tara === null || loadWeight === null) {
      warnings.push("Zeile " + (r + 1) + ": Tara oder Ladungsgewicht bei " + ctrNo + " fehlt.");
      continue;
    }
    taras.add(tara);

    const bl = clean(row[idx.bl]).toUpperCase();
    const nhm = clean(row[idx.nhm]).replace(/\D/g, "");
    let fe = bl === "B" ? "F" : bl === "L" ? "E" : "";
    if (!fe) fe = nhm === "990200" ? "F" : nhm === "993200" ? "E" : "";
    if (!fe) warnings.push("Zeile " + (r + 1) + ": B/L bzw. NHM bei " + ctrNo + " nicht eindeutig.");

    if (!groups.has(wagonNo)) {
      if (wagonOrder.length >= 4) throw new Error("Die Zusatzliste enthält mehr als vier Wagen. Erwartet werden Wagen 7–10.");
      groups.set(wagonNo, []);
      wagonOrder.push(wagonNo);
    }
    const list = groups.get(wagonNo);
    if (list.length >= 4) throw new Error("Wagen " + wagonNo + " enthält mehr als vier Ladeeinheiten.");

    if (idx.destination >= 0) {
      const destination = normalizeHeader(row[idx.destination]);
      if (destination && !destination.includes("osna")) warnings.push("Zeile " + (r + 1) + ": Ziel ist nicht Osnabrück bei " + ctrNo + ".");
    }

    list.push({
      ctrNo,
      wagonNo,
      tara,
      loadWeight,
      gross: tara + loadWeight,
      fe,
      nhm,
      bl,
      sourceRow: r + 1
    });
  }

  if (!wagonOrder.length) throw new Error("Keine Ladeeinheiten in der Regensburg-Zusatzliste erkannt.");

  const wagons = new Map();
  const entries = [];
  wagonOrder.forEach((wagonNo, wagonIndex) => {
    const seq = 7 + wagonIndex;
    const slots = new Map();
    groups.get(wagonNo).forEach((item, i) => {
      const entry = { ...item, wagonSeq:seq, slot:i + 1 };
      slots.set(i + 1, entry);
      entries.push(entry);
    });
    wagons.set(seq, { wagonNo, slots });
  });

  if (wagonOrder.length !== 4) warnings.push("Es wurden " + wagonOrder.length + " statt 4 Zusatzwagen erkannt; übrige Wagenplätze bleiben vorbereitet.");
  for (const [seq, wagon] of wagons) {
    if (wagon.slots.size !== 4) warnings.push("Wagen " + seq + " (" + wagon.wagonNo + ") enthält " + wagon.slots.size + " statt 4 Ladeeinheiten.");
  }

  return {
    date: sourceDate,
    entries,
    wagons,
    wagonCount: wagons.size,
    unitCount: entries.length,
    taras: [...taras].sort((a,b) => a-b),
    warnings
  };
}

function mergeHellmannSecondPart(base, part2, sourceName) {
  const wagons = new Map();
  for (let seq = 1; seq <= 6; seq++) {
    const wagon = base.wagons.get(seq);
    if (wagon) wagons.set(seq, wagon);
  }
  for (const [seq, wagon] of part2.wagons) wagons.set(seq, wagon);

  const entries = base.entries.filter(e => e.wagonSeq <= 6).concat(part2.entries);
  const warnings = [...(base.part1Warnings || []), ...(part2.warnings || [])];

  return {
    ...base,
    sourceName: (base.part1SourceName || base.sourceName) + " + " + sourceName,
    entries,
    wagons,
    wagonCount: new Set(entries.map(e => e.wagonNo)).size,
    unitCount: entries.length,
    warnings,
    part2: {
      sourceName,
      date: part2.date,
      wagonCount: part2.wagonCount,
      unitCount: part2.unitCount,
      taras: part2.taras
    }
  };
}

async function handleHellmannSecondFile(file) {
  if (mode !== "hellmann" || !parsedState) return;
  if (!file || !/\.(xls|xlsx)$/i.test(file.name)) {
    renderHellmannPart2Error("Bitte die Regensburg-Liste als .xls oder .xlsx auswählen.");
    return;
  }

  const btn = el("hellmannPart2Btn");
  btn.disabled = true;
  btn.textContent = "Wird gelesen…";
  if (el("hellmannPart2DropTitle")) el("hellmannPart2DropTitle").textContent = "Zusatzliste wird verarbeitet…";
  try {
    const bytes = new Uint8Array(await file.arrayBuffer());
    const part2 = parseHellmannSecondPart(bytes);
    parsedState = mergeHellmannSecondPart(parsedState, part2, file.name);
    el("hellmannPart2Input").value = "";
    renderResult(parsedState);
  } catch (err) {
    console.error(err);
    renderHellmannPart2Error(err?.message || "Die Zusatzliste konnte nicht verarbeitet werden.");
  } finally {
    btn.disabled = false;
    if (mode === "hellmann" && parsedState?.part2) btn.textContent = "Datei ersetzen";
    else if (mode === "hellmann") btn.textContent = "Teil 2 hinzufügen";
  }
}

function renderHellmannPart2Error(message) {
  const box = el("hellmannPart2");
  box.classList.remove("hidden", "done");
  box.classList.add("error");
  box.querySelector(".hellmann-part2-icon").textContent = "!";
  el("hellmannPart2Title").textContent = "Teil 2 konnte nicht verarbeitet werden";
  el("hellmannPart2Text").textContent = message;
  el("hellmannPart2Meta").innerHTML = "";
  el("hellmannPart2Btn").textContent = "Andere Datei wählen";
  if (el("hellmannPart2DropTitle")) el("hellmannPart2DropTitle").textContent = "Andere Zusatzliste hineinziehen";
  if (el("hellmannPart2DropText")) el("hellmannPart2DropText").textContent = message;
}
function normalizeHeader(value) {
  return clean(value)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ß/g, "ss")
    .replace(/[^a-z0-9]/g, "");
}

function medlogDateToGerman(value) {
  if (value === null || value === undefined || value === "") return null;
  if (typeof value === "number") {
    const d = XLSX.SSF.parse_date_code(value);
    return d ? pad2(d.d) + "." + pad2(d.m) + "." + d.y : null;
  }
  const text = clean(value);
  let m = text.match(/^(\d{2})\/(\d{2})\/(\d{4})/);
  if (m) return m[1] + "." + m[2] + "." + m[3];
  m = text.match(/^(\d{2})\.(\d{2})\.(\d{4})/);
  if (m) return m[1] + "." + m[2] + "." + m[3];
  return null;
}

function parseMedlogInbound(bytes) {
  const wb = XLSX.read(bytes, { type:"array", cellDates:false, raw:true });
  const sheetName = wb.SheetNames.find(n => normalizeHeader(n) === "outbound");
  if (!sheetName) throw new Error("Das Tabellenblatt \"Outbound\" wurde nicht gefunden.");
  const ws = wb.Sheets[sheetName];
  const matrix = XLSX.utils.sheet_to_json(ws, { header:1, defval:null, raw:true });
  if (!matrix.length) throw new Error("Das Outbound-Tabellenblatt ist leer.");

  let voyage = null;
  let etdDate = null;
  let headerRow = -1;
  let indices = null;

  for (let r = 0; r < Math.min(matrix.length, 40); r++) {
    const row = matrix[r] || [];
    const label = normalizeHeader(row[0]);
    if (label === "voyage" && row[1] !== null && row[1] !== undefined) voyage = clean(row[1]);
    if (label === "etd" && row[1] !== null && row[1] !== undefined) etdDate = medlogDateToGerman(row[1]);

    const h = row.map(normalizeHeader);
    const find = (...names) => h.findIndex(x => names.includes(x));
    const candidate = {
      seq: find("wagonposition"),
      wagon: find("wagonnumber"),
      slot: find("wagonslot"),
      ctr: find("containernumber"),
      iso: find("containertypeisocode"),
      gross: find("grossweightkg"),
      fe: find("fullempty")
    };
    if (candidate.seq >= 0 && candidate.wagon >= 0 && candidate.ctr >= 0 && candidate.iso >= 0 && candidate.gross >= 0 && candidate.fe >= 0) {
      headerRow = r;
      indices = candidate;
      break;
    }
  }

  if (headerRow < 0) throw new Error("Die MEDLOG-Spalten konnten im Outbound-Blatt nicht erkannt werden.");
  if (!voyage) throw new Error("Keine MEDLOG-Voyage erkannt.");
  const trainMatch = voyage.match(/\/\s*(\d{4,6})\b/) || voyage.match(/\b(\d{4,6})\b/);
  if (!trainMatch) throw new Error("Aus der Voyage konnte keine Zugnummer abgeleitet werden.");
  const trainNo = Number(trainMatch[1]);
  if (!etdDate) throw new Error("Kein ETD-Datum im MEDLOG-Outbound-Blatt erkannt.");
  const etaDate = addDaysToGermanDate(etdDate, 1);

  let currentSeq = null;
  let currentWagon = null;
  let fallbackWeightCount = 0;
  const entries = [];
  const warnings = [];

  for (let r = headerRow + 1; r < matrix.length; r++) {
    const row = matrix[r] || [];
    const seqValue = toNumber(row[indices.seq]);
    if (seqValue !== null) currentSeq = Number(seqValue);

    const wagonText = clean(row[indices.wagon]).replace(/\D/g, "");
    if (wagonText) currentWagon = wagonText;

    const ctrNo = clean(row[indices.ctr]).toUpperCase().replace(/[^A-Z0-9]/g, "");
    if (!ctrNo) continue;
    if (!/^[A-Z]{4}\d{7}$/.test(ctrNo)) {
      warnings.push("Zeile " + (r + 1) + ": Containernummer " + ctrNo + " hat ein unerwartetes Format.");
    }
    if (currentSeq === null || !currentWagon) {
      warnings.push("Zeile " + (r + 1) + ": " + ctrNo + " konnte keinem Wagen zugeordnet werden.");
      continue;
    }

    const iso = clean(row[indices.iso]).toUpperCase();
    const fe = clean(row[indices.fe]).toUpperCase();
    let gross = toNumber(row[indices.gross]);
    if (gross === null) {
      gross = 10000;
      fallbackWeightCount++;
    }

    entries.push({
      wagonSeq: currentSeq,
      wagonNo: currentWagon,
      slot: indices.slot >= 0 ? toNumber(row[indices.slot]) : null,
      ctrNo,
      iso,
      fe,
      gross
    });
  }

  if (!entries.length) throw new Error("Keine Container im MEDLOG-Outbound-Blatt erkannt.");
  const wagonCount = new Set(entries.map(e => e.wagonNo)).size;

  return {
    trainNo,
    etdDate,
    etaDate,
    entries,
    wagonCount,
    unitCount: entries.length,
    fallbackWeightCount,
    warnings
  };
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
    previewLabel = data.unitCount + " Ladeeinheiten";
    stats = [["Zugnummer",data.trainNo],["ETA",data.etaDate + " 04:00"],["Wagen",data.wagonCount + " / 10"],["Ladeeinheiten",data.unitCount]];
    columns = [["SEQ",r=>r.wagonSeq],["WAG_NO",r=>r.wagonNo],["SLOT",r=>r.slot],["CTR_NO",r=>r.ctrNo],["FE",r=>r.fe],["Gross",r=>formatNumber(r.gross)]];
    previewRows = data.entries;
    subtitle = data.part2 ? "Landshut + Regensburg → Osnabrück" : "Landshut → Osnabrück · Wagen 7–10 vorbereitet";
    rules = [["LINER","HWL"],["ETA","+1 Tag · 04:00"],["Teil 2",data.part2 ? "ergänzt" : "offen"]];
  } else if (mode === "medInbound") {
    previewLabel = data.unitCount + " Container";
    stats = [["Zugnummer",data.trainNo],["ETA",data.etaDate + " 06:00"],["Wagen",data.wagonCount],["Container",data.unitCount]];
    columns = [["SEQ",r=>r.wagonSeq],["WAG_NO",r=>r.wagonNo],["CTR_NO",r=>r.ctrNo],["ISO",r=>r.iso],["FE",r=>r.fe],["GROSS",r=>formatNumber(r.gross)]];
    previewRows = data.entries;
    subtitle = "MEDLOG Outbound → CTOS Eingang";
    rules = [["LINER","MED"],["ETA","+1 Tag · 06:00"],["ISO","aus Quelle"],["Fehlendes GROSS","10.000 kg"]];
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
    if (mode === "hwlOutbound") el("resultTitle").textContent = "HWL-Ladeliste positionsgetreu verarbeitet";
    else if (mode === "hellmann") el("resultTitle").textContent = data.part2 ? "HWL-Eingang vollständig ergänzt – Hinweise prüfen" : "Teil 1 verarbeitet – Wagen 7–10 vorbereitet";
    else el("resultTitle").textContent = "Datei verarbeitet – bitte Hinweise prüfen";
  } else {
    warnBox.classList.add("hidden");
    el("statusIcon").className = "status-icon ok";
    el("statusIcon").textContent = "✓";
    if (mode === "hellmann") el("resultTitle").textContent = data.part2 ? "HWL-Eingang vollständig ergänzt" : "Teil 1 verarbeitet – Wagen 7–10 vorbereitet";
    else el("resultTitle").textContent = "Datei erfolgreich verarbeitet";
  }
  el("resetBtn").textContent = "Andere Datei";
  showOnly(result);
  renderHellmannPart2Control(data);
}


function renderHellmannPart2Control(data) {
  const box = el("hellmannPart2");
  if (!box) return;
  if (mode !== "hellmann") {
    box.classList.add("hidden");
    return;
  }

  box.classList.remove("hidden", "error", "done");
  const icon = box.querySelector(".hellmann-part2-icon");
  const meta = el("hellmannPart2Meta");
  const btn = el("hellmannPart2Btn");

  if (data.part2) {
    box.classList.add("done");
    icon.textContent = "✓";
    el("hellmannPart2Title").textContent = "Teil 2 ergänzt · Regensburg → Osnabrück";
    el("hellmannPart2Text").textContent = data.part2.sourceName + " wurde auf die vorbereiteten Wagen 7–10 gelegt. ETA aus Teil 1 bleibt unverändert.";
    btn.textContent = "Datei ersetzen";
    el("hellmannPart2DropTitle").textContent = "Andere Zusatzliste hineinziehen";
    el("hellmannPart2DropText").textContent = data.part2.sourceName + " ist aktuell geladen · Drop ersetzt Teil 2";
    const taraText = data.part2.taras?.length ? data.part2.taras.map(v => formatNumber(v) + " kg").join(" / ") : "aus Datei";
    meta.innerHTML = [
      ["Wagen", data.part2.wagonCount],
      ["Ladeeinheiten", data.part2.unitCount],
      ["Tara", taraText],
      ["Datum Zusatzliste", data.part2.date || "–"]
    ].map(([k,v]) => "<span>" + escapeHtml(k) + ": <b>" + escapeHtml(v) + "</b></span>").join("");
  } else {
    icon.textContent = "2";
    el("hellmannPart2Title").textContent = "Teil 2 · Regensburg → Osnabrück";
    el("hellmannPart2Text").textContent = "Optional die separate .xls/.xlsx-Liste ergänzen. Wagen 7–10 werden positionsgetreu gefüllt; Tara und Ladungsgewicht werden aus der Datei gelesen.";
    btn.textContent = "Datei auswählen";
    el("hellmannPart2DropTitle").textContent = "Zusatzliste hier hineinziehen";
    el("hellmannPart2DropText").textContent = ".xls oder .xlsx · auch direkt aus einer Mail, wenn der Browser den Anhang als Datei bereitstellt";
    meta.innerHTML = "<span>Wagen: <b>7–10</b></span><span>Datei: <b>.xls / .xlsx</b></span><span>Gross: <b>Tara + Ladungsgewicht</b></span>";
  }
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
