import type {
  Alert,
  AlertRule,
  Metric,
  MetricAggregation,
  RequestLog,
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
})
