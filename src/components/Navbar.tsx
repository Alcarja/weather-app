import { Link, useLocation } from 'react-router'

const links = [
  { to: '/', label: 'Forecast' },
  { to: '/about', label: 'About' },
]

function Navbar() {
  const { pathname } = useLocation()

  const now = new Date()
  const dateLabel = now.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  })

  return (
    <nav className="bg-slate-900 border-b border-slate-700/60">
      <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">

        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-8 h-8 rounded-lg bg-sky-500/20 border border-sky-400/30 flex items-center justify-center text-base">
            🌤
          </div>
          <div className="leading-none">
            <span className="text-white font-semibold text-sm tracking-wide">WeatherCast</span>
            <span className="block text-slate-500 text-xs mt-0.5">{dateLabel}</span>
          </div>
        </Link>

        <ul className="flex items-center">
          {links.map(({ to, label }) => (
            <li key={to}>
              <Link
                to={to}
                className={`relative px-4 py-1.5 text-sm font-medium transition-colors ${
                  pathname === to
                    ? 'text-white'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {label}
                {pathname === to && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-px bg-sky-400 rounded-full" />
                )}
              </Link>
            </li>
          ))}
        </ul>

      </div>
    </nav>
  )
}

export default Navbar
