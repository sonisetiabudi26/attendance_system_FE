import { useEffect, useMemo, useState } from 'react'
import { employeeApi } from "@/features/employee/api/employeeApi"
import { useAuth } from "@/shared/hooks/useAuth"
import { useToast } from "@/shared/hooks/useToast"
import { ROLES, ROLE_LABEL } from "@/utils/constants"
import Card from "@/shared/components/common/Card.jsx"
import Button from "@/shared/components/common/Button.jsx"
import Select from "@/shared/components/common/Select.jsx"
import Alert from "@/shared/components/common/Alert.jsx"
import ConfirmDialog from "@/shared/components/common/ConfirmDialog.jsx"
import EmployeeTable from "@/features/employee/components/EmployeeTable.jsx"
import EmployeeFormModal from "@/features/employee/components/EmployeeFormModal.jsx"

export default function EmployeeList() {
  const { user: currentUser } = useAuth()
  const toast = useToast()

  const [employees, setEmployees] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState('')

  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('ALL')

  const [formOpen, setFormOpen] = useState(false)
  const [editingEmployee, setEditingEmployee] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formError, setFormError] = useState('')

  const [deleteTarget, setDeleteTarget] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const loadEmployees = () => {
    setIsLoading(true)
    setLoadError('')
    employeeApi
      .list()
      .then(setEmployees)
      .catch((err) => setLoadError(err.message || 'Gagal memuat data karyawan.'))
      .finally(() => setIsLoading(false))
  }

  useEffect(loadEmployees, [])

  const filtered = useMemo(() => {
    return employees.filter((emp) => {
      const matchesSearch =
        !search.trim() ||
        emp.name.toLowerCase().includes(search.toLowerCase()) ||
        emp.email.toLowerCase().includes(search.toLowerCase())
      const matchesRole = roleFilter === 'ALL' || emp.role === roleFilter
      return matchesSearch && matchesRole
    })
  }, [employees, search, roleFilter])

  const openCreate = () => {
    setEditingEmployee(null)
    setFormError('')
    setFormOpen(true)
  }

  const openEdit = (emp) => {
    setEditingEmployee(emp)
    setFormError('')
    setFormOpen(true)
  }

  const handleFormSubmit = async (payload) => {
    setIsSubmitting(true)
    setFormError('')
    try {
      if (editingEmployee) {
        const updated = await employeeApi.update(editingEmployee.id, payload)
        setEmployees((prev) => prev.map((e) => (e.id === updated.id ? updated : e)))
        toast.success(`Data ${updated.name} berhasil diperbarui.`)
      } else {
        const created = await employeeApi.create(payload)
        setEmployees((prev) => [...prev, created].sort((a, b) => a.name.localeCompare(b.name)))
        toast.success(`Karyawan ${created.name} berhasil ditambahkan.`)
      }
      setFormOpen(false)
    } catch (err) {
      setFormError(err.message || 'Gagal menyimpan data.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return
    setIsDeleting(true)
    try {
      await employeeApi.remove(deleteTarget.id)
      setEmployees((prev) => prev.filter((e) => e.id !== deleteTarget.id))
      toast.success(`${deleteTarget.name} berhasil dihapus.`)
      setDeleteTarget(null)
    } catch (err) {
      toast.error(err.message || 'Gagal menghapus karyawan.')
    } finally {
      setIsDeleting(false)
    }
  }

  const handleToggleStatus = async (emp) => {
    try {
      const updated = await employeeApi.toggleStatus(emp.id)
      setEmployees((prev) => prev.map((e) => (e.id === updated.id ? updated : e)))
      toast.info(`Status ${updated.name} diubah menjadi ${updated.status === 'ACTIVE' ? 'Aktif' : 'Nonaktif'}.`)
    } catch (err) {
      toast.error(err.message || 'Gagal mengubah status.')
    }
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink">Karyawan</h1>
          <p className="mt-1 text-sm text-muted">Kelola data karyawan, role, dan status akun.</p>
        </div>
        <Button variant="accent" onClick={openCreate}>
          + Tambah Karyawan
        </Button>
      </div>

      <Card>
        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            type="text"
            placeholder="Cari nama atau email..."
            className="input flex-1"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} className="sm:w-48">
            <option value="ALL">Semua Role</option>
            <option value={ROLES.EMPLOYEE}>{ROLE_LABEL.EMPLOYEE}</option>
            <option value={ROLES.HRD}>{ROLE_LABEL.HRD}</option>
          </Select>
        </div>
      </Card>

      <Card>
        {loadError ? (
          <Alert onRetry={loadEmployees}>{loadError}</Alert>
        ) : (
          <EmployeeTable
            employees={filtered}
            isLoading={isLoading}
            onEdit={openEdit}
            onDelete={setDeleteTarget}
            onToggleStatus={handleToggleStatus}
            currentUserId={currentUser.id}
          />
        )}
      </Card>

      <EmployeeFormModal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={editingEmployee}
        isSubmitting={isSubmitting}
        apiError={formError}
      />

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Hapus karyawan ini?"
        description={deleteTarget ? `${deleteTarget.name} akan dihapus permanen dari sistem. Tindakan ini tidak dapat dibatalkan.` : ''}
        confirmLabel="Hapus"
        isLoading={isDeleting}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  )
}
