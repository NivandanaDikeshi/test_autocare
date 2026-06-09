"use client";

import { useEffect, useState } from "react";
import { Users, CalendarCheck, Wrench } from "lucide-react";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    bookings: 0,
    customers: 0,
    services: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/admin/stats");
        const data = await res.json();

        if (data.success) {
          setStats(data.stats);
        }
      } catch (error) {
        console.error("Dashboard Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const cards = [
    {
      title: "Total Bookings",
      value: stats.bookings,
      icon: CalendarCheck,
      color: "from-blue-500/20 to-blue-700/10 text-blue-300",
    },
    {
      title: "Customers",
      value: stats.customers,
      icon: Users,
      color: "from-green-500/20 to-green-700/10 text-green-300",
    },
    {
      title: "Services",
      value: stats.services,
      icon: Wrench,
      color: "from-yellow-500/20 to-yellow-700/10 text-yellow-300",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black text-white p-6 md:p-10">

      {/* HEADER */}
      <div className="mb-10">
        <h1 className="text-4xl font-bold tracking-tight">
          Dashboard Overview
        </h1>

        <p className="text-slate-400 mt-2">
          Monitor your business performance in real time
        </p>
      </div>

      {/* LOADING */}
      {loading ? (
        <div className="text-slate-400 animate-pulse text-lg">
          Loading dashboard data...
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">

          {cards.map((card, index) => {
            const Icon = card.icon;

            return (
              <div
                key={index}
                className={`relative overflow-hidden rounded-3xl p-6 border border-white/10 
                bg-gradient-to-br ${card.color} backdrop-blur-xl
                hover:scale-[1.03] hover:shadow-2xl transition-all duration-300`}
              >

                {/* Glow effect */}
                <div className="absolute inset-0 opacity-20 bg-white blur-3xl" />

                {/* Content */}
                <div className="relative z-10">

                  <div className="flex items-center justify-between">
                    <h3 className="text-sm text-slate-300 font-medium">
                      {card.title}
                    </h3>

                    <Icon className="w-6 h-6 opacity-80" />
                  </div>

                  <p className="text-4xl font-bold mt-4 tracking-tight">
                    {card.value}
                  </p>

                  <p className="text-xs text-slate-400 mt-2">
                    Updated in real time
                  </p>

                </div>

              </div>
            );
          })}

        </div>
      )}
    </div>
  );
}