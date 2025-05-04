"use client";

import React, { useState } from "react";

const Page = () => {
  const [carNumber, setCarNumber] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [duration, setDuration] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ carNumber, phoneNumber, duration });
    // Connect API call here
  };

  return (
    <main className="min-h-screen bg-neutral-900 text-white px-6 py-12 flex flex-col items-center">
      <h1 className="text-4xl md:text-5xl font-bold mb-3 text-center">
        Suraj's Parking Control Panel
      </h1>
      <p className="text-md text-neutral-400 mb-10 text-center">
        Record a new vehicle entry
      </p>

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-4xl bg-neutral-800 rounded-2xl shadow-xl p-10 space-y-8"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Car Number */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-neutral-300 mb-1">
              Car Number
            </label>
            <input
              type="text"
              value={carNumber}
              onChange={(e) => setCarNumber(e.target.value)}
              placeholder="DL3CAF1234"
              className="bg-neutral-700 text-white px-4 py-3 rounded-lg outline-none focus:ring-2 focus:ring-grey-400"
              required
            />
          </div>

          {/* Phone Number */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-neutral-300 mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="9876543210"
              className="bg-neutral-700 text-white px-4 py-3 rounded-lg outline-none focus:ring-2 focus:ring-grey-400"
              required
            />
          </div>

          {/* Duration */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-neutral-300 mb-1">
              Duration (hours)
            </label>
            <input
              type="number"
              min={0}
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="e.g., 2"
              className="bg-neutral-700 text-white px-4 py-3 rounded-lg outline-none focus:ring-2 focus:ring-grey-400"
              required
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-neutral-700 hover:bg-neutral-600 px-6 py-3 rounded-lg font-semibold text-white shadow-lg transition duration-300"
          >
            Submit Entry
          </button>
        </div>
      </form>
    </main>
  );
};

export default Page;
