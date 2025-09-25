// backend/server.js
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const XLSX = require("xlsx");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Excel config
const FILE_PATH = path.join(__dirname, "Payroll Copy - AscentUP.xlsx");
const SHEET_NAME = "Sheet1";

// In-memory map: key = `${email}::${startISO}` -> row array
let timesheetMap = {};
let sheetData = [];

// ---------- Date helpers ----------
const toDate = (v) => new Date(v);
const pad2 = (n) => String(n).padStart(2, "0");
const fmtMDY = (d) => `${pad2(d.getMonth() + 1)}/${pad2(d.getDate())}/${d.getFullYear()}`;

// Return Monday of the week for the given date (00:00 local)
function startOfWeekMonday(d) {
  const dt = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const day = dt.getDay(); // 0 Sun, 1 Mon, ... 6 Sat
  const diff = day === 0 ? -6 : 1 - day; // move back to Monday
  dt.setDate(dt.getDate() + diff);
  dt.setHours(0, 0, 0, 0);
  return dt;
}

// Build canonical 2-week period from any input date
function canonPeriodFrom(dateLike) {
  const any = toDate(dateLike);
  const start = startOfWeekMonday(any);       // Monday
  const end = new Date(start); end.setDate(end.getDate() + 13); // Sunday of week 2
  const startISO = start.toISOString().slice(0, 10);            // YYYY-MM-DD
  const display = `${fmtMDY(start)}–${fmtMDY(end)}`;            // nice string with en dash
  return { start, end, startISO, display };
}

// ---------- Workbook load/save ----------
function ensureWorkbook() {
  if (!fs.existsSync(FILE_PATH)) {
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet([
      ["Email", "W1 Hours", "W2 Hours", "State", "Client", "Period", "Notes"],
    ]);
    XLSX.utils.book_append_sheet(wb, ws, SHEET_NAME);
    XLSX.writeFile(wb, FILE_PATH);
  }
}

function loadWorkbook() {
  ensureWorkbook();
  const wb = XLSX.readFile(FILE_PATH);
  const ws = wb.Sheets[SHEET_NAME];
  sheetData = XLSX.utils.sheet_to_json(ws, { header: 1 });

  // rebuild map (derive startISO from the Period column)
  timesheetMap = {};
  sheetData.slice(1).forEach((row) => {
    if (!row?.length) return;
    const email = row[0];
    const periodStr = row[5]; // "MM/DD/YYYY–MM/DD/YYYY"
    if (!email || !periodStr) return;

    // parse start from display string robustly
    const [m, d, y] = periodStr.split("–")[0].split("/");
    const start = new Date(Number(y), Number(m) - 1, Number(d));
    const startISO = start.toISOString().slice(0, 10);

    const key = `${email}::${startISO}`;
    timesheetMap[key] = row;
  });
}

function saveWorkbook() {
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet(sheetData);
  XLSX.utils.book_append_sheet(wb, ws, SHEET_NAME);
  XLSX.writeFile(wb, FILE_PATH);
}

// Init
loadWorkbook();

// ---------- API ----------
app.post("/submit", (req, res) => {
  try {
    const { email, client, state, periodStart, week, hours, notes } = req.body;
    if (!email || !periodStart) {
      return res.status(400).json({ success: false, error: "Email and periodStart required" });
    }

    // Canonical 2-week period based on submitted periodStart
    const canon = canonPeriodFrom(periodStart);
    const key = `${email}::${canon.startISO}`;

    // Validation
    const weekNorm = String(week || "").toUpperCase();
    const numHours = Number(hours);
    if (!["W1", "W2"].includes(weekNorm)) {
      return res.status(400).json({ success: false, error: "week must be W1 or W2" });
    }
    if (!Number.isFinite(numHours) || numHours < 0 || numHours > 100) {
      return res.status(400).json({ success: false, error: "hours must be between 0 and 100" });
    }

    // Upsert row
    let row = timesheetMap[key];
    if (!row) {
      row = [email, "", "", state || "", client || "", canon.display, notes || ""];
      sheetData.push(row);
      timesheetMap[key] = row;
    }
    if (weekNorm === "W1") row[1] = numHours;
    if (weekNorm === "W2") row[2] = numHours;

    // Keep other fields fresh
    row[3] = state ?? row[3];
    row[4] = client ?? row[4];
    row[6] = notes ?? row[6];

    saveWorkbook();
    res.json({ success: true, period: canon.display });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get("/timesheet", (req, res) => {
  try {
    const { email, period } = req.query;
    if (!email || !period) return res.status(400).json({ error: "email and period required" });

    // Accept either the pretty display ("MM/DD/YYYY–MM/DD/YYYY") or just yyyy-mm-dd for start
    let startISO;
    if (period.includes("–")) {
      const [m, d, y] = period.split("–")[0].split("/");
      const start = new Date(Number(y), Number(m) - 1, Number(d));
      startISO = start.toISOString().slice(0, 10);
    } else {
      // assume yyyy-mm-dd
      startISO = period;
    }

    const row = timesheetMap[`${email}::${startISO}`];
    if (!row) return res.json(null);

    res.json({
      email: row[0],
      w1: row[1] ?? "",
      w2: row[2] ?? "",
      state: row[3],
      client: row[4],
      period: row[5],
      notes: row[6],
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.get("/download", (_req, res) => {
  res.download(FILE_PATH, "timesheet.xlsx", (err) => {
    if (err) {
      console.error("Download error:", err);
      res.status(500).send("Error downloading the file.");
    }
  });
});

app.listen(3001, () => console.log("✅ Backend running on http://localhost:3001"));


