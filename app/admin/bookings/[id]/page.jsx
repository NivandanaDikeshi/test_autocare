"use client";

import { useEffect, useState } from "react";

export default function BookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // FETCH BOOKINGS
  const fetchBookings = async () => {
    try {
      const response = await fetch("/api/admin/bookings");
      const data = await response.json();

      if (data.success) {
        setBookings(data.bookings);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();

    const interval = setInterval(() => {
      fetchBookings();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // UPDATE STATUS (CONFIRM ONLY)
  const updateStatus = async (id, status) => {
    try {
      const response = await fetch(`/api/admin/bookings/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });

      const data = await response.json();

      if (data.success) {
        fetchBookings();
      }
    } catch (error) {
      console.log(error);
    }
  };

  // DELETE BOOKING (CANCEL BUTTON)
  const deleteBooking = async (id) => {
    try {
      const response = await fetch(`/api/admin/bookings/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (data.success) {
        fetchBookings();
      }
    } catch (error) {
      console.log(error);
    }
  };

  // STATUS STYLE
  const statusStyle = (status) => {
    switch (status) {
      case "Confirmed":
        return "bg-green-500/20 text-green-400 border border-green-500/30";

      case "Cancelled":
        return "bg-red-500/20 text-red-400 border border-red-500/30";

      default:
        return "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30";
    }
  };

  return (
    <section className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black text-white p-6 md:p-10">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-10">

        <div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight">
            Booking Management
          </h1>
          <p className="text-slate-400 mt-3 text-lg">
            Manage all customer service bookings
          </p>
        </div>

        <div className="mt-6 md:mt-0">
          <div className="bg-blue-500/10 border border-blue-500/20 px-5 py-3 rounded-2xl">
            <p className="text-blue-400 text-sm">Total Bookings</p>
            <h2 className="text-3xl font-bold mt-1">
              {bookings.length}
            </h2>
          </div>
        </div>

      </div>

      {/* LOADING */}
      {loading ? (
        <div className="flex items-center justify-center h-[400px]">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl">

          <div className="overflow-x-auto">
            <table className="w-full min-w-[1200px]">

              {/* TABLE HEADER */}
              <thead className="bg-slate-900/80 border-b border-white/10">
                <tr className="text-left">
                  <th className="p-5">Customer</th>
                  <th className="p-5">Phone</th>
                  <th className="p-5">Vehicle</th>
                  <th className="p-5">Service</th>
                  <th className="p-5">Date</th>
                  <th className="p-5">Time</th>
                  <th className="p-5">Status</th>
                  <th className="p-5">Actions</th>
                </tr>
              </thead>

              {/* TABLE BODY */}
              <tbody>
                {bookings.length > 0 ? (
                  bookings.map((booking) => (
                    <tr
                      key={booking._id}
                      className="border-b border-white/5 hover:bg-white/5 transition"
                    >

                      <td className="p-5">
                        <h3 className="font-semibold text-white">
                          {booking.fullName}
                        </h3>
                        <p className="text-sm text-slate-400">
                          ID: {booking._id.slice(-6)}
                        </p>
                      </td>

                      <td className="p-5 text-slate-300">
                        {booking.phone}
                      </td>

                      <td className="p-5 text-white">
                        {booking.vehicleModel}
                      </td>

                      <td className="p-5 text-slate-300">
                        {booking.serviceType}
                      </td>

                      <td className="p-5 text-slate-300">
                        {booking.preferredDate}
                      </td>

                      <td className="p-5 text-slate-300">
                        {booking.preferredTime}
                      </td>

                      <td className="p-5">
                        <span
                          className={`px-4 py-2 rounded-full text-sm font-semibold ${statusStyle(
                            booking.status
                          )}`}
                        >
                          {booking.status}
                        </span>
                      </td>

                      {/* ACTIONS */}
                      <td className="p-5">
                        <div className="flex gap-3">

                          <button
                            onClick={() =>
                              updateStatus(booking._id, "Confirmed")
                            }
                            className="px-4 py-2 rounded-xl bg-green-600 hover:bg-green-700"
                          >
                            Confirm
                          </button>

                          <button
                            onClick={() => deleteBooking(booking._id)}
                            className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700"
                          >
                            Cancel
                          </button>

                        </div>
                      </td>

                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="text-center p-16">
                      <div>
                        <div className="text-6xl mb-4">📭</div>
                        <h2 className="text-2xl font-bold">
                          No Bookings Found
                        </h2>
                        <p className="text-slate-400 mt-2">
                          Customer bookings will appear here
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>

            </table>
          </div>

        </div>
      )}

    </section>
  );
}