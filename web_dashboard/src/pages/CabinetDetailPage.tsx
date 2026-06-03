import * as React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, DoorOpen, Lock, Trash2 } from 'lucide-react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { Button, Badge, Modal, Skeleton } from '@/components/ui'
import { getCabinetStatusVariant, getCompartmentStatusVariant, getCompartmentStatusColor } from '@/components/ui/Badge'
import { cn, formatRelativeTime } from '@/lib/utils'
import type { CabinetStatus } from '@/types'

const statusLabel: Record<CabinetStatus, string> = {
  ONLINE: 'Online',
  OFFLINE: 'Offline',
  INACTIVE: 'Inactive',
  PENDING_REGISTRATION: 'Pending Registration',
  PENDING_PROVISION: 'Pending Provision',
  PROVISION_FAILED: 'Provision Failed',
  DRAFT: 'Draft',
  ACTIVE: 'Active',
}
import { cabinetsApi } from '@/lib/api'
import type { Compartment, CompartmentStatus } from '@/types'

const statusLabels: Record<CompartmentStatus, string> = {
  AVAILABLE: 'Available',
  OCCUPIED: 'Occupied',
  MAINTENANCE: 'Maintenance',
  RESERVED: 'Reserved',
}

export default function CabinetDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [selectedCompartment, setSelectedCompartment] = React.useState<Compartment | null>(null)
  const [modalOpen, setModalOpen] = React.useState(false)

  const { data: cabinet, isLoading } = useQuery({
    queryKey: ['cabinet', id],
    queryFn: () => cabinetsApi.get(id as string),
    enabled: Boolean(id),
  })

  const unlockMutation = useMutation({
    mutationFn: (compartmentId: string) => cabinetsApi.openCompartment(id as string, compartmentId),
    onSuccess: () => {
      toast.success('Compartment unlocked')
      queryClient.invalidateQueries({ queryKey: ['cabinet', id] })
      queryClient.invalidateQueries({ queryKey: ['cabinets'] })
      setModalOpen(false)
    },
    onError: () => toast.error('Could not unlock compartment'),
  })

  const deleteMutation = useMutation({
    mutationFn: () => cabinetsApi.delete(id as string),
    onSuccess: () => {
      toast.success('Cabinet deleted')
      queryClient.invalidateQueries({ queryKey: ['cabinets'] })
      navigate('/cabinets')
    },
    onError: () => toast.error('Could not delete cabinet'),
  })

  const openCompartmentDetail = (compartment: Compartment) => {
    setSelectedCompartment(compartment)
    setModalOpen(true)
  }

  if (isLoading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <Skeleton className="h-10 w-64" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 6 }).map((_, index) => <Skeleton key={index} className="h-24" />)}
        </div>
      </div>
    )
  }

  if (!cabinet) {
    return (
      <div className="space-y-4 animate-fade-in">
        <Button variant="ghost" onClick={() => navigate('/cabinets')}>
          <ArrowLeft className="h-4 w-4" /> Back to cabinets
        </Button>
        <p className="text-sm text-text-muted">Cabinet not found.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/cabinets')}
            className="p-2 rounded-lg hover:bg-surface-elevated transition-colors cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4 text-text-secondary" />
          </button>
          <div>
            <h2 className="text-lg font-semibold text-text-primary">{cabinet.name}</h2>
            <p className="text-sm text-text-secondary">{cabinet.locationName}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="danger" size="sm" loading={deleteMutation.isPending} onClick={() => deleteMutation.mutate()}>
            <Trash2 className="h-4 w-4" /> Delete
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Name', value: cabinet.name },
          { label: 'Location', value: cabinet.locationName },
          { label: 'Profile', value: cabinet.profile?.name ?? '-' },
          {
            label: 'Status',
            value: <Badge variant={getCabinetStatusVariant(cabinet.status)} dot>{statusLabel[cabinet.status] ?? cabinet.status}</Badge>,
          },
          { label: 'Last seen', value: cabinet.lastSeen ? formatRelativeTime(cabinet.lastSeen) : '-' },
          { label: 'MCP devices', value: cabinet.mcpDevices.toString() },
          { label: 'Compartments', value: cabinet.totalCompartments.toString() },
          { label: 'Available', value: `${cabinet.availableCompartments}/${cabinet.totalCompartments}` },
        ].map((item, i) => {
          const tints = [
            'hover:bg-brand/5',
            'hover:bg-info/5',
            'hover:bg-success/5',
            'hover:bg-warning/5',
            'hover:bg-error/5',
            'hover:bg-brand/5',
            'hover:bg-info/5',
            'hover:bg-success/5',
          ]
          return (
            <div key={item.label} className={`group bg-surface rounded-xl border border-border p-4 transition-colors ${tints[i]}`}>
              <p className="text-label text-text-muted uppercase mb-1.5">{item.label}</p>
              <p className="text-sm font-semibold text-text-primary">{item.value}</p>
            </div>
          )
        })}
      </div>

      <div className="bg-surface rounded-xl border border-border p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-sm font-semibold text-text-primary">Compartment grid</h3>
          <div className="flex flex-wrap gap-4 text-xs text-text-muted">
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-success/25 border border-success/50" /> Available</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-info/25 border border-info/50" /> Occupied</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-error/25 border border-error/50" /> Maintenance</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-warning/25 border border-warning/50" /> Reserved</span>
          </div>
        </div>
        {cabinet.compartments?.length ? (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
            {cabinet.compartments.map((compartment) => {
              const colors = getCompartmentStatusColor(compartment.status)
              return (
                <button
                  key={compartment.id}
                  onClick={() => openCompartmentDetail(compartment)}
                  className={cn(
                    'group w-full aspect-square rounded-xl border flex flex-col items-center justify-center gap-1',
                    'hover:scale-105 hover:shadow-lg transition-all duration-150 cursor-pointer',
                    colors.bg, colors.border,
                  )}
                >
                  <span className={cn('text-sm font-bold', colors.text)}>{compartment.name}</span>
                  <span className={cn('text-[10px] font-medium', colors.text)}>{compartment.size}</span>
                </button>
              )
            })}
          </div>
        ) : (
          <p className="text-sm text-text-muted">No compartments found for this cabinet.</p>
        )}
      </div>

      {selectedCompartment && (
        <Modal
          open={modalOpen}
          onOpenChange={setModalOpen}
          title={`Compartment ${selectedCompartment.name}`}
          size="sm"
        >
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-surface-elevated rounded-lg p-3">
                <p className="text-label text-text-muted uppercase mb-1.5">Size</p>
                <p className="text-sm font-semibold">{selectedCompartment.size}</p>
              </div>
              <div className="bg-surface-elevated rounded-lg p-3">
                <p className="text-label text-text-muted uppercase mb-1.5">Status</p>
                <Badge variant={getCompartmentStatusVariant(selectedCompartment.status)} dot>
                  {statusLabels[selectedCompartment.status]}
                </Badge>
              </div>
            </div>

            {selectedCompartment.currentRentalId && (
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-surface-elevated rounded-lg p-3">
                  <p className="text-label text-text-muted uppercase mb-1.5">Rental</p>
                  <p className="text-sm font-mono font-semibold">#{selectedCompartment.currentRentalId}</p>
                </div>
                <div className="bg-surface-elevated rounded-lg p-3">
                  <p className="text-label text-text-muted uppercase mb-1.5">Customer</p>
                  <p className="text-sm font-semibold">{selectedCompartment.customerPhone || '-'}</p>
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-surface-elevated rounded-lg p-3">
                <p className="text-label text-text-muted uppercase mb-1.5">Lock</p>
                <p className="text-sm font-semibold flex items-center gap-1.5">
                  <Lock className="h-3.5 w-3.5 text-warning" /> {selectedCompartment.lockStatus || 'Unknown'}
                </p>
              </div>
              <div className="bg-surface-elevated rounded-lg p-3">
                <p className="text-label text-text-muted uppercase mb-1.5">Door</p>
                <p className="text-sm font-semibold flex items-center gap-1.5">
                  <DoorOpen className="h-3.5 w-3.5 text-error" /> {selectedCompartment.doorStatus || 'Unknown'}
                </p>
              </div>
            </div>

            <div className="flex gap-3 pt-1">
              <Button
                className="flex-1"
                loading={unlockMutation.isPending}
                onClick={() => unlockMutation.mutate(selectedCompartment.id)}
              >
                Unlock
              </Button>
              <Button variant="ghost" onClick={() => setModalOpen(false)}>
                Close
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}
