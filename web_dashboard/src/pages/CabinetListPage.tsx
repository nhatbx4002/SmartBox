import * as React from 'react'
import { useNavigate } from 'react-router-dom'
import { Eye, MoreHorizontal, Trash2 } from 'lucide-react'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { DataTable, Badge, Select, type Column } from '@/components/ui'
import { getCabinetStatusVariant, getCompartmentStatusColor } from '@/components/ui/Badge'
import { formatRelativeTime, cn } from '@/lib/utils'
import { cabinetsApi, locationsApi } from '@/lib/api'
import type { Cabinet, Compartment, Location } from '@/types'

export default function CabinetListPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [locationFilter, setLocationFilter] = React.useState('')
  const [statusFilter, setStatusFilter] = React.useState('')

  const { data: cabinets = [], isLoading: cabinetsLoading } = useQuery({
    queryKey: ['cabinets'],
    queryFn: () => cabinetsApi.list(),
  })

  const { data: locations = [] } = useQuery({
    queryKey: ['locations'],
    queryFn: () => locationsApi.list(),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => cabinetsApi.delete(id),
    onSuccess: () => {
      toast.success('Cabinet deleted')
      queryClient.invalidateQueries({ queryKey: ['cabinets'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard-cabinets'] })
    },
    onError: () => toast.error('Could not delete cabinet'),
  })

  const cabinetData = React.useMemo(() => {
    return cabinets.filter((cabinet) => {
      const matchesLocation = !locationFilter || cabinet.locationId === locationFilter
      const matchesStatus = !statusFilter || cabinet.status === statusFilter
      return matchesLocation && matchesStatus
    })
  }, [cabinets, locationFilter, statusFilter])

  const compartmentData = React.useMemo<Compartment[]>(() => {
    return cabinetData.flatMap((cabinet) => cabinet.compartments ?? [])
  }, [cabinetData])

  const columns: Column<Cabinet>[] = [
    {
      key: 'name',
      header: 'Name',
      width: '160px',
      render: (row) => <span className="font-medium">{row.name}</span>,
    },
    { key: 'locationName', header: 'Location', width: '200px' },
    {
      key: 'status',
      header: 'Status',
      width: '110px',
      render: (row) => (
        <Badge variant={getCabinetStatusVariant(row.status)} dot>
          {row.status === 'ONLINE' ? 'Online' : row.status === 'OFFLINE' ? 'Offline' : 'Inactive'}
        </Badge>
      ),
    },
    {
      key: 'compartments',
      header: 'Compartments',
      width: '120px',
      render: (row) => <span>{row.availableCompartments}/{row.totalCompartments}</span>,
    },
    {
      key: 'lastSeen',
      header: 'Last seen',
      width: '140px',
      render: (row) => (
        <span className="text-text-secondary">{row.lastSeen ? formatRelativeTime(row.lastSeen) : '-'}</span>
      ),
    },
    {
      key: 'actions',
      header: '',
      width: '48px',
      render: (row) => (
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <button
              className="p-1 rounded hover:bg-surface-elevated transition-colors cursor-pointer"
              onClick={(event) => event.stopPropagation()}
            >
              <MoreHorizontal className="h-4 w-4 text-text-muted" />
            </button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Portal>
            <DropdownMenu.Content className="bg-surface border border-border rounded-lg shadow-xl p-1 min-w-36 z-50" align="end">
              <DropdownMenu.Item onClick={() => navigate(`/cabinets/${row.id}`)} className="flex items-center gap-2 px-3 py-2 text-sm text-text-primary rounded-md cursor-pointer hover:bg-surface-elevated outline-none">
                <Eye className="h-4 w-4" /> View
              </DropdownMenu.Item>
              <DropdownMenu.Item
                onClick={() => deleteMutation.mutate(row.id)}
                className="flex items-center gap-2 px-3 py-2 text-sm text-error rounded-md cursor-pointer hover:bg-error/10 outline-none"
              >
                <Trash2 className="h-4 w-4" /> Delete
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
      ),
    },
  ]

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-text-primary">Cabinets</h2>
      </div>

      <div className="flex flex-wrap gap-3">
        <Select
          value={locationFilter}
          onValueChange={setLocationFilter}
          placeholder="Location: All"
          options={[
            { value: '', label: 'All locations' },
            ...locations.map((location: Location) => ({ value: location.id, label: location.name })),
          ]}
          className="w-48"
        />
        <Select
          value={statusFilter}
          onValueChange={setStatusFilter}
          placeholder="Status: All"
          options={[
            { value: '', label: 'All statuses' },
            { value: 'ONLINE', label: 'Online' },
            { value: 'OFFLINE', label: 'Offline' },
            { value: 'INACTIVE', label: 'Inactive' },
          ]}
          className="w-40"
        />
      </div>

      <div className="bg-surface rounded-xl border border-border overflow-hidden">
        <DataTable
          columns={columns}
          data={cabinetData}
          loading={cabinetsLoading}
          rowKey={(row) => row.id}
          onRowClick={(row) => navigate(`/cabinets/${row.id}`)}
          emptyMessage="No cabinets found"
        />
      </div>

      <div className="bg-surface rounded-xl border border-border p-6">
        <h3 className="text-sm font-semibold text-text-primary mb-4">Compartment status</h3>
        {compartmentData.length === 0 ? (
          <p className="text-sm text-text-muted">No compartments for the selected filters.</p>
        ) : (
          <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 gap-2">
            {compartmentData.map((comp) => {
              const colors = getCompartmentStatusColor(comp.status)
              return (
                <div
                  key={comp.id}
                  title={`${comp.cabinetName} / ${comp.name} - ${comp.status}`}
                  className={cn(
                    'w-10 h-10 rounded-lg border flex items-center justify-center cursor-pointer',
                    'hover:scale-110 transition-transform duration-150',
                    'text-xs font-bold',
                    colors.bg, colors.border, colors.text,
                  )}
                  onClick={() => navigate(`/cabinets/${comp.cabinetId}`)}
                >
                  {comp.name}
                </div>
              )
            })}
          </div>
        )}
        <div className="flex flex-wrap gap-4 mt-4 text-xs text-text-muted">
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-success/15 border border-success" /> Available</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-info/15 border border-info" /> Occupied</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-error/15 border border-error" /> Maintenance</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-warning/15 border border-warning" /> Reserved</span>
        </div>
      </div>
    </div>
  )
}
