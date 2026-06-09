"use client";

import { useState } from "react";

export default function ContactPage() {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (data.success) {
        setStatus({ type: "success", msg: "Message sent successfully!" });

        setForm({
          fullName: "",
          email: "",
          phone: "",
          message: "",
        });
      } else {
        setStatus({
          type: "error",
          msg: data.message || "Failed to send message",
        });
      }
    } catch (error) {
      setStatus({ type: "error", msg: "Server error. Try again later." });
    }

    setLoading(false);
  };

  return (
    <section className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-black text-white py-20">
      <div className="max-w-7xl mx-auto px-6">

        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-2 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
            Contact Us
          </span>

          <h1 className="text-5xl md:text-6xl font-black mt-6 mb-6">
            We're Here To <span className="text-blue-500">Help</span>
          </h1>

          <p className="max-w-3xl mx-auto text-lg text-slate-400">
            Have questions about our services, bookings, or vehicle maintenance?
            Reach out to our team and we’ll respond quickly.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-10">

          {/* FORM */}
          <div className="bg-slate-900/70 backdrop-blur-xl border border-slate-800 rounded-3xl p-8">
            <h2 className="text-3xl font-bold mb-8">
              Send Us a Message
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">

              <input
                type="text"
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                placeholder="Full Name"
                className="w-full p-4 rounded-xl bg-slate-800 border border-slate-700 focus:border-blue-500 outline-none"
              />

              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Email Address"
                className="w-full p-4 rounded-xl bg-slate-800 border border-slate-700 focus:border-blue-500 outline-none"
              />

              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="Phone Number"
                className="w-full p-4 rounded-xl bg-slate-800 border border-slate-700 focus:border-blue-500 outline-none"
              />

              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                rows="5"
                placeholder="Write your message..."
                className="w-full p-4 rounded-xl bg-slate-800 border border-slate-700 focus:border-blue-500 outline-none resize-none"
              />

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 py-4 rounded-xl text-lg font-semibold transition"
              >
                {loading ? "Sending..." : "Send Message"}
              </button>

              {/* STATUS MESSAGE */}
              {status && (
                <p
                  className={`text-center mt-3 ${
                    status.type === "success"
                      ? "text-green-400"
                      : "text-red-400"
                  }`}
                >
                  {status.msg}
                </p>
              )}
            </form>
          </div>

          {/* INFO SIDE (unchanged but cleaner) */}
          <div className="space-y-6">

            <div className="bg-slate-900/70 backdrop-blur-xl border border-slate-800 rounded-3xl p-8">
              <h2 className="text-3xl font-bold mb-6">
                Contact Information
              </h2>

              <div className="space-y-6 text-slate-300">

                <p>📍 123 AutoCare Street, Colombo, Sri Lanka</p>
                <p>📞 +94 77 123 4567</p>
                <p>✉️ support@autocarepro.com</p>
                <p>🕒 Mon - Sat: 8:00 AM - 6:00 PM</p>

              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-600 to-cyan-500 rounded-3xl p-8">
              <h3 className="text-2xl font-bold mb-4">
                Need Immediate Help?
              </h3>

              <p className="text-white/90 mb-4">
                Call our support team for urgent vehicle assistance.
              </p>

              <button className="bg-white text-blue-600 px-6 py-3 rounded-xl font-semibold">
                Call Support
              </button>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}