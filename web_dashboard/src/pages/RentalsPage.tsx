import * as React from 'react'
import { useNavigate } from 'react-router-dom'
import { Copy, Eye, X } from 'lucide-react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { DataTable, Badge, Select, Input, type Column } from '@/components/ui'
import { getRentalStatusVariant } from '@/components/ui/Badge'
import { maskPhone, formatDate, isExpiringSoon, cn } from '@/lib/utils'
import { rentalsApi } from '@/lib/api'
import type { Rental } from '@/types'

const statusOptions = [
  { value: '', label: 'All' },
  { value: 'ACTIVE', label: 'ACTIVE' },
  { value: 'COMPLETED', label: 'COMPLETED' },
  { value: 'EXPIRED', label: 'EXPIRED' },
  { value: 'CANCELLED', label: 'CANCELLED' },
]

function getSortableValue(rental: Rental, key: string) {
  switch (key) {
    case 'code':
      return rental.code
    case 'expiresAt':
      return rental.expiresAt
    case 'startedAt':
      return rental.startedAt
    default:
      return ''
  }
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
    if (sortKey === key) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc')
    } else {
      setSortKey(key)
      setSortDir('asc')
    }
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

  const columns: Column<Rental>[] = [
    {
      key: 'code',
      header: 'Code',
      width: '100px',
      sortable: true,
      render: (row) => (
        <div className="flex items-center gap-1 group">
          <span className="font-mono text-sm font-semibold">#{row.code}</span>
          <button
            onClick={(event) => {
              event.stopPropagation()
              navigator.clipboard.writeText(row.code)
            }}
            className="opacity-0 group-hover:opacity-100 p-1 hover:text-brand cursor-pointer transition-opacity"
          >
            <Copy className="h-3 w-3" />
          </button>
        </div>
      ),
    },
    {
      key: 'customerPhone',
      header: 'Phone',
      width: '120px',
      render: (row) => <span className="text-text-secondary">{maskPhone(row.customerPhone)}</span>,
    },
    { key: 'compartmentName', header: 'Compartment', width: '110px' },
    { key: 'cabinetName', header: 'Cabinet', width: '140px' },
    { key: 'planName', header: 'Plan', width: '140px' },
    {
      key: 'status',
      header: 'Status',
      width: '110px',
      render: (row) => <Badge variant={getRentalStatusVariant(row.status)} dot>{row.status}</Badge>,
    },
    {
      key: 'expiresAt',
      header: 'Expires',
      width: '120px',
      sortable: true,
      render: (row) => (
        <span className={cn(isExpiringSoon(row.expiresAt) && 'text-error font-semibold')}>
          {formatDate(row.expiresAt)}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      width: '100px',
      render: (row) => (
        <div className="flex gap-1">
          <button
            onClick={(event) => {
              event.stopPropagation()
              navigate(`/rentals/${row.id}`)
            }}
            className="p-1.5 rounded hover:bg-surface-elevated transition-colors cursor-pointer"
            title="View detail"
          >
            <Eye className="h-3.5 w-3.5 text-text-secondary" />
          </button>
          {row.status === 'ACTIVE' && (
            <button
              onClick={(event) => {
                event.stopPropagation()
                cancelMutation.mutate(row.id)
              }}
              className="p-1.5 rounded hover:bg-error/10 transition-colors cursor-pointer"
              title="Cancel rental"
            >
              <X className="h-3.5 w-3.5 text-error" />
            </button>
          )}
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-text-primary">Rentals</h2>
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="flex-1 min-w-64">
          <Input
            placeholder="Search code, phone, cabinet..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>
        <Select
          value={statusFilter}
          onValueChange={setStatusFilter}
          placeholder="Status: All"
          options={statusOptions}
          className="w-40"
        />
        <Input type="date" value={startDate} onChange={(event) => setStartDate(event.target.value)} className="w-40" />
        <Input type="date" value={endDate} onChange={(event) => setEndDate(event.target.value)} className="w-40" />
      </div>

      <div className="bg-surface rounded-xl border border-border overflow-hidden">
        <DataTable
          columns={columns}
          data={rentalsData}
          loading={isLoading}
          rowKey={(row) => row.id}
          onRowClick={(row) => navigate(`/rentals/${row.id}`)}
          sortKey={sortKey}
          sortDir={sortDir}
          onSort={handleSort}
          emptyMessage="No rentals found"
        />
      </div>

      <div className="flex items-center justify-between text-sm text-text-muted">
        <span>Showing {rentalsData.length} / {rentals.length} results</span>
      </div>
    </div>
  )
}
