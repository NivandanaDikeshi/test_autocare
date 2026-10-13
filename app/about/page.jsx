"use client";

import {
  FaCalendarCheck,
  FaMapMarkedAlt,
  FaFileAlt,
} from "react-icons/fa";

export default function About() {
  const features = [
    {
      icon: <FaCalendarCheck />,
      title: "Easy Service Booking",
      description:
        "Book vehicle services online within minutes with a simple and intuitive interface.",
    },
    {
      icon: <FaMapMarkedAlt />,
      title: "Real-Time Tracking",
      description:
        "Monitor repair progress and service status in real time from any device.",
    },
    {
      icon: <FaFileAlt />,
      title: "Maintenance Records",
      description:
        "Keep all vehicle service history organized and accessible whenever needed.",
    },
  ];

  return (
    <section className="py-12 sm:py-20 bg-gradient-to-b from-slate-950 to-slate-900 text-white min-h-screen px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-blue-500/10 text-blue-400 font-semibold text-xs mb-4">
            About Us
          </span>

          <h1 className="text-3xl sm:text-4xl md:text-6xl font-extrabold mb-5 tracking-tight">
            Driving the Future of
            <span className="text-cyan-400"> Vehicle Care</span>
          </h1>

          <p className="max-w-3xl mx-auto text-sm sm:text-base md:text-lg text-slate-300 leading-relaxed">
            AutoCare Pro is a next-generation vehicle service management
            platform designed to simplify maintenance, improve transparency,
            and deliver exceptional customer experiences.
          </p>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-8 mb-14 sm:mb-20">
          <div className="bg-slate-800/40 backdrop-blur-sm p-6 sm:p-8 rounded-3xl border border-slate-700/60 text-center hover:border-cyan-500 transition">
            <h2 className="text-3xl sm:text-4xl font-black text-cyan-400">10K+</h2>
            <p className="text-slate-300 text-xs sm:text-sm mt-1.5">
              Happy Customers
            </p>
          </div>

          <div className="bg-slate-800/40 backdrop-blur-sm p-6 sm:p-8 rounded-3xl border border-slate-700/60 text-center hover:border-cyan-500 transition">
            <h2 className="text-3xl sm:text-4xl font-black text-blue-400">25K+</h2>
            <p className="text-slate-300 text-xs sm:text-sm mt-1.5">
              Services Completed
            </p>
          </div>

          <div className="bg-slate-800/40 backdrop-blur-sm p-6 sm:p-8 rounded-3xl border border-slate-700/60 text-center hover:border-cyan-500 transition">
            <h2 className="text-3xl sm:text-4xl font-black text-emerald-400">99.4%</h2>
            <p className="text-slate-300 text-xs sm:text-sm mt-1.5">
              Customer Satisfaction
            </p>
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-slate-800/30 border border-slate-700/60 rounded-3xl p-6 sm:p-8 hover:border-cyan-500/40 transition-all duration-300 hover:-translate-y-1"
            >
              <div className="w-14 h-14 flex items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-400 text-2xl mb-5">
                {feature.icon}
              </div>

              <h3 className="text-xl font-bold mb-3 text-white">
                {feature.title}
              </h3>

              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Mission */}
        <div className="mt-16 sm:mt-24 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-3xl p-7 sm:p-12 md:p-16 text-center shadow-2xl">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
            Our Mission
          </h2>

          <p className="max-w-4xl mx-auto text-sm sm:text-base md:text-xl text-white/95 leading-relaxed">
            To revolutionize vehicle maintenance through smart technology,
            transparent service management, and a seamless customer experience
            that keeps every vehicle running at its best.
          </p>
        </div>
      </div>
    </section>
  );
}