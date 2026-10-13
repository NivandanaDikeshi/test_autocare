"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  CalendarCheck,
  Car,
  Clock,
  Phone,
  User,
  Wrench,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Calendar,
} from "lucide-react";

function BookingForm() {
  const searchParams = useSearchParams();
  const preselectedService = searchParams.get("service") || "Oil Change";

  const today = new Date().toISOString().split("T")[0];

  const [availableServices, setAvailableServices] = useState([]);
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    vehicleModel: "",
    vehicleNumber: "",
    serviceType: preselectedService,
    preferredDate: today,
    preferredTime: "10:00",
    notes: "",
  });

  // Dynamically fetch services from MongoDB
  useEffect(() => {
    fetch("/api/services/catalog")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.services?.length > 0) {
          setAvailableServices(data.services);
        }
      })
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    const serviceParam = searchParams.get("service");
    if (serviceParam) {
      setFormData((prev) => ({
        ...prev,
        serviceType: serviceParam,
      }));
    }
  }, [searchParams]);

  // Auto-fill logged in customer details
  useEffect(() => {
    try {
      const stored = localStorage.getItem("userData");
      if (stored) {
        const u = JSON.parse(stored);
        setFormData((prev) => ({
          ...prev,
          fullName: prev.fullName || u.name || "",
          phone: prev.phone || u.phone || "",
          email: prev.email || u.email || "",
          vehicleNumber:
            prev.vehicleNumber || (u.vehicles?.[0]?.vehicleNumber || ""),
          vehicleModel:
            prev.vehicleModel || (u.vehicles?.[0]?.vehicleModel || ""),
        }));
      }
    } catch (e) {}
  }, []);

  const [loading, setLoading] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      const response = await fetch("/api/booking", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to submit booking");
      }

      setConfirmedBooking(data.booking);
    } catch (error) {
      console.error("Booking Error:", error);
      setErrorMsg(error.message || "Failed to submit booking. Please check details.");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setConfirmedBooking(null);
    setFormData({
      fullName: "",
      phone: "",
      email: "",
      vehicleModel: "",
      vehicleNumber: "",
      serviceType: "Oil Change",
      preferredDate: today,
      preferredTime: "10:00",
      notes: "",
    });
  };

  if (confirmedBooking) {
    return (
      <div className="max-w-2xl mx-auto bg-slate-900/70 backdrop-blur-2xl border border-emerald-500/30 rounded-3xl p-8 md:p-12 text-center shadow-2xl">
        <div className="w-20 h-20 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 size={42} />
        </div>

        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          Booking Confirmed
        </span>

        <h2 className="text-3xl font-extrabold text-white mt-4 tracking-tight">
          Service Appointment Scheduled!
        </h2>

        <p className="text-slate-400 text-sm mt-2 max-w-md mx-auto">
          Thank you, <strong className="text-white">{confirmedBooking.fullName}</strong>. Your service booking has been entered into the AutoCare workshop queue.
        </p>

        {/* BOOKING SUMMARY BOX */}
        <div className="mt-8 p-6 rounded-2xl bg-slate-950/70 border border-white/10 text-left space-y-3 text-sm">
          <div className="flex justify-between items-center pb-3 border-b border-white/5">
            <span className="text-slate-400 text-xs">Reference ID:</span>
            <span className="font-mono font-bold text-cyan-400">
              #{confirmedBooking._id.slice(-8)}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-400 text-xs">Vehicle Number:</span>
            <span className="font-semibold text-white">{confirmedBooking.vehicleNumber}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-400 text-xs">Vehicle Model:</span>
            <span className="text-slate-300">{confirmedBooking.vehicleModel}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-400 text-xs">Service Type:</span>
            <span className="font-medium text-cyan-300">{confirmedBooking.serviceType}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-400 text-xs">Scheduled Time:</span>
            <span className="text-slate-300">
              {confirmedBooking.preferredDate} at {confirmedBooking.preferredTime}
            </span>
          </div>
        </div>

        {/* ACTIONS */}
        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href={`/status?v=${encodeURIComponent(confirmedBooking.vehicleNumber)}`}
            className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold text-sm hover:opacity-90 transition shadow-lg shadow-blue-500/25"
          >
            <span>Track Repair Status Live</span>
            <ArrowRight size={16} />
          </Link>

          <button
            onClick={resetForm}
            className="px-6 py-3.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-sm font-medium border border-white/10 transition"
          >
            Book Another Vehicle
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto bg-slate-900/60 backdrop-blur-2xl border border-white/10 p-8 md:p-10 rounded-3xl shadow-2xl">
      {errorMsg && (
        <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm text-center">
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* CUSTOMER INFO */}
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-cyan-400 mb-3 flex items-center gap-2">
            <User size={16} /> Customer Information
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-slate-300 font-medium">Full Name *</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Kasun Perera"
                required
                className="w-full mt-1.5 p-3.5 rounded-xl bg-slate-950 border border-white/10 text-white text-sm outline-none focus:border-cyan-500 transition"
              />
            </div>

            <div>
              <label className="text-xs text-slate-300 font-medium">Phone Number *</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+94 77 123 4567"
                required
                className="w-full mt-1.5 p-3.5 rounded-xl bg-slate-950 border border-white/10 text-white text-sm outline-none focus:border-cyan-500 transition"
              />
            </div>
          </div>
        </div>

        {/* VEHICLE INFO */}
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-cyan-400 mb-3 flex items-center gap-2">
            <Car size={16} /> Vehicle Details
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-slate-300 font-medium">Vehicle Model *</label>
              <input
                type="text"
                name="vehicleModel"
                value={formData.vehicleModel}
                onChange={handleChange}
                placeholder="e.g. Toyota Aqua / Honda Civic"
                required
                className="w-full mt-1.5 p-3.5 rounded-xl bg-slate-950 border border-white/10 text-white text-sm outline-none focus:border-cyan-500 transition"
              />
            </div>

            <div>
              <label className="text-xs text-slate-300 font-medium">License Plate Number *</label>
              <input
                type="text"
                name="vehicleNumber"
                value={formData.vehicleNumber}
                onChange={handleChange}
                placeholder="e.g. CAA-1234"
                required
                className="w-full mt-1.5 p-3.5 rounded-xl bg-slate-950 border border-white/10 text-white text-sm outline-none focus:border-cyan-500 transition uppercase"
              />
            </div>
          </div>
        </div>

        {/* SERVICE & SCHEDULE */}
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-cyan-400 mb-3 flex items-center gap-2">
            <Wrench size={16} /> Service & Scheduling
          </h3>

          <div className="space-y-4">
            <div>
              <label className="text-xs text-slate-300 font-medium">Service Package</label>
              <select
                name="serviceType"
                value={formData.serviceType}
                onChange={handleChange}
                className="w-full mt-1.5 p-3.5 rounded-xl bg-slate-950 border border-white/10 text-white text-sm outline-none focus:border-cyan-500 transition cursor-pointer"
              >
                {availableServices.length > 0 ? (
                  availableServices.map((s) => (
                    <option key={s._id} value={s.title}>
                      {s.title} — Rs. {(s.price || 0).toLocaleString()} ({s.estimatedTime})
                    </option>
                  ))
                ) : (
                  <>
                    <option>Oil Change</option>
                    <option>Vehicle Maintenance</option>
                    <option>Brake Service</option>
                    <option>Engine Diagnostics</option>
                    <option>Tire Services</option>
                    <option>Car Wash & Detailing</option>
                  </>
                )}
              </select>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-slate-300 font-medium">Preferred Date</label>
                <input
                  type="date"
                  name="preferredDate"
                  min={today}
                  value={formData.preferredDate}
                  onChange={handleChange}
                  required
                  className="w-full mt-1.5 p-3.5 rounded-xl bg-slate-950 border border-white/10 text-white text-sm outline-none focus:border-cyan-500 transition"
                />
              </div>

              <div>
                <label className="text-xs text-slate-300 font-medium">Preferred Time</label>
                <input
                  type="time"
                  name="preferredTime"
                  value={formData.preferredTime}
                  onChange={handleChange}
                  required
                  className="w-full mt-1.5 p-3.5 rounded-xl bg-slate-950 border border-white/10 text-white text-sm outline-none focus:border-cyan-500 transition"
                />
              </div>
            </div>
          </div>
        </div>

        {/* SPECIAL NOTES */}
        <div>
          <label className="text-xs text-slate-300 font-medium">
            Special Notes / Symptoms (Optional)
          </label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            placeholder="Describe any sounds, dashboard warning lights, or specific requests..."
            rows={3}
            className="w-full mt-1.5 p-3.5 rounded-xl bg-slate-950 border border-white/10 text-white text-sm outline-none focus:border-cyan-500 transition resize-none"
          />
        </div>

        {/* SUBMIT BUTTON */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 bg-gradient-to-r from-blue-600 to-cyan-500 hover:opacity-95 text-white font-bold text-base rounded-xl transition shadow-xl shadow-blue-500/25 disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading ? (
            <span>Securing Appointment...</span>
          ) : (
            <>
              <span>Confirm Service Booking</span>
              <ArrowRight size={18} />
            </>
          )}
        </button>

        <p className="text-center text-xs text-slate-500 flex items-center justify-center gap-1.5">
          <ShieldCheck size={14} className="text-cyan-400" />
          <span>No prepayment required. Pay at the workshop after completion.</span>
        </p>
      </form>
    </div>
  );
}

export default function BookingPage() {
  return (
    <section className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-black text-white py-20 px-6">
      <div className="max-w-6xl mx-auto">
        {/* HEADER */}
        <div className="text-center mb-14">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs font-semibold uppercase tracking-wider">
            <CalendarCheck size={14} /> Instant Appointment Booking
          </span>

          <h1 className="text-4xl md:text-6xl font-black mt-6 tracking-tight">
            Schedule Your <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">Vehicle Service</span>
          </h1>

          <p className="text-slate-400 text-sm md:text-base mt-3 max-w-xl mx-auto">
            Book professional certified maintenance in seconds and track your service status live from our portal.
          </p>
        </div>

        <Suspense fallback={<div className="text-center py-20 text-slate-400">Loading booking form...</div>}>
          <BookingForm />
        </Suspense>
      </div>
    </section>
  );
}
