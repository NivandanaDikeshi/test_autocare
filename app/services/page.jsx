"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Wrench, ArrowRight, Clock, DollarSign, Search, Sparkles } from "lucide-react";

export default function ServicesPage() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await fetch("/api/services/catalog");
        const data = await res.json();
        if (data.success) {
          setServices(data.services || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  const categories = ["All", ...Array.from(new Set(services.map((s) => s.category).filter(Boolean)))];

  const filteredServices = services.filter((s) => {
    const matchesCategory = category === "All" || s.category === category;
    const term = search.toLowerCase().trim();
    const matchesSearch =
      !term ||
      (s.title && s.title.toLowerCase().includes(term)) ||
      (s.description && s.description.toLowerCase().includes(term)) ||
      (s.category && s.category.toLowerCase().includes(term));

    return matchesCategory && matchesSearch;
  });

  return (
    <section className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-black text-white py-20 px-6">
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="text-center mb-16">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-xs font-semibold uppercase tracking-wider">
            <Wrench size={14} /> Certified Automotive Solutions
          </span>

          <h1 className="text-4xl md:text-6xl font-black mt-6 tracking-tight">
            Professional <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">Vehicle Care</span>
          </h1>

          <p className="max-w-3xl mx-auto text-base md:text-lg text-slate-400 mt-4 leading-relaxed">
            From precision preventative maintenance to advanced engine computer diagnostics, our certified technicians guarantee peak automotive safety, power, and efficiency.
          </p>
        </div>

        {/* SEARCH & DYNAMIC CATEGORY FILTER */}
        <div className="max-w-4xl mx-auto mb-14 space-y-4">
          <div className="relative">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search services by keyword, repair type, or category..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3.5 bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-2xl text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="flex flex-wrap gap-2 justify-center pt-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${
                  category === cat
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20"
                    : "bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 border border-white/5"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* SERVICE CARDS GRID */}
        {loading ? (
          <div className="py-24 text-center">
            <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-slate-400">Loading dynamic service packages from database...</p>
          </div>
        ) : filteredServices.length === 0 ? (
          <div className="bg-slate-900/40 border border-white/10 rounded-3xl p-16 text-center max-w-md mx-auto">
            <Wrench size={48} className="mx-auto text-slate-600 mb-4" />
            <h3 className="text-lg font-bold text-white">No Services Found</h3>
            <p className="text-slate-400 text-sm mt-1">Try resetting your search or category filter.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredServices.map((service) => (
              <div
                key={service._id}
                className="group bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden hover:border-cyan-500/40 hover:-translate-y-2 transition-all duration-300 flex flex-col justify-between shadow-xl"
              >
                <div>
                  {/* Image */}
                  <div className="relative h-56 w-full overflow-hidden bg-slate-800">
                    <Image
                      src={service.image || "/images/services/maintenance.jpg"}
                      alt={service.title}
                      fill
                      className="object-cover group-hover:scale-105 transition duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
                    <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-slate-950/80 backdrop-blur-md text-xs font-semibold text-cyan-400 border border-white/10">
                      {service.estimatedTime || "1-2 Hours"}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-7">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-cyan-400">
                        {service.category}
                      </span>
                    </div>

                    <h3 className="text-2xl font-bold text-white group-hover:text-cyan-300 transition mb-3">
                      {service.title}
                    </h3>

                    <p className="text-sm text-slate-400 leading-relaxed mb-6 line-clamp-3">
                      {service.description}
                    </p>

                    <div className="flex items-center justify-between text-xs text-slate-400 pt-4 border-t border-white/5">
                      <span>Standard Rate:</span>
                      <span className="text-sm font-bold text-emerald-400">
                        Rs. {(service.price || 0).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* ACTION FOOTER */}
                <div className="p-7 pt-0 space-y-2.5">
                  <Link
                    href={`/services/${service.slug || service._id}`}
                    className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white font-medium text-xs flex items-center justify-center gap-1.5 transition"
                  >
                    <span>View Full Details & Features</span>
                    <ArrowRight size={13} />
                  </Link>

                  <Link
                    href={`/booking?service=${encodeURIComponent(service.title)}`}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold text-xs flex items-center justify-center gap-2 hover:opacity-90 transition shadow-lg shadow-blue-500/20"
                  >
                    <span>Book This Service</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* WORKSHOP METRICS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20">
          <div className="bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6 text-center">
            <h2 className="text-3xl md:text-4xl font-black text-cyan-400">15,000+</h2>
            <p className="text-xs text-slate-400 mt-2 uppercase font-medium">Vehicles Serviced</p>
          </div>
          <div className="bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6 text-center">
            <h2 className="text-3xl md:text-4xl font-black text-cyan-400">50+</h2>
            <p className="text-xs text-slate-400 mt-2 uppercase font-medium">Expert Technicians</p>
          </div>
          <div className="bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6 text-center">
            <h2 className="text-3xl md:text-4xl font-black text-emerald-400">99.4%</h2>
            <p className="text-xs text-slate-400 mt-2 uppercase font-medium">Satisfaction Rate</p>
          </div>
          <div className="bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6 text-center">
            <h2 className="text-3xl md:text-4xl font-black text-blue-400">100%</h2>
            <p className="text-xs text-slate-400 mt-2 uppercase font-medium">Genuine Parts</p>
          </div>
        </div>

        {/* BOTTOM CTA BANNER */}
        <div className="mt-20 relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-700 p-10 md:p-14 text-center shadow-2xl">
          <div className="absolute inset-0 bg-[radial-gradient(#ffffff20_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />
          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
              Ready To Schedule Your Vehicle Service?
            </h2>
            <p className="text-white/90 text-sm md:text-base mt-4 leading-relaxed">
              Book your appointment in less than 2 minutes and track repair stages live from our online customer status tracker.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link
                href="/booking"
                className="px-8 py-3.5 rounded-xl bg-white text-slate-950 font-bold text-sm hover:scale-105 transition shadow-lg"
              >
                Book Appointment Now
              </Link>
              <Link
                href="/status"
                className="px-8 py-3.5 rounded-xl bg-black/30 text-white font-semibold text-sm border border-white/20 hover:bg-black/50 transition"
              >
                Track Existing Vehicle
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}