"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import axios from "axios";

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

const COLORS = ["#22c55e", "#ef4444"];

const fetchParkingData = async (): Promise<ParkingEntry[]> => {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/parking`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching parking data:", error);
    return [];
  }
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
  const router = useRouter();
  const [entries, setEntries] = useState<ParkingEntry[]>([]);
  const [stats, setStats] = useState<{
    totalPaidToday: number;
    totalPaid7Days: number;
    totalPaid30Days: number;
    entriesToday: number;
  }>({
    totalPaidToday: 0,
    totalPaid7Days: 0,
    totalPaid30Days: 0,
    entriesToday: 0,
  });

  useEffect(() => {
    const load = async () => {
      const data = await fetchParkingData();
      setEntries(data);
      // Fetch stats from backend
      try {
        const statsRes = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/parking/stats`
        );
        setStats(statsRes.data);
      } catch (err) {
        console.error("Error fetching stats:", err);
      }
    };

    load();

    const interval = setInterval(load, 30000);

    return () => clearInterval(interval);
  }, []);

  const paidToday = entries.filter(
    (e) => isToday(e.entryTime) && e.paymentStatus === "paid"
  );
  const unpaidToday = entries.filter(
    (e) => isToday(e.entryTime) && e.paymentStatus === "pending"
  );

  const chartData = [
    { name: "Paid", value: paidToday.length },
    { name: "Unpaid", value: unpaidToday.length },
  ];

  return (
    <main className="min-h-screen bg-neutral-900 text-white px-4 py-10 flex flex-col pt-20 sm:pt-12 items-center">
      {/* Back Button */}
      <button
        onClick={() => router.push("/")}
        className="absolute top-6 left-6 bg-neutral-700 hover:bg-neutral-600 px-4 py-2 rounded-lg font-semibold text-white shadow-lg transition duration-300 cursor-pointer"
      >
        Back
      </button>

      {/* Header */}
      <h1 className="text-4xl font-bold mb-2 text-white">Payment Dashboard</h1>
      <p className="text-md text-neutral-400 mb-10 text-center">
        All figures based on current data
      </p>

      {/* Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10 w-full max-w-6xl">
        <div className="bg-neutral-800 rounded-xl p-6 shadow-md">
          <h3 className="text-lg text-white mb-2">Today's Income</h3>
          <p className="text-3xl font-bold text-green-400">
            ₹{stats.totalPaidToday}
          </p>
        </div>

        <div className="bg-neutral-800 rounded-xl p-6 shadow-md">
          <h3 className="text-lg text-white mb-2">Last 7 Days</h3>
          <p className="text-3xl font-bold text-blue-400">
            ₹{stats.totalPaid7Days}
          </p>
        </div>

        <div className="bg-neutral-800 rounded-xl p-6 shadow-md">
          <h3 className="text-lg text-white mb-2">Last 30 Days</h3>
          <p className="text-3xl font-bold text-yellow-400">
            ₹{stats.totalPaid30Days}
          </p>
        </div>

        <div className="bg-neutral-800 rounded-xl p-6 shadow-md">
          <h3 className="text-lg text-white mb-2">Entries Today</h3>
          <p className="text-3xl font-bold text-purple-400">
            {stats.entriesToday}
          </p>
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
