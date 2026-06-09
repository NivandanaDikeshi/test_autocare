"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, ShieldCheck, Car } from "lucide-react";

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
      setError("Unable to connect to server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-slate-950 overflow-hidden">

      {/* Background Effects */}
      <div className="absolute top-0 left-0 h-96 w-96 bg-blue-600/20 blur-3xl rounded-full" />
      <div className="absolute bottom-0 right-0 h-96 w-96 bg-cyan-500/20 blur-3xl rounded-full" />

      <div className="relative z-10 w-full max-w-md px-6">

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="h-20 w-20 mx-auto flex items-center justify-center rounded-3xl bg-gradient-to-r from-blue-600 to-cyan-500">
            <Car className="text-white" size={36} />
          </div>

          <h1 className="text-4xl font-bold text-white mt-4">
            AutoCare
          </h1>
          <p className="text-slate-400">Admin Control Panel</p>
        </div>

        {/* Card */}
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8 shadow-xl">

          <div className="flex items-center justify-center gap-2 text-blue-400 mb-6">
            <ShieldCheck size={18} />
            <span>Secure Admin Login</span>
          </div>

          {error && (
            <div className="mb-4 text-sm text-red-400 bg-red-500/10 border border-red-500/30 p-3 rounded-xl">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">

            {/* Email */}
            <div>
              <label className="text-sm text-slate-300">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@autocare.com"
                className="w-full mt-2 px-4 py-3 rounded-xl bg-slate-900/60 border border-slate-700 text-white focus:border-blue-500 outline-none"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label className="text-sm text-slate-300">Password</label>

              <div className="relative mt-2">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="w-full px-4 py-3 rounded-xl bg-slate-900/60 border border-slate-700 text-white focus:border-blue-500 outline-none pr-12"
                  required
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Remember + Forgot */}
            <div className="flex justify-between text-sm text-slate-400">
              <label className="flex items-center gap-2">
                <input type="checkbox" />
                Remember me
              </label>

              <button
                type="button"
                className="text-blue-400 hover:text-blue-300"
              >
                Forgot password?
              </button>
            </div>

            {/* Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold hover:scale-[1.02] transition disabled:opacity-60"
            >
              {loading ? "Signing in..." : "Login to Dashboard"}
            </button>

          </form>
        </div>

        <p className="text-center text-slate-500 text-sm mt-6">
          © 2026 AutoCarePro
        </p>

      </div>
    </div>
  );
}