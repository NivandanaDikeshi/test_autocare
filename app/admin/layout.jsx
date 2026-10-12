import Sidebar from "@/components/admin/Sidebar";
import Topbar from "@/components/admin/Topbar";

export default function AdminLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-slate-950 text-white font-sans antialiased">
      <Sidebar />
      <div className="flex-1 ml-72 flex flex-col min-h-screen overflow-x-hidden">
        <Topbar />
        <main className="flex-1 p-6 md:p-8 bg-gradient-to-br from-slate-950 via-slate-900 to-black">
          {children}
        </main>
      </div>
    </div>
  );
}