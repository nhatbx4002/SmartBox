import * as React from 'react'
import { MoreHorizontal, Pencil, Plus, Trash2 } from 'lucide-react'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { Button, DataTable, Badge, Modal, Input, Select, type Column } from '@/components/ui'
import { locationsApi } from '@/lib/api'
import type { Location } from '@/types'

export default function LocationsPage() {
  const queryClient = useQueryClient()
  const [modalOpen, setModalOpen] = React.useState(false)
  const [editingLocation, setEditingLocation] = React.useState<Location | null>(null)
  const [statusFilter, setStatusFilter] = React.useState('')
  const [form, setForm] = React.useState({
    name: '',
    address: '',
    lat: '',
    lng: '',
    googlePlaceId: '',
    status: 'ACTIVE',
  })

  const { data: locations = [], isLoading } = useQuery({
    queryKey: ['locations', statusFilter],
    queryFn: () => locationsApi.list({ status: statusFilter || undefined }),
  })

  const saveMutation = useMutation({
    mutationFn: (data: unknown) =>
      editingLocation
        ? locationsApi.update(editingLocation.id, data)
        : locationsApi.create(data),
    onSuccess: () => {
      toast.success(editingLocation ? 'Location updated' : 'Location created')
      queryClient.invalidateQueries({ queryKey: ['locations'] })
      setModalOpen(false)
      resetForm()
    },
    onError: () => toast.error('Could not save location'),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => locationsApi.delete(id),
    onSuccess: () => {
      toast.success('Location deactivated')
      queryClient.invalidateQueries({ queryKey: ['locations'] })
    },
    onError: () => toast.error('Could not delete location'),
  })

  const resetForm = () => {
    setForm({ name: '', address: '', lat: '', lng: '', googlePlaceId: '', status: 'ACTIVE' })
    setEditingLocation(null)
  }

  const openEdit = (location: Location) => {
    setEditingLocation(location)
    setForm({
      name: location.name,
      address: location.address,
      lat: location.lat?.toString() || '',
      lng: location.lng?.toString() || '',
      googlePlaceId: location.googlePlaceId || '',
      status: location.status,
    })
    setModalOpen(true)
  }

  const handleSave = () => {
    if (!form.name.trim()) return toast.error('Location name is required')
    if (!form.address.trim()) return toast.error('Address is required')
    saveMutation.mutate({
      name: form.name,
      address: form.address,
      lat: form.lat ? parseFloat(form.lat) : undefined,
      lng: form.lng ? parseFloat(form.lng) : undefined,
      googlePlaceId: form.googlePlaceId || undefined,
      status: form.status,
    })
  }

  const columns: Column<Location>[] = [
    { key: 'name', header: 'Name', width: '200px', render: (row) => <span className="font-medium">{row.name}</span> },
    { key: 'address', header: 'Address', render: (row) => <span className="text-text-secondary text-sm">{row.address}</span> },
    { key: 'cabinetCount', header: 'Cabinets', width: '90px' },
    {
      key: 'status',
      header: 'Status',
      width: '110px',
      render: (row) => (
        <Badge variant={row.status === 'ACTIVE' ? 'success' : 'muted'} dot>
          {row.status === 'ACTIVE' ? 'Active' : 'Inactive'}
        </Badge>
      ),
    },
    {
      key: 'actions',
      header: '',
      width: '48px',
      render: (row) => (
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <button className="p-1 rounded hover:bg-surface-elevated transition-colors cursor-pointer">
              <MoreHorizontal className="h-4 w-4 text-text-muted" />
            </button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Portal>
            <DropdownMenu.Content className="bg-surface border border-border rounded-lg shadow-xl p-1 min-w-32 z-50" align="end">
              <DropdownMenu.Item onClick={() => openEdit(row)} className="flex items-center gap-2 px-3 py-2 text-sm text-text-primary rounded-md cursor-pointer hover:bg-surface-elevated outline-none">
                <Pencil className="h-4 w-4" /> Edit
              </DropdownMenu.Item>
              <DropdownMenu.Separator className="h-px bg-border my-1" />
              <DropdownMenu.Item onClick={() => deleteMutation.mutate(row.id)} className="flex items-center gap-2 px-3 py-2 text-sm text-error rounded-md cursor-pointer hover:bg-error/10 outline-none">
                <Trash2 className="h-4 w-4" /> Deactivate
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
        <h2 className="text-lg font-semibold text-text-primary">Locations</h2>
        <Button onClick={() => { resetForm(); setModalOpen(true) }}>
          <Plus className="h-4 w-4" /> Add location
        </Button>
      </div>

      <Select
        value={statusFilter}
        onValueChange={setStatusFilter}
        placeholder="Status: All"
        options={[
          { value: '', label: 'All statuses' },
          { value: 'ACTIVE', label: 'Active' },
          { value: 'INACTIVE', label: 'Inactive' },
        ]}
        className="w-44"
      />

      <div className="bg-surface rounded-xl border border-border overflow-hidden">
        <DataTable
          columns={columns}
          data={locations}
          loading={isLoading}
          rowKey={(row) => row.id}
          emptyMessage="No locations found"
        />
      </div>

      <Modal
        open={modalOpen}
        onOpenChange={(open) => { if (!open) resetForm(); setModalOpen(open) }}
        title={editingLocation ? 'Edit location' : 'Add location'}
        size="lg"
      >
        <div className="space-y-4">
          <Input
            label="Location name *"
            value={form.name}
            onChange={(event) => setForm({ ...form, name: event.target.value })}
            placeholder="UVerse SGU"
          />
          <Input
            label="Address *"
            value={form.address}
            onChange={(event) => setForm({ ...form, address: event.target.value })}
            placeholder="273 An Duong Vuong, Q.5, TP.HCM"
          />
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Lat"
              type="number"
              value={form.lat}
              onChange={(event) => setForm({ ...form, lat: event.target.value })}
              placeholder="10.7629"
            />
            <Input
              label="Lng"
              type="number"
              value={form.lng}
              onChange={(event) => setForm({ ...form, lng: event.target.value })}
              placeholder="106.6824"
            />
          </div>
          <Input
            label="Google Place ID"
            value={form.googlePlaceId}
            onChange={(event) => setForm({ ...form, googlePlaceId: event.target.value })}
            placeholder="ChIJ..."
          />
          <Select
            label="Status"
            value={form.status}
            onValueChange={(status) => setForm({ ...form, status })}
            options={[
              { value: 'ACTIVE', label: 'Active' },
              { value: 'INACTIVE', label: 'Inactive' },
            ]}
          />
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="ghost" onClick={() => { setModalOpen(false); resetForm() }}>
              Cancel
            </Button>
            <Button onClick={handleSave} loading={saveMutation.isPending}>
              {editingLocation ? 'Save changes' : 'Add location'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
