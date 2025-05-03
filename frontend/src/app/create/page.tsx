"use client";

import React, { useState } from "react";

const Page = () => {
  const [carNumber, setCarNumber] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [duration, setDuration] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ carNumber, phoneNumber, duration });
    // Add API integration or logic here
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-400 to-purple-600 text-white px-4 py-10 flex flex-col items-center">
      <h1 className="text-5xl font-bold mb-4">Suraj's Parking</h1>
      <p className="text-xl mb-10 text-purple-100">Create Vehicle Entry</p>

      <div className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full p-10 space-y-10 text-black">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex flex-col items-start">
            <span className="text-xl font-semibold mb-2">🚗 Car Number</span>
            <div className="bg-purple-100 px-4 py-3 rounded-xl w-full">
              <input
                type="text"
                value={carNumber}
                onChange={(e) => setCarNumber(e.target.value)}
                placeholder="Enter number"
                className="bg-transparent w-full outline-none text-lg"
              />
            </div>
          </div>

          <div className="flex flex-col items-start">
            <span className="text-xl font-semibold mb-2">📱 Phone</span>
            <div className="bg-purple-100 px-4 py-3 rounded-xl w-full">
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="Enter phone"
                className="bg-transparent w-full outline-none text-lg"
              />
            </div>
          </div>

          <div className="flex flex-col items-start">
            <span className="text-xl font-semibold mb-2">⏱ Duration (hrs)</span>
            <div className="bg-purple-100 px-4 py-3 rounded-xl w-full">
              <input
                type="number"
                min={0}
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="e.g., 2"
                className="bg-transparent w-full outline-none text-lg"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-center pt-4">
          <button
            onClick={handleSubmit}
            className="bg-purple-600 hover:bg-purple-700 text-white text-xl font-semibold px-8 py-3 rounded-xl transition duration-300"
          >
            Submit Entry
          </button>
        </div>
      </div>
    </main>
  );
};

export default Page;
