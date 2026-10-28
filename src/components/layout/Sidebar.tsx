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
    <aside className="border-b border-slate-200 bg-white p-4 md:min-h-screen md:w-64 md:shrink-0 md:border-b-0 md:border-r md:p-6">
      <NavLink to="/" className="mb-6 flex items-center gap-3 px-2 md:mb-10">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-lg font-bold text-white shadow-sm">
          F
        </span>

        <span>
          <span className="block text-lg font-bold tracking-tight text-slate-900">
            Flowspace
          </span>
          <span className="block text-xs text-slate-500">
            Personal workspace
          </span>
        </span>
      </NavLink>

      <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
        Workspace
      </p>

      <nav aria-label="Main navigation" className="flex gap-1 overflow-x-auto md:flex-col">
        {navigation.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/'}
            className={({ isActive }) =>
              [
                'flex shrink-0 items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
              ].join(' ')
            }
          >
            <span aria-hidden="true" className="w-5 text-center text-base">
              {item.icon}
            </span>
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="mt-8 hidden rounded-2xl bg-slate-50 p-4 md:block">
        <p className="text-sm font-semibold text-slate-800">
          Make space for focus
        </p>
        <p className="mt-1 text-xs leading-5 text-slate-500">
          Keep your projects organized and your next steps clear.
        </p>
      </div>
    </aside>
  )
}
