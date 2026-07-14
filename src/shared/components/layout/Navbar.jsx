import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useEmployee } from "../../../features/auth/hooks/useEmployee"
import { useRole } from "../../../features/auth/hooks/useRole"
import NotificationBell from "@/components/notifications/NotificationBell.jsx"
import { useLogout } from "@/features/auth/hooks/useLogout";
export default function Navbar({ onMenuClick }) {
  // const { user, logout } = useAuth()
  const employee = useEmployee();
  const { isHRD } = useRole()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

   const { mutate: logout } = useLogout();

    function handleLogout() {

        logout(undefined, {

            onSuccess: () => {

                navigate("/login", {
                    replace: true,
                });

            }

        });
      }

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-line bg-white/90 px-4 backdrop-blur sm:px-6">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="rounded-lg p-2 text-ink hover:bg-paper lg:hidden"
          aria-label="Buka menu"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5">
            <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" />
          </svg>
        </button>
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-ink text-accent font-display text-sm font-bold">
            DX
          </div>
          <span className="font-display text-sm font-semibold tracking-wide text-ink hidden sm:block">
            Attendance System WFH - PT. Dexa Group
          </span>
        </div>
      </div>

      <div className="flex items-center gap-1.5">
        {isHRD && <NotificationBell />}
        <div className="relative">
        <button
          onClick={() => setMenuOpen((v) => !v)}
          className="flex items-center gap-2.5 rounded-lg px-2 py-1.5 hover:bg-paper"
        >
          <div
            className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold text-white"
            style={{ backgroundColor: '#14213D' }}
          >
            {employee?.name?.charAt(0) ?? '?'}
          </div>
          <span className="hidden text-sm font-medium text-ink sm:block">{employee?.name}</span>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-3.5 w-3.5 text-muted">
            <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        {menuOpen && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
            <div className="absolute right-0 z-20 mt-2 w-48 overflow-hidden rounded-xl border border-line bg-white shadow-card">
              <button
                onClick={() => {
                  setMenuOpen(false)
                  navigate('/profile')
                }}
                className="block w-full px-4 py-2.5 text-left text-sm text-ink hover:bg-paper"
              >
                Profil Saya
              </button>
              <button
                onClick={handleLogout}
                className="block w-full border-t border-line px-4 py-2.5 text-left text-sm font-medium text-danger hover:bg-red-50"
              >
                Keluar
              </button>
            </div>
          </>
        )}
        </div>
      </div>
    </header>
  )
}
