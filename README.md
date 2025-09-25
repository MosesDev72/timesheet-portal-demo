# timesheet-portal-demo

Demo site for Honeydew × AscentUP Timesheet Portal MVP (Sept 8)

---
## 🚀 Setup

### Backend
```bash
cd backend
npm install
node server.js
---

## 🔗 API Endpoints

### 1. Submit Timesheet
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
