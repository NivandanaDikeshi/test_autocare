"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Eye,
  EyeOff,
  Car,
  Key,
  Mail,
  User,
  Phone,
  MapPin,
  ArrowRight,
  Shield,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

export default function CustomerRegister() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    address: "",
    vehicleNumber: "",
    vehicleModel: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showVehicleFields, setShowVehicleFields] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match. Please re-enter.");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        localStorage.setItem("userAuth", "true");
        localStorage.setItem("userData", JSON.stringify(data.user));
        window.dispatchEvent(new Event("authChange"));
        router.push("/profile");
        return;
      }

      setError(data.message || "Failed to create account. Please check your details.");
    } catch (err) {
      console.error("Register Error:", err);
      setError("Unable to connect to server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-slate-950 overflow-hidden px-4 py-10 sm:py-16">
      {/* Background Lighting Effects */}
      <div className="absolute top-1/4 -left-20 h-72 w-72 sm:h-96 sm:w-96 bg-blue-600/15 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 h-72 w-72 sm:h-96 sm:w-96 bg-cyan-500/15 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#ffffff10_1px,transparent_1px),linear-gradient(to_bottom,#ffffff10_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-xl">
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
            Customer Registration & Vehicle Care Hub
          </p>
        </div>

        {/* REGISTRATION CARD */}
        <div className="backdrop-blur-2xl bg-slate-900/60 border border-white/10 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
          <div className="flex items-center justify-between pb-4 mb-5 border-b border-white/10">
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-white">Create New Account</h2>
              <p className="text-[11px] sm:text-xs text-slate-400 mt-0.5">
                Manage your vehicles, appointments & service records
              </p>
            </div>
            <span className="flex items-center gap-1 text-[11px] sm:text-xs text-cyan-400 bg-cyan-400/10 px-2.5 py-1 rounded-full border border-cyan-400/20 font-medium">
              <Sparkles size={12} />
              <span>Customer Signup</span>
            </span>
          </div>

          {error && (
            <div className="mb-6 text-sm text-rose-300 bg-rose-500/10 border border-rose-500/30 p-3.5 rounded-xl text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-4">
            {/* FULL NAME */}
            <div>
              <label className="text-xs font-semibold text-slate-300">Full Name *</label>
              <div className="relative mt-1.5">
                <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Kasun Fernando"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-950/80 border border-white/10 text-white text-sm focus:border-cyan-500 focus:outline-none placeholder:text-slate-500 transition"
                  required
                />
              </div>
            </div>

            {/* EMAIL & PHONE IN 2 COLS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-300">Email Address *</label>
                <div className="relative mt-1.5">
                  <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="kasun@example.com"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-950/80 border border-white/10 text-white text-sm focus:border-cyan-500 focus:outline-none placeholder:text-slate-500 transition"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300">Phone Number *</label>
                <div className="relative mt-1.5">
                  <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+94 77 123 4567"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-950/80 border border-white/10 text-white text-sm focus:border-cyan-500 focus:outline-none placeholder:text-slate-500 transition"
                    required
                  />
                </div>
              </div>
            </div>

            {/* PASSWORD & CONFIRM PASSWORD */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-300">Password *</label>
                <div className="relative mt-1.5">
                  <Key size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Min 6 characters"
                    className="w-full pl-10 pr-10 py-3 rounded-xl bg-slate-950/80 border border-white/10 text-white text-sm focus:border-cyan-500 focus:outline-none placeholder:text-slate-500 transition"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300">Confirm Password *</label>
                <div className="relative mt-1.5">
                  <Key size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Repeat password"
                    className="w-full pl-10 pr-10 py-3 rounded-xl bg-slate-950/80 border border-white/10 text-white text-sm focus:border-cyan-500 focus:outline-none placeholder:text-slate-500 transition"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                  >
                    {showConfirmPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>
            </div>

            {/* ADDRESS (OPTIONAL) */}
            <div>
              <label className="text-xs font-semibold text-slate-300">
                Home / Business Address <span className="text-slate-500 font-normal">(Optional)</span>
              </label>
              <div className="relative mt-1.5">
                <MapPin size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="e.g. 124 Baseline Road, Colombo 09"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-950/80 border border-white/10 text-white text-sm focus:border-cyan-500 focus:outline-none placeholder:text-slate-500 transition"
                />
              </div>
            </div>

            {/* OPTIONAL VEHICLE REGISTRATION ACCORDION */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setShowVehicleFields(!showVehicleFields)}
                className="flex items-center justify-between w-full py-2 px-3 rounded-xl bg-white/5 border border-white/10 text-xs text-slate-300 hover:text-white hover:bg-white/10 transition"
              >
                <span className="flex items-center gap-2">
                  <Car size={15} className="text-cyan-400" />
                  <span>Register Primary Vehicle Now? (Optional)</span>
                </span>
                <span className="text-cyan-400 font-bold">{showVehicleFields ? "−" : "+"}</span>
              </button>

              {showVehicleFields && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3 p-4 rounded-xl bg-slate-950/60 border border-white/5">
                  <div>
                    <label className="text-[11px] font-semibold text-slate-400">
                      Vehicle Plate Number
                    </label>
                    <input
                      type="text"
                      name="vehicleNumber"
                      value={formData.vehicleNumber}
                      onChange={handleChange}
                      placeholder="e.g. WP-CAB-1234"
                      className="w-full mt-1 px-3 py-2.5 rounded-lg bg-slate-900 border border-white/10 text-white text-xs uppercase focus:border-cyan-500 focus:outline-none placeholder:text-slate-500"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-slate-400">
                      Make & Model
                    </label>
                    <input
                      type="text"
                      name="vehicleModel"
                      value={formData.vehicleModel}
                      onChange={handleChange}
                      placeholder="e.g. Toyota Aqua / BMW 320d"
                      className="w-full mt-1 px-3 py-2.5 rounded-lg bg-slate-900 border border-white/10 text-white text-xs focus:border-cyan-500 focus:outline-none placeholder:text-slate-500"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* SUBMIT BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-4 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold text-sm hover:opacity-95 transition shadow-lg shadow-blue-500/25 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <span>{loading ? "Creating Account..." : "Complete Registration"}</span>
              <ArrowRight size={16} />
            </button>
          </form>

          {/* SIGN IN & HOME LINKS */}
          <div className="mt-6 text-center text-xs text-slate-400 space-y-2">
            <div>
              <span>Already registered with us? </span>
              <Link
                href="/login"
                className="text-cyan-400 hover:text-cyan-300 font-semibold underline underline-offset-4 ml-1"
              >
                Sign In to Your Account
              </Link>
            </div>
            <div>
              <Link
                href="/"
                className="text-slate-500 hover:text-slate-300 transition text-[11px] inline-flex items-center gap-1"
              >
                <span>← Return to Home</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
