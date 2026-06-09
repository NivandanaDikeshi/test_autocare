"use client";

import { useState } from "react";

export default function AddInvoiceModal({
  open,
  onClose,
  onAdded,
}) {
  const [form, setForm] = useState({
    invoiceNumber: "",
    customerName: "",
    vehicle: "",
    service: "",
    amount: "",
  });

  const submit = async (e) => {
    e.preventDefault();

    await fetch("/api/invoices", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    onAdded();
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center">
      <div className="bg-slate-900 p-6 rounded-2xl w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-4">
          Add Invoice
        </h2>

        <form onSubmit={submit}>
          <input
            className="w-full p-3 mb-3 rounded-lg"
            placeholder="Invoice Number"
            onChange={(e) =>
              setForm({
                ...form,
                invoiceNumber: e.target.value,
              })
            }
          />

          <input
            className="w-full p-3 mb-3 rounded-lg"
            placeholder="Customer Name"
            onChange={(e) =>
              setForm({
                ...form,
                customerName: e.target.value,
              })
            }
          />

          <input
            className="w-full p-3 mb-3 rounded-lg"
            placeholder="Vehicle"
            onChange={(e) =>
              setForm({
                ...form,
                vehicle: e.target.value,
              })
            }
          />

          <input
            className="w-full p-3 mb-3 rounded-lg"
            placeholder="Service"
            onChange={(e) =>
              setForm({
                ...form,
                service: e.target.value,
              })
            }
          />

          <input
            className="w-full p-3 mb-4 rounded-lg"
            placeholder="Amount"
            type="number"
            onChange={(e) =>
              setForm({
                ...form,
                amount: e.target.value,
              })
            }
          />

          <button className="bg-blue-600 px-5 py-3 rounded-xl">
            Save Invoice
          </button>
        </form>
      </div>
    </div>
  );
}