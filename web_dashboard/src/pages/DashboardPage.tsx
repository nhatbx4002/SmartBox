import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer,
} from 'recharts'
import {
  Warehouse, ClipboardList, TrendingUp, Wifi, Archive,
} from 'lucide-react'
import { cabinetsApi, dashboardApi } from '@/lib/api'
import { formatCurrency, cn } from '@/lib/utils'
import type { DashboardStats, Cabinet } from '@/types'

const emptyStats: DashboardStats = {
  totalCabinets: 0, onlineCabinets: 0, totalCompartments: 0,
  availableCompartments: 0, activeRentals: 0, todayRevenue: 0,
  occupancyRate: 0, revenueByDay: [], rentalsByStatus: [],
}

const BAR_COLORS = ['#FF6600', '#22C55E', '#3B82F6', '#A855F7', '#EF4444']

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

function StatCard({ icon: Icon, label, value, loading, accent }: {
  icon: React.ElementType; label: string; value: string; loading: boolean; accent: string
}) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-zinc-800/50 bg-zinc-900/40 p-5 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:border-zinc-700/60 hover:bg-zinc-900/70 active:scale-[0.98]">
      <div className={cn('pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full opacity-[0.07] blur-3xl', accent)} />
      <div className="relative flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-xs font-semibold tracking-[0.08em] text-zinc-500 uppercase">{label}</p>
          {loading ? (
            <div className="h-8 w-20 animate-pulse rounded-md bg-zinc-800" />
          ) : (
            <p className="text-2xl font-bold tracking-tight text-zinc-100">{value}</p>
          )}
        </div>
        <div className={cn(
          'flex h-9 w-9 items-center justify-center rounded-xl border border-zinc-700/40',
          accent === 'bg-brand' ? 'bg-brand/8' :
          accent === 'bg-online' ? 'bg-online/8' :
          accent === 'bg-info' ? 'bg-blue-500/8' : 'bg-zinc-800/50',
        )}>
          <Icon className={cn(
            'h-4 w-4',
            accent === 'bg-brand' ? 'text-brand' :
            accent === 'bg-online' ? 'text-online' :
            accent === 'bg-info' ? 'text-blue-400' : 'text-zinc-400',
          )} strokeWidth={1.5} />
        </div>
      </div>
    </div>
  )
}

function CabinetMiniCard({ cabinet }: { cabinet: Cabinet }) {
  const navigate = useNavigate()
  const occupancy = cabinet.totalCompartments > 0
    ? ((cabinet.totalCompartments - cabinet.availableCompartments) / cabinet.totalCompartments) * 100
    : 0

  return (
    <div
      onClick={() => navigate(`/cabinets/${cabinet.id}`)}
      className="group relative cursor-pointer overflow-hidden rounded-xl border border-zinc-800/50 bg-zinc-900/30 p-3.5 transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] hover:border-brand/30 hover:bg-zinc-900/60 active:scale-[0.97]"
    >
      <div className="flex items-center justify-between gap-2">
        <span className="truncate text-xs font-semibold tracking-tight text-zinc-200">{cabinet.name}</span>
        <BreathingDot status={cabinet.status} />
      </div>
      <div className="mt-2.5 h-1 w-full overflow-hidden rounded-full bg-zinc-800">
        <div
          className="h-full rounded-full bg-brand transition-all duration-500 ease-out"
          style={{ width: `${Math.max(occupancy, 3)}%` }}
        />
      </div>
      <p className="mt-1.5 text-[10px] font-medium tracking-wide text-zinc-500">
        {cabinet.availableCompartments}/{cabinet.totalCompartments} trống
      </p>
    </div>
  )
}

export default function DashboardPage() {
  const navigate = useNavigate()
  const { data: statsData = emptyStats, isLoading: statsLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: dashboardApi.stats,
  })
  const { data: cabinets = [], isLoading: cabinetsLoading } = useQuery({
    queryKey: ['cabinets', 'dashboard'],
    queryFn: () => cabinetsApi.list(),
  })

  const onlineCount = cabinets.filter(c => c.status === 'ONLINE').length
  const configuringCount = cabinets.filter(c => c.status === 'CONFIGURING').length
  const activeRentalRate = statsData.totalCompartments > 0
    ? Math.round(((statsData.totalCompartments - statsData.availableCompartments) / statsData.totalCompartments) * 100)
    : 0

  return (
    <div className="space-y-5">
      {/* Stats bento row */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4" style={{ animation: 'enter 0.5s ease-out both' }}>
        <StatCard icon={Warehouse} label="Tổng tủ" value={String(statsData.totalCabinets)} loading={statsLoading} accent="bg-brand" />
        <StatCard icon={Wifi} label="Online" value={`${onlineCount}/${statsData.totalCabinets}`} loading={statsLoading} accent="bg-online" />
        <StatCard icon={ClipboardList} label="Đang thuê" value={String(statsData.activeRentals)} loading={statsLoading} accent="bg-info" />
        <StatCard icon={TrendingUp} label="Doanh thu hôm nay" value={formatCurrency(statsData.todayRevenue)} loading={statsLoading} accent="bg-brand" />
      </div>

      {/* Chart bento row */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        {/* Revenue chart — spans 2 cols */}
        <div
          className="lg:col-span-2 overflow-hidden rounded-2xl border border-zinc-800/50 bg-zinc-900/40 p-5 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:border-zinc-700/60"
          style={{ animation: 'enter 0.5s ease-out 0.1s both' }}
        >
          <div className="mb-5 flex items-center justify-between">
            <div className="space-y-0.5">
              <h3 className="text-sm font-semibold tracking-tight text-zinc-200">Doanh thu 7 ngày</h3>
              <p className="text-[11px] text-zinc-500">Tổng doanh thu từ các giao dịch thành công</p>
            </div>
          </div>
          {statsData.revenueByDay.length === 0 ? (
            <div className="flex h-[220px] items-center justify-center">
              <p className="text-xs text-zinc-600">Chưa có dữ liệu</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={statsData.revenueByDay}>
                <defs>
                  <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#FF6600" stopOpacity={0.25} />
                    <stop offset="100%" stopColor="#FF6600" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#2A2A2A" vertical={false} />
                <XAxis dataKey="date" stroke="#6B7280" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => v.slice(5)} />
                <YAxis stroke="#6B7280" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `${(v / 1000000).toFixed(1)}M`} />
                <Tooltip
                  contentStyle={{ background: '#1C1B1B', border: '1px solid #2A2A2A', borderRadius: '12px', fontSize: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.4)' }}
                  labelStyle={{ color: '#9CA3AF' }}
                  itemStyle={{ color: '#FF6600' }}
                  formatter={(val: number) => [formatCurrency(val), 'Doanh thu']}
                />
                <Area type="monotone" dataKey="revenue" stroke="#FF6600" fill="url(#revGrad)" strokeWidth={2} dot={false} activeDot={{ r: 4, fill: '#FF6600', strokeWidth: 0 }} />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Rental distribution */}
        <div
          className="overflow-hidden rounded-2xl border border-zinc-800/50 bg-zinc-900/40 p-5 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:border-zinc-700/60"
          style={{ animation: 'enter 0.5s ease-out 0.15s both' }}
        >
          <div className="mb-4 space-y-0.5">
            <h3 className="text-sm font-semibold tracking-tight text-zinc-200">Phân bổ thuê</h3>
            <p className="text-[11px] text-zinc-500">{statsData.activeRentals} đang hoạt động</p>
          </div>
          <div className="flex items-center justify-center">
            <div className="flex h-28 w-28 items-center justify-center rounded-full border-[6px] border-brand/20">
              <p className="text-2xl font-bold tracking-tight text-zinc-100">{activeRentalRate}%</p>
            </div>
          </div>
          <div className="mt-4 space-y-1.5">
            {statsData.rentalsByStatus.slice(0, 4).map((item, i) => (
              <div key={item.status} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: BAR_COLORS[i % BAR_COLORS.length] }} />
                  <span className="text-zinc-400">{item.status}</span>
                </div>
                <span className="font-medium text-zinc-300">{item.count}</span>
              </div>
            ))}
            {statsData.rentalsByStatus.length === 0 && (
              <p className="py-4 text-center text-xs text-zinc-600">Chưa có dữ liệu</p>
            )}
          </div>
        </div>
      </div>

      {/* Cabinet status row */}
      <div
        className="overflow-hidden rounded-2xl border border-zinc-800/50 bg-zinc-900/40 p-5 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:border-zinc-700/60"
        style={{ animation: 'enter 0.5s ease-out 0.2s both' }}
      >
        <div className="mb-4 flex items-center justify-between">
          <div className="space-y-0.5">
            <h3 className="text-sm font-semibold tracking-tight text-zinc-200">Trạng thái tủ</h3>
            <p className="text-[11px] text-zinc-500">{onlineCount} online &middot; {configuringCount} đang cấu hình</p>
          </div>
          <button onClick={() => navigate('/cabinets')} className="text-xs font-medium text-brand transition-colors duration-150 hover:text-brand-hover">
            Xem tất cả
          </button>
        </div>
        {cabinetsLoading ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="animate-pulse rounded-xl border border-zinc-800/50 bg-zinc-900/30 p-3.5">
                <div className="mb-2 h-3 w-16 rounded bg-zinc-800" />
                <div className="mb-2 h-1 w-full rounded bg-zinc-800" />
                <div className="h-2 w-12 rounded bg-zinc-800" />
              </div>
            ))}
          </div>
        ) : cabinets.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900/60">
              <Archive className="h-5 w-5 text-zinc-600" strokeWidth={1.5} />
            </div>
            <p className="text-sm font-medium text-zinc-500">Chưa có tủ nào</p>
            <p className="mt-1 text-xs text-zinc-600">Ghép tủ mới để bắt đầu</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-6">
            {cabinets.slice(0, 6).map((cabinet, i) => (
              <div key={cabinet.id} style={{ animation: `enter 0.35s ease-out ${0.25 + i * 0.06}s both` }}>
                <CabinetMiniCard cabinet={cabinet} />
              </div>
            ))}
          </div>
        )}
      </div>

      <style>{`
        @keyframes enter {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}
