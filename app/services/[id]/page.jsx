"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  Wrench,
  Clock,
  DollarSign,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Calendar,
  ArrowLeft,
  Award,
  Sparkles,
  PhoneCall,
} from "lucide-react";

export default function ServiceDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id;

  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;

    const fetchService = async () => {
      try {
        const res = await fetch(`/api/services/catalog/${id}`);
        const data = await res.json();
        if (data.success && data.service) {
          setService(data.service);
        } else {
          setError(data.message || "Service details could not be found.");
        }
      } catch (err) {
        console.error(err);
        setError("Network error fetching service details.");
      } finally {
        setLoading(false);
      }
    };

    fetchService();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-14 h-14 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-400">Loading service specifications...</p>
        </div>
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-6">
        <div className="max-w-md w-full text-center bg-slate-900 border border-white/10 rounded-3xl p-10 shadow-2xl">
          <Wrench size={48} className="mx-auto text-slate-600 mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Service Not Found</h2>
          <p className="text-slate-400 text-sm mb-6">
            The requested vehicle service specification could not be loaded.
          </p>
          <Link
            href="/services"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition"
          >
            <ArrowLeft size={16} />
            <span>Return to Services Directory</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-black text-white py-16 px-6">
      <div className="max-w-6xl mx-auto">
        {/* BREADCRUMB */}
        <div className="flex items-center gap-2 text-xs text-slate-400 mb-8">
          <Link href="/" className="hover:text-white transition">
            Home
          </Link>
          <span>/</span>
          <Link href="/services" className="hover:text-white transition">
            Services
          </Link>
          <span>/</span>
          <span className="text-cyan-400 font-medium">{service.title}</span>
        </div>

        {/* HERO TITLE SECTION */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-12">
          <div>
            <div className="flex flex-wrap items-center gap-2.5 mb-3">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                {service.category}
              </span>
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/5 text-slate-300 border border-white/10">
                <Clock size={12} className="text-cyan-400" />
                <span>Est. {service.estimatedTime || "1-2 Hours"}</span>
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white">
              {service.title}
            </h1>
          </div>

          {/* PRICING & BOOKING ACTION */}
          <div className="p-5 sm:p-6 rounded-3xl bg-slate-900/80 backdrop-blur-xl border border-white/10 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 sm:gap-6 shadow-xl shrink-0">
            <div>
              <p className="text-xs text-slate-400 uppercase font-medium">Standard Pricing</p>
              <h3 className="text-2xl sm:text-3xl font-black text-emerald-400 mt-0.5">
                Rs. {(service.price || 0).toLocaleString()}
              </h3>
            </div>

            <Link
              href={`/booking?service=${encodeURIComponent(service.title)}`}
              className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:opacity-90 text-white font-bold text-sm flex items-center justify-center gap-2 transition shadow-lg shadow-blue-500/25"
            >
              <Calendar size={16} />
              <span>Book Appointment</span>
            </Link>
          </div>
        </div>

        {/* TWO COLUMN DETAILS GRID */}
        <div className="grid lg:grid-cols-3 gap-10">
          {/* LEFT: IMAGE & DESCRIPTION (2 COLS) */}
          <div className="lg:col-span-2 space-y-8">
            {/* FEATURE IMAGE */}
            <div className="relative h-96 w-full rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-slate-900">
              <Image
                src={service.image || "/images/services/maintenance.jpg"}
                alt={service.title}
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />
              <div className="absolute bottom-6 left-6 flex items-center gap-2 text-xs font-semibold bg-slate-950/80 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10 text-cyan-300">
                <Sparkles size={14} className="text-cyan-400" />
                <span>Certified Workshop Procedure</span>
              </div>
            </div>

            {/* OVERVIEW CONTENT */}
            <div className="bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-3xl p-8 space-y-6 shadow-xl">
              <div>
                <h3 className="text-xl font-bold text-white mb-3">Service Overview</h3>
                <p className="text-slate-300 leading-relaxed text-sm md:text-base">
                  {service.longDescription || service.description}
                </p>
              </div>

              {/* INCLUDED CHECKLIST */}
              {service.features && service.features.length > 0 && (
                <div className="pt-6 border-t border-white/10">
                  <h4 className="text-base font-bold text-white mb-4 flex items-center gap-2">
                    <CheckCircle2 size={18} className="text-emerald-400" />
                    <span>What's Included in This Package</span>
                  </h4>

                  <div className="grid sm:grid-cols-2 gap-3">
                    {service.features.map((feature, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-950/70 border border-white/5 text-xs md:text-sm text-slate-200"
                      >
                        <CheckCircle2
                          size={16}
                          className="text-cyan-400 shrink-0 mt-0.5"
                        />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT: WARRANTY, BOOKING CARD, ASSISTANCE (1 COL) */}
          <div className="space-y-6">
            {/* BOOKING CALLOUT CARD */}
            <div className="bg-gradient-to-br from-blue-900/40 via-slate-900 to-slate-950 border border-blue-500/30 rounded-3xl p-7 shadow-2xl text-center">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center mx-auto mb-4 border border-cyan-500/20">
                <Calendar size={22} />
              </div>

              <h3 className="text-xl font-bold text-white mb-2">Schedule This Service</h3>
              <p className="text-xs text-slate-400 mb-6 leading-relaxed">
                Choose your preferred date and time. No upfront payment required; pay after service is completed at the bay.
              </p>

              <Link
                href={`/booking?service=${encodeURIComponent(service.title)}`}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold text-sm flex items-center justify-center gap-2 hover:opacity-95 transition shadow-lg shadow-blue-500/25"
              >
                <span>Book Online Now</span>
                <ArrowRight size={16} />
              </Link>
            </div>

            {/* QUALITY GUARANTEE BADGES */}
            <div className="bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-3xl p-7 space-y-4 shadow-xl">
              <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-2">
                Our Workshop Promise
              </h4>

              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
                  <ShieldCheck size={18} />
                </div>
                <div>
                  <h5 className="text-xs font-bold text-white">Genuine OEM Parts</h5>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    We use exclusively authentic manufacturer components and approved lubricants.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center shrink-0">
                  <Award size={18} />
                </div>
                <div>
                  <h5 className="text-xs font-bold text-white">Certified Technicians</h5>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Service completed by ASE-certified master mechanics with digital diagnostics.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center shrink-0">
                  <Clock size={18} />
                </div>
                <div>
                  <h5 className="text-xs font-bold text-white">30-Day Service Warranty</h5>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Complete peace of mind with our 30-day / 1,000 km warranty coverage.
                  </p>
                </div>
              </div>
            </div>

            {/* DIRECT CALL HELP */}
            <div className="bg-slate-900/40 border border-white/10 rounded-3xl p-6 text-center">
              <p className="text-xs text-slate-400 mb-2">Have specific vehicle questions?</p>
              <a
                href="tel:+94771234567"
                className="inline-flex items-center gap-2 text-sm font-bold text-cyan-400 hover:text-cyan-300 transition"
              >
                <PhoneCall size={14} />
                <span>Call Hotline: +94 77 123 4567</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
