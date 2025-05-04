// "use client";

// import React, { useEffect, useState } from "react";

// const fetchParkingData = async () => {
//   // Simulated data
//   return [
//     {
//       vehicleNo: "DL3CAF1234",
//       vehicleType: "Car",
//       phone: "9876543210",
//       parkingDuration: 2,
//       extraDuration: 1,
//       entryTime: "2025-05-02T10:30:00Z",
//       paymentStatus: "paid",
//       totalAmount: 150,
//     },
//     {
//       vehicleNo: "MH12DE4567",
//       vehicleType: "Bike",
//       phone: "9123456789",
//       parkingDuration: 4,
//       extraDuration: 0,
//       entryTime: "2025-05-02T08:00:00Z",
//       paymentStatus: "pending",
//       totalAmount: 80,
//     },
//   ];
// };

// const formatTime = (timeString) => {
//   const date = new Date(timeString);
//   return date.toLocaleString();
// };

// const View = () => {
//   const [entries, setEntries] = useState([]);
//   const [search, setSearch] = useState("");
//   const [filtered, setFiltered] = useState([]);
//   const [filterStatus, setFilterStatus] = useState("all");
//   const [sortKey, setSortKey] = useState("entryTime");

//   const loadData = async () => {
//     const data = await fetchParkingData();
//     setEntries(data);
//   };

//   useEffect(() => {
//     loadData();
//     const interval = setInterval(loadData, 30000);
//     return () => clearInterval(interval);
//   }, []);

//   useEffect(() => {
//     let data = [...entries];

//     if (search.trim()) {
//       const keyword = search.toLowerCase();
//       data = data.filter(
//         (item) =>
//           item.vehicleNo.toLowerCase().includes(keyword) ||
//           item.phone.includes(keyword)
//       );
//     }

//     if (filterStatus !== "all") {
//       data = data.filter((item) => item.paymentStatus === filterStatus);
//     }

//     data.sort((a, b) => {
//       if (sortKey === "entryTime") {
//         return new Date(b.entryTime) - new Date(a.entryTime);
//       } else if (sortKey === "amount") {
//         return b.totalAmount - a.totalAmount;
//       } else if (sortKey === "status") {
//         return a.paymentStatus.localeCompare(b.paymentStatus);
//       }
//       return 0;
//     });

//     setFiltered(data);
//   }, [entries, search, filterStatus, sortKey]);

//   return (
//     <main className="min-h-screen bg-gray-100 text-gray-800 px-4 py-10 flex flex-col items-center">
//       <h1 className="text-4xl font-semibold mb-1">
//         Parking Management Dashboard
//       </h1>
//       <p className="text-sm text-gray-500 mb-6">
//         Auto-refreshes every 30 seconds
//       </p>

//       <div className="w-full max-w-6xl mb-8 p-4 bg-white rounded-xl shadow-md grid grid-cols-1 md:grid-cols-3 gap-4">
//         <input
//           type="text"
//           placeholder="Search by vehicle no. or phone..."
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//           className="px-4 py-2 rounded-md border border-gray-300 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
//         />

//         <select
//           value={sortKey}
//           onChange={(e) => setSortKey(e.target.value)}
//           className="px-4 py-2 rounded-md border border-gray-300 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
//         >
//           <option value="entryTime">Sort by Entry Time</option>
//           <option value="amount">Sort by Amount</option>
//           <option value="status">Sort by Payment Status</option>
//         </select>

//         <div className="flex gap-2">
//           {["all", "paid", "pending"].map((status) => (
//             <button
//               key={status}
//               onClick={() => setFilterStatus(status)}
//               className={`px-4 py-2 rounded-md font-medium w-full transition text-sm ${
//                 filterStatus === status
//                   ? "bg-blue-600 text-white"
//                   : "bg-gray-200 text-gray-700"
//               }`}
//             >
//               {status === "all"
//                 ? "All"
//                 : status === "paid"
//                 ? "Paid"
//                 : "Pending"}
//             </button>
//           ))}
//         </div>
//       </div>

//       <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-6">
//         {filtered.length === 0 ? (
//           <div className="col-span-full text-center text-gray-600 text-md">
//             No matching records found.
//           </div>
//         ) : (
//           filtered.map((entry, i) => (
//             <div
//               key={i}
//               className={`rounded-xl shadow-sm p-5 border-l-4 ${
//                 entry.paymentStatus === "paid"
//                   ? "border-green-500 bg-white"
//                   : "border-yellow-500 bg-yellow-50"
//               }`}
//             >
//               <div className="flex justify-between items-center mb-2">
//                 <div>
//                   <h2 className="text-lg font-bold tracking-wide">
//                     {entry.vehicleNo}
//                   </h2>
//                   <p className="text-xs text-gray-500">{entry.vehicleType}</p>
//                 </div>
//                 <span
//                   className={`text-xs font-semibold px-3 py-1 rounded-full ${
//                     entry.paymentStatus === "paid"
//                       ? "bg-green-100 text-green-700"
//                       : "bg-yellow-100 text-yellow-700"
//                   }`}
//                 >
//                   {entry.paymentStatus.toUpperCase()}
//                 </span>
//               </div>
//               <ul className="text-sm space-y-1">
//                 <li>
//                   <strong>Phone:</strong> {entry.phone}
//                 </li>
//                 <li>
//                   <strong>Duration:</strong> {entry.parkingDuration} hrs
//                 </li>
//                 <li>
//                   <strong>Extra Duration:</strong> {entry.extraDuration} hrs
//                 </li>
//                 <li>
//                   <strong>Entry Time:</strong> {formatTime(entry.entryTime)}
//                 </li>
//                 <li>
//                   <strong>Amount:</strong> ₹{entry.totalAmount}
//                 </li>
//               </ul>
//             </div>
//           ))
//         )}
//       </div>
//     </main>
//   );
// };

// export default View;

"use client";

import React, { useEffect, useState } from "react";

const fetchParkingData = async () => {
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
    <main className="min-h-screen bg-neutral-900 text-white px-6 py-12">
      <h1 className="text-4xl font-bold mb-2 text-center">Parking Logs</h1>
      <p className="text-sm text-neutral-400 mb-10 text-center">
        Updated every 30 seconds
      </p>

      {/* Controls */}
      <div className="w-full max-w-6xl mx-auto mb-10 grid grid-cols-1 md:grid-cols-3 gap-4">
        <input
          type="text"
          placeholder="Search by vehicle number or phone..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-neutral-800 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-300"
        />

        <select
          value={sortKey}
          onChange={(e) => setSortKey(e.target.value)}
          className="bg-neutral-800 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-300"
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
              className={`px-4 py-2 rounded-lg font-medium w-full transition ${
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
        {filtered.length === 0 ? (
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
                  <span className="text-neutral-400">Total Amount:</span> ₹
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
