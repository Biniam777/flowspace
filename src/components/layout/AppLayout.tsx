import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-canvas text-ink-950 md:flex">
      <Sidebar />

      <div className="min-w-0 flex-1">
        <header className="sticky top-0 z-10 flex min-h-16 items-center justify-between border-b border-line bg-white/90 px-5 backdrop-blur-md sm:px-8">
          <div className="min-w-0">
            <p className="text-xs font-medium text-ink-500 sm:text-sm">
              Your workspace
            </p>
            <p className="truncate text-sm font-semibold text-ink-800">
              Flowspace
            </p>
          </div>

          <button
            type="button"
            aria-label="User profile"
            title="User profile"
            className="flex size-9 shrink-0 items-center justify-center rounded-full bg-brand-100 text-sm font-bold text-brand-700 transition hover:bg-brand-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500"
          >
            F
          </button>
        </header>

        <main className="mx-auto w-full max-w-7xl p-5 sm:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
