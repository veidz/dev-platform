import type { API } from '@dev-platform/types'

interface ListApisResponse {
  apis: API[]
  total: number
}

interface ImportApiResponse {
  api: API
  endpointsCreated: number
}

export { type ImportApiResponse, type ListApisResponse }
