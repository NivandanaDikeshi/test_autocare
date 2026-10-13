"use client";

import { useEffect, useState } from "react";
import {
  Car,
  Search,
  Plus,
  Trash2,
  Phone,
  User,
  CheckCircle,
  Clock,
  X,
  ShieldCheck,
} from "lucide-react";

export default function VehiclesPage() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [showAddModal, setShowAddModal] = useState(false);

  const [form, setForm] = useState({
    ownerName: "",
    ownerPhone: "",
    model: "",
    number: "",
    year: "",
    status: "Active",
  });

  const loadVehicles = async () => {
    try {
      const res = await fetch("/api/vehicles");
      const data = await res.json();
      setVehicles(data.vehicles || []);
    } catch (error) {
      console.error("Error loading vehicles:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVehicles();
  }, []);

  const handleAddVehicle = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/vehicles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        loadVehicles();
        setShowAddModal(false);
        setForm({
          ownerName: "",
          ownerPhone: "",
          model: "",
          number: "",
          year: "",
          status: "Active",
        });
      }
    } catch (e) {
      console.error(e);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await fetch(`/api/vehicles/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      loadVehicles();
    } catch (e) {
      console.error(e);
    }
  };

  const deleteVehicle = async (id) => {
    if (!confirm("Are you sure you want to delete this vehicle from the registry?")) return;
    try {
      await fetch(`/api/vehicles/${id}`, {
        method: "DELETE",
      });
      loadVehicles();
    } catch (e) {
      console.error(e);
    }
  };

  const filteredVehicles = vehicles.filter((v) => {
    const matchesStatus =
      statusFilter === "All" || v.status === statusFilter;
    const term = search.toLowerCase().trim();
    const matchesSearch =
      !term ||
      (v.number && v.number.toLowerCase().includes(term)) ||
      (v.model && v.model.toLowerCase().includes(term)) ||
      (v.ownerName && v.ownerName.toLowerCase().includes(term)) ||
      (v.ownerPhone && v.ownerPhone.toLowerCase().includes(term));

    return matchesStatus && matchesSearch;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case "In Service":
        return "bg-blue-500/20 text-blue-400 border border-blue-500/30";
      case "Completed":
        return "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30";
      case "Active":
        return "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30";
      default:
        return "bg-slate-700/30 text-slate-300 border border-slate-600/30";
    }
  };

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
            Vehicle Fleet Registry
          </h1>
          <p className="text-slate-400 mt-1">
            Registered customer automobiles, service histories, and license plate records
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:opacity-90 text-white font-semibold text-sm transition shadow-lg shadow-blue-500/20"
        >
          <Plus size={16} />
          <span>Register Vehicle</span>
        </button>
      </div>

      {/* STATS OVERVIEW */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-5 shadow-lg">
          <p className="text-xs text-slate-400 uppercase font-medium">Total Vehicles</p>
          <h2 className="text-2xl font-black text-white mt-2">{vehicles.length} Units</h2>
          <p className="text-xs text-slate-500 mt-1">In customer registry</p>
        </div>

        <div className="bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-5 shadow-lg">
          <p className="text-xs text-slate-400 uppercase font-medium">Currently In Service</p>
          <h2 className="text-2xl font-black text-blue-400 mt-2">
            {vehicles.filter((v) => v.status === "In Service").length} Active in Bays
          </h2>
          <p className="text-xs text-blue-400/70 mt-1">Undergoing maintenance</p>
        </div>

        <div className="bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-5 shadow-lg">
          <p className="text-xs text-slate-400 uppercase font-medium">Delivered / Active</p>
          <h2 className="text-2xl font-black text-emerald-400 mt-2">
            {vehicles.filter((v) => v.status === "Active" || v.status === "Completed").length} Finished
          </h2>
          <p className="text-xs text-emerald-400/70 mt-1">Operational condition</p>
        </div>
      </div>

      {/* SEARCH AND FILTER BAR */}
      <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-4 flex flex-col md:flex-row gap-4 items-center justify-between shadow-xl">
        <div className="relative w-full md:w-96">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search license plate, model, owner..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-white/10 rounded-xl text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div className="flex flex-wrap gap-1.5 w-full md:w-auto">
          {["All", "In Service", "Active", "Completed", "Inactive"].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                statusFilter === status
                  ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                  : "bg-white/5 text-slate-400 hover:text-white hover:bg-white/10"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* VEHICLES TABLE */}
      {loading ? (
        <div className="py-24 text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-400">Loading vehicle registry...</p>
        </div>
      ) : filteredVehicles.length === 0 ? (
        <div className="bg-slate-900/40 border border-white/10 rounded-2xl p-16 text-center">
          <Car size={48} className="mx-auto mb-4 text-slate-600" />
          <h3 className="text-lg font-bold text-white">No Vehicles Registered</h3>
          <p className="text-slate-400 text-sm mt-1 max-w-sm mx-auto">
            Vehicles are automatically registered when customers book services, or you can add one manually.
          </p>
        </div>
      ) : (
        <div className="bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-950/80 border-b border-white/10 text-xs text-slate-400 uppercase tracking-wider">
                <tr>
                  <th className="p-4">License Plate</th>
                  <th className="p-4">Vehicle Model</th>
                  <th className="p-4">Owner Name</th>
                  <th className="p-4">Contact Phone</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredVehicles.map((vehicle) => (
                  <tr key={vehicle._id} className="hover:bg-white/5 transition">
                    {/* LICENSE NUMBER */}
                    <td className="p-4 font-mono font-bold text-cyan-400">
                      <div className="inline-flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
                          <Car size={16} />
                        </div>
                        <span>{vehicle.number}</span>
                      </div>
                    </td>

                    {/* MODEL */}
                    <td className="p-4">
                      <p className="font-semibold text-white">{vehicle.model}</p>
                      {vehicle.year && (
                        <p className="text-xs text-slate-400">Year: {vehicle.year}</p>
                      )}
                    </td>

                    {/* OWNER */}
                    <td className="p-4 text-slate-200">
                      {vehicle.ownerName || "Unassigned"}
                    </td>

                    {/* PHONE */}
                    <td className="p-4 text-xs text-slate-400">
                      {vehicle.ownerPhone || "—"}
                    </td>

                    {/* STATUS */}
                    <td className="p-4">
                      <select
                        value={vehicle.status}
                        onChange={(e) => updateStatus(vehicle._id, e.target.value)}
                        className={`text-xs font-semibold px-3 py-1.5 rounded-full border bg-slate-950 cursor-pointer focus:outline-none ${getStatusBadge(
                          vehicle.status
                        )}`}
                      >
                        <option value="Active">Active</option>
                        <option value="In Service">In Service</option>
                        <option value="Completed">Completed</option>
                        <option value="Inactive">Inactive</option>
                      </select>
                    </td>

                    {/* ACTIONS */}
                    <td className="p-4 text-right">
                      <button
                        onClick={() => deleteVehicle(vehicle._id)}
                        title="Delete Vehicle"
                        className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ADD VEHICLE MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-white/10 rounded-3xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 shadow-2xl relative">
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white p-2 rounded-full hover:bg-white/10 transition"
            >
              <X size={18} />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-400 flex items-center justify-center text-white">
                <Car size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Register Vehicle</h3>
                <p className="text-xs text-slate-400">Add a client vehicle to the AutoCare database</p>
              </div>
            </div>

            <form onSubmit={handleAddVehicle} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-300 font-medium">License Plate Number</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. CAA-1234"
                    value={form.number}
                    onChange={(e) => setForm({ ...form, number: e.target.value })}
                    className="w-full mt-1.5 px-3.5 py-2.5 bg-slate-950 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-cyan-500 uppercase"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-300 font-medium">Vehicle Model</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Toyota Prius"
                    value={form.model}
                    onChange={(e) => setForm({ ...form, model: e.target.value })}
                    className="w-full mt-1.5 px-3.5 py-2.5 bg-slate-950 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-300 font-medium">Owner Full Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Nimal Perera"
                    value={form.ownerName}
                    onChange={(e) => setForm({ ...form, ownerName: e.target.value })}
                    className="w-full mt-1.5 px-3.5 py-2.5 bg-slate-950 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-300 font-medium">Owner Phone</label>
                  <input
                    type="tel"
                    placeholder="e.g. +94 77 123 4567"
                    value={form.ownerPhone}
                    onChange={(e) => setForm({ ...form, ownerPhone: e.target.value })}
                    className="w-full mt-1.5 px-3.5 py-2.5 bg-slate-950 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-300 font-medium">Year of Manufacture</label>
                  <input
                    type="text"
                    placeholder="e.g. 2021"
                    value={form.year}
                    onChange={(e) => setForm({ ...form, year: e.target.value })}
                    className="w-full mt-1.5 px-3.5 py-2.5 bg-slate-950 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-300 font-medium">Initial Status</label>
                  <select
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value })}
                    className="w-full mt-1.5 px-3.5 py-2.5 bg-slate-950 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-cyan-500"
                  >
                    <option value="Active">Active</option>
                    <option value="In Service">In Service</option>
                    <option value="Completed">Completed</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2.5 bg-white/5 hover:bg-white/10 rounded-xl font-medium text-sm text-slate-300 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-500 rounded-xl font-medium text-sm text-white transition"
                >
                  Register Vehicle
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}