import { useLocation, useNavigate } from 'react-router-dom'
import { Menu, Bell } from 'lucide-react'
import { useUIStore, useAuthStore } from '@/store'
import { useQuery } from '@tanstack/react-query'
import { notificationsApi } from '@/lib/api'
import { cn } from '@/lib/utils'

const pageTitles: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/cabinets': 'Tủ',
  '/pairing': 'Ghép tủ',
  '/rentals': 'Thuê',
  '/locations': 'Địa điểm',
  '/notifications': 'Thông báo',
  '/audit-logs': 'Audit Logs',
  '/admins': 'Quản lý Admin',
  '/price-plans': 'Bảng giá',
}

function getTitle(pathname: string): { title: string; parent?: string } {
  if (pathname.startsWith('/cabinets/')) return { title: 'Chi tiết Tủ', parent: 'Tủ' }
  if (pathname.startsWith('/rentals/')) return { title: 'Chi tiết Thuê', parent: 'Thuê' }
  for (const [key, value] of Object.entries(pageTitles)) {
    if (pathname === key || (pathname.startsWith(key) && key !== '/')) return { title: value }
  }
  return { title: 'Admin' }
}

function AdminAvatar({ name, role }: { name: string; role: string }) {
  const initials = name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
  const isSuper = role === 'SUPER_ADMIN'
  return (
    <div className="flex items-center gap-2.5">
      <div className="hidden flex-col items-end leading-none sm:flex">
        <span className="text-xs font-medium text-zinc-300 tracking-tight">{name}</span>
        <span className={cn(
          'mt-0.5 text-[10px] font-semibold tracking-wider uppercase',
          isSuper ? 'text-brand' : 'text-zinc-500',
        )}>
          {isSuper ? 'Super Admin' : 'Cabinet Admin'}
        </span>
      </div>
      <div className={cn(
        'flex h-8 w-8 items-center justify-center rounded-lg text-xs font-bold tracking-tight transition-all duration-200',
        isSuper
          ? 'bg-brand/15 text-brand border border-brand/25'
          : 'bg-zinc-800 text-zinc-300 border border-zinc-700',
      )}>
        {initials}
      </div>
    </div>
  )
}

export function Header() {
  const { toggleSidebar } = useUIStore()
  const { admin } = useAuthStore()
  const location = useLocation()
  const navigate = useNavigate()

  const { data: notifications } = useQuery({
    queryKey: ['notifications', { isRead: false }],
    queryFn: () => notificationsApi.list({ isRead: false }),
    refetchInterval: 30_000,
  })

  const unreadCount = notifications?.length || 0
  const { title, parent } = getTitle(location.pathname)

  return (
    <header className="h-14 sticky top-0 z-30 flex items-center justify-between border-b border-zinc-800/60 bg-zinc-950/80 px-4 backdrop-blur-md lg:px-4" style={{ boxShadow: 'inset 0 -1px 0 rgba(255,255,255,0.03)' }}>
      {/* Left — mobile toggle + breadcrumb */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={toggleSidebar}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-zinc-500 transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-zinc-800 hover:text-zinc-300 active:scale-90 lg:hidden"
          aria-label="Toggle menu"
        >
          <Menu className="h-4 w-4" strokeWidth={1.5} />
        </button>

        <div className="flex items-center gap-2 min-w-0">
          {parent && (
            <>
              <span className="hidden text-xs text-zinc-600 sm:inline">{parent}</span>
              <span className="hidden text-xs text-zinc-700 sm:inline">/</span>
            </>
          )}
          <h1 className="truncate text-sm font-semibold tracking-tight text-zinc-200">{title}</h1>
        </div>
      </div>

      {/* Right — bell + admin */}
      <div className="flex items-center gap-3">
        {/* Notification bell */}
        <button
          onClick={() => navigate('/notifications')}
          className="relative flex h-8 w-8 items-center justify-center rounded-lg text-zinc-500 transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-zinc-800 hover:text-zinc-300 active:scale-90"
          aria-label="Notifications"
        >
          <Bell className="h-4 w-4" strokeWidth={1.5} />
          {unreadCount > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand px-1 text-[10px] font-bold text-white">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand/60 opacity-75" />
              <span className="relative">{unreadCount > 9 ? '9+' : unreadCount}</span>
            </span>
          )}
        </button>

        {/* Divider */}
        <div className="h-5 w-px bg-zinc-800" />

        {/* Admin info */}
        {admin && <AdminAvatar name={admin.name} role={admin.role} />}
      </div>
    </header>
  )
}
