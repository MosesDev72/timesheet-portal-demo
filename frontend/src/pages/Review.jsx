import { useLocation, useNavigate } from "react-router-dom";

function Review() {
  const navigate = useNavigate();
  const location = useLocation();
  // Retrieve data passed from TimesheetForm
  const formData = location.state || {
    startDate: "",
    endDate: "",
    week1Hours: "",
    week2Hours: "",
    travelHours: "",
    client: "",
    state: "",
  };

  const handleSubmit = () => {
    navigate('/confirmation');
  };

  const handleGoBack = () => {
    navigate('/timesheet');
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h1 className="text-2xl font-bold mb-4 text-center" style={{ fontFamily: "Montserrat, sans-serif" }}>
        Review
      </h1>
      <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow">
        <div className="space-y-6">
          {/* Current Pay Period */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ fontFamily: "Merriweather, serif" }}>
              Current Pay Period (2 Weeks):
            </label>
            <div className="border border-gray-300 p-2">
              <p style={{ fontFamily: "Merriweather, serif" }} className="italic">
                From: <span className="italic">{formData.startDate || "Not selected"}</span> | To: <span className="italic">{formData.endDate || "Not selected"}</span>
              </p>
            </div>
          </div>
          {/* Week 1 Hours Worked */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ fontFamily: "Merriweather, serif" }}>
              Week 1 Hours Worked:
            </label>
            <div className="border border-gray-300 p-2">
              <p style={{ fontFamily: "Merriweather, serif" }} className="italic">
                {formData.week1Hours || "Not entered"}
              </p>
            </div>
          </div>
          {/* Week 2 Hours Worked */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ fontFamily: "Merriweather, serif" }}>
              Week 2 Hours Worked:
            </label>
            <div className="border border-gray-300 p-2">
              <p style={{ fontFamily: "Merriweather, serif" }} className="italic">
                {formData.week2Hours || "Not entered"}
              </p>
            </div>
          </div>
          {/* Travel */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ fontFamily: "Merriweather, serif" }}>
              Travel:
            </label>
            <div className="border border-gray-300 p-2">
              <p style={{ fontFamily: "Merriweather, serif" }} className="italic">
                {formData.travelHours || "Not entered"}
              </p>
            </div>
          </div>
          {/* Client */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ fontFamily: "Merriweather, serif" }}>
              Client:
            </label>
            <div className="border border-gray-300 p-2">
              <p style={{ fontFamily: "Merriweather, serif" }} className="italic">
                {formData.client || "Not selected"}
              </p>
            </div>
          </div>
          {/* State */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ fontFamily: "Merriweather, serif" }}>
              State:
            </label>
            <div className="border border-gray-300 p-2">
              <p style={{ fontFamily: "Merriweather, serif" }} className="italic">
                {formData.state || "Not selected"}
              </p>
            </div>
          </div>
          {/* Buttons */}
          <div className="flex justify-center space-x-2">
            <button
              onClick={handleSubmit}
              className="w-2/3 bg-blue-600 text-white p-1 rounded-2xl hover:bg-blue-700 transition-colors mx-auto block md:w-auto"
              style={{ fontFamily: "Merriweather, serif" }}
            >
              Submit
            </button>
            <button
              onClick={handleGoBack}
              className="w-2/3 border-2 border-red-600 text-red-600 font-bold p-1 rounded-2xl hover:bg-red-100 transition-colors mx-auto block md:w-auto"
              style={{ fontFamily: "Merriweather, serif" }}
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Review;
