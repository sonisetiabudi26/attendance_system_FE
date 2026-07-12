import Badge from '../common/Badge.jsx'
import { ROLE_LABEL } from '../../utils/constants'

export default function EmployeeTable({ employees, isLoading, onEdit, onDelete, onToggleStatus, currentUserId }) {
  if (isLoading) {
    return (
      <div className="space-y-2">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-16 animate-pulse rounded-lg bg-line/40" />
        ))}
      </div>
    )
  }

  if (employees.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 py-16 text-center">
        <p className="font-display text-sm font-semibold text-ink">Tidak ada karyawan ditemukan</p>
        <p className="text-sm text-muted">Coba ubah kata kunci pencarian atau filter.</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-line text-xs font-semibold uppercase tracking-wide text-muted">
            <th className="py-3 pr-4">Karyawan</th>
            <th className="py-3 pr-4">Position</th>
            <th className="py-3 pr-4">Role</th>
            <th className="py-3 pr-4">Status</th>
            <th className="py-3 pr-4 text-right">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((emp) => (
            <tr key={emp.id} className="border-b border-line/70 last:border-0 align-top">
              <td className="py-3.5 pr-4">
                <div className="flex items-center gap-3">
                  <div
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
                    style={{ backgroundColor: emp.avatarColor }}
                  >
                    {emp.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium text-ink">{emp.name}</p>
                    <p className="text-xs text-muted">{emp.email}</p>
                   
                  </div>
                </div>
              </td>
              <td className="py-3.5 pr-4 text-ink">{emp.position}</td>
              <td className="py-3.5 pr-4">
                <Badge tone={emp.role === 'HRD' ? 'ink' : 'neutral'}>{ROLE_LABEL[emp.role]}</Badge>
              </td>
              <td className="py-3.5 pr-4">
                <button onClick={() => onToggleStatus(emp)} disabled={emp.id === currentUserId}>
                  <Badge tone={emp.status === 'ACTIVE' ? 'success' : 'danger'} dot className="cursor-pointer disabled:cursor-not-allowed">
                    {emp.status === 'ACTIVE' ? 'Aktif' : 'Nonaktif'}
                  </Badge>
                </button>
              </td>
              <td className="py-3.5 pr-4">
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => onEdit(emp)}
                    className="rounded-lg border border-line px-2.5 py-1.5 text-xs font-semibold text-ink hover:bg-paper"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(emp)}
                    disabled={emp.role === 'HRD'}
                    className="rounded-lg border border-danger/30 px-2.5 py-1.5 text-xs font-semibold text-danger hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Hapus
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
