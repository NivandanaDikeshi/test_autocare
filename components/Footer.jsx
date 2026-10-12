import Link from "next/link";
import {
  Mail,
  Phone,
  MapPin,
  Wrench,
  Shield,
  Car,
} from "lucide-react";
import { FaFacebookF, FaInstagram, FaLinkedinIn } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-b from-slate-950 to-black text-slate-300 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* BRAND */}
        <div className="md:col-span-1">
          <Link href="/" className="flex items-center gap-2.5 text-xl font-black text-white">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-cyan-400 flex items-center justify-center text-white">
              <Car size={16} />
            </div>
            <span>
              AutoCare<span className="text-cyan-400">Pro</span>
            </span>
          </Link>

          <p className="text-xs text-slate-400 mt-4 leading-relaxed">
            Leading automotive service and vehicle maintenance center equipped with state-of-the-art diagnostic tools, certified mechanics, and live repair tracking.
          </p>

          <div className="flex gap-3 mt-6">
            <a href="#" className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-800 hover:bg-blue-600 transition text-xs">
              <FaFacebookF />
            </a>
            <a href="#" className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-800 hover:bg-pink-500 transition text-xs">
              <FaInstagram />
            </a>
            <a href="#" className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-800 hover:bg-cyan-500 transition text-xs">
              <FaLinkedinIn />
            </a>
          </div>
        </div>

        {/* QUICK SERVICES */}
        <div>
          <h3 className="text-white font-bold mb-4 text-sm uppercase tracking-wider">
            Our Services
          </h3>
          <div className="flex flex-col gap-2.5 text-xs text-slate-400">
            <Link href="/services" className="hover:text-cyan-400 transition">Vehicle Maintenance</Link>
            <Link href="/services" className="hover:text-cyan-400 transition">Engine Diagnostics</Link>
            <Link href="/services" className="hover:text-cyan-400 transition">Brake & Suspension</Link>
            <Link href="/services" className="hover:text-cyan-400 transition">Oil & Filter Change</Link>
            <Link href="/services" className="hover:text-cyan-400 transition">Tire Alignment</Link>
          </div>
        </div>

        {/* CUSTOMER PORTAL */}
        <div>
          <h3 className="text-white font-bold mb-4 text-sm uppercase tracking-wider">
            Client Center
          </h3>
          <div className="flex flex-col gap-2.5 text-xs text-slate-400">
            <Link href="/booking" className="hover:text-cyan-400 transition">Book an Appointment</Link>
            <Link href="/status" className="hover:text-cyan-400 transition">Live Repair Tracker</Link>
            <Link href="/billing" className="hover:text-cyan-400 transition">Download Invoices</Link>
            <Link href="/contact" className="hover:text-cyan-400 transition">Contact Workshop</Link>
            <Link href="/admin" className="hover:text-cyan-400 transition flex items-center gap-1.5 text-cyan-400 font-medium mt-1">
              <Shield size={12} />
              <span>Admin Dashboard</span>
            </Link>
          </div>
        </div>

        {/* WORKSHOP CONTACT */}
        <div>
          <h3 className="text-white font-bold mb-4 text-sm uppercase tracking-wider">
            Workshop Hub
          </h3>
          <div className="space-y-3 text-xs text-slate-400">
            <p className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>123 AutoCare Street, Colombo, Sri Lanka</span>
            </p>
            <p className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>+94 77 123 4567</span>
            </p>
            <p className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-blue-400 shrink-0" />
              <span>support@autocarepro.com</span>
            </p>
            <p className="text-[11px] text-slate-500 pt-1">
              Mon - Sat: 8:00 AM - 6:30 PM (Sun: Emergency only)
            </p>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 bg-black/60">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-500">
          <p>© {new Date().getFullYear()} AutoCare Pro. All rights reserved.</p>
          <div className="flex gap-4 mt-2 sm:mt-0">
            <Link href="/about" className="hover:text-slate-300">About Us</Link>
            <Link href="/contact" className="hover:text-slate-300">Support</Link>
            <Link href="/admin" className="hover:text-cyan-400">Staff Portal</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}