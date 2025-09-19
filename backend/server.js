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

// In-memory map for faster access
let timesheetMap = {}; // { "email-period": [rowData] }
let sheetData = []; // raw array of rows

// Load or create workbook
function loadWorkbook() {
  if (!fs.existsSync(FILE_PATH)) {
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet([
      ["Email", "W1 Hours", "W2 Hours", "State", "Client", "Period", "Notes"],
    ]);
    XLSX.utils.book_append_sheet(wb, ws, SHEET_NAME);
    XLSX.writeFile(wb, FILE_PATH);
  }

  const wb = XLSX.readFile(FILE_PATH);
  const ws = wb.Sheets[SHEET_NAME];
  sheetData = XLSX.utils.sheet_to_json(ws, { header: 1 });

  // Build fast lookup map
  timesheetMap = {};
  sheetData.slice(1).forEach((row) => {
    const key = `${row[0]}-${row[5]}`; // email + period
    timesheetMap[key] = row;
  });

  return wb;
}

// Save back to Excel
function saveWorkbook() {
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet(sheetData);
  XLSX.utils.book_append_sheet(wb, ws, SHEET_NAME);
  XLSX.writeFile(wb, FILE_PATH);
}

// Format period MM/DD–MM/DD
function formatPeriod(start, end) {
  const formatDate = (d) => {
    const dt = new Date(d);
    return `${String(dt.getMonth() + 1).padStart(2, "0")}/${String(
      dt.getDate()
    ).padStart(2, "0")}`;
  };
  return `${formatDate(start)}–${formatDate(end)}`;
}

// Init load
loadWorkbook();


// 📌 Submit hours
app.post("/submit", (req, res) => {
  try {
    const { email, client, state, periodStart, periodEnd, week, hours, notes } =
      req.body;

    if (!email || !periodStart || !periodEnd) {
      return res
        .status(400)
        .json({ success: false, error: "Email and period required" });
    }

    const period = formatPeriod(periodStart, periodEnd);
    const key = `${email}-${period}`;

    // Look for existing row
    let row = timesheetMap[key];
    if (!row) {
      row = [email, "", "", state || "", client || "", period, notes || ""];
      sheetData.push(row);
      timesheetMap[key] = row;
    }

    // Update hours
    if (week === "W1") row[1] = hours;
    if (week === "W2") row[2] = hours;

    // Always update state/client/notes if provided
    row[3] = state || row[3];
    row[4] = client || row[4];
    row[6] = notes || row[6];

    // Save back to Excel
    saveWorkbook();

    res.json({ success: true, period });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});


// 📌 Get timesheet by email + period
app.get("/timesheet", (req, res) => {
  try {
    const { email, period } = req.query;
    if (!email || !period) return res.status(400).json({ error: "email and period required" });

    const key = `${email}-${period}`;
    const row = timesheetMap[key]; // ✅ instant lookup, no reload

    if (!row) return res.json(null);

    res.json({
      email: row[0],
      w1: row[1] || "",
      w2: row[2] || "",
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



// 📌 Download Excel file
app.get("/download", (req, res) => {
  res.download(FILE_PATH, "timesheet.xlsx", (err) => {
    if (err) {
      console.error("Download error:", err);
      res.status(500).send("Error downloading the file.");
    }
  });
});


// Start server
app.listen(3001, () =>
  console.log("✅ Backend running on http://localhost:3001")
);
