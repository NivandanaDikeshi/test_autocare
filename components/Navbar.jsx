"use client";

import Link from "next/link";
import { Menu, X, Wrench, Shield, Car } from "lucide-react";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const links = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Services", href: "/services" },
    { name: "Booking", href: "/booking" },
    { name: "Repair Tracker", href: "/status" },
    { name: "Invoices", href: "/billing" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <nav className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/80 backdrop-blur-2xl">
      <div className="max-w-7xl mx-auto px-5">
        <div className="flex justify-between items-center h-20">
          {/* BRAND LOGO */}
          <Link
            href="/"
            className="flex items-center gap-2.5 text-2xl font-black tracking-tight text-white group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-400 flex items-center justify-center text-white shadow-lg shadow-blue-500/20 group-hover:scale-105 transition">
              <Car size={20} />
            </div>
            <span>
              AutoCare<span className="text-cyan-400">Pro</span>
            </span>
          </Link>

          {/* DESKTOP MENU */}
          <div className="hidden lg:flex items-center gap-7">
            {links.map((link, i) => {
              const active = pathname === link.href;

              return (
                <Link
                  key={i}
                  href={link.href}
                  className={`relative text-sm font-medium transition py-1 ${
                    active ? "text-cyan-400 font-semibold" : "text-slate-300 hover:text-white"
                  }`}
                >
                  {link.name}
                  {active && (
                    <span className="absolute left-0 -bottom-1 h-0.5 w-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full" />
                  )}
                </Link>
              );
            })}
          </div>

          {/* ACTION BUTTONS */}
          <div className="hidden sm:flex items-center gap-3">
            <Link
              href="/admin"
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-300 bg-white/5 border border-white/10 hover:bg-white/10 hover:text-white transition"
            >
              <Shield size={14} className="text-cyan-400" />
              <span>Admin Portal</span>
            </Link>

            <Link
              href="/booking"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-xs font-bold hover:opacity-90 transition shadow-lg shadow-blue-500/25"
            >
              Book Service
            </Link>
          </div>

          {/* MOBILE TOGGLE */}
          <button
            className="lg:hidden text-white p-2 rounded-lg bg-white/5 border border-white/10"
            onClick={() => setOpen(!open)}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* MOBILE MENU */}
        {open && (
          <div className="lg:hidden border-t border-white/10 py-5 space-y-2">
            {links.map((link, i) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={i}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={`block px-4 py-2.5 rounded-xl text-sm font-medium transition ${
                    active
                      ? "bg-blue-600/30 text-cyan-300 border border-blue-500/30"
                      : "text-slate-300 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}

            <div className="pt-3 border-t border-white/10 flex flex-col gap-2">
              <Link
                href="/admin"
                onClick={() => setOpen(false)}
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm font-medium"
              >
                <Shield size={16} className="text-cyan-400" />
                <span>Admin Control Panel</span>
              </Link>
              <Link
                href="/booking"
                onClick={() => setOpen(false)}
                className="py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-sm font-bold text-center shadow-lg"
              >
                Book Service Appointment
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}