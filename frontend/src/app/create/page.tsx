"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import Toastify CSS

const Page = () => {
  const router = useRouter();
  const [vehicleNo, setVehicleNo] = useState("");
  const [vehicleType, setVehicleType] = useState("Car");
  const [phone, setPhone] = useState("");
  const [parkingDuration, setParkingDuration] = useState("");
  const [loading, setLoading] = useState(false); // State to track loading

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); // Set loading to true when the form is submitted

    const payload = {
      vehicleNo,
      vehicleType,
      phone,
      parkingDuration,
    };

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/parking`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 201) {
        toast.success("Entry created successfully!", {
          position: "top-right",
          autoClose: 3000, // Close after 3 seconds
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        console.log("Response:", response.data);
      } else {
        toast.error("Failed to create entry.", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    } catch (error) {
      console.error("Error creating entry:", error);
      toast.error("An error occurred while creating the entry.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } finally {
      setLoading(false); // Set loading to false after the API call is complete
    }
  };

  return (
    <main className="min-h-screen bg-neutral-900 text-white px-6 py-12 flex flex-col items-center">
      <button
        onClick={() => router.push("/")} // Navigate back to the main page
        className="absolute top-6 left-6 bg-neutral-700 hover:bg-neutral-600 px-4 py-2 rounded-lg font-semibold text-white shadow-lg transition duration-300"
      >
        Back
      </button>
      <ToastContainer /> {/* Add ToastContainer to render notifications */}
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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Car Number */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-neutral-300 mb-1">
              Car Number
            </label>
            <input
              type="text"
              value={vehicleNo}
              onChange={(e) => setVehicleNo(e.target.value)}
              placeholder="DL3CAF1234"
              className="bg-neutral-700 text-white px-4 py-3 rounded-lg outline-none focus:ring-2 focus:ring-grey-400"
              required
            />
          </div>

          {/* Vehicle Type */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-neutral-300 mb-1">
              Vehicle Type
            </label>
            <select
              value={vehicleType}
              onChange={(e) => setVehicleType(e.target.value)}
              className="bg-neutral-700 text-white px-4 py-3 rounded-lg outline-none focus:ring-2 focus:ring-grey-400"
              required
            >
              <option value="Car">Car</option>
              <option value="Bike">Bike</option>
              <option value="Truck">Truck</option>
            </select>
          </div>

          {/* Phone Number */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-neutral-300 mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
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
              value={parkingDuration}
              onChange={(e) => setParkingDuration(e.target.value)}
              placeholder="e.g., 2"
              className="bg-neutral-700 text-white px-4 py-3 rounded-lg outline-none focus:ring-2 focus:ring-grey-400"
              required
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading} // Disable the button while loading
            className={`px-6 py-3 rounded-lg font-semibold text-white shadow-lg transition duration-300 w-1/5 ${
              loading
                ? "bg-neutral-600 cursor-not-allowed"
                : "bg-neutral-700 hover:bg-neutral-600"
            }`}
          >
            {loading ? (
              <svg
                className="animate-spin h-5 w-full text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            ) : (
              "Submit Entry"
            )}{" "}
            {/* Show loading text */}
          </button>
        </div>
      </form>
    </main>
  );
};

export default Page;
