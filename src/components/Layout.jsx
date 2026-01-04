import { Outlet, Link } from 'react-router-dom';
import { useState } from 'react';

export default function Layout() {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-100">
      {/* ───────────────── HEADER ───────────────── */}
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
          aria-label="Toggle sidebar"
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
          aria-label="Go back"
        >
          ←
        </button>
      </header>

      {/* ───────────────── MOBILE OVERLAY ───────────────── */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-30 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* ───────────────── SIDEBAR ───────────────── */}
      <aside
        className={`
          fixed left-0 top-14
          h-[calc(100vh-56px)]
          w-[250px]
          bg-gradient-to-b from-sky-400 via-indigo-500 to-pink-500
          text-white flex flex-col shadow-lg
          z-40
          transform transition-transform duration-300 ease-in-out
          ${open ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0
        `}
      >
        {/* Profile */}
        <div className="p-4 flex-shrink-0">
          <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-gradient-to-r from-pink-400 via-orange-400 to-yellow-300 shadow-lg">
            <div className="w-10 h-10 rounded-full bg-white/30 flex items-center justify-center font-semibold">
              HF
            </div>
            <div className="leading-tight">
              <div className="font-semibold text-sm">HeroFashion</div>
              <div className="text-xs opacity-90">Control Panel</div>
            </div>
          </div>
        </div>

        {/* Navigation (Scrollable) */}
        <nav className="flex-1 overflow-y-auto px-4 space-y-2 text-sm py-2">
          <Link onClick={() => setOpen(false)} to="/" className="block px-3 py-2 rounded-lg hover:bg-white/20 transition-colors">
            Home
          </Link>
          <Link onClick={() => setOpen(false)} to="/Login" className="block px-3 py-2 rounded-lg hover:bg-white/20 transition-colors">
            Login Form
          </Link>
          <Link onClick={() => setOpen(false)} to="/details" className="block px-3 py-2 rounded-lg hover:bg-white/20 transition-colors">
            Order Details
          </Link>
          <Link onClick={() => setOpen(false)} to="/ordsync" className="block px-3 py-2 rounded-lg hover:bg-white/20 transition-colors">
            Order Sync
          </Link>
          <Link onClick={() => setOpen(false)} to="/OrderGridWithDetail1" className="block px-3 py-2 rounded-lg hover:bg-white/20 transition-colors">
            Order Print
          </Link>
          <Link onClick={() => setOpen(false)} to="SEODashboard" className="block px-3 py-2 rounded-lg hover:bg-white/20 transition-colors">
            Customers
          </Link>
          <Link onClick={() => setOpen(false)} to="#" className="block px-3 py-2 rounded-lg hover:bg-white/20 transition-colors">
            Reports
          </Link>
          <Link onClick={() => setOpen(false)} to="Vehicle_Report" className="block px-3 py-2 rounded-lg hover:bg-white/20 transition-colors">
            Vehicle Report
          </Link>
          <Link onClick={() => setOpen(false)} to="card" className="block px-3 py-2 rounded-lg hover:bg-white/20 transition-colors">
            Card-Admin
          </Link>
          <Link onClick={() => setOpen(false)} to="card-details" className="block px-3 py-2 rounded-lg hover:bg-white/20 transition-colors">
            Card-Details
          </Link>
          <Link onClick={() => setOpen(false)} to="DetailTemplate" className="block px-3 py-2 rounded-lg hover:bg-white/20 transition-colors">
            Detail Grid
          </Link>
          <Link onClick={() => setOpen(false)} to="Apps13" className="block px-3 py-2 rounded-lg hover:bg-white/20 transition-colors">
            Server
          </Link>
          <Link onClick={() => setOpen(false)} to="Apps1" className="block px-3 py-2 rounded-lg hover:bg-white/20 transition-colors">
            Client
          </Link>
          <Link onClick={() => setOpen(false)} to="Server_Grid" className="block px-3 py-2 rounded-lg hover:bg-white/20 transition-colors">
            Client side
          </Link>
          {/* FIX: Changed closing div to closing Link */}
          <Link onClick={() => setOpen(false)} to="Server_Grid1" className="block px-3 py-2 rounded-lg hover:bg-white/20 transition-colors">
            Server Side
          </Link>
          
          <Link onClick={() => setOpen(false)} to="DetailTemplate" className="block px-3 py-2 rounded-lg hover:bg-white/20 transition-colors">
            Detail Grid
          </Link>
          
          <Link onClick={() => setOpen(false)} to="Hierarchy" className="block px-3 py-2 rounded-lg hover:bg-white/20 transition-colors">
            Hierarchy
          </Link>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-white/20 bg-black/10 flex-shrink-0">
          <button className="w-full border border-white/40 px-3 py-2 rounded-lg text-sm hover:bg-white/10 transition-colors">
            ⚙ Settings
          </button>
        </div>
      </aside>

      {/* ───────────────── MAIN CONTENT ───────────────── */}
      <main
        className="
          fixed top-14
          left-0
          right-0
          bottom-0
          bg-slate-100
          transition-all
          ml-0
          md:ml-[250px]
          overflow-hidden
          z-10
        "
      >
        {/* 
           Padding Setup: 'p-4 pb-8' ensures content doesn't touch edges.
           For the Home page, use negative margins (-mx-4 -mt-4 -mb-8) to 
           break out and fill the screen.
        */}
        <div className="h-[calc(100vh-56px)] w-full overflow-hidden p-0 pb-8">
        
          <Outlet />
        </div>
      </main>
    </div>
  );
}