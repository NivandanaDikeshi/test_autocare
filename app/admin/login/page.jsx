"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Eye,
  EyeOff,
  ShieldCheck,
  Key,
  Mail,
  ArrowRight,
  Lock,
  UserCheck,
  AlertTriangle,
  Users,
} from "lucide-react";

function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTarget = searchParams.get("from") || "/admin";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isCustomerAccount, setIsCustomerAccount] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");
    setIsCustomerAccount(false);

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
        localStorage.setItem(
          "adminUser",
          JSON.stringify(data.user || { role: "admin" })
        );
        router.push(redirectTarget);
        return;
      }

      if (data.isCustomerAccount || response.status === 403) {
        setIsCustomerAccount(true);
        setError(
          data.message ||
            "Access denied: Customer accounts cannot log in through the Admin Panel. Please use the Customer Login portal."
        );
      } else {
        setError(data.message || "Invalid administrator credentials");
      }
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
    setIsCustomerAccount(false);
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-slate-950 overflow-hidden px-4 py-12 sm:py-16">
      {/* Background Ambience & Grid */}
      <div className="absolute top-1/4 -left-20 h-72 w-72 sm:h-96 sm:w-96 bg-blue-600/20 blur-[140px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 h-72 w-72 sm:h-96 sm:w-96 bg-cyan-500/20 blur-[140px] rounded-full pointer-events-none" />
      <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#ffffff10_1px,transparent_1px),linear-gradient(to_bottom,#ffffff10_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-md">
        {/* LOGO & HEADING */}
        <div className="text-center mb-6 sm:mb-8">
          <Link href="/" className="inline-block group">
            <div className="h-14 w-14 sm:h-16 sm:w-16 mx-auto flex items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 text-white shadow-xl shadow-blue-500/25 group-hover:scale-105 transition">
              <ShieldCheck size={30} />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-3.5 tracking-tight">
              AutoCare<span className="text-cyan-400">Pro</span>
            </h1>
          </Link>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 mt-2.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold">
            <Lock size={12} />
            <span>Staff & Admin Control Panel</span>
          </div>
          <p className="text-slate-400 text-xs mt-2 px-2">
            Restricted gateway for workshop managers and authorized personnel only
          </p>
        </div>

        {/* ADMIN LOGIN CARD */}
        <div className="backdrop-blur-2xl bg-slate-900/70 border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-cyan-400 to-indigo-600" />

          <div className="flex items-center justify-between mb-5 pb-4 border-b border-white/10">
            <div className="flex items-center gap-2 text-white font-semibold text-xs sm:text-sm">
              <UserCheck size={18} className="text-cyan-400" />
              <span>Admin Verification</span>
            </div>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-white/5 text-slate-400 border border-white/5">
              Admin Gateway
            </span>
          </div>

          {/* CUSTOMER ACCOUNT REDIRECT WARNING */}
          {isCustomerAccount ? (
            <div className="mb-5 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs space-y-3">
              <div className="flex items-start gap-2.5">
                <AlertTriangle size={18} className="text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-amber-300">Customer Account Detected</p>
                  <p className="text-[11px] text-amber-200/90 mt-1 leading-relaxed">
                    Customer accounts cannot access the administrative dashboard. Please sign in through the customer portal.
                  </p>
                </div>
              </div>
              <Link
                href="/login"
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition shadow"
              >
                <Users size={14} />
                <span>Go to Customer Login Portal →</span>
              </Link>
            </div>
          ) : error ? (
            <div className="mb-5 text-xs sm:text-sm text-rose-300 bg-rose-500/10 border border-rose-500/30 p-3.5 rounded-xl text-center leading-relaxed">
              {error}
            </div>
          ) : null}

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
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-950/80 border border-white/10 text-white text-xs sm:text-sm focus:border-cyan-500 focus:outline-none placeholder:text-slate-500 transition"
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
                  className="w-full pl-10 pr-12 py-3 rounded-xl bg-slate-950/80 border border-white/10 text-white text-xs sm:text-sm focus:border-cyan-500 focus:outline-none placeholder:text-slate-500 transition"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition p-1"
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
        </div>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
          <div className="w-10 h-10 border-4 border-cyan-500/30 border-t-cyan-400 rounded-full animate-spin" />
        </div>
      }
    >
      <AdminLoginForm />
    </Suspense>
  );
}
