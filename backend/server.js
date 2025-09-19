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

// Excel file path
const FILE_PATH = path.join(__dirname, "timesheet.xlsx");
const SHEET_NAME = "Sheet1";

// Load or create workbook
function loadWorkbook() {
  if (!fs.existsSync(FILE_PATH)) {
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet([
      ["Email", "Client", "State", "Period", "W1 Hours", "W2 Hours", "Total Hours"],
    ]);
    XLSX.utils.book_append_sheet(wb, ws, SHEET_NAME);
    XLSX.writeFile(wb, FILE_PATH);
  }
  return XLSX.readFile(FILE_PATH);
}

// Submit hours
app.post("/submit", (req, res) => {
  try {
    const { email, client, state, period, week, hours } = req.body;
    const wb = loadWorkbook();
    const ws = wb.Sheets[SHEET_NAME];
    const data = XLSX.utils.sheet_to_json(ws, { header: 1 });

    let rowIndex = data.findIndex((row, idx) => idx > 0 && row[0] === email && row[3] === period);

    if (rowIndex === -1) {
      const newRow = [email, client, state, period, "", "", ""];
      if (week === "W1") newRow[4] = hours;
      if (week === "W2") newRow[5] = hours;
      newRow[6] = Number(newRow[4] || 0) + Number(newRow[5] || 0);
      data.push(newRow);
    } else {
      const row = data[rowIndex];
      if (week === "W1") row[4] = hours;
      if (week === "W2") row[5] = hours;
      row[6] = Number(row[4] || 0) + Number(row[5] || 0);
      data[rowIndex] = row;
    }

    const newWs = XLSX.utils.aoa_to_sheet(data);
    wb.Sheets[SHEET_NAME] = newWs;
    XLSX.writeFile(wb, FILE_PATH);

    res.json({ success: true },);
  } catch (err) {
      console.log('inside error')
    console.error(err);
    res.status(500).json({ success: false, error: err.message } ,console.log('inside error'));
  }
});

// Get existing data
app.get("/timesheet", (req, res) => {
  try {
    const { email, period } = req.query;
    if (!email || !period) return res.status(400).json({ error: "email and period required" });

    const wb = loadWorkbook();
    const ws = wb.Sheets[SHEET_NAME];
    const data = XLSX.utils.sheet_to_json(ws, { header: 1 });

    const row = data.find((r, idx) => idx > 0 && r[0] === email && r[3] === period);
    if (!row) return res.json(null);

    res.json({
      email: row[0],
      client: row[1],
      state: row[2],
      period: row[3],
      w1: row[4] || "",
      w2: row[5] || "",
      total: row[6] || 0,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Download the Excel file
app.get("/download", (req, res) => {
  res.download(FILE_PATH, "timesheet.xlsx", (err) => {
    if (err) {
      console.error("Download error:", err);
      res.status(500).send("Error downloading the file.");
    }
  });
});


app.listen(3001, () => console.log("Backend running on http://localhost:3001"));
