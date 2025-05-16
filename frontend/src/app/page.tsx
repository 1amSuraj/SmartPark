"use client";
import { useRouter } from "next/navigation";
import { FaGithub } from "react-icons/fa";

export default function Home() {
  const router = useRouter();

  const buttons = [
    { label: "Create", route: "/create" },
    { label: "View", route: "/view" },
    { label: "Payment", route: "/payment" },
    { label: "Exit", route: "/exit" },
  ];

  // ...existing code...
  return (
    <main className="min-h-screen bg-neutral-900 text-white flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center px-4">
        <div className="text-center mb-16">
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight text-purple-400">
            SmartPark
          </h1>
          <h2 className="text-2xl sm:text-3xl md:text-3xl font-semibold mt-2 text-purple-100 ">
            Reinventing the Parking Experience
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-8 w-full max-w-4xl">
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
      </div>
      <footer className="w-full text-center text-neutral-400 py-4 text-sm mt-10">
        Made by{" "}
        <a
          href="https://suraj-srivastava.vercel.app/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-purple-400 relative transition-colors duration-300
  after:content-[''] after:block after:h-0.5 after:w-0 after:bg-gradient-to-r after:from-purple-400 after:to-cyan-400 after:transition-all after:duration-300
  hover:after:w-full hover:after:bg-gradient-to-r hover:after:from-purple-400 hover:after:to-cyan-400"
          style={{ display: "inline-block" }}
        >
          Suraj Srivastava
        </a>
        {" | "}
        <a
          href="https://github.com/1amSuraj/SmartPark"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-neutral-400 hover:text-white ml-1 align-middle"
          aria-label="GitHub"
        >
          <FaGithub size={18} className="align-middle -mt-px" />
          GitHub
        </a>
      </footer>
    </main>
  );
  // ...existing code...
}
