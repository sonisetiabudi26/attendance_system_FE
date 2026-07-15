import { useState } from 'react'
import { useEmployee } from "@/features/auth/hooks/useEmployee"
import { useGeolocation } from "@/shared/hooks/useGeolocation"
// import { authApi } from "@/features/auth/api/authApi"
import { ROLE_LABEL } from "@/utils/constants"
import Card from "@/shared/components/common/Card.jsx"
import Input from "@/shared/components/common/Input.jsx"
import Button from "@/shared/components/common/Button.jsx"
import Badge from "@/shared/components/common/Badge.jsx"
import { useCurrentUser } from '@/features/auth/hooks/useCurrentUser'

export default function Profile() {
  // const { user, updateUser } = useAuth()
  const employee = useEmployee();
 
  const geo = useGeolocation()

  const [form, setForm] = useState({ name: employee.employee.fullName, phone: employee.employee.phone,homeLabel:employee.employee.locations[0]?.locationName})
  const [isSaving, setIsSaving] = useState(false)
  const [successMsg, setSuccessMsg] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const [pendingCoords, setPendingCoords] = useState(null)

  const handleChange = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }))

  const handleUseCurrentLocation = async () => {
    setErrorMsg('')
    try {
      const coords = await geo.locate()
      setPendingCoords(coords)
    } catch (err) {
      setErrorMsg(err.message)
    }
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setSuccessMsg('')
    setErrorMsg('')
    setIsSaving(true)
    try {
      const updates = {
       
        fullName:form.name,
        email: "soni@mail.com",
        password: form.password,
        phone: form.phone,
        photoUrl: "https://cdn.domain.com/avatar.jpg",
        positionId: employee.employee.positionId,
        locationIds: [
          employee.employee.locations[0]?.id,
          employee.employee.locations[1]?.id
        ]
      }
      const updated = await authApi.updateProfile(employee.employee.employeeId, updates)
      updateUser(updated)
      setPendingCoords(null)
      setSuccessMsg('Profil berhasil diperbarui.')
    } catch (err) {
      setErrorMsg(err.message || 'Gagal menyimpan perubahan.')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-ink">Profil Saya</h1>
        <p className="mt-1 text-sm text-muted">Kelola informasi akun dan lokasi WFH terdaftar.</p>
      </div>

      <Card>
        <div className="flex items-center gap-4">
          <div
            className="flex h-16 w-16 items-center justify-center rounded-full text-xl font-bold text-white"
          
          >
            {employee.employee.fullName.charAt(0) ?? '?'}
          </div>
          <div>
            <p className="font-display text-lg font-semibold text-ink">{employee.employee.fullName}</p>
            <p className="text-sm text-muted">{employee.employee.positionName}</p>
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              <Badge tone="ink">{employee.email}</Badge>
              <Badge tone={employee.role === 'HR' ? 'ink' : 'neutral'}>{ROLE_LABEL[employee.role]}</Badge>
            </div>
          </div>
        </div>
      </Card>

      <Card title="Informasi Pribadi">
        <form  className="space-y-4">
          <Input id="name" label="Nama Lengkap" value={form.name} readOnly />
          <Input id="phone" label="Nomor Telepon" value={form.phone} onChange={handleChange('phone')} />
          <Input id="password" type='password' label="Password" value={form.password} onChange={handleChange('password')} />
          <div>
            <label className="label" htmlFor="homeLabel">Lokasi WFH Terdaftar</label>
            <Input id="homeLabel" value={form.homeLabel} readOnly />
            </div>

          {successMsg && (
            <p className="rounded-lg bg-emerald-50 px-3.5 py-2.5 text-sm font-medium text-success">{successMsg}</p>
          )}
          {errorMsg && (
            <p className="rounded-lg bg-red-50 px-3.5 py-2.5 text-sm font-medium text-danger">{errorMsg}</p>
          )}

          <Button type="submit" variant="primary" isLoading={isSaving}>
            Simpan Perubahan
          </Button>
        </form>
      </Card>
    </div>
  )
}
