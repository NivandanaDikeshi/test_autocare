"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Bell, User, Plus, ExternalLink, LogOut } from "lucide-react";

export default function Topbar() {
  const pathname = usePathname();
  const router = useRouter();

  const getPageTitle = (path) => {
    switch (path) {
      case "/admin":
        return "Dashboard Overview";
      case "/admin/bookings":
        return "Service Bookings";
      case "/admin/services":
        return "Workshop Service Tracking";
      case "/admin/billings":
        return "Invoices & Billing";
      case "/admin/parts":
        return "Parts & Inventory";
      case "/admin/vehicles":
        return "Vehicle Registry";
      case "/admin/contacts":
        return "Customer Inquiries";
      default:
        return "Admin Portal";
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/logout", { method: "POST" });
    } catch (e) {
      console.error(e);
    }
    localStorage.removeItem("adminAuth");
    router.push("/admin/login");
  };

  return (
    <header className="h-20 border-b border-white/10 bg-slate-950/80 backdrop-blur-xl flex items-center justify-between px-8 sticky top-0 z-30">
      {/* LEFT: TITLE & BREADCRUMB */}
      <div>
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span>Admin</span>
          <span>/</span>
          <span className="text-cyan-400 capitalize">
            {pathname.replace("/admin", "").replace("/", "") || "Overview"}
          </span>
        </div>
        <h2 className="text-xl font-bold text-white mt-0.5 tracking-tight">
          {getPageTitle(pathname)}
        </h2>
      </div>

      {/* RIGHT: ACTIONS & PROFILE */}
      <div className="flex items-center gap-4">
        {/* Quick Links */}
        <Link
          href="/"
          target="_blank"
          className="hidden sm:flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-slate-300 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition"
        >
          <ExternalLink size={13} />
          <span>Customer Site</span>
        </Link>

        {/* Live Badge */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>System Online</span>
        </div>

        {/* Profile Card */}
        <div className="flex items-center gap-3 pl-2 border-l border-white/10">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center font-bold text-white text-sm shadow-md">
            A
          </div>
          <div className="hidden sm:block">
            <p className="text-xs font-semibold text-white leading-none">Super Admin</p>
            <p className="text-[11px] text-slate-400 leading-none mt-1">admin@autocare.com</p>
          </div>

          <button
            onClick={handleLogout}
            title="Sign Out"
            className="p-2 text-slate-400 hover:text-red-400 hover:bg-white/5 rounded-lg transition"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </header>
  );
}