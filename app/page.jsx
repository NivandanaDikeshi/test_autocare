"use client";

import Link from "next/link";
import {
  ShieldCheck,
  Car,
  Wrench,
  CalendarCheck,
  Gauge,
  Sparkles,
  ArrowRight,
} from "lucide-react";

import Gallery from "../components/Gallery";

export default function HomePage() {
  return (
    <>
      {/* ================= HERO SECTION ================= */}
      <section className="relative min-h-[92vh] flex items-center overflow-hidden px-4 sm:px-6 py-14 sm:py-20">
        {/* Background */}
        <div className="absolute inset-0 bg-slate-950 pointer-events-none">
          {/* Glow Effects */}
          <div className="absolute top-[-100px] left-1/2 -translate-x-1/2 w-[350px] sm:w-[600px] h-[350px] sm:h-[600px] bg-cyan-500/15 blur-[160px] rounded-full" />
          <div className="absolute bottom-[-150px] right-1/4 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-blue-600/10 blur-[160px] rounded-full" />

          {/* Grid */}
          <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#ffffff10_1px,transparent_1px),linear-gradient(to_bottom,#ffffff10_1px,transparent_1px)] bg-[size:40px_40px]" />
        </div>

        {/* CONTENT WRAPPER */}
        <div className="relative max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 lg:gap-16 items-center z-10 w-full">
          {/* LEFT SIDE */}
          <div className="text-center lg:text-left">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs sm:text-sm font-medium mb-6">
              <ShieldCheck size={16} className="text-cyan-400" />
              <span>Smart Vehicle Service Platform</span>
            </div>

            {/* Title */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl xl:text-7xl font-black leading-[1.1] text-white tracking-tight">
              Modern
              <br />
              <span className="text-white/90">Vehicle Service</span>
              <br />
              <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">
                Management
              </span>
            </h1>

            {/* Description */}
            <p className="mt-5 text-slate-400 text-sm sm:text-base md:text-lg max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Book certified maintenance appointments, track real-time repair
              milestones, access vehicle service histories, and download official
              PDF invoices from a single intuitive platform.
            </p>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-3.5 sm:gap-4 mt-8 sm:mt-10 justify-center lg:justify-start">
              <Link
                href="/booking"
                className="px-7 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold text-sm shadow-xl shadow-blue-500/25 hover:opacity-95 hover:scale-[1.02] transition flex items-center justify-center gap-2"
              >
                <span>Book Service Appointment</span>
                <ArrowRight size={16} />
              </Link>

              <Link
                href="/services"
                className="px-7 py-3.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white font-semibold text-sm transition flex items-center justify-center"
              >
                Explore Services & Rates
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3 sm:gap-6 mt-10 sm:mt-12 pt-8 border-t border-white/10 max-w-md mx-auto lg:mx-0">
              <div className="text-center lg:text-left">
                <h3 className="text-2xl sm:text-3xl font-black text-cyan-400">10K+</h3>
                <p className="text-slate-500 text-xs mt-0.5">Vehicles Served</p>
              </div>

              <div className="text-center lg:text-left">
                <h3 className="text-2xl sm:text-3xl font-black text-blue-400">25K+</h3>
                <p className="text-slate-500 text-xs mt-0.5">Repairs Done</p>
              </div>

              <div className="text-center lg:text-left">
                <h3 className="text-2xl sm:text-3xl font-black text-emerald-400">99.4%</h3>
                <p className="text-slate-500 text-xs mt-0.5">Satisfaction</p>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE / HIGHLIGHT CARD */}
          <div className="relative flex justify-center w-full">
            <div className="relative w-full max-w-lg">
              <div className="bg-slate-900/60 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-500/10 rounded-full blur-[60px] pointer-events-none" />

                {/* ICON EMBLEM */}
                <div className="flex justify-center mb-6 sm:mb-8">
                  <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-3xl bg-gradient-to-tr from-cyan-500/15 via-blue-600/15 to-transparent flex items-center justify-center border border-cyan-500/20 shadow-inner">
                    <Car size={64} className="text-cyan-400" />
                  </div>
                </div>

                {/* FEATURES LIST */}
                <div className="space-y-3">
                  <Link
                    href="/booking"
                    className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-cyan-500/30 transition group"
                  >
                    <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 group-hover:scale-110 transition">
                      <CalendarCheck size={18} />
                    </div>
                    <div className="text-left">
                      <p className="text-xs sm:text-sm font-bold text-white">Instant Online Booking</p>
                      <p className="text-[11px] text-slate-400">Choose your package & preferred bay schedule</p>
                    </div>
                  </Link>

                  <Link
                    href="/status"
                    className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-cyan-500/30 transition group"
                  >
                    <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 group-hover:scale-110 transition">
                      <Wrench size={18} />
                    </div>
                    <div className="text-left">
                      <p className="text-xs sm:text-sm font-bold text-white">Live Repair Tracking</p>
                      <p className="text-[11px] text-slate-400">Track diagnostic and service stages in real-time</p>
                    </div>
                  </Link>

                  <Link
                    href="/billing"
                    className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-cyan-500/30 transition group"
                  >
                    <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 group-hover:scale-110 transition">
                      <Gauge size={18} />
                    </div>
                    <div className="text-left">
                      <p className="text-xs sm:text-sm font-bold text-white">Digital Invoicing</p>
                      <p className="text-[11px] text-slate-400">Itemized bills & PDF downloadable receipts</p>
                    </div>
                  </Link>

                  <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-white/5 border border-white/5">
                    <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
                      <ShieldCheck size={18} />
                    </div>
                    <div className="text-left">
                      <p className="text-xs sm:text-sm font-bold text-white">Certified Genuine Guarantee</p>
                      <p className="text-[11px] text-slate-400">Official OEM replacement components & warranty</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= GALLERY ================= */}
      <Gallery />
    </>
  );
}