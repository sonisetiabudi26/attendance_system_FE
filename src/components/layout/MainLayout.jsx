import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from './Navbar.jsx'
import Sidebar from './Sidebar.jsx'

export default function MainLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-paper">
      <Navbar onMenuClick={() => setSidebarOpen(true)} />

      <div className="mx-auto flex">
        {/* Sidebar - desktop */}
        <aside className="sticky top-16 hidden h-[calc(100vh-4rem)] w-56 shrink-0 border-r border-line lg:block">
          <Sidebar />
        </aside>

        {/* Sidebar - mobile drawer */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-40 lg:hidden">
            <div className="absolute inset-0 bg-ink/40" onClick={() => setSidebarOpen(false)} />
            <div className="absolute left-0 top-0 h-full w-64 bg-white shadow-xl">
              <div className="flex h-16 items-center justify-between border-b border-line px-4">
                <span className="font-display text-sm font-semibold text-ink">Menu</span>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="rounded-lg p-2 text-ink hover:bg-paper"
                  aria-label="Tutup menu"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5">
                    <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
                  </svg>
                </button>
              </div>
              <Sidebar onNavigate={() => setSidebarOpen(false)} />
            </div>
          </div>
        )}

        <main className="min-w-0 flex-1 px-4 py-6 sm:px-6 sm:py-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
