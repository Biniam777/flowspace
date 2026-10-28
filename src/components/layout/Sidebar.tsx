import { NavLink } from 'react-router-dom'

const navigation = [
  { label: 'Dashboard', path: '/', icon: '◫' },
  { label: 'Projects', path: '/projects', icon: '▦' },
  { label: 'Tasks', path: '/tasks', icon: '✓' },
  { label: 'Analytics', path: '/analytics', icon: '↗' },
  { label: 'Settings', path: '/settings', icon: '⚙' },
]

export default function Sidebar() {
  return (
    <aside className="min-w-0 border-b border-line bg-surface px-4 py-4 md:min-h-screen md:w-64 md:shrink-0 md:border-b-0 md:border-r md:px-5 md:py-7">
      <NavLink
        to="/"
        aria-label="Flowspace home"
        className="mb-6 flex items-center gap-3 rounded-xl px-2 py-1 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500 md:mb-10"
      >
        <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-brand-600 text-lg font-bold text-white shadow-sm">
          F
        </span>

        <span className="min-w-0">
          <span className="block text-base font-bold tracking-tight text-ink-950">
            Flowspace
          </span>
          <span className="mt-0.5 block text-xs text-ink-500">
            Personal workspace
          </span>
        </span>
      </NavLink>

      <p className="mb-3 px-3 text-[11px] font-bold uppercase tracking-[0.14em] text-ink-500">
        Workspace
      </p>

      <nav
        aria-label="Main navigation"
        className="-mx-1 flex gap-1 overflow-x-auto px-1 pb-2 [scrollbar-width:thin] md:mx-0 md:flex-col md:overflow-visible md:px-0 md:pb-0"
      >
        {navigation.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/'}
            className={({ isActive }) =>
              [
                'flex min-h-10 shrink-0 items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-150',
                'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500',
                isActive
                  ? 'bg-brand-50 text-brand-700'
                  : 'text-ink-600 hover:bg-slate-50 hover:text-ink-950',
              ].join(' ')
            }
          >
            <span
              aria-hidden="true"
              className="w-5 shrink-0 text-center text-base"
            >
              {item.icon}
            </span>
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="mt-8 hidden rounded-panel border border-line bg-canvas p-4 md:block">
        <div className="mb-3 flex size-9 items-center justify-center rounded-lg bg-brand-100 text-brand-700">
          ✦
        </div>
        <p className="text-sm font-semibold text-ink-800">
          Make space for focus
        </p>
        <p className="mt-1 text-xs leading-5 text-ink-500">
          Keep your projects organized and your next steps clear.
        </p>
      </div>
    </aside>
  )
}
