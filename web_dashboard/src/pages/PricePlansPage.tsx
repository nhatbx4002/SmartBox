import * as React from 'react'
import { MoreHorizontal, Pencil, Plus, Trash2 } from 'lucide-react'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { Button, DataTable, Badge, Modal, Input, Select, type Column } from '@/components/ui'
import { pricePlansApi } from '@/lib/api'
import type { PricePlan } from '@/types'

const sizeOptions = [
  { value: 'SMALL', label: 'Small' },
  { value: 'LARGE', label: 'Large' },
]

const rentalTypeOptions = [
  { value: 'ONCE', label: 'Once' },
  { value: 'DAILY', label: 'Daily' },
  { value: 'MONTHLY', label: 'Monthly' },
]

export default function PricePlansPage() {
  const queryClient = useQueryClient()
  const [modalOpen, setModalOpen] = React.useState(false)
  const [editingPlan, setEditingPlan] = React.useState<PricePlan | null>(null)
  const [form, setForm] = React.useState({
    name: '',
    size: 'SMALL',
    rentalType: 'ONCE',
    price: '',
    maxOpens: '',
    durationDays: '',
    description: '',
  })

  const { data: plans = [], isLoading } = useQuery({
    queryKey: ['price-plans'],
    queryFn: () => pricePlansApi.list(),
  })

  const saveMutation = useMutation({
    mutationFn: (data: unknown) =>
      editingPlan
        ? pricePlansApi.update(editingPlan.id, data as Partial<{
            name: string
            size: string
            rentalType: string
            price: number
            maxOpens?: number
            durationDays: number
            description?: string
          }>)
        : pricePlansApi.create(data as {
            name: string
            size: string
            rentalType: string
            price: number
            maxOpens?: number
            durationDays: number
            description?: string
          }),
    onSuccess: () => {
      toast.success(editingPlan ? 'Price plan updated' : 'Price plan created')
      queryClient.invalidateQueries({ queryKey: ['price-plans'] })
      setModalOpen(false)
      resetForm()
    },
    onError: () => toast.error('Could not save price plan'),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => pricePlansApi.delete(id),
    onSuccess: () => {
      toast.success('Price plan deactivated')
      queryClient.invalidateQueries({ queryKey: ['price-plans'] })
    },
    onError: () => toast.error('Could not deactivate price plan'),
  })

  const resetForm = () => {
    setForm({ name: '', size: 'SMALL', rentalType: 'ONCE', price: '', maxOpens: '', durationDays: '', description: '' })
    setEditingPlan(null)
  }

  const openEdit = (plan: PricePlan) => {
    setEditingPlan(plan)
    setForm({
      name: plan.name,
      size: plan.size,
      rentalType: plan.rentalType,
      price: plan.price.toString(),
      maxOpens: plan.maxOpens?.toString() ?? '',
      durationDays: plan.durationDays.toString(),
      description: plan.description ?? '',
    })
    setModalOpen(true)
  }

  const handleSave = () => {
    if (!form.name.trim()) return toast.error('Name is required')
    if (!form.price || isNaN(Number(form.price))) return toast.error('Valid price is required')
    if (!form.durationDays || isNaN(Number(form.durationDays))) return toast.error('Valid duration is required')
    saveMutation.mutate({
      name: form.name,
      size: form.size,
      rentalType: form.rentalType,
      price: Number(form.price),
      maxOpens: form.maxOpens ? Number(form.maxOpens) : undefined,
      durationDays: Number(form.durationDays),
      description: form.description || undefined,
    })
  }

  const columns: Column<PricePlan>[] = [
    {
      key: 'name',
      header: 'Name',
      width: '200px',
      render: (row) => <span className="font-medium">{row.name}</span>,
    },
    {
      key: 'size',
      header: 'Size',
      width: '80px',
    },
    {
      key: 'rentalType',
      header: 'Rental type',
      width: '100px',
    },
    {
      key: 'price',
      header: 'Price',
      width: '90px',
      render: (row) => <span className="font-semibold">{row.price.toLocaleString()}đ</span>,
    },
    {
      key: 'durationDays',
      header: 'Duration (days)',
      width: '120px',
    },
    {
      key: 'maxOpens',
      header: 'Max opens',
      width: '100px',
      render: (row) => <span className="text-text-secondary">{row.maxOpens ?? 'Unlimited'}</span>,
    },
    {
      key: 'isActive',
      header: 'Status',
      width: '100px',
      render: (row) => (
        <Badge variant={row.isActive ? 'success' : 'muted'} dot>
          {row.isActive ? 'Active' : 'Inactive'}
        </Badge>
      ),
    },
    {
      key: 'description',
      header: 'Description',
      render: (row) => (
        <span className="text-text-secondary text-sm truncate block max-w-[200px]">
          {row.description ?? '-'}
        </span>
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
        <h2 className="text-lg font-semibold text-text-primary">Bảng giá</h2>
        <Button onClick={() => { resetForm(); setModalOpen(true) }}>
          <Plus className="h-4 w-4" /> Add price plan
        </Button>
      </div>

      <div className="bg-surface rounded-xl border border-border overflow-hidden">
        <DataTable
          columns={columns}
          data={plans}
          loading={isLoading}
          rowKey={(row) => row.id}
          emptyMessage="No price plans found"
        />
      </div>

      <Modal
        open={modalOpen}
        onOpenChange={(open) => { if (!open) resetForm(); setModalOpen(open) }}
        title={editingPlan ? 'Edit price plan' : 'Add price plan'}
        size="md"
      >
        <div className="space-y-5">
          <Input
            label="Plan name"
            value={form.name}
            onChange={(event) => setForm({ ...form, name: event.target.value })}
            placeholder="Standard Small"
          />
          <div className="grid grid-cols-2 gap-3">
            <Select
              label="Size"
              value={form.size}
              onValueChange={(size) => setForm({ ...form, size })}
              options={sizeOptions}
            />
            <Select
              label="Rental type"
              value={form.rentalType}
              onValueChange={(rentalType) => setForm({ ...form, rentalType })}
              options={rentalTypeOptions}
            />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <Input
              label="Price (VND)"
              type="number"
              value={form.price}
              onChange={(event) => setForm({ ...form, price: event.target.value })}
              placeholder="15000"
            />
            <Input
              label="Duration (days)"
              type="number"
              value={form.durationDays}
              onChange={(event) => setForm({ ...form, durationDays: event.target.value })}
              placeholder="1"
            />
            <Input
              label="Max opens"
              type="number"
              value={form.maxOpens}
              onChange={(event) => setForm({ ...form, maxOpens: event.target.value })}
              placeholder="Unlimited"
            />
          </div>
          <Input
            label="Description"
            value={form.description}
            onChange={(event) => setForm({ ...form, description: event.target.value })}
            placeholder="Optional description"
          />
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="ghost" onClick={() => { setModalOpen(false); resetForm() }}>
              Cancel
            </Button>
            <Button onClick={handleSave} loading={saveMutation.isPending}>
              {editingPlan ? 'Save changes' : 'Add plan'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
