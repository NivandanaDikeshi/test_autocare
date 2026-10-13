"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Eye,
  EyeOff,
  Car,
  Key,
  Mail,
  ArrowRight,
  Shield,
  Sparkles,
  AlertTriangle,
  Lock,
} from "lucide-react";

function CustomerLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTarget = searchParams.get("from") || "/profile";

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isAdminAccount, setIsAdminAccount] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");
    setIsAdminAccount(false);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          emailOrPhone: identifier,
          password,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        localStorage.setItem("userAuth", "true");
        localStorage.setItem("userData", JSON.stringify(data.user));
        // Dispatch event for Navbar sync
        window.dispatchEvent(new Event("authChange"));
        router.push(redirectTarget);
        return;
      }

      if (data.isAdminAccount || response.status === 403) {
        setIsAdminAccount(true);
        setError(
          data.message ||
            "Admin accounts cannot sign in through the Customer Portal. Administrators must log in via the Admin Panel."
        );
      } else {
        setError(data.message || "Invalid email/phone or password.");
      }
    } catch (err) {
      console.error("Login Error:", err);
      setError("Unable to connect to server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const autofillDemoCustomer = () => {
    setIdentifier("customer@autocare.com");
    setPassword("123456");
    setError("");
    setIsAdminAccount(false);
  };

  return (
    <div className="relative min-h-[90vh] flex items-center justify-center bg-slate-950 overflow-hidden px-4 py-12 sm:py-16">
      {/* Background Lighting Effects */}
      <div className="absolute top-1/4 -left-20 h-72 w-72 sm:h-96 sm:w-96 bg-blue-600/15 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 h-72 w-72 sm:h-96 sm:w-96 bg-cyan-500/15 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#ffffff10_1px,transparent_1px),linear-gradient(to_bottom,#ffffff10_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-md">
        {/* LOGO */}
        <div className="text-center mb-6 sm:mb-8">
          <Link href="/" className="inline-block group">
            <div className="h-14 w-14 sm:h-16 sm:w-16 mx-auto flex items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-400 text-white shadow-xl shadow-blue-500/25 group-hover:scale-105 transition">
              <Car size={30} />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-3.5 tracking-tight">
              AutoCare<span className="text-cyan-400">Pro</span>
            </h1>
          </Link>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            Customer Portal & Vehicle Management Hub
          </p>
        </div>

        {/* LOGIN CARD */}
        <div className="backdrop-blur-2xl bg-slate-900/70 border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
          <div className="flex items-center justify-between pb-4 mb-5 border-b border-white/10">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white">Customer Sign In</h2>
              <p className="text-[11px] sm:text-xs text-slate-400 mt-0.5">
                For vehicle owners, garage & repair tracking
              </p>
            </div>
            <span className="flex items-center gap-1 text-[11px] sm:text-xs text-cyan-400 bg-cyan-400/10 px-2.5 py-1 rounded-full border border-cyan-400/20 font-medium">
              <Sparkles size={12} />
              <span>User Only</span>
            </span>
          </div>

          {/* ADMIN ACCOUNT REDIRECT WARNING */}
          {isAdminAccount ? (
            <div className="mb-5 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs space-y-3">
              <div className="flex items-start gap-2.5">
                <AlertTriangle size={18} className="text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-amber-300">Administrator Account Detected</p>
                  <p className="text-[11px] text-amber-200/90 mt-1 leading-relaxed">
                    Administrators cannot log in via the customer portal. Please sign in through the Admin Panel.
                  </p>
                </div>
              </div>
              <Link
                href="/admin/login"
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition shadow"
              >
                <Shield size={14} />
                <span>Go to Admin Panel Login →</span>
              </Link>
            </div>
          ) : error ? (
            <div className="mb-5 text-xs sm:text-sm text-rose-300 bg-rose-500/10 border border-rose-500/30 p-3.5 rounded-xl text-center leading-relaxed">
              {error}
            </div>
          ) : null}

          <form onSubmit={handleLogin} className="space-y-4">
            {/* EMAIL OR PHONE */}
            <div>
              <label className="text-xs font-semibold text-slate-300">
                Email Address or Phone Number
              </label>
              <div className="relative mt-1.5">
                <Mail
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="e.g. customer@autocare.com or 0770254687"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-950/80 border border-white/10 text-white text-xs sm:text-sm focus:border-cyan-500 focus:outline-none placeholder:text-slate-500 transition"
                  required
                />
              </div>
            </div>

            {/* PASSWORD */}
            <div>
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-300">
                  Password
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
              className="w-full mt-2 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold text-sm hover:opacity-95 transition shadow-lg shadow-blue-500/25 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <span>{loading ? "Signing In..." : "Sign In to Customer Account"}</span>
              <ArrowRight size={16} />
            </button>
          </form>

          {/* SIGN UP REDIRECT */}
          <div className="mt-5 text-center text-xs text-slate-400">
            <span>New customer? </span>
            <Link
              href="/register"
              className="text-cyan-400 hover:text-cyan-300 font-semibold underline underline-offset-4 ml-1"
            >
              Create an account now
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CustomerLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[90vh] flex items-center justify-center bg-slate-950 text-white">
          <div className="w-10 h-10 border-4 border-cyan-500/30 border-t-cyan-400 rounded-full animate-spin" />
        </div>
      }
    >
      <CustomerLoginForm />
    </Suspense>
  );
}