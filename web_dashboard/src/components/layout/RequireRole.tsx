import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '@/store'
import type { AdminRole } from '@/types'

export function RequireRole({ roles }: { roles: AdminRole[] }) {
  const { admin } = useAuthStore()
  if (!admin || !roles.includes(admin.role)) return <Navigate to="/dashboard" replace />
  return <Outlet />
}
