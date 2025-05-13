"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

type ParkingEntry = {
  vehicleNo: string;
  vehicleType: string;
  phone: string;
  parkingDuration: number;
  extraDuration: number;
  entryTime: string;
  paymentStatus: string;
  totalAmount: number;
};

const fetchParkingData = async (): Promise<ParkingEntry[]> => {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/parking`
    );
    return response.data; // Return the fetched data
  } catch (error) {
    console.error("Error fetching parking data:", error);
    return [];
  }
};

const formatTime = (timeString: string) => {
  const date = new Date(timeString);
  return date.toLocaleString();
};

const View = () => {
  const router = useRouter();
  const [entries, setEntries] = useState<ParkingEntry[]>([]);
  const [search, setSearch] = useState("");
  const [filtered, setFiltered] = useState<ParkingEntry[]>([]);
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortKey, setSortKey] = useState("entryTime");
  const [loading, setLoading] = useState(true); // Add loading state

  const loadData = async () => {
    setLoading(true); // Set loading to true before fetching data
    const data = await fetchParkingData();
    setEntries(data);
    setLoading(false); // Set loading to false after data is fetched
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 30000); // Auto-refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let data = [...entries];

    if (search.trim()) {
      const keyword = search.toLowerCase();
      data = data.filter(
        (item) =>
          item.vehicleNo.toLowerCase().includes(keyword) ||
          item.phone.includes(keyword)
      );
    }

    if (filterStatus !== "all") {
      data = data.filter((item) => item.paymentStatus === filterStatus);
    }

    data.sort((a, b) => {
      if (sortKey === "entryTime") {
        return (
          new Date(b.entryTime).getTime() - new Date(a.entryTime).getTime()
        );
      } else if (sortKey === "amount") {
        return b.totalAmount - a.totalAmount;
      } else if (sortKey === "status") {
        return a.paymentStatus.localeCompare(b.paymentStatus);
      }
      return 0;
    });

    setFiltered(data);
  }, [entries, search, filterStatus, sortKey]);

  return (
    <main className="min-h-screen bg-neutral-900 text-white px-6 py-12">
      <button
        onClick={() => router.push("/")}
        className="absolute top-6 left-6 bg-neutral-700 hover:bg-neutral-600 px-4 py-2 rounded-lg font-semibold text-white shadow-lg transition duration-300 cursor-pointer"
      >
        Back
      </button>
      <h1 className="text-4xl font-bold mb-2 text-center">Parking Logs</h1>
      <p className="text-sm text-neutral-400 mb-10 text-center">
        Updates every 30 seconds
      </p>

      {/* Controls */}
      <div className="w-full max-w-6xl mx-auto mb-10 grid grid-cols-1 md:grid-cols-3 gap-4">
        <input
          type="text"
          placeholder="Search by vehicle number or phone..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-neutral-800 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-300 "
        />

        <select
          value={sortKey}
          onChange={(e) => setSortKey(e.target.value)}
          className="bg-neutral-800 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-300 cursor-pointer"
        >
          <option value="entryTime">Sort by Entry Time</option>
          <option value="amount">Sort by Amount</option>
          <option value="status">Sort by Payment Status</option>
        </select>

        <div className="flex gap-2">
          {["all", "paid", "pending"].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 cursor-pointer rounded-lg font-medium w-full transition ${
                filterStatus === status
                  ? "bg-neutral-300 text-black"
                  : "bg-neutral-700 text-neutral-300 hover:bg-neutral-600"
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Entry Cards */}
      <div className="w-full max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
        {loading ? (
          <div className="col-span-full text-center text-neutral-400">
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
          </div>
        ) : filtered.length === 0 ? (
          <div className="col-span-full text-center text-neutral-400">
            No matching records found.
          </div>
        ) : (
          filtered.map((entry, index) => (
            <div
              key={index}
              className="bg-neutral-800 rounded-2xl p-6 shadow-lg space-y-4 border border-neutral-700"
            >
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-bold">{entry.vehicleNo}</h2>
                  <p className="text-sm text-neutral-400">
                    {entry.vehicleType}
                  </p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    entry.paymentStatus === "paid"
                      ? "bg-green-600 text-white"
                      : "bg-yellow-500 text-black"
                  }`}
                >
                  {entry.paymentStatus.toUpperCase()}
                </span>
              </div>

              <div className="text-sm space-y-1">
                <p>
                  <span className="text-neutral-400">Phone:</span> {entry.phone}
                </p>
                <p>
                  <span className="text-neutral-400">Entry Time:</span>{" "}
                  {formatTime(entry.entryTime)}
                </p>
                <p>
                  <span className="text-neutral-400">Parking Duration:</span>{" "}
                  {entry.parkingDuration} hrs
                </p>
                <p>
                  <span className="text-neutral-400">Extra Duration:</span>{" "}
                  {entry.extraDuration} hrs
                </p>
                <p>
                  <span className="text-neutral-400">Total Amount Paid:</span> ₹
                  {entry.totalAmount}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </main>
  );
};

export default View;
