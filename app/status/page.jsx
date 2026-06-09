"use client";

import { useEffect, useState } from "react";

export default function StatusPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await fetch("/api/admin/bookings");
        const data = await res.json();

        setBookings(data.bookings || []);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();

    // Auto refresh every 5 sec
    const interval = setInterval(fetchBookings, 5000);

    return () => clearInterval(interval);
  }, []);

  // Status Styles
  const getStatusConfig = (status) => {
    switch (status) {
      case "Pending":
        return {
          color:
            "bg-yellow-500/15 text-yellow-400 border-yellow-500/30",
          progress: "30%",
          icon: "🕒",
        };

      case "Confirmed":
        return {
          color:
            "bg-blue-500/15 text-blue-400 border-blue-500/30",
          progress: "65%",
          icon: "🔧",
        };

      case "Completed":
        return {
          color:
            "bg-green-500/15 text-green-400 border-green-500/30",
          progress: "100%",
          icon: "✅",
        };

      case "Cancelled":
        return {
          color:
            "bg-red-500/15 text-red-400 border-red-500/30",
          progress: "10%",
          icon: "❌",
        };

      default:
        return {
          color:
            "bg-gray-500/15 text-gray-300 border-gray-500/30",
          progress: "0%",
          icon: "📌",
        };
    }
  };

  return (
    <section className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black text-white py-12 px-4 md:px-8 overflow-hidden">
      
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-12">
        
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          
          <div>
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-blue-500/20 bg-blue-500/10 text-blue-400 text-sm font-medium">
              🚗 Vehicle Service Tracker
            </span>

            <h1 className="text-4xl md:text-5xl font-black mt-5 leading-tight">
              Repair Status
              <span className="text-blue-500"> Dashboard</span>
            </h1>

            <p className="text-slate-400 mt-4 max-w-2xl">
              Track your vehicle service progress in real-time with
              live updates from our AutoCare workshop system.
            </p>
          </div>

          {/* Stats Card */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 min-w-[240px]">
            <p className="text-slate-400 text-sm">
              Total Active Repairs
            </p>

            <h2 className="text-5xl font-black mt-2">
              {bookings.length}
            </h2>

            <p className="text-green-400 mt-2 text-sm">
              ● Live Updating
            </p>
          </div>

        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="text-center py-24">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>

          <p className="text-slate-400 mt-6">
            Loading repair status...
          </p>
        </div>
      )}

      {/* Empty State */}
      {!loading && bookings.length === 0 && (
        <div className="text-center py-24">
          <div className="text-7xl mb-6">🚘</div>

          <h2 className="text-3xl font-bold mb-3">
            No Repair Bookings Found
          </h2>

          <p className="text-slate-400">
            Your vehicle service bookings will appear here.
          </p>
        </div>
      )}

      {/* Booking Cards */}
      {!loading && bookings.length > 0 && (
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          
          {bookings.map((booking) => {
            const status = getStatusConfig(booking.status);

            return (
              <div
                key={booking._id}
                className="group relative bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-7 overflow-hidden hover:border-blue-500/30 transition duration-500 hover:-translate-y-1"
              >
                
                {/* Glow */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-500 bg-gradient-to-br from-blue-500/10 via-transparent to-cyan-500/10"></div>

                {/* Top */}
                <div className="relative z-10 flex items-start justify-between">
                  
                  <div>
                    <h2 className="text-2xl font-bold text-white">
                      {booking.vehicleModel}
                    </h2>

                    <p className="text-slate-400 mt-1">
                      Customer: {booking.fullName}
                    </p>
                  </div>

                  <div className="text-3xl">
                    {status.icon}
                  </div>
                </div>

                {/* Service */}
                <div className="relative z-10 mt-6">
                  
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-slate-400 text-sm">
                      Service Type
                    </p>

                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold border ${status.color}`}
                    >
                      {booking.status}
                    </span>
                  </div>

                  <h3 className="font-semibold text-lg text-blue-400">
                    {booking.serviceType}
                  </h3>
                </div>

                {/* Progress */}
                <div className="relative z-10 mt-7">
                  
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-slate-400">
                      Repair Progress
                    </span>

                    <span className="text-white font-semibold">
                      {status.progress}
                    </span>
                  </div>

                  <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 transition-all duration-700"
                      style={{
                        width: status.progress,
                      }}
                    ></div>
                  </div>
                </div>

                {/* Footer */}
                <div className="relative z-10 mt-8 pt-5 border-t border-white/10 flex items-center justify-between">
                  
                  <div>
                    <p className="text-xs text-slate-500">
                      Booking ID
                    </p>

                    <p className="text-sm font-medium">
                      #{booking._id.slice(-6)}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-xs text-slate-500">
                      Last Update
                    </p>

                    <p className="text-sm font-medium">
                      Live Now
                    </p>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}