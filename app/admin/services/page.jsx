"use client";

import { useEffect, useState } from "react";
import {
  Wrench,
  Search,
  Plus,
  Trash2,
  Edit3,
  CheckCircle,
  Clock,
  Car,
  User,
  AlertCircle,
  X,
  Layers,
  Sparkles,
  Tag,
  DollarSign,
  Activity,
  FileText,
} from "lucide-react";

export default function ServicesPage() {
  const [activeTab, setActiveTab] = useState("catalog"); // "catalog" | "repairs"

  // ----------------------------------------
  // CATALOG STATE
  // ----------------------------------------
  const [catalogItems, setCatalogItems] = useState([]);
  const [loadingCatalog, setLoadingCatalog] = useState(true);
  const [catalogSearch, setCatalogSearch] = useState("");
  const [catalogCategoryFilter, setCatalogCategoryFilter] = useState("All");

  const [showCatalogModal, setShowCatalogModal] = useState(false);
  const [editingCatalogItem, setEditingCatalogItem] = useState(null);
  const [catalogForm, setCatalogForm] = useState({
    title: "",
    category: "Preventative",
    price: 3500,
    estimatedTime: "1-2 Hours",
    description: "",
    longDescription: "",
    features: "",
    popular: false,
  });

  // ----------------------------------------
  // WORKSHOP REPAIR TRACKING STATE
  // ----------------------------------------
  const [repairs, setRepairs] = useState([]);
  const [loadingRepairs, setLoadingRepairs] = useState(true);
  const [repairSearch, setRepairSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [showAddRepairModal, setShowAddRepairModal] = useState(false);

  const [repairForm, setRepairForm] = useState({
    customerName: "",
    vehicleNumber: "",
    serviceType: "Vehicle Maintenance",
    mechanic: "Lead Technician",
    notes: "",
    cost: 5000,
    status: "Received",
  });

  // ----------------------------------------
  // LOAD DATA
  // ----------------------------------------
  const loadCatalog = async () => {
    try {
      setLoadingCatalog(true);
      const res = await fetch("/api/services/catalog");
      const data = await res.json();
      setCatalogItems(data.services || []);
    } catch (err) {
      console.error("Failed to load catalog:", err);
    } finally {
      setLoadingCatalog(false);
    }
  };

  const loadRepairs = async () => {
    try {
      setLoadingRepairs(true);
      const res = await fetch("/api/services");
      const data = await res.json();
      setRepairs(data.services || []);
    } catch (err) {
      console.error("Failed to load repairs:", err);
    } finally {
      setLoadingRepairs(false);
    }
  };

  useEffect(() => {
    loadCatalog();
    loadRepairs();
  }, []);

  // ----------------------------------------
  // CATALOG ACTIONS
  // ----------------------------------------
  const openAddCatalog = () => {
    setEditingCatalogItem(null);
    setCatalogForm({
      title: "",
      category: "Preventative",
      price: 4500,
      estimatedTime: "1-2 Hours",
      description: "",
      longDescription: "",
      features: "Complete Diagnostic Inspection\nFluid Level Checks\nMulti-Point Safety Report",
      popular: false,
    });
    setShowCatalogModal(true);
  };

  const openEditCatalog = (item) => {
    setEditingCatalogItem(item);
    setCatalogForm({
      title: item.title || "",
      category: item.category || "General",
      price: item.price || 0,
      estimatedTime: item.estimatedTime || "1-2 Hours",
      description: item.description || "",
      longDescription: item.longDescription || "",
      features: Array.isArray(item.features) ? item.features.join("\n") : "",
      popular: Boolean(item.popular),
    });
    setShowCatalogModal(true);
  };

  const submitCatalogForm = async (e) => {
    e.preventDefault();
    try {
      const url = editingCatalogItem
        ? `/api/services/catalog/${editingCatalogItem._id || editingCatalogItem.slug}`
        : `/api/services/catalog`;
      const method = editingCatalogItem ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(catalogForm),
      });

      const data = await res.json();
      if (data.success) {
        setShowCatalogModal(false);
        loadCatalog();
      } else {
        alert(data.message || "Failed to save service");
      }
    } catch (err) {
      console.error("Error saving catalog item:", err);
      alert("An error occurred while saving.");
    }
  };

  const deleteCatalogItem = async (id) => {
    if (!confirm("Are you sure you want to delete this service package? It will no longer appear on the website."))
      return;

    try {
      const res = await fetch(`/api/services/catalog/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        loadCatalog();
      } else {
        alert(data.message || "Failed to delete service package");
      }
    } catch (err) {
      console.error("Error deleting catalog item:", err);
    }
  };

  // ----------------------------------------
  // REPAIR ACTIONS
  // ----------------------------------------
  const submitRepairForm = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(repairForm),
      });
      const data = await res.json();
      if (data.success) {
        loadRepairs();
        setShowAddRepairModal(false);
        setRepairForm({
          customerName: "",
          vehicleNumber: "",
          serviceType: "Vehicle Maintenance",
          mechanic: "Lead Technician",
          notes: "",
          cost: 5000,
          status: "Received",
        });
      }
    } catch (err) {
      console.error("Error adding repair:", err);
    }
  };

  const updateRepairStatus = async (id, status) => {
    try {
      await fetch(`/api/services/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      loadRepairs();
    } catch (err) {
      console.error(err);
    }
  };

  const deleteRepair = async (id) => {
    if (!confirm("Are you sure you want to delete this workshop service job?")) return;
    try {
      await fetch(`/api/services/${id}`, {
        method: "DELETE",
      });
      loadRepairs();
    } catch (err) {
      console.error(err);
    }
  };

  // ----------------------------------------
  // FILTERING
  // ----------------------------------------
  const catalogCategories = ["All", ...new Set(catalogItems.map((c) => c.category).filter(Boolean))];

  const filteredCatalog = catalogItems.filter((item) => {
    const matchesCategory = catalogCategoryFilter === "All" || item.category === catalogCategoryFilter;
    const term = catalogSearch.toLowerCase().trim();
    const matchesSearch =
      !term ||
      item.title?.toLowerCase().includes(term) ||
      item.category?.toLowerCase().includes(term) ||
      item.description?.toLowerCase().includes(term);
    return matchesCategory && matchesSearch;
  });

  const filteredRepairs = repairs.filter((s) => {
    const matchesStatus = statusFilter === "All" || s.status === statusFilter;
    const term = repairSearch.toLowerCase().trim();
    const matchesSearch =
      !term ||
      (s.customerName && s.customerName.toLowerCase().includes(term)) ||
      (s.vehicleNumber && s.vehicleNumber.toLowerCase().includes(term)) ||
      (s.serviceType && s.serviceType.toLowerCase().includes(term)) ||
      (s.mechanic && s.mechanic.toLowerCase().includes(term));
    return matchesStatus && matchesSearch;
  });

  const getStageColor = (status) => {
    switch (status) {
      case "Received":
        return "bg-slate-500/20 text-slate-300 border-slate-500/30";
      case "Checking":
        return "bg-amber-500/20 text-amber-300 border-amber-500/30";
      case "Repairing":
        return "bg-blue-500/20 text-blue-300 border-blue-500/30";
      case "Completed":
        return "bg-emerald-500/20 text-emerald-300 border-emerald-500/30";
      default:
        return "bg-gray-500/20 text-gray-300 border-gray-500/30";
    }
  };

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
            Services & Workshop Management
          </h1>
          <p className="text-slate-400 mt-1">
            Manage customer-facing service catalog packages, pricing, and live workshop repair job cards
          </p>
        </div>

        <div className="flex items-center gap-3">
          {activeTab === "catalog" ? (
            <button
              onClick={openAddCatalog}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:opacity-90 text-white font-semibold text-sm transition shadow-lg shadow-blue-500/20"
            >
              <Plus size={16} />
              <span>Add Service Package</span>
            </button>
          ) : (
            <button
              onClick={() => setShowAddRepairModal(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:opacity-90 text-white font-semibold text-sm transition shadow-lg shadow-blue-500/20"
            >
              <Plus size={16} />
              <span>New Job Card</span>
            </button>
          )}
        </div>
      </div>

      {/* TAB NAVIGATION */}
      <div className="flex items-center gap-2 p-1.5 bg-slate-900/80 border border-white/10 rounded-2xl w-fit">
        <button
          onClick={() => setActiveTab("catalog")}
          className={`flex items-center gap-2.5 px-5 py-2.5 rounded-xl text-sm font-semibold transition ${
            activeTab === "catalog"
              ? "bg-blue-600 text-white shadow-lg shadow-blue-500/25"
              : "text-slate-400 hover:text-white hover:bg-white/5"
          }`}
        >
          <Layers size={17} />
          <span>Service Catalog & Pricing</span>
          <span
            className={`px-2 py-0.5 rounded-full text-xs font-bold ${
              activeTab === "catalog" ? "bg-white/20 text-white" : "bg-slate-800 text-slate-300"
            }`}
          >
            {catalogItems.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab("repairs")}
          className={`flex items-center gap-2.5 px-5 py-2.5 rounded-xl text-sm font-semibold transition ${
            activeTab === "repairs"
              ? "bg-blue-600 text-white shadow-lg shadow-blue-500/25"
              : "text-slate-400 hover:text-white hover:bg-white/5"
          }`}
        >
          <Activity size={17} />
          <span>Live Workshop Repairs</span>
          <span
            className={`px-2 py-0.5 rounded-full text-xs font-bold ${
              activeTab === "repairs" ? "bg-white/20 text-white" : "bg-slate-800 text-slate-300"
            }`}
          >
            {repairs.length}
          </span>
        </button>
      </div>

      {/* ======================================================== */}
      {/* TAB 1: SERVICE CATALOG & PRICING                         */}
      {/* ======================================================== */}
      {activeTab === "catalog" && (
        <div className="space-y-6">
          {/* SEARCH & CATEGORY FILTER */}
          <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-4 flex flex-col md:flex-row gap-4 items-center justify-between shadow-xl">
            <div className="relative w-full md:w-96">
              <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search packages, categories, or descriptions..."
                value={catalogSearch}
                onChange={(e) => setCatalogSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-white/10 rounded-xl text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div className="flex flex-wrap gap-1.5 w-full md:w-auto">
              {catalogCategories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCatalogCategoryFilter(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                    catalogCategoryFilter === cat
                      ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                      : "bg-white/5 text-slate-400 hover:text-white hover:bg-white/10"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* CATALOG GRID */}
          {loadingCatalog ? (
            <div className="py-24 text-center">
              <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-slate-400">Loading catalog packages...</p>
            </div>
          ) : filteredCatalog.length === 0 ? (
            <div className="bg-slate-900/40 border border-white/10 rounded-2xl p-16 text-center">
              <Layers size={48} className="mx-auto mb-4 text-slate-600" />
              <h3 className="text-lg font-bold text-white">No Service Packages Found</h3>
              <p className="text-slate-400 text-sm mt-1 max-w-sm mx-auto">
                Add a new service package to display it on the customer-facing website and booking portal.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCatalog.map((item) => (
                <div
                  key={item._id}
                  className="bg-slate-900/50 backdrop-blur-xl border border-white/10 hover:border-cyan-500/30 rounded-2xl p-6 transition duration-200 flex flex-col justify-between shadow-xl group"
                >
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                          {item.category}
                        </span>
                        {item.popular && (
                          <span className="flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30">
                            <Sparkles size={11} />
                            Popular
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition">
                        <button
                          onClick={() => openEditCatalog(item)}
                          title="Edit Service"
                          className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition"
                        >
                          <Edit3 size={15} />
                        </button>
                        <button
                          onClick={() => deleteCatalogItem(item._id)}
                          title="Delete Service"
                          className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>

                    <h3 className="text-xl font-bold text-white group-hover:text-cyan-300 transition">
                      {item.title}
                    </h3>
                    <p className="text-slate-400 text-xs mt-2 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>

                    {item.features && item.features.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-white/5 space-y-1.5">
                        <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                          Key Features ({item.features.length})
                        </p>
                        <ul className="space-y-1 text-xs text-slate-300">
                          {item.features.slice(0, 3).map((f, i) => (
                            <li key={i} className="flex items-center gap-1.5">
                              <CheckCircle size={12} className="text-emerald-400 shrink-0" />
                              <span className="truncate">{f}</span>
                            </li>
                          ))}
                          {item.features.length > 3 && (
                            <li className="text-[11px] text-cyan-400 font-medium pl-4">
                              +{item.features.length - 3} more included
                            </li>
                          )}
                        </ul>
                      </div>
                    )}
                  </div>

                  <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
                    <div>
                      <p className="text-[11px] text-slate-400">Standard Price</p>
                      <p className="text-xl font-black text-white">
                        Rs. {Number(item.price || 0).toLocaleString()}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-[11px] text-slate-400">Duration</p>
                      <p className="text-xs font-semibold text-slate-200 flex items-center gap-1 justify-end">
                        <Clock size={12} className="text-cyan-400" />
                        {item.estimatedTime || "1-2 Hours"}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 2: LIVE WORKSHOP REPAIRS (JOB CARDS)                 */}
      {/* ======================================================== */}
      {activeTab === "repairs" && (
        <div className="space-y-6">
          {/* STAGE PIPELINE STATS */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Received", count: repairs.filter((s) => s.status === "Received").length, color: "text-slate-300", bg: "border-slate-700/50" },
              { label: "Inspection / Checking", count: repairs.filter((s) => s.status === "Checking").length, color: "text-amber-400", bg: "border-amber-500/20" },
              { label: "Repairing in Bay", count: repairs.filter((s) => s.status === "Repairing").length, color: "text-blue-400", bg: "border-blue-500/20" },
              { label: "Ready / Completed", count: repairs.filter((s) => s.status === "Completed").length, color: "text-emerald-400", bg: "border-emerald-500/20" },
            ].map((item, i) => (
              <div key={i} className={`bg-slate-900/50 backdrop-blur-xl border ${item.bg} rounded-2xl p-4 shadow-lg`}>
                <p className="text-xs text-slate-400 font-medium">{item.label}</p>
                <h3 className={`text-2xl font-black ${item.color} mt-1.5`}>{item.count}</h3>
              </div>
            ))}
          </div>

          {/* SEARCH AND STAGE FILTER BAR */}
          <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-4 flex flex-col md:flex-row gap-4 items-center justify-between shadow-xl">
            <div className="relative w-full md:w-96">
              <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search vehicle number, customer, mechanic..."
                value={repairSearch}
                onChange={(e) => setRepairSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-white/10 rounded-xl text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div className="flex flex-wrap gap-1.5 w-full md:w-auto">
              {["All", "Received", "Checking", "Repairing", "Completed"].map((status) => (
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

          {/* REPAIRS TABLE */}
          {loadingRepairs ? (
            <div className="py-24 text-center">
              <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-slate-400">Loading service jobs...</p>
            </div>
          ) : filteredRepairs.length === 0 ? (
            <div className="bg-slate-900/40 border border-white/10 rounded-2xl p-16 text-center">
              <Wrench size={48} className="mx-auto mb-4 text-slate-600" />
              <h3 className="text-lg font-bold text-white">No Workshop Jobs Found</h3>
              <p className="text-slate-400 text-sm mt-1 max-w-sm mx-auto">
                Create a new workshop job to begin tracking the vehicle repair progression through the service bays.
              </p>
            </div>
          ) : (
            <div className="bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-950/80 border-b border-white/10 text-xs text-slate-400 uppercase tracking-wider">
                    <tr>
                      <th className="p-4">Customer & Vehicle</th>
                      <th className="p-4">Service Type</th>
                      <th className="p-4">Technician</th>
                      <th className="p-4">Repair Stage</th>
                      <th className="p-4">Job Notes</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filteredRepairs.map((service) => (
                      <tr key={service._id} className="hover:bg-white/5 transition">
                        {/* CUSTOMER & VEHICLE */}
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center font-bold">
                              🚗
                            </div>
                            <div>
                              <p className="font-semibold text-white">{service.customerName}</p>
                              <p className="text-xs font-mono font-medium text-cyan-400">
                                {service.vehicleNumber}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* SERVICE TYPE */}
                        <td className="p-4 font-medium text-slate-200">{service.serviceType}</td>

                        {/* MECHANIC */}
                        <td className="p-4 text-slate-300">
                          <span className="flex items-center gap-1.5">
                            <User size={13} className="text-slate-400" />
                            {service.mechanic || "Unassigned"}
                          </span>
                        </td>

                        {/* STAGE SELECT */}
                        <td className="p-4">
                          <select
                            value={service.status}
                            onChange={(e) => updateRepairStatus(service._id, e.target.value)}
                            className={`text-xs font-semibold px-3 py-1.5 rounded-full border bg-slate-950 cursor-pointer focus:outline-none ${getStageColor(
                              service.status
                            )}`}
                          >
                            <option value="Received">Received</option>
                            <option value="Checking">Checking / Inspection</option>
                            <option value="Repairing">Repairing</option>
                            <option value="Completed">Completed</option>
                          </select>
                        </td>

                        {/* NOTES */}
                        <td className="p-4 text-xs text-slate-400 max-w-xs truncate">
                          {service.notes || "—"}
                        </td>

                        {/* ACTIONS */}
                        <td className="p-4 text-right">
                          <button
                            onClick={() => deleteRepair(service._id)}
                            title="Delete Service Job"
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
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: ADD / EDIT CATALOG PACKAGE                        */}
      {/* ======================================================== */}
      {showCatalogModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-white/10 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 shadow-2xl relative">
            <button
              onClick={() => setShowCatalogModal(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white p-2 rounded-full hover:bg-white/10 transition"
            >
              <X size={18} />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-400 flex items-center justify-center text-white">
                <Layers size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">
                  {editingCatalogItem ? "Edit Service Package" : "Add New Service Package"}
                </h3>
                <p className="text-xs text-slate-400">
                  Configure package details, customer-facing pricing, and specifications
                </p>
              </div>
            </div>

            <form onSubmit={submitCatalogForm} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-slate-300 font-medium">Service Package Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Full Hybrid System Inspection"
                    value={catalogForm.title}
                    onChange={(e) => setCatalogForm({ ...catalogForm, title: e.target.value })}
                    className="w-full mt-1.5 px-3.5 py-2.5 bg-slate-950 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-300 font-medium">Category</label>
                  <input
                    type="text"
                    placeholder="e.g. Preventative, Braking, Electrical"
                    value={catalogForm.category}
                    onChange={(e) => setCatalogForm({ ...catalogForm, category: e.target.value })}
                    className="w-full mt-1.5 px-3.5 py-2.5 bg-slate-950 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-slate-300 font-medium">Standard Price (Rs.) *</label>
                  <input
                    type="number"
                    required
                    min={0}
                    placeholder="e.g. 5000"
                    value={catalogForm.price}
                    onChange={(e) => setCatalogForm({ ...catalogForm, price: Number(e.target.value) })}
                    className="w-full mt-1.5 px-3.5 py-2.5 bg-slate-950 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-300 font-medium">Estimated Duration</label>
                  <input
                    type="text"
                    placeholder="e.g. 1-2 Hours, 45 Mins"
                    value={catalogForm.estimatedTime}
                    onChange={(e) => setCatalogForm({ ...catalogForm, estimatedTime: e.target.value })}
                    className="w-full mt-1.5 px-3.5 py-2.5 bg-slate-950 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-300 font-medium">Short Summary / Description *</label>
                <textarea
                  rows={2}
                  required
                  placeholder="A concise summary displayed on the card..."
                  value={catalogForm.description}
                  onChange={(e) => setCatalogForm({ ...catalogForm, description: e.target.value })}
                  className="w-full mt-1.5 px-3.5 py-2.5 bg-slate-950 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-cyan-500 resize-none"
                />
              </div>

              <div>
                <label className="text-xs text-slate-300 font-medium">
                  Detailed Service Overview (Full Details Page)
                </label>
                <textarea
                  rows={3}
                  placeholder="In-depth explanation of inspection steps, engineering processes, and technician workflow..."
                  value={catalogForm.longDescription}
                  onChange={(e) => setCatalogForm({ ...catalogForm, longDescription: e.target.value })}
                  className="w-full mt-1.5 px-3.5 py-2.5 bg-slate-950 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-cyan-500 resize-none"
                />
              </div>

              <div>
                <label className="text-xs text-slate-300 font-medium">
                  Key Features / Checklist (One per line)
                </label>
                <textarea
                  rows={3}
                  placeholder="High-Grade Synthetic Motor Oil&#10;New OEM Oil Filter Element&#10;50-Point Multi-Point Check"
                  value={catalogForm.features}
                  onChange={(e) => setCatalogForm({ ...catalogForm, features: e.target.value })}
                  className="w-full mt-1.5 px-3.5 py-2.5 bg-slate-950 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-cyan-500 font-mono text-xs"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <input
                  type="checkbox"
                  id="popularCheck"
                  checked={catalogForm.popular}
                  onChange={(e) => setCatalogForm({ ...catalogForm, popular: e.target.checked })}
                  className="w-4 h-4 rounded text-blue-600 bg-slate-950 border-white/10 focus:ring-blue-500"
                />
                <label htmlFor="popularCheck" className="text-xs text-slate-300 cursor-pointer">
                  Highlight as <span className="font-semibold text-amber-400">Featured / Popular Package</span>
                </label>
              </div>

              <div className="pt-4 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowCatalogModal(false)}
                  className="flex-1 py-2.5 bg-white/5 hover:bg-white/10 rounded-xl font-medium text-sm text-slate-300 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-500 rounded-xl font-medium text-sm text-white transition shadow-lg shadow-blue-500/20"
                >
                  {editingCatalogItem ? "Save Changes" : "Create Service Package"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: ADD WORKSHOP JOB CARD                             */}
      {/* ======================================================== */}
      {showAddRepairModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-white/10 rounded-3xl w-full max-w-lg p-6 shadow-2xl relative">
            <button
              onClick={() => setShowAddRepairModal(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white p-2 rounded-full hover:bg-white/10 transition"
            >
              <X size={18} />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-400 flex items-center justify-center text-white">
                <Wrench size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">New Workshop Service Job</h3>
                <p className="text-xs text-slate-400">Create a job card to track vehicle repairs</p>
              </div>
            </div>

            <form onSubmit={submitRepairForm} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-300 font-medium">Customer Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Customer Name"
                    value={repairForm.customerName}
                    onChange={(e) => setRepairForm({ ...repairForm, customerName: e.target.value })}
                    className="w-full mt-1.5 px-3.5 py-2.5 bg-slate-950 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-300 font-medium">Vehicle Number</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. CAA-1234"
                    value={repairForm.vehicleNumber}
                    onChange={(e) => setRepairForm({ ...repairForm, vehicleNumber: e.target.value })}
                    className="w-full mt-1.5 px-3.5 py-2.5 bg-slate-950 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-cyan-500 uppercase"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-300 font-medium">Service Type</label>
                  <select
                    value={repairForm.serviceType}
                    onChange={(e) => setRepairForm({ ...repairForm, serviceType: e.target.value })}
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
                <div>
                  <label className="text-xs text-slate-300 font-medium">Assign Mechanic</label>
                  <input
                    type="text"
                    placeholder="e.g. Master Tech Sam"
                    value={repairForm.mechanic}
                    onChange={(e) => setRepairForm({ ...repairForm, mechanic: e.target.value })}
                    className="w-full mt-1.5 px-3.5 py-2.5 bg-slate-950 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-300 font-medium">Initial Stage</label>
                <select
                  value={repairForm.status}
                  onChange={(e) => setRepairForm({ ...repairForm, status: e.target.value })}
                  className="w-full mt-1.5 px-3.5 py-2.5 bg-slate-950 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-cyan-500"
                >
                  <option value="Received">Received</option>
                  <option value="Checking">Checking / Inspection</option>
                  <option value="Repairing">Repairing</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-slate-300 font-medium">Job Notes / Inspection</label>
                <textarea
                  rows={3}
                  placeholder="Notes about issues diagnosed or work required..."
                  value={repairForm.notes}
                  onChange={(e) => setRepairForm({ ...repairForm, notes: e.target.value })}
                  className="w-full mt-1.5 px-3.5 py-2.5 bg-slate-950 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-cyan-500 resize-none"
                />
              </div>

              <div className="pt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddRepairModal(false)}
                  className="flex-1 py-2.5 bg-white/5 hover:bg-white/10 rounded-xl font-medium text-sm text-slate-300 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-500 rounded-xl font-medium text-sm text-white transition"
                >
                  Start Service Job
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}