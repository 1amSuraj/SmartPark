"use client";

import React, { useState } from "react";

const Page = () => {
  const [carNumber, setCarNumber] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [duration, setDuration] = useState("");

  return (
    <>
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white text-7xl text-center py-10 shadow-lg">
        Suraj's Parking
      </header>

      {/* Form Section */}
      <main className="bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300 min-h-screen flex items-center justify-center text-black">
        <form className="space-y-8 p-10 bg-white rounded-2xl shadow-2xl w-[500px] border border-gray-300">
          {/* Form Title */}
          <h2 className="text-4xl font-extrabold text-center mb-6 text-gray-800">
            Create Parking Entry
          </h2>

          {/* Car Number */}
          <div className="flex flex-col gap-2">
            <label className="text-lg font-semibold text-gray-700">
              Car Number
            </label>
            <input
              type="text"
              value={carNumber}
              onChange={(e) => setCarNumber(e.target.value)}
              placeholder="Enter your car number (e.g., ABC1234)"
              className="text-lg bg-gray-100 border border-gray-400 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-500"
            />
          </div>

          {/* Phone Number */}
          <div className="flex flex-col gap-2">
            <label className="text-lg font-semibold text-gray-700">
              Phone Number
            </label>
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="Enter your phone number"
              className="text-lg bg-gray-100 border border-gray-400 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-500"
            />
          </div>

          {/* Duration */}
          <div className="flex flex-col gap-2">
            <label className="text-lg font-semibold text-gray-700">
              Duration (in hours)
            </label>
            <input
              type="number"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="Enter parking duration (e.g., 2)"
              className="text-lg bg-gray-100 border border-gray-400 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-500"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white text-lg font-semibold py-3 rounded-lg hover:bg-blue-700 hover:shadow-lg transition-all duration-300"
          >
            Submit
          </button>
        </form>
      </main>
    </>
  );
};

export default Page;
