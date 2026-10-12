"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, ShieldCheck, Car, Key, Mail, ArrowRight } from "lucide-react";

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
        router.push("/admin");
        return;
      }

      setError(data.message || "Invalid email or password");
    } catch (err) {
      console.error("Login Error:", err);
      setError("Unable to connect to server. Please try again.");
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
      {/* Background Lighting Effects */}
      <div className="absolute top-1/4 -left-20 h-96 w-96 bg-blue-600/20 blur-[140px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 h-96 w-96 bg-cyan-500/20 blur-[140px] rounded-full pointer-events-none" />
      <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#ffffff10_1px,transparent_1px),linear-gradient(to_bottom,#ffffff10_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-md">
        {/* LOGO */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block group">
            <div className="h-16 w-16 mx-auto flex items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-400 text-white shadow-xl shadow-blue-500/25 group-hover:scale-105 transition">
              <Car size={32} />
            </div>
            <h1 className="text-3xl font-extrabold text-white mt-4 tracking-tight">
              AutoCare<span className="text-cyan-400">Pro</span>
            </h1>
          </Link>
          <p className="text-slate-400 text-sm mt-1">Administrative Gateway & Management Portal</p>
        </div>

        {/* LOGIN CARD */}
        <div className="backdrop-blur-2xl bg-slate-900/60 border border-white/10 rounded-3xl p-8 shadow-2xl">
          <div className="flex items-center justify-center gap-2 text-cyan-400 mb-6 font-medium text-sm">
            <ShieldCheck size={18} />
            <span>Secure Admin Authentication</span>
          </div>

          {error && (
            <div className="mb-5 text-sm text-rose-300 bg-rose-500/10 border border-rose-500/30 p-3.5 rounded-xl text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            {/* EMAIL */}
            <div>
              <label className="text-xs font-semibold text-slate-300">Admin Email</label>
              <div className="relative mt-1.5">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@autocare.com"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-950/80 border border-white/10 text-white text-sm focus:border-cyan-500 focus:outline-none placeholder:text-slate-500"
                  required
                />
              </div>
            </div>

            {/* PASSWORD */}
            <div>
              <label className="text-xs font-semibold text-slate-300">Password</label>
              <div className="relative mt-1.5">
                <Key size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-12 py-3 rounded-xl bg-slate-950/80 border border-white/10 text-white text-sm focus:border-cyan-500 focus:outline-none placeholder:text-slate-500"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* SUBMIT BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold text-sm hover:opacity-95 transition shadow-lg shadow-blue-500/25 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <span>{loading ? "Authenticating..." : "Access Admin Panel"}</span>
              <ArrowRight size={16} />
            </button>
          </form>

          {/* DEMO AUTOFILL PROMPT */}
          <div className="mt-6 pt-5 border-t border-white/10 text-center">
            <p className="text-xs text-slate-400 mb-2">Need quick testing access?</p>
            <button
              type="button"
              onClick={autofillDemo}
              className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-cyan-400 transition"
            >
              Autofill Demo: admin@autocare.com / 123456
            </button>
          </div>
        </div>

        {/* BACK TO SITE LINK */}
        <div className="text-center mt-6">
          <Link
            href="/"
            className="text-xs text-slate-400 hover:text-white transition inline-flex items-center gap-1.5"
          >
            <span>← Back to Customer Website</span>
          </Link>
        </div>
      </div>
    </div>
  );
}