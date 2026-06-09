import Link from "next/link";
import {
  Mail,
  Phone,
  MapPin,
  Wrench,
} from "lucide-react";

// React Icons (brand icons)
import { FaFacebookF, FaInstagram, FaLinkedinIn } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-b from-slate-950 to-slate-900 text-slate-300">
      <div className="max-w-7xl mx-auto px-6 py-16 grid md:grid-cols-3 gap-12">

        {/* Brand */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
            <Wrench className="w-6 h-6 text-blue-500" />
            AutoCare Pro
          </h2>

          <p className="text-sm text-slate-400 leading-relaxed">
            Professional vehicle service and maintenance management solution
            designed for speed and reliability.
          </p>

          {/* Social Icons */}
          <div className="flex gap-4 mt-6">
            <a href="#" className="w-9 h-9 flex items-center justify-center rounded-full bg-slate-800 hover:bg-blue-600 transition">
              <FaFacebookF />
            </a>

            <a href="#" className="w-9 h-9 flex items-center justify-center rounded-full bg-slate-800 hover:bg-pink-500 transition">
              <FaInstagram />
            </a>

            <a href="#" className="w-9 h-9 flex items-center justify-center rounded-full bg-slate-800 hover:bg-blue-500 transition">
              <FaLinkedinIn />
            </a>
          </div>
        </div>

        {/* Links */}
        <div>
          <h3 className="text-white font-semibold mb-5 text-lg">
            Quick Links
          </h3>

          <div className="flex flex-col gap-3 text-sm">
            <Link href="/" className="hover:text-white transition">Home</Link>
            <Link href="/about" className="hover:text-white transition">About</Link>
            <Link href="/services" className="hover:text-white transition">Services</Link>
            <Link href="/contact" className="hover:text-white transition">Contact</Link>
          </div>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-white font-semibold mb-5 text-lg">
            Contact Info
          </h3>

          <div className="space-y-3 text-sm text-slate-400">
            <p className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-blue-400" />
              info@autocare.com
            </p>

            <p className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-green-400" />
              +94 77 123 4567
            </p>

            <p className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-red-400" />
              Negombo, Sri Lanka
            </p>
          </div>

          <button className="mt-6 px-4 py-2 rounded-lg bg-blue-600 text-white text-sm hover:bg-blue-500 transition flex items-center gap-2">
            <Wrench className="w-4 h-4" />
            Book a Service
          </button>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col md:flex-row justify-between items-center text-xs text-slate-500">
          <p>© 2026 AutoCare Pro. All rights reserved.</p>

          <div className="flex gap-4 mt-2 md:mt-0">
            <Link href="/privacy" className="hover:text-slate-300">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-slate-300">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}