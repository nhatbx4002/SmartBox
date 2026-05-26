import { useLocation } from 'react-router-dom'
import { Menu, Bell, Search } from 'lucide-react'
import { useUIStore } from '@/store'
import { useQuery } from '@tanstack/react-query'
import { notificationsApi } from '@/lib/api'

const pageTitles: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/cabinets': 'Quản lý Tủ',
  '/rentals': 'Quản lý Thuê',
  '/locations': 'Quản lý Địa điểm',
  '/notifications': 'Thông báo',
  '/audit-logs': 'Audit Logs',
}

export function Header() {
  const { toggleSidebar } = useUIStore()
  const location = useLocation()

  const { data: notifications } = useQuery({
    queryKey: ['notifications', { isRead: false }],
    queryFn: () => notificationsApi.list({ isRead: false }),
    refetchInterval: 30_000,
  })

  const unreadCount = notifications?.length || 0

  const getTitle = () => {
    const path = location.pathname
    for (const [key, value] of Object.entries(pageTitles)) {
      if (path.startsWith(key) && key !== '/') return value
    }
    if (path.startsWith('/cabinets/')) return 'Chi tiết Tủ'
    if (path.startsWith('/rentals/')) return 'Chi tiết Thuê'
    if (path === '/dashboard') return 'Dashboard'
    return 'Admin'
  }

  return (
    <header className="h-16 bg-surface border-b border-border flex items-center justify-between px-4 lg:px-6 sticky top-0 z-30">
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          className="lg:hidden p-2 rounded-lg hover:bg-surface-elevated transition-colors cursor-pointer"
          aria-label="Toggle menu"
        >
          <Menu className="w-5 h-5 text-text-secondary" />
        </button>
        <h1 className="text-base font-semibold text-text-primary">{getTitle()}</h1>
      </div>

      <div className="flex items-center gap-2">
        {/* Search (desktop) */}
        <div className="hidden md:flex items-center gap-2 bg-surface-elevated rounded-lg px-3 h-9 border border-border">
          <Search className="w-4 h-4 text-text-muted" />
          <input
            type="text"
            placeholder="Tìm kiếm..."
            className="bg-transparent text-sm text-text-primary placeholder:text-text-muted outline-none w-48"
          />
        </div>

        {/* Notification bell */}
        <button className="relative p-2 rounded-lg hover:bg-surface-elevated transition-colors cursor-pointer">
          <Bell className="w-5 h-5 text-text-secondary" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 w-4 h-4 bg-error text-white text-[10px] font-bold rounded-full flex items-center justify-center">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>
      </div>
    </header>
  )
}
