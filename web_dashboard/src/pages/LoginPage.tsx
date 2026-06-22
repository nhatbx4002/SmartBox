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
      {/* Atmospheric layered orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-brand/[0.04] rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[50%] h-[50%] bg-info/[0.03] rounded-full blur-[100px]" />
        <div className="absolute top-[40%] left-[60%] w-[30%] h-[40%] bg-success/[0.02] rounded-full blur-[80px]" />
      </div>

      <div className="relative w-full max-w-sm">
        {/* Logo */}
        <div className="flex flex-col items-center mb-10">
          <div className="relative mb-5">
            <div className="w-16 h-16 rounded-2xl bg-brand flex items-center justify-center shadow-[0_0_40px_rgba(255,102,0,0.25)]">
              <svg className="w-9 h-9 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20 3H4a1 1 0 00-1 1v16a1 1 0 001 1h16a1 1 0 001-1V4a1 1 0 00-1-1zM8 19H5v-6h3v6zm0-8H5V5h3v6zm5 8h-3v-6h3v6zm0-8h-3V5h3v6zm5 8h-3v-6h3v6zm0-8h-3V5h3v6z" />
              </svg>
            </div>
            <div className="absolute -inset-1 rounded-2xl bg-brand/20 blur-xl -z-10" />
          </div>
          <h1 className="text-2xl font-bold text-text-primary tracking-tight">OmniBox</h1>
          <p className="text-text-muted text-sm mt-1.5">Admin Dashboard</p>
        </div>

        {/* Refined card with hover glow border */}
        <div className="relative group">
          <div className="absolute -inset-px rounded-2xl bg-gradient-to-br from-brand/25 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="relative bg-surface rounded-2xl border border-border p-7 shadow-[0_8px_40px_rgba(0,0,0,0.45)]">
            <form onSubmit={handleSubmit} className="space-y-5">
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
                <div className="bg-error/8 border border-error/20 rounded-lg px-4 py-3">
                  <p className="text-sm text-error">{error}</p>
                </div>
              )}

              <Button type="submit" loading={loading} className="w-full" size="lg">
                {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
              </Button>
            </form>

            <div className="mt-5 pt-5 border-t border-border/50 text-center">
              <button className="text-sm text-text-muted hover:text-brand cursor-pointer transition-colors duration-150">
                Quên mật khẩu?
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
