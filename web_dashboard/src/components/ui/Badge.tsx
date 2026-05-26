import * as React from 'react'
import { cn } from '@/lib/utils'
import type { RentalStatus, CompartmentStatus, CabinetStatus, NotificationType } from '@/types'

type BadgeVariant = 'success' | 'error' | 'warning' | 'muted' | 'info' | 'brand' | 'online' | 'offline' | 'inactive'

const variantClasses: Record<BadgeVariant, string> = {
  success: 'bg-success/20 text-success border-success/30',
  error: 'bg-error/20 text-error border-error/30',
  warning: 'bg-warning/20 text-warning border-warning/30',
  muted: 'bg-text-muted/20 text-text-muted border-text-muted/30',
  info: 'bg-info/20 text-info border-info/30',
  brand: 'bg-brand/20 text-brand border-brand/30',
  online: 'bg-online/20 text-online border-online/30',
  offline: 'bg-error/20 text-error border-error/30',
  inactive: 'bg-text-muted/20 text-text-muted border-text-muted/30',
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
        'inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md border text-xs font-medium',
        variantClasses[variant],
        className,
      )}
    >
      {dot && <span className="h-1.5 w-1.5 rounded-full bg-current" />}
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
  }
  return map[status]
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
