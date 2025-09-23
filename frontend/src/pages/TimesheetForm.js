import { useTimesheetValidation } from "../hooks/useTimesheetValidation";
import { parseLocalDate, formatLocalDate } from "../utils/dateUtils";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function TimesheetForm() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [week1Hours, setWeek1Hours] = useState("");
  const [week2Hours, setWeek2Hours] = useState("");
  const [client, setClient] = useState("");
  const [state, setState] = useState("");
  const [notes, setNotes] = useState("");

  const { errors, validateForm, clearError } = useTimesheetValidation();
  const navigate = useNavigate();

  // Load last used state from localStorage (only on first load)
  useEffect(() => {
    const savedState = localStorage.getItem("lastTimesheetState");
    if (savedState && !state) {
      const parsedState = JSON.parse(savedState);
      setState(parsedState.state || "");
    }
  }, []);

  // Save state to localStorage when state changes
  useEffect(() => {
    if (state && state.trim() !== "") {
      localStorage.setItem("lastTimesheetState", JSON.stringify({ state }));
    }
  }, [state]);

  const handleInputChange = (setter, fieldName, value) => {
    setter(value);
    // Clear error when user starts typing
    if (errors[fieldName]) {
      clearError(fieldName);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Parse dates as local to avoid timezone shift
    const localStartDate = parseLocalDate(startDate);
    const localEndDate = parseLocalDate(endDate);

    // Prepare form data for validation
    const formData = {
      startDate,
      endDate,
      week1Hours,
      week2Hours,
      client,
      state,
      notes,
    };

    console.log("🔍 Form data being validated:", formData);
    console.log("🔍 Parsed local dates:", {
      startDate: formatLocalDate(localStartDate),
      endDate: formatLocalDate(localEndDate),
    });
    console.log("🔍 Current errors before validation:", errors);

    // Validate form
    const isValid = validateForm(formData);
    console.log("🔍 Validation result:", isValid);
    console.log("🔍 Errors after validation:", errors);

    if (!isValid) {
      console.log("❌ Validation failed - stopping submission");
      return;
    }

    console.log("✅ Validation passed - proceeding with submission");

    const userEmail = localStorage.getItem("userEmail");
    if (!userEmail) {
      alert("No email found — please log in first");
      navigate("/");
      return;
    }

    try {
      // Week 1 submission
      if (week1Hours) {
        await fetch("http://localhost:3001/submit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: userEmail,
            client,
            state,
            periodStart: formatLocalDate(localStartDate), // Send MM/DD/YYYY
            periodEnd: formatLocalDate(localEndDate),
            week: "W1",
            hours: Number(week1Hours),
            notes,
          }),
        });
      }

      // Week 2 submission
      if (week2Hours) {
        await fetch("http://localhost:3001/submit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: userEmail,
            client,
            state,
            periodStart: formatLocalDate(localStartDate), // Send MM/DD/YYYY
            periodEnd: formatLocalDate(localEndDate),
            week: "W2",
            hours: Number(week2Hours),
            notes,
          }),
        });
      }

      // Navigate to review with formatted dates
      navigate("/review", {
        state: {
          startDate: formatLocalDate(localStartDate), // Pass MM/DD/YYYY
          endDate: formatLocalDate(localEndDate),
          client,
          state,
          week1Hours,
          week2Hours,
          notes,
        },
      });
    } catch (err) {
      console.error(err);
      alert("Error submitting timesheet");
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-start">
      <div className="h-1/3 flex items-center justify-center">
        <img src="/logo.png" alt="Company Logo" className="h-40 mx-auto" />
      </div>
      <form
        onSubmit={handleSubmit}
        className="mt-16 max-w-md w-full bg-white p-6 rounded-lg shadow-2xl"
      >
        <h1
          className="text-2xl font-bold mb-4 text-center"
          style={{ fontFamily: "Montserrat, sans-serif" }}
        >
          Timesheet Submission
        </h1>

        {/* Client Input */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Client"
            value={client}
            onChange={(e) =>
              handleInputChange(setClient, "client", e.target.value)
            }
            className={`w-full p-2 border rounded ${
              errors.client ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.client && (
            <p className="text-red-500 text-sm mt-1">{errors.client}</p>
          )}
        </div>

        {/* State Input */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="State"
            value={state}
            onChange={(e) =>
              handleInputChange(setState, "state", e.target.value)
            }
            className={`w-full p-2 border rounded ${
              errors.state ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.state && (
            <p className="text-red-500 text-sm mt-1">{errors.state}</p>
          )}
        </div>

        {/* Start Date */}
        <div className="mb-4">
          <input
            type="date"
            value={startDate}
            onChange={(e) =>
              handleInputChange(setStartDate, "startDate", e.target.value)
            }
            className={`w-full p-2 border rounded ${
              errors.startDate ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.startDate && (
            <p className="text-red-500 text-sm mt-1">{errors.startDate}</p>
          )}
        </div>

        {/* End Date */}
        <div className="mb-4">
          <input
            type="date"
            value={endDate}
            onChange={(e) =>
              handleInputChange(setEndDate, "endDate", e.target.value)
            }
            className={`w-full p-2 border rounded ${
              errors.endDate ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.endDate && (
            <p className="text-red-500 text-sm mt-1">{errors.endDate}</p>
          )}
        </div>

        {/* Week 1 Hours */}
        <div className="mb-4">
          <input
            type="number"
            placeholder="Week 1 Hours"
            value={week1Hours}
            onChange={(e) =>
              handleInputChange(setWeek1Hours, "week1Hours", e.target.value)
            }
            step="0.01"
            min="0"
            max="100"
            className={`w-full p-2 border rounded ${
              errors.week1Hours ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.week1Hours && (
            <p className="text-red-500 text-sm mt-1">{errors.week1Hours}</p>
          )}
        </div>

        {/* Week 2 Hours */}
        <div className="mb-4">
          <input
            type="number"
            placeholder="Week 2 Hours"
            value={week2Hours}
            onChange={(e) =>
              handleInputChange(setWeek2Hours, "week2Hours", e.target.value)
            }
            step="0.01"
            min="0"
            max="100"
            className={`w-full p-2 border rounded ${
              errors.week2Hours ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.week2Hours && (
            <p className="text-red-500 text-sm mt-1">{errors.week2Hours}</p>
          )}
        </div>

        {/* Total Hours Error (Period Cap) */}
        {errors.total && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded">
            <p className="text-red-600 text-sm">{errors.total}</p>
          </div>
        )}

        {/* Notes */}
        <div className="mb-4">
          <textarea
            placeholder="Notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            rows="3"
          />
        </div>

        <button
          type="submit"
          disabled={Object.keys(errors).length > 0}
          className={`w-full p-2 rounded text-white font-medium transition-colors ${
            Object.keys(errors).length > 0
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {Object.keys(errors).length > 0
            ? "Fix Errors Before Submit"
            : "Review Before Submit"}
        </button>

        {/* TEMPORARY DEBUG INFO - Remove after fixing */}
        <div className="mt-2 text-xs text-gray-500">
          Debug: {Object.keys(errors).length} errors -{" "}
          {JSON.stringify(Object.keys(errors))}
        </div>
      </form>
    </div>
  );
}

export default TimesheetForm;
