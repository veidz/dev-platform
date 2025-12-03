import type { Prisma, PrismaClient, RequestLog } from '@prisma/client'
import { DeepMockProxy, mockDeep } from 'jest-mock-extended'

import { faker } from '@/__mocks__/faker-adapter'
import { RequestLogRepository } from '@/repositories/analytics'

const createMockRequestLog = (
  overrides: Partial<RequestLog> = {},
): RequestLog => ({
  id: faker.string.nanoid(),
  endpointId: faker.string.nanoid(),
  method: 'GET',
  path: '/test',
  statusCode: 200,
  responseTimeMs: faker.number.int({ min: 10, max: 1000 }),
  requestHeaders: {},
  requestBody: null,
  responseHeaders: {},
  responseBody: { success: true },
  ipAddress: '192.168.1.1',
  userAgent: 'Mozilla/5.0',
  timestamp: faker.date.recent(),
  ...overrides,
})

describe('RequestLogRepository', () => {
  let repository: RequestLogRepository
  let prismaMock: DeepMockProxy<PrismaClient>

  beforeEach(() => {
    prismaMock = mockDeep<PrismaClient>()
    repository = new RequestLogRepository(prismaMock)
    jest.clearAllMocks()
  })

  describe('findByEndpointId', () => {
    it('should find request logs by endpoint id', async () => {
      const endpointId = faker.string.nanoid()
      const mockLogs = [
        createMockRequestLog({ endpointId }),
        createMockRequestLog({ endpointId }),
      ]
      prismaMock.requestLog.findMany.mockResolvedValue(mockLogs)

      const result = await repository.findByEndpointId(endpointId)

      expect(result).toEqual(mockLogs)
      expect(prismaMock.requestLog.findMany).toHaveBeenCalledWith({
        where: { endpointId },
        orderBy: { timestamp: 'desc' },
      })
    })
  })

  describe('findByDateRange', () => {
    it('should find request logs within a date range', async () => {
      const endpointId = faker.string.nanoid()
      const startDate = faker.date.past()
      const endDate = faker.date.recent()
      const mockLogs = [createMockRequestLog({ endpointId })]
      prismaMock.requestLog.findMany.mockResolvedValue(mockLogs)

      const result = await repository.findByDateRange(
        endpointId,
        startDate,
        endDate,
      )

      expect(result).toEqual(mockLogs)
      expect(prismaMock.requestLog.findMany).toHaveBeenCalledWith({
        where: {
          endpointId,
          timestamp: { gte: startDate, lte: endDate },
        },
        orderBy: { timestamp: 'desc' },
      })
    })
  })

  describe('findByStatusCode', () => {
    it('should find request logs by status code', async () => {
      const mockLogs = [createMockRequestLog({ statusCode: 500 })]
      prismaMock.requestLog.findMany.mockResolvedValue(mockLogs)

      const result = await repository.findByStatusCode(500)

      expect(result).toEqual(mockLogs)
      expect(prismaMock.requestLog.findMany).toHaveBeenCalledWith({
        where: { statusCode: 500 },
        orderBy: { timestamp: 'desc' },
      })
    })
  })

  describe('findRecentLogs', () => {
    it('should find recent logs with limit', async () => {
      const endpointId = faker.string.nanoid()
      const mockLogs = [createMockRequestLog({ endpointId })]
      prismaMock.requestLog.findMany.mockResolvedValue(mockLogs)

      const result = await repository.findRecentLogs(endpointId, 10)

      expect(result).toEqual(mockLogs)
      expect(prismaMock.requestLog.findMany).toHaveBeenCalledWith({
        where: { endpointId },
        orderBy: { timestamp: 'desc' },
        take: 10,
      })
    })
  })

  describe('countByEndpointAndDateRange', () => {
    it('should count logs in date range', async () => {
      const startDate = faker.date.past()
      const endDate = faker.date.recent()
      prismaMock.requestLog.count.mockResolvedValue(100)

      const result = await repository.countByEndpointAndDateRange(
        'endpoint-id',
        startDate,
        endDate,
      )

      expect(result).toBe(100)
      expect(prismaMock.requestLog.count).toHaveBeenCalledWith({
        where: {
          endpointId: 'endpoint-id',
          timestamp: { gte: startDate, lte: endDate },
        },
      })
    })
  })

  describe('deleteOlderThan', () => {
    it('should delete logs older than date', async () => {
      const date = faker.date.past()
      const batchPayload: Prisma.BatchPayload = { count: 50 }
      prismaMock.requestLog.deleteMany.mockResolvedValue(batchPayload)

      const result = await repository.deleteOlderThan(date)

      expect(result).toEqual(batchPayload)
      expect(prismaMock.requestLog.deleteMany).toHaveBeenCalledWith({
        where: { timestamp: { lt: date } },
      })
    })
  })

  describe('deleteByEndpointId', () => {
    it('should delete all logs for an endpoint', async () => {
      const batchPayload: Prisma.BatchPayload = { count: 20 }
      prismaMock.requestLog.deleteMany.mockResolvedValue(batchPayload)

      const result = await repository.deleteByEndpointId('endpoint-id')

      expect(result).toEqual(batchPayload)
      expect(prismaMock.requestLog.deleteMany).toHaveBeenCalledWith({
        where: { endpointId: 'endpoint-id' },
      })
    })
  })

  describe('inherited methods', () => {
    it('should create a request log', async () => {
      const mockLog = createMockRequestLog()
      prismaMock.requestLog.create.mockResolvedValue(mockLog)

      const result = await repository.create({
        endpoint: { connect: { id: mockLog.endpointId } },
        method: mockLog.method,
        path: mockLog.path,
        statusCode: mockLog.statusCode,
        responseTimeMs: mockLog.responseTimeMs,
        requestHeaders: mockLog.requestHeaders as Prisma.InputJsonValue,
        responseHeaders: mockLog.responseHeaders as Prisma.InputJsonValue,
        responseBody: mockLog.responseBody as Prisma.InputJsonValue,
        ipAddress: mockLog.ipAddress,
        timestamp: mockLog.timestamp,
      })

      expect(result).toEqual(mockLog)
      expect(prismaMock.requestLog.create).toHaveBeenCalled()
    })

    it('should find a request log by id', async () => {
      const mockLog = createMockRequestLog()
      prismaMock.requestLog.findUnique.mockResolvedValue(mockLog)

      const result = await repository.findById(mockLog.id)

      expect(result).toEqual(mockLog)
      expect(prismaMock.requestLog.findUnique).toHaveBeenCalledWith({
        where: { id: mockLog.id },
      })
    })
  })
})
