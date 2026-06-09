"use client";

import { useEffect, useState } from "react";

export default function VehiclesPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadBookings = async () => {
    try {
      const res = await fetch("/api/booking");
      const data = await res.json();
      setBookings(data.bookings || []);
    } catch (error) {
      console.error("Error loading bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const getStatusStyle = (status) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-500/20 text-yellow-300 ring-yellow-400/30";
      case "Confirmed":
        return "bg-blue-500/20 text-blue-300 ring-blue-400/30";
      case "Completed":
        return "bg-green-500/20 text-green-300 ring-green-400/30";
      default:
        return "bg-slate-700/30 text-slate-300 ring-slate-500/30";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black text-white p-6 md:p-10">

      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight">
          Customer Vehicles
        </h1>
        <p className="text-blue-300 mt-2">
          Manage all bookings in a modern dashboard
        </p>
      </div>

      {/* DASHBOARD CARD */}
      <div className="bg-white/5 backdrop-blur-xl border border-blue-900/30 rounded-2xl shadow-2xl overflow-hidden">

        {/* TOP BAR */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-blue-900/30">
          <h2 className="text-lg font-semibold">
            Booking List
          </h2>

          <div className="text-sm text-blue-300">
            Total: {bookings.length}
          </div>
        </div>

        {/* CONTENT */}
        {loading ? (
          <div className="p-10 text-center text-blue-200">
            Loading bookings...
          </div>
        ) : (
          <div className="overflow-x-auto">

            <table className="w-full text-left">

              {/* TABLE HEADER */}
              <thead className="bg-slate-900/60 text-blue-200 text-xs uppercase tracking-wider">
                <tr>
                  <th className="p-5">Customer</th>
                  <th className="p-5">Vehicle Model</th>
                  <th className="p-5">Vehicle Number</th>
                  <th className="p-5">Status</th>
                </tr>
              </thead>

              {/* TABLE BODY */}
              <tbody className="divide-y divide-blue-900/20">

                {bookings.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="p-10 text-center text-blue-300">
                      🚗 No bookings found yet
                    </td>
                  </tr>
                ) : (
                  bookings.map((b) => (
                    <tr
                      key={b._id}
                      className="hover:bg-blue-900/10 transition"
                    >

                      <td className="p-5 font-semibold">
                        {b.fullName}
                      </td>

                      <td className="p-5 text-blue-100">
                        {b.vehicleModel}
                      </td>

                      <td className="p-5 font-medium tracking-wide text-blue-100">
                        {b.vehicleNumber}
                      </td>

                      <td className="p-5">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ring-1 ${getStatusStyle(
                            b.status
                          )}`}
                        >
                          {b.status}
                        </span>
                      </td>

                    </tr>
                  ))
                )}

              </tbody>
            </table>

          </div>
        )}
      </div>
    </div>
  );
}