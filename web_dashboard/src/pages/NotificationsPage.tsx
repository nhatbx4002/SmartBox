import * as React from 'react'
import { useNavigate } from 'react-router-dom'
import { CheckCheck, AlertTriangle, CreditCard, WifiOff, Bug, Info } from 'lucide-react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { notificationsApi } from '@/lib/api'
import { Badge, Tabs } from '@/components/ui'
import { getNotificationTypeVariant } from '@/components/ui/Badge'
import { formatRelativeTime, cn } from '@/lib/utils'
import type { Notification, NotificationType } from '@/types'

const typeIcons: Record<NotificationType, React.ElementType> = {
  RENTAL_EXPIRED: AlertTriangle,
  RENTAL_STARTED: AlertTriangle,
  PAYMENT_SUCCESS: CreditCard,
  CABINET_OFFLINE: WifiOff,
  HARDWARE_FAULT: Bug,
}

const typeColors: Record<NotificationType, string> = {
  RENTAL_EXPIRED: 'text-error',
  RENTAL_STARTED: 'text-info',
  PAYMENT_SUCCESS: 'text-success',
  CABINET_OFFLINE: 'text-warning',
  HARDWARE_FAULT: 'text-error',
}

const typeBorderColors: Record<NotificationType, string> = {
  RENTAL_EXPIRED: 'border-l-error',
  RENTAL_STARTED: 'border-l-info',
  PAYMENT_SUCCESS: 'border-l-success',
  CABINET_OFFLINE: 'border-l-warning',
  HARDWARE_FAULT: 'border-l-error',
}

export default function NotificationsPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [tab, setTab] = React.useState('all')

  const { data: notifications, isLoading } = useQuery({
    queryKey: ['notifications'],
    queryFn: () => notificationsApi.list(),
  })

  const markReadMutation = useMutation({
    mutationFn: (id: string) => notificationsApi.markRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
    },
  })

  const markAllReadMutation = useMutation({
    mutationFn: () => notificationsApi.markAllRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
    },
  })

  const allNotifications = notifications ?? []
  const filtered = tab === 'all' ? allNotifications
    : tab === 'unread' ? allNotifications.filter((n) => !n.isRead)
    : allNotifications.filter((n) => n.isRead)

  const unreadCount = allNotifications.filter((n) => !n.isRead).length

  const handleClick = (notif: Notification) => {
    if (!notif.isRead) markReadMutation.mutate(notif.id)
    if (notif.relatedRentalId) navigate(`/rentals/${notif.relatedRentalId}`)
    else if (notif.relatedCabinetId) navigate(`/cabinets/${notif.relatedCabinetId}`)
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-text-primary">Thông báo</h2>
        {unreadCount > 0 && (
          <button
            onClick={() => markAllReadMutation.mutate()}
            className="flex items-center gap-2 text-sm text-brand hover:text-brand-hover cursor-pointer transition-colors"
          >
            <CheckCheck className="h-4 w-4" /> Đánh dấu đã đọc ({unreadCount})
          </button>
        )}
      </div>

      <Tabs
        tabs={[
          { value: 'all', label: `Tất cả (${allNotifications.length})` },
          { value: 'unread', label: `Chưa đọc (${allNotifications.filter((n) => !n.isRead).length})` },
          { value: 'read', label: `Đã đọc (${allNotifications.filter((n) => n.isRead).length})` },
        ]}
        value={tab}
        onValueChange={setTab}
      />

      <div className="space-y-2">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-20 bg-surface rounded-xl border border-border animate-shimmer" />
          ))
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-12 h-12 rounded-full bg-surface-elevated flex items-center justify-center mb-3">
              <Info className="h-6 w-6 text-text-muted" />
            </div>
            <p className="text-text-secondary font-medium">Không có thông báo</p>
          </div>
        ) : (
          filtered.map((notif) => {
            const Icon = typeIcons[notif.type]
            return (
              <div
                key={notif.id}
                onClick={() => handleClick(notif)}
                className={cn(
                  'group relative bg-surface rounded-xl border border-border p-4 cursor-pointer transition-all duration-150 overflow-hidden',
                  'hover:bg-surface-elevated hover:border-border',
                  !notif.isRead && 'bg-surface-elevated/40',
                )}
              >
                {/* Left accent border */}
                <div className={cn('absolute left-0 top-0 bottom-0 w-1 rounded-l-xl', typeBorderColors[notif.type].replace('border-l-', 'bg-'))} />
                <div className="pl-4 flex items-start gap-3">
                  <div className={cn('shrink-0 mt-0.5', typeColors[notif.type])}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <h4 className={cn('text-sm font-semibold', !notif.isRead ? 'text-text-primary' : 'text-text-secondary')}>
                        {notif.title}
                      </h4>
                      <span className="text-xs text-text-muted shrink-0 mt-0.5">{formatRelativeTime(notif.createdAt)}</span>
                    </div>
                    <p className="text-sm text-text-secondary mt-1 line-clamp-2">{notif.body}</p>
                    <div className="mt-2">
                      <Badge variant={getNotificationTypeVariant(notif.type)} className="text-[10px]">{notif.type}</Badge>
                    </div>
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
