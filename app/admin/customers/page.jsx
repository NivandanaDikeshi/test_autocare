"use client";

import { useEffect, useState } from "react";
import {
  Users,
  Search,
  Plus,
  Trash2,
  Phone,
  Mail,
  MapPin,
  Car,
  Calendar,
  Clock,
  Eye,
  X,
  FileText,
  DollarSign,
} from "lucide-react";

export default function CustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [customerHistory, setCustomerHistory] = useState(null);
  const [historyLoading, setHistoryLoading] = useState(false);

  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    email: "",
    address: "",
    vehicleNumber: "",
    vehicleModel: "",
    notes: "",
  });

  const loadCustomers = async () => {
    try {
      const res = await fetch("/api/admin/customers");
      const data = await res.json();
      setCustomers(data.customers || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCustomers();
  }, []);

  const viewCustomerDetails = async (c) => {
    setSelectedCustomer(c);
    setHistoryLoading(true);
    try {
      const res = await fetch(`/api/admin/customers/${c._id}`);
      const data = await res.json();
      if (data.success) {
        setCustomerHistory(data.serviceHistory);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setHistoryLoading(false);
    }
  };

  const handleAddCustomer = async (e) => {
    e.preventDefault();
    try {
      const vehicles = [];
      if (form.vehicleNumber) {
        vehicles.push({
          vehicleNumber: form.vehicleNumber.toUpperCase().trim(),
          vehicleModel: form.vehicleModel.trim() || "Standard",
        });
      }

      const res = await fetch("/api/admin/customers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: form.fullName,
          phone: form.phone,
          email: form.email,
          address: form.address,
          vehicles,
          notes: form.notes,
        }),
      });

      const data = await res.json();
      if (data.success) {
        loadCustomers();
        setShowAddModal(false);
        setForm({
          fullName: "",
          phone: "",
          email: "",
          address: "",
          vehicleNumber: "",
          vehicleModel: "",
          notes: "",
        });
      }
    } catch (e) {
      console.error(e);
    }
  };

  const deleteCustomer = async (id) => {
    if (!confirm("Are you sure you want to delete this customer record?")) return;
    try {
      await fetch(`/api/admin/customers/${id}`, {
        method: "DELETE",
      });
      loadCustomers();
      if (selectedCustomer && selectedCustomer._id === id) {
        setSelectedCustomer(null);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const filteredCustomers = customers.filter((c) => {
    const term = search.toLowerCase().trim();
    if (!term) return true;
    return (
      (c.fullName && c.fullName.toLowerCase().includes(term)) ||
      (c.phone && c.phone.toLowerCase().includes(term)) ||
      (c.email && c.email.toLowerCase().includes(term)) ||
      (c.vehicles &&
        c.vehicles.some((v) =>
          v.vehicleNumber?.toLowerCase().includes(term)
        ))
    );
  });

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
            Customer Management
          </h1>
          <p className="text-slate-400 mt-1">
            Maintain customer directories, contact profiles, registered vehicles, and complete service histories
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:opacity-90 text-white font-semibold text-sm transition shadow-lg shadow-blue-500/20"
        >
          <Plus size={16} />
          <span>Add New Customer</span>
        </button>
      </div>

      {/* STATS OVERVIEW */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-5 shadow-lg">
          <p className="text-xs text-slate-400 uppercase font-medium">Registered Clients</p>
          <h2 className="text-2xl font-black text-white mt-2">
            {customers.length} Profiles
          </h2>
          <p className="text-xs text-slate-500 mt-1">Verified customers</p>
        </div>

        <div className="bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-5 shadow-lg">
          <p className="text-xs text-slate-400 uppercase font-medium">Linked Vehicles</p>
          <h2 className="text-2xl font-black text-cyan-400 mt-2">
            {customers.reduce(
              (acc, c) => acc + (c.vehicles ? c.vehicles.length : 0),
              0
            )}{" "}
            Automobiles
          </h2>
          <p className="text-xs text-cyan-400/70 mt-1">Client fleet registered</p>
        </div>

        <div className="bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-5 shadow-lg">
          <p className="text-xs text-slate-400 uppercase font-medium">Repeat Clients</p>
          <h2 className="text-2xl font-black text-emerald-400 mt-2">
            {customers.filter((c) => (c.totalBookings || 0) > 1).length} Returning
          </h2>
          <p className="text-xs text-emerald-400/70 mt-1">Multiple visits on record</p>
        </div>
      </div>

      {/* SEARCH BAR */}
      <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-4 flex items-center justify-between shadow-xl">
        <div className="relative w-full max-w-md">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by customer name, phone number, email, or license plate..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-white/10 rounded-xl text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>
      </div>

      {/* CUSTOMER DIRECTORY CARDS */}
      {loading ? (
        <div className="py-24 text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-400">Loading customer profiles...</p>
        </div>
      ) : filteredCustomers.length === 0 ? (
        <div className="bg-slate-900/40 border border-white/10 rounded-2xl p-16 text-center">
          <Users size={48} className="mx-auto mb-4 text-slate-600" />
          <h3 className="text-lg font-bold text-white">No Customers Found</h3>
          <p className="text-slate-400 text-sm mt-1 max-w-sm mx-auto">
            Customers are automatically captured on service bookings or can be manually added.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCustomers.map((customer) => (
            <div
              key={customer._id}
              className="bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:border-cyan-500/30 transition-all duration-300 flex flex-col justify-between shadow-xl group"
            >
              <div>
                {/* TOP HEADER */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center font-bold text-white shadow-md">
                      {customer.fullName.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-white group-hover:text-cyan-300 transition">
                        {customer.fullName}
                      </h3>
                      <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                        <Phone size={11} /> {customer.phone}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-1.5">
                    <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-blue-500/10 text-cyan-400 border border-blue-500/20">
                      {customer.totalBookings || 1} Service{(customer.totalBookings || 1) > 1 ? "s" : ""}
                    </span>
                    {customer.hasOnlineAccount ? (
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        ● Online User
                      </span>
                    ) : (
                      <span className="text-[10px] text-slate-400 px-2 py-0.5 rounded-full bg-white/5 border border-white/5">
                        In-Shop
                      </span>
                    )}
                  </div>
                </div>

                {/* DETAILS */}
                <div className="mt-5 space-y-2 text-xs text-slate-300 pt-4 border-t border-white/5">
                  {customer.email && (
                    <p className="flex items-center gap-2 text-slate-400">
                      <Mail size={13} className="shrink-0" />
                      <span className="truncate">{customer.email}</span>
                    </p>
                  )}
                  {customer.address && (
                    <p className="flex items-center gap-2 text-slate-400">
                      <MapPin size={13} className="shrink-0" />
                      <span className="truncate">{customer.address}</span>
                    </p>
                  )}

                  {/* LINKED VEHICLES CHIPS */}
                  <div className="pt-2">
                    <p className="text-[11px] text-slate-500 font-medium mb-1.5 uppercase">
                      Registered Vehicles
                    </p>
                    {customer.vehicles && customer.vehicles.length > 0 ? (
                      <div className="flex flex-wrap gap-1.5">
                        {customer.vehicles.map((v, i) => (
                          <span
                            key={i}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-950 border border-white/10 text-xs font-mono text-cyan-300"
                          >
                            <Car size={11} /> {v.vehicleNumber}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-slate-500 italic">No vehicles attached yet</span>
                    )}
                  </div>
                </div>
              </div>

              {/* ACTIONS */}
              <div className="mt-6 pt-4 border-t border-white/10 flex items-center gap-2">
                <button
                  onClick={() => viewCustomerDetails(customer)}
                  className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition"
                >
                  <Eye size={14} />
                  <span>View Service History</span>
                </button>

                <button
                  onClick={() => deleteCustomer(customer._id)}
                  title="Delete Profile"
                  className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition border border-white/5"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* SERVICE HISTORY DRAWER / MODAL */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-white/10 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 md:p-8 shadow-2xl relative">
            <button
              onClick={() => setSelectedCustomer(null)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white p-2 rounded-full hover:bg-white/10 transition"
            >
              <X size={18} />
            </button>

            {/* CUSTOMER HEADER */}
            <div className="flex items-center gap-4 pb-6 border-b border-white/10">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center text-xl font-bold text-white shadow-lg">
                {selectedCustomer.fullName.charAt(0)}
              </div>
              <div>
                <h3 className="text-2xl font-black text-white">
                  {selectedCustomer.fullName}
                </h3>
                <p className="text-xs text-slate-400 flex items-center gap-2 mt-1">
                  <span>📞 {selectedCustomer.phone}</span>
                  {selectedCustomer.email && <span>• ✉️ {selectedCustomer.email}</span>}
                </p>
              </div>
            </div>

            {/* HISTORY SECTIONS */}
            <div className="mt-6 space-y-6">
              <div>
                <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-2">
                  <Calendar size={16} className="text-cyan-400" />
                  <span>Service Appointments History</span>
                </h4>

                {historyLoading ? (
                  <p className="text-xs text-slate-400 py-4 animate-pulse">
                    Loading appointments history...
                  </p>
                ) : !customerHistory?.bookings || customerHistory.bookings.length === 0 ? (
                  <p className="text-xs text-slate-500 py-3 italic">
                    No bookings on record for this customer.
                  </p>
                ) : (
                  <div className="space-y-2.5">
                    {customerHistory.bookings.map((b) => (
                      <div
                        key={b._id}
                        className="p-3.5 rounded-xl bg-slate-950/80 border border-white/10 flex items-center justify-between text-xs"
                      >
                        <div>
                          <p className="font-semibold text-white">{b.serviceType}</p>
                          <p className="text-slate-400 mt-0.5">
                            Vehicle: {b.vehicleNumber} ({b.vehicleModel}) • {b.preferredDate}
                          </p>
                        </div>
                        <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-white/5 border border-white/10 text-cyan-300">
                          {b.status}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-2">
                  <FileText size={16} className="text-emerald-400" />
                  <span>Billing & Payment Records</span>
                </h4>

                {historyLoading ? (
                  <p className="text-xs text-slate-400 py-4 animate-pulse">
                    Loading billing records...
                  </p>
                ) : !customerHistory?.billings || customerHistory.billings.length === 0 ? (
                  <p className="text-xs text-slate-500 py-3 italic">
                    No billing records issued for this customer yet.
                  </p>
                ) : (
                  <div className="space-y-2.5">
                    {customerHistory.billings.map((bill) => (
                      <div
                        key={bill._id}
                        className="p-3.5 rounded-xl bg-slate-950/80 border border-white/10 flex items-center justify-between text-xs"
                      >
                        <div>
                          <p className="font-semibold text-white">
                            {bill.invoiceNumber || "INV-" + bill._id.slice(-6)} • {bill.serviceType}
                          </p>
                          <p className="text-slate-400 mt-0.5">
                            Vehicle: {bill.vehicleNumber} • Date: {new Date(bill.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-emerald-400">
                            Rs. {(Number(bill.amount || bill.totalAmount) || 0).toLocaleString()}
                          </p>
                          <a
                            href={`/api/billing/${bill._id}/invoice`}
                            target="_blank"
                            className="text-[11px] text-cyan-400 hover:underline"
                          >
                            PDF Receipt
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ADD CUSTOMER MODAL */}
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
                <Users size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Add Customer Profile</h3>
                <p className="text-xs text-slate-400">Register a new client in the service center</p>
              </div>
            </div>

            <form onSubmit={handleAddCustomer} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-300 font-medium">Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Kasun Silva"
                    value={form.fullName}
                    onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                    className="w-full mt-1.5 px-3.5 py-2.5 bg-slate-950 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-300 font-medium">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. +94 77 123 4567"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full mt-1.5 px-3.5 py-2.5 bg-slate-950 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-300 font-medium">Email Address</label>
                <input
                  type="email"
                  placeholder="e.g. customer@example.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full mt-1.5 px-3.5 py-2.5 bg-slate-950 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-300 font-medium">Primary Vehicle Number</label>
                  <input
                    type="text"
                    placeholder="e.g. CAA-1234"
                    value={form.vehicleNumber}
                    onChange={(e) => setForm({ ...form, vehicleNumber: e.target.value })}
                    className="w-full mt-1.5 px-3.5 py-2.5 bg-slate-950 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-cyan-500 uppercase"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-300 font-medium">Vehicle Model</label>
                  <input
                    type="text"
                    placeholder="e.g. Toyota Aqua"
                    value={form.vehicleModel}
                    onChange={(e) => setForm({ ...form, vehicleModel: e.target.value })}
                    className="w-full mt-1.5 px-3.5 py-2.5 bg-slate-950 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-300 font-medium">Customer Address / City</label>
                <input
                  type="text"
                  placeholder="e.g. Colombo 03"
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  className="w-full mt-1.5 px-3.5 py-2.5 bg-slate-950 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-cyan-500"
                />
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
                  Save Customer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
