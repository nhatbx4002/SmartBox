import * as React from 'react'
import { Navigate } from 'react-router-dom'
import { toast } from 'sonner'
import { useAuthStore } from '@/store'
import { authApi } from '@/lib/api'
import { Button, Input } from '@/components/ui'

export default function LoginPage() {
  const { isAuthenticated, login } = useAuthStore()
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState('')

  if (isAuthenticated) return <Navigate to="/dashboard" replace />

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!email) {
      setError('Vui lòng nhập email')
      return
    }
    if (!password) {
      setError('Vui lòng nhập mật khẩu')
      return
    }

    setLoading(true)
    try {
      const res = await authApi.login(email, password)
      login(res.admin, res.accessToken)
      toast.success('Đăng nhập thành công!')
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { error?: { message?: string }; message?: string } } })?.response?.data?.error?.message ||
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Đăng nhập thất bại'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      {/* Background gradient */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-info/5 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-sm">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-brand flex items-center justify-center mb-4 shadow-lg shadow-brand/20">
            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20 3H4a1 1 0 00-1 1v16a1 1 0 001 1h16a1 1 0 001-1V4a1 1 0 00-1-1zM8 19H5v-6h3v6zm0-8H5V5h3v6zm5 8h-3v-6h3v6zm0-8h-3V5h3v6zm5 8h-3v-6h3v6zm0-8h-3V5h3v6z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-text-primary">SmartBox</h1>
          <p className="text-text-secondary text-sm mt-1">Admin Dashboard</p>
        </div>

        {/* Form Card */}
        <div className="bg-surface rounded-2xl border border-border p-6 shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email"
              type="email"
              placeholder="admin@smartbox.vn"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
            <Input
              label="Mật khẩu"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />

            {error && (
              <div className="bg-error/10 border border-error/20 rounded-lg px-4 py-3">
                <p className="text-sm text-error">{error}</p>
              </div>
            )}

            <Button type="submit" loading={loading} className="w-full" size="lg">
              {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
            </Button>
          </form>

          <div className="mt-4 text-center">
            <button className="text-sm text-text-secondary hover:text-brand underline cursor-pointer transition-colors">
              Quên mật khẩu?
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
