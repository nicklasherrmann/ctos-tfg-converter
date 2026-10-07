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

const SHEET_NAME = "SETG-TCM-COMBITRAC-20210827-610";

const el = (id) => document.getElementById(id);
const dropzone = el("dropzone");
const fileInput = el("fileInput");
const working = el("working");
const result = el("result");
const errorBox = el("errorBox");
const downloadBtn = el("downloadBtn");

let parsedState = null;

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
  if (!file || (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf"))) {
    return showError("Bitte eine PDF-Datei auswählen.");
  }

  showOnly(working);

  try {
    const bytes = new Uint8Array(await file.arrayBuffer());
    const parsed = await parseElischPdf(bytes);

    if (!parsed.trainNo) throw new Error("Keine Zugnummer/TrainID erkannt.");
    if (!parsed.date) throw new Error("Kein Listendatum erkannt.");
    if (!parsed.entries.length) throw new Error("Keine Ladeeinheiten erkannt.");

    parsedState = { ...parsed, sourceName: file.name };
    renderResult(parsedState);
  } catch (err) {
    console.error(err);
    showError(err?.message || "Unbekannter Fehler beim Lesen der PDF.");
  }
}

function showError(message) {
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

function renderResult(data) {
  el("fileName").textContent = data.sourceName;
  el("trainStat").textContent = data.trainNo ?? "–";
  el("dateStat").textContent = data.date ?? "–";
  el("wagonStat").textContent = data.wagonCount;
  el("unitStat").textContent = data.unitCount;
  el("previewCount").textContent = `${data.unitCount} Zeilen`;

  const tbody = el("previewBody");
  tbody.innerHTML = "";

  for (const r of data.entries) {
    const tr = document.createElement("tr");
    [r.wagonSeq, r.wagonNo, r.ctrNo, r.fe, formatNumber(r.gross), r.bookNo]
      .forEach(value => {
        const td = document.createElement("td");
        td.textContent = value;
        tr.appendChild(td);
      });
    tbody.appendChild(tr);
  }

  const warnBox = el("warnings");
  if (data.warnings.length) {
    warnBox.innerHTML = data.warnings.map(w => `⚠ ${escapeHtml(w)}`).join("<br>");
    warnBox.classList.remove("hidden");
    el("statusIcon").className = "status-icon warn";
    el("statusIcon").textContent = "!";
    el("resultTitle").textContent = "PDF verarbeitet – bitte Hinweise prüfen";
  } else {
    warnBox.classList.add("hidden");
    el("statusIcon").className = "status-icon ok";
    el("statusIcon").textContent = "✓";
    el("resultTitle").textContent = "PDF erfolgreich verarbeitet";
  }

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

function downloadExcel() {
  if (!parsedState) return;

  try {
    downloadBtn.disabled = true;

    const rows = makeExcelRows(parsedState);
    const ws = XLSX.utils.aoa_to_sheet([HEADERS, ...rows], { cellDates:false });

    // ETA: Excel-Seriennummer mit festem Anzeigeformat.
    for (let r = 2; r <= rows.length + 1; r++) {
      const c = ws[`E${r}`];
      if (c) {
        c.t = "n";
        c.z = "dd.mm.yyyy hh:mm";
      }
      // Container-Nummer ausdrücklich als Text behandeln.
      const ctr = ws[`J${r}`];
      if (ctr) ctr.t = "s";
    }

    // Kompakte, mit der Referenzdatei kompatible Spaltenbreiten.
    ws["!cols"] = HEADERS.map((h, i) => {
      if (i === 7) return { wch: 15 };   // WAG_NO
      if (i === 9) return { wch: 16 };   // CTR_NO
      if (i === 17) return { wch: 14 };  // BOOK_NO
      if (i === 4) return { wch: 19 };   // ETA
      return { wch: Math.min(Math.max(h.length + 2, 10), 24) };
    });

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, SHEET_NAME);

    const filename = `CTOS-TCM-IN-TFG - ${parsedState.date}.xlsx`;
    XLSX.writeFile(wb, filename, { bookType:"xlsx", compression:true });
  } catch (err) {
    console.error(err);
    alert("Die Excel-Datei konnte nicht erstellt werden: " + (err?.message || err));
  } finally {
    downloadBtn.disabled = false;
  }
}
