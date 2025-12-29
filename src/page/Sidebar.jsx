
import { NavLink } from 'react-router-dom'

const Item = ({ to, text }) => (
  <NavLink
    to={to}
    end
    className={({ isActive }) =>
      `block px-4 py-2 rounded-lg text-sm
       ${isActive
        ? 'bg-white/30 text-white'
        : 'text-white/90 hover:bg-white/20'}`
    }
  >
    {text}
  </NavLink>
)

export default function Sidebar() {
  return (
    <div className="flex flex-col h-full">

      {/* ✅ BRAND */}
      <div className="p-4">
        <div
          className="
            flex items-center gap-3
            px-4 py-3
            rounded-2xl
            bg-gradient-to-r from-pink-400 via-orange-400 to-yellow-300
            text-white
            shadow-lg
          "
        >
          <div
            className="
              w-10 h-10
              rounded-full
              bg-white/30
              flex items-center justify-center
              font-semibold
            "
          >
            HF
          </div>

          <div className="leading-tight">
            <div className="font-semibold text-sm">
              HeroFashion
            </div>
            <div className="text-xs opacity-90">
              Control Panel
            </div>
          </div>
        </div>
      </div>

      {/* MENU */}
      <nav className="px-4 space-y-1">
        <Item to="/" text="Dashboard" />
        <Item to="/details" text="Order Details" />
        <Item to="/OrderGridWithDetail1" text="Products" />
        <Item to="/OrderGridWithDetail1" text="OrderGridWithDetail" />
        <Item to="/reports" text="Reports" />
      </nav>

      {/* FOOTER */}
      <div className="mt-auto p-4">
        <button
          className="
            w-full
            border border-white/40
            text-white
            px-3 py-2
            rounded-lg
            text-sm
          "
        >
          ⚙ Settings
        </button>
      </div>

    </div>
  )
}
