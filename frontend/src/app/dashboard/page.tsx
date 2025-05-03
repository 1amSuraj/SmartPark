"use client";
import React from "react";

export default function page() {
  const names = ["CREATE", "VIEW", "PAYMENTS"];
  function doit() {
    alert("u clicked me");
  }
  return (
    <>
      <div className="fixed top-1 right-6 bg-blue-600 w-20 h-20">hello</div>
      <div className="flex w-full mt-32 h-40 items-center bg-white text-black">
        <div className="mx-auto flex space-x-10 bg-yellow-300">
          <div
            className="bg-stone-300 p-5 w-50 text-center cursor-pointer hover:bg-stone-500 transition-all duration-300"
            onClick={doit}
          >
            CREATE
          </div>
          <div
            className="bg-stone-300 h-50  p-5 w-20 text-center cursor-pointer hover:bg-stone-500 transition-all duration-300"
            onClick={doit}
          >
            VIEW
          </div>
          <div
            className="bg-stone-300 p-5 w-50 text-center cursor-pointer hover:bg-stone-500 transition-all duration-300"
            onClick={doit}
          >
            PAYMENTS
          </div>
        </div>

        {/* <div className="bg-red-700 w-6 h-2 mx-auto"></div> */}
        {/* <div className="bg-amber-700 w-6 h-2"></div> */}
      </div>

      <div className="h-[2000px]"></div>
    </>
  );
}
