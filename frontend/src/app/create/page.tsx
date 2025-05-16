"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import LoadingSpinner from "../components/LoadingSpinner";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import Toastify CSS

const Page = () => {
  const router = useRouter();
  const [vehicleNo, setVehicleNo] = useState("");
  const [vehicleType, setVehicleType] = useState("Car");
  const [phone, setPhone] = useState("");
  const [parkingDuration, setParkingDuration] = useState("");
  const [loading, setLoading] = useState(false);
  const [scanning, setScanning] = useState(false);

  const formatPhoneNumber = (phone: string): string => {
    if (phone.startsWith("91")) {
      return phone;
    }
    return `91${phone}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Format the phone number before submitting
    const formattedPhone = formatPhoneNumber(phone);
    const payload = {
      vehicleNo,
      vehicleType,
      phone: formattedPhone, // Use the formatted phone number
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

        // Reset the form fields
        setVehicleNo("");
        setVehicleType("Car");
        setPhone("");
        setParkingDuration("");
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

  const handlePlateScan = async () => {
    setScanning(true);
    try {
      const res = await axios.get("http://127.0.0.1:5001/plate");
      if (res.data.plate) {
        setVehicleNo(res.data.plate.toUpperCase());
        toast.success(`Plate Detected: ${res.data.plate.toUpperCase()}`);
      } else {
        toast.warning("No plate detected.");
      }
    } catch (err) {
      console.error("Error detecting plate:", err);
      toast.error("Number Plate not detected");
    } finally {
      setScanning(false);
    }
  };

  return (
    <main className="min-h-screen bg-neutral-900 text-white px-6 py-12 flex flex-col items-center">
      <button
        onClick={() => router.push("/")} // Navigate back to the main page
        className="absolute top-6 left-6 bg-neutral-700 hover:bg-neutral-600 px-4 py-2 rounded-lg font-semibold text-white shadow-lg transition duration-300 cursor-pointer"
      >
        Back
      </button>
      <ToastContainer /> {/* Add ToastContainer to render notifications */}
      <h1 className="text-4xl md:text-5xl font-bold mb-3 text-center">
        SmartPark Control Panel
      </h1>
      <p className="text-md text-neutral-400 mb-10 text-center">
        Record a new vehicle entry
      </p>
      {/* Scan Button */}
      <button
        type="button"
        onClick={handlePlateScan}
        disabled={scanning}
        className={`mb-6 px-6 py-3 rounded-lg font-semibold text-white shadow-lg transition duration-300  md:w-1/5 cursor-pointer ${
          scanning
            ? "bg-neutral-700 cursor-not-allowed"
            : "bg-neutral-700 hover:bg-neutral-600"
        }`}
      >
        {scanning ? <LoadingSpinner /> : "Scan Plate Automatically"}
      </button>
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
          <div className="flex flex-col ">
            <label className="text-sm font-medium text-neutral-300 mb-1">
              Vehicle Type
            </label>
            <select
              value={vehicleType}
              onChange={(e) => setVehicleType(e.target.value)}
              className="flex-1 bg-neutral-700 text-white px-4 py-3 rounded-lg outline-none focus:ring-2 focus:ring-grey-400 cursor-pointer"
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
            className={`px-6 py-3 cursor-pointer rounded-lg font-semibold text-white shadow-lg transition duration-300 md:w-1/5 ${
              loading
                ? "bg-neutral-600 cursor-not-allowed"
                : "bg-neutral-700 hover:bg-neutral-600"
            }`}
          >
            {loading ? <LoadingSpinner /> : "Submit Entry"}
          </button>
        </div>
      </form>
      <div>
        <img src="ApiScanner.png" alt="Api" className="h-40 mt-10 mb-4" />
      </div>
      <p className="text-md text-neutral-400 text-center">
        Scan this to activate Whatsapp Services
      </p>
    </main>
  );
};

export default Page;
