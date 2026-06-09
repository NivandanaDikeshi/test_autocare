"use client";

import "./globals.css";
import { usePathname } from "next/navigation";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function RootLayout({ children }) {
  const pathname = usePathname();

  // Hide Navbar + Footer on login and admin pages
  const hideLayout =
    pathname.startsWith("/admin") ||
    pathname === "/login";

  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-950">

        {/* Navbar */}
        {!hideLayout && (
          <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/60 backdrop-blur-xl">
            <Navbar />
          </header>
        )}

        {/* Page Content */}
        <main>{children}</main>

        {/* Footer */}
        {!hideLayout && <Footer />}

      </body>
    </html>
  );
}