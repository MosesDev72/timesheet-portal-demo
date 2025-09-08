import { useState } from "react";
import { useNavigate } from "react-router-dom";

function TimesheetForm() {
  const navigate = useNavigate();
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [week1Hours, setWeek1Hours] = useState("");
  const [week2Hours, setWeek2Hours] = useState("");
  const [travelHours, setTravelHours] = useState("");
  const [client, setClient] = useState("");
  const [state, setState] = useState("");

  // Handle start date selection
  const handleStartDateChange = (e) => {
    const selected = new Date(e.target.value);
    setStartDate(e.target.value);
    if (selected.getDay() === 0) {
      const end = new Date(selected);
      end.setDate(end.getDate() + 13); // 2 weeks, ending Saturday
      setEndDate(end.toISOString().split("T")[0]);
    } else {
      setEndDate("");
    }
  };

  const handleEndDateChange = (e) => {
    setEndDate(e.target.value);
  };

  const handleWeek1HoursChange = (e) => setWeek1Hours(e.target.value);
  const handleWeek2HoursChange = (e) => setWeek2Hours(e.target.value);
  const handleTravelHoursChange = (e) => setTravelHours(e.target.value);
  const handleClientChange = (e) => setClient(e.target.value);
  const handleStateChange = (e) => setState(e.target.value);

  const handleReviewBeforeSubmit = () => {
    navigate('/review', { state: { startDate, endDate, week1Hours, week2Hours, travelHours, client, state } });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h1 className="text-2xl font-bold mb-4 text-center" style={{ fontFamily: "Montserrat, sans-serif" }}>
        Timesheet Form
      </h1>
      <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow">
        <div className="space-y-6">
          {/* Pay Period */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ fontFamily: "Merriweather, serif" }}>
              Current Pay Period (2 Weeks)
            </label>
            <div className="flex space-x-2">
              <div className="flex-1">
                <label className="block text-xs mb-1" style={{ fontFamily: "Merriweather, serif" }}>
                  From:
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={handleStartDateChange}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                  style={{ fontFamily: "Merriweather, serif" }}
                />
              </div>
              <div className="flex-1">
                <label className="block text-xs mb-1" style={{ fontFamily: "Merriweather, serif" }}>
                  To:
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={handleEndDateChange}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                  style={{ fontFamily: "Merriweather, serif" }}
                />
              </div>
            </div>
            {startDate && !endDate && (
              <p className="text-xs text-red-500 mt-1">Please select a Sunday as the start date.</p>
            )}
          </div>
          {/* Week 1 Hours Worked */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ fontFamily: "Merriweather, serif" }}>
              Week 1 Hours Worked
            </label>
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              list="defaultHours"
              placeholder="Enter or select hours"
              value={week1Hours}
              onChange={handleWeek1HoursChange}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
              style={{ fontFamily: "Merriweather, serif" }}
            />
          </div>
          {/* Week 2 Hours Worked */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ fontFamily: "Merriweather, serif" }}>
              Week 2 Hours Worked
            </label>
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              list="defaultHours"
              placeholder="Enter or select hours"
              value={week2Hours}
              onChange={handleWeek2HoursChange}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
              style={{ fontFamily: "Merriweather, serif" }}
            />
          </div>
          {/* Travel */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ fontFamily: "Merriweather, serif" }}>
              Travel
            </label>
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              list="defaultHours"
              placeholder="Enter or select hours"
              value={travelHours}
              onChange={handleTravelHoursChange}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
              style={{ fontFamily: "Merriweather, serif" }}
            />
          </div>
          {/* Shared datalist for Week 1, Week 2, Travel */}
          <datalist id="defaultHours">
            <option value="20.00" />
            <option value="40.00" />
          </datalist>
          {/* Client */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ fontFamily: "Merriweather, serif" }}>
              Client
            </label>
            <select
              value={client}
              onChange={handleClientChange}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
              style={{ fontFamily: "Merriweather, serif" }}
            >
              <option value="" disabled>Select Client</option>
              <option value="client1">Client 1</option>
              <option value="client2">Client 2</option>
            </select>
          </div>
          <a href="#" className="block text-center text-blue-600 hover:underline" style={{ fontFamily: "Merriweather, serif" }}>
            Add Another Client
          </a>
          {/* State */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ fontFamily: "Merriweather, serif" }}>
              State
            </label>
            <select
              value={state}
              onChange={handleStateChange}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
              style={{ fontFamily: "Merriweather, serif" }}
            >
              <option value="" disabled>Select State</option>
              <option value="CA">California</option>
              <option value="TX">Texas</option>
            </select>
          </div>
          <a href="#" className="block text-center text-blue-600 hover:underline" style={{ fontFamily: "Merriweather, serif" }}>
            Need Help?
          </a>
          {/* Submit */}
          <button
            onClick={handleReviewBeforeSubmit}
            className="w-5/6 bg-blue-600 text-white p-1 rounded-2xl hover:bg-blue-700 transition-colors mx-auto block"
            style={{ fontFamily: "Merriweather, serif" }}
          >
            Review Before Submit
          </button>
        </div>
      </div>
    </div>
  );
}

export default TimesheetForm;
