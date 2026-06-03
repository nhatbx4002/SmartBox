import { useLocation } from 'react-router-dom'
import { Menu, Bell, Search, X } from 'lucide-react'
import { useState } from 'react'
import { useUIStore } from '@/store'
import { useQuery } from '@tanstack/react-query'
import { notificationsApi } from '@/lib/api'
const pageTitles: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/cabinets': 'Quản lý Tủ',
  '/profiles': 'Profiles',
  '/rentals': 'Quản lý Thuê',
  '/locations': 'Quản lý Địa điểm',
  '/notifications': 'Thông báo',
  '/audit-logs': 'Audit Logs',
}

export function Header() {
  const { toggleSidebar } = useUIStore()
  const location = useLocation()
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchValue, setSearchValue] = useState('')

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
    if (path.startsWith('/profiles/')) return 'Profile'
    if (path.startsWith('/rentals/')) return 'Chi tiết Thuê'
    if (path === '/dashboard') return 'Dashboard'
    return 'Admin'
  }

  return (
    <header className="h-14 bg-surface-2/80 backdrop-blur-md border-b border-border flex items-center justify-between px-4 lg:px-6 sticky top-0 z-30">
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={toggleSidebar}
          className="lg:hidden p-1.5 rounded-radius-md hover:bg-surface-3 transition-colors cursor-pointer"
          aria-label="Toggle menu"
        >
          <Menu className="w-[18px] h-[18px] text-text-secondary" />
        </button>

        <div className="flex flex-col leading-none min-w-0">
          <h1 className="text-sm font-semibold text-text-primary truncate">{getTitle()}</h1>
          {location.pathname !== '/dashboard' && (
            <span className="text-[11px] text-text-muted mt-0.5 hidden sm:block">
              {pageTitles['/dashboard']}
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-1">
        {/* Search — collapsed (icon only on mobile, expandable on desktop) */}
        <div className="hidden md:flex items-center gap-2 bg-surface-3 rounded-radius-lg px-3 h-8 border border-border transition-all duration-200 focus-within:border-brand/40 focus-within:w-56 w-40">
          <Search className="w-3.5 h-3.5 text-text-muted shrink-0" />
          <input
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="Tìm kiếm..."
            className="bg-transparent text-xs text-text-primary placeholder:text-text-muted outline-none w-full"
          />
          {searchValue && (
            <button
              onClick={() => setSearchValue('')}
              className="text-text-muted hover:text-text-primary transition-colors cursor-pointer"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>

        {/* Mobile search toggle */}
        <button
          onClick={() => setSearchOpen(!searchOpen)}
          className="md:hidden p-1.5 rounded-radius-md hover:bg-surface-3 transition-colors cursor-pointer"
          aria-label="Toggle search"
        >
          {searchOpen ? (
            <X className="w-[18px] h-[18px] text-text-secondary" />
          ) : (
            <Search className="w-[18px] h-[18px] text-text-secondary" />
          )}
        </button>

        {/* Notification bell */}
        <button
          className="relative p-1.5 rounded-radius-md hover:bg-surface-3 transition-colors cursor-pointer"
          aria-label="Notifications"
        >
          <Bell className="w-[18px] h-[18px] text-text-secondary" />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-1 bg-error text-white text-[10px] font-bold rounded-full flex items-center justify-center">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>
      </div>

      {/* Mobile search bar */}
      {searchOpen && (
        <div className="absolute top-full left-0 right-0 bg-surface-2 border-b border-border px-4 py-2 md:hidden animate-fade-in-down">
          <div className="flex items-center gap-2 bg-surface-3 rounded-radius-lg px-3 h-9 border border-border">
            <Search className="w-3.5 h-3.5 text-text-muted shrink-0" />
            <input
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Tìm kiếm..."
              autoFocus
              className="bg-transparent text-sm text-text-primary placeholder:text-text-muted outline-none w-full"
            />
            {searchValue && (
              <button
                onClick={() => setSearchValue('')}
                className="text-text-muted hover:text-text-primary transition-colors cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
