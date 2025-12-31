
import { Outlet, Link } from 'react-router-dom';
import { useState } from 'react';

const SIDEBAR_WIDTH = 250;
const HEADER_HEIGHT = 56;

export default function Layout() {
  const [open, setOpen] = useState(false); // ✅ mobile default closed

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
        <div className="p-4">
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

        {/* Navigation */}
        <nav className="px-4 space-y-2 text-sm">
          <Link onClick={() => setOpen(false)} to="/" className="block px-3 py-2 rounded-lg hover:bg-white/20">
            Dashboard
          </Link>
          <Link onClick={() => setOpen(false)} to="/details" className="block px-3 py-2 rounded-lg hover:bg-white/20">
            Order Details
          </Link>
          <Link onClick={() => setOpen(false)} to="/OrderGridWithDetail1" className="block px-3 py-2 rounded-lg hover:bg-white/20">
            Order Print
          </Link>
          <Link onClick={() => setOpen(false)} to="SEODashboard" className="block px-3 py-2 rounded-lg hover:bg-white/20">
            Customers
          </Link>
          <Link onClick={() => setOpen(false)} to="#" className="block px-3 py-2 rounded-lg hover:bg-white/20">
            Reports
          </Link>
          <Link onClick={() => setOpen(false)} to="DailyReport" className="block px-3 py-2 rounded-lg hover:bg-white/20">
            Daily
          </Link>
        </nav>

        {/* Footer */}
        <div className="mt-auto p-4">
          <button className="w-full border border-white/40 px-3 py-2 rounded-lg text-sm hover:bg-white/10">
            ⚙ Settings
          </button>
        </div>
      </aside>

      {/* ───────────────── MAIN CONTENT ───────────────── */}
      <main
        className="
          pt-14
          min-h-screen
          bg-slate-100
          transition-all
          ml-0
          md:ml-[250px]
        "
      >
        <div
          className="p-4 h-[calc(100vh-56px)] overflow-y-auto"
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          <Outlet />
        </div>
      </main>
    </div>
  );
}
