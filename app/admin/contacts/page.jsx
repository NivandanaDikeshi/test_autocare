"use client";

import { useEffect, useState } from "react";
import {
  MessageSquare,
  Search,
  Mail,
  Phone,
  Trash2,
  CheckCircle,
  Clock,
  ExternalLink,
  X,
  Send,
} from "lucide-react";

export default function AdminContactsPage() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const fetchContacts = async () => {
    try {
      const res = await fetch("/api/contact");
      const data = await res.json();
      setContacts(data.contacts || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const toggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === "Replied" ? "New" : "Replied";
    try {
      const res = await fetch(`/api/contact/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        fetchContacts();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const deleteContact = async (id) => {
    if (!confirm("Are you sure you want to delete this message?")) return;
    try {
      const res = await fetch(`/api/contact/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        fetchContacts();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const filteredContacts = contacts.filter((c) => {
    const matchesStatus =
      statusFilter === "All" || (c.status || "New") === statusFilter;
    const term = search.toLowerCase().trim();
    const matchesSearch =
      !term ||
      (c.fullName && c.fullName.toLowerCase().includes(term)) ||
      (c.email && c.email.toLowerCase().includes(term)) ||
      (c.phone && c.phone.toLowerCase().includes(term)) ||
      (c.message && c.message.toLowerCase().includes(term));

    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
            Customer Inquiries
          </h1>
          <p className="text-slate-400 mt-1">
            Review questions, assistance requests, and feedback submitted by clients
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="px-4 py-2 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-semibold">
            {contacts.length} Total Messages
          </div>
          <div className="px-4 py-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm font-semibold">
            {contacts.filter((c) => (c.status || "New") === "New").length} Unanswered
          </div>
        </div>
      </div>

      {/* SEARCH AND FILTERS */}
      <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-4 flex flex-col md:flex-row gap-4 items-center justify-between shadow-xl">
        <div className="relative w-full md:w-96">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search inquiries by sender, email, message..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-white/10 rounded-xl text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div className="flex gap-2 w-full md:w-auto">
          {["All", "New", "Replied"].map((status) => (
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

      {/* CONTENT */}
      {loading ? (
        <div className="py-24 text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-400">Loading inquiries...</p>
        </div>
      ) : filteredContacts.length === 0 ? (
        <div className="bg-slate-900/40 border border-white/10 rounded-2xl p-16 text-center">
          <MessageSquare size={48} className="mx-auto mb-4 text-slate-600" />
          <h3 className="text-lg font-bold text-white">No Messages Found</h3>
          <p className="text-slate-400 text-sm mt-1 max-w-sm mx-auto">
            Messages submitted via the contact page will appear here.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredContacts.map((c) => {
            const isReplied = c.status === "Replied";
            return (
              <div
                key={c._id}
                className="bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-xl flex flex-col justify-between hover:border-cyan-500/30 transition-all duration-300 group"
              >
                <div>
                  {/* HEADER */}
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-bold text-lg text-white group-hover:text-cyan-300 transition">
                        {c.fullName}
                      </h3>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {new Date(c.createdAt || Date.now()).toLocaleString()}
                      </p>
                    </div>

                    <button
                      onClick={() => toggleStatus(c._id, c.status || "New")}
                      className={`text-xs px-2.5 py-1 rounded-full font-semibold border transition ${
                        isReplied
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20"
                          : "bg-amber-500/10 text-amber-400 border-amber-500/30 hover:bg-amber-500/20"
                      }`}
                    >
                      {isReplied ? "Replied" : "New"}
                    </button>
                  </div>

                  {/* CONTACT INFO */}
                  <div className="space-y-1.5 text-xs text-slate-300">
                    <p className="flex items-center gap-2">
                      <Mail size={13} className="text-slate-400" />
                      <span>{c.email}</span>
                    </p>
                    {c.phone && (
                      <p className="flex items-center gap-2">
                        <Phone size={13} className="text-slate-400" />
                        <span>{c.phone}</span>
                      </p>
                    )}
                  </div>

                  {/* MESSAGE TEXT */}
                  <div className="mt-4 p-4 rounded-xl bg-slate-950/60 border border-white/5 text-slate-200 text-sm leading-relaxed">
                    {c.message}
                  </div>
                </div>

                {/* ACTIONS */}
                <div className="mt-6 pt-4 border-t border-white/10 flex items-center gap-2">
                  <a
                    href={`mailto:${c.email}?subject=RE: AutoCare Pro Inquiry - ${encodeURIComponent(
                      c.fullName
                    )}&body=Dear ${encodeURIComponent(
                      c.fullName
                    )},%0D%0A%0D%0AThank you for contacting AutoCare Pro regarding your vehicle inquiry.`}
                    onClick={() => {
                      if (!isReplied) toggleStatus(c._id, "New");
                    }}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition"
                  >
                    <Send size={13} />
                    <span>Reply via Email</span>
                  </a>

                  <button
                    onClick={() => deleteContact(c._id)}
                    title="Delete Message"
                    className="p-2.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition border border-white/5"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}