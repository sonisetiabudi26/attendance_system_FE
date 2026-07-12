import { STORAGE_KEYS, ROLES } from '../utils/constants'

const SEED_USERS = [
  {
    id: 'usr_001',
    name: 'Dimas Prasetyo',
    email: 'dimas@company.com',
    password: 'password123s',
    role: ROLES.HRD,
    position: 'Frontend Engineer',
    department: 'Product Engineering',
    phone: '0812-3456-7890',
    avatarColor: '#FFB627',
    homeLocation: { lat: -6.4025, lng: 106.7942, label: 'Depok, Jawa Barat' },
    joinedAt: '2023-02-01',
    status: 'ACTIVE',
  },
  {
    id: 'usr_004',
    name: 'Nadia Ramadhani',
    email: 'nadia@company.com',
    password: 'password123',
    role: ROLES.HRD,
    position: 'HR Business Partner',
    department: 'Human Resources',
    phone: '0815-1122-3344',
    avatarColor: '#14213D',
    homeLocation: { lat: -6.2297, lng: 106.8253, label: 'Jakarta Selatan' },
    joinedAt: '2021-04-01',
    status: 'ACTIVE',
  },
  {
    id: 'usr_003',
    name: 'Rizky Firmansyah',
    email: 'rizky@company.com',
    password: 'password123',
    role: ROLES.EMPLOYEE,
    position: 'Backend Engineer',
    department: 'Product Engineering',
    phone: '0821-9988-7766',
    avatarColor: '#6366F1',
    homeLocation: { lat: -6.9175, lng: 107.6191, label: 'Bandung, Jawa Barat' },
    joinedAt: '2023-06-10',
    status: 'ACTIVE',
  },
  {
    id: 'usr_002',
    name: 'Sinta Wulandari',
    email: 'sinta@company.com',
    password: 'password123',
    role: ROLES.HRD,
    position: 'HR Business Partner',
    department: 'Human Resources',
    phone: '0815-1122-3344',
    avatarColor: '#14213D',
    homeLocation: { lat: -6.2297, lng: 106.8253, label: 'Jakarta Selatan' },
    joinedAt: '2021-04-01',
    status: 'ACTIVE',
  },
]

function readJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

function writeJSON(key, value) {
  localStorage.setItem(key, JSON.stringify(value))
}

export function ensureSeeded() {
  if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
    writeJSON(STORAGE_KEYS.USERS, SEED_USERS)
  }
  if (!localStorage.getItem(STORAGE_KEYS.ATTENDANCE)) {
    writeJSON(STORAGE_KEYS.ATTENDANCE, [])
  }
  if (!localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS)) {
    writeJSON(STORAGE_KEYS.NOTIFICATIONS, [])
  }
}

export function resetAllData() {
  localStorage.removeItem(STORAGE_KEYS.USERS)
  localStorage.removeItem(STORAGE_KEYS.ATTENDANCE)
  localStorage.removeItem(STORAGE_KEYS.NOTIFICATIONS)
  localStorage.removeItem(STORAGE_KEYS.SESSION)
  ensureSeeded()
}

export const db = {
  getUsers: () => readJSON(STORAGE_KEYS.USERS, []),
  saveUsers: (users) => writeJSON(STORAGE_KEYS.USERS, users),

  getAttendance: () => readJSON(STORAGE_KEYS.ATTENDANCE, []),
  saveAttendance: (records) => writeJSON(STORAGE_KEYS.ATTENDANCE, records),

  getNotifications: () => readJSON(STORAGE_KEYS.NOTIFICATIONS, []),
  saveNotifications: (items) => writeJSON(STORAGE_KEYS.NOTIFICATIONS, items),

  getSession: () => readJSON(STORAGE_KEYS.SESSION, null),
  saveSession: (session) => writeJSON(STORAGE_KEYS.SESSION, session),
  clearSession: () => localStorage.removeItem(STORAGE_KEYS.SESSION),
}
