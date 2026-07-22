import * as React from 'react'
import { useQuery } from '@tanstack/react-query'
import { auditApi } from '@/lib/api'
import { DataTable, Select, Input, type Column } from '@/components/ui'
import { formatDateTime, cn } from '@/lib/utils'
import type { AuditLog, AuditAction } from '@/types'

const actionLabels: Record<AuditAction, string> = {
  UNLOCK_COMPARTMENT: 'Unlock compartment',
  CREATE_PRICE_PLAN: 'Create price plan',
  UPDATE_PRICE_PLAN: 'Update price plan',
  DELETE_PRICE_PLAN: 'Delete price plan',
  CREATE_LOCATION: 'Create location',
  UPDATE_LOCATION: 'Update location',
  DELETE_LOCATION: 'Delete location',
  CREATE_CABINET: 'Create cabinet',
  UPDATE_CABINET: 'Update cabinet',
  DELETE_CABINET: 'Delete cabinet',
  CANCEL_RENTAL: 'Cancel rental',
  CREATE_ADMIN: 'Create admin',
  UPDATE_ADMIN: 'Update admin',
  DELETE_ADMIN: 'Delete admin',
  ASSIGN_ADMIN_CABINET: 'Assign cabinet',
  UNASSIGN_ADMIN_CABINET: 'Unassign cabinet',
  CANCEL_PAIRING: 'Cancel pairing',
  LOGIN: 'Login',
  LOGOUT: 'Logout',
}

const actionColors: Record<AuditAction, string> = {
  UNLOCK_COMPARTMENT: 'text-brand',
  CREATE_PRICE_PLAN: 'text-success',
  UPDATE_PRICE_PLAN: 'text-info',
  DELETE_PRICE_PLAN: 'text-error',
  CREATE_LOCATION: 'text-success',
  UPDATE_LOCATION: 'text-info',
  DELETE_LOCATION: 'text-error',
  CREATE_CABINET: 'text-success',
  UPDATE_CABINET: 'text-info',
  DELETE_CABINET: 'text-error',
  CANCEL_RENTAL: 'text-error',
  CREATE_ADMIN: 'text-success',
  UPDATE_ADMIN: 'text-info',
  DELETE_ADMIN: 'text-error',
  ASSIGN_ADMIN_CABINET: 'text-info',
  UNASSIGN_ADMIN_CABINET: 'text-text-secondary',
  CANCEL_PAIRING: 'text-error',
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
  { value: 'CREATE_PRICE_PLAN', label: 'Create price plan' },
  { value: 'UPDATE_PRICE_PLAN', label: 'Update price plan' },
  { value: 'DELETE_PRICE_PLAN', label: 'Delete price plan' },
  { value: 'CREATE_ADMIN', label: 'Create admin' },
  { value: 'UPDATE_ADMIN', label: 'Update admin' },
  { value: 'DELETE_ADMIN', label: 'Delete admin' },
  { value: 'ASSIGN_ADMIN_CABINET', label: 'Assign cabinet' },
  { value: 'UNASSIGN_ADMIN_CABINET', label: 'Unassign cabinet' },
  { value: 'CANCEL_PAIRING', label: 'Cancel pairing' },
]

const PAGE_SIZE = 20

export default function AuditLogsPage() {
  const [actionFilter, setActionFilter] = React.useState('')
  const [searchInput, setSearchInput] = React.useState('')
  const [search, setSearch] = React.useState('')
  const [page, setPage] = React.useState(1)

  // debounce search → reset page to 1
  React.useEffect(() => {
    const t = setTimeout(() => {
      setSearch(searchInput)
      setPage(1)
    }, 400)
    return () => clearTimeout(t)
  }, [searchInput])

  // reset page when filter changes
  React.useEffect(() => { setPage(1) }, [actionFilter])

  const { data, isLoading } = useQuery({
    queryKey: ['audit-logs', actionFilter, search, page],
    queryFn: () =>
      auditApi.list({
        action: actionFilter || undefined,
        q: search || undefined,
        page,
        limit: PAGE_SIZE,
      }),
  })

  const totalPages = data?.pages ?? 1
  const total = data?.total ?? 0

  const columns: Column<AuditLog>[] = [
    {
      key: 'timestamp',
      header: 'Timestamp',
      width: '170px',
      render: (row) => <span className="font-mono text-xs text-text-muted">{formatDateTime(row.timestamp)}</span>,
    },
    {
      key: 'adminName',
      header: 'Admin',
      width: '160px',
      render: (row) => <span className="text-sm font-medium text-text-primary">{row.adminName}</span>,
    },
    {
      key: 'action',
      header: 'Action',
      render: (row) => (
        <span className={cn('text-sm font-medium', actionColors[row.action])}>
          {actionLabels[row.action] ?? row.action}
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
      header: 'IP',
      width: '110px',
      render: (row) => <span className="font-mono text-xs text-text-muted">{row.ipAddress || '-'}</span>,
    },
  ]

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="bg-surface rounded-xl border border-border p-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex-1 min-w-48">
            <Input
              placeholder="Search admin, resource..."
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
            />
          </div>
          <Select
            value={actionFilter}
            onValueChange={setActionFilter}
            placeholder="Action: All"
            options={actionOptions}
            className="w-52"
          />
          {(searchInput || actionFilter) && (
            <button
              onClick={() => { setSearchInput(''); setSearch(''); setActionFilter('') }}
              className="text-xs text-brand hover:text-brand-hover cursor-pointer transition-colors"
            >
              Xóa lọc
            </button>
          )}
        </div>
      </div>

      <div className="bg-surface rounded-xl border border-border overflow-hidden">
        <DataTable
          columns={columns}
          data={data?.items ?? []}
          loading={isLoading}
          rowKey={(row) => row.id}
          emptyMessage="No audit logs found"
        />

        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-border">
            <span className="text-xs text-text-muted">
              {total} records · page {page}/{totalPages}
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage(1)}
                disabled={page === 1}
                className="px-2 py-1 text-xs rounded border border-border disabled:opacity-40 hover:bg-surface-hover transition-colors"
              >
                «
              </button>
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1 text-xs rounded border border-border disabled:opacity-40 hover:bg-surface-hover transition-colors"
              >
                Prev
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-3 py-1 text-xs rounded border border-border disabled:opacity-40 hover:bg-surface-hover transition-colors"
              >
                Next
              </button>
              <button
                onClick={() => setPage(totalPages)}
                disabled={page === totalPages}
                className="px-2 py-1 text-xs rounded border border-border disabled:opacity-40 hover:bg-surface-hover transition-colors"
              >
                »
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
