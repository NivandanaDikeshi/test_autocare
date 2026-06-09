"use client";

import { useEffect, useState } from "react";

export default function AdminContactsPage() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/contact")
      .then((res) => res.json())
      .then((data) => {
        setContacts(data.contacts || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-black text-white p-6 md:p-10">
      
      {/* HEADER */}
      <div className="mb-10">
        <h1 className="text-4xl font-extrabold tracking-tight">
          📩 Contact Messages
        </h1>
        <p className="text-slate-400 mt-2">
          Manage all customer inquiries in one place
        </p>
      </div>

      {/* LOADING */}
      {loading && (
        <div className="text-slate-400 animate-pulse">
          Loading messages...
        </div>
      )}

      {/* EMPTY STATE */}
      {!loading && contacts.length === 0 && (
        <div className="text-slate-400 text-center py-20 border border-slate-800 rounded-2xl bg-slate-900/40">
          No messages found
        </div>
      )}

      {/* GRID */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {contacts.map((c) => (
          <div
            key={c._id}
            className="group bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 shadow-lg hover:shadow-blue-500/10 hover:border-blue-500/30 transition-all duration-300"
          >
            
            {/* HEADER */}
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-lg font-bold text-blue-400 group-hover:text-blue-300">
                  {c.fullName}
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  {new Date(c.createdAt).toLocaleString()}
                </p>
              </div>

              {/* badge */}
              <span className="text-xs px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                New
              </span>
            </div>

            {/* CONTACT INFO */}
            <div className="space-y-2 text-sm text-slate-300">
              <p>
                <span className="text-slate-500">📧</span> {c.email}
              </p>
              <p>
                <span className="text-slate-500">📞</span> {c.phone}
              </p>
            </div>

            {/* MESSAGE BOX */}
            <div className="mt-4 p-4 rounded-xl bg-slate-800/50 border border-slate-700 text-slate-200 text-sm leading-relaxed">
              {c.message}
            </div>

            {/* ACTIONS */}
            <div className="mt-5 flex gap-2">
              <button className="flex-1 bg-blue-600 hover:bg-blue-700 py-2 rounded-lg text-sm font-semibold transition">
                Reply
              </button>
              <button className="px-4 py-2 bg-red-500/10 text-red-400 border border-red-500/20 rounded-lg hover:bg-red-500/20 transition text-sm">
                Delete
              </button>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}