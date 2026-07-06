import { NavLink, useLocation } from 'react-router-dom'
import {
  LayoutDashboard, Warehouse, MapPin, ClipboardList, Bell, LogOut,
  ChevronLeft, ChevronRight, FileText, Link, Users, Tag,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuthStore, useUIStore } from '@/store'
import type { AdminRole } from '@/types'

const navItems = [
  { to: '/dashboard',     icon: LayoutDashboard, label: 'Dashboard',      roles: ['SUPER_ADMIN', 'CABINET_ADMIN'] as AdminRole[] },
  { to: '/pairing',       icon: Link,            label: 'Ghép tủ',         roles: ['SUPER_ADMIN', 'CABINET_ADMIN'] as AdminRole[] },
  { to: '/cabinets',      icon: Warehouse,        label: 'Tủ',              roles: ['SUPER_ADMIN', 'CABINET_ADMIN'] as AdminRole[] },
  { to: '/locations',     icon: MapPin,           label: 'Địa điểm',        roles: ['SUPER_ADMIN'] as AdminRole[] },
  { to: '/rentals',       icon: ClipboardList,    label: 'Thuê',             roles: ['SUPER_ADMIN', 'CABINET_ADMIN'] as AdminRole[] },
  { to: '/notifications', icon: Bell,             label: 'Thông báo',       roles: ['SUPER_ADMIN', 'CABINET_ADMIN'] as AdminRole[] },
  { to: '/audit-logs',    icon: FileText,         label: 'Audit Logs',      roles: ['SUPER_ADMIN'] as AdminRole[] },
  { to: '/admins',        icon: Users,            label: 'Quản lý Admin',   roles: ['SUPER_ADMIN'] as AdminRole[] },
  { to: '/price-plans',   icon: Tag,              label: 'Bảng giá',        roles: ['SUPER_ADMIN'] as AdminRole[] },
]

export function Sidebar() {
  const { admin, logout } = useAuthStore()
  const { sidebarOpen, sidebarCollapsed, toggleSidebar, setSidebarCollapsed } = useUIStore()
  const location = useLocation()

  const filteredNav = navItems.filter((item) => !admin || item.roles.includes(admin.role))
  const initials = admin ? admin.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() : '?'

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-zinc-950/70 backdrop-blur-sm lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      <aside
        className={cn(
          'fixed left-0 top-0 z-50 flex h-full flex-col',
          'border-r border-zinc-800/60 bg-zinc-950',
          'transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]',
          sidebarCollapsed ? 'w-16' : 'w-56',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
        )}
      >
        {/* Logo */}
        <div className={cn(
          'flex h-14 shrink-0 items-center border-b border-zinc-800/50 px-3.5',
          sidebarCollapsed && 'justify-center px-0',
        )}>
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-brand">
            <svg className="h-4 w-4 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20 3H4a1 1 0 00-1 1v16a1 1 0 001 1h16a1 1 0 001-1V4a1 1 0 00-1-1zM8 19H5v-6h3v6zm0-8H5V5h3v6zm5 8h-3v-6h3v6zm0-8h-3V5h3v6zm5 8h-3v-6h3v6zm0-8h-3V5h3v6z" />
            </svg>
          </div>
          {!sidebarCollapsed && (
            <div className="ml-2.5 flex flex-col leading-none">
              <span className="text-[15px] font-bold tracking-tight text-brand">OmniBox</span>
              <span className="mt-0.5 text-[10px] tracking-wider text-zinc-500">ADMIN</span>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-x-hidden overflow-y-auto px-2 py-3">
          <div className="space-y-0.5">
            {filteredNav.map((item, i) => {
              const isActive = location.pathname.startsWith(item.to)
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => { if (window.innerWidth < 1024) toggleSidebar() }}
                  className={cn(
                    'group relative flex items-center rounded-lg px-2.5 py-2 text-sm font-medium',
                    'transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)]',
                    'active:scale-[0.97]',
                    isActive
                      ? 'bg-zinc-800/80 text-zinc-100'
                      : 'text-zinc-500 hover:bg-zinc-900/80 hover:text-zinc-300',
                    sidebarCollapsed && 'justify-center px-0 w-full',
                  )}
                  style={{ animationDelay: `${i * 40}ms` }}
                >
                  {/* Active accent bar */}
                  {isActive && !sidebarCollapsed && (
                    <span className="absolute left-0 top-1/2 h-4 w-[3px] -translate-y-1/2 rounded-r-full bg-brand" />
                  )}
                  {isActive && sidebarCollapsed && (
                    <span className="absolute left-0 top-1/2 h-4 w-[3px] -translate-y-1/2 rounded-r-full bg-brand" />
                  )}

                  <item.icon
                    className={cn(
                      'h-[18px] w-[18px] shrink-0 transition-colors duration-200',
                      isActive ? 'text-zinc-100' : 'text-zinc-500 group-hover:text-zinc-300',
                    )}
                    strokeWidth={isActive ? 2 : 1.5}
                  />

                  {!sidebarCollapsed && (
                    <span className="ml-2.5 truncate">{item.label}</span>
                  )}

                  {/* Tooltip — collapsed only */}
                  {sidebarCollapsed && (
                    <span className={cn(
                      'pointer-events-none absolute left-full ml-2.5 whitespace-nowrap rounded-md',
                      'border border-zinc-800 bg-zinc-900 px-2.5 py-1.5 text-xs font-medium text-zinc-200',
                      'opacity-0 transition-all duration-200 group-hover:opacity-100',
                      'translate-x-1 group-hover:translate-x-0',
                    )}>
                      {item.label}
                    </span>
                  )}
                </NavLink>
              )
            })}
          </div>
        </nav>

        {/* Bottom: admin + logout */}
        <div className="shrink-0 border-t border-zinc-800/50">
          {admin && (
            <div className={cn(
              'flex items-center gap-2.5 px-3.5 py-3',
              sidebarCollapsed && 'justify-center px-0',
            )}>
              <div className={cn(
                'flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-[11px] font-bold tracking-tight',
                admin.role === 'SUPER_ADMIN'
                  ? 'bg-brand/15 text-brand border border-brand/20'
                  : 'bg-zinc-800 text-zinc-400 border border-zinc-700',
              )}>
                {initials}
              </div>
              {!sidebarCollapsed && (
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-semibold leading-tight text-zinc-300">{admin.name}</p>
                  <p className={cn('mt-0.5 text-[10px] tracking-wider uppercase truncate', admin.role === 'SUPER_ADMIN' ? 'text-brand' : 'text-zinc-600')}>
                    {admin.role === 'SUPER_ADMIN' ? 'Super' : 'Cabinet'}
                  </p>
                </div>
              )}
            </div>
          )}

          <button
            onClick={logout}
            className={cn(
              'group relative flex w-full items-center py-2.5 text-sm text-zinc-600',
              'transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)]',
              'hover:bg-red-500/5 hover:text-red-400 active:scale-[0.98]',
              sidebarCollapsed ? 'justify-center px-0' : 'gap-2.5 px-3.5',
            )}
          >
            <LogOut className="h-[17px] w-[17px] shrink-0" strokeWidth={1.5} />
            {!sidebarCollapsed && <span>Đăng xuất</span>}
            {sidebarCollapsed && (
              <span className={cn(
                'pointer-events-none absolute left-full ml-2.5 whitespace-nowrap rounded-md',
                'border border-zinc-800 bg-zinc-900 px-2.5 py-1.5 text-xs font-medium text-zinc-200',
                'opacity-0 transition-all duration-200 group-hover:opacity-100',
                'translate-x-1 group-hover:translate-x-0',
              )}>
                Đăng xuất
              </span>
            )}
          </button>
        </div>

        {/* Collapse toggle — desktop only */}
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className={cn(
            'absolute -right-3 top-[52px] hidden h-6 w-6 cursor-pointer items-center justify-center rounded-full lg:flex',
            'border border-zinc-700/80 bg-zinc-900 text-zinc-500',
            'transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)]',
            'hover:border-zinc-600 hover:bg-zinc-800 hover:text-zinc-300 active:scale-90',
          )}
        >
          {sidebarCollapsed
            ? <ChevronRight className="h-3 w-3" strokeWidth={2} />
            : <ChevronLeft className="h-3 w-3" strokeWidth={2} />}
        </button>
      </aside>
    </>
  )
}
