import type { Prisma } from '@prisma/client'

import { faker } from '@/__mocks__/faker-adapter'
import { RequestLogRepository } from '@/repositories/analytics'
import {
  createPrismaClientMock,
  mockRequestLogModel,
  PrismaClientMock,
} from '@/tests/repositories/__mocks__'

type SutTypes = {
  sut: RequestLogRepository
  prismaClientMock: PrismaClientMock
}

const makeSut = (): SutTypes => {
  const prismaClientMock = createPrismaClientMock()
  const sut = new RequestLogRepository(prismaClientMock)
  return {
    sut,
    prismaClientMock,
  }
}

describe('RequestLogRepository', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('findByEndpointId', () => {
    it('should find request logs by endpoint id', async () => {
      const { sut, prismaClientMock } = makeSut()
      const endpointId = faker.string.nanoid()
      const mockLogs = [
        mockRequestLogModel({ endpointId }),
        mockRequestLogModel({ endpointId }),
      ]
      prismaClientMock.requestLog.findMany.mockResolvedValue(mockLogs)

      const result = await sut.findByEndpointId(endpointId)

      expect(result).toEqual(mockLogs)
      expect(prismaClientMock.requestLog.findMany).toHaveBeenCalledWith({
        where: { endpointId },
        orderBy: { timestamp: 'desc' },
      })
    })
  })

  describe('findByDateRange', () => {
    it('should find request logs within a date range', async () => {
      const { sut, prismaClientMock } = makeSut()
      const endpointId = faker.string.nanoid()
      const startDate = faker.date.past()
      const endDate = faker.date.recent()
      const mockLogs = [mockRequestLogModel({ endpointId })]
      prismaClientMock.requestLog.findMany.mockResolvedValue(mockLogs)

      const result = await sut.findByDateRange(endpointId, startDate, endDate)

      expect(result).toEqual(mockLogs)
      expect(prismaClientMock.requestLog.findMany).toHaveBeenCalledWith({
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
      const { sut, prismaClientMock } = makeSut()
      const mockLogs = [mockRequestLogModel({ statusCode: 500 })]
      prismaClientMock.requestLog.findMany.mockResolvedValue(mockLogs)

      const result = await sut.findByStatusCode(500)

      expect(result).toEqual(mockLogs)
      expect(prismaClientMock.requestLog.findMany).toHaveBeenCalledWith({
        where: { statusCode: 500 },
        orderBy: { timestamp: 'desc' },
      })
    })
  })

  describe('findRecentLogs', () => {
    it('should find recent logs with limit', async () => {
      const { sut, prismaClientMock } = makeSut()
      const endpointId = faker.string.nanoid()
      const mockLogs = [mockRequestLogModel({ endpointId })]
      prismaClientMock.requestLog.findMany.mockResolvedValue(mockLogs)

      const result = await sut.findRecentLogs(endpointId, 10)

      expect(result).toEqual(mockLogs)
      expect(prismaClientMock.requestLog.findMany).toHaveBeenCalledWith({
        where: { endpointId },
        orderBy: { timestamp: 'desc' },
        take: 10,
      })
    })
  })

  describe('countByEndpointAndDateRange', () => {
    it('should count logs in date range', async () => {
      const { sut, prismaClientMock } = makeSut()
      const startDate = faker.date.past()
      const endDate = faker.date.recent()
      prismaClientMock.requestLog.count.mockResolvedValue(100)

      const result = await sut.countByEndpointAndDateRange(
        'endpoint-id',
        startDate,
        endDate,
      )

      expect(result).toBe(100)
      expect(prismaClientMock.requestLog.count).toHaveBeenCalledWith({
        where: {
          endpointId: 'endpoint-id',
          timestamp: { gte: startDate, lte: endDate },
        },
      })
    })
  })

  describe('deleteOlderThan', () => {
    it('should delete logs older than date', async () => {
      const { sut, prismaClientMock } = makeSut()
      const date = faker.date.past()
      const batchPayload: Prisma.BatchPayload = { count: 50 }
      prismaClientMock.requestLog.deleteMany.mockResolvedValue(batchPayload)

      const result = await sut.deleteOlderThan(date)

      expect(result).toEqual(batchPayload)
      expect(prismaClientMock.requestLog.deleteMany).toHaveBeenCalledWith({
        where: { timestamp: { lt: date } },
      })
    })
  })

  describe('deleteByEndpointId', () => {
    it('should delete all logs for an endpoint', async () => {
      const { sut, prismaClientMock } = makeSut()
      const batchPayload: Prisma.BatchPayload = { count: 20 }
      prismaClientMock.requestLog.deleteMany.mockResolvedValue(batchPayload)

      const result = await sut.deleteByEndpointId('endpoint-id')

      expect(result).toEqual(batchPayload)
      expect(prismaClientMock.requestLog.deleteMany).toHaveBeenCalledWith({
        where: { endpointId: 'endpoint-id' },
      })
    })
  })

  describe('inherited methods', () => {
    it('should create a request log', async () => {
      const { sut, prismaClientMock } = makeSut()
      const mockLog = mockRequestLogModel()
      prismaClientMock.requestLog.create.mockResolvedValue(mockLog)

      const result = await sut.create({
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
      expect(prismaClientMock.requestLog.create).toHaveBeenCalled()
    })

    it('should find a request log by id', async () => {
      const { sut, prismaClientMock } = makeSut()
      const mockLog = mockRequestLogModel()
      prismaClientMock.requestLog.findUnique.mockResolvedValue(mockLog)

      const result = await sut.findById(mockLog.id)

      expect(result).toEqual(mockLog)
      expect(prismaClientMock.requestLog.findUnique).toHaveBeenCalledWith({
        where: { id: mockLog.id },
      })
    })
  })
})
