import * as React from 'react'
import { MoreHorizontal, Pencil, Plus, Trash2, ShieldCheck, User } from 'lucide-react'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { Button, DataTable, Badge, Modal, Input, Select, type Column } from '@/components/ui'
import { adminsApi, cabinetsApi } from '@/lib/api'
import type { Admin } from '@/types'

export default function AdminsPage() {
  const queryClient = useQueryClient()
  const [modalOpen, setModalOpen] = React.useState(false)
  const [cabinetModalOpen, setCabinetModalOpen] = React.useState(false)
  const [editingAdmin, setEditingAdmin] = React.useState<Admin | null>(null)
  const [selectedAdminId, setSelectedAdminId] = React.useState<string | null>(null)
  const [form, setForm] = React.useState({
    email: '',
    name: '',
    password: '',
    role: 'CABINET_ADMIN',
  })
  const [selectedCabinetIds, setSelectedCabinetIds] = React.useState<string[]>([])

  const { data: admins = [], isLoading } = useQuery({
    queryKey: ['admins'],
    queryFn: () => adminsApi.list(),
  })

  const { data: cabinets = [] } = useQuery({
    queryKey: ['cabinets'],
    queryFn: () => cabinetsApi.list(),
  })

  const saveMutation = useMutation({
    mutationFn: (data: unknown) =>
      editingAdmin
        ? adminsApi.update(editingAdmin.id, data as { email?: string; name?: string; password?: string })
        : adminsApi.create(data as { email: string; name: string; password: string; role?: string }),
    onSuccess: () => {
      toast.success(editingAdmin ? 'Admin updated' : 'Admin created')
      queryClient.invalidateQueries({ queryKey: ['admins'] })
      setModalOpen(false)
      resetForm()
    },
    onError: () => toast.error('Could not save admin'),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => adminsApi.delete(id),
    onSuccess: () => {
      toast.success('Admin deleted')
      queryClient.invalidateQueries({ queryKey: ['admins'] })
    },
    onError: () => toast.error('Could not delete admin'),
  })

  const cabinetMutation = useMutation({
    mutationFn: ({ adminId, cabinetIds }: { adminId: string; cabinetIds: string[] }) =>
      adminsApi.setCabinets(adminId, cabinetIds),
    onSuccess: () => {
      toast.success('Cabinet assignments updated')
      queryClient.invalidateQueries({ queryKey: ['admins'] })
      setCabinetModalOpen(false)
    },
    onError: () => toast.error('Could not update cabinet assignments'),
  })

  const resetForm = () => {
    setForm({ email: '', name: '', password: '', role: 'CABINET_ADMIN' })
    setEditingAdmin(null)
  }

  const openEdit = (admin: Admin) => {
    setEditingAdmin(admin)
    setForm({ email: admin.email, name: admin.name, password: '', role: admin.role })
    setModalOpen(true)
  }

  const openCabinetAssign = (admin: Admin) => {
    setSelectedAdminId(admin.id)
    setSelectedCabinetIds(admin.cabinetIds ?? [])
    setCabinetModalOpen(true)
  }

  const handleSave = () => {
    if (!form.name.trim()) return toast.error('Name is required')
    if (!form.email.trim()) return toast.error('Email is required')
    if (!editingAdmin && !form.password) return toast.error('Password is required')
    saveMutation.mutate(editingAdmin
      ? { email: form.email, name: form.name, ...(form.password ? { password: form.password } : {}) }
      : { email: form.email, name: form.name, password: form.password, role: form.role },
    )
  }

  const toggleCabinetSelection = (cabinetId: string) => {
    setSelectedCabinetIds((prev) =>
      prev.includes(cabinetId) ? prev.filter((id) => id !== cabinetId) : [...prev, cabinetId],
    )
  }

  const columns: Column<Admin>[] = [
    {
      key: 'name',
      header: 'Name',
      width: '200px',
      render: (row) => (
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-brand/15 border border-brand/20 flex items-center justify-center shrink-0">
            <User className="w-4 h-4 text-brand" />
          </div>
          <div>
            <span className="font-medium block">{row.name}</span>
            <span className="text-xs text-text-muted">{row.email}</span>
          </div>
        </div>
      ),
    },
    {
      key: 'role',
      header: 'Role',
      width: '130px',
      render: (row) => (
        <Badge variant={row.role === 'SUPER_ADMIN' ? 'success' : 'brand'}>
          <ShieldCheck className="h-3 w-3" />
          {row.role === 'SUPER_ADMIN' ? 'Super Admin' : 'Cabinet Admin'}
        </Badge>
      ),
    },
    {
      key: 'cabinets',
      header: 'Cabinets',
      width: '100px',
      render: (row) => (
        <span className="text-text-secondary text-sm">{(row.cabinetIds ?? []).length} cabinets</span>
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
            <DropdownMenu.Content className="bg-surface border border-border rounded-lg shadow-xl p-1 min-w-40 z-50" align="end">
              <DropdownMenu.Item onClick={() => openEdit(row)} className="flex items-center gap-2 px-3 py-2 text-sm text-text-primary rounded-md cursor-pointer hover:bg-surface-elevated outline-none">
                <Pencil className="h-4 w-4" /> Edit
              </DropdownMenu.Item>
              <DropdownMenu.Item onClick={() => openCabinetAssign(row)} className="flex items-center gap-2 px-3 py-2 text-sm text-text-primary rounded-md cursor-pointer hover:bg-surface-elevated outline-none">
                <ShieldCheck className="h-4 w-4" /> Assign cabinets
              </DropdownMenu.Item>
              <DropdownMenu.Separator className="h-px bg-border my-1" />
              <DropdownMenu.Item onClick={() => deleteMutation.mutate(row.id)} className="flex items-center gap-2 px-3 py-2 text-sm text-error rounded-md cursor-pointer hover:bg-error/10 outline-none">
                <Trash2 className="h-4 w-4" /> Delete
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
      ),
    },
  ]

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex items-center justify-end mb-0">
        <Button onClick={() => { resetForm(); setModalOpen(true) }} size="sm">
          <Plus className="h-4 w-4" /> Add admin
        </Button>
      </div>
      <div className="bg-surface rounded-xl border border-border overflow-hidden">
        <DataTable
          columns={columns}
          data={admins}
          loading={isLoading}
          rowKey={(row) => row.id}
          emptyMessage="No admins found"
        />
      </div>

      {/* Create/Edit modal */}
      <Modal
        open={modalOpen}
        onOpenChange={(open) => { if (!open) resetForm(); setModalOpen(open) }}
        title={editingAdmin ? 'Edit admin' : 'Add admin'}
        size="md"
      >
        <div className="space-y-5">
          <Input
            label="Name"
            value={form.name}
            onChange={(event) => setForm({ ...form, name: event.target.value })}
            placeholder="Admin name"
          />
          <Input
            label="Email"
            type="email"
            value={form.email}
            onChange={(event) => setForm({ ...form, email: event.target.value })}
            placeholder="admin@example.com"
          />
          <Input
            label={editingAdmin ? 'New password (leave empty to keep)' : 'Password'}
            type="password"
            value={form.password}
            onChange={(event) => setForm({ ...form, password: event.target.value })}
            placeholder={editingAdmin ? 'Leave empty to keep current' : 'Min 6 characters'}
          />
          {!editingAdmin && (
            <Select
              label="Role"
              value={form.role}
              onValueChange={(role) => setForm({ ...form, role })}
              options={[
                { value: 'CABINET_ADMIN', label: 'Cabinet Admin' },
                { value: 'SUPER_ADMIN', label: 'Super Admin' },
              ]}
            />
          )}
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="ghost" onClick={() => { setModalOpen(false); resetForm() }}>
              Cancel
            </Button>
            <Button onClick={handleSave} loading={saveMutation.isPending}>
              {editingAdmin ? 'Save changes' : 'Add admin'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Assign cabinets modal */}
      <Modal
        open={cabinetModalOpen}
        onOpenChange={setCabinetModalOpen}
        title="Assign cabinets"
        description="Select cabins this admin can manage"
        size="lg"
      >
        <div className="space-y-3 max-h-80 overflow-y-auto">
          {cabinets.length === 0 && (
            <p className="text-sm text-text-muted text-center py-4">No cabinets available</p>
          )}
          {cabinets.map((cabinet) => (
            <label
              key={cabinet.id}
              className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-surface-elevated cursor-pointer transition-colors"
            >
              <input
                type="checkbox"
                checked={selectedCabinetIds.includes(cabinet.id)}
                onChange={() => toggleCabinetSelection(cabinet.id)}
                className="w-4 h-4 rounded border-gray-300 text-brand focus:ring-brand"
              />
              <div>
                <span className="text-sm font-medium text-text-primary">{cabinet.name}</span>
                <span className="text-xs text-text-muted ml-2">{cabinet.locationName}</span>
              </div>
            </label>
          ))}
        </div>
        <div className="flex justify-end gap-3 pt-4 border-t border-border mt-4">
          <Button variant="ghost" onClick={() => setCabinetModalOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              if (selectedAdminId) {
                cabinetMutation.mutate({ adminId: selectedAdminId, cabinetIds: selectedCabinetIds })
              }
            }}
            loading={cabinetMutation.isPending}
          >
            Save assignments
          </Button>
        </div>
      </Modal>
    </div>
  )
}
