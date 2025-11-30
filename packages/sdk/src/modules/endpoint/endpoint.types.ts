import type { Endpoint } from '@dev-platform/types'

interface ListEndpointsResponse {
  endpoints: Endpoint[]
  total: number
}

interface TestEndpointRequest {
  headers?: Record<string, string>
  queryParams?: Record<string, string>
  body?: Record<string, unknown>
}

interface TestEndpointResponse {
  statusCode: number
  headers: Record<string, string>
  body: Record<string, unknown> | string
  responseTimeMs: number
}

export {
  type ListEndpointsResponse,
  type TestEndpointRequest,
  type TestEndpointResponse,
}
