"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Car,
  Search,
  CheckCircle2,
  Clock,
  Wrench,
  Download,
  AlertCircle,
  ShieldCheck,
  RefreshCw,
  Phone,
} from "lucide-react";

function StatusTracker() {
  const searchParams = useSearchParams();
  const initialPlate = searchParams.get("v") || "";

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(initialPlate);

  const fetchBookings = async () => {
    try {
      const res = await fetch("/api/booking");
      const data = await res.json();
      setBookings(data.bookings || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
    const interval = setInterval(fetchBookings, 5000);
    return () => clearInterval(interval);
  }, []);

  const getStageInfo = (status) => {
    switch (status) {
      case "Pending":
        return {
          step: 1,
          label: "Appointment Received",
          desc: "Booking received by workshop team. Awaiting bay assignment.",
          color: "text-amber-400",
          progress: "25%",
          badge: "bg-amber-500/10 text-amber-400 border border-amber-500/30",
        };
      case "Confirmed":
      case "Checking":
        return {
          step: 2,
          label: "Diagnostic & Bay Inspection",
          desc: "Technician conducting multi-point safety & diagnostic testing.",
          color: "text-blue-400",
          progress: "50%",
          badge: "bg-blue-500/10 text-blue-400 border border-blue-500/30",
        };
      case "In Progress":
      case "Repairing":
        return {
          step: 3,
          label: "Active Bay Repair & Service",
          desc: "Mechanics actively servicing vehicle components and replacing parts.",
          color: "text-cyan-400",
          progress: "75%",
          badge: "bg-cyan-500/10 text-cyan-400 border border-cyan-500/30",
        };
      case "Completed":
        return {
          step: 4,
          label: "Ready for Delivery",
          desc: "Quality inspection passed. Vehicle cleaned and ready for pickup.",
          color: "text-emerald-400",
          progress: "100%",
          badge: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30",
        };
      case "Cancelled":
        return {
          step: 0,
          label: "Booking Cancelled",
          desc: "This service appointment was cancelled.",
          color: "text-rose-400",
          progress: "0%",
          badge: "bg-rose-500/10 text-rose-400 border border-rose-500/30",
        };
      default:
        return {
          step: 1,
          label: "Scheduled",
          desc: "Service in progress.",
          color: "text-slate-400",
          progress: "20%",
          badge: "bg-slate-500/10 text-slate-400 border border-slate-500/30",
        };
    }
  };

  const filteredBookings = bookings.filter((b) => {
    const term = search.toLowerCase().trim();
    if (!term) return true;
    return (
      (b.vehicleNumber && b.vehicleNumber.toLowerCase().includes(term)) ||
      (b._id && b._id.toLowerCase().includes(term)) ||
      (b.fullName && b.fullName.toLowerCase().includes(term))
    );
  });

  return (
    <div className="space-y-10">
      {/* SEARCH VEHICLE BOX */}
      <div className="max-w-2xl mx-auto bg-slate-900/70 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl">
        <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-2 text-center">
          Search Your Vehicle Repair Status
        </label>
        <div className="relative">
          <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Enter license plate (e.g. CAA-1234) or customer name..."
            className="w-full pl-12 pr-4 py-3.5 bg-slate-950 border border-white/10 rounded-2xl text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 uppercase font-medium"
          />
        </div>
        <p className="text-center text-xs text-slate-500 mt-2 flex items-center justify-center gap-1.5">
          <RefreshCw size={12} className="animate-spin text-cyan-400" />
          <span>Real-time live telemetry synced with workshop bays</span>
        </p>
      </div>

      {/* TRACKING CARDS */}
      {loading ? (
        <div className="py-24 text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-400">Querying workshop service bays...</p>
        </div>
      ) : filteredBookings.length === 0 ? (
        <div className="max-w-lg mx-auto bg-slate-900/40 border border-white/10 rounded-3xl p-12 text-center shadow-xl">
          <Car size={48} className="mx-auto mb-4 text-slate-600" />
          <h3 className="text-lg font-bold text-white">No Matching Vehicles Found</h3>
          <p className="text-slate-400 text-sm mt-1 max-w-sm mx-auto">
            Please verify your license plate number or submit a new service booking to begin tracking.
          </p>
          <Link
            href="/booking"
            className="inline-block mt-6 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition"
          >
            Book New Service
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {filteredBookings.map((booking) => {
            const stage = getStageInfo(booking.status);

            return (
              <div
                key={booking._id}
                className="bg-slate-900/60 backdrop-blur-2xl border border-white/10 rounded-3xl p-7 hover:border-cyan-500/30 transition-all duration-300 shadow-2xl flex flex-col justify-between group"
              >
                <div>
                  {/* TOP ROW */}
                  <div className="flex items-start justify-between pb-5 border-b border-white/10">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-400 text-white flex items-center justify-center shadow-md">
                        <Car size={24} />
                      </div>
                      <div>
                        <h3 className="text-xl font-black text-white group-hover:text-cyan-300 transition">
                          {booking.vehicleNumber}
                        </h3>
                        <p className="text-xs text-slate-400">
                          {booking.vehicleModel} • Customer: {booking.fullName}
                        </p>
                      </div>
                    </div>

                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${stage.badge}`}>
                      {booking.status}
                    </span>
                  </div>

                  {/* PROGRESS BAR & STAGE STEPPER */}
                  <div className="my-6">
                    <div className="flex justify-between items-center text-xs font-semibold mb-2">
                      <span className="text-slate-300">Live Stage: {stage.label}</span>
                      <span className={stage.color}>{stage.progress} Complete</span>
                    </div>

                    {/* Progress Track */}
                    <div className="h-2.5 bg-slate-950 rounded-full overflow-hidden border border-white/5">
                      <div
                        className="h-full bg-gradient-to-r from-blue-600 via-cyan-400 to-emerald-400 rounded-full transition-all duration-700"
                        style={{ width: stage.progress }}
                      />
                    </div>

                    {/* Stepper Dots */}
                    <div className="grid grid-cols-4 gap-2 mt-4 text-center">
                      {[
                        { num: 1, title: "Booked" },
                        { num: 2, title: "Inspection" },
                        { num: 3, title: "Repair Bay" },
                        { num: 4, title: "Ready" },
                      ].map((step) => {
                        const isDone = stage.step >= step.num;
                        const isCurrent = stage.step === step.num;
                        return (
                          <div key={step.num} className="flex flex-col items-center">
                            <div
                              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition ${
                                isDone
                                  ? "bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20"
                                  : "bg-slate-800 text-slate-500"
                              } ${isCurrent ? "ring-2 ring-cyan-400 ring-offset-2 ring-offset-slate-900" : ""}`}
                            >
                              {isDone ? "✓" : step.num}
                            </div>
                            <span
                              className={`text-[11px] mt-1.5 font-medium ${
                                isDone ? "text-slate-200" : "text-slate-500"
                              }`}
                            >
                              {step.title}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* SERVICE DETAILS BOX */}
                  <div className="p-4 rounded-2xl bg-slate-950/70 border border-white/5 space-y-2 text-xs text-slate-300">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Service Package:</span>
                      <span className="font-semibold text-white">{booking.serviceType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Appointment Date:</span>
                      <span className="text-slate-300">
                        {booking.preferredDate} at {booking.preferredTime}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Workshop Update:</span>
                      <span className="text-slate-300 font-medium">{stage.desc}</span>
                    </div>
                  </div>
                </div>

                {/* BOTTOM FOOTER */}
                <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-mono">
                    Ref ID: #{booking._id.slice(-6)}
                  </span>

                  {booking.status === "Completed" ? (
                    <Link
                      href="/billing"
                      className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold transition"
                    >
                      <Download size={13} />
                      <span>View Invoice</span>
                    </Link>
                  ) : (
                    <span className="text-cyan-400 font-medium">● Live Bay Monitoring</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function StatusPage() {
  return (
    <section className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-black text-white py-20 px-6">
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="text-center mb-14">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-xs font-semibold uppercase tracking-wider">
            <Wrench size={14} /> Workshop Status Telemetry
          </span>

          <h1 className="text-4xl md:text-6xl font-black mt-6 tracking-tight">
            Live Repair & Service <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">Tracker</span>
          </h1>

          <p className="text-slate-400 text-sm md:text-base mt-3 max-w-xl mx-auto">
            Check the real-time stage of your vehicle, technician notes, and notification when ready for pickup.
          </p>
        </div>

        <Suspense fallback={<div className="text-center py-20 text-slate-400">Loading tracker...</div>}>
          <StatusTracker />
        </Suspense>
      </div>
    </section>
  );
}