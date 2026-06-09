"use client";

import Link from "next/link";
import { Menu, X, Wrench } from "lucide-react";
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
    { name: "Status", href: "/status" },
    /*{ name: "Billing", href: "/billing" },*/
    { name: "Contact", href: "/contact" },
  ];

  return (
    <nav className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/70 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-5">
        <div className="flex justify-between items-center h-16">

          {/* LOGO */}
          <Link
            href="/"
            className="flex items-center gap-2 text-2xl font-extrabold bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-500 bg-clip-text text-transparent"
          >
            <Wrench className="w-5 h-5 text-blue-400" />
            AutoCare
          </Link>

          {/* DESKTOP MENU */}
          <div className="hidden md:flex items-center gap-8">
            {links.map((link, i) => {
              const active = pathname === link.href;

              return (
                <Link
                  key={i}
                  href={link.href}
                  className={`relative text-sm font-medium transition ${
                    active
                      ? "text-white"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  {link.name}

                  {/* Active underline */}
                  <span
                    className={`absolute left-0 -bottom-1 h-[2px] bg-gradient-to-r from-blue-400 to-purple-500 transition-all ${
                      active ? "w-full" : "w-0 group-hover:w-full"
                    }`}
                  />
                </Link>
              );
            })}

            {/* CTA BUTTON */}
            <Link
              href="/booking"
              className="ml-4 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm font-semibold hover:opacity-90 transition shadow-lg"
            >
              Book Now
            </Link>
          </div>

          {/* MOBILE BUTTON */}
          <button
            className="md:hidden text-white"
            onClick={() => setOpen(!open)}
          >
            {open ? <X /> : <Menu />}
          </button>
        </div>

        {/* MOBILE MENU */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ${
            open ? "max-h-96 pb-4 pt-3" : "max-h-0"
          }`}
        >
          <div className="flex flex-col gap-2">
            {links.map((link, i) => {
              const active = pathname === link.href;

              return (
                <Link
                  key={i}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={`px-4 py-2 rounded-lg text-sm transition ${
                    active
                      ? "bg-blue-600 text-white"
                      : "text-gray-300 bg-white/5 hover:bg-white/10"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}

            {/* Mobile CTA */}
            <Link
              href="/booking"
              onClick={() => setOpen(false)}
              className="mt-2 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm font-semibold text-center"
            >
              Book Now
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}