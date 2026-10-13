"use client";

import Link from "next/link";
import {
  Menu,
  X,
  Shield,
  Car,
  User,
  LogOut,
  ChevronDown,
  UserPlus,
  LogIn,
  Calendar,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [userDropdown, setUserDropdown] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const dropdownRef = useRef(null);

  const pathname = usePathname();
  const router = useRouter();

  const links = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Services", href: "/services" },
    { name: "Booking", href: "/booking" },
    { name: "Repair Tracker", href: "/status" },
    { name: "Invoices", href: "/billing" },
    { name: "Contact", href: "/contact" },
  ];

  // Sync user state from localStorage and listen to auth changes
  const checkUserStatus = () => {
    try {
      const stored = localStorage.getItem("userData");
      if (stored) {
        setCurrentUser(JSON.parse(stored));
      } else {
        setCurrentUser(null);
      }
    } catch (e) {
      setCurrentUser(null);
    }
  };

  useEffect(() => {
    checkUserStatus();

    // Verify with /api/auth/me in background
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.user) {
          setCurrentUser(data.user);
          localStorage.setItem("userAuth", "true");
          localStorage.setItem("userData", JSON.stringify(data.user));
        } else {
          // If server says not authenticated, clean user state
          if (!localStorage.getItem("adminAuth")) {
            // only clear user state if not admin
          }
        }
      })
      .catch(() => {});

    const handleAuthEvent = () => checkUserStatus();
    window.addEventListener("authChange", handleAuthEvent);
    return () => window.removeEventListener("authChange", handleAuthEvent);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setUserDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch (err) {
      console.error(err);
    }
    localStorage.removeItem("userAuth");
    localStorage.removeItem("userData");
    setCurrentUser(null);
    setUserDropdown(false);
    window.dispatchEvent(new Event("authChange"));
    router.push("/login");
  };

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

          {/* ACTION BUTTONS & AUTH */}
          <div className="hidden sm:flex items-center gap-3">
            {/* USER LOGIN / USER ACCOUNT */}
            {currentUser ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setUserDropdown(!userDropdown)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-white text-xs font-semibold hover:bg-cyan-500/20 transition"
                >
                  <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-blue-600 to-cyan-400 flex items-center justify-center text-white text-[11px] font-bold">
                    {currentUser.name?.charAt(0).toUpperCase() || "U"}
                  </div>
                  <span className="max-w-[110px] truncate">{currentUser.name}</span>
                  <ChevronDown size={14} className="text-cyan-400" />
                </button>

                {userDropdown && (
                  <div className="absolute right-0 mt-2 w-52 rounded-2xl bg-slate-900 border border-white/10 shadow-2xl py-2 z-50 backdrop-blur-xl animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="px-4 py-2 border-b border-white/10">
                      <p className="text-xs font-bold text-white truncate">
                        {currentUser.name}
                      </p>
                      <p className="text-[11px] text-slate-400 truncate">
                        {currentUser.email}
                      </p>
                    </div>

                    <Link
                      href="/profile"
                      onClick={() => setUserDropdown(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-xs text-slate-300 hover:text-white hover:bg-white/5 transition"
                    >
                      <User size={14} className="text-cyan-400" />
                      <span>My Garage & Profile</span>
                    </Link>

                    <Link
                      href="/booking"
                      onClick={() => setUserDropdown(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-xs text-slate-300 hover:text-white hover:bg-white/5 transition"
                    >
                      <Calendar size={14} className="text-blue-400" />
                      <span>Book Service</span>
                    </Link>

                    <div className="border-t border-white/10 mt-1 pt-1">
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-2.5 w-full text-left px-4 py-2 text-xs text-rose-400 hover:bg-rose-500/10 transition"
                      >
                        <LogOut size={14} />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/5 transition"
                >
                  <LogIn size={14} className="text-cyan-400" />
                  <span>Sign In</span>
                </Link>

                <Link
                  href="/register"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-cyan-300 bg-cyan-500/10 border border-cyan-500/20 hover:bg-cyan-500/20 transition"
                >
                  <UserPlus size={14} />
                  <span>Register</span>
                </Link>
              </div>
            )}

            {/* SEPARATE ADMIN PORTAL BUTTON */}
            <Link
              href="/admin/login"
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-300 bg-white/5 border border-white/10 hover:bg-white/10 hover:text-white transition"
              title="Workshop Staff & Admin Access"
            >
              <Shield size={14} className="text-cyan-400" />
              <span>Admin Portal</span>
            </Link>

            {/* BOOK SERVICE BUTTON */}
            <Link
              href="/booking"
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-xs font-bold hover:opacity-90 transition shadow-lg shadow-blue-500/25"
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

            {/* MOBILE AUTH LINKS */}
            <div className="pt-3 border-t border-white/10 flex flex-col gap-2">
              {currentUser ? (
                <>
                  <Link
                    href="/profile"
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-sm font-semibold"
                  >
                    <User size={16} />
                    <span>My Account ({currentUser.name})</span>
                  </Link>

                  <button
                    onClick={() => {
                      setOpen(false);
                      handleLogout();
                    }}
                    className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-rose-500/10 text-rose-300 text-sm font-medium"
                  >
                    <LogOut size={16} />
                    <span>Sign Out</span>
                  </button>
                </>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    href="/login"
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs font-semibold text-center"
                  >
                    <LogIn size={14} className="text-cyan-400" />
                    <span>User Login</span>
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-semibold text-center"
                  >
                    <UserPlus size={14} />
                    <span>Register</span>
                  </Link>
                </div>
              )}

              <Link
                href="/admin/login"
                onClick={() => setOpen(false)}
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:text-white text-sm font-medium"
              >
                <Shield size={16} className="text-cyan-400" />
                <span>Admin Login Portal</span>
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