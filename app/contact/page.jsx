"use client";

import { useState } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
  ShieldCheck,
} from "lucide-react";

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
        setStatus({
          type: "success",
          msg: "Your message was sent successfully! Our service manager will get back to you shortly.",
        });

        setForm({
          fullName: "",
          email: "",
          phone: "",
          message: "",
        });
      } else {
        setStatus({
          type: "error",
          msg: data.message || "Failed to send message. Please verify fields.",
        });
      }
    } catch (error) {
      setStatus({
        type: "error",
        msg: "Server connection error. Please try calling our workshop directly.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-black text-white py-20 px-6">
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="text-center mb-16">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-xs font-semibold uppercase tracking-wider">
            <MessageSquare size={14} /> Get In Touch
          </span>

          <h1 className="text-4xl md:text-6xl font-black mt-6 tracking-tight">
            We're Here To <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">Help You</span>
          </h1>

          <p className="max-w-2xl mx-auto text-base text-slate-400 mt-4 leading-relaxed">
            Have questions regarding diagnostic assessments, parts availability, or booking inquiries? Drop us a note or call our workshop line.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* CONTACT FORM */}
          <div className="bg-slate-900/60 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 md:p-10 shadow-2xl">
            <h2 className="text-2xl font-bold text-white mb-2">Send a Direct Message</h2>
            <p className="text-xs text-slate-400 mb-8">
              Fill out this form and our support dispatch team will respond promptly.
            </p>

            {status && (
              <div
                className={`mb-6 p-4 rounded-2xl border text-sm flex items-start gap-3 ${
                  status.type === "success"
                    ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
                    : "bg-rose-500/10 border-rose-500/30 text-rose-300"
                }`}
              >
                {status.type === "success" ? (
                  <CheckCircle2 size={20} className="shrink-0 mt-0.5 text-emerald-400" />
                ) : (
                  <AlertCircle size={20} className="shrink-0 mt-0.5 text-rose-400" />
                )}
                <span>{status.msg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="text-xs text-slate-300 font-medium">Your Full Name *</label>
                <input
                  type="text"
                  name="fullName"
                  value={form.fullName}
                  onChange={handleChange}
                  placeholder="Kasun Perera"
                  required
                  className="w-full mt-1.5 p-3.5 rounded-xl bg-slate-950 border border-white/10 text-white text-sm outline-none focus:border-cyan-500 transition"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-slate-300 font-medium">Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="kasun@example.com"
                    required
                    className="w-full mt-1.5 p-3.5 rounded-xl bg-slate-950 border border-white/10 text-white text-sm outline-none focus:border-cyan-500 transition"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-300 font-medium">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="+94 77 123 4567"
                    className="w-full mt-1.5 p-3.5 rounded-xl bg-slate-950 border border-white/10 text-white text-sm outline-none focus:border-cyan-500 transition"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-300 font-medium">Message / Inquiry *</label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  rows={4}
                  required
                  placeholder="Describe your question, vehicle symptom, or service inquiry..."
                  className="w-full mt-1.5 p-3.5 rounded-xl bg-slate-950 border border-white/10 text-white text-sm outline-none focus:border-cyan-500 transition resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-gradient-to-r from-blue-600 to-cyan-500 hover:opacity-95 text-white font-bold text-sm rounded-xl transition shadow-xl shadow-blue-500/25 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <Send size={16} />
                <span>{loading ? "Transmitting Message..." : "Send Message"}</span>
              </button>
            </form>
          </div>

          {/* CONTACT INFO CARD */}
          <div className="space-y-6">
            <div className="bg-slate-900/60 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 shadow-2xl">
              <h2 className="text-2xl font-bold text-white mb-6">Workshop Center</h2>

              <div className="space-y-6 text-sm text-slate-300">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center shrink-0">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">Workshop Location</h4>
                    <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                      123 AutoCare Street, Colombo 03, Sri Lanka
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
                    <Phone size={20} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">Direct Phone Lines</h4>
                    <p className="text-xs text-slate-400 mt-0.5">+94 77 123 4567 / +94 11 234 5678</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center shrink-0">
                    <Mail size={20} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">Email Address</h4>
                    <p className="text-xs text-slate-400 mt-0.5">support@autocarepro.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center shrink-0">
                    <Clock size={20} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">Operational Hours</h4>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Monday - Saturday: 8:00 AM – 6:30 PM (Closed Sundays)
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* EMERGENCY BANNER */}
            <div className="rounded-3xl p-8 bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-700 text-white shadow-2xl relative overflow-hidden">
              <div className="relative z-10">
                <h3 className="text-xl font-extrabold mb-2">Need Immediate Roadside Assistance?</h3>
                <p className="text-xs text-white/90 leading-relaxed mb-5">
                  Call our 24/7 emergency dispatch helpline for urgent vehicle recovery and breakdown response.
                </p>
                <a
                  href="tel:+94771234567"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white text-slate-950 text-xs font-bold hover:scale-105 transition shadow-lg"
                >
                  <Phone size={14} />
                  <span>Call Emergency Support</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}