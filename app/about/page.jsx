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
    <section className="py-20 bg-gradient-to-b from-slate-950 to-slate-900 text-white min-h-screen">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-2 rounded-full bg-blue-500/10 text-blue-400 font-medium mb-4">
            About Us
          </span>

          <h1 className="text-4xl md:text-6xl font-extrabold mb-6">
            Driving the Future of
            <span className="text-blue-500"> Vehicle Care</span>
          </h1>

          <p className="max-w-3xl mx-auto text-lg md:text-xl text-slate-300 leading-relaxed">
            AutoCare Pro is a next-generation vehicle service management
            platform designed to simplify maintenance, improve transparency,
            and deliver exceptional customer experiences.
          </p>
        </div>

        {/* Statistics */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          <div className="bg-slate-800/50 backdrop-blur-sm p-8 rounded-2xl border border-slate-700 text-center hover:border-blue-500 transition">
            <h2 className="text-4xl font-bold text-blue-500">10K+</h2>
            <p className="text-slate-300 mt-2">
              Happy Customers
            </p>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm p-8 rounded-2xl border border-slate-700 text-center hover:border-blue-500 transition">
            <h2 className="text-4xl font-bold text-blue-500">25K+</h2>
            <p className="text-slate-300 mt-2">
              Services Completed
            </p>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm p-8 rounded-2xl border border-slate-700 text-center hover:border-blue-500 transition">
            <h2 className="text-4xl font-bold text-blue-500">99%</h2>
            <p className="text-slate-300 mt-2">
              Customer Satisfaction
            </p>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-slate-800/40 border border-slate-700 rounded-2xl p-8 hover:border-blue-500 transition-all duration-300 hover:-translate-y-2"
            >
              <div className="w-16 h-16 flex items-center justify-center rounded-xl bg-blue-500/10 text-blue-500 text-3xl mb-6">
                {feature.icon}
              </div>

              <h3 className="text-2xl font-bold mb-4">
                {feature.title}
              </h3>

              <p className="text-slate-400 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Mission */}
        <div className="mt-24 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-3xl p-10 md:p-16 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Our Mission
          </h2>

          <p className="max-w-4xl mx-auto text-lg md:text-xl text-white/90 leading-relaxed">
            To revolutionize vehicle maintenance through smart technology,
            transparent service management, and a seamless customer experience
            that keeps every vehicle running at its best.
          </p>
        </div>
      </div>
    </section>
  );
}