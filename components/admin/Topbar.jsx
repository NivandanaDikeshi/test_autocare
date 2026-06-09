export default function Topbar() {
  return (
    <header className="h-20 border-b border-slate-800 bg-slate-900 flex items-center justify-between px-8">

      <div>
        <h2 className="text-2xl font-bold">
          Admin Dashboard
        </h2>
      </div>

      <div className="flex items-center gap-4">
        <div className="w-11 h-11 rounded-full bg-blue-600 flex items-center justify-center font-bold">
          A
        </div>
      </div>
    </header>
  );
}