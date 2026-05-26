import * as React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, DoorOpen, Lock, Trash2 } from 'lucide-react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { Button, Badge, Modal, Skeleton } from '@/components/ui'
import { getCompartmentStatusVariant, getCompartmentStatusColor } from '@/components/ui/Badge'
import { cn, formatRelativeTime } from '@/lib/utils'
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
          {
            label: 'Status',
            value: (
              <Badge variant={cabinet.status === 'ONLINE' ? 'online' : cabinet.status === 'OFFLINE' ? 'offline' : 'inactive'} dot>
                {cabinet.status === 'ONLINE' ? 'Online' : cabinet.status === 'OFFLINE' ? 'Offline' : 'Inactive'}
              </Badge>
            ),
          },
          { label: 'Last seen', value: cabinet.lastSeen ? formatRelativeTime(cabinet.lastSeen) : '-' },
          { label: 'MCP devices', value: cabinet.mcpDevices.toString() },
          { label: 'Compartments', value: cabinet.totalCompartments.toString() },
          { label: 'Available', value: `${cabinet.availableCompartments}/${cabinet.totalCompartments}` },
        ].map((item) => (
          <div key={item.label} className="bg-surface rounded-xl border border-border p-4">
            <p className="text-label text-text-muted uppercase mb-1">{item.label}</p>
            <p className="text-sm font-semibold text-text-primary">{item.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-surface rounded-xl border border-border p-6">
        <h3 className="text-sm font-semibold text-text-primary mb-4">Compartment grid</h3>
        {cabinet.compartments?.length ? (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
            {cabinet.compartments.map((compartment) => {
              const colors = getCompartmentStatusColor(compartment.status)
              return (
                <button
                  key={compartment.id}
                  onClick={() => openCompartmentDetail(compartment)}
                  className={cn(
                    'w-full aspect-square rounded-lg border-2 flex flex-col items-center justify-center gap-1',
                    'hover:scale-105 transition-transform duration-150 cursor-pointer',
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

        <div className="flex flex-wrap gap-4 mt-4 text-xs text-text-muted">
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-success/15 border border-success" /> Available</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-info/15 border border-info" /> Occupied</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-error/15 border border-error" /> Maintenance</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-warning/15 border border-warning" /> Reserved</span>
        </div>
      </div>

      {selectedCompartment && (
        <Modal
          open={modalOpen}
          onOpenChange={setModalOpen}
          title={`Compartment ${selectedCompartment.name}`}
          size="sm"
        >
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-label text-text-muted uppercase mb-1">Size</p>
                <p className="text-sm font-semibold">{selectedCompartment.size}</p>
              </div>
              <div>
                <p className="text-label text-text-muted uppercase mb-1">Status</p>
                <Badge variant={getCompartmentStatusVariant(selectedCompartment.status)} dot>
                  {statusLabels[selectedCompartment.status]}
                </Badge>
              </div>
            </div>

            {selectedCompartment.currentRentalId && (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-label text-text-muted uppercase mb-1">Rental</p>
                  <p className="text-sm font-mono font-semibold">#{selectedCompartment.currentRentalId}</p>
                </div>
                <div>
                  <p className="text-label text-text-muted uppercase mb-1">Customer</p>
                  <p className="text-sm font-semibold">{selectedCompartment.customerPhone || '-'}</p>
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-label text-text-muted uppercase mb-1">Lock</p>
                <p className="text-sm font-semibold flex items-center gap-1">
                  <Lock className="h-3 w-3 text-warning" /> {selectedCompartment.lockStatus || 'Unknown'}
                </p>
              </div>
              <div>
                <p className="text-label text-text-muted uppercase mb-1">Door</p>
                <p className="text-sm font-semibold flex items-center gap-1">
                  <DoorOpen className="h-3 w-3 text-error" /> {selectedCompartment.doorStatus || 'Unknown'}
                </p>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
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
