"use client";

import "./globals.css";
import { usePathname } from "next/navigation";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function RootLayout({ children }) {
  const pathname = usePathname();

  // Hide Navbar + Footer on admin pages, login, and registration
  const hideLayout = Boolean(
    pathname?.startsWith("/admin") ||
    pathname === "/login" ||
    pathname === "/register"
  );

  return (
    <html lang="en" className="dark">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body className="min-h-screen bg-slate-950 text-white font-sans antialiased overflow-x-hidden selection:bg-cyan-500 selection:text-slate-950">
        {/* Navbar */}
        {!hideLayout && <Navbar />}

        {/* Page Content */}
        <main className={hideLayout ? "min-h-screen" : "min-h-[calc(100vh-80px)]"}>
          {children}
        </main>

        {/* Footer */}
        {!hideLayout && <Footer />}
      </body>
    </html>
  );
}