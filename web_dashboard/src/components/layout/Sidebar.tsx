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
  Settings,
  ShieldCheck,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuthStore, useUIStore } from '@/store'
import type { AdminRole } from '@/types'

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard', roles: ['SUPER_ADMIN', 'CABINET_ADMIN'] as AdminRole[] },
  { to: '/cabinets', icon: Warehouse, label: 'Tủ', roles: ['SUPER_ADMIN', 'CABINET_ADMIN'] as AdminRole[] },
  { to: '/profiles', icon: Settings, label: 'Profiles', roles: ['SUPER_ADMIN'] as AdminRole[] },
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
          className="fixed inset-0 bg-black/60 backdrop-blur-[2px] z-40 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar panel */}
      <aside
        className={cn(
          'fixed left-0 top-0 h-full z-50 flex flex-col',
          'bg-surface-2 border-r border-border',
          'transition-all duration-200',
          sidebarCollapsed ? 'w-16' : 'w-56',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
        )}
      >
        {/* Logo strip */}
        <div className={cn(
          'flex items-center gap-3 h-14 px-3 shrink-0',
          'border-b border-border',
          sidebarCollapsed && 'justify-center px-0',
        )}>
          <div className="w-7 h-7 rounded-md bg-brand flex items-center justify-center shrink-0">
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20 3H4a1 1 0 00-1 1v16a1 1 0 001 1h16a1 1 0 001-1V4a1 1 0 00-1-1zM8 19H5v-6h3v6zm0-8H5V5h3v6zm5 8h-3v-6h3v6zm0-8h-3V5h3v6zm5 8h-3v-6h3v6zm0-8h-3V5h3v6z" />
            </svg>
          </div>
          {!sidebarCollapsed && (
            <div className="flex flex-col leading-none">
              <span className="font-bold text-brand text-[15px] tracking-tight">SmartBox</span>
              <span className="text-label-xs text-text-muted mt-0.5">Admin Panel</span>
            </div>
          )}
        </div>

        {/* Nav items */}
        <nav className="flex-1 py-3 px-2 space-y-0.5 overflow-y-auto overflow-x-hidden">
          {filteredNav.map((item) => {
            const isActive = location.pathname.startsWith(item.to)
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => { if (window.innerWidth < 1024) toggleSidebar() }}
                className={cn(
                  'group relative flex items-center gap-3 px-3 py-2 rounded-radius-md',
                  'text-sm font-medium',
                  'transition-all duration-150',
                  isActive
                    ? 'bg-brand text-white'
                    : 'text-text-secondary hover:bg-surface-3 hover:text-text-primary',
                  sidebarCollapsed && 'justify-center px-0 w-full',
                )}
              >
                {/* Active left indicator (collapsed state) */}
                {isActive && sidebarCollapsed && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-brand rounded-r-full" />
                )}

                <item.icon
                  className={cn(
                    'w-[18px] h-[18px] shrink-0 transition-colors duration-150',
                  )}
                />
                {!sidebarCollapsed && (
                  <span className="truncate">{item.label}</span>
                )}

                {/* Tooltip for collapsed state */}
                {sidebarCollapsed && (
                  <span className="absolute left-full ml-2 px-2 py-1 rounded-radius-sm bg-surface-3 text-text-primary text-xs font-medium whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-150 z-50 shadow-surface-md border border-border">
                    {item.label}
                  </span>
                )}
              </NavLink>
            )
          })}
        </nav>

        {/* Bottom section: admin info + logout */}
        <div className="shrink-0 border-t border-border">
          {/* Admin identity */}
          {admin && (
            <div className={cn(
              'flex items-center gap-2.5 px-3 py-2.5',
              sidebarCollapsed && 'justify-center',
            )}>
              <div className="w-7 h-7 rounded-full bg-brand/15 border border-brand/20 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-3.5 h-3.5 text-brand" />
              </div>
              {!sidebarCollapsed && (
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-text-primary truncate leading-tight">{admin.name}</p>
                  <p className="text-[11px] text-text-muted truncate mt-0.5">
                    {admin.role === 'SUPER_ADMIN' ? 'Super Admin' : 'Cabinet Admin'}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Logout */}
          <button
            onClick={logout}
            className={cn(
              'group flex items-center gap-3 px-3 py-2 w-full',
              'text-sm text-text-muted hover:text-error',
              'hover:bg-error/5 transition-all duration-150',
              sidebarCollapsed && 'justify-center px-0',
            )}
          >
            <LogOut className="w-[18px] h-[18px] shrink-0 transition-colors" />
            {!sidebarCollapsed && <span>Đăng xuất</span>}
            {sidebarCollapsed && (
              <span className="absolute left-full ml-2 px-2 py-1 rounded-radius-sm bg-surface-3 text-text-primary text-xs font-medium whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-150 z-50 shadow-surface-md border border-border">
                Đăng xuất
              </span>
            )}
          </button>
        </div>

        {/* Desktop collapse toggle */}
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className={cn(
            'hidden lg:flex absolute top-[52px] items-center justify-center',
            'w-5 h-5 rounded-full border border-border',
            'bg-surface-2 text-text-muted',
            'hover:bg-surface-3 hover:text-text-primary',
            'transition-all duration-150 cursor-pointer',
            'hover:border-border',
            sidebarCollapsed ? 'right-[-10px]' : 'right-[-10px]',
          )}
        >
          {sidebarCollapsed
            ? <ChevronRight className="w-2.5 h-2.5" />
            : <ChevronLeft className="w-2.5 h-2.5" />}
        </button>
      </aside>
    </>
  )
}
