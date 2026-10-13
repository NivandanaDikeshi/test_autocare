"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Sidebar from "@/components/admin/Sidebar";
import Topbar from "@/components/admin/Topbar";

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close mobile sidebar on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // For /admin/login, display full-screen without the administrative sidebar/topbar
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen bg-slate-950 text-white font-sans antialiased relative">
      <Sidebar mobileOpen={mobileMenuOpen} setMobileOpen={setMobileMenuOpen} />
      <div className="flex-1 lg:ml-72 flex flex-col min-h-screen overflow-x-hidden min-w-0 w-full">
        <Topbar onToggleMobileMenu={() => setMobileMenuOpen(!mobileMenuOpen)} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-slate-950 via-slate-900 to-black">
          {children}
        </main>
      </div>
    </div>
  );
}