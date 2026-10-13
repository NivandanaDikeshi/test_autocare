"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Eye,
  EyeOff,
  ShieldCheck,
  Car,
  Key,
  Mail,
  ArrowRight,
  Lock,
  UserCheck,
} from "lucide-react";

export default function AdminLogin() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        localStorage.setItem("adminAuth", "true");
        localStorage.setItem("adminUser", JSON.stringify(data.user || { role: "admin" }));
        router.push("/admin");
        return;
      }

      setError(data.message || "Invalid administrator credentials");
    } catch (err) {
      console.error("Admin Login Error:", err);
      setError("Unable to connect to authentication server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const autofillDemo = () => {
    setEmail("admin@autocare.com");
    setPassword("123456");
    setError("");
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-slate-950 overflow-hidden px-4">
      {/* Background Ambience & Grid */}
      <div className="absolute top-1/4 -left-20 h-96 w-96 bg-blue-600/20 blur-[140px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 h-96 w-96 bg-cyan-500/20 blur-[140px] rounded-full pointer-events-none" />
      <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#ffffff10_1px,transparent_1px),linear-gradient(to_bottom,#ffffff10_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-md">
        {/* LOGO & HEADING */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block group">
            <div className="h-16 w-16 mx-auto flex items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 text-white shadow-xl shadow-blue-500/25 group-hover:scale-105 transition">
              <ShieldCheck size={32} />
            </div>
            <h1 className="text-3xl font-extrabold text-white mt-4 tracking-tight">
              AutoCare<span className="text-cyan-400">Pro</span>
            </h1>
          </Link>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 mt-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold">
            <Lock size={12} />
            <span>Staff & Administrative Gateway</span>
          </div>
          <p className="text-slate-400 text-xs mt-2">
            Restricted portal for workshop managers and authorized personnel
          </p>
        </div>

        {/* ADMIN LOGIN CARD */}
        <div className="backdrop-blur-2xl bg-slate-900/70 border border-white/10 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-cyan-400 to-indigo-600" />

          <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
            <div className="flex items-center gap-2 text-white font-semibold text-sm">
              <UserCheck size={18} className="text-cyan-400" />
              <span>Admin Verification</span>
            </div>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-white/5 text-slate-400 border border-white/5">
              v2.4 Sec
            </span>
          </div>

          {error && (
            <div className="mb-5 text-xs text-rose-300 bg-rose-500/10 border border-rose-500/30 p-3.5 rounded-xl text-center leading-relaxed">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            {/* ADMIN EMAIL */}
            <div>
              <label className="text-xs font-semibold text-slate-300">
                Administrator Email
              </label>
              <div className="relative mt-1.5">
                <Mail
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@autocare.com"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-950/80 border border-white/10 text-white text-sm focus:border-cyan-500 focus:outline-none placeholder:text-slate-500 transition"
                  required
                />
              </div>
            </div>

            {/* ADMIN PASSWORD */}
            <div>
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-300">
                  Master Password
                </label>
              </div>
              <div className="relative mt-1.5">
                <Key
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-12 py-3 rounded-xl bg-slate-950/80 border border-white/10 text-white text-sm focus:border-cyan-500 focus:outline-none placeholder:text-slate-500 transition"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* SUBMIT BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 text-white font-semibold text-sm hover:opacity-95 transition shadow-lg shadow-blue-500/25 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <span>{loading ? "Verifying Credentials..." : "Access Control Panel"}</span>
              <ArrowRight size={16} />
            </button>
          </form>

          {/* DEMO AUTOFILL PROMPT */}
          <div className="mt-6 pt-5 border-t border-white/10 text-center">
            <p className="text-xs text-slate-400 mb-2">Need quick testing credentials?</p>
            <button
              type="button"
              onClick={autofillDemo}
              className="px-3.5 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-cyan-400 transition hover:border-cyan-500/40"
            >
              Autofill Admin Demo: admin@autocare.com / 123456
            </button>
          </div>
        </div>

        {/* BOTTOM NAVIGATION LINKS */}
        <div className="flex items-center justify-between text-xs text-slate-400 mt-6 px-2">
          <Link
            href="/"
            className="hover:text-white transition inline-flex items-center gap-1.5"
          >
            <span>← Customer Website</span>
          </Link>
          <Link
            href="/login"
            className="text-cyan-400 hover:text-cyan-300 font-medium transition inline-flex items-center gap-1"
          >
            <span>Customer Login Portal →</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
