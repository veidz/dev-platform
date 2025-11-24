import type {
  Alert,
  AlertRule,
  CreateAlertRuleDto,
  UpdateAlertRuleDto,
} from '@dev-platform/types'

import type { BaseClient } from '@/client/http'

import type {
  GetLogsRequest,
  GetLogsResponse,
  GetMetricsRequest,
  GetMetricsResponse,
  GetTopEndpointsResponse,
} from './analytics.types'

class AnalyticsModule {
  constructor(private readonly client: BaseClient) {}

  async getMetrics(request: GetMetricsRequest): Promise<GetMetricsResponse> {
    return this.client
      .get('analytics/metrics', {
        searchParams: {
          ...request,
          startDate: request.startDate.toISOString(),
          endDate: request.endDate.toISOString(),
        },
      })
      .json()
  }

  async getLogs(request: GetLogsRequest): Promise<GetLogsResponse> {
    const searchParams: Record<string, string> = {
      ...(request.page && { page: request.page.toString() }),
      ...(request.limit && { limit: request.limit.toString() }),
      ...(request.endpointId && { endpointId: request.endpointId }),
      ...(request.method && { method: request.method }),
      ...(request.statusCode && {
        statusCode: request.statusCode.toString(),
      }),
      ...(request.startDate && { startDate: request.startDate.toISOString() }),
      ...(request.endDate && { endDate: request.endDate.toISOString() }),
      ...(request.minResponseTime && {
        minResponseTime: request.minResponseTime.toString(),
      }),
      ...(request.maxResponseTime && {
        maxResponseTime: request.maxResponseTime.toString(),
      }),
    }

    return this.client
      .get('analytics/logs', {
        searchParams,
      })
      .json()
  }

  async getTopEndpoints(apiId: string): Promise<GetTopEndpointsResponse> {
    return this.client
      .get('analytics/top-endpoints', {
        searchParams: { apiId },
      })
      .json()
  }

  async getEndpointStats(
    endpointId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<{
    totalRequests: number
    avgResponseTime: number
    errorRate: number
    statusCodeDistribution: Record<number, number>
  }> {
    return this.client
      .get(`analytics/endpoints/${endpointId}/stats`, {
        searchParams: {
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
        },
      })
      .json()
  }

  async listAlertRules(workspaceId: string): Promise<AlertRule[]> {
    return this.client
      .get('analytics/alert-rules', {
        searchParams: { workspaceId },
      })
      .json()
  }

  async getAlertRule(id: string): Promise<AlertRule> {
    return this.client.get(`analytics/alert-rules/${id}`).json()
  }

  async createAlertRule(data: CreateAlertRuleDto): Promise<AlertRule> {
    return this.client.post('analytics/alert-rules', { json: data }).json()
  }

  async updateAlertRule(
    id: string,
    data: UpdateAlertRuleDto,
  ): Promise<AlertRule> {
    return this.client
      .patch(`analytics/alert-rules/${id}`, { json: data })
      .json()
  }

  async deleteAlertRule(id: string): Promise<void> {
    await this.client.delete(`analytics/alert-rules/${id}`).json()
  }

  async listAlerts(ruleId?: string): Promise<Alert[]> {
    return this.client
      .get('analytics/alerts', {
        searchParams: ruleId ? { ruleId } : {},
      })
      .json()
  }

  async acknowledgeAlert(id: string): Promise<Alert> {
    return this.client.patch(`analytics/alerts/${id}/acknowledge`).json()
  }
}

export { AnalyticsModule }
