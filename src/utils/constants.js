// Radius toleransi (meter) antara lokasi absen dengan titik lokasi WFH terdaftar
export const WFH_RADIUS_METERS = 500

export const ATTENDANCE_STATUS = {
  ON_TIME: 'ON_TIME',
  LATE: 'LATE',
}

export const ATTENDANCE_TYPE = {
  CHECK_IN: 'CHECK_IN',
  CHECK_OUT: 'CHECK_OUT',
}

export const WORK_START_HOUR = 9 // batas jam masuk sebelum dianggap terlambat
export const WORK_START_MINUTE = 0

export const STORAGE_KEYS = {
  SESSION: 'wfh_session',
  USERS: 'wfh_users',
  ATTENDANCE: 'wfh_attendance',
  NOTIFICATIONS: 'wfh_notifications',
}

export const ROLES = {
  EMPLOYEE: 'EMPLOYEE',
  HR: 'HR',
}

export const ROLE_LABEL = {
  EMPLOYEE: 'EMPLOYEE',
  HR: 'HR',
}

export const NOTIFICATION_TYPE = {
  LATE_CHECK_IN: 'LATE_CHECK_IN',
  OUT_OF_RADIUS: 'OUT_OF_RADIUS',
  NEW_EMPLOYEE: 'NEW_EMPLOYEE',
  CHECK_OUT: 'CHECK_OUT',
}

// Nama exchange/queue simulasi RabbitMQ (dummy, tanpa koneksi jaringan asli)
export const MQ_QUEUE_NAME = 'attendance.events'
export const MQ_EXCHANGE_NAME = 'wfh.exchange'
