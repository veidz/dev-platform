import type {
  FilterParams,
  PaginationParams,
  QueryParams,
  SortParams,
} from './query-builder.types'

const buildQueryParams = (params: QueryParams): Record<string, string> => {
  const searchParams: Record<string, string> = {}

  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null) {
      continue
    }

    if (value instanceof Date) {
      searchParams[key] = value.toISOString()
    } else if (typeof value === 'boolean') {
      searchParams[key] = value.toString()
    } else if (typeof value === 'number') {
      searchParams[key] = value.toString()
    } else {
      searchParams[key] = value
    }
  }

  return searchParams
}

const buildPaginationParams = (
  params: PaginationParams,
): Record<string, string> => {
  const searchParams: Record<string, string> = {}

  if (params.page !== undefined) {
    searchParams.page = params.page.toString()
  }

  if (params.limit !== undefined) {
    searchParams.limit = params.limit.toString()
  }

  return searchParams
}

const buildSortParams = (params: SortParams): Record<string, string> => {
  const searchParams: Record<string, string> = {}

  if (params.sortBy) {
    searchParams.sortBy = params.sortBy
  }

  if (params.sortOrder) {
    searchParams.sortOrder = params.sortOrder
  }

  return searchParams
}

const buildFilterParams = (filters: FilterParams): Record<string, string> => {
  const searchParams: Record<string, string> = {}

  for (const [key, value] of Object.entries(filters)) {
    if (value === undefined || value === null) {
      continue
    }

    if (value instanceof Date) {
      searchParams[key] = value.toISOString()
    } else if (typeof value === 'boolean') {
      searchParams[key] = value.toString()
    } else if (typeof value === 'number') {
      searchParams[key] = value.toString()
    } else {
      searchParams[key] = value
    }
  }

  return searchParams
}

export {
  buildFilterParams,
  buildPaginationParams,
  buildQueryParams,
  buildSortParams,
}
