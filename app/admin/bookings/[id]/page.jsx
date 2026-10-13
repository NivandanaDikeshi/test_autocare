"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  CalendarCheck,
  ArrowLeft,
  Car,
  User,
  Phone,
  Clock,
  CheckCircle,
  XCircle,
  Trash2,
  FileText,
  Wrench,
  AlertCircle,
} from "lucide-react";

export default function BookingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id;

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const fetchBooking = async () => {
    if (!id) return;
    try {
      setLoading(true);
      const res = await fetch(`/api/admin/bookings/${id}`);
      const data = await res.json();
      if (data.success) {
        setBooking(data.booking);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooking();
  }, [id]);

  const updateStatus = async (status) => {
    try {
      setUpdating(true);
      const res = await fetch(`/api/admin/bookings/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (data.success) {
        setBooking(data.booking);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUpdating(false);
    }
  };

  const deleteBooking = async () => {
    if (!confirm("Are you sure you want to delete this booking permanently?")) return;
    try {
      const res = await fetch(`/api/admin/bookings/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        router.push("/admin/bookings");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "Confirmed":
        return "bg-blue-500/10 text-blue-400 border border-blue-500/30";
      case "Completed":
        return "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30";
      case "Cancelled":
        return "bg-rose-500/10 text-rose-400 border border-rose-500/30";
      default:
        return "bg-amber-500/10 text-amber-400 border border-amber-500/30";
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* BACK NAVIGATION & ACTIONS */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Link
          href="/admin/bookings"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-400 hover:text-white transition w-fit"
        >
          <ArrowLeft size={16} />
          <span>Back to All Bookings</span>
        </Link>

        {booking && (
          <div className="flex flex-wrap items-center gap-2">
            {booking.status === "Pending" && (
              <button
                disabled={updating}
                onClick={() => updateStatus("Confirmed")}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition disabled:opacity-50"
              >
                <CheckCircle size={14} />
                <span>Confirm Appointment</span>
              </button>
            )}
            {booking.status === "Confirmed" && (
              <button
                disabled={updating}
                onClick={() => updateStatus("Completed")}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition disabled:opacity-50"
              >
                <CheckCircle size={14} />
                <span>Mark as Completed</span>
              </button>
            )}
            {booking.status !== "Cancelled" && (
              <button
                disabled={updating}
                onClick={() => updateStatus("Cancelled")}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 border border-rose-500/20 text-xs font-semibold transition disabled:opacity-50"
              >
                <XCircle size={14} />
                <span>Cancel</span>
              </button>
            )}
            <button
              onClick={deleteBooking}
              className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition border border-white/5"
              title="Delete Permanently"
            >
              <Trash2 size={16} />
            </button>
          </div>
        )}
      </div>

      {loading ? (
        <div className="py-24 text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-400">Loading appointment details...</p>
        </div>
      ) : !booking ? (
        <div className="bg-slate-900/40 border border-white/10 rounded-2xl p-16 text-center">
          <AlertCircle size={48} className="mx-auto mb-4 text-slate-600" />
          <h3 className="text-lg font-bold text-white">Booking Not Found</h3>
          <p className="text-slate-400 text-sm mt-1">
            This booking may have been removed or does not exist.
          </p>
          <Link
            href="/admin/bookings"
            className="mt-6 inline-block px-5 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold"
          >
            Return to Bookings
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {/* HEADER SUMMARY CARD */}
          <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-8 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center font-bold text-xl text-white shadow-lg shrink-0">
                  {booking.fullName?.charAt(0) || "B"}
                </div>
                <div>
                  <div className="flex items-center gap-3 flex-wrap">
                    <h1 className="text-2xl font-black text-white">{booking.fullName}</h1>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge(
                        booking.status
                      )}`}
                    >
                      {booking.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1 font-mono">
                    Booking ID: #{booking._id}
                  </p>
                </div>
              </div>
            </div>

            {/* DETAILS GRID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
              {/* CONTACT INFO */}
              <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <User size={13} className="text-cyan-400" />
                  <span>Customer Contact</span>
                </p>
                <p className="text-base font-bold text-white">{booking.fullName}</p>
                <p className="text-xs text-slate-300 mt-1 flex items-center gap-1.5">
                  <Phone size={12} className="text-slate-400" />
                  <span>{booking.phone}</span>
                </p>
                {booking.email && (
                  <p className="text-xs text-slate-400 mt-0.5 truncate">{booking.email}</p>
                )}
              </div>

              {/* VEHICLE INFO */}
              <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Car size={13} className="text-blue-400" />
                  <span>Vehicle Assigned</span>
                </p>
                <p className="text-base font-bold text-cyan-400 font-mono tracking-wide">
                  {booking.vehicleNumber}
                </p>
                <p className="text-xs text-slate-300 mt-1">{booking.vehicleModel}</p>
              </div>

              {/* SCHEDULE */}
              <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Clock size={13} className="text-amber-400" />
                  <span>Appointment Slot</span>
                </p>
                <p className="text-base font-bold text-white">{booking.preferredDate}</p>
                <p className="text-xs text-slate-300 mt-1">Time: {booking.preferredTime}</p>
              </div>

              {/* SERVICE TYPE */}
              <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Wrench size={13} className="text-emerald-400" />
                  <span>Requested Service</span>
                </p>
                <p className="text-base font-bold text-white">{booking.serviceType}</p>
                <p className="text-xs text-slate-400 mt-1">Standard Inspection & Service</p>
              </div>
            </div>

            {/* CUSTOMER NOTES */}
            {booking.notes && (
              <div className="mt-4 p-4 rounded-2xl bg-slate-950/70 border border-white/5">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                  Client Notes / Symptoms
                </p>
                <p className="text-sm text-slate-200 leading-relaxed">{booking.notes}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}