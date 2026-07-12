import { mockBroker } from './mockBroker'
import { db } from '../api/mockDb'
import { ROLES } from '../utils/constants'

let timerId = null

const EVENT_POOL = [
  { routingKey: 'attendance.checkin', type: 'CHECK_IN', weight: 3 },
  { routingKey: 'attendance.checkout', type: 'CHECK_OUT', weight: 2 },
  { routingKey: 'attendance.late', type: 'LATE_CHECK_IN', weight: 1 },
  { routingKey: 'attendance.out_of_radius', type: 'OUT_OF_RADIUS', weight: 1 },
  { routingKey: 'system.heartbeat', type: 'HEARTBEAT', weight: 1 },
]

function weightedPick() {
  const total = EVENT_POOL.reduce((sum, e) => sum + e.weight, 0)
  let r = Math.random() * total
  for (const e of EVENT_POOL) {
    if (r < e.weight) return e
    r -= e.weight
  }
  return EVENT_POOL[0]
}

function scheduleNext() {
  const delay = 4000 + Math.random() * 6000
  timerId = setTimeout(() => {
    tick()
    scheduleNext()
  }, delay)
}

function tick() {
  const employees = db.getUsers().filter((u) => u.role === ROLES.EMPLOYEE)
  if (employees.length === 0) return

  const picked = weightedPick()
  const employee = employees[Math.floor(Math.random() * employees.length)]

  if (picked.type === 'HEARTBEAT') {
    mockBroker.publish(picked.routingKey, picked.type, { queue: 'attendance.events', ok: true })
    return
  }

  mockBroker.publish(picked.routingKey, picked.type, {
    id: employee.id,
    name: employee.name,
    department: employee.department,
    simulated: true,
  })
}

export const activitySimulator = {
  start() {
    if (timerId) return
    mockBroker.connect()
    scheduleNext()
  },
  stop() {
    clearTimeout(timerId)
    timerId = null
  },
  isRunning() {
    return Boolean(timerId)
  },
}
