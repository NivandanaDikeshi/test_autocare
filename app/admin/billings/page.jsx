"use client";

import { useEffect, useState } from "react";

export default function BillingPage() {
  const [bills, setBills] = useState([]);
  const [filteredBills, setFilteredBills] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  useEffect(() => {
    fetchBills();
  }, []);

  useEffect(() => {
    filterData();
  }, [search, statusFilter, bills]);

  const fetchBills = async () => {
    try {
      const res = await fetch("/api/billing");
      const data = await res.json();

      if (data.success) {
        setBills(data.bills);
        setFilteredBills(data.bills);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filterData = () => {
    let data = [...bills];

    if (search) {
      data = data.filter(
        (b) =>
          (b.invoiceNumber || "")
            .toLowerCase()
            .includes(search.toLowerCase()) ||
          (b.customerName || "")
            .toLowerCase()
            .includes(search.toLowerCase())
      );
    }

    if (statusFilter !== "All") {
      data = data.filter((b) => b.status === statusFilter);
    }

    setFilteredBills(data);
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "Paid":
        return "bg-green-500/10 text-green-400 border border-green-500/30";
      case "Unpaid":
        return "bg-yellow-500/10 text-yellow-400 border border-yellow-500/30";
      default:
        return "bg-gray-500/10 text-gray-400 border border-gray-500/30";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black text-white p-6 md:p-10">

      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-4xl md:text-5xl font-black tracking-tight">
          Billing Dashboard
        </h1>
        <p className="text-slate-400 mt-2">
          Manage invoices, payments and download reports
        </p>
      </div>

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">

        <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
          <p className="text-slate-400 text-sm">Total Invoices</p>
          <h2 className="text-2xl font-bold">{bills.length}</h2>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
          <p className="text-slate-400 text-sm">Unpaid</p>
          <h2 className="text-2xl font-bold text-yellow-400">
            {bills.filter((b) => b.status === "Unpaid").length}
          </h2>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
          <p className="text-slate-400 text-sm">Paid</p>
          <h2 className="text-2xl font-bold text-green-400">
            {bills.filter((b) => b.status === "Paid").length}
          </h2>
        </div>

      </div>

      {/* FILTER BAR */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-4 mb-8 flex flex-col md:flex-row gap-4">

        <input
          type="text"
          placeholder="Search invoice or customer..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-1/2 bg-black/30 border border-white/10 rounded-xl px-4 py-2 text-white"
        />

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="w-full md:w-1/4 bg-black/30 border border-white/10 rounded-xl px-4 py-2 text-white"
        >
          <option value="All">All</option>
          <option value="Paid">Paid</option>
          <option value="Unpaid">Unpaid</option>
        </select>

      </div>

      {/* CONTENT */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
        </div>
      ) : filteredBills.length === 0 ? (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-10 text-center">
          <div className="text-5xl mb-3">📄</div>
          <h2 className="text-xl font-bold">No Invoices Found</h2>
          <p className="text-slate-400 mt-2">
            Try adjusting search or filter
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

          {filteredBills.map((bill) => (
            <div
              key={bill._id}
              className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:bg-white/10 transition"
            >

              {/* HEADER */}
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="font-bold text-lg">
                    {bill.invoiceNumber}
                  </h2>
                  <p className="text-slate-400 text-sm">
                    {bill.customerName}
                  </p>
                </div>

                <span
                  className={`px-3 py-1 text-xs rounded-full ${getStatusStyle(
                    bill.status
                  )}`}
                >
                  {bill.status}
                </span>
              </div>

              {/* DETAILS */}
              <div className="mt-4 text-sm text-slate-300 space-y-1">
                <p>Service: {bill.serviceType}</p>
                <p className="font-semibold text-white">
                  Rs. {bill.amount}
                </p>
              </div>

              {/* BUTTON */}
              <a
                href={`/api/billing/${bill._id}/invoice`}
                target="_blank"
                className="block mt-5 text-center bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-2 rounded-xl font-medium"
              >
                Download Invoice
              </a>

            </div>
          ))}

        </div>
      )}
    </div>
  );
}