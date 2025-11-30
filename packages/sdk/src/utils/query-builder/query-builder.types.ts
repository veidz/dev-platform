interface PaginationParams {
  page?: number
  limit?: number
}

interface SortParams {
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

interface FilterParams {
  [key: string]: string | number | boolean | Date | undefined
}

type QueryParams = PaginationParams & SortParams & FilterParams

export {
  type FilterParams,
  type PaginationParams,
  type QueryParams,
  type SortParams,
}
