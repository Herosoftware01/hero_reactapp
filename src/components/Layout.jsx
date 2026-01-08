
import { Outlet, Link } from 'react-router-dom';
import { useState } from 'react';

export default function Layout() {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-100">
      {/* ───────── HEADER ───────── */}
      <header
        className="
          fixed top-0 left-0 right-0
          h-14 flex items-center px-4
          text-white
          bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900
          shadow-md
          z-50
        "
      >
        <button
          onClick={() => setOpen(!open)}
          className="w-9 h-9 flex items-center justify-center rounded-md border border-white/20 hover:bg-white/10"
        >
          ☰
        </button>

        <span className="ml-4 font-semibold tracking-wide">
          HeroFashion
        </span>

        <div className="flex-1" />

        <button
          onClick={() => window.history.back()}
          className="w-9 h-9 flex items-center justify-center rounded-md border border-white/20 hover:bg-white/10"
        >
          ←
        </button>
      </header>

      {/* ───────── MOBILE OVERLAY ───────── */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-30 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* ───────── SIDEBAR ───────── */}
      <aside
        className={`
          fixed left-0 top-14
          h-[calc(100vh-56px)]
          w-[250px]
          bg-gradient-to-b from-sky-400 via-indigo-500 to-pink-500
          text-white flex flex-col shadow-lg
          z-40
          transform transition-transform duration-300
          ${open ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0
        `}
      >
        {/* Profile */}
        <div className="p-4">
          <div className="flex items-center gap-3 px-5 py-2 rounded-2xl bg-gradient-to-r from-pink-400 via-orange-400 to-yellow-300">
            <div className="w-10 h-10 rounded-full bg-white/30 flex items-center justify-center font-semibold">
              HF
            </div>
            <div>
              <div className="font-semibold text-sm">HeroSoftware</div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-4 space-y-2 text-sm py-2">
          <Link to="/" onClick={() => setOpen(false)} className="block px-3 py-2 rounded-lg hover:bg-white/20">Home</Link>
          <Link to="/Login" onClick={() => setOpen(false)} className="block px-3 py-2 rounded-lg hover:bg-white/20">Login Form</Link>
          <Link to="/details" onClick={() => setOpen(false)} className="block px-3 py-2 rounded-lg hover:bg-white/20">Order Details</Link>
          <Link to="/ordsync" onClick={() => setOpen(false)} className="block px-3 py-2 rounded-lg hover:bg-white/20">Order Sync</Link>
          <Link to="/OrderGridWithDetail1" onClick={() => setOpen(false)} className="block px-3 py-2 rounded-lg hover:bg-white/20">Order Print</Link>
          <Link to="SEODashboard" onClick={() => setOpen(false)} className="block px-3 py-2 rounded-lg hover:bg-white/20">Customers</Link>
          <Link to="Vehicle_Report" onClick={() => setOpen(false)} className="block px-3 py-2 rounded-lg hover:bg-white/20">Vehicle Report</Link>
          <Link to="card" onClick={() => setOpen(false)} className="block px-3 py-2 rounded-lg hover:bg-white/20">Card‑Admin</Link>
          <Link to="card-details" onClick={() => setOpen(false)} className="block px-3 py-2 rounded-lg hover:bg-white/20">Card‑Details</Link>
          <Link to="grey-app" onClick={() => setOpen(false)} className="block px-3 py-2 rounded-lg hover:bg-white/20">Grey Roll Checking</Link>
          <Link to="DetailTemplate" onClick={() => setOpen(false)} className="block px-3 py-2 rounded-lg hover:bg-white/20">Detail Grid</Link>
          <Link to="GanttChart" onClick={() => setOpen(false)} className="block px-3 py-2 rounded-lg hover:bg-white/20">GanttChart Grid</Link>
          <Link to="Apps13" onClick={() => setOpen(false)} className="block px-3 py-2 rounded-lg hover:bg-white/20">Server</Link>
          <Link to="Apps1" onClick={() => setOpen(false)} className="block px-3 py-2 rounded-lg hover:bg-white/20">Client</Link>
          <Link to="Hierarchy" onClick={() => setOpen(false)} className="block px-3 py-2 rounded-lg hover:bg-white/20">Hierarchy</Link>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-white/20">
          <button className="w-full border border-white/40 px-3 py-2 rounded-lg text-sm hover:bg-white/10">
            ⚙ Settings
          </button>
        </div>
      </aside>

      {/* ───────── MAIN CONTENT (✅ FIXED) ───────── */}
      <main
        className="
          fixed top-14 bottom-0 right-0
          left-0 md:left-[250px]
          bg-slate-100
          overflow-y-auto
          overflow-x-hidden
          z-10
        "
      >
        {/* ✅ no fixed height ✅ scroll ✅ pagination ok */}
        <div className="min-h-full w-full p- -14 pb-10">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
