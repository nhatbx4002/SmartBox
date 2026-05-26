import * as React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, CheckCircle, Lock, XCircle } from 'lucide-react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { Button, Badge, ConfirmDialog, Skeleton } from '@/components/ui'
import { getRentalStatusVariant } from '@/components/ui/Badge'
import { formatDateTime, formatCurrency, isExpiringSoon, cn } from '@/lib/utils'
import { rentalsApi } from '@/lib/api'

export default function RentalDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [cancelDialogOpen, setCancelDialogOpen] = React.useState(false)

  const { data, isLoading } = useQuery({
    queryKey: ['rental', id],
    queryFn: () => rentalsApi.getDetail(id as string),
    enabled: Boolean(id),
  })

  const unlockMutation = useMutation({
    mutationFn: () => rentalsApi.unlock(id as string),
    onSuccess: () => {
      toast.success('Compartment unlocked')
      queryClient.invalidateQueries({ queryKey: ['rental', id] })
      queryClient.invalidateQueries({ queryKey: ['rentals'] })
    },
    onError: () => toast.error('Could not unlock compartment'),
  })

  const cancelMutation = useMutation({
    mutationFn: () => rentalsApi.cancel(id as string),
    onSuccess: () => {
      toast.success('Rental cancelled')
      setCancelDialogOpen(false)
      queryClient.invalidateQueries({ queryKey: ['rentals'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] })
      navigate('/rentals')
    },
    onError: () => toast.error('Could not cancel rental'),
  })

  if (isLoading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <Skeleton className="h-10 w-64" />
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <Skeleton className="h-72 lg:col-span-3" />
          <Skeleton className="h-72 lg:col-span-2" />
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="space-y-4 animate-fade-in">
        <Button variant="ghost" onClick={() => navigate('/rentals')}>
          <ArrowLeft className="h-4 w-4" /> Back to rentals
        </Button>
        <p className="text-sm text-text-muted">Rental not found.</p>
      </div>
    )
  }

  const { rental, events } = data
  const hoursLeft = rental.expiresAt
    ? Math.max(0, Math.floor((new Date(rental.expiresAt).getTime() - Date.now()) / 3_600_000))
    : 0

  const infoRows = [
    { label: 'Code', value: '#' + rental.code, mono: true },
    { label: 'Status', value: <Badge variant={getRentalStatusVariant(rental.status)} dot>{rental.status}</Badge> },
    { label: 'Customer', value: rental.customerPhone || '-' },
    { label: 'Compartment', value: `${rental.compartmentName} - ${rental.cabinetName}` },
    { label: 'Plan', value: rental.planName },
    { label: 'Price', value: formatCurrency(rental.price) },
    {
      label: 'Expires',
      value: (
        <span className={cn(isExpiringSoon(rental.expiresAt) && 'text-error')}>
          {formatDateTime(rental.expiresAt)}
          {rental.status === 'ACTIVE' && hoursLeft > 0 && (
            <span className="ml-2 text-xs text-error">{hoursLeft}h left</span>
          )}
        </span>
      ),
    },
    {
      label: 'Payment',
      value: `${rental.paymentStatus}${rental.paymentMethod ? ` (${rental.paymentMethod})` : ''}`,
    },
  ]

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate('/rentals')}
          className="p-2 rounded-lg hover:bg-surface-elevated transition-colors cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4 text-text-secondary" />
        </button>
        <h2 className="text-lg font-semibold text-text-primary">Rental #{rental.code}</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3 space-y-4">
          <div className="bg-surface rounded-xl border border-border p-6">
            <h3 className="text-sm font-semibold text-text-primary mb-4">Info</h3>
            <div className="space-y-3">
              {infoRows.map((row) => (
                <div key={row.label} className="flex items-start justify-between gap-4">
                  <span className="text-sm text-text-secondary w-32 shrink-0">{row.label}</span>
                  <span className={cn('text-sm font-medium text-text-primary text-right', row.mono && 'font-mono')}>
                    {row.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {rental.status === 'ACTIVE' && (
            <div className="flex gap-3">
              <Button className="flex-1" loading={unlockMutation.isPending} onClick={() => unlockMutation.mutate()}>
                <Lock className="h-4 w-4" /> Unlock
              </Button>
              <Button variant="danger" onClick={() => setCancelDialogOpen(true)}>
                <XCircle className="h-4 w-4" /> Cancel rental
              </Button>
            </div>
          )}

          <div className="bg-surface rounded-xl border border-border p-6">
            <h3 className="text-sm font-semibold text-text-primary mb-4">Logs</h3>
            {events.length === 0 ? (
              <p className="text-sm text-text-muted">No logs for this rental.</p>
            ) : (
              <div className="space-y-3">
                {events.map((event) => (
                  <div key={event.id} className="flex items-start gap-3">
                    <div className={cn(
                      'w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5',
                      event.success ? 'bg-success/20' : 'bg-error/20',
                    )}>
                      {event.success
                        ? <CheckCircle className="h-3 w-3 text-success" />
                        : <XCircle className="h-3 w-3 text-error" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-sm font-medium text-text-primary">{event.description}</span>
                      <div className="flex items-center gap-2 mt-0.5 text-xs text-text-muted">
                        <span>{formatDateTime(event.timestamp)}</span>
                        {event.ipAddress && <span>IP {event.ipAddress}</span>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-surface rounded-xl border border-border p-6">
            <h3 className="text-sm font-semibold text-text-primary mb-4">Timeline</h3>
            {events.length === 0 ? (
              <p className="text-sm text-text-muted">No timeline events.</p>
            ) : (
              <div className="relative">
                <div className="absolute left-3 top-0 bottom-0 w-px bg-border" />
                <div className="space-y-4">
                  {events.map((event) => (
                    <div key={event.id} className="flex items-start gap-4 relative">
                      <div className={cn(
                        'w-6 h-6 rounded-full border-2 bg-surface flex items-center justify-center shrink-0 z-10',
                        event.success ? 'border-success' : 'border-error',
                      )}>
                        <div className={cn('w-2 h-2 rounded-full', event.success ? 'bg-success' : 'bg-error')} />
                      </div>
                      <div className="pt-0.5">
                        <p className="text-sm font-medium text-text-primary">{event.description}</p>
                        <p className="text-xs text-text-muted mt-0.5">{formatDateTime(event.timestamp)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <ConfirmDialog
        open={cancelDialogOpen}
        onOpenChange={setCancelDialogOpen}
        title="Cancel rental"
        description={`Cancel rental #${rental.code}? The compartment ${rental.compartmentName} will be released.`}
        confirmLabel="Cancel rental"
        onConfirm={() => cancelMutation.mutate()}
        loading={cancelMutation.isPending}
      />
    </div>
  )
}
