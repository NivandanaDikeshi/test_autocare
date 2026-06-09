"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  CalendarCheck,
  FileText,
  Phone,
  Car,
  LogOut,
} from "lucide-react";

const menuItems = [
  { name: "Dashboard", path: "/admin", icon: LayoutDashboard },
  { name: "Bookings", path: "/admin/bookings", icon: CalendarCheck },
  /*{ name: "Billings", path: "/admin/billings", icon: FileText },*/
  { name: "Contacts", path: "/admin/contacts", icon: Phone },
  { name: "Vehicles", path: "/admin/vehicles", icon: Car },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("adminAuth");
    router.push("/login");
  };

  return (
    <aside className="fixed left-0 top-0 w-72 h-screen bg-slate-950 border-r border-slate-800 flex flex-col">

      {/* HEADER */}
      <div className="p-6 border-b border-slate-800">
        <h1 className="text-2xl font-bold text-blue-500">
          AutoCare
        </h1>
        <p className="text-slate-400 text-sm">
          Admin Control Panel
        </p>
      </div>

      {/* MENU */}
      <nav className="flex-1 p-4 space-y-2">

        {menuItems.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.path;

          return (
            <Link
              key={item.path}
              href={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition relative
                ${
                  active
                    ? "bg-slate-800 text-white"
                    : "text-slate-400 hover:bg-slate-900 hover:text-white"
                }`}
            >
              {/* Active indicator bar */}
              {active && (
                <span className="absolute left-0 top-0 h-full w-1 bg-blue-500 rounded-r" />
              )}

              <Icon size={18} />
              <span className="font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* FOOTER / LOGOUT */}
      <div className="p-4 border-t border-slate-800">

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-3 rounded-xl
                     text-red-400 hover:bg-red-500/10 hover:text-red-300 transition"
        >
          <LogOut size={18} />
          <span className="font-medium">Logout</span>
        </button>

        <p className="text-xs text-slate-600 mt-3 text-center">
          © {new Date().getFullYear()} AutoCare Pro
        </p>
      </div>

    </aside>
  );
}