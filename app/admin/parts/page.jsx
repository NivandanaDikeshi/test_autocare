"use client";

import { useEffect, useState } from "react";
import {
  Package,
  Search,
  Plus,
  Trash2,
  AlertTriangle,
  Layers,
  DollarSign,
  Truck,
  X,
} from "lucide-react";

export default function PartsPage() {
  const [parts, setParts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [showAddModal, setShowAddModal] = useState(false);

  const [form, setForm] = useState({
    partName: "",
    category: "Filters",
    stock: 10,
    price: "",
    supplier: "",
  });

  const loadParts = async () => {
    try {
      const res = await fetch("/api/parts");
      const data = await res.json();
      setParts(data.parts || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadParts();
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    try {
      await fetch("/api/parts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      loadParts();
      setShowAddModal(false);
      setForm({
        partName: "",
        category: "Filters",
        stock: 10,
        price: "",
        supplier: "",
      });
    } catch (err) {
      console.error(err);
    }
  };

  const adjustStock = async (part, delta) => {
    const newStock = Math.max(0, Number(part.stock || 0) + delta);
    try {
      await fetch(`/api/parts/${part._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stock: newStock }),
      });
      loadParts();
    } catch (e) {
      console.error(e);
    }
  };

  const deletePart = async (id) => {
    if (!confirm("Are you sure you want to delete this part?")) return;
    try {
      await fetch(`/api/parts/${id}`, {
        method: "DELETE",
      });
      loadParts();
    } catch (e) {
      console.error(e);
    }
  };

  const categories = ["All", ...Array.from(new Set(parts.map((p) => p.category).filter(Boolean)))];

  const filteredParts = parts.filter((p) => {
    const matchesCategory =
      categoryFilter === "All" || p.category === categoryFilter;
    const term = search.toLowerCase().trim();
    const matchesSearch =
      !term ||
      (p.partName && p.partName.toLowerCase().includes(term)) ||
      (p.category && p.category.toLowerCase().includes(term)) ||
      (p.supplier && p.supplier.toLowerCase().includes(term));

    return matchesCategory && matchesSearch;
  });

  const lowStockCount = parts.filter((p) => Number(p.stock) < 5).length;
  const totalValue = parts.reduce(
    (acc, p) => acc + (Number(p.stock) || 0) * (Number(p.price) || 0),
    0
  );

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
            Spare Parts Inventory
          </h1>
          <p className="text-slate-400 mt-1">
            Track workshop spare components, stock levels, suppliers, and pricing
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:opacity-90 text-white font-semibold text-sm transition shadow-lg shadow-blue-500/20"
        >
          <Plus size={16} />
          <span>Add New Part</span>
        </button>
      </div>

      {/* STATS OVERVIEW */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-5 shadow-lg">
          <p className="text-xs text-slate-400 uppercase font-medium">Total Catalog Parts</p>
          <h2 className="text-2xl font-black text-white mt-2">{parts.length} Items</h2>
          <p className="text-xs text-slate-500 mt-1">Ready for installation</p>
        </div>

        <div className="bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-5 shadow-lg">
          <p className="text-xs text-slate-400 uppercase font-medium">Low Stock Warning</p>
          <h2 className="text-2xl font-black text-amber-400 mt-2">
            {lowStockCount} Parts Low
          </h2>
          <p className="text-xs text-amber-400/70 mt-1">Below 5 units threshold</p>
        </div>

        <div className="bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-5 shadow-lg">
          <p className="text-xs text-slate-400 uppercase font-medium">Total Inventory Value</p>
          <h2 className="text-2xl font-black text-cyan-400 mt-2">
            Rs. {totalValue.toLocaleString()}
          </h2>
          <p className="text-xs text-cyan-400/70 mt-1">Asset valuation</p>
        </div>
      </div>

      {/* SEARCH AND FILTER BAR */}
      <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-4 flex flex-col md:flex-row gap-4 items-center justify-between shadow-xl">
        <div className="relative w-full md:w-96">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search part name, category, or supplier..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-white/10 rounded-xl text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div className="flex flex-wrap gap-1.5 w-full md:w-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                categoryFilter === cat
                  ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                  : "bg-white/5 text-slate-400 hover:text-white hover:bg-white/10"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* PARTS TABLE */}
      {loading ? (
        <div className="py-24 text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-400">Loading spare parts inventory...</p>
        </div>
      ) : filteredParts.length === 0 ? (
        <div className="bg-slate-900/40 border border-white/10 rounded-2xl p-16 text-center">
          <Package size={48} className="mx-auto mb-4 text-slate-600" />
          <h3 className="text-lg font-bold text-white">No Parts in Catalog</h3>
          <p className="text-slate-400 text-sm mt-1 max-w-sm mx-auto">
            Click 'Add New Part' to enter spare items into the workshop catalog.
          </p>
        </div>
      ) : (
        <div className="bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-950/80 border-b border-white/10 text-xs text-slate-400 uppercase tracking-wider">
                <tr>
                  <th className="p-4">Part Name</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">In Stock</th>
                  <th className="p-4">Unit Price</th>
                  <th className="p-4">Supplier</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredParts.map((part) => (
                  <tr key={part._id} className="hover:bg-white/5 transition">
                    {/* NAME */}
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center font-bold">
                          <Package size={18} />
                        </div>
                        <div>
                          <p className="font-semibold text-white">{part.partName}</p>
                          {Number(part.stock) < 5 && (
                            <span className="inline-flex items-center gap-1 text-[11px] text-amber-400 mt-0.5">
                              <AlertTriangle size={11} /> Low Stock
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* CATEGORY */}
                    <td className="p-4">
                      <span className="px-2.5 py-1 rounded-md text-xs font-medium bg-white/5 border border-white/10 text-slate-300">
                        {part.category}
                      </span>
                    </td>

                    {/* STOCK LEVEL WITH QUICK +/- */}
                    <td className="p-4">
                      <div className="inline-flex items-center gap-2">
                        <button
                          onClick={() => adjustStock(part, -1)}
                          className="w-6 h-6 rounded bg-white/5 hover:bg-white/10 text-slate-300 flex items-center justify-center font-bold text-xs"
                        >
                          -
                        </button>
                        <span
                          className={`font-bold px-2 py-0.5 rounded text-xs ${
                            Number(part.stock) < 5
                              ? "bg-amber-500/15 text-amber-400 border border-amber-500/30"
                              : "text-white"
                          }`}
                        >
                          {part.stock} units
                        </span>
                        <button
                          onClick={() => adjustStock(part, 1)}
                          className="w-6 h-6 rounded bg-white/5 hover:bg-white/10 text-slate-300 flex items-center justify-center font-bold text-xs"
                        >
                          +
                        </button>
                      </div>
                    </td>

                    {/* PRICE */}
                    <td className="p-4 font-bold text-emerald-400">
                      Rs. {(Number(part.price) || 0).toLocaleString()}
                    </td>

                    {/* SUPPLIER */}
                    <td className="p-4 text-xs text-slate-400">
                      {part.supplier || "Standard Distributor"}
                    </td>

                    {/* ACTIONS */}
                    <td className="p-4 text-right">
                      <button
                        onClick={() => deletePart(part._id)}
                        title="Delete Part"
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

      {/* ADD PART MODAL */}
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
                <Package size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Add Spare Part</h3>
                <p className="text-xs text-slate-400">Enter new item into the inventory catalogue</p>
              </div>
            </div>

            <form onSubmit={submit} className="space-y-4">
              <div>
                <label className="text-xs text-slate-300 font-medium">Part Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Synthetic Engine Oil 5W-30"
                  value={form.partName}
                  onChange={(e) => setForm({ ...form, partName: e.target.value })}
                  className="w-full mt-1.5 px-3.5 py-2.5 bg-slate-950 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-300 font-medium">Category</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full mt-1.5 px-3.5 py-2.5 bg-slate-950 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-cyan-500"
                  >
                    <option>Filters</option>
                    <option>Oils & Lubricants</option>
                    <option>Braking System</option>
                    <option>Tires & Wheels</option>
                    <option>Electrical & Battery</option>
                    <option>Engine Components</option>
                    <option>Body & Detailing</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-slate-300 font-medium">Initial Stock</label>
                  <input
                    type="number"
                    required
                    min={0}
                    placeholder="e.g. 25"
                    value={form.stock}
                    onChange={(e) => setForm({ ...form, stock: e.target.value })}
                    className="w-full mt-1.5 px-3.5 py-2.5 bg-slate-950 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-300 font-medium">Unit Price (Rs.)</label>
                  <input
                    type="number"
                    required
                    min={0}
                    placeholder="e.g. 4500"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    className="w-full mt-1.5 px-3.5 py-2.5 bg-slate-950 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-300 font-medium">Supplier / Vendor</label>
                  <input
                    type="text"
                    placeholder="e.g. Bosch Lanka"
                    value={form.supplier}
                    onChange={(e) => setForm({ ...form, supplier: e.target.value })}
                    className="w-full mt-1.5 px-3.5 py-2.5 bg-slate-950 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-cyan-500"
                  />
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
                  Save Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}