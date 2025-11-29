import type {
  Alert,
  AlertRule,
  CreateAlertRuleDto,
  Metric,
  MetricAggregation,
  RequestLog,
  UpdateAlertRuleDto,
} from '@dev-platform/types'
import { AlertRuleType, AlertSeverity } from '@dev-platform/types'
import { describe, expect, it } from '@jest/globals'
import { mockDeep } from 'jest-mock-extended'

import { faker } from '@/__mocks__/faker-adapter'
import type { BaseClient } from '@/client/http'
import { AnalyticsModule } from '@/modules/analytics/analytics'
import type {
  GetLogsResponse,
  GetMetricsResponse,
  GetTopEndpointsResponse,
  TopEndpoint,
} from '@/modules/analytics/analytics.types'

describe('AnalyticsModule', () => {
  const mockClient = mockDeep<BaseClient>()
  const analyticsModule = new AnalyticsModule(mockClient)

  const createMockMetric = (overrides?: Partial<Metric>): Metric => ({
    id: faker.string.uuid(),
    endpointId: faker.string.uuid(),
    name: 'response_time',
    value: faker.number.int({ min: 10, max: 1000 }),
    unit: 'ms',
    timestamp: faker.date.recent(),
    ...overrides,
  })

  const createMockMetricAggregation = (
    overrides?: Partial<MetricAggregation>,
  ): MetricAggregation => ({
    period: 'hour',
    avg: faker.number.int({ min: 50, max: 500 }),
    min: faker.number.int({ min: 10, max: 50 }),
    max: faker.number.int({ min: 500, max: 2000 }),
    count: faker.number.int({ min: 1, max: 100 }),
    ...overrides,
  })

  const createMockRequestLog = (
    overrides?: Partial<RequestLog>,
  ): RequestLog => ({
    id: faker.string.uuid(),
    endpointId: faker.string.uuid(),
    method: 'GET',
    path: '/users',
    statusCode: 200,
    responseTimeMs: faker.number.int({ min: 10, max: 500 }),
    requestHeaders: { 'Content-Type': 'application/json' },
    responseHeaders: { 'Content-Type': 'application/json' },
    ipAddress: '192.168.1.1',
    userAgent: 'Mozilla/5.0',
    timestamp: faker.date.recent(),
    ...overrides,
  })

  const createMockAlertRule = (overrides?: Partial<AlertRule>): AlertRule => ({
    id: faker.string.uuid(),
    workspaceId: faker.string.uuid(),
    name: 'High Error Rate',
    description: faker.lorem.sentence(),
    type: AlertRuleType.ERROR_RATE,
    condition: { threshold: 0.05 },
    threshold: 0.05,
    severity: AlertSeverity.WARNING,
    enabled: true,
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent(),
    ...overrides,
  })

  const createMockAlert = (overrides?: Partial<Alert>): Alert => ({
    id: faker.string.uuid(),
    ruleId: faker.string.uuid(),
    severity: AlertSeverity.WARNING,
    message: faker.lorem.sentence(),
    triggered: true,
    createdAt: faker.date.recent(),
    ...overrides,
  })

  const createMockTopEndpoint = (
    overrides?: Partial<TopEndpoint>,
  ): TopEndpoint => ({
    endpointId: faker.string.uuid(),
    path: '/users',
    method: 'GET',
    requestCount: faker.number.int({ min: 100, max: 10000 }),
    avgResponseTime: faker.number.int({ min: 50, max: 500 }),
    errorRate: faker.number.int({ min: 0, max: 100 }) / 1000,
    ...overrides,
  })

  describe('getMetrics', () => {
    it('should get metrics with required params', async () => {
      const startDate = new Date('2025-01-01')
      const endDate = new Date('2025-01-31')
      const mockResponse: GetMetricsResponse = {
        metrics: [createMockMetric(), createMockMetric()],
        aggregations: [createMockMetricAggregation()],
      }

      mockClient.get.mockReturnValue({
        json: () => Promise.resolve(mockResponse),
      } as never)

      const result = await analyticsModule.getMetrics({ startDate, endDate })

      expect(mockClient.get).toHaveBeenCalledWith('analytics/metrics', {
        searchParams: {
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
        },
      })
      expect(result).toEqual(mockResponse)
      expect(result.metrics).toHaveLength(2)
    })

    it('should get metrics with all filters', async () => {
      const apiId = faker.string.uuid()
      const endpointId = faker.string.uuid()
      const startDate = new Date('2025-01-01')
      const endDate = new Date('2025-01-31')
      const mockResponse: GetMetricsResponse = {
        metrics: [createMockMetric({ endpointId })],
        aggregations: [createMockMetricAggregation({ period: 'day' })],
      }

      mockClient.get.mockReturnValue({
        json: () => Promise.resolve(mockResponse),
      } as never)

      const result = await analyticsModule.getMetrics({
        apiId,
        endpointId,
        startDate,
        endDate,
        metric: 'response_time',
        period: 'day',
      })

      expect(mockClient.get).toHaveBeenCalledWith('analytics/metrics', {
        searchParams: {
          apiId,
          endpointId,
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
          metric: 'response_time',
          period: 'day',
        },
      })
      expect(result.metrics[0].endpointId).toBe(endpointId)
      expect(result.aggregations[0].period).toBe('day')
    })
  })

  describe('getLogs', () => {
    it('should get logs without filters', async () => {
      const mockResponse: GetLogsResponse = {
        logs: [createMockRequestLog(), createMockRequestLog()],
        total: 2,
        page: 1,
        limit: 50,
      }

      mockClient.get.mockReturnValue({
        json: () => Promise.resolve(mockResponse),
      } as never)

      const result = await analyticsModule.getLogs({})

      expect(mockClient.get).toHaveBeenCalledWith('analytics/logs', {
        searchParams: {},
      })
      expect(result).toEqual(mockResponse)
      expect(result.logs).toHaveLength(2)
    })

    it('should get logs with pagination', async () => {
      const mockResponse: GetLogsResponse = {
        logs: [createMockRequestLog()],
        total: 100,
        page: 2,
        limit: 10,
      }

      mockClient.get.mockReturnValue({
        json: () => Promise.resolve(mockResponse),
      } as never)

      const result = await analyticsModule.getLogs({ page: 2, limit: 10 })

      expect(mockClient.get).toHaveBeenCalledWith('analytics/logs', {
        searchParams: {
          page: '2',
          limit: '10',
        },
      })
      expect(result.page).toBe(2)
      expect(result.limit).toBe(10)
    })

    it('should get logs with all filters', async () => {
      const endpointId = faker.string.uuid()
      const startDate = new Date('2025-01-01')
      const endDate = new Date('2025-01-31')
      const mockResponse: GetLogsResponse = {
        logs: [
          createMockRequestLog({
            endpointId,
            method: 'POST',
            statusCode: 404,
            responseTimeMs: 250,
          }),
        ],
        total: 1,
        page: 1,
        limit: 50,
      }

      mockClient.get.mockReturnValue({
        json: () => Promise.resolve(mockResponse),
      } as never)

      const result = await analyticsModule.getLogs({
        endpointId,
        method: 'POST',
        statusCode: 404,
        startDate,
        endDate,
        minResponseTime: 100,
        maxResponseTime: 500,
      })

      expect(mockClient.get).toHaveBeenCalledWith('analytics/logs', {
        searchParams: {
          endpointId,
          method: 'POST',
          statusCode: '404',
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
          minResponseTime: '100',
          maxResponseTime: '500',
        },
      })
      expect(result.logs[0].endpointId).toBe(endpointId)
      expect(result.logs[0].method).toBe('POST')
      expect(result.logs[0].statusCode).toBe(404)
    })
  })

  describe('getTopEndpoints', () => {
    it('should get top endpoints for an API', async () => {
      const apiId = faker.string.uuid()
      const mockResponse: GetTopEndpointsResponse = {
        endpoints: [
          createMockTopEndpoint({ path: '/users', requestCount: 5000 }),
          createMockTopEndpoint({ path: '/posts', requestCount: 3000 }),
          createMockTopEndpoint({ path: '/comments', requestCount: 1000 }),
        ],
      }

      mockClient.get.mockReturnValue({
        json: () => Promise.resolve(mockResponse),
      } as never)

      const result = await analyticsModule.getTopEndpoints(apiId)

      expect(mockClient.get).toHaveBeenCalledWith('analytics/top-endpoints', {
        searchParams: { apiId },
      })
      expect(result).toEqual(mockResponse)
      expect(result.endpoints).toHaveLength(3)
      expect(result.endpoints[0].requestCount).toBe(5000)
    })

    it('should return empty array when no endpoints', async () => {
      const apiId = faker.string.uuid()
      const mockResponse: GetTopEndpointsResponse = {
        endpoints: [],
      }

      mockClient.get.mockReturnValue({
        json: () => Promise.resolve(mockResponse),
      } as never)

      const result = await analyticsModule.getTopEndpoints(apiId)

      expect(result.endpoints).toHaveLength(0)
    })
  })

  describe('getEndpointStats', () => {
    it('should get endpoint statistics', async () => {
      const endpointId = faker.string.uuid()
      const startDate = new Date('2025-01-01')
      const endDate = new Date('2025-01-31')
      const mockResponse = {
        totalRequests: 10000,
        avgResponseTime: 150,
        errorRate: 0.02,
        statusCodeDistribution: {
          200: 9500,
          404: 300,
          500: 200,
        },
      }

      mockClient.get.mockReturnValue({
        json: () => Promise.resolve(mockResponse),
      } as never)

      const result = await analyticsModule.getEndpointStats(
        endpointId,
        startDate,
        endDate,
      )

      expect(mockClient.get).toHaveBeenCalledWith(
        `analytics/endpoints/${endpointId}/stats`,
        {
          searchParams: {
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString(),
          },
        },
      )
      expect(result).toEqual(mockResponse)
      expect(result.totalRequests).toBe(10000)
      expect(result.avgResponseTime).toBe(150)
      expect(result.errorRate).toBe(0.02)
    })
  })

  describe('listAlertRules', () => {
    it('should list alert rules for workspace', async () => {
      const workspaceId = faker.string.uuid()
      const mockResponse = [
        createMockAlertRule({ workspaceId, name: 'High Error Rate' }),
        createMockAlertRule({ workspaceId, name: 'Slow Response Time' }),
      ]

      mockClient.get.mockReturnValue({
        json: () => Promise.resolve(mockResponse),
      } as never)

      const result = await analyticsModule.listAlertRules(workspaceId)

      expect(mockClient.get).toHaveBeenCalledWith('analytics/alert-rules', {
        searchParams: { workspaceId },
      })
      expect(result).toEqual(mockResponse)
      expect(result).toHaveLength(2)
    })

    it('should return empty array when no rules', async () => {
      const workspaceId = faker.string.uuid()
      const mockResponse: AlertRule[] = []

      mockClient.get.mockReturnValue({
        json: () => Promise.resolve(mockResponse),
      } as never)

      const result = await analyticsModule.listAlertRules(workspaceId)

      expect(result).toHaveLength(0)
    })
  })

  describe('getAlertRule', () => {
    it('should get alert rule by id', async () => {
      const mockResponse = createMockAlertRule()

      mockClient.get.mockReturnValue({
        json: () => Promise.resolve(mockResponse),
      } as never)

      const result = await analyticsModule.getAlertRule(mockResponse.id)

      expect(mockClient.get).toHaveBeenCalledWith(
        `analytics/alert-rules/${mockResponse.id}`,
      )
      expect(result).toEqual(mockResponse)
    })
  })

  describe('createAlertRule', () => {
    it('should create alert rule with minimal data', async () => {
      const createDto: CreateAlertRuleDto = {
        workspaceId: faker.string.uuid(),
        name: 'High Error Rate',
        type: AlertRuleType.ERROR_RATE,
        condition: { threshold: 0.05 },
        severity: AlertSeverity.WARNING,
      }
      const mockResponse = createMockAlertRule(createDto)

      mockClient.post.mockReturnValue({
        json: () => Promise.resolve(mockResponse),
      } as never)

      const result = await analyticsModule.createAlertRule(createDto)

      expect(mockClient.post).toHaveBeenCalledWith('analytics/alert-rules', {
        json: createDto,
      })
      expect(result).toEqual(mockResponse)
    })

    it('should create alert rule with all fields', async () => {
      const createDto: CreateAlertRuleDto = {
        workspaceId: faker.string.uuid(),
        name: 'Critical Error Rate',
        description: 'Alert when error rate exceeds 10%',
        type: AlertRuleType.ERROR_RATE,
        condition: { threshold: 0.1, window: '5m' },
        threshold: 0.1,
        severity: AlertSeverity.CRITICAL,
        webhookUrl: faker.internet.url(),
      }
      const mockResponse = createMockAlertRule(createDto)

      mockClient.post.mockReturnValue({
        json: () => Promise.resolve(mockResponse),
      } as never)

      const result = await analyticsModule.createAlertRule(createDto)

      expect(result).toEqual(mockResponse)
      expect(result.webhookUrl).toBe(createDto.webhookUrl)
      expect(result.description).toBe(createDto.description)
    })
  })

  describe('updateAlertRule', () => {
    it('should update alert rule name', async () => {
      const id = faker.string.uuid()
      const updateDto: UpdateAlertRuleDto = {
        name: 'Updated Alert Name',
      }
      const mockResponse = createMockAlertRule({ id, ...updateDto })

      mockClient.patch.mockReturnValue({
        json: () => Promise.resolve(mockResponse),
      } as never)

      const result = await analyticsModule.updateAlertRule(id, updateDto)

      expect(mockClient.patch).toHaveBeenCalledWith(
        `analytics/alert-rules/${id}`,
        {
          json: updateDto,
        },
      )
      expect(result.name).toBe('Updated Alert Name')
    })

    it('should update alert rule threshold and severity', async () => {
      const id = faker.string.uuid()
      const updateDto: UpdateAlertRuleDto = {
        threshold: 0.15,
        severity: AlertSeverity.CRITICAL,
      }
      const mockResponse = createMockAlertRule({ id, ...updateDto })

      mockClient.patch.mockReturnValue({
        json: () => Promise.resolve(mockResponse),
      } as never)

      const result = await analyticsModule.updateAlertRule(id, updateDto)

      expect(result.threshold).toBe(0.15)
      expect(result.severity).toBe(AlertSeverity.CRITICAL)
    })

    it('should disable alert rule', async () => {
      const id = faker.string.uuid()
      const updateDto: UpdateAlertRuleDto = {
        enabled: false,
      }
      const mockResponse = createMockAlertRule({ id, enabled: false })

      mockClient.patch.mockReturnValue({
        json: () => Promise.resolve(mockResponse),
      } as never)

      const result = await analyticsModule.updateAlertRule(id, updateDto)

      expect(result.enabled).toBe(false)
    })
  })

  describe('deleteAlertRule', () => {
    it('should delete alert rule', async () => {
      const id = faker.string.uuid()

      mockClient.delete.mockReturnValue({
        json: () => Promise.resolve(),
      } as never)

      await analyticsModule.deleteAlertRule(id)

      expect(mockClient.delete).toHaveBeenCalledWith(
        `analytics/alert-rules/${id}`,
      )
    })
  })
})
