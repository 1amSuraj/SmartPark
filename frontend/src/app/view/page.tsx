"use client";

import React, { useEffect, useState } from "react";

// Dummy data for illustration — replace with actual API or state
const mockData = [
  { carNumber: "DL3CAF1234", phoneNumber: "9876543210", duration: "2" },
  { carNumber: "MH12DE4567", phoneNumber: "9123456789", duration: "4" },
  { carNumber: "KA01AB7890", phoneNumber: "9988776655", duration: "1.5" },
];

const View = () => {
  const [parkingEntries, setParkingEntries] = useState([]);

  useEffect(() => {
    // Simulate fetching data
    setParkingEntries(mockData);
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-400 to-purple-600 text-white px-4 py-10 flex flex-col items-center">
      <h1 className="text-5xl font-bold mb-4"> Parking Entries</h1>
      <p className="text-xl mb-10 text-purple-100">
        Live status of cars inside the lot
      </p>

      <div className="grid w-full max-w-5xl gap-6">
        {parkingEntries.length === 0 ? (
          <div className="text-center text-xl text-purple-100">
            No vehicles inside the parking.
          </div>
        ) : (
          parkingEntries.map((entry, index) => (
            <div
              key={index}
              className="bg-white text-black rounded-2xl shadow-lg p-6 flex flex-col sm:flex-row justify-between items-center"
            >
              <div className="flex flex-col sm:flex-row sm:items-center gap-6 w-full">
                <div className="text-lg sm:text-xl font-semibold">
                  🚗 <span className="text-purple-700">{entry.carNumber}</span>
                </div>
                <div className="text-md sm:text-lg text-gray-700">
                  📞 {entry.phoneNumber}
                </div>
                <div className="text-md sm:text-lg text-gray-700">
                  ⏱ {entry.duration} hrs
                </div>
              </div>
              <div className="mt-4 sm:mt-0">
                <button className="bg-red-500 hover:bg-red-600 text-white font-medium px-5 py-2 rounded-lg transition">
                  Remove
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </main>
  );
};

export default View;
