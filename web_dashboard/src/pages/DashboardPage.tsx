import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar,
} from 'recharts'
import {
  Warehouse, ClipboardList, TrendingUp, Activity,
  Wifi, WifiOff,
} from 'lucide-react'
import { cabinetsApi, dashboardApi } from '@/lib/api'
import { formatCurrency } from '@/lib/utils'
import type { DashboardStats } from '@/types'

const emptyStats: DashboardStats = {
  totalCabinets: 0,
  onlineCabinets: 0,
  totalCompartments: 0,
  availableCompartments: 0,
  activeRentals: 0,
  todayRevenue: 0,
  occupancyRate: 0,
  revenueByDay: [],
  rentalsByStatus: [],
}

const statCards = [
  { label: 'Tổng tủ', key: 'totalCabinets' as const, icon: Warehouse, color: 'text-brand' },
  { label: 'Đang online', key: 'onlineCabinets' as const, icon: Wifi, color: 'text-online' },
  { label: 'Thuê đang hoạt động', key: 'activeRentals' as const, icon: ClipboardList, color: 'text-info' },
  { label: 'Doanh thu hôm nay', key: 'todayRevenue' as const, icon: TrendingUp, color: 'text-success' },
]

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

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => {
          const Icon = card.icon
          const value = card.key === 'todayRevenue'
            ? formatCurrency(statsData[card.key])
            : statsData[card.key].toLocaleString()
          return (
            <div key={card.key} className="bg-surface rounded-xl border border-border p-4 hover:border-brand/30 transition-colors cursor-pointer">
              <div className="flex items-center justify-between mb-3">
                <span className="text-label text-text-muted uppercase">{card.label}</span>
                <Icon className={`h-4 w-4 ${card.color}`} />
              </div>
              <p className="text-2xl font-bold text-text-primary">{statsLoading ? '...' : value}</p>
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-surface rounded-xl border border-border p-6">
          <h3 className="text-sm font-semibold text-text-primary mb-4">Doanh thu 7 ngày gần nhất</h3>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={statsData.revenueByDay}>
              <defs>
                <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#FF6600" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#FF6600" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="date" stroke="#6B7280" fontSize={12} />
              <YAxis stroke="#6B7280" fontSize={12} tickFormatter={(v) => `${(Number(v) / 1000000).toFixed(1)}M`} />
              <Tooltip
                contentStyle={{ background: '#1C1B1B', border: '1px solid #333', borderRadius: '8px', fontSize: '13px' }}
                labelStyle={{ color: '#9CA3AF' }}
                formatter={(value: number) => [formatCurrency(value), 'Doanh thu']}
              />
              <Area type="monotone" dataKey="revenue" stroke="#FF6600" fill="url(#revenueGradient)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-surface rounded-xl border border-border p-6">
          <h3 className="text-sm font-semibold text-text-primary mb-4">Phân bổ thuê</h3>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={statsData.rentalsByStatus} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis type="number" stroke="#6B7280" fontSize={12} />
              <YAxis dataKey="status" type="category" stroke="#6B7280" fontSize={12} width={80} />
              <Tooltip
                contentStyle={{ background: '#1C1B1B', border: '1px solid #333', borderRadius: '8px', fontSize: '13px' }}
              />
              <Bar dataKey="count" fill="#FF6600" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-surface rounded-xl border border-border p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-text-primary">Trạng thái Tủ</h3>
          <button
            onClick={() => navigate('/cabinets')}
            className="text-sm text-brand hover:text-brand-hover cursor-pointer transition-colors"
          >
            Xem tất cả
          </button>
        </div>
        {cabinetsLoading ? (
          <div className="text-sm text-text-muted">Đang tải...</div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {cabinets.slice(0, 6).map((cabinet) => {
              const occupancy = cabinet.totalCompartments > 0
                ? ((cabinet.totalCompartments - cabinet.availableCompartments) / cabinet.totalCompartments) * 100
                : 0
              return (
                <div
                  key={cabinet.id}
                  onClick={() => navigate(`/cabinets/${cabinet.id}`)}
                  className="bg-surface-elevated rounded-lg p-3 border border-border hover:border-brand/30 transition-all cursor-pointer hover:scale-105"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-text-primary truncate">{cabinet.name}</span>
                    {cabinet.status === 'ONLINE'
                      ? <Wifi className="h-3 w-3 text-online shrink-0" />
                      : cabinet.status === 'OFFLINE'
                        ? <WifiOff className="h-3 w-3 text-error shrink-0" />
                        : <Activity className="h-3 w-3 text-text-muted shrink-0" />}
                  </div>
                  <div className="w-full bg-border rounded-full h-1.5 mb-1">
                    <div
                      className="h-1.5 rounded-full bg-brand transition-all"
                      style={{ width: `${occupancy}%` }}
                    />
                  </div>
                  <p className="text-[10px] text-text-muted">
                    {cabinet.availableCompartments}/{cabinet.totalCompartments} trống
                  </p>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
