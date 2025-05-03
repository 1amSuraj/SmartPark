"use client";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const buttons = [
    { label: "Create", route: "/create" },
    { label: "View", route: "/view" },
    { label: "Payment", route: "/payments" },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-400 to-purple-600 text-white flex flex-col items-center justify-center px-4">
      <div className="text-center mb-16">
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight">
          Suraj's
        </h1>
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-semibold mt-2">
          Parking System
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 w-full max-w-4xl">
        {buttons.map((btn) => (
          <button
            key={btn.label}
            onClick={() => router.push(btn.route)}
            className="bg-white text-purple-700 hover:bg-purple-100 hover:scale-105 transition-transform duration-300 font-semibold text-2xl py-6 rounded-2xl shadow-lg border-4 border-white"
          >
            {btn.label}
          </button>
        ))}
      </div>
    </main>
  );
}
