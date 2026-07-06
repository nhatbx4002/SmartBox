import * as React from 'react'
import { Pencil, Plus, Trash2, MapPin, Building2, Search, RotateCcw, MoreHorizontal } from 'lucide-react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { Modal, Input, Select, LocationMapPicker } from '@/components/ui'
import { locationsApi } from '@/lib/api'
import { cn } from '@/lib/utils'
import type { Location } from '@/types'

export default function LocationsPage() {
  const queryClient = useQueryClient()
  const [modalOpen, setModalOpen] = React.useState(false)
  const [editingLocation, setEditingLocation] = React.useState<Location | null>(null)
  const [statusFilter, setStatusFilter] = React.useState('')
  const [search, setSearch] = React.useState('')
  const [deleteConfirm, setDeleteConfirm] = React.useState<{ open: boolean; location: Location | null; hard: boolean }>({
    open: false, location: null, hard: false,
  })
  const [form, setForm] = React.useState({ name: '', address: '', lat: '', lng: '', status: 'ACTIVE' })

  const { data: locations = [], isLoading } = useQuery({
    queryKey: ['locations', statusFilter],
    queryFn: () => locationsApi.list({ status: statusFilter || undefined }),
  })

  const saveMutation = useMutation({
    mutationFn: (data: unknown) =>
      editingLocation ? locationsApi.update(editingLocation.id, data) : locationsApi.create(data),
    onSuccess: () => {
      toast.success(editingLocation ? 'Location updated' : 'Location created')
      queryClient.invalidateQueries({ queryKey: ['locations'] })
      setModalOpen(false); resetForm()
    },
    onError: () => toast.error('Could not save location'),
  })

  const deactivateMutation = useMutation({
    mutationFn: (id: string) => locationsApi.deactivate(id),
    onSuccess: () => { toast.success('Location deactivated'); queryClient.invalidateQueries({ queryKey: ['locations'] }) },
    onError: (err) => { toast.error(err instanceof Error ? err.message : 'Could not deactivate location') },
  })

  const hardDeleteMutation = useMutation({
    mutationFn: (id: string) => locationsApi.hardDelete(id),
    onSuccess: () => { toast.success('Location permanently deleted'); queryClient.invalidateQueries({ queryKey: ['locations'] }) },
    onError: (err) => { toast.error(err instanceof Error ? err.message : 'Could not delete location') },
  })

  const reactivateMutation = useMutation({
    mutationFn: (id: string) => locationsApi.update(id, { status: 'ACTIVE' }),
    onSuccess: () => { toast.success('Location reactivated'); queryClient.invalidateQueries({ queryKey: ['locations'] }) },
    onError: () => toast.error('Could not reactivate location'),
  })

  const resetForm = () => { setForm({ name: '', address: '', lat: '', lng: '', status: 'ACTIVE' }); setEditingLocation(null) }

  const openEdit = (location: Location) => {
    setEditingLocation(location)
    setForm({ name: location.name, address: location.address, lat: location.lat?.toString() || '', lng: location.lng?.toString() || '', status: location.status })
    setModalOpen(true)
  }

  const handleSave = () => {
    if (!form.name.trim()) return toast.error('Location name is required')
    if (!form.address.trim()) return toast.error('Address is required')
    saveMutation.mutate({ name: form.name, address: form.address, lat: form.lat ? parseFloat(form.lat) : undefined, lng: form.lng ? parseFloat(form.lng) : undefined, status: form.status })
  }

  const filteredData = React.useMemo(() => {
    const q = search.trim().toLowerCase()
    return locations.filter((l) => !q || l.name.toLowerCase().includes(q) || l.address.toLowerCase().includes(q))
  }, [locations, search])

  const hasFilters = statusFilter || search

  return (
    <div className="space-y-6">
      {/* Top bar */}
      <div className="flex items-center justify-between" style={{ animation: 'enter 0.35s ease-out both' }}>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-500" strokeWidth={1.5} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm địa điểm..."
              className="h-9 w-56 rounded-md border border-zinc-800 bg-zinc-900/60 pl-9 pr-3 text-xs text-zinc-200 placeholder:text-zinc-600 outline-none transition-all duration-200 focus:border-zinc-700 focus:bg-zinc-900"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-9 rounded-md border border-zinc-800 bg-zinc-900/60 px-3 text-xs text-zinc-200 outline-none transition-all duration-200 focus:border-zinc-700"
          >
            <option value="">Tất cả</option>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
          </select>
          {hasFilters && (
            <button
              onClick={() => { setSearch(''); setStatusFilter('') }}
              className="flex h-9 items-center gap-1.5 rounded-md px-3 text-xs font-medium text-zinc-500 transition-colors duration-150 hover:text-zinc-300"
            >
              <RotateCcw className="h-3 w-3" strokeWidth={1.5} />
              Xóa
            </button>
          )}
        </div>
        <button
          onClick={() => { resetForm(); setModalOpen(true) }}
          className="flex h-9 items-center gap-1.5 rounded-md bg-zinc-100 px-3.5 text-xs font-medium text-zinc-900 transition-all duration-150 hover:bg-zinc-300 active:scale-[0.97]"
        >
          <Plus className="h-3.5 w-3.5" strokeWidth={2} />
          Thêm địa điểm
        </button>
      </div>

      {/* Location grid */}
      <div style={{ animation: 'enter 0.35s ease-out 0.05s both' }}>
        {isLoading ? (
          <div className="space-y-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="animate-pulse rounded-md border border-zinc-800/50 bg-zinc-900/30 p-5">
                <div className="mb-2 h-4 w-40 rounded bg-zinc-800" />
                <div className="h-3 w-64 rounded bg-zinc-800/60" />
              </div>
            ))}
          </div>
        ) : filteredData.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-md border border-zinc-800 bg-zinc-900/60">
              <MapPin className="h-5 w-5 text-zinc-600" strokeWidth={1.5} />
            </div>
            {hasFilters ? (
              <p className="text-sm font-medium text-zinc-500">Không tìm thấy địa điểm nào</p>
            ) : (
              <>
                <p className="text-sm font-medium text-zinc-500">Chưa có địa điểm nào</p>
                <p className="mt-1 text-xs text-zinc-600">Thêm địa điểm đầu tiên để bắt đầu</p>
              </>
            )}
          </div>
        ) : (
          <div className="space-y-2">
            {filteredData.map((location, i) => (
              <LocationCard
                key={location.id}
                location={location}
                onEdit={() => openEdit(location)}
                onDeactivate={() => setDeleteConfirm({ open: true, location, hard: false })}
                onReactivate={() => reactivateMutation.mutate(location.id)}
                onHardDelete={() => setDeleteConfirm({ open: true, location, hard: true })}
                style={{ animation: `enter 0.35s ease-out ${0.1 + i * 0.05}s both` }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      <Modal
        open={modalOpen}
        onOpenChange={(open) => { if (!open) resetForm(); setModalOpen(open) }}
        title={editingLocation ? 'Edit location' : 'Add location'}
        size="md"
      >
        <div className="space-y-5">
          <Input label="Location name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="UVerse SGU" />
          <Input label="Address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} placeholder="273 An Duong Vuong, Q.5, TP.HCM" />
          <LocationMapPicker
            lat={form.lat ? parseFloat(form.lat) : undefined}
            lng={form.lng ? parseFloat(form.lng) : undefined}
            onChange={(lat, lng, address) => setForm({ ...form, lat: lat.toFixed(6), lng: lng.toFixed(6), address: address ?? form.address })}
          />
          <div className="grid grid-cols-2 gap-3">
            <Input label="Latitude" type="number" value={form.lat} onChange={(e) => setForm({ ...form, lat: e.target.value })} placeholder="10.7629" />
            <Input label="Longitude" type="number" value={form.lng} onChange={(e) => setForm({ ...form, lng: e.target.value })} placeholder="106.6824" />
          </div>
          <Select label="Status" value={form.status} onValueChange={(s) => setForm({ ...form, status: s })} options={[{ value: 'ACTIVE', label: 'Active' }, { value: 'INACTIVE', label: 'Inactive' }]} />
          <div className="flex justify-end gap-3 pt-2">
            <button onClick={() => { setModalOpen(false); resetForm() }} className="rounded-md border border-zinc-800 bg-zinc-900 px-4 py-2 text-xs font-medium text-zinc-400 transition-all duration-150 hover:bg-zinc-800 hover:text-zinc-200 active:scale-[0.98]">
              Cancel
            </button>
            <button onClick={handleSave} className="rounded-md bg-zinc-100 px-4 py-2 text-xs font-medium text-zinc-900 transition-all duration-150 hover:bg-zinc-300 active:scale-[0.98]">
              {editingLocation ? 'Save changes' : 'Add location'}
            </button>
          </div>
        </div>
      </Modal>

      {/* Confirm dialog */}
      <Modal
        open={deleteConfirm.open}
        onOpenChange={(open) => !open && setDeleteConfirm({ open: false, location: null, hard: false })}
        title={deleteConfirm.hard ? 'Xóa vĩnh viễn' : 'Deactivate'}
        size="sm"
      >
        {deleteConfirm.location && (
          <div className="space-y-4">
            <div className="flex items-start gap-3 rounded-md border border-zinc-800 bg-zinc-900/60 px-4 py-3.5">
              <Trash2 className="mt-0.5 h-4 w-4 shrink-0 text-zinc-500" strokeWidth={1.5} />
              <div>
                {deleteConfirm.hard ? (
                  <>
                    <p className="text-sm font-medium text-zinc-200">Xóa vĩnh viễn <strong>{deleteConfirm.location.name}</strong>?</p>
                    <p className="mt-1 text-xs leading-relaxed text-zinc-500">Hành động này sẽ xóa vĩnh viễn tất cả tủ, ngăn và lịch sử thuê thuộc địa điểm này. Không thể hoàn tác.</p>
                  </>
                ) : (
                  <>
                    <p className="text-sm font-medium text-zinc-200">Deactivate <strong>{deleteConfirm.location.name}</strong>?</p>
                    <p className="mt-1 text-xs leading-relaxed text-zinc-500">Địa điểm và tất cả tủ đang hoạt động trong địa điểm này sẽ chuyển sang trạng thái INACTIVE. Các tủ đang bảo trì/cấu hình sẽ không bị ảnh hưởng.</p>
                  </>
                )}
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <button onClick={() => setDeleteConfirm({ open: false, location: null, hard: false })} className="rounded-md border border-zinc-800 bg-zinc-900 px-4 py-2 text-xs font-medium text-zinc-400 transition-all duration-150 hover:bg-zinc-800 hover:text-zinc-200 active:scale-[0.98]">
                Hủy
              </button>
              {deleteConfirm.hard ? (
                <button
                  onClick={() => { hardDeleteMutation.mutate(deleteConfirm.location!.id); setDeleteConfirm({ open: false, location: null, hard: false }) }}
                  className="rounded-md bg-zinc-100 px-4 py-2 text-xs font-medium text-zinc-900 transition-all duration-150 hover:bg-zinc-300 active:scale-[0.98]"
                >
                  Xóa vĩnh viễn
                </button>
              ) : (
                <button
                  onClick={() => { deactivateMutation.mutate(deleteConfirm.location!.id); setDeleteConfirm({ open: false, location: null, hard: false }) }}
                  className="rounded-md bg-zinc-100 px-4 py-2 text-xs font-medium text-zinc-900 transition-all duration-150 hover:bg-zinc-300 active:scale-[0.98]"
                >
                  Deactivate
                </button>
              )}
            </div>
          </div>
        )}
      </Modal>

      <style>{`
        @keyframes enter {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}

function LocationCard({
  location, onEdit, onDeactivate, onReactivate, onHardDelete, style,
}: {
  location: Location; onEdit: () => void; onDeactivate: () => void; onReactivate: () => void; onHardDelete: () => void; style?: React.CSSProperties
}) {
  const [menuOpen, setMenuOpen] = React.useState(false)
  const ref = React.useRef<HTMLDivElement>(null)
  const isActive = location.status === 'ACTIVE'

  React.useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setMenuOpen(false)
    }
    if (menuOpen) document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [menuOpen])

  return (
    <div
      className="flex items-start justify-between rounded-md border border-zinc-800/60 bg-zinc-900/30 px-5 py-4 transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] hover:border-zinc-700/60 hover:bg-zinc-900/50"
      style={style}
    >
      <div className="flex items-start gap-3.5 min-w-0">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-zinc-800 bg-zinc-900/80">
          <Building2 className="h-4 w-4 text-zinc-400" strokeWidth={1.5} />
        </div>
        <div className="min-w-0 space-y-1">
          <div className="flex items-center gap-2.5">
            <span className="text-sm font-medium text-zinc-200">{location.name}</span>
            <StatusBadge active={isActive} />
          </div>
          <p className="truncate text-xs text-zinc-500">{location.address}</p>
          <div className="flex items-center gap-3 pt-0.5">
            <span className="text-[11px] text-zinc-600">{location.cabinetCount} tủ</span>
            {location.lat != null && location.lng != null && (
              <span className="text-[11px] text-zinc-600">
                {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-1" ref={ref}>
        <button
          onClick={onEdit}
          className="flex h-8 w-8 items-center justify-center rounded-md text-zinc-600 transition-all duration-200 hover:bg-zinc-800 hover:text-zinc-300"
        >
          <Pencil className="h-3.5 w-3.5" strokeWidth={1.5} />
        </button>
        <div className="relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex h-8 w-8 items-center justify-center rounded-md text-zinc-600 transition-all duration-200 hover:bg-zinc-800 hover:text-zinc-300"
          >
            <MoreHorizontal className="h-3.5 w-3.5" strokeWidth={1.5} />
          </button>
          {menuOpen && (
            <div className="absolute right-0 bottom-full z-[60] mb-1 min-w-40 rounded-md border border-zinc-800 bg-zinc-900 py-1 shadow-lg">
              {isActive ? (
                <button
                  onClick={() => { setMenuOpen(false); onDeactivate() }}
                  className="flex w-full items-center gap-2 px-3.5 py-2 text-xs font-medium text-zinc-400 transition-colors duration-100 hover:bg-zinc-800 hover:text-zinc-200"
                >
                  <Trash2 className="h-3.5 w-3.5" strokeWidth={1.5} />
                  Deactivate
                </button>
              ) : (
                <button
                  onClick={() => { setMenuOpen(false); onReactivate() }}
                  className="flex w-full items-center gap-2 px-3.5 py-2 text-xs font-medium text-zinc-400 transition-colors duration-100 hover:bg-zinc-800 hover:text-zinc-200"
                >
                  <RotateCcw className="h-3.5 w-3.5" strokeWidth={1.5} />
                  Reactivate
                </button>
              )}
              <button
                onClick={() => { setMenuOpen(false); onHardDelete() }}
                className="flex w-full items-center gap-2 px-3.5 py-2 text-xs font-medium text-zinc-400 transition-colors duration-100 hover:bg-zinc-800 hover:text-zinc-200"
              >
                <Trash2 className="h-3.5 w-3.5" strokeWidth={1.5} />
                Xóa vĩnh viễn
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function StatusBadge({ active }: { active: boolean }) {
  return (
    <span className={cn(
      'rounded-sm px-1.5 py-0.5 text-[10px] font-semibold tracking-wider uppercase',
      active ? 'bg-emerald-500/10 text-emerald-400' : 'bg-zinc-800 text-zinc-500',
    )}>
      {active ? 'Active' : 'Inactive'}
    </span>
  )
}
