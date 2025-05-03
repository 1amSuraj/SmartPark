"use client";

import React, { useEffect, useState } from "react";

const fetchParkingData = async () => {
  // Simulated data
  return [
    {
      vehicleNo: "DL3CAF1234",
      vehicleType: "Car",
      phone: "9876543210",
      parkingDuration: 2,
      extraDuration: 1,
      entryTime: "2025-05-02T10:30:00Z",
      paymentStatus: "paid",
      totalAmount: 150,
    },
    {
      vehicleNo: "MH12DE4567",
      vehicleType: "Bike",
      phone: "9123456789",
      parkingDuration: 4,
      extraDuration: 0,
      entryTime: "2025-05-02T08:00:00Z",
      paymentStatus: "pending",
      totalAmount: 80,
    },
    // Add more if needed
  ];
};

const formatTime = (timeString: string) => {
  const date = new Date(timeString);
  return date.toLocaleString();
};

const View = () => {
  const [entries, setEntries] = useState([]);
  const [search, setSearch] = useState("");
  const [filtered, setFiltered] = useState([]);
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortKey, setSortKey] = useState("entryTime");

  const loadData = async () => {
    const data = await fetchParkingData();
    setEntries(data);
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 30000);
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
        return new Date(b.entryTime) - new Date(a.entryTime);
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
    <main className="min-h-screen bg-gradient-to-br from-purple-400 to-purple-600 text-white px-4 py-10 flex flex-col items-center">
      <h1 className="text-5xl font-bold mb-3">🅿️ Parking Dashboard</h1>
      <p className="text-md text-purple-100 mb-6">Auto-refresh every 30s</p>

      {/* Search + Sort + Filter */}
      <div className="w-full max-w-6xl mb-8 grid grid-cols-1 md:grid-cols-3 gap-4 ">
        <input
          type="text"
          placeholder="🔍 Search by car number or phone..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-5 py-3 bg-white text-black rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-purple-300 shadow"
        />

        <select
          value={sortKey}
          onChange={(e) => setSortKey(e.target.value)}
          className="px-5 py-3 bg-white text-black rounded-xl w-full focus:outline-none shadow"
        >
          <option value="entryTime">🕒 Sort by Entry Time</option>
          <option value="amount">💰 Sort by Amount</option>
          <option value="status">💳 Sort by Payment Status</option>
        </select>

        <div className="flex justify-between gap-2">
          {["all", "paid", "pending"].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 rounded-xl font-semibold w-full transition ${
                filterStatus === status
                  ? "bg-white text-purple-700"
                  : "bg-purple-200 text-black"
              }`}
            >
              {status === "all"
                ? "All"
                : status === "paid"
                ? "Paid 💸"
                : "Pending ⏳"}
            </button>
          ))}
        </div>
      </div>

      {/* Entries */}
      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.length === 0 ? (
          <div className="col-span-full text-center text-white text-lg">
            🚫 No records match the search/filter.
          </div>
        ) : (
          filtered.map((entry, i) => (
            <div
              key={i}
              className={`rounded-2xl shadow-md p-6 transition transform hover:scale-[1.02] ${
                entry.paymentStatus === "paid"
                  ? "bg-white text-black"
                  : "bg-yellow-100 text-black"
              }`}
            >
              <div className="flex justify-between items-center border-b pb-3 mb-3">
                <div>
                  <div className="text-xl font-bold">{entry.vehicleNo}</div>
                  <div className="text-sm">{entry.vehicleType}</div>
                </div>
                <div
                  className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    entry.paymentStatus === "paid"
                      ? "bg-green-200 text-green-800"
                      : "bg-red-200 text-red-800"
                  }`}
                >
                  {entry.paymentStatus.toUpperCase()}
                </div>
              </div>

              <div className="space-y-1 text-base">
                <p>
                  📞 <span className="font-semibold">Phone:</span> {entry.phone}
                </p>
                <p>
                  ⏱ <span className="font-semibold">Duration:</span>{" "}
                  {entry.parkingDuration} hrs
                </p>
                <p>
                  ➕ <span className="font-semibold">Extra:</span>{" "}
                  {entry.extraDuration} hrs
                </p>
                <p>
                  📅 <span className="font-semibold">Entry:</span>{" "}
                  {formatTime(entry.entryTime)}
                </p>
                <p>
                  💰 <span className="font-semibold">Amount:</span> ₹
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
