"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  FileText,
  Search,
  Download,
  Car,
  CheckCircle2,
  Clock,
  ShieldCheck,
  DollarSign,
} from "lucide-react";

function BillingContent() {
  const searchParams = useSearchParams();
  const initialSearch =
    searchParams.get("v") ||
    searchParams.get("search") ||
    searchParams.get("phone") ||
    searchParams.get("vehicle") ||
    "";

  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(initialSearch);
  const [userVehicles, setUserVehicles] = useState([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("userData");
      if (stored) {
        const u = JSON.parse(stored);
        if (Array.isArray(u.vehicles) && u.vehicles.length > 0) {
          setUserVehicles(u.vehicles);
        }
      }
    } catch (e) {}
  }, []);

  const fetchBills = async () => {
    try {
      const res = await fetch("/api/billing");
      const data = await res.json();
      if (data.success) {
        setBills(data.bills || []);
      }
    } catch (error) {
      console.error("Failed to load bills:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBills();
  }, []);

  const filteredBills = bills.filter((b) => {
    const term = search.toLowerCase().trim();
    if (!term) return true;
    return (
      (b.vehicleNumber && b.vehicleNumber.toLowerCase().includes(term)) ||
      (b.invoiceNumber && b.invoiceNumber.toLowerCase().includes(term)) ||
      (b.customerName && b.customerName.toLowerCase().includes(term))
    );
  });

  return (
    <div className="space-y-10">
      {/* SEARCH BOX */}
      <div className="max-w-2xl mx-auto bg-slate-900/70 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl">
        <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-2 text-center">
          Search Invoices by Vehicle or Customer Name
        </label>
        <div className="relative">
          <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Enter license plate (e.g. CAA-1234) or invoice #..."
            className="w-full pl-12 pr-4 py-3.5 bg-slate-950 border border-white/10 rounded-2xl text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 uppercase font-medium"
          />
        </div>

        {userVehicles.length > 0 && (
          <div className="flex flex-wrap items-center justify-center gap-2 mt-4 pt-3 border-t border-white/5">
            <span className="text-xs text-slate-400">Quick Filter by Your Garage:</span>
            {userVehicles.map((v, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setSearch(v.vehicleNumber)}
                className={`px-3 py-1 rounded-lg text-xs font-mono transition border ${
                  search.toUpperCase() === v.vehicleNumber
                    ? "bg-cyan-500 text-slate-950 font-bold border-cyan-400 shadow"
                    : "bg-white/5 text-cyan-300 hover:bg-white/10 border-white/10"
                }`}
              >
                {v.vehicleNumber}
              </button>
            ))}
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="text-xs text-slate-400 hover:text-white underline ml-1"
              >
                Clear
              </button>
            )}
          </div>
        )}
      </div>

      {/* BILLING CARDS */}
      {loading ? (
        <div className="py-24 text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-400">Loading service invoices...</p>
        </div>
      ) : filteredBills.length === 0 ? (
        <div className="max-w-md mx-auto bg-slate-900/40 border border-white/10 rounded-3xl p-12 text-center shadow-xl">
          <FileText size={48} className="mx-auto mb-4 text-slate-600" />
          <h3 className="text-lg font-bold text-white">No Invoices Found</h3>
          <p className="text-slate-400 text-sm mt-1">
            Invoices are generated upon completion of workshop repairs.
          </p>
          <Link
            href="/status"
            className="inline-block mt-6 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition"
          >
            Check Repair Status
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBills.map((bill) => (
            <div
              key={bill._id}
              className="bg-slate-900/60 backdrop-blur-2xl border border-white/10 rounded-3xl p-5 sm:p-7 hover:border-cyan-500/30 transition-all duration-300 flex flex-col justify-between shadow-2xl group"
            >
              <div>
                {/* TOP HEADER */}
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-xs font-mono font-semibold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                      {bill.invoiceNumber || "INV-" + bill._id.slice(-6)}
                    </span>
                    <h3 className="text-xl font-bold text-white mt-2 group-hover:text-cyan-300 transition">
                      {bill.customerName}
                    </h3>
                  </div>

                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                      bill.status === "Paid"
                        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                        : "bg-amber-500/10 text-amber-400 border-amber-500/30"
                    }`}
                  >
                    {bill.status}
                  </span>
                </div>

                {/* DETAILS */}
                <div className="mt-5 space-y-2.5 text-xs text-slate-300 pt-4 border-t border-white/5">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Vehicle Number:</span>
                    <span className="font-semibold text-white">{bill.vehicleNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Service:</span>
                    <span className="text-slate-300">{bill.serviceType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Invoice Date:</span>
                    <span className="text-slate-400">
                      {new Date(bill.createdAt || Date.now()).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {/* AMOUNT DUE */}
                <div className="mt-5 p-4 rounded-2xl bg-slate-950/70 border border-white/5 flex items-center justify-between">
                  <span className="text-xs text-slate-400">Total Billed:</span>
                  <span className="text-xl font-black text-emerald-400">
                    Rs. {(Number(bill.amount || bill.totalAmount) || 0).toLocaleString()}
                  </span>
                </div>
              </div>

              {/* DOWNLOAD ACTION */}
              <div className="mt-6 pt-4 border-t border-white/10">
                <a
                  href={`/api/billing/${bill._id}/invoice`}
                  target="_blank"
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold text-sm hover:opacity-95 transition shadow-lg shadow-blue-500/25"
                >
                  <Download size={16} />
                  <span>Download PDF Invoice</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function BillingPage() {
  return (
    <section className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-black text-white py-12 sm:py-20 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="text-center mb-14">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-xs font-semibold uppercase tracking-wider">
            <FileText size={14} /> Service Billing & Receipts
          </span>

          <h1 className="text-4xl md:text-6xl font-black mt-6 tracking-tight">
            Customer <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">Invoices</span>
          </h1>

          <p className="text-slate-400 text-sm md:text-base mt-3 max-w-xl mx-auto">
            Look up your service history and download official stamped PDF receipts.
          </p>
        </div>

        <Suspense fallback={<div className="text-center py-20 text-slate-400">Loading invoices...</div>}>
          <BillingContent />
        </Suspense>
      </div>
    </section>
  );
}