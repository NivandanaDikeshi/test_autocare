"use client";

import { useEffect, useState } from "react";

export default function BillingPage() {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBills();
  }, []);

  const fetchBills = async () => {
    try {
      const res = await fetch("/api/billing");
      const data = await res.json();

      if (data.success) {
        setBills(data.bills);
      }
    } catch (error) {
      console.error("Failed to load bills:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Paid":
        return "bg-green-600";
      case "Unpaid":
        return "bg-red-600";
      default:
        return "bg-yellow-600";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black text-white p-6 md:p-10">

      {/* HEADER */}
      <h1 className="text-4xl font-bold mb-8">
        My Billing
      </h1>

      {/* LOADING */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : bills.length === 0 ? (
        <div className="text-center text-gray-400 mt-20">
          No invoices found
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

          {/* BILL CARD */}
          {bills.map((bill) => (
            <div
              key={bill._id}
              className="bg-slate-900 border border-slate-800 p-6 rounded-2xl hover:scale-[1.02] transition"
            >

              <h2 className="text-xl font-bold">
                {bill.customerName}
              </h2>

              <p className="text-gray-400 mt-2">
                Vehicle: {bill.vehicleNumber}
              </p>

              <p className="text-gray-400">
                Service: {bill.serviceType}
              </p>

              <p className="mt-3 text-lg font-bold text-green-400">
                Total: Rs {bill.amount || bill.totalAmount}
              </p>

              {/* STATUS */}
              <span
                className={`inline-block mt-3 px-3 py-1 rounded-full text-sm text-white ${getStatusColor(
                  bill.status || bill.paymentStatus
                )}`}
              >
                {bill.status || bill.paymentStatus}
              </span>

              {/* DOWNLOAD BUTTON */}
              <a
                href={`/api/billing/${bill._id}/invoice`}
                target="_blank"
                rel="noopener noreferrer"
                className="block mt-5 bg-green-600 hover:bg-green-700 text-center py-2 rounded-lg font-medium"
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