import React from "react";

function Confirmation() {
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
          Confirmation
        </h1>
        <p
          className="text-center"
          style={{ fontFamily: "Montserrat, sans-serif" }}
        >
          Your submission has been successfully received.
        </p>

        <a
          href="http://localhost:3001/download"
          className="block text-center bg-blue-600 text-white p-2 rounded mt-4 hover:bg-blue-700"
          style={{ fontFamily: "Montserrat, sans-serif" }}
        >
          Download Excel
        </a>

        <a
          href="#"
          className="block text-center text-blue-600 hover:underline mt-4"
          style={{ fontFamily: "Montserrat, sans-serif" }}
        >
          Need Help?
        </a>
      </div>
    </div>
  );
}

export default Confirmation;
