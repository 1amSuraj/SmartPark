"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import LoadingSpinner from "../components/LoadingSpinner";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Page = () => {
  const router = useRouter();
  const [vehicleNo, setVehicleNo] = useState("");
  const [loading, setLoading] = useState(false);
  const [scanning, setScanning] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      vehicleNo,
    };
    try {
      const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/parking/exit`,
        { data: payload }
      );

      if (response.status === 203) {
        toast.warning("Payment still pending", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      } else {
        if (response.status === 200) {
          toast.success("Vehicle exited successfully!", {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
          console.log("Response:", response.data);
          setVehicleNo("");
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
      }
    } catch (error) {
      console.error("No such entry detected:", error);
      toast.error("No such entry detected", {
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
    <main className="min-h-screen bg-neutral-900 text-white px-6 py-12 pt-20 sm:pt-12 flex flex-col items-center">
      <button
        onClick={() => router.push("/")}
        className="absolute top-6 left-6 bg-neutral-700 hover:bg-neutral-600 px-4 py-2 rounded-lg font-semibold text-white shadow-lg transition duration-300 cursor-pointer"
      >
        Back
      </button>
      <ToastContainer />
      <h1 className="text-4xl md:text-5xl font-bold mb-3 text-center">
        SmartPark Exit Panel
      </h1>
      <p className="text-md text-neutral-400 mb-10 text-center">
        Exiting vehicle
      </p>
      {/* Scan Button */}
      <button
        type="button"
        onClick={handlePlateScan}
        disabled={scanning}
        className={`mb-6 px-6 py-3 rounded-lg font-semibold text-white shadow-lg transition duration-300 md:w-1/5 cursor-pointer ${
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
        <div className="">
          <div className="flex flex-col">
            <label className="text-xl font-medium text-neutral-300 mb-2 text-center">
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
        </div>

        <div className="flex justify-center">
          <button
            type="submit"
            disabled={loading} // Disable the button while loading
            className={`px-6 py-3 cursor-pointer rounded-lg font-semibold text-white shadow-lg transition duration-300 md:w-1/5 ${
              loading
                ? "bg-neutral-600 cursor-not-allowed"
                : "bg-neutral-700 hover:bg-neutral-600"
            }`}
          >
            {loading ? <LoadingSpinner /> : "Submit "}
          </button>
        </div>
      </form>
      <div className="flex justify-center gap-4 mt-8">
        {/* Existing info box */}
        <div className="bg-neutral-800 border border-neutral-700 rounded-xl px-6 py-4 shadow-lg max-w-md w-full text-center">
          <span className="text-neutral-200 text-sm font-medium">
            This page is not required in the actual system — it's included here
            for demonstration purposes only. In a commercial setup, a camera
            will always be active at the exit gate and will operate using motion
            detection.
          </span>
        </div>
        <div className="bg-neutral-800 border border-neutral-700 rounded-xl px-6 py-4 shadow-lg max-w-md w-full text-center">
          <span className="text-neutral-200 text-sm font-medium">
            If you're not sure how to make the Scan Plate Automatically feature
            work, feel free to leave a comment on my LinkedIn post or send me a
            direct message.
          </span>
        </div>
      </div>
    </main>
  );
};

export default Page;
