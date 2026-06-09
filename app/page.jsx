"use client";

import Link from "next/link";
import {
  ShieldCheck,
  Car,
  Wrench,
  CalendarCheck,
  Gauge,
} from "lucide-react";

import Gallery from "../components/Gallery";

export default function HomePage() {
  return (
    <>
      {/* ================= HERO SECTION ================= */}
      <section className="relative min-h-screen flex items-center overflow-hidden px-6">

        {/* Background */}
        <div className="absolute inset-0 bg-slate-950">

          {/* Glow Effects */}
          <div className="absolute top-[-150px] left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-cyan-500/20 blur-[180px] rounded-full" />
          <div className="absolute bottom-[-200px] right-1/3 w-[500px] h-[500px] bg-blue-600/10 blur-[180px] rounded-full" />

          {/* Grid */}
          <div className="absolute inset-0 opacity-[0.04] bg-[linear-gradient(to_right,#ffffff10_1px,transparent_1px),linear-gradient(to_bottom,#ffffff10_1px,transparent_1px)] bg-[size:40px_40px]" />
        </div>

        {/* CONTENT WRAPPER */}
        <div className="relative max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center z-10">

          {/* LEFT SIDE */}
          <div>

            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 mb-6">
              <ShieldCheck size={18} />
              Smart Vehicle Service Platform
            </div>

            {/* Title */}
            <h1 className="text-5xl md:text-7xl font-extrabold leading-tight text-white">
              Modern
              <br />
              <span className="text-white/90">Vehicle Service</span>
              <br />
              <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                Management
              </span>
            </h1>

            {/* Description */}
            <p className="mt-6 text-slate-400 text-lg max-w-xl leading-relaxed">
              A powerful platform to manage bookings, track repairs,
              monitor performance, and handle complete vehicle service operations
              with ease and efficiency.
            </p>

            {/* Buttons */}
            <div className="flex flex-wrap gap-4 mt-10">

              <Link
                href="/booking"
                className="px-8 py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold shadow-lg hover:scale-105 hover:shadow-cyan-500/20 transition-all duration-300"
              >
                Get Started
              </Link>

              <Link
                href="/services"
                className="px-8 py-4 rounded-xl border border-white/10 text-white hover:bg-white/10 transition-all duration-300"
              >
                Explore Services
              </Link>

            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 mt-14">

              <div className="text-center">
                <h3 className="text-3xl font-bold text-cyan-400">10K+</h3>
                <p className="text-slate-500 text-sm mt-1">Vehicles</p>
              </div>

              <div className="text-center">
                <h3 className="text-3xl font-bold text-cyan-400">25K+</h3>
                <p className="text-slate-500 text-sm mt-1">Services</p>
              </div>

              <div className="text-center">
                <h3 className="text-3xl font-bold text-cyan-400">99%</h3>
                <p className="text-slate-500 text-sm mt-1">Satisfaction</p>
              </div>

            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="relative flex justify-center">

            {/* Glow */}
            <div className="absolute w-[500px] h-[500px] bg-cyan-500/20 blur-[140px] rounded-full" />

            {/* CARD */}
            <div className="relative w-full max-w-xl">

              <div className="bg-slate-900/60 backdrop-blur-2xl border border-white/10 rounded-3xl p-10 shadow-2xl">

                {/* ICON */}
                <div className="flex justify-center mb-10">
                  <div className="w-44 h-44 rounded-full bg-cyan-500/10 flex items-center justify-center border border-cyan-500/20">
                    <Car size={120} className="text-cyan-400" />
                  </div>
                </div>

                {/* FEATURES */}
                <div className="space-y-4">

                  <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition">
                    <CalendarCheck className="text-cyan-400" />
                    <span>Seamless Online Booking System</span>
                  </div>

                  <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition">
                    <Wrench className="text-cyan-400" />
                    <span>Live Repair Tracking Updates</span>
                  </div>

                  <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition">
                    <Gauge className="text-cyan-400" />
                    <span>Advanced Performance Monitoring</span>
                  </div>

                  <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition">
                    <ShieldCheck className="text-cyan-400" />
                    <span>Secure Digital Vehicle Records</span>
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