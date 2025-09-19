import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function Review() {
  const [timesheet, setTimesheet] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  // values passed from TimesheetForm
  const { startDate, endDate } = location.state || {};
  const email = localStorage.getItem("userEmail");

  // Build period format the same way backend does (MM/DD–MM/DD)
  const formatDate = (d) => {
    const dt = new Date(d);
    return `${String(dt.getMonth() + 1).padStart(2, "0")}/${String(
      dt.getDate()
    ).padStart(2, "0")}`;
  };
  const period = startDate && endDate ? `${formatDate(startDate)}–${formatDate(endDate)}` : "";

  useEffect(() => {
    if (!email || !period) return;

    fetch(`http://localhost:3001/timesheet?email=${email}&period=${period}`)
      .then((res) => res.json())
      .then((data) => {
        setTimesheet(data);
      })
      .catch((err) => console.error("Error fetching timesheet:", err));
  }, [email, period]);

  if (!timesheet) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading timesheet...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-start">
      <div className="h-1/3 flex items-center justify-center">
        <img src="/logo.png" alt="Company Logo" className="h-40 mx-auto" />
      </div>
      <div className="mt-16 max-w-md w-full bg-white p-6 rounded-lg shadow-2xl">
        <h1
          className="text-2xl font-bold mb-4 text-center"
          style={{ fontFamily: "Montserrat, sans-serif" }}
        >
          Review Timesheet
        </h1>
        <p><strong>Email:</strong> {timesheet.email}</p>
        <p><strong>Client:</strong> {timesheet.client}</p>
        <p><strong>State:</strong> {timesheet.state}</p>
        <p><strong>Period:</strong> {timesheet.period}</p>
        <p><strong>Week 1 Hours:</strong> {timesheet.w1}</p>
        <p><strong>Week 2 Hours:</strong> {timesheet.w2}</p>
        <p><strong>Notes:</strong> {timesheet.notes}</p>

        <button
          onClick={() => navigate("/confirmation")}
          className="w-full bg-green-600 text-white p-2 rounded mt-4 hover:bg-green-700"
        >
          Confirm
        </button>
      </div>
    </div>
  );
}

export default Review;
