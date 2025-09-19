import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function Review() {
  const [timesheet, setTimesheet] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  // values passed from TimesheetForm
  const { startDate, endDate, client, state } = location.state || {};
  const period = `${startDate} - ${endDate}`;
  const email = localStorage.getItem("userEmail");

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
        <p>Email: {timesheet.email}</p>
        <p>Client: {timesheet.client}</p>
        <p>State: {timesheet.state}</p>
        <p>Period: {timesheet.period}</p>
        <p>Week 1 Hours: {timesheet.w1}</p>
        <p>Week 2 Hours: {timesheet.w2}</p>
        <p>Total Hours: {timesheet.total}</p>

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
