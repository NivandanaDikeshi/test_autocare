"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  User,
  Car,
  Calendar,
  FileText,
  LogOut,
  Plus,
  Clock,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ShieldCheck,
  Edit2,
  Phone,
  Mail,
  MapPin,
  Wrench,
  ChevronRight,
  Lock,
  Trash2,
  Key,
} from "lucide-react";

export default function CustomerProfile() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [billings, setBillings] = useState([]);
  const [showAddVehicleModal, setShowAddVehicleModal] = useState(false);
  const [newVehicle, setNewVehicle] = useState({ vehicleNumber: "", vehicleModel: "" });
  const [savingVehicle, setSavingVehicle] = useState(false);

  const [editProfileModal, setEditProfileModal] = useState(false);
  const [profileForm, setProfileForm] = useState({ name: "", address: "" });
  const [savingProfile, setSavingProfile] = useState(false);

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [savingPassword, setSavingPassword] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await fetch("/api/auth/me");
      const data = await res.json();

      if (res.ok && data.success) {
        setUser(data.user);
        setBookings(data.bookings || []);
        setBillings(data.billings || []);
        setProfileForm({
          name: data.user.name || "",
          address: data.user.address || "",
        });
      } else {
        localStorage.removeItem("userAuth");
        localStorage.removeItem("userData");
        router.push("/login?from=/profile");
      }
    } catch (err) {
      console.error("Error fetching profile:", err);
      router.push("/login?from=/profile");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch (e) {
      console.error(e);
    }
    localStorage.removeItem("userAuth");
    localStorage.removeItem("userData");
    window.dispatchEvent(new Event("authChange"));
    router.push("/login");
  };

  const handleAddVehicle = async (e) => {
    e.preventDefault();
    if (!newVehicle.vehicleNumber.trim()) return;

    setSavingVehicle(true);
    try {
      const updatedVehicles = [
        ...(user.vehicles || []),
        {
          vehicleNumber: newVehicle.vehicleNumber.toUpperCase().trim(),
          vehicleModel: newVehicle.vehicleModel.trim() || "Standard",
        },
      ];

      const res = await fetch("/api/auth/me", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ vehicles: updatedVehicles }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setUser((prev) => ({ ...prev, vehicles: updatedVehicles }));
        setShowAddVehicleModal(false);
        setNewVehicle({ vehicleNumber: "", vehicleModel: "" });
      }
    } catch (err) {
      console.error("Failed to add vehicle:", err);
    } finally {
      setSavingVehicle(false);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      const res = await fetch("/api/auth/me", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profileForm),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setUser((prev) => ({
          ...prev,
          name: profileForm.name,
          address: profileForm.address,
        }));
        setEditProfileModal(false);
      }
    } catch (err) {
      console.error("Failed to update profile:", err);
    } finally {
      setSavingProfile(false);
    }
  };

  const handleDeleteVehicle = async (vehicleNumber) => {
    if (!window.confirm(`Are you sure you want to remove vehicle ${vehicleNumber} from your garage?`)) return;
    try {
      const updated = (user.vehicles || []).filter(
        (v) => v.vehicleNumber !== vehicleNumber
      );
      const res = await fetch("/api/auth/me", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ vehicles: updated }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setUser((prev) => ({ ...prev, vehicles: updated }));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordError("");
    setPasswordSuccess("");

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError("New passwords do not match.");
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      setPasswordError("New password must be at least 6 characters.");
      return;
    }

    setSavingPassword(true);
    try {
      const res = await fetch("/api/auth/me", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setPasswordSuccess("Password updated successfully!");
        setTimeout(() => {
          setShowPasswordModal(false);
          setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
          setPasswordSuccess("");
        }, 1200);
      } else {
        setPasswordError(data.message || "Failed to update password.");
      }
    } catch (err) {
      setPasswordError("Failed to update password. Please try again.");
    } finally {
      setSavingPassword(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center bg-slate-950 text-white">
        <div className="w-12 h-12 border-4 border-cyan-500/30 border-t-cyan-400 rounded-full animate-spin mb-4" />
        <p className="text-slate-400 text-sm">Loading your vehicle records...</p>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-slate-950 text-white pb-20">
      {/* HEADER HERO */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 to-slate-950 border-b border-white/10 pt-10 pb-16">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-5 relative z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            {/* USER INFO */}
            <div className="flex items-center gap-3.5 sm:gap-5">
              <div className="w-14 h-14 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-400 flex items-center justify-center font-black text-xl sm:text-2xl text-white shadow-xl shadow-cyan-500/20 border border-white/20 shrink-0">
                {user.name?.charAt(0).toUpperCase() || "U"}
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                  <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight">
                    {user.name}
                  </h1>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] sm:text-xs font-semibold flex items-center gap-1">
                    <ShieldCheck size={13} />
                    Verified Client
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 mt-2">
                  <span className="flex items-center gap-1.5">
                    <Mail size={13} className="text-cyan-400" />
                    {user.email}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Phone size={13} className="text-blue-400" />
                    {user.phone}
                  </span>
                  {user.address && (
                    <span className="flex items-center gap-1.5">
                      <MapPin size={13} className="text-indigo-400" />
                      {user.address}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* QUICK ACTIONS */}
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => setEditProfileModal(true)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs font-semibold hover:bg-white/10 hover:text-cyan-400 transition"
              >
                <Edit2 size={14} />
                <span>Edit Profile</span>
              </button>

              <button
                onClick={() => setShowPasswordModal(true)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs font-semibold hover:bg-white/10 hover:text-cyan-400 transition"
              >
                <Lock size={14} />
                <span>Security</span>
              </button>

              <Link
                href="/booking"
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-xs font-bold shadow-lg shadow-blue-500/20 hover:opacity-95 transition"
              >
                <Wrench size={14} />
                <span>Book Service</span>
              </Link>

              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs font-semibold text-rose-300 hover:bg-rose-500/20 transition"
                title="Sign Out"
              >
                <LogOut size={14} />
                <span>Sign Out</span>
              </button>
            </div>
          </div>

          {/* KPI CARDS */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
              <p className="text-xs text-slate-400">Registered Vehicles</p>
              <p className="text-2xl font-black text-cyan-400 mt-1">
                {user.vehicles?.length || 0}
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
              <p className="text-xs text-slate-400">Total Bookings</p>
              <p className="text-2xl font-black text-blue-400 mt-1">
                {bookings.length}
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
              <p className="text-xs text-slate-400">Active Inquiries</p>
              <p className="text-2xl font-black text-amber-400 mt-1">
                {bookings.filter((b) => b.status === "Pending" || b.status === "Confirmed").length}
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
              <p className="text-xs text-slate-400">Invoices Issued</p>
              <p className="text-2xl font-black text-emerald-400 mt-1">
                {billings.length}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* MAIN CONTENT GRID */}
      <div className="max-w-7xl mx-auto px-5 mt-10 space-y-10">
        {/* SECTION 1: MY GARAGE */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Car size={20} className="text-cyan-400" />
              <h2 className="text-lg font-bold">My Garage & Vehicles</h2>
            </div>
            <button
              onClick={() => setShowAddVehicleModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold hover:bg-cyan-500/20 transition"
            >
              <Plus size={14} />
              <span>Add Vehicle</span>
            </button>
          </div>

          {user.vehicles && user.vehicles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {user.vehicles.map((veh, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-2xl bg-slate-900/80 border border-white/10 hover:border-cyan-500/40 transition group relative overflow-hidden"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-mono text-base font-extrabold text-cyan-300 bg-cyan-500/10 px-3 py-1 rounded-lg border border-cyan-500/20">
                      {veh.vehicleNumber}
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleDeleteVehicle(veh.vehicleNumber)}
                        title="Remove vehicle from garage"
                        className="p-1 rounded text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition"
                      >
                        <Trash2 size={14} />
                      </button>
                      <Car size={18} className="text-slate-400 group-hover:text-cyan-400 transition" />
                    </div>
                  </div>
                  <p className="text-sm font-semibold text-white mt-1">
                    {veh.vehicleModel || "Standard Vehicle"}
                  </p>
                  <div className="flex items-center justify-between pt-4 mt-4 border-t border-white/5 text-xs text-slate-400">
                    <Link
                      href={`/status?vehicle=${encodeURIComponent(veh.vehicleNumber)}`}
                      className="text-cyan-400 hover:underline flex items-center gap-1 font-medium"
                    >
                      <span>Live Tracker</span>
                      <ExternalLink size={12} />
                    </Link>
                    <Link
                      href={`/booking?service=Vehicle%20Maintenance`}
                      className="text-slate-400 hover:text-white"
                    >
                      Book Service
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 rounded-2xl bg-white/5 border border-white/10 text-center">
              <Car size={36} className="mx-auto text-slate-500 mb-2" />
              <p className="text-sm font-semibold text-slate-300">No vehicles registered yet</p>
              <p className="text-xs text-slate-500 mt-1 mb-4">
                Add your vehicle registration number to fast-track bookings and live repair updates.
              </p>
              <button
                onClick={() => setShowAddVehicleModal(true)}
                className="px-4 py-2 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs"
              >
                + Register First Vehicle
              </button>
            </div>
          )}
        </div>

        {/* SECTION 2: SERVICE APPOINTMENTS */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar size={20} className="text-blue-400" />
              <h2 className="text-lg font-bold">My Service Appointments</h2>
            </div>
            <Link
              href="/booking"
              className="text-xs text-cyan-400 hover:underline font-semibold"
            >
              + New Appointment
            </Link>
          </div>

          {bookings.length > 0 ? (
            <div className="rounded-2xl bg-slate-900/80 border border-white/10 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-white/5 text-slate-400 border-b border-white/10 uppercase tracking-wider font-semibold">
                    <tr>
                      <th className="px-5 py-4">Service</th>
                      <th className="px-5 py-4">Vehicle</th>
                      <th className="px-5 py-4">Date & Time</th>
                      <th className="px-5 py-4">Status</th>
                      <th className="px-5 py-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-slate-300">
                    {bookings.map((booking) => (
                      <tr key={booking._id} className="hover:bg-white/5 transition">
                        <td className="px-5 py-4 font-semibold text-white">
                          {booking.serviceType}
                        </td>
                        <td className="px-5 py-4 font-mono text-cyan-300">
                          {booking.vehicleNumber} ({booking.vehicleModel})
                        </td>
                        <td className="px-5 py-4 text-slate-400">
                          {booking.preferredDate} at {booking.preferredTime}
                        </td>
                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${
                              booking.status === "Confirmed"
                                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                                : booking.status === "Completed"
                                ? "bg-blue-500/10 text-blue-400 border-blue-500/20"
                                : booking.status === "Cancelled"
                                ? "bg-rose-500/10 text-rose-400 border-rose-500/20"
                                : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                            }`}
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-current" />
                            {booking.status || "Pending"}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-right">
                          <Link
                            href={`/status?vehicle=${encodeURIComponent(booking.vehicleNumber)}`}
                            className="inline-flex items-center gap-1 text-cyan-400 hover:text-cyan-300 font-semibold"
                          >
                            <span>Track Repair</span>
                            <ChevronRight size={14} />
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="p-8 rounded-2xl bg-white/5 border border-white/10 text-center">
              <Calendar size={36} className="mx-auto text-slate-500 mb-2" />
              <p className="text-sm font-semibold text-slate-300">No appointments scheduled</p>
              <p className="text-xs text-slate-500 mt-1 mb-4">
                Schedule your next periodic maintenance, inspection, or oil change.
              </p>
              <Link
                href="/booking"
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold text-xs"
              >
                Book An Appointment
              </Link>
            </div>
          )}
        </div>

        {/* SECTION 3: INVOICES & BILLS */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText size={20} className="text-emerald-400" />
              <h2 className="text-lg font-bold">My Invoices & Billing Records</h2>
            </div>
            <Link
              href="/billing"
              className="text-xs text-cyan-400 hover:underline font-semibold"
            >
              Search All Invoices →
            </Link>
          </div>

          {billings.length > 0 ? (
            <div className="rounded-2xl bg-slate-900/80 border border-white/10 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-white/5 text-slate-400 border-b border-white/10 uppercase tracking-wider font-semibold">
                    <tr>
                      <th className="px-5 py-4">Invoice #</th>
                      <th className="px-5 py-4">Vehicle</th>
                      <th className="px-5 py-4">Date</th>
                      <th className="px-5 py-4">Total Amount</th>
                      <th className="px-5 py-4">Payment</th>
                      <th className="px-5 py-4 text-right">PDF Invoice</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-slate-300">
                    {billings.map((bill) => (
                      <tr key={bill._id} className="hover:bg-white/5 transition">
                        <td className="px-5 py-4 font-mono font-bold text-white">
                          {bill.invoiceNumber || bill._id.slice(-6).toUpperCase()}
                        </td>
                        <td className="px-5 py-4 font-mono text-cyan-300">
                          {bill.vehicleNumber}
                        </td>
                        <td className="px-5 py-4 text-slate-400">
                          {bill.createdAt ? new Date(bill.createdAt).toLocaleDateString() : "Recent"}
                        </td>
                        <td className="px-5 py-4 font-bold text-white">
                          Rs. {Number(bill.grandTotal || bill.totalAmount || 0).toLocaleString()}
                        </td>
                        <td className="px-5 py-4">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border ${
                              bill.status === "Paid"
                                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                                : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                            }`}
                          >
                            {bill.status || "Paid"}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-right">
                          <Link
                            href={`/billing?search=${encodeURIComponent(bill.vehicleNumber)}`}
                            className="inline-flex items-center gap-1 text-cyan-400 hover:text-cyan-300 font-semibold"
                          >
                            <span>Download PDF</span>
                            <ExternalLink size={13} />
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="p-8 rounded-2xl bg-white/5 border border-white/10 text-center">
              <FileText size={36} className="mx-auto text-slate-500 mb-2" />
              <p className="text-sm font-semibold text-slate-300">No invoices generated yet</p>
              <p className="text-xs text-slate-500 mt-1">
                Completed jobs will have itemized breakdown and printable digital invoices displayed here.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* MODAL: ADD VEHICLE */}
      {showAddVehicleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-slate-900 border border-white/15 rounded-3xl p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-1">Add Vehicle to Garage</h3>
            <p className="text-xs text-slate-400 mb-5">
              Enter your vehicle plate number and model details.
            </p>

            <form onSubmit={handleAddVehicle} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-300">
                  Vehicle Plate Number *
                </label>
                <input
                  type="text"
                  value={newVehicle.vehicleNumber}
                  onChange={(e) =>
                    setNewVehicle({ ...newVehicle, vehicleNumber: e.target.value })
                  }
                  placeholder="e.g. WP-CAB-5566"
                  className="w-full mt-1 px-4 py-3 rounded-xl bg-slate-950 border border-white/10 text-white text-sm uppercase focus:border-cyan-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300">
                  Vehicle Make & Model
                </label>
                <input
                  type="text"
                  value={newVehicle.vehicleModel}
                  onChange={(e) =>
                    setNewVehicle({ ...newVehicle, vehicleModel: e.target.value })
                  }
                  placeholder="e.g. Honda Civic RS"
                  className="w-full mt-1 px-4 py-3 rounded-xl bg-slate-950 border border-white/10 text-white text-sm focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddVehicleModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingVehicle}
                  className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold shadow disabled:opacity-50"
                >
                  {savingVehicle ? "Adding..." : "Save Vehicle"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: EDIT PROFILE */}
      {editProfileModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-slate-900 border border-white/15 rounded-3xl p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-1">Edit Profile Details</h3>
            <p className="text-xs text-slate-400 mb-5">
              Update your display name and residential address.
            </p>

            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-300">Full Name</label>
                <input
                  type="text"
                  value={profileForm.name}
                  onChange={(e) =>
                    setProfileForm({ ...profileForm, name: e.target.value })
                  }
                  className="w-full mt-1 px-4 py-3 rounded-xl bg-slate-950 border border-white/10 text-white text-sm focus:border-cyan-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300">
                  Address
                </label>
                <input
                  type="text"
                  value={profileForm.address}
                  onChange={(e) =>
                    setProfileForm({ ...profileForm, address: e.target.value })
                  }
                  placeholder="Street address, city"
                  className="w-full mt-1 px-4 py-3 rounded-xl bg-slate-950 border border-white/10 text-white text-sm focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setEditProfileModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingProfile}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow disabled:opacity-50"
                >
                  {savingProfile ? "Saving..." : "Update Profile"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: CHANGE PASSWORD */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-slate-900 border border-white/15 rounded-3xl p-6 shadow-2xl">
            <div className="flex items-center gap-2 mb-1">
              <Lock size={18} className="text-cyan-400" />
              <h3 className="text-lg font-bold text-white">Security & Password</h3>
            </div>
            <p className="text-xs text-slate-400 mb-5">
              Update your account credentials to keep your profile secure.
            </p>

            {passwordError && (
              <div className="mb-4 text-xs text-rose-300 bg-rose-500/10 border border-rose-500/30 p-3 rounded-xl text-center">
                {passwordError}
              </div>
            )}

            {passwordSuccess && (
              <div className="mb-4 text-xs text-emerald-300 bg-emerald-500/10 border border-emerald-500/30 p-3 rounded-xl text-center">
                {passwordSuccess}
              </div>
            )}

            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-300">
                  Current Password *
                </label>
                <input
                  type="password"
                  value={passwordForm.currentPassword}
                  onChange={(e) =>
                    setPasswordForm({
                      ...passwordForm,
                      currentPassword: e.target.value,
                    })
                  }
                  placeholder="••••••••"
                  className="w-full mt-1 px-4 py-3 rounded-xl bg-slate-950 border border-white/10 text-white text-sm focus:border-cyan-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300">
                  New Password *
                </label>
                <input
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={(e) =>
                    setPasswordForm({
                      ...passwordForm,
                      newPassword: e.target.value,
                    })
                  }
                  placeholder="Min 6 characters"
                  className="w-full mt-1 px-4 py-3 rounded-xl bg-slate-950 border border-white/10 text-white text-sm focus:border-cyan-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300">
                  Confirm New Password *
                </label>
                <input
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={(e) =>
                    setPasswordForm({
                      ...passwordForm,
                      confirmPassword: e.target.value,
                    })
                  }
                  placeholder="Repeat new password"
                  className="w-full mt-1 px-4 py-3 rounded-xl bg-slate-950 border border-white/10 text-white text-sm focus:border-cyan-500 focus:outline-none"
                  required
                />
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingPassword}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-xs font-bold shadow disabled:opacity-50"
                >
                  {savingPassword ? "Updating..." : "Update Password"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
