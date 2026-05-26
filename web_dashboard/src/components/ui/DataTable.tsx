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
          <div key={i} className="flex gap-4 p-4 border-b border-border">
            {columns.map((col) => (
              <div key={col.key} className="h-4 rounded animate-shimmer" style={{ width: col.width || '100%' }} />
            ))}
          </div>
        ))}
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <Package className="h-12 w-12 text-text-muted mb-3" />
        <p className="text-text-secondary font-medium">{emptyMessage}</p>
        <p className="text-text-muted text-sm mt-1">Dữ liệu sẽ xuất hiện ở đây</p>
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
                  'px-4 py-3 text-left text-label uppercase text-text-muted font-medium',
                  col.sortable && 'cursor-pointer hover:text-text-secondary transition-colors select-none',
                )}
                style={{ width: col.width }}
              >
                <span className="inline-flex items-center gap-1">
                  {col.header}
                  {col.sortable && sortKey === col.key && (
                    sortDir === 'asc' ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />
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
                'border-b border-border/50 transition-colors duration-150',
                onRowClick && 'cursor-pointer',
                'hover:bg-surface-elevated',
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
