import * as React from 'react'
import { cn } from '@/lib/utils'
import type { RentalStatus, CompartmentStatus, CabinetStatus, NotificationType } from '@/types'

type BadgeVariant = 'success' | 'error' | 'warning' | 'muted' | 'info' | 'brand' | 'online' | 'offline' | 'inactive' | 'neutral'

const variantClasses: Record<BadgeVariant, string> = {
  success: 'bg-success/15 text-success',
  error: 'bg-error/15 text-error',
  warning: 'bg-warning/15 text-warning',
  muted: 'bg-white/5 text-text-muted',
  info: 'bg-info/15 text-info',
  brand: 'bg-brand/15 text-brand',
  online: 'bg-online/15 text-online',
  offline: 'bg-error/15 text-error',
  inactive: 'bg-white/5 text-text-muted',
  neutral: 'bg-zinc-800 text-zinc-400',
}

interface BadgeProps {
  variant?: BadgeVariant
  children: React.ReactNode
  className?: string
  dot?: boolean
}

export function Badge({ variant = 'muted', children, className, dot }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2 py-px rounded-full text-label-xs font-medium tracking-wide',
        variantClasses[variant],
        className,
      )}
    >
      {dot && <span className="h-1.5 w-1.5 rounded-full bg-current shrink-0" />}
      {children}
    </span>
  )
}

export function getRentalStatusVariant(status: RentalStatus): BadgeVariant {
  const map: Record<RentalStatus, BadgeVariant> = {
    ACTIVE: 'success',
    COMPLETED: 'muted',
    EXPIRED: 'error',
    CANCELLED: 'warning',
  }
  return map[status]
}

export function getCompartmentStatusVariant(status: CompartmentStatus): BadgeVariant {
  const map: Record<CompartmentStatus, BadgeVariant> = {
    AVAILABLE: 'success',
    OCCUPIED: 'info',
    MAINTENANCE: 'error',
    RESERVED: 'warning',
  }
  return map[status]
}

export function getCabinetStatusVariant(status: CabinetStatus): BadgeVariant {
  const map: Record<CabinetStatus, BadgeVariant> = {
    ONLINE: 'online',
    OFFLINE: 'offline',
    INACTIVE: 'inactive',
    PENDING_REGISTRATION: 'warning',
    PENDING_PROVISION: 'warning',
    PROVISION_FAILED: 'error',
    DRAFT: 'muted',
    ACTIVE: 'online',
    CONFIGURING: 'warning',
  }
  return map[status] ?? 'muted'
}

export function getNotificationTypeVariant(type: NotificationType): BadgeVariant {
  const map: Record<NotificationType, BadgeVariant> = {
    RENTAL_EXPIRED: 'error',
    PAYMENT_SUCCESS: 'success',
    CABINET_OFFLINE: 'warning',
    SYSTEM: 'info',
  }
  return map[type]
}

export function getCompartmentStatusColor(status: CompartmentStatus) {
  const colors: Record<CompartmentStatus, { bg: string; border: string; text: string }> = {
    AVAILABLE: { bg: 'bg-success/15', border: 'border-success', text: 'text-success' },
    OCCUPIED: { bg: 'bg-info/15', border: 'border-info', text: 'text-info' },
    MAINTENANCE: { bg: 'bg-error/15', border: 'border-error', text: 'text-error' },
    RESERVED: { bg: 'bg-warning/15', border: 'border-warning', text: 'text-warning' },
  }
  return colors[status]
}
