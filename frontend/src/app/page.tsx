"use client";
import { useRouter } from "next/navigation";
export default function Home() {
  const router = useRouter();
  return (
    <>
      <div className="bg-purple-300 text-black h- w-full h-screen">
        <div className="text-7xl mt-2 mb-3 pb-2">Suraj's</div>
        <div className=" text-7xl mt-2  pb-2">Parking</div>
        <div className="flex  mt-20 h-55">
          <div className="flex mx-auto space-x-20 text-white ">
            <div
              className=" hover:text-tahiti border-8 border-white hover:border-bermuda shadow-2xl  cursor-pointer text-5xl border rounded-2xl w-80 flex items-center justify-center  bg-tahiti hover:bg-temer transition-all duration-300"
              onClick={() => {
                router.push("/create");
              }}
            >
              CREATE
            </div>
            <div
              className="hover:text-tahiti border-8 border-white hover:border-bermuda shadow-2xl cursor-pointer text-5xl border rounded-2xl w-80 flex items-center justify-center bg-tahiti hover:bg-temer transition-all duration-300"
              onClick={() => {
                router.push("/view");
              }}
            >
              VIEW
            </div>
            <div
              className="hover:text-tahiti border-8 border-white hover:border-bermuda shadow-2xl cursor-pointer text-5xl border rounded-2xl w-80 flex items-center justify-center bg-tahiti hover:bg-temer transition-all duration-300"
              onClick={() => {
                router.push("/payments");
              }}
            >
              PAYMENT
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
