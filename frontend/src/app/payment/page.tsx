"use client";

import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const COLORS = ["#22c55e", "#ef4444"];

const fetchParkingData = async () => {
  return [
    {
      vehicleNo: "DL3CAF1234",
      vehicleType: "Car",
      phone: "9876543210",
      parkingDuration: 2,
      extraDuration: 1,
      entryTime: "2025-05-05T09:30:00Z",
      paymentStatus: "paid",
      totalAmount: 150,
    },
    {
      vehicleNo: "MH12DE4567",
      vehicleType: "Bike",
      phone: "9123456789",
      parkingDuration: 4,
      extraDuration: 0,
      entryTime: "2025-05-05T08:00:00Z",
      paymentStatus: "pending",
      totalAmount: 80,
    },
    {
      vehicleNo: "KA05XY7890",
      vehicleType: "Car",
      phone: "9898989898",
      parkingDuration: 1,
      extraDuration: 1,
      entryTime: "2025-04-30T10:00:00Z",
      paymentStatus: "paid",
      totalAmount: 120,
    },
  ];
};

const isToday = (dateStr: string) => {
  const today = new Date();
  const date = new Date(dateStr);
  return (
    today.getFullYear() === date.getFullYear() &&
    today.getMonth() === date.getMonth() &&
    today.getDate() === date.getDate()
  );
};

const Payment = () => {
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    const load = async () => {
      const data = await fetchParkingData();
      setEntries(data);
    };
    load();
  }, []);

  const paidToday = entries.filter(
    (e) => isToday(e.entryTime) && e.paymentStatus === "paid"
  );
  const unpaidToday = entries.filter(
    (e) => isToday(e.entryTime) && e.paymentStatus === "pending"
  );
  const allPaid = entries.filter((e) => e.paymentStatus === "paid");

  const todayIncome = paidToday.reduce((sum, e) => sum + e.totalAmount, 0);
  const weekIncome = allPaid.reduce((sum, e) => {
    const d = new Date(e.entryTime);
    const now = new Date();
    const diff = (now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24);
    return diff <= 7 ? sum + e.totalAmount : sum;
  }, 0);
  const monthIncome = allPaid.reduce((sum, e) => {
    const d = new Date(e.entryTime);
    const now = new Date();
    const diff = (now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24);
    return diff <= 30 ? sum + e.totalAmount : sum;
  }, 0);

  const chartData = [
    { name: "Paid", value: paidToday.length },
    { name: "Unpaid", value: unpaidToday.length },
  ];

  return (
    <main className="min-h-screen bg-neutral-900 text-white px-4 py-10 flex flex-col items-center">
      <h1 className="text-4xl font-bold mb-2 text-white">Payment Dashboard</h1>
      <p className="text-sm mb-10 text-white">
        All figures based on current data
      </p>

      {/* Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 w-full max-w-6xl">
        <div className="bg-neutral-800 rounded-xl p-6 shadow-md">
          <h3 className="text-lg text-white mb-2">Today's Income</h3>
          <p className="text-3xl font-bold text-green-400">₹{todayIncome}</p>
        </div>

        <div className="bg-neutral-800 rounded-xl p-6 shadow-md">
          <h3 className="text-lg text-white mb-2">Last 7 Days</h3>
          <p className="text-3xl font-bold text-blue-400">₹{weekIncome}</p>
        </div>

        <div className="bg-neutral-800 rounded-xl p-6 shadow-md">
          <h3 className="text-lg text-white mb-2">Last 30 Days</h3>
          <p className="text-3xl font-bold text-yellow-400">₹{monthIncome}</p>
        </div>
      </div>

      {/* Pie Chart */}
      <div className="w-full max-w-xl bg-neutral-800 p-8 rounded-2xl shadow-md">
        <h2 className="text-2xl font-semibold mb-6 text-white text-center">
          Today's Payment Status
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
              label={({ name, percent }) =>
                `${name}: ${(percent * 100).toFixed(0)}%`
              }
            >
              {chartData.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </main>
  );
};

export default Payment;
