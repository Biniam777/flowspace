import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 md:flex">
      <Sidebar />

      <div className="min-w-0 flex-1">
        <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-slate-200 bg-white/90 px-5 backdrop-blur sm:px-8">
          <div>
            <p className="text-sm font-medium text-slate-500">
              Your workspace
            </p>
            <p className="text-sm font-semibold text-slate-900">
              Flowspace
            </p>
          </div>

          <div
            aria-label="User profile"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-100 text-sm font-bold text-indigo-700"
          >
            F
          </div>
        </header>

        <main className="mx-auto w-full max-w-7xl p-5 sm:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
