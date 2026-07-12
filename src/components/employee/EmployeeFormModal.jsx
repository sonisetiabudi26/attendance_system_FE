import { useEffect, useState } from 'react'
import Modal from '../common/Modal.jsx'
import Input from '../common/Input.jsx'
import Select from '../common/Select.jsx'
import Button from '../common/Button.jsx'
import { ROLES, ROLE_LABEL } from '../../utils/constants'

const EMPTY_FORM = {
  name: '',
  email: '',
  phone: '',
  position: '',
  department: '',
  role: ROLES.EMPLOYEE,
  homeLabel: '',
}

export default function EmployeeFormModal({ open, onClose, onSubmit, initialData, isSubmitting, apiError }) {
  const isEdit = Boolean(initialData)
  const [form, setForm] = useState(EMPTY_FORM)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (open) {
      setForm(
        initialData
          ? {
              name: initialData.name,
              email: initialData.email,
              phone: initialData.phone,
              position: initialData.position,
              department: initialData.department,
              role: initialData.role,
              homeLabel: initialData.homeLocation?.label || '',
            }
          : EMPTY_FORM,
      )
      setErrors({})
    }
  }, [open, initialData])

  const handleChange = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }))
    setErrors((er) => ({ ...er, [field]: undefined }))
  }

  const validate = () => {
    const next = {}
    if (!form.name.trim()) next.name = 'Nama wajib diisi.'
    if (!form.email.trim()) next.email = 'Email wajib diisi.'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = 'Format email tidak valid.'
    if (!form.position.trim()) next.position = 'Posisi wajib diisi.'
    if (!form.department.trim()) next.department = 'Departemen wajib diisi.'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validate()) return
    onSubmit({
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim() || '-',
      position: form.position.trim(),
      department: form.department.trim(),
      role: form.role,
      ...(form.homeLabel.trim()
        ? { homeLocation: { lat: -6.2, lng: 106.8, label: form.homeLabel.trim() } }
        : {}),
    })
  }

  return (
    <Modal open={open} onClose={onClose} title={isEdit ? 'Edit Karyawan' : 'Tambah Karyawan'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <Input id="ef-name" label="Nama Lengkap" value={form.name} onChange={handleChange('name')} error={errors.name} />
          <Input id="ef-email" label="Email" type="email" value={form.email} onChange={handleChange('email')} error={errors.email} />
          <Input id="ef-phone" label="Nomor Telepon" value={form.phone} onChange={handleChange('phone')} />
          <Select id="ef-role" label="Role" value={form.role} onChange={handleChange('role')}>
            <option value={ROLES.EMPLOYEE}>{ROLE_LABEL.EMPLOYEE}</option>
            <option value={ROLES.HRD}>{ROLE_LABEL.HRD}</option>
          </Select>
          <Input id="ef-position" label="Posisi" value={form.position} onChange={handleChange('position')} error={errors.position} />
          <Input id="ef-department" label="Departemen" value={form.department} onChange={handleChange('department')} error={errors.department} />
        </div>
        <Input
          id="ef-home"
          label="Label Lokasi WFH (opsional)"
          placeholder="mis. Depok, Jawa Barat"
          value={form.homeLabel}
          onChange={handleChange('homeLabel')}
        />

        {!isEdit && (
          <p className="rounded-lg bg-paper px-3.5 py-2.5 text-xs text-muted">
            Password default untuk akun baru: <span className="font-mono font-semibold text-ink">password123</span>
          </p>
        )}

        {apiError && (
          <p className="rounded-lg bg-red-50 px-3.5 py-2.5 text-sm font-medium text-danger">{apiError}</p>
        )}

        <div className="flex justify-end gap-2 pt-1">
          <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
            Batal
          </Button>
          <Button type="submit" variant="primary" isLoading={isSubmitting}>
            {isEdit ? 'Simpan Perubahan' : 'Tambah Karyawan'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
