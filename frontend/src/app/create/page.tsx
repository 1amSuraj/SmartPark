"use client";

import React, { useState } from "react";

const Page = () => {
  const [carNumber, setCarNumber] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [duration, setDuration] = useState("");

  return (
    <>
      <h1 className="bg-purple-300 text-black text-7xl text-center p-10">
        Suraj's Parking
      </h1>
      <div className="bg-purple-300 min-h-screen flex items-center justify-center text-black">
        <form className="space-y-6 p-8 bg-white rounded-xl shadow-lg">
          {/* Car Number */}
          <div className="flex items-center gap-6">
            <label className="text-2xl w-48">Car Number</label>
            <input
              type="text"
              value={carNumber}
              onChange={(e) => setCarNumber(e.target.value)}
              placeholder="Enter Car Number"
              className="text-xl border border-black text-center rounded-xl px-4 py-2 w-full"
            />
          </div>

          {/* Phone Number */}
          <div className="flex items-center gap-6">
            <label className="text-2xl w-48">Phone Number</label>
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="Enter Phone Number"
              className="text-xl border border-black text-center rounded-xl px-4 py-2 w-full"
            />
          </div>

          {/* Duration */}
          <div className="flex items-center gap-6">
            <label className="text-2xl w-48">Duration</label>
            <input
              type="text"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="Enter Duration"
              className="text-xl border border-black text-center rounded-xl px-4 py-2 w-full"
            />
          </div>
        </form>
      </div>
    </>
  );
};

export default Page;
