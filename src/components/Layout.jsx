import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useState, useMemo } from 'react';

export default function Layout() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const ORDER_ROUTES = [
    { value: '/details', label: 'Order Details' },
    { value: '/ordsync', label: 'Order Sync' },
    { value: '/OrderGridWithDetail1', label: 'Order Print' },
  ];

  const currentOrder = useMemo(() => {
    const match = ORDER_ROUTES.find(r => r.value === pathname);
    return match ? match.value : '';
  }, [pathname]);

  // Shared styling for dropdowns to match sidebar exactly
  const dropdownStyle = "w-full text-sm rounded-md px-3 py-2 bg-gradient-to-r from-sky-400 via-indigo-500 to-pink-500 text-white border border-white/30 outline-none shadow-sm cursor-pointer appearance-none";

  return (
    <div className="min-h-screen bg-slate-100">
      {/* HEADER */}
      <header className="fixed top-0 left-0 right-0 h-14 flex items-center px-4 text-white bg-slate-800 shadow-md z-50">
        <button onClick={() => setOpen(!open)} className="w-9 h-9 flex items-center justify-center border border-white/20 rounded hover:bg-white/10">
          ☰
        </button>
        <span className="ml-4 font-semibold">HeroFashion</span>
        <div className="flex-1" />
        <button onClick={() => window.history.back()} className="w-9 h-9 flex items-center justify-center border border-white/20 rounded hover:bg-white/10">
          ←
        </button>
      </header>

      {/* MOBILE OVERLAY */}
      {open && (
        <div className="fixed inset-0 bg-black/40 z-30 md:hidden" onClick={() => setOpen(false)} />
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
        <nav className="flex-1 overflow-y-auto px-4 space-y-3 text-sm py-2">
          <Link to="/" onClick={() => setOpen(false)} className="block px-3 py-2 rounded-lg hover:bg-white/20">Home</Link>
          <Link to="/Login" onClick={() => setOpen(false)} className="block px-3 py-2 rounded-lg hover:bg-white/20">Login Form</Link>

          {/* DROPDOWN 1: ORDER OPTIONS */}
          <div className="px-3 py-2">
            <select
              value={currentOrder}
              onChange={(e) => {
                const next = e.target.value;
                if (next) {
                  if (open) setOpen(false);
                  navigate(next);
                }
              }}
              className={dropdownStyle}
            >
              <option value="" className="text-slate-800">Select Orders...</option>
              <option value="/details" className="text-slate-800">Order Details</option>
              <option value="/ordsync" className="text-slate-800">Order Sync</option>
              <option value="/OrderGridWithDetail1" className="text-slate-800">Order Print</option>
            </select>
          </div>

          {/* DROPDOWN 2: GRID/CLIENT OPTIONS */}
          <div className="px-3 py-2">
            <select
              value={currentOrder}
              onChange={(e) => {
                const next = e.target.value;
                if (next) {
                  if (open) setOpen(false);
                  navigate(next);
                }
              }}
              className={dropdownStyle}
            >
              <option value="" className="text-slate-800">Select Grid...</option>
              <option value="/DetailTemplate" className="text-slate-800">Detail Grid</option>
              <option value="/GanttChart" className="text-slate-800">GanttChart Grid</option>
              <option value="/Apps13" className="text-slate-800">Server</option>
              <option value="/Apps1" className="text-slate-800">Client</option>
              <option value="/Hierarchy" className="text-slate-800">Hierarchy</option>
            </select>
          </div>

          {/* Standard Links */}
          <Link to="/SEODashboard" onClick={() => setOpen(false)} className="block px-3 py-2 rounded-lg hover:bg-white/20">Customers</Link>
          <Link to="/Vehicle_Report" onClick={() => setOpen(false)} className="block px-3 py-2 rounded-lg hover:bg-white/20">Vehicle Report</Link>
          <Link to="/card" onClick={() => setOpen(false)} className="block px-3 py-2 rounded-lg hover:bg-white/20">Card‑Admin</Link>
          <Link to="/card-details" onClick={() => setOpen(false)} className="block px-3 py-2 rounded-lg hover:bg-white/20">Card‑Details</Link>
          <Link to="/grey-app" onClick={() => setOpen(false)} className="block px-3 py-2 rounded-lg hover:bg-white/20">Grey Roll Checking</Link>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-white/20">
          <button className="w-full border border-white/40 px-3 py-2 rounded-lg text-sm hover:bg-white/10">⚙ Settings</button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="fixed top-14 bottom-0 right-0 left-0 md:left-[250px] bg-slate-100 overflow-y-auto overflow-x-hidden z-10">
        <div className="min-h-full w-full p-0 pb-10">
          <Outlet />
        </div>
      </main>
    </div>
  );
}