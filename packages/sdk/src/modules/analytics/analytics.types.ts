import type { Metric, MetricAggregation, RequestLog } from '@dev-platform/types'

interface GetMetricsRequest {
  apiId?: string
  endpointId?: string
  startDate: Date
  endDate: Date
  metric?: string
  period?: 'hour' | 'day' | 'week' | 'month'
}

interface GetMetricsResponse {
  metrics: Metric[]
  aggregations: MetricAggregation[]
}

interface GetLogsRequest {
  page?: number
  limit?: number
  endpointId?: string
  method?: string
  statusCode?: number
  startDate?: Date
  endDate?: Date
  minResponseTime?: number
  maxResponseTime?: number
}

interface GetLogsResponse {
  logs: RequestLog[]
  total: number
  page: number
  limit: number
}

interface TopEndpoint {
  endpointId: string
  path: string
  method: string
  requestCount: number
  avgResponseTime: number
  errorRate: number
}

interface GetTopEndpointsResponse {
  endpoints: TopEndpoint[]
}

export {
  type GetLogsRequest,
  type GetLogsResponse,
  type GetMetricsRequest,
  type GetMetricsResponse,
  type GetTopEndpointsResponse,
  type TopEndpoint,
}
