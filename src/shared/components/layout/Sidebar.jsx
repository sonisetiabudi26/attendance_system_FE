import { NavLink } from 'react-router-dom'
import { useRole } from "@/features/auth/hooks/useRole"

const EMPLOYEE_ITEMS = [
  { to: '/absen', label: 'Absen', icon: StampIcon },
  { to: '/history', label: 'Riwayat', icon: HistoryIcon },
  { to: '/profile', label: 'Profil', icon: UserIcon },
]

const HRD_ITEMS = [
  { to: '/absen', label: 'Absen', icon: StampIcon },
  { to: '/history', label: 'Riwayat Saya', icon: HistoryIcon },
  { to: '/employees', label: 'Karyawan', icon: UsersIcon },
  { to: '/all-history', label: 'Riwayat Semua', icon: ListIcon },
  { to: '/logs', label: 'Log Stream', icon: TerminalIcon },
  { to: '/profile', label: 'Profil', icon: UserIcon },
]

export default function Sidebar({ onNavigate }) {
  const { isHrd } = useRole()
  const items = isHrd ? HRD_ITEMS : EMPLOYEE_ITEMS

  return (
    <nav className="flex flex-col gap-1 p-3">
      {items.map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          onClick={onNavigate}
          end
          className={({ isActive }) =>
            `flex items-center gap-3 rounded-lg px-3.5 py-2.5 text-sm font-medium transition-colors ${
              isActive ? 'bg-ink text-white' : 'text-ink/70 hover:bg-ink/5'
            }`
          }
        >
          <Icon className="h-4 w-4 shrink-0" />
          {label}
        </NavLink>
      ))}
    </nav>
  )
}

function StampIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function HistoryIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <rect x="3.5" y="4.5" width="17" height="16" rx="2" />
      <path d="M3.5 9h17M8 3v3M16 3v3" strokeLinecap="round" />
    </svg>
  )
}

function UserIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <circle cx="12" cy="8" r="3.5" />
      <path d="M4.5 20c1.4-3.6 4.2-5.5 7.5-5.5s6.1 1.9 7.5 5.5" strokeLinecap="round" />
    </svg>
  )
}

function UsersIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <circle cx="9" cy="8" r="3" />
      <path d="M2.5 19c1.2-3.2 3.6-4.8 6.5-4.8s5.3 1.6 6.5 4.8" strokeLinecap="round" />
      <circle cx="17" cy="8.5" r="2.3" />
      <path d="M15.5 14.5c2.3.3 4 1.7 5 4.3" strokeLinecap="round" />
    </svg>
  )
}

function ListIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <path d="M8 6h12M8 12h12M8 18h12" strokeLinecap="round" />
      <circle cx="4" cy="6" r="1" fill="currentColor" stroke="none" />
      <circle cx="4" cy="12" r="1" fill="currentColor" stroke="none" />
      <circle cx="4" cy="18" r="1" fill="currentColor" stroke="none" />
    </svg>
  )
}

function TerminalIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <rect x="3.5" y="4.5" width="17" height="15" rx="2" />
      <path d="M7 9.5l3 2.5-3 2.5M12.5 15h4.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
