"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  CalendarCheck,
  Users,
  Wrench,
  DollarSign,
  Package,
  Car,
  MessageSquare,
  ArrowRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  Plus,
  Shield,
} from "lucide-react";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    bookings: 0,
    pendingBookings: 0,
    confirmedBookings: 0,
    completedBookings: 0,
    customers: 0,
    services: 0,
    parts: 0,
    vehicles: 0,
    contacts: 0,
    revenue: 0,
  });

  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      const res = await fetch("/api/admin/stats");
      const data = await res.json();

      if (data.success) {
        setStats(data.stats || {});
        setRecentBookings(data.recentBookings || []);
      }
    } catch (error) {
      console.error("Dashboard Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 8000);
    return () => clearInterval(interval);
  }, []);

  const updateBookingStatus = async (id, status) => {
    try {
      const res = await fetch(`/api/admin/bookings/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (data.success) {
        fetchDashboardData();
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

  const cards = [
    {
      title: "Total Bookings",
      value: stats.bookings,
      subtitle: `${stats.pendingBookings || 0} pending review`,
      icon: CalendarCheck,
      color: "from-blue-600/20 via-blue-500/10 to-transparent",
      accent: "text-blue-400",
      border: "border-blue-500/20",
      href: "/admin/bookings",
    },
    {
      title: "Total Revenue",
      value: `Rs. ${(stats.revenue || 0).toLocaleString()}`,
      subtitle: "Gross billing generated",
      icon: DollarSign,
      color: "from-emerald-600/20 via-emerald-500/10 to-transparent",
      accent: "text-emerald-400",
      border: "border-emerald-500/20",
      href: "/admin/billings",
    },
    {
      title: "Active Services",
      value: stats.services,
      subtitle: "Workshop repairs active",
      icon: Wrench,
      color: "from-cyan-600/20 via-cyan-500/10 to-transparent",
      accent: "text-cyan-400",
      border: "border-cyan-500/20",
      href: "/admin/services",
    },
    {
      title: "Parts in Stock",
      value: stats.parts,
      subtitle: "Inventory catalog",
      icon: Package,
      color: "from-purple-600/20 via-purple-500/10 to-transparent",
      accent: "text-purple-400",
      border: "border-purple-500/20",
      href: "/admin/parts",
    },
    {
      title: "Registered Vehicles",
      value: stats.vehicles || stats.customers,
      subtitle: `${stats.customers || 0} unique clients`,
      icon: Car,
      color: "from-indigo-600/20 via-indigo-500/10 to-transparent",
      accent: "text-indigo-400",
      border: "border-indigo-500/20",
      href: "/admin/vehicles",
    },
    {
      title: "Inquiries & Messages",
      value: stats.contacts,
      subtitle: "Customer feedback",
      icon: MessageSquare,
      color: "from-amber-600/20 via-amber-500/10 to-transparent",
      accent: "text-amber-400",
      border: "border-amber-500/20",
      href: "/admin/contacts",
    },
  ];

  return (
    <div className="space-y-8">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
            Dashboard Overview
          </h1>
          <p className="text-slate-400 mt-1">
            Real-time workshop activity, bookings, and revenue performance
          </p>
        </div>

        {/* QUICK SHORTCUTS */}
        <div className="flex flex-wrap gap-2.5">
          <Link
            href="/admin/bookings"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium text-sm transition shadow-lg shadow-blue-500/20"
          >
            <CalendarCheck size={16} />
            <span>Manage Bookings</span>
          </Link>
          <Link
            href="/admin/services"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-medium text-sm border border-white/10 transition"
          >
            <Wrench size={16} />
            <span>Workshop Tracker</span>
          </Link>
        </div>
      </div>

      {/* KPI METRIC CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {cards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <Link
              key={idx}
              href={card.href}
              className={`relative overflow-hidden rounded-2xl p-6 border ${card.border} 
                bg-gradient-to-br ${card.color} bg-slate-900/40 backdrop-blur-xl
                hover:scale-[1.02] hover:shadow-xl transition-all duration-300 group`}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-300">
                  {card.title}
                </span>
                <div
                  className={`p-2.5 rounded-xl bg-white/5 border border-white/10 ${card.accent} group-hover:scale-110 transition`}
                >
                  <Icon size={20} />
                </div>
              </div>

              <div className="mt-4">
                <h3 className="text-3xl font-black text-white tracking-tight">
                  {loading ? "..." : card.value}
                </h3>
                <p className="text-xs text-slate-400 mt-1 flex items-center justify-between">
                  <span>{card.subtitle}</span>
                  <span className="text-slate-500 group-hover:text-white transition flex items-center gap-1">
                    View <ArrowRight size={12} />
                  </span>
                </p>
              </div>
            </Link>
          );
        })}
      </div>

      {/* MAIN TWO COLUMN SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* RECENT BOOKINGS TABLE (2 COLS) */}
        <div className="lg:col-span-2 bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-white">Recent Service Requests</h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Newest customer appointments requiring review
              </p>
            </div>
            <Link
              href="/admin/bookings"
              className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
            >
              All Bookings <ArrowRight size={14} />
            </Link>
          </div>

          {loading ? (
            <div className="py-12 text-center text-slate-400 animate-pulse">
              Loading recent bookings...
            </div>
          ) : recentBookings.length === 0 ? (
            <div className="py-12 text-center text-slate-400">
              <CalendarCheck size={40} className="mx-auto mb-3 opacity-30" />
              <p>No bookings received yet.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-white/10 text-xs text-slate-400 uppercase">
                    <th className="pb-3 font-semibold">Customer</th>
                    <th className="pb-3 font-semibold">Vehicle</th>
                    <th className="pb-3 font-semibold">Service</th>
                    <th className="pb-3 font-semibold">Status</th>
                    <th className="pb-3 font-semibold text-right">Quick Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {recentBookings.map((b) => (
                    <tr key={b._id} className="hover:bg-white/5 transition">
                      <td className="py-3.5 pr-3">
                        <p className="font-semibold text-white">{b.fullName}</p>
                        <p className="text-xs text-slate-400">{b.phone}</p>
                      </td>
                      <td className="py-3.5 pr-3">
                        <p className="font-medium text-slate-200">{b.vehicleNumber}</p>
                        <p className="text-xs text-slate-400">{b.vehicleModel}</p>
                      </td>
                      <td className="py-3.5 pr-3 text-slate-300">{b.serviceType}</td>
                      <td className="py-3.5 pr-3">
                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-semibold ${getStatusBadge(
                            b.status
                          )}`}
                        >
                          {b.status}
                        </span>
                      </td>
                      <td className="py-3.5 text-right">
                        <div className="inline-flex gap-1.5">
                          {b.status === "Pending" && (
                            <button
                              onClick={() => updateBookingStatus(b._id, "Confirmed")}
                              className="px-2.5 py-1 text-xs font-medium rounded-lg bg-emerald-600/30 text-emerald-300 hover:bg-emerald-600 hover:text-white transition"
                            >
                              Confirm
                            </button>
                          )}
                          {b.status === "Confirmed" && (
                            <button
                              onClick={() => updateBookingStatus(b._id, "Completed")}
                              className="px-2.5 py-1 text-xs font-medium rounded-lg bg-blue-600/30 text-blue-300 hover:bg-blue-600 hover:text-white transition"
                            >
                              Complete
                            </button>
                          )}
                          <Link
                            href="/admin/bookings"
                            className="px-2.5 py-1 text-xs font-medium rounded-lg bg-white/5 text-slate-300 hover:bg-white/10 transition"
                          >
                            Details
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* WORKSHOP STATUS OVERVIEW (1 COL) */}
        <div className="bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-bold text-white">Workshop Summary</h2>
            <p className="text-xs text-slate-400 mt-0.5">Operational health</p>

            <div className="space-y-4 mt-6">
              <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
                    <Clock size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">Pending Review</p>
                    <p className="text-xs text-slate-400">Bookings awaiting approval</p>
                  </div>
                </div>
                <span className="text-xl font-bold text-amber-400">
                  {stats.pendingBookings || 0}
                </span>
              </div>

              <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center">
                    <Wrench size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">Confirmed Repairs</p>
                    <p className="text-xs text-slate-400">Scheduled in service bays</p>
                  </div>
                </div>
                <span className="text-xl font-bold text-blue-400">
                  {stats.confirmedBookings || 0}
                </span>
              </div>

              <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                    <CheckCircle2 size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">Ready / Delivered</p>
                    <p className="text-xs text-slate-400">Invoices ready for pickup</p>
                  </div>
                </div>
                <span className="text-xl font-bold text-emerald-400">
                  {stats.completedBookings || 0}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-5 border-t border-white/10">
            <Link
              href="/admin/services"
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold text-sm hover:opacity-95 transition"
            >
              <span>Open Workshop Floor</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}