"use client";

import { useEffect, useState } from "react";
import {
  CalendarCheck,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  Clock,
  Trash2,
  Eye,
  Car,
  Phone,
  User,
  Wrench,
  FileText,
  X,
} from "lucide-react";

export default function BookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedBooking, setSelectedBooking] = useState(null);

  const fetchBookings = async () => {
    try {
      const res = await fetch("/api/admin/bookings");
      const data = await res.json();
      if (data.success) {
        setBookings(data.bookings || []);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
    const interval = setInterval(fetchBookings, 6000);
    return () => clearInterval(interval);
  }, []);

  const updateStatus = async (id, status) => {
    try {
      const res = await fetch(`/api/admin/bookings/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (data.success) {
        fetchBookings();
        if (selectedBooking && selectedBooking._id === id) {
          setSelectedBooking({ ...selectedBooking, status });
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const deleteBooking = async (id) => {
    if (!confirm("Are you sure you want to delete this booking permanently?")) return;
    try {
      const res = await fetch(`/api/admin/bookings/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        fetchBookings();
        if (selectedBooking && selectedBooking._id === id) {
          setSelectedBooking(null);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filteredBookings = bookings.filter((b) => {
    const matchesStatus =
      statusFilter === "All" || b.status === statusFilter;
    const term = search.toLowerCase().trim();
    const matchesSearch =
      !term ||
      (b.fullName && b.fullName.toLowerCase().includes(term)) ||
      (b.phone && b.phone.toLowerCase().includes(term)) ||
      (b.vehicleNumber && b.vehicleNumber.toLowerCase().includes(term)) ||
      (b.vehicleModel && b.vehicleModel.toLowerCase().includes(term)) ||
      (b.serviceType && b.serviceType.toLowerCase().includes(term));

    return matchesStatus && matchesSearch;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case "Confirmed":
        return "bg-blue-500/20 text-blue-400 border border-blue-500/30";
      case "Completed":
        return "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30";
      case "Cancelled":
        return "bg-rose-500/20 text-rose-400 border border-rose-500/30";
      default:
        return "bg-amber-500/20 text-amber-400 border border-amber-500/30";
    }
  };

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
            Booking Management
          </h1>
          <p className="text-slate-400 mt-1">
            Review, confirm, schedule, and track customer service appointments
          </p>
        </div>

        {/* STATS CHIPS */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="px-4 py-2 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-semibold">
            {bookings.length} Total Bookings
          </div>
          <div className="px-4 py-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm font-semibold">
            {bookings.filter((b) => b.status === "Pending").length} Pending
          </div>
        </div>
      </div>

      {/* SEARCH AND FILTER BAR */}
      <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-4 flex flex-col md:flex-row gap-4 items-center justify-between shadow-xl">
        {/* Search Input */}
        <div className="relative w-full md:w-96">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by customer, vehicle, or phone..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-white/10 rounded-xl text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap gap-1.5 w-full md:w-auto">
          {["All", "Pending", "Confirmed", "Completed", "Cancelled"].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                statusFilter === status
                  ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                  : "bg-white/5 text-slate-400 hover:text-white hover:bg-white/10"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* TABLE */}
      {loading ? (
        <div className="py-24 text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-400">Loading bookings catalog...</p>
        </div>
      ) : filteredBookings.length === 0 ? (
        <div className="bg-slate-900/40 border border-white/10 rounded-2xl p-16 text-center">
          <CalendarCheck size={48} className="mx-auto mb-4 text-slate-600" />
          <h3 className="text-lg font-bold text-white">No Bookings Found</h3>
          <p className="text-slate-400 text-sm mt-1 max-w-sm mx-auto">
            No bookings match your current search criteria. Try resetting filters.
          </p>
        </div>
      ) : (
        <div className="bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-950/80 border-b border-white/10 text-xs text-slate-400 uppercase tracking-wider">
                <tr>
                  <th className="p-4">Customer</th>
                  <th className="p-4">Vehicle</th>
                  <th className="p-4">Service</th>
                  <th className="p-4">Schedule</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredBookings.map((b) => (
                  <tr key={b._id} className="hover:bg-white/5 transition group">
                    {/* CUSTOMER */}
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center font-bold">
                          {b.fullName.charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold text-white">{b.fullName}</p>
                          <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                            <Phone size={11} /> {b.phone}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* VEHICLE */}
                    <td className="p-4">
                      <p className="font-medium text-white tracking-wide">{b.vehicleNumber}</p>
                      <p className="text-xs text-slate-400">{b.vehicleModel}</p>
                    </td>

                    {/* SERVICE */}
                    <td className="p-4">
                      <span className="text-slate-200 font-medium">{b.serviceType}</span>
                    </td>

                    {/* DATE & TIME */}
                    <td className="p-4">
                      <p className="text-slate-200">{b.preferredDate}</p>
                      <p className="text-xs text-slate-400">{b.preferredTime}</p>
                    </td>

                    {/* STATUS */}
                    <td className="p-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge(
                          b.status
                        )}`}
                      >
                        {b.status}
                      </span>
                    </td>

                    {/* ACTIONS */}
                    <td className="p-4 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        {b.status === "Pending" && (
                          <button
                            onClick={() => updateStatus(b._id, "Confirmed")}
                            title="Confirm Booking"
                            className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition flex items-center gap-1"
                          >
                            <CheckCircle size={13} />
                            <span>Confirm</span>
                          </button>
                        )}

                        {b.status === "Confirmed" && (
                          <button
                            onClick={() => updateStatus(b._id, "Completed")}
                            title="Mark Completed"
                            className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-500 text-white transition flex items-center gap-1"
                          >
                            <CheckCircle size={13} />
                            <span>Complete</span>
                          </button>
                        )}

                        {b.status !== "Cancelled" && b.status !== "Completed" && (
                          <button
                            onClick={() => updateStatus(b._id, "Cancelled")}
                            title="Cancel Booking"
                            className="px-2.5 py-1.5 text-xs font-medium rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 transition"
                          >
                            <XCircle size={13} />
                          </button>
                        )}

                        <button
                          onClick={() => setSelectedBooking(b)}
                          title="View Details"
                          className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition"
                        >
                          <Eye size={16} />
                        </button>

                        <button
                          onClick={() => deleteBooking(b._id)}
                          title="Delete Booking"
                          className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* BOOKING DETAILS MODAL */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-white/10 rounded-3xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 shadow-2xl relative">
            <button
              onClick={() => setSelectedBooking(null)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white p-2 rounded-full hover:bg-white/10 transition"
            >
              <X size={18} />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-400 flex items-center justify-center text-white">
                <Car size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Booking Details</h3>
                <p className="text-xs text-slate-400">ID: #{selectedBooking._id}</p>
              </div>
            </div>

            <div className="space-y-4 text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 p-4 rounded-xl bg-white/5">
                <div>
                  <p className="text-xs text-slate-400">Customer Name</p>
                  <p className="font-semibold text-white mt-0.5">{selectedBooking.fullName}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400">Contact Phone</p>
                  <p className="font-semibold text-white mt-0.5">{selectedBooking.phone}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 p-4 rounded-xl bg-white/5">
                <div>
                  <p className="text-xs text-slate-400">Vehicle Number</p>
                  <p className="font-semibold text-cyan-400 mt-0.5">{selectedBooking.vehicleNumber}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400">Vehicle Model</p>
                  <p className="font-semibold text-white mt-0.5">{selectedBooking.vehicleModel}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 p-4 rounded-xl bg-white/5">
                <div>
                  <p className="text-xs text-slate-400">Service Type</p>
                  <p className="font-semibold text-white mt-0.5">{selectedBooking.serviceType}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400">Schedule</p>
                  <p className="font-semibold text-white mt-0.5">
                    {selectedBooking.preferredDate} at {selectedBooking.preferredTime}
                  </p>
                </div>
              </div>

              {selectedBooking.notes && (
                <div className="p-4 rounded-xl bg-white/5">
                  <p className="text-xs text-slate-400">Customer Notes</p>
                  <p className="text-slate-300 mt-1">{selectedBooking.notes}</p>
                </div>
              )}

              <div className="flex items-center justify-between pt-2">
                <span className="text-xs text-slate-400">Current Status</span>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge(
                    selectedBooking.status
                  )}`}
                >
                  {selectedBooking.status}
                </span>
              </div>
            </div>

            <div className="mt-6 pt-5 border-t border-white/10 flex gap-2">
              <button
                onClick={() => updateStatus(selectedBooking._id, "Confirmed")}
                className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-500 rounded-xl font-medium text-sm text-white transition"
              >
                Confirm
              </button>
              <button
                onClick={() => updateStatus(selectedBooking._id, "Completed")}
                className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 rounded-xl font-medium text-sm text-white transition"
              >
                Mark Completed
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}