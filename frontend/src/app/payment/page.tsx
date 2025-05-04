"use client";

import React, { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { saveAs } from "file-saver";

// Mock data (replace with API)
const fetchPaymentData = async () => {
  return [
    { amount: 80, status: "paid", date: "2025-05-05T08:00:00Z" },
    { amount: 120, status: "unpaid", date: "2025-05-05T09:30:00Z" },
    { amount: 200, status: "paid", date: "2025-05-04T11:15:00Z" },
    { amount: 90, status: "paid", date: "2025-04-30T14:20:00Z" },
    { amount: 70, status: "unpaid", date: "2025-04-28T10:00:00Z" },
    { amount: 150, status: "paid", date: "2025-04-20T16:45:00Z" },
  ];
};

const COLORS = ["#10B981", "#FBBF24"]; // Paid / Unpaid

const PaymentsDashboard = () => {
  const [data, setData] = useState<any[]>([]);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  useEffect(() => {
    const load = async () => {
      const result = await fetchPaymentData();
      setData(result);
    };
    load();
  }, []);

  const filteredData = data.filter((d) => {
    const date = new Date(d.date);
    return (
      (!fromDate || date >= new Date(fromDate)) &&
      (!toDate || date <= new Date(toDate))
    );
  });

  const getIncome = (items: any[]) =>
    items
      .filter((d) => d.status === "paid")
      .reduce((sum, d) => sum + d.amount, 0);

  const pieData = [
    {
      name: "Paid",
      value: filteredData.filter((d) => d.status === "paid").length,
    },
    {
      name: "Unpaid",
      value: filteredData.filter((d) => d.status === "unpaid").length,
    },
  ];

  const handleExportCSV = () => {
    const rows = [
      ["Date", "Amount", "Status"],
      ...filteredData.map((d) => [d.date, `₹${d.amount}`, d.status]),
    ];
    const csv = rows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "payment_report.csv");
  };

  return (
    <main className="min-h-screen bg-neutral-900 text-white px-6 py-12">
      <h1 className="text-4xl font-bold mb-6 text-center">
        Payments Dashboard
      </h1>

      {/* Filters */}
      <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-8">
        <input
          type="date"
          value={fromDate}
          onChange={(e) => setFromDate(e.target.value)}
          className="bg-neutral-800 text-white px-4 py-2 rounded-lg outline-none"
        />
        <input
          type="date"
          value={toDate}
          onChange={(e) => setToDate(e.target.value)}
          className="bg-neutral-800 text-white px-4 py-2 rounded-lg outline-none"
        />
        <button
          onClick={handleExportCSV}
          className="bg-purple-600 hover:bg-purple-700 px-6 py-2 rounded-lg font-semibold"
        >
          Export CSV
        </button>
      </div>

      {/* Income Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto mb-10">
        <div className="bg-neutral-800 p-6 rounded-xl text-center">
          <p className="text-neutral-400">Filtered Range</p>
          <h2 className="text-2xl font-bold text-green-400">
            ₹{getIncome(filteredData)}
          </h2>
        </div>
        <div className="bg-neutral-800 p-6 rounded-xl text-center col-span-3">
          <p className="text-neutral-400">Entries Shown</p>
          <h2 className="text-2xl font-bold">{filteredData.length}</h2>
        </div>
      </div>

      {/* Pie Chart */}
      <div className="bg-neutral-800 max-w-4xl mx-auto p-6 rounded-xl">
        <h2 className="text-xl font-semibold mb-4 text-center">
          Payment Status
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={5}
              dataKey="value"
              label
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend verticalAlign="bottom" />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </main>
  );
};

export default PaymentsDashboard;
