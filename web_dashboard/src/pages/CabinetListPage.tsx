import * as React from 'react'
import { useNavigate } from 'react-router-dom'
import { Eye, Trash2, MoreHorizontal, Search, Archive, MapPin, RotateCcw } from 'lucide-react'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { Badge } from '@/components/ui'
import { getCabinetStatusVariant, getCompartmentStatusColor } from '@/components/ui/Badge'
import { formatRelativeTime, cn } from '@/lib/utils'
import { cabinetsApi, locationsApi } from '@/lib/api'
import type { Cabinet, Compartment, Location } from '@/types'

const statusOptions = [
  { value: '', label: 'Tất cả' },
  { value: 'ONLINE', label: 'Online' },
  { value: 'OFFLINE', label: 'Offline' },
  { value: 'CONFIGURING', label: 'Configuring' },
  { value: 'INACTIVE', label: 'Inactive' },
]

function BreathingDot({ status }: { status: Cabinet['status'] }) {
  const isOnline = status === 'ONLINE'
  return (
    <span className="relative inline-flex h-2 w-2 shrink-0">
      {isOnline && <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-online/50" />}
      <span className={cn(
        'relative inline-flex h-2 w-2 rounded-full',
        isOnline ? 'bg-online' : status === 'OFFLINE' ? 'bg-error' : status === 'CONFIGURING' ? 'bg-warning' : 'bg-zinc-500',
      )} />
    </span>
  )
}

function StatBadge({ label, value, accent }: { label: string; value: string | number; accent: string }) {
  return (
    <div className="flex items-center gap-2 rounded-xl border border-zinc-800/40 bg-zinc-900/30 px-3.5 py-2">
      <div className={cn('h-2 w-2 rounded-full', accent)} />
      <span className="text-xs text-zinc-500">{label}</span>
      <span className="ml-auto text-xs font-semibold text-zinc-200">{value}</span>
    </div>
  )
}

function CabinetCard({
  cabinet,
  onDelete,
  style,
}: {
  cabinet: Cabinet; onDelete: (id: string) => void; style?: React.CSSProperties
}) {
  const navigate = useNavigate()
  const occupancy = cabinet.totalCompartments > 0
    ? Math.round(((cabinet.totalCompartments - cabinet.availableCompartments) / cabinet.totalCompartments) * 100)
    : 0

  return (
    <div
      onClick={() => navigate(`/cabinets/${cabinet.id}`)}
      className="group relative cursor-pointer overflow-hidden rounded-2xl border border-zinc-800/50 bg-zinc-900/40 p-4 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:border-zinc-700/60 hover:bg-zinc-900/70 active:scale-[0.98]"
      style={style}
    >
      {/* Top row */}
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="truncate text-sm font-semibold tracking-tight text-zinc-200">{cabinet.name}</h3>
            <BreathingDot status={cabinet.status} />
          </div>
          <div className="mt-0.5 flex items-center gap-1">
            <MapPin className="h-3 w-3 shrink-0 text-zinc-600" strokeWidth={1.5} />
            <span className="truncate text-xs text-zinc-500">{cabinet.locationName}</span>
          </div>
        </div>
        <div className="flex shrink-0 gap-0.5">
          <button
            onClick={(e) => { e.stopPropagation(); navigate(`/cabinets/${cabinet.id}`) }}
            className="flex h-7 w-7 items-center justify-center rounded-lg text-zinc-600 opacity-0 transition-all duration-200 hover:bg-zinc-800 hover:text-zinc-300 group-hover:opacity-100"
          >
            <Eye className="h-3.5 w-3.5" strokeWidth={1.5} />
          </button>
          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <button
                onClick={(e) => e.stopPropagation()}
                className="flex h-7 w-7 items-center justify-center rounded-lg text-zinc-600 opacity-0 transition-all duration-200 hover:bg-zinc-800 hover:text-zinc-300 group-hover:opacity-100"
              >
                <MoreHorizontal className="h-3.5 w-3.5" strokeWidth={1.5} />
              </button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Portal>
              <DropdownMenu.Content className="z-50 min-w-36 rounded-xl border border-zinc-800 bg-zinc-900 p-1 shadow-xl" align="end">
                <DropdownMenu.Item
                  onClick={(e) => { e.stopPropagation(); navigate(`/cabinets/${cabinet.id}`) }}
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-zinc-300 outline-none transition-colors duration-100 hover:bg-zinc-800 cursor-pointer"
                >
                  <Eye className="h-3.5 w-3.5" strokeWidth={1.5} /> View
                </DropdownMenu.Item>
                <DropdownMenu.Separator className="mx-1 my-0.5 h-px bg-zinc-800" />
                <DropdownMenu.Item
                  onClick={(e) => { e.stopPropagation(); onDelete(cabinet.id) }}
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-error outline-none transition-colors duration-100 hover:bg-error/10 cursor-pointer"
                >
                  <Trash2 className="h-3.5 w-3.5" strokeWidth={1.5} /> Delete
                </DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>
        </div>
      </div>

      {/* Status + compartments row */}
      <div className="mb-2.5 flex items-center justify-between text-xs">
        <Badge variant={getCabinetStatusVariant(cabinet.status)}>{cabinet.status}</Badge>
        <span className="font-mono text-xs text-zinc-500">
          {cabinet.availableCompartments}/{cabinet.totalCompartments}
        </span>
      </div>

      {/* Occupancy bar */}
      <div className="h-1 w-full overflow-hidden rounded-full bg-zinc-800">
        <div
          className="h-full rounded-full bg-brand transition-all duration-700 ease-out"
          style={{ width: `${Math.max(occupancy, 2)}%` }}
        />
      </div>

      {/* Last seen */}
      <p className="mt-2 text-[10px] text-zinc-600">
        {cabinet.lastSeen ? formatRelativeTime(cabinet.lastSeen) : 'Chưa có heartbeat'}
      </p>
    </div>
  )
}

export default function CabinetListPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [locationFilter, setLocationFilter] = React.useState('')
  const [statusFilter, setStatusFilter] = React.useState('')
  const [search, setSearch] = React.useState('')

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
    onError: (err) => { toast.error(err instanceof Error ? err.message : 'Could not delete cabinet') },
  })

  const cabinetData = React.useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase()
    return cabinets.filter((cabinet) => {
      const matchesLocation = !locationFilter || cabinet.locationId === locationFilter
      const matchesStatus = !statusFilter || cabinet.status === statusFilter
      const matchesSearch = !normalizedSearch
        || cabinet.name.toLowerCase().includes(normalizedSearch)
        || cabinet.locationName.toLowerCase().includes(normalizedSearch)
        || (cabinet.hardwareSerial ?? '').toLowerCase().includes(normalizedSearch)
      return matchesLocation && matchesStatus && matchesSearch
    })
  }, [cabinets, locationFilter, statusFilter, search])

  const compartmentData = React.useMemo<Compartment[]>(() => {
    return cabinetData.flatMap((cabinet) => cabinet.compartments ?? [])
  }, [cabinetData])

  const stats = React.useMemo(() => ({
    online: cabinets.filter(c => c.status === 'ONLINE').length,
    configuring: cabinets.filter(c => c.status === 'CONFIGURING').length,
    totalCompartments: cabinets.reduce((s, c) => s + (c.totalCompartments ?? 0), 0),
    availableCompartments: cabinets.reduce((s, c) => s + (c.availableCompartments ?? 0), 0),
  }), [cabinets])

  const hasFilters = locationFilter || statusFilter || search

  return (
    <div className="space-y-5">
      {/* Quick stats */}
      <div className="flex flex-wrap gap-2" style={{ animation: 'enter 0.4s ease-out both' }}>
        <StatBadge label="Tổng tủ" value={cabinets.length} accent="bg-brand" />
        <StatBadge label="Online" value={stats.online} accent="bg-online" />
        <StatBadge label="Đang cấu hình" value={stats.configuring} accent="bg-warning" />
        <StatBadge label="Ngăn trống" value={`${stats.availableCompartments}/${stats.totalCompartments}`} accent="bg-blue-400" />
      </div>

      {/* Filters */}
      <div
        className="rounded-2xl border border-zinc-800/50 bg-zinc-900/30 p-4 backdrop-blur-sm transition-all duration-300"
        style={{ animation: 'enter 0.4s ease-out 0.05s both' }}
      >
        <div className="flex flex-wrap items-end gap-3">
          <div className="min-w-48 flex-1">
            <label className="mb-1.5 block text-xs font-medium text-zinc-500">Tìm kiếm</label>
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-500" strokeWidth={2} />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Tên tủ, địa điểm, serial..."
                className="h-9 w-full rounded-xl border border-zinc-800 bg-zinc-900/60 pl-8 pr-3 text-xs text-zinc-200 placeholder:text-zinc-600 outline-none transition-all duration-200 focus:border-brand/40 focus:ring-1 focus:ring-brand/15"
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-zinc-500">Địa điểm</label>
            <select
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              className="h-9 w-40 rounded-xl border border-zinc-800 bg-zinc-900/60 px-3 text-xs text-zinc-200 outline-none transition-all duration-200 focus:border-brand/40 focus:ring-1 focus:ring-brand/15"
            >
              <option value="">Tất cả địa điểm</option>
              {locations.map((l: Location) => (
                <option key={l.id} value={l.id}>{l.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-zinc-500">Trạng thái</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-9 w-36 rounded-xl border border-zinc-800 bg-zinc-900/60 px-3 text-xs text-zinc-200 outline-none transition-all duration-200 focus:border-brand/40 focus:ring-1 focus:ring-brand/15"
            >
              {statusOptions.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>

          {hasFilters && (
            <button
              onClick={() => { setSearch(''); setLocationFilter(''); setStatusFilter('') }}
              className="flex h-9 items-center gap-1.5 rounded-xl px-3 text-xs font-medium text-brand transition-colors duration-150 hover:text-brand-hover active:scale-[0.96]"
            >
              <RotateCcw className="h-3 w-3" strokeWidth={2} />
              Xóa lọc
            </button>
          )}
        </div>
      </div>

      {/* Cabinet grid */}
      <div
        className="overflow-hidden rounded-2xl border border-zinc-800/50 bg-zinc-900/30"
        style={{ animation: 'enter 0.4s ease-out 0.1s both' }}
      >
        {cabinetsLoading ? (
          <div className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="animate-pulse rounded-2xl border border-zinc-800/50 bg-zinc-900/40 p-4">
                <div className="mb-3 flex items-start justify-between">
                  <div className="space-y-2">
                    <div className="h-4 w-28 rounded bg-zinc-800" />
                    <div className="h-3 w-36 rounded bg-zinc-800/60" />
                  </div>
                  <div className="h-7 w-14 rounded-lg bg-zinc-800" />
                </div>
                <div className="mb-3 h-3 w-16 rounded bg-zinc-800" />
                <div className="mb-2 h-1 w-full rounded bg-zinc-800" />
                <div className="h-2 w-20 rounded bg-zinc-800/60" />
              </div>
            ))}
          </div>
        ) : cabinetData.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-zinc-800 bg-zinc-900/60">
              <Archive className="h-6 w-6 text-zinc-600" strokeWidth={1.5} />
            </div>
            {hasFilters ? (
              <>
                <p className="text-sm font-medium text-zinc-400">Không tìm thấy tủ nào</p>
                <p className="mt-1 text-xs text-zinc-600">Thử thay đổi bộ lọc hoặc từ khóa</p>
              </>
            ) : (
              <>
                <p className="text-sm font-medium text-zinc-400">Chưa có tủ nào</p>
                <p className="mt-1 text-xs text-zinc-600">Ghép tủ mới từ mục Ghép tủ để bắt đầu</p>
              </>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-2 xl:grid-cols-3">
            {cabinetData.map((cabinet, i) => (
              <CabinetCard
                key={cabinet.id}
                cabinet={cabinet}
                onDelete={(id) => { if (confirm(`Xóa tủ "${cabinet.name}"?`)) deleteMutation.mutate(id) }}
                style={{ animation: `enter 0.35s ease-out ${0.15 + i * 0.05}s both` }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Compartment grid */}
      <div
        className="overflow-hidden rounded-2xl border border-zinc-800/50 bg-zinc-900/30 p-5 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
        style={{ animation: 'enter 0.4s ease-out 0.15s both' }}
      >
        <div className="mb-4 flex items-center justify-between">
          <div className="space-y-0.5">
            <h3 className="text-sm font-semibold tracking-tight text-zinc-200">Trạng thái ngăn</h3>
            <p className="text-[11px] text-zinc-500">{compartmentData.length} ngăn theo bộ lọc hiện tại</p>
          </div>
          <div className="flex flex-wrap gap-3 text-[10px] text-zinc-500">
            <span className="flex items-center gap-1"><span className="h-2 w-2 rounded bg-success/70" /> Available</span>
            <span className="flex items-center gap-1"><span className="h-2 w-2 rounded bg-info/70" /> Occupied</span>
            <span className="flex items-center gap-1"><span className="h-2 w-2 rounded bg-error/70" /> Maintenance</span>
            <span className="flex items-center gap-1"><span className="h-2 w-2 rounded bg-warning/70" /> Reserved</span>
          </div>
        </div>
        {compartmentData.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Archive className="mb-2 h-5 w-5 text-zinc-600" strokeWidth={1.5} />
            <p className="text-xs text-zinc-600">Không có ngăn nào</p>
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {compartmentData.map((comp, i) => {
              const colors = getCompartmentStatusColor(comp.status)
              return (
                <div
                  key={comp.id}
                  title={`${comp.cabinetName} / ${comp.name}`}
                  onClick={() => navigate(`/cabinets/${comp.cabinetId}`)}
                  className={cn(
                    'flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border text-[10px] font-bold transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)]',
                    'hover:scale-110 hover:shadow-lg',
                    colors.bg, colors.border, colors.text,
                  )}
                  style={{ animation: `enter 0.3s ease-out ${0.2 + i * 0.015}s both` }}
                >
                  {comp.name}
                </div>
              )
            })}
          </div>
        )}
      </div>

      <style>{`
        @keyframes enter {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}
