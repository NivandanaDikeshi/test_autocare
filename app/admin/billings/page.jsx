"use client";

import { useEffect, useState } from "react";
import {
  FileText,
  Search,
  Plus,
  Download,
  Trash2,
  CheckCircle,
  Clock,
  DollarSign,
  Car,
  User,
  X,
} from "lucide-react";

export default function BillingPage() {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [showAddModal, setShowAddModal] = useState(false);

  const [form, setForm] = useState({
    invoiceNumber: "",
    customerName: "",
    customerPhone: "",
    customerEmail: "",
    vehicleNumber: "",
    vehicleModel: "",
    serviceType: "Vehicle Maintenance",
    amount: "",
    status: "Unpaid",
  });

  const fetchBills = async () => {
    try {
      const res = await fetch("/api/admin/billings");
      const data = await res.json();
      if (data.success) {
        setBills(data.bills || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBills();
  }, []);

  const toggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === "Paid" ? "Unpaid" : "Paid";
    try {
      const res = await fetch(`/api/admin/billings/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        fetchBills();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const deleteBill = async (id) => {
    if (!confirm("Are you sure you want to delete this invoice?")) return;
    try {
      const res = await fetch(`/api/admin/billings/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        fetchBills();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleCreateInvoice = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/admin/billings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        setShowAddModal(false);
        setForm({
          invoiceNumber: "",
          customerName: "",
          customerPhone: "",
          customerEmail: "",
          vehicleNumber: "",
          vehicleModel: "",
          serviceType: "Vehicle Maintenance",
          amount: "",
          status: "Unpaid",
        });
        fetchBills();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filteredBills = bills.filter((b) => {
    const matchesStatus =
      statusFilter === "All" || b.status === statusFilter;
    const term = search.toLowerCase().trim();
    const matchesSearch =
      !term ||
      (b.invoiceNumber && b.invoiceNumber.toLowerCase().includes(term)) ||
      (b.customerName && b.customerName.toLowerCase().includes(term)) ||
      (b.vehicleNumber && b.vehicleNumber.toLowerCase().includes(term)) ||
      (b.serviceType && b.serviceType.toLowerCase().includes(term));

    return matchesStatus && matchesSearch;
  });

  const totalAmount = bills.reduce((acc, b) => acc + (Number(b.amount || b.totalAmount) || 0), 0);
  const paidAmount = bills
    .filter((b) => b.status === "Paid")
    .reduce((acc, b) => acc + (Number(b.amount || b.totalAmount) || 0), 0);
  const unpaidAmount = bills
    .filter((b) => b.status === "Unpaid")
    .reduce((acc, b) => acc + (Number(b.amount || b.totalAmount) || 0), 0);

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
            Invoices & Billing
          </h1>
          <p className="text-slate-400 mt-1">
            Manage customer payments, generate billing invoices, and download PDF receipts
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:opacity-90 text-white font-semibold text-sm transition shadow-lg shadow-blue-500/20"
        >
          <Plus size={16} />
          <span>Create New Invoice</span>
        </button>
      </div>

      {/* STATS OVERVIEW */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-5 shadow-lg">
          <p className="text-xs text-slate-400 uppercase font-medium">Total Invoiced</p>
          <h2 className="text-2xl font-black text-white mt-2">
            Rs. {totalAmount.toLocaleString()}
          </h2>
          <p className="text-xs text-slate-500 mt-1">{bills.length} total receipts</p>
        </div>

        <div className="bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-5 shadow-lg">
          <p className="text-xs text-slate-400 uppercase font-medium">Paid Revenue</p>
          <h2 className="text-2xl font-black text-emerald-400 mt-2">
            Rs. {paidAmount.toLocaleString()}
          </h2>
          <p className="text-xs text-emerald-400/70 mt-1">
            {bills.filter((b) => b.status === "Paid").length} completed payments
          </p>
        </div>

        <div className="bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-5 shadow-lg">
          <p className="text-xs text-slate-400 uppercase font-medium">Unpaid Outstanding</p>
          <h2 className="text-2xl font-black text-amber-400 mt-2">
            Rs. {unpaidAmount.toLocaleString()}
          </h2>
          <p className="text-xs text-amber-400/70 mt-1">
            {bills.filter((b) => b.status === "Unpaid").length} invoices pending
          </p>
        </div>
      </div>

      {/* SEARCH AND FILTERS */}
      <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-4 flex flex-col md:flex-row gap-4 items-center justify-between shadow-xl">
        <div className="relative w-full md:w-96">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search invoice #, customer, vehicle..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-white/10 rounded-xl text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div className="flex gap-2 w-full md:w-auto">
          {["All", "Paid", "Unpaid"].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${
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

      {/* INVOICE CARDS GRID */}
      {loading ? (
        <div className="py-24 text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-400">Loading billing invoices...</p>
        </div>
      ) : filteredBills.length === 0 ? (
        <div className="bg-slate-900/40 border border-white/10 rounded-2xl p-16 text-center">
          <FileText size={48} className="mx-auto mb-4 text-slate-600" />
          <h3 className="text-lg font-bold text-white">No Invoices Found</h3>
          <p className="text-slate-400 text-sm mt-1 max-w-sm mx-auto">
            Invoices are automatically created when bookings are confirmed, or you can manually create one.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBills.map((bill) => (
            <div
              key={bill._id}
              className="bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:border-cyan-500/30 transition-all duration-300 flex flex-col justify-between shadow-xl group"
            >
              <div>
                {/* TOP ROW */}
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-xs font-mono font-semibold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                      {bill.invoiceNumber || "INV-" + bill._id.slice(-6)}
                    </span>
                    <h3 className="font-bold text-lg text-white mt-2 group-hover:text-cyan-300 transition">
                      {bill.customerName}
                    </h3>
                  </div>

                  <button
                    onClick={() => toggleStatus(bill._id, bill.status)}
                    title="Click to toggle Paid/Unpaid"
                    className={`px-3 py-1 rounded-full text-xs font-semibold border transition ${
                      bill.status === "Paid"
                        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20"
                        : "bg-amber-500/10 text-amber-400 border-amber-500/30 hover:bg-amber-500/20"
                    }`}
                  >
                    {bill.status}
                  </button>
                </div>

                {/* DETAILS */}
                <div className="mt-4 pt-4 border-t border-white/5 space-y-2 text-xs text-slate-300">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Vehicle:</span>
                    <span className="font-medium text-white">{bill.vehicleNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Service:</span>
                    <span className="font-medium text-slate-200">{bill.serviceType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Date:</span>
                    <span className="text-slate-400">
                      {new Date(bill.createdAt || Date.now()).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {/* AMOUNT */}
                <div className="mt-4 p-3 rounded-xl bg-white/5 flex items-center justify-between">
                  <span className="text-xs text-slate-400">Amount Due:</span>
                  <span className="text-lg font-black text-emerald-400">
                    Rs. {(Number(bill.amount || bill.totalAmount) || 0).toLocaleString()}
                  </span>
                </div>
              </div>

              {/* ACTION BUTTONS */}
              <div className="mt-5 pt-4 border-t border-white/10 flex items-center gap-2">
                <a
                  href={`/api/billing/${bill._id}/invoice`}
                  target="_blank"
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition"
                >
                  <Download size={14} />
                  <span>Download PDF</span>
                </a>

                <button
                  onClick={() => deleteBill(bill._id)}
                  title="Delete Invoice"
                  className="p-2.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition border border-white/5"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CREATE INVOICE MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-white/10 rounded-3xl w-full max-w-lg p-6 shadow-2xl relative">
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white p-2 rounded-full hover:bg-white/10 transition"
            >
              <X size={18} />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-400 flex items-center justify-center text-white">
                <FileText size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Create New Invoice</h3>
                <p className="text-xs text-slate-400">Generate a custom invoice for vehicle service</p>
              </div>
            </div>

            <form onSubmit={handleCreateInvoice} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-300 font-medium">Customer Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Kasun Silva"
                    value={form.customerName}
                    onChange={(e) => setForm({ ...form, customerName: e.target.value })}
                    className="w-full mt-1.5 px-3.5 py-2.5 bg-slate-950 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-300 font-medium">Phone Number</label>
                  <input
                    type="tel"
                    placeholder="e.g. +94 77 123 4567"
                    value={form.customerPhone}
                    onChange={(e) => setForm({ ...form, customerPhone: e.target.value })}
                    className="w-full mt-1.5 px-3.5 py-2.5 bg-slate-950 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-300 font-medium">Vehicle Number</label>
                  <input
                    type="text"
                    required
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
                <label className="text-xs text-slate-300 font-medium">Service Type</label>
                <select
                  value={form.serviceType}
                  onChange={(e) => setForm({ ...form, serviceType: e.target.value })}
                  className="w-full mt-1.5 px-3.5 py-2.5 bg-slate-950 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-cyan-500"
                >
                  <option>Vehicle Maintenance</option>
                  <option>Oil Change</option>
                  <option>Brake Repair</option>
                  <option>Engine Diagnostics</option>
                  <option>Tire Replacement</option>
                  <option>Car Wash & Detailing</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-300 font-medium">Amount (Rs.)</label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 7500"
                    value={form.amount}
                    onChange={(e) => setForm({ ...form, amount: e.target.value })}
                    className="w-full mt-1.5 px-3.5 py-2.5 bg-slate-950 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-300 font-medium">Payment Status</label>
                  <select
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value })}
                    className="w-full mt-1.5 px-3.5 py-2.5 bg-slate-950 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-cyan-500"
                  >
                    <option value="Unpaid">Unpaid</option>
                    <option value="Paid">Paid</option>
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
                  Save & Generate
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}