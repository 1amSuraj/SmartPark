"use client";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const buttons = [
    { label: "Create", route: "/create" },
    { label: "View", route: "/view" },
    { label: "Payment", route: "/payment" },
  ];

  return (
    <main className="min-h-screen bg-neutral-900 text-white flex flex-col items-center justify-center px-4">
      <div className="text-center mb-16">
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight text-purple-400">
          SmartPark
        </h1>
        <h2 className="text-2xl sm:text-3xl md:text-3xl font-semibold mt-2 text-purple-100 mt-2">
          Reinventing the Future of Parking
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 w-full max-w-4xl">
        {buttons.map((btn) => (
          <button
            key={btn.label}
            onClick={() => router.push(btn.route)}
            className="bg-neutral-800 hover:bg-black/20 text-white hover:text-purple-300 transition-transform transform hover:scale-105 duration-300 font-semibold text-2xl py-6 rounded-2xl shadow-xl border border-purple-600 cursor-pointer"
          >
            {btn.label}
          </button>
        ))}
      </div>
    </main>
  );
}
