import type {
  ColumnDef,
  ColumnFiltersState,
  PaginationState,
  SortingState,
  VisibilityState,
} from '@tanstack/react-table'

export interface DataTableProps<TData, TValue = unknown> {
  /** Table columns definition */
  columns: ColumnDef<TData, TValue>[]
  /** Table data */
  data: TData[]
  /** Enable sorting */
  enableSorting?: boolean
  /** Enable filtering */
  enableFiltering?: boolean
  /** Enable column visibility toggle */
  enableColumnVisibility?: boolean
  /** Enable row selection */
  enableRowSelection?: boolean
  /** Enable pagination */
  enablePagination?: boolean
  /** Page size options for pagination */
  pageSizeOptions?: number[]
  /** Default page size */
  defaultPageSize?: number
  /** Callback when row selection changes */
  onRowSelectionChange?: (selectedRows: TData[]) => void
  /** Custom empty state message */
  emptyMessage?: string
  /** Additional class name */
  className?: string
}

export interface DataTableState {
  sorting: SortingState
  columnFilters: ColumnFiltersState
  columnVisibility: VisibilityState
  rowSelection: Record<string, boolean>
  pagination: PaginationState
}
