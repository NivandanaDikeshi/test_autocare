import Sidebar from "../../components/admin/Sidebar";
import Topbar from "../../components/admin/Topbar";

export default function AdminLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-slate-100">
      <Sidebar />
      <main className="flex-1 ml-72 p-6">
        {children}
      </main>
    </div>
  );
}