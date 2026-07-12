import { useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { useGeolocation } from '../hooks/useGeolocation'
import { authApi } from '../api/authApi'
import { ROLE_LABEL } from '../utils/constants'
import Card from '../components/common/Card.jsx'
import Input from '../components/common/Input.jsx'
import Button from '../components/common/Button.jsx'
import Badge from '../components/common/Badge.jsx'

export default function Profile() {
  const { user, updateUser } = useAuth()
  const geo = useGeolocation()

  const [form, setForm] = useState({ name: user.name, phone: user.phone, homeLabel: user.homeLocation.label })
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
        name: form.name,
        phone: form.phone,
        homeLocation: {
          ...user.homeLocation,
          label: form.homeLabel,
          ...(pendingCoords ? { lat: pendingCoords.lat, lng: pendingCoords.lng } : {}),
        },
      }
      const updated = await authApi.updateProfile(user.id, updates)
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
            style={{ backgroundColor: user.avatarColor }}
          >
            {user.name.charAt(0)}
          </div>
          <div>
            <p className="font-display text-lg font-semibold text-ink">{user.name}</p>
            <p className="text-sm text-muted">{user.position} · {user.department}</p>
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              <Badge tone="ink">{user.email}</Badge>
              <Badge tone={user.role === 'HRD' ? 'ink' : 'neutral'}>{ROLE_LABEL[user.role]}</Badge>
            </div>
          </div>
        </div>
      </Card>

      <Card title="Informasi Pribadi">
        <form onSubmit={handleSave} className="space-y-4">
          <Input id="name" label="Nama Lengkap" value={form.name} onChange={handleChange('name')} />
          <Input id="phone" label="Nomor Telepon" value={form.phone} onChange={handleChange('phone')} />

          <div>
            <label className="label" htmlFor="homeLabel">Lokasi WFH Terdaftar</label>
            <Input id="homeLabel" value={form.homeLabel} onChange={handleChange('homeLabel')} />
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <Button type="button" variant="outline" onClick={handleUseCurrentLocation} isLoading={geo.status === 'locating'}>
                Gunakan Lokasi Saat Ini
              </Button>
              {pendingCoords && (
                <span className="font-mono text-xs text-success">
                  Titik baru: {pendingCoords.lat.toFixed(5)}, {pendingCoords.lng.toFixed(5)}
                </span>
              )}
            </div>
            <p className="mt-2 font-mono text-xs text-muted">
              Titik saat ini: {user.homeLocation.lat.toFixed(5)}, {user.homeLocation.lng.toFixed(5)}
            </p>
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
