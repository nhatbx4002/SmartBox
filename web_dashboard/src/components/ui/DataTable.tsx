import * as React from 'react'
import { ChevronUp, ChevronDown, Package } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface Column<T> {
  key: string
  header: string
  width?: string
  render?: (row: T) => React.ReactNode
  sortable?: boolean
}

interface DataTableProps<T> {
  columns: Column<T>[]
  data: T[]
  loading?: boolean
  emptyMessage?: string
  rowKey: (row: T) => string
  onRowClick?: (row: T) => void
  sortKey?: string
  sortDir?: 'asc' | 'desc'
  onSort?: (key: string) => void
}

export function DataTable<T>({
  columns, data, loading, emptyMessage = 'Không có dữ liệu',
  rowKey, onRowClick, sortKey, sortDir, onSort,
}: DataTableProps<T>) {
  if (loading) {
    return (
      <div className="w-full">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex gap-4 p-4 border-b border-border-subtle">
            {columns.map((col) => (
              <div
                key={col.key}
                className="h-4 rounded skeleton"
                style={{ width: col.width || '100%' }}
              />
            ))}
          </div>
        ))}
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-12 h-12 rounded-full bg-surface-2 flex items-center justify-center mb-3">
          <Package className="h-5 w-5 text-text-muted" />
        </div>
        <p className="text-text-secondary font-medium text-sm">{emptyMessage}</p>
        <p className="text-text-muted text-xs mt-1">Dữ liệu sẽ xuất hiện ở đây</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-border">
            {columns.map((col) => (
              <th
                key={col.key}
                onClick={col.sortable ? () => onSort?.(col.key) : undefined}
                className={cn(
                  'px-4 py-3 text-left',
                  'text-label-xs font-medium uppercase tracking-wider text-text-muted',
                  col.sortable && 'cursor-pointer select-none hover:text-text-secondary transition-colors duration-150',
                )}
                style={{ width: col.width }}
              >
                <span className="inline-flex items-center gap-1">
                  {col.header}
                  {col.sortable && sortKey === col.key && (
                    sortDir === 'asc'
                      ? <ChevronUp className="h-3 w-3" />
                      : <ChevronDown className="h-3 w-3" />
                  )}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr
              key={rowKey(row)}
              onClick={onRowClick ? () => onRowClick(row) : undefined}
              className={cn(
                'group border-b border-border-subtle',
                'hover:bg-surface-1',
                'transition-colors duration-100',
                onRowClick ? 'cursor-pointer' : '',
              )}
            >
              {columns.map((col) => (
                <td key={col.key} className="px-4 py-3 text-sm text-text-primary">
                  {col.render ? col.render(row) : (row as Record<string, unknown>)[col.key] as React.ReactNode}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
