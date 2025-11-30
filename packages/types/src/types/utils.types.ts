export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]
}

export type Nullable<T> = T | null

export type Optional<T> = T | undefined

export interface Pagination<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: ErrorResponse
  timestamp: Date
}

export interface ErrorResponse {
  code: string
  message: string
  details?: unknown
}

export interface SuccessResponse<T> {
  success: true
  data: T
  timestamp: Date
}

export interface PaginationParams {
  page?: number
  pageSize?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface FilterParams {
  search?: string
  filters?: Record<string, unknown>
}

export type QueryParams = PaginationParams & FilterParams

export type ID = string

export type Timestamp = Date

export type AsyncResult<T, E = Error> = Promise<
  { success: true; data: T } | { success: false; error: E }
>
