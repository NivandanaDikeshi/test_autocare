"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  CalendarCheck,
  Wrench,
  FileText,
  Users,
  Car,
  Package,
  MessageSquare,
  LogOut,
  ExternalLink,
  Shield,
  X,
} from "lucide-react";

const menuItems = [
  { name: "Dashboard", path: "/admin", icon: LayoutDashboard },
  { name: "Bookings", path: "/admin/bookings", icon: CalendarCheck },
  { name: "Workshop Services", path: "/admin/services", icon: Wrench },
  { name: "Billing & Invoices", path: "/admin/billings", icon: FileText },
  { name: "Customer Records", path: "/admin/customers", icon: Users },
  { name: "Vehicle Registry", path: "/admin/vehicles", icon: Car },
  { name: "Parts Inventory", path: "/admin/parts", icon: Package },
  { name: "Customer Messages", path: "/admin/contacts", icon: MessageSquare },
];

export default function Sidebar({ mobileOpen = false, setMobileOpen = () => {} }) {
  const pathname = usePathname();
  const router = useRouter();

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
    <>
      {/* MOBILE BACKDROP OVERLAY */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300"
          aria-hidden="true"
        />
      )}

      {/* SIDEBAR DRAWER */}
      <aside
        className={`fixed left-0 top-0 w-72 h-screen bg-slate-950/98 backdrop-blur-2xl border-r border-white/10 flex flex-col z-50 transition-transform duration-300 ease-in-out ${
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* HEADER */}
        <div className="p-5 sm:p-6 border-b border-white/10 flex items-center justify-between">
          <Link
            href="/admin"
            onClick={() => setMobileOpen(false)}
            className="flex items-center gap-3"
          >
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-400 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
              <Shield size={20} />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-1.5">
                AutoCare<span className="text-cyan-400">Pro</span>
              </h1>
              <p className="text-[11px] text-slate-400">Admin Control Panel</p>
            </div>
          </Link>

          {/* MOBILE CLOSE BUTTON */}
          <button
            onClick={() => setMobileOpen(false)}
            className="lg:hidden p-2 text-slate-400 hover:text-white rounded-xl bg-white/5 border border-white/10 transition"
            aria-label="Close menu"
          >
            <X size={18} />
          </button>
        </div>

        {/* NAVIGATION */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          <p className="px-3 text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Management Modules
          </p>

          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.path;

            return (
              <Link
                key={item.path}
                href={item.path}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3.5 px-4 py-2.5 rounded-xl transition-all duration-200 relative group
                  ${
                    active
                      ? "bg-gradient-to-r from-blue-600/30 to-cyan-500/10 text-white font-semibold border border-blue-500/30 shadow-lg shadow-blue-500/5"
                      : "text-slate-400 hover:text-white hover:bg-white/5"
                  }`}
              >
                {active && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 bg-cyan-400 rounded-r-full" />
                )}
                <Icon
                  size={17}
                  className={
                    active
                      ? "text-cyan-400"
                      : "text-slate-400 group-hover:text-slate-200"
                  }
                />
                <span className="text-sm">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* FOOTER / LOGOUT */}
        <div className="p-4 border-t border-white/10 bg-slate-950/60">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium
                       text-red-400 hover:text-red-300 hover:bg-red-500/10 transition"
          >
            <LogOut size={18} />
            <span>Sign Out Admin</span>
          </button>
        </div>
      </aside>
    </>
  );
}