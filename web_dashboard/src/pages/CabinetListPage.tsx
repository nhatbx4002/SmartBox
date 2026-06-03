import * as React from 'react'
import { useNavigate } from 'react-router-dom'
import { Eye, MoreHorizontal, Plus, Trash2 } from 'lucide-react'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { Button, DataTable, Badge, Select, Modal, Input, type Column } from '@/components/ui'
import { getCabinetStatusVariant, getCompartmentStatusColor } from '@/components/ui/Badge'
import { formatRelativeTime, cn } from '@/lib/utils'
import { cabinetsApi, locationsApi, profilesApi } from '@/lib/api'
import type { Cabinet, Compartment, Location, ProvisionProfile } from '@/types'

const cabinetStatusLabels: Record<Cabinet['status'], string> = {
  ACTIVE: 'Active',
  ONLINE: 'Online',
  OFFLINE: 'Offline',
  INACTIVE: 'Inactive',
  PENDING_REGISTRATION: 'Pending Registration',
  PENDING_PROVISION: 'Pending Provision',
  PROVISION_FAILED: 'Provision Failed',
  DRAFT: 'Draft',
}

function formatProvisionExpiry(value?: string | null) {
  if (!value) return null
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return null
  return date.toLocaleString('vi-VN')
}

export default function CabinetListPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [locationFilter, setLocationFilter] = React.useState('')
  const [statusFilter, setStatusFilter] = React.useState('')
  const [showCreateModal, setShowCreateModal] = React.useState(false)
  const [cabinetForm, setCabinetForm] = React.useState({ locationId: '', profileId: '', deviceName: '', hardwareSerial: '' })

  const { data: cabinets = [], isLoading: cabinetsLoading } = useQuery({
    queryKey: ['cabinets'],
    queryFn: () => cabinetsApi.list(),
  })

  const { data: locations = [] } = useQuery({
    queryKey: ['locations'],
    queryFn: () => locationsApi.list(),
  })

  const { data: profiles = [] } = useQuery({
    queryKey: ['profiles'],
    queryFn: () => profilesApi.list(),
  })

  const createCabinetMutation = useMutation({
    mutationFn: (data: typeof cabinetForm) =>
      cabinetsApi.create({
        locationId: data.locationId,
        profileId: data.profileId,
        deviceName: data.deviceName,
        hardwareSerial: data.hardwareSerial || undefined,
      }),
    onSuccess: () => {
      toast.success('Cabinet created')
      setShowCreateModal(false)
      setCabinetForm({ locationId: '', profileId: '', deviceName: '', hardwareSerial: '' })
      queryClient.invalidateQueries({ queryKey: ['cabinets'] })
    },
    onError: (err: unknown) => {
      const msg = (err as { response?: { data?: { error?: { message?: string } } } })?.response?.data?.error?.message || 'Failed to create cabinet'
      toast.error(msg)
    },
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
          {cabinetStatusLabels[row.status] ?? row.status}
        </Badge>
      ),
    },
    {
      key: 'provision',
      header: 'Provision',
      width: '170px',
      render: (row) => {
        const expiry = formatProvisionExpiry(row.provisionCodeExpires)
        if (row.provisionCode) {
          return (
            <div className="space-y-1">
              <code className="text-xs bg-warning/10 border border-warning/30 px-2 py-0.5 rounded text-warning">
                {row.provisionCode}
              </code>
              <p className="text-xs text-text-muted">{expiry ? `Expires ${expiry}` : 'No expiry'}</p>
            </div>
          )
        }

        return (
          <div className="space-y-1">
            <p className="text-xs text-text-secondary">{row.profile?.name ?? 'No profile'}</p>
            <p className="text-xs text-text-muted">Config v{row.configVersion ?? 1}</p>
          </div>
        )
      },
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
        <Button size="sm" onClick={() => setShowCreateModal(true)}>
          <Plus className="h-4 w-4" /> Create Cabinet
        </Button>
      </div>

      <div className="bg-surface rounded-xl border border-border p-4">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-xs font-medium text-text-muted uppercase tracking-wide">Bộ lọc</span>
          <div className="w-px h-5 bg-border" />
          <Select
            value={locationFilter}
            onValueChange={setLocationFilter}
            placeholder="Location: All"
            options={[
              { value: '', label: 'All locations' },
              ...locations.map((location: Location) => ({ value: location.id, label: location.name })),
            ]}
            className="w-44"
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
              { value: 'PENDING_REGISTRATION', label: 'Pending Registration' },
              { value: 'PENDING_PROVISION', label: 'Pending Provision' },
              { value: 'PROVISION_FAILED', label: 'Provision Failed' },
              { value: 'DRAFT', label: 'Draft' },
            ]}
            className="w-44"
          />
          {(locationFilter || statusFilter) && (
            <button
              onClick={() => { setLocationFilter(''); setStatusFilter('') }}
              className="text-xs text-brand hover:text-brand-hover cursor-pointer transition-colors ml-auto"
            >
              Xóa lọc
            </button>
          )}
        </div>
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
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-sm font-semibold text-text-primary">Compartment status</h3>
          <div className="flex flex-wrap gap-4 text-xs text-text-muted">
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-success/25 border border-success/50" /> Available</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-info/25 border border-info/50" /> Occupied</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-error/25 border border-error/50" /> Maintenance</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-warning/25 border border-warning/50" /> Reserved</span>
          </div>
        </div>
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
                    'group w-10 h-10 rounded-lg border flex items-center justify-center cursor-pointer',
                    'hover:scale-110 hover:shadow-lg transition-all duration-150',
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
      </div>

      {/* Create Cabinet Modal */}
      <Modal
        open={showCreateModal}
        onOpenChange={(open) => { if (!open) { setShowCreateModal(false); setCabinetForm({ locationId: '', profileId: '', deviceName: '', hardwareSerial: '' }) } }}
        title="Create Cabinet"
        size="md"
      >
        <div className="space-y-4">
          <Select
            label="Location *"
            value={cabinetForm.locationId}
            onValueChange={(v) => setCabinetForm({ ...cabinetForm, locationId: v })}
            options={[
              { value: '', label: 'Select location...' },
              ...locations.map((l: Location) => ({ value: l.id, label: l.name })),
            ]}
          />
          <Select
            label="Profile *"
            value={cabinetForm.profileId}
            onValueChange={(v) => setCabinetForm({ ...cabinetForm, profileId: v })}
            options={[
              { value: '', label: 'Select profile...' },
              ...profiles.map((p: ProvisionProfile) => ({
                value: p.id,
                label: `${p.name} (${p.mode === 'ALLOW_NEW' ? 'Allow New' : 'Check Existing'})`,
              })),
            ]}
          />
          <Input
            label="Device Name *"
            value={cabinetForm.deviceName}
            onChange={(e) => setCabinetForm({ ...cabinetForm, deviceName: e.target.value })}
            placeholder="VD: Tu A - Tầng 1"
          />
          <Input
            label="Hardware Serial (optional)"
            value={cabinetForm.hardwareSerial}
            onChange={(e) => setCabinetForm({ ...cabinetForm, hardwareSerial: e.target.value })}
            placeholder="VD: RPI-ABC123"
          />
          {cabinetForm.profileId && (() => {
            const selected = profiles.find((p: ProvisionProfile) => p.id === cabinetForm.profileId)
            if (!selected) return null
            return (
              <div className="bg-surface-elevated rounded-lg p-3 text-xs text-text-secondary">
                <p className="font-medium text-text-primary mb-2">Profile preview</p>
                <p>Layout: {selected.templateRows}×{selected.templateCols} ({selected.templateSizes.flat().filter(s => s === 'SMALL').length}S / {selected.templateSizes.flat().filter(s => s === 'LARGE').length}L)</p>
                <p>MCP devices: {selected.mcpDevices.map(d => `0x${d.address.toString(16).toUpperCase()}(${d.role})`).join(', ')}</p>
              </div>
            )
          })()}
          <div className="flex gap-3 pt-2">
            <Button
              className="flex-1"
              loading={createCabinetMutation.isPending}
              onClick={() => {
                if (!cabinetForm.locationId) return toast.error('Select a location')
                if (!cabinetForm.profileId) return toast.error('Select a profile')
                if (!cabinetForm.deviceName.trim()) return toast.error('Device name is required')
                createCabinetMutation.mutate(cabinetForm)
              }}
            >
              Create
            </Button>
            <Button variant="ghost" onClick={() => { setShowCreateModal(false); setCabinetForm({ locationId: '', profileId: '', deviceName: '', hardwareSerial: '' }) }}>
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
