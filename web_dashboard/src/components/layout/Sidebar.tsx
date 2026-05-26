import { NavLink, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  Warehouse,
  MapPin,
  ClipboardList,
  Bell,
  LogOut,
  ChevronLeft,
  ChevronRight,
  FileText,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuthStore, useUIStore } from '@/store'
import type { AdminRole } from '@/types'

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard', roles: ['SUPER_ADMIN', 'CABINET_ADMIN'] as AdminRole[] },
  { to: '/cabinets', icon: Warehouse, label: 'Tủ', roles: ['SUPER_ADMIN', 'CABINET_ADMIN'] as AdminRole[] },
  { to: '/locations', icon: MapPin, label: 'Địa điểm', roles: ['SUPER_ADMIN'] as AdminRole[] },
  { to: '/rentals', icon: ClipboardList, label: 'Thuê', roles: ['SUPER_ADMIN', 'CABINET_ADMIN'] as AdminRole[] },
  { to: '/notifications', icon: Bell, label: 'Thông báo', roles: ['SUPER_ADMIN', 'CABINET_ADMIN'] as AdminRole[] },
  { to: '/audit-logs', icon: FileText, label: 'Audit Logs', roles: ['SUPER_ADMIN'] as AdminRole[] },
]

export function Sidebar() {
  const { admin, logout } = useAuthStore()
  const { sidebarOpen, sidebarCollapsed, toggleSidebar, setSidebarCollapsed } = useUIStore()
  const location = useLocation()

  const filteredNav = navItems.filter((item) => !admin || item.roles.includes(admin.role))

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-0 h-full z-50 bg-surface border-r border-border flex flex-col',
          'transition-all duration-300 ease-in-out',
          sidebarCollapsed ? 'w-16' : 'w-60',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
        )}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 h-16 border-b border-border shrink-0">
          <div className="w-8 h-8 rounded-lg bg-brand flex items-center justify-center shrink-0">
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20 3H4a1 1 0 00-1 1v16a1 1 0 001 1h16a1 1 0 001-1V4a1 1 0 00-1-1zM8 19H5v-6h3v6zm0-8H5V5h3v6zm5 8h-3v-6h3v6zm0-8h-3V5h3v6zm5 8h-3v-6h3v6zm0-8h-3V5h3v6z" />
            </svg>
          </div>
          {!sidebarCollapsed && (
            <span className="font-bold text-brand text-lg">SmartBox</span>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
          {filteredNav.map((item) => {
            const isActive = location.pathname.startsWith(item.to)
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => { if (window.innerWidth < 1024) toggleSidebar() }}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-150',
                  'text-sm font-medium',
                  isActive
                    ? 'bg-brand/10 text-brand border-l-[3px] border-brand -ml-[3px]'
                    : 'text-text-secondary hover:bg-surface-elevated hover:text-text-primary',
                )}
              >
                <item.icon className={cn('w-5 h-5 shrink-0', isActive && 'text-brand')} />
                {!sidebarCollapsed && <span>{item.label}</span>}
              </NavLink>
            )
          })}
        </nav>

        {/* Admin & Logout */}
        <div className="p-3 border-t border-border shrink-0">
          {admin && (
            <div className={cn('flex items-center gap-3 mb-2', sidebarCollapsed && 'justify-center')}>
              <div className="w-8 h-8 rounded-full bg-brand/20 flex items-center justify-center shrink-0">
                <span className="text-xs font-bold text-brand">{admin.name.charAt(0)}</span>
              </div>
              {!sidebarCollapsed && (
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-text-primary truncate">{admin.name}</p>
                  <p className="text-xs text-text-muted">{admin.role === 'SUPER_ADMIN' ? 'Super Admin' : 'Cabinet Admin'}</p>
                </div>
              )}
            </div>
          )}
          <button
            onClick={logout}
            className={cn(
              'flex items-center gap-3 px-3 py-2 rounded-lg w-full',
              'text-sm text-text-muted hover:bg-surface-elevated hover:text-error',
              'transition-colors duration-150 cursor-pointer',
              sidebarCollapsed && 'justify-center',
            )}
          >
            <LogOut className="w-4 h-4 shrink-0" />
            {!sidebarCollapsed && <span>Đăng xuất</span>}
          </button>
        </div>

        {/* Collapse toggle (desktop) */}
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="hidden lg:flex absolute -right-3 top-20 w-6 h-6 rounded-full bg-surface border border-border items-center justify-center cursor-pointer hover:bg-surface-elevated transition-colors"
        >
          {sidebarCollapsed
            ? <ChevronRight className="w-3 h-3 text-text-muted" />
            : <ChevronLeft className="w-3 h-3 text-text-muted" />}
        </button>
      </aside>
    </>
  )
}
