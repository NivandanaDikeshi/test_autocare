"use client";

import { useState } from "react";

export default function BookingPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    vehicleModel: "",
    vehicleNumber: "",
    serviceType: "Oil Change",
    preferredDate: "",
    preferredTime: "",
    notes: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/booking", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to submit booking");
      }

      if (data.success) {
        setMessage("✅ Booking Confirmed Successfully!");

        setFormData({
          fullName: "",
          phone: "",
          vehicleModel: "",
          vehicleNumber: "",
          serviceType: "Oil Change",
          preferredDate: "",
          preferredTime: "",
          notes: "",
        });
      } else {
        setMessage(data.message || "❌ Booking Failed");
      }
    } catch (error) {
      console.error("Booking Error:", error);
      setMessage("❌ Server Error. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen bg-slate-950 text-white py-20">
      <div className="max-w-6xl mx-auto px-6">

        {/* Header */}
        <div className="text-center mb-14">
          <span className="px-4 py-2 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
            Service Booking
          </span>

          <h1 className="text-5xl font-bold mt-6">
            Book Your Vehicle Service
          </h1>

          <p className="text-slate-400 mt-3">
            Fill the form and confirm your booking
          </p>
        </div>

        {/* Form Card */}
        <div className="max-w-3xl mx-auto bg-slate-900 p-8 rounded-3xl border border-slate-800 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Full Name */}
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Full Name"
              className="w-full p-4 rounded-xl bg-slate-800 border border-slate-700 outline-none focus:border-blue-500"
              required
            />

            {/* Phone */}
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Phone Number"
              className="w-full p-4 rounded-xl bg-slate-800 border border-slate-700 outline-none focus:border-blue-500"
              required
            />

            {/* Vehicle Model & Number */}
            <div className="grid md:grid-cols-2 gap-4">
              <input
                type="text"
                name="vehicleModel"
                value={formData.vehicleModel}
                onChange={handleChange}
                placeholder="Vehicle Model"
                className="w-full p-4 rounded-xl bg-slate-800 border border-slate-700 outline-none focus:border-blue-500"
                required
              />

              <input
                type="text"
                name="vehicleNumber"
                value={formData.vehicleNumber}
                onChange={handleChange}
                placeholder="Vehicle Number (CAA-1234)"
                className="w-full p-4 rounded-xl bg-slate-800 border border-slate-700 outline-none focus:border-blue-500"
                required
              />
            </div>

            {/* Service Type */}
            <select
              name="serviceType"
              value={formData.serviceType}
              onChange={handleChange}
              className="w-full p-4 rounded-xl bg-slate-800 border border-slate-700 outline-none focus:border-blue-500"
            >
              <option>Oil Change</option>
              <option>Vehicle Maintenance</option>
              <option>Brake Repair</option>
              <option>Engine Diagnostics</option>
              <option>Tire Replacement</option>
              <option>Car Wash & Detailing</option>
            </select>

            {/* Preferred Date */}
            <input
              type="date"
              name="preferredDate"
              value={formData.preferredDate}
              onChange={handleChange}
              className="w-full p-4 rounded-xl bg-slate-800 border border-slate-700 outline-none focus:border-blue-500"
              required
            />

            {/* Preferred Time */}
            <input
              type="time"
              name="preferredTime"
              value={formData.preferredTime}
              onChange={handleChange}
              className="w-full p-4 rounded-xl bg-slate-800 border border-slate-700 outline-none focus:border-blue-500"
              required
            />

            {/* Notes */}
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Additional Notes"
              rows={4}
              className="w-full p-4 rounded-xl bg-slate-800 border border-slate-700 outline-none focus:border-blue-500"
            />

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-blue-600 hover:bg-blue-700 transition rounded-xl font-semibold disabled:opacity-50"
            >
              {loading ? "Submitting..." : "Confirm Booking"}
            </button>

            {/* Status Message */}
            {message && (
              <div className="text-center mt-4">
                <p className="text-slate-300">{message}</p>
              </div>
            )}
          </form>
        </div>

      </div>
    </section>
  );
}
