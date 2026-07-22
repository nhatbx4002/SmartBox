import * as React from 'react'
import { useNavigate } from 'react-router-dom'
import { Copy, Eye, X, Search, Warehouse, Clock, TrendingUp, Calendar, ChevronUp, ChevronDown, Phone, RotateCcw } from 'lucide-react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { Badge } from '@/components/ui'
import { getRentalStatusVariant } from '@/components/ui/Badge'
import { maskPhone, formatDateTime, formatCurrency, cn } from '@/lib/utils'
import { rentalsApi } from '@/lib/api'
import type { Rental } from '@/types'

const statusOptions = [
  { value: '', label: 'Trạng thái' },
  { value: 'PENDING', label: 'PENDING' },
  { value: 'ACTIVE', label: 'ACTIVE' },
  { value: 'COMPLETED', label: 'COMPLETED' },
  { value: 'EXPIRED', label: 'EXPIRED' },
  { value: 'CANCELLED', label: 'CANCELLED' },
]

function getSortableValue(rental: Rental, key: string) {
  switch (key) {
    case 'code': return rental.code
    case 'expiresAt': return rental.expiresAt
    case 'startedAt': return rental.startedAt
    default: return ''
  }
}

function BreathingDot({ status }: { status: Rental['status'] }) {
  const colors: Record<string, string> = {
    ACTIVE: 'bg-online',
    PENDING: 'bg-warning',
    COMPLETED: 'bg-white/20',
    EXPIRED: 'bg-error',
    CANCELLED: 'bg-white/20',
  }

  return (
    <span className="relative inline-flex h-2 w-2 shrink-0">
      {status === 'ACTIVE' && (
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-online/60" />
      )}
      <span className={cn('relative inline-flex h-2 w-2 rounded-full', colors[status] ?? 'bg-white/20')} />
    </span>
  )
}

function SummaryCard({ icon: Icon, label, value, accent }: { icon: React.ElementType; label: string; value: string; accent: string }) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-zinc-800/60 bg-zinc-900/50 p-5 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:border-zinc-700 hover:bg-zinc-900/80">
      <div className={cn('absolute -right-6 -top-6 h-20 w-20 rounded-full opacity-[0.08] blur-3xl', accent)} />
      <div className="relative flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-xs font-semibold tracking-[0.08em] text-zinc-500 uppercase">{label}</p>
          <p className="text-2xl font-bold tracking-tight text-zinc-100">{value}</p>
        </div>
        <div className={cn(
          'flex h-9 w-9 items-center justify-center rounded-xl border border-zinc-700/40',
          accent === 'bg-brand' ? 'bg-brand/10' :
          accent === 'bg-online' ? 'bg-online/10' :
          accent === 'bg-warning' ? 'bg-warning/10' : 'bg-zinc-800/60',
        )}>
          <Icon className={cn(
            'h-4 w-4',
            accent === 'bg-brand' ? 'text-brand' :
            accent === 'bg-online' ? 'text-online' :
            accent === 'bg-warning' ? 'text-warning' : 'text-zinc-400',
          )} strokeWidth={2} />
        </div>
      </div>
    </div>
  )
}

function SkeletonRow() {
  return (
    <div className="flex items-center gap-4 border-b border-zinc-800/40 px-6 py-4">
      {[90, 130, 120, 100, 130, 110, 120].map((w, i) => (
        <div key={i} className="h-4 animate-pulse rounded-md bg-zinc-800/60" style={{ width: w, animationDelay: `${i * 0.08}s` }} />
      ))}
    </div>
  )
}

function EmptyState({ hasFilters }: { hasFilters: boolean }) {
  return (
    <div className="flex flex-col items-center justify-center py-24">
      <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-zinc-800 bg-zinc-900/80">
        <Warehouse className="h-7 w-7 text-zinc-600" strokeWidth={1.5} />
      </div>
      {hasFilters ? (
        <>
          <p className="text-base font-medium text-zinc-400">Không tìm thấy kết quả</p>
          <p className="mt-1 text-sm text-zinc-600">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
        </>
      ) : (
        <>
          <p className="text-base font-medium text-zinc-400">Chưa có phiên thuê nào</p>
          <p className="mt-1 text-sm text-zinc-600 leading-relaxed">Các phiên thuê tủ sẽ hiển thị tại đây khi khách hàng đặt</p>
        </>
      )}
    </div>
  )
}

export default function RentalsPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [search, setSearch] = React.useState('')
  const [statusFilter, setStatusFilter] = React.useState('')
  const [startDate, setStartDate] = React.useState('')
  const [endDate, setEndDate] = React.useState('')
  const [sortKey, setSortKey] = React.useState('startedAt')
  const [sortDir, setSortDir] = React.useState<'asc' | 'desc'>('desc')

  const { data: rentals = [], isLoading } = useQuery({
    queryKey: ['rentals', statusFilter],
    queryFn: () => rentalsApi.list({ status: statusFilter || undefined }),
  })

  const cancelMutation = useMutation({
    mutationFn: (id: string) => rentalsApi.cancel(id),
    onSuccess: () => {
      toast.success('Rental cancelled')
      queryClient.invalidateQueries({ queryKey: ['rentals'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] })
    },
    onError: () => toast.error('Could not cancel rental'),
  })

  const handleSort = (key: string) => {
    if (sortKey === key) setSortDir(sortDir === 'asc' ? 'desc' : 'asc')
    else { setSortKey(key); setSortDir('asc') }
  }

  const rentalsData = React.useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase()
    const start = startDate ? new Date(startDate).getTime() : undefined
    const end = endDate ? new Date(endDate).getTime() + 86_399_999 : undefined

    return [...rentals]
      .filter((rental) => {
        const startedAt = new Date(rental.startedAt).getTime()
        const matchesSearch = !normalizedSearch
          || rental.code.toLowerCase().includes(normalizedSearch)
          || rental.customerPhone.toLowerCase().includes(normalizedSearch)
          || rental.cabinetName.toLowerCase().includes(normalizedSearch)
          || rental.compartmentName.toLowerCase().includes(normalizedSearch)
        const matchesStart = start === undefined || startedAt >= start
        const matchesEnd = end === undefined || startedAt <= end
        return matchesSearch && matchesStart && matchesEnd
      })
      .sort((a, b) => {
        const left = getSortableValue(a, sortKey)
        const right = getSortableValue(b, sortKey)
        return sortDir === 'asc' ? left.localeCompare(right) : right.localeCompare(left)
      })
  }, [rentals, search, startDate, endDate, sortKey, sortDir])

  const stats = React.useMemo(() => {
    const active = rentals.filter(r => r.status === 'ACTIVE')
    const pending = rentals.filter(r => r.status === 'PENDING')
    const revenue = active.reduce((sum, r) => sum + r.price, 0)
    return { active: active.length, pending: pending.length, total: rentals.length, revenue }
  }, [rentals])

  const hasFilters = Boolean(search || statusFilter || startDate || endDate)

  const SortHeader = ({ colKey, label, className }: { colKey: string; label: string; className?: string }) => (
    <button
      onClick={() => handleSort(colKey)}
      className={cn(
        'inline-flex items-center gap-1 text-xs font-semibold tracking-[0.08em] text-zinc-500 uppercase transition-colors duration-150 hover:text-zinc-300',
        sortKey === colKey && 'text-brand',
        className,
      )}
    >
      {label}
      {sortKey === colKey && (
        sortDir === 'asc'
          ? <ChevronUp className="h-3 w-3" strokeWidth={2.5} />
          : <ChevronDown className="h-3 w-3" strokeWidth={2.5} />
      )}
    </button>
  )

  return (
    <div className="mx-auto space-y-5 py-2">
      {/* Stats row */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <SummaryCard icon={Warehouse} label="Đang thuê" value={String(stats.active)} accent="bg-online" />
        <SummaryCard icon={Clock} label="Chờ xử lý" value={String(stats.pending)} accent="bg-warning" />
        <SummaryCard icon={Calendar} label="Tổng thuê" value={String(stats.total)} accent="bg-zinc-400" />
        <SummaryCard icon={TrendingUp} label="Doanh thu active" value={formatCurrency(stats.revenue)} accent="bg-brand" />
      </div>

      {/* Filters */}
      <div className="rounded-2xl border border-zinc-800/50 bg-zinc-900/30 p-5 backdrop-blur-sm transition-all duration-300">
        <div className="flex flex-wrap items-end gap-3">
          <div className="min-w-48 flex-1">
            <label className="mb-1.5 block text-xs font-medium text-zinc-500">Tìm kiếm</label>
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" strokeWidth={2} />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Mã thuê, số điện thoại, tủ..."
                className="h-10 w-full rounded-xl border border-zinc-800 bg-zinc-900/60 pl-9 pr-3 text-sm text-zinc-200 placeholder:text-zinc-600 outline-none transition-all duration-200 focus:border-brand/40 focus:ring-1 focus:ring-brand/15"
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-zinc-500">Trạng thái</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-10 w-36 rounded-xl border border-zinc-800 bg-zinc-900/60 px-3 text-sm text-zinc-200 outline-none transition-all duration-200 focus:border-brand/40 focus:ring-1 focus:ring-brand/15"
            >
              {statusOptions.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-zinc-500">Từ ngày</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="h-10 w-36 rounded-xl border border-zinc-800 bg-zinc-900/60 px-3 text-sm text-zinc-200 outline-none transition-all duration-200 focus:border-brand/40 focus:ring-1 focus:ring-brand/15 [color-scheme:dark]"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-zinc-500">Đến ngày</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="h-10 w-36 rounded-xl border border-zinc-800 bg-zinc-900/60 px-3 text-sm text-zinc-200 outline-none transition-all duration-200 focus:border-brand/40 focus:ring-1 focus:ring-brand/15 [color-scheme:dark]"
            />
          </div>

          {hasFilters && (
            <button
              onClick={() => { setSearch(''); setStatusFilter(''); setStartDate(''); setEndDate('') }}
              className="flex h-10 items-center gap-1.5 rounded-xl px-3.5 text-xs font-medium text-brand transition-colors duration-150 hover:text-brand-hover active:scale-[0.96]"
            >
              <RotateCcw className="h-3.5 w-3.5" strokeWidth={2} />
              Xóa lọc
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-zinc-800/50 bg-zinc-900/30 transition-all duration-300">
        {isLoading ? (
          <div className="divide-y divide-zinc-800/40">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonRow key={i} />
            ))}
          </div>
        ) : rentalsData.length === 0 ? (
          <EmptyState hasFilters={hasFilters} />
        ) : (
          <div>
            {/* Header row */}
            <div className="flex items-center gap-4 border-b border-zinc-800/50 px-6 py-3">
              <SortHeader colKey="code" label="Mã thuê" className="w-[100px]" />
              <SortHeader colKey="startedAt" label="Ngày tạo" className="w-[130px]" />
              <span className="w-[120px] text-xs font-semibold tracking-[0.08em] text-zinc-500 uppercase">Khách hàng</span>
              <span className="w-[110px] text-xs font-semibold tracking-[0.08em] text-zinc-500 uppercase">Ngăn</span>
              <span className="w-[140px] text-xs font-semibold tracking-[0.08em] text-zinc-500 uppercase">Tủ</span>
              <span className="w-[110px] text-xs font-semibold tracking-[0.08em] text-zinc-500 uppercase">Trạng thái</span>
              <SortHeader colKey="expiresAt" label="Hết hạn" className="w-[120px]" />
              <span className="flex-1" />
            </div>

            {/* Body rows */}
            <div className="divide-y divide-zinc-800/40">
              {rentalsData.map((rental, i) => {
                const hoursLeft = (new Date(rental.expiresAt).getTime() - Date.now()) / 3_600_000
                const isExpiring = rental.status === 'ACTIVE' && hoursLeft > 0 && hoursLeft < 24

                return (
                  <div
                    key={rental.id}
                    onClick={() => navigate(`/rentals/${rental.id}`)}
                    className="group flex cursor-pointer items-center gap-4 px-6 py-3.5 transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-zinc-800/25 active:scale-[0.997]"
                    style={{ animation: `slideIn 0.35s ease-out ${i * 0.045}s both` }}
                  >
                    <div className="flex w-[100px] items-center gap-1.5">
                      <span className="font-mono text-sm font-semibold tracking-tight text-zinc-200">#{rental.code}</span>
                      <button
                        onClick={(e) => { e.stopPropagation(); navigator.clipboard.writeText(rental.code); toast.success('Copied') }}
                        className="shrink-0 rounded p-0.5 text-zinc-600 opacity-0 transition-all duration-150 hover:text-brand group-hover:opacity-100"
                      >
                        <Copy className="h-3 w-3" strokeWidth={2} />
                      </button>
                    </div>
                    <div className="w-[130px] text-sm text-zinc-400">{formatDateTime(rental.startedAt)}</div>
                    <div className="flex w-[120px] items-center gap-1.5">
                      <Phone className="h-3 w-3 text-zinc-500 shrink-0" strokeWidth={2} />
                      <span className="text-sm text-zinc-400">{maskPhone(rental.customerPhone)}</span>
                    </div>
                    <div className="w-[110px] truncate text-sm text-zinc-400">{rental.compartmentName}</div>
                    <div className="w-[140px] truncate text-sm text-zinc-400">{rental.cabinetName}</div>
                    <div className="flex w-[110px] items-center gap-1.5">
                      <BreathingDot status={rental.status} />
                      <Badge variant={getRentalStatusVariant(rental.status)}>{rental.status}</Badge>
                    </div>
                    <div className={cn('w-[120px] text-sm', isExpiring ? 'font-semibold text-error' : 'text-zinc-400')}>
                      {formatDateTime(rental.expiresAt)}
                    </div>
                    <div className="flex flex-1 items-center justify-end gap-1">
                      <button
                        onClick={(e) => { e.stopPropagation(); navigate(`/rentals/${rental.id}`) }}
                        className="flex h-8 w-8 items-center justify-center rounded-xl text-zinc-500 transition-all duration-200 hover:bg-zinc-800 hover:text-zinc-200 active:scale-90"
                      >
                        <Eye className="h-4 w-4" strokeWidth={1.5} />
                      </button>
                      {rental.status === 'ACTIVE' && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            if (confirm(`Hủy phiên thuê #${rental.code}?\nThao tác này không thể hoàn tác.`)) cancelMutation.mutate(rental.id)
                          }}
                          className="flex h-8 w-8 items-center justify-center rounded-xl text-zinc-500 transition-all duration-200 hover:bg-error/10 hover:text-error active:scale-90"
                        >
                          <X className="h-4 w-4" strokeWidth={1.5} />
                        </button>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between px-1">
        <p className="text-xs text-zinc-600">
          Hiển thị <span className="font-medium text-zinc-400">{rentalsData.length}</span> / <span className="font-medium text-zinc-400">{rentals.length}</span> phiên thuê
        </p>
      </div>

      <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}
