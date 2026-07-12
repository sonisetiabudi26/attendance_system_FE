import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useToast } from '../hooks/useToast'
import Input from '../components/common/Input.jsx'
import Button from '../components/common/Button.jsx'

export default function Login() {
  const { login } = useAuth()
  const toast = useToast()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || '/absen'

  const [form, setForm] = useState({ email: 'dimas@company.com', password: 'password123' })
  const [errors, setErrors] = useState({})
  const [apiError, setApiError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }))
    setErrors((er) => ({ ...er, [field]: undefined }))
  }

  const validate = () => {
    const next = {}
    if (!form.email) next.email = 'Email wajib diisi.'
    if (!form.password) next.password = 'Password wajib diisi.'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setApiError('')
    if (!validate()) return

    setIsLoading(true)
    try {
      await login(form)
      navigate(from, { replace: true })
    } catch (err) {
      const message = err.message || 'Gagal masuk. Coba lagi.'
      setApiError(message)
      toast.error(message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-ink">Masuk ke akun Anda</h1>
      <p className="mt-1.5 text-sm text-muted">Catat kehadiran WFH harian dengan validasi lokasi.</p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <Input
          id="email"
          type="email"
          label="Email"
          placeholder="nama@company.com"
          value={form.email}
          onChange={handleChange('email')}
          error={errors.email}
          autoComplete="username"
        />
        <Input
          id="password"
          type="password"
          label="Password"
          placeholder="••••••••"
          value={form.password}
          onChange={handleChange('password')}
          error={errors.password}
          autoComplete="current-password"
        />

        {apiError && (
          <p className="rounded-lg bg-red-50 px-3.5 py-2.5 text-sm font-medium text-danger">{apiError}</p>
        )}

        <Button type="submit" variant="primary" className="w-full" isLoading={isLoading}>
          Masuk
        </Button>
      </form>

      <div className="mt-6 rounded-lg border border-dashed border-line bg-white px-3.5 py-3 text-xs text-muted">
        <p className="font-semibold text-ink">Akun demo</p>
        <p className="mt-1 font-mono">dimas@company.com / password123 <span className="text-muted/70">(Karyawan)</span></p>
        <p className="font-mono">nadia@company.com / password123 <span className="text-muted/70">(Karyawan)</span></p>
        <p className="font-mono">sinta@company.com / password123 <span className="text-muted/70">(HRD)</span></p>
      </div>
    </div>
  )
}
