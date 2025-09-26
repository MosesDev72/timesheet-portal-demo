# timesheet-portal-demo

Demo site for Honeydew × AscentUP Timesheet Portal MVP (Sept 8)

---

## 🚀 Setup

### Backend
```bash
cd backend
npm install
node server.js
```

Backend will run on:
```
http://localhost:3001
```
---

## 🔗 API Endpoints

### 1) Submit Timesheet
**POST** `/submit`  
Example request:
```json
{
  "periodStart": "2025-09-08",
  "periodEnd": "2025-09-21",
  "hours": [
    { "date": "2025-09-08", "hours": 7.5 },
    { "date": "2025-09-09", "hours": 8.0 }
  ]
}
```

Example response:
```json
{
  "status": "success",
  "message": "Timesheet submitted successfully"
}
```

---

### 2) Retrieve Timesheets
**GET** `/timesheet`  
Example response:
```json
[
  {
    "periodStart": "2025-09-08",
    "periodEnd": "2025-09-21",
    "totalHours": 37.5
  }
]
```

---

### 3) Download Excel
**GET** `/download`  
Downloads an `.xlsx` file with clean, standardized formatting:
- Periods: `MM/DD/YYYY – MM/DD/YYYY` (true en dash)  
- Hours without trailing zeros (`37.5`, `40`)  
---

## 📝 Development Notes
- Repo cleaned (`node_modules` removed, `.gitignore` added).
- Formatting standardized across frontend and backend.
- See PR #4 for details on exporter + formatting fixes.

---

## ✅ Demo Storyline
1. **Problem**: Excel mismatch caused confusion.
2. **Fix**: Standardized formatting (dates, hours).
3. **Outcome**: Clean, reliable exports.
