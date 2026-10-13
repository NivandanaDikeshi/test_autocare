"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ExternalLink, LogOut, Menu, LogIn } from "lucide-react";

export default function Topbar({ onToggleMobileMenu = () => {} }) {
  const pathname = usePathname();
  const router = useRouter();

  const getPageTitle = (path) => {
    switch (path) {
      case "/admin":
        return "Dashboard Overview";
      case "/admin/bookings":
        return "Service Bookings";
      case "/admin/services":
        return "Workshop Tracking";
      case "/admin/billings":
        return "Invoices & Billing";
      case "/admin/parts":
        return "Parts Inventory";
      case "/admin/customers":
        return "Customer Records";
      case "/admin/vehicles":
        return "Vehicle Registry";
      case "/admin/contacts":
        return "Inquiries & Messages";
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
    localStorage.removeItem("adminUser");
    router.push("/admin/login");
  };

  return (
    <header className="h-16 sm:h-20 border-b border-white/10 bg-slate-950/80 backdrop-blur-xl flex items-center justify-between px-4 sm:px-8 sticky top-0 z-30">
      {/* LEFT: HAMBURGER (MOBILE) & TITLE */}
      <div className="flex items-center gap-3">
        {/* MOBILE MENU TOGGLE BUTTON */}
        <button
          onClick={onToggleMobileMenu}
          className="lg:hidden p-2 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition"
          aria-label="Toggle navigation drawer"
        >
          <Menu size={20} />
        </button>

        <div>
          <div className="hidden sm:flex items-center gap-1.5 text-[11px] text-slate-400">
            <span>Admin</span>
            <span>/</span>
            <span className="text-cyan-400 capitalize">
              {pathname.replace("/admin", "").replace("/", "") || "Overview"}
            </span>
          </div>
          <h2 className="text-base sm:text-xl font-bold text-white tracking-tight leading-tight">
            {getPageTitle(pathname)}
          </h2>
        </div>
      </div>

      {/* RIGHT: ACTIONS & PROFILE */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Live Badge */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>System Online</span>
        </div>

        {/* Profile Card */}
        <div className="flex items-center gap-2 sm:gap-3 pl-2 sm:pl-3 border-l border-white/10">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center font-bold text-white text-xs sm:text-sm shadow-md">
            A
          </div>
          <div className="hidden xl:block">
            <p className="text-xs font-semibold text-white leading-none">Super Admin</p>
            <p className="text-[11px] text-slate-400 leading-none mt-1">admin@autocare.com</p>
          </div>

          <button
            onClick={handleLogout}
            title="Sign Out Admin"
            className="p-2 text-slate-400 hover:text-red-400 hover:bg-white/5 rounded-xl transition"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </header>
  );
}