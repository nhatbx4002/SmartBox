import * as React from 'react'
import { useQuery } from '@tanstack/react-query'
import { auditApi } from '@/lib/api'
import { DataTable, Badge, Select, Input, type Column } from '@/components/ui'
import { formatDateTime, cn } from '@/lib/utils'
import type { AuditLog, AuditAction } from '@/types'

const actionLabels: Record<AuditAction, string> = {
  UNLOCK_COMPARTMENT: 'Unlock compartment',
  UPDATE_PRICE_PLAN: 'Update price plan',
  CREATE_LOCATION: 'Create location',
  UPDATE_LOCATION: 'Update location',
  DELETE_LOCATION: 'Delete location',
  CREATE_CABINET: 'Create cabinet',
  UPDATE_CABINET: 'Update cabinet',
  DELETE_CABINET: 'Delete cabinet',
  CANCEL_RENTAL: 'Cancel rental',
  LOGIN: 'Login',
  LOGOUT: 'Logout',
}

const actionColors: Record<AuditAction, string> = {
  UNLOCK_COMPARTMENT: 'text-brand',
  UPDATE_PRICE_PLAN: 'text-info',
  CREATE_LOCATION: 'text-success',
  UPDATE_LOCATION: 'text-info',
  DELETE_LOCATION: 'text-error',
  CREATE_CABINET: 'text-success',
  UPDATE_CABINET: 'text-info',
  DELETE_CABINET: 'text-error',
  CANCEL_RENTAL: 'text-error',
  LOGIN: 'text-text-secondary',
  LOGOUT: 'text-text-muted',
}

const actionOptions = [
  { value: '', label: 'All actions' },
  { value: 'LOGIN', label: 'Login' },
  { value: 'LOGOUT', label: 'Logout' },
  { value: 'CREATE_LOCATION', label: 'Create location' },
  { value: 'UPDATE_LOCATION', label: 'Update location' },
  { value: 'DELETE_LOCATION', label: 'Delete location' },
  { value: 'CREATE_CABINET', label: 'Create cabinet' },
  { value: 'UPDATE_CABINET', label: 'Update cabinet' },
  { value: 'DELETE_CABINET', label: 'Delete cabinet' },
  { value: 'UNLOCK_COMPARTMENT', label: 'Unlock compartment' },
  { value: 'CANCEL_RENTAL', label: 'Cancel rental' },
]

export default function AuditLogsPage() {
  const [actionFilter, setActionFilter] = React.useState('')
  const [search, setSearch] = React.useState('')

  const { data, isLoading } = useQuery({
    queryKey: ['audit-logs', actionFilter],
    queryFn: () => auditApi.list({ action: actionFilter || undefined, limit: 100 }),
  })

  const logsData = React.useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase()
    const items = data?.items ?? []
    if (!normalizedSearch) return items
    return items.filter((log) =>
      log.adminName.toLowerCase().includes(normalizedSearch)
      || log.action.toLowerCase().includes(normalizedSearch)
      || log.target.toLowerCase().includes(normalizedSearch)
      || log.ipAddress.toLowerCase().includes(normalizedSearch),
    )
  }, [data?.items, search])

  const columns: Column<AuditLog>[] = [
    {
      key: 'timestamp',
      header: 'Timestamp',
      width: '180px',
      render: (row) => <span className="font-mono text-xs text-text-secondary">{formatDateTime(row.timestamp)}</span>,
    },
    {
      key: 'adminName',
      header: 'Admin',
      width: '180px',
      render: (row) => <span className="text-sm">{row.adminName}</span>,
    },
    {
      key: 'action',
      header: 'Action',
      render: (row) => (
        <span className={cn('text-sm font-medium', actionColors[row.action])}>
          {actionLabels[row.action] || row.action}
        </span>
      ),
    },
    {
      key: 'target',
      header: 'Target',
      render: (row) => <span className="text-sm text-text-secondary">{row.target}</span>,
    },
    {
      key: 'ipAddress',
      header: 'IP address',
      width: '120px',
      render: (row) => <span className="font-mono text-xs text-text-muted">{row.ipAddress || '-'}</span>,
    },
    {
      key: 'success',
      header: 'Status',
      width: '100px',
      render: (row) => (
        <Badge variant={row.success ? 'success' : 'error'} dot>
          {row.success ? 'Success' : 'Failed'}
        </Badge>
      ),
    },
  ]

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-text-primary">Audit logs</h2>
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="flex-1 min-w-64">
          <Input
            placeholder="Search admin, action, target..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>
        <Select
          value={actionFilter}
          onValueChange={setActionFilter}
          placeholder="Action: All"
          options={actionOptions}
          className="w-56"
        />
      </div>

      <div className="bg-surface rounded-xl border border-border overflow-hidden">
        <DataTable
          columns={columns}
          data={logsData}
          loading={isLoading}
          rowKey={(row) => row.id}
          emptyMessage="No audit logs found"
        />
      </div>
    </div>
  )
}
