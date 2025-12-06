import type { Mock, Prisma } from '@prisma/client'

import { faker } from '@/__mocks__/faker-adapter'
import { MockRepository } from '@/repositories/mock'
import {
  createPrismaClientMock,
  mockMockModel,
  PrismaClientMock,
} from '@/tests/repositories/__mocks__'

type SutTypes = {
  sut: MockRepository
  prismaClientMock: PrismaClientMock
}

const makeSut = (): SutTypes => {
  const prismaClientMock = createPrismaClientMock()
  const sut = new MockRepository(prismaClientMock)
  return {
    sut,
    prismaClientMock,
  }
}

describe('MockRepository', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('findByEndpointId', () => {
    it('should find mocks by endpoint id', async () => {
      const { sut, prismaClientMock } = makeSut()
      const endpointId = faker.string.nanoid()
      const mockMocks = [
        mockMockModel({ endpointId }),
        mockMockModel({ endpointId }),
      ]
      prismaClientMock.mock.findMany.mockResolvedValue(mockMocks)

      const result = await sut.findByEndpointId(endpointId)

      expect(result).toEqual(mockMocks)
      expect(prismaClientMock.mock.findMany).toHaveBeenCalledWith({
        where: { endpointId },
        orderBy: { createdAt: 'desc' },
      })
    })
  })

  describe('findEnabledByEndpoint', () => {
    it('should find enabled mocks by endpoint', async () => {
      const { sut, prismaClientMock } = makeSut()
      const endpointId = faker.string.nanoid()
      const mockMocks = [mockMockModel({ endpointId, enabled: true })]
      prismaClientMock.mock.findMany.mockResolvedValue(mockMocks)

      const result = await sut.findEnabledByEndpoint(endpointId)

      expect(result).toEqual(mockMocks)
      expect(prismaClientMock.mock.findMany).toHaveBeenCalledWith({
        where: { endpointId, enabled: true },
        orderBy: { createdAt: 'desc' },
      })
    })
  })

  describe('findWithEndpoint', () => {
    it('should find a mock with its endpoint', async () => {
      const { sut, prismaClientMock } = makeSut()
      const mockMock = mockMockModel()
      const mockWithEndpoint = {
        ...mockMock,
        endpoint: { id: mockMock.endpointId, path: '/test' },
      }

      prismaClientMock.mock.findUnique.mockResolvedValue(
        mockWithEndpoint as unknown as Mock,
      )

      const result = await sut.findWithEndpoint(mockMock.id)

      expect(result).toEqual(mockWithEndpoint)
      expect(prismaClientMock.mock.findUnique).toHaveBeenCalledWith({
        where: { id: mockMock.id },
        include: { endpoint: true },
      })
    })
  })

  describe('findWithScenarios', () => {
    it('should find a mock with its scenarios', async () => {
      const { sut, prismaClientMock } = makeSut()
      const mockMock = mockMockModel()
      const mockWithScenarios = {
        ...mockMock,
        scenarios: [{ id: faker.string.nanoid() }],
      }

      prismaClientMock.mock.findUnique.mockResolvedValue(
        mockWithScenarios as unknown as Mock,
      )

      const result = await sut.findWithScenarios(mockMock.id)

      expect(result).toEqual(mockWithScenarios)
      expect(prismaClientMock.mock.findUnique).toHaveBeenCalledWith({
        where: { id: mockMock.id },
        include: { scenarios: true },
      })
    })
  })

  describe('toggleEnabled', () => {
    it('should toggle mock enabled status', async () => {
      const { sut, prismaClientMock } = makeSut()
      const mockMock = mockMockModel({ enabled: false })
      prismaClientMock.mock.update.mockResolvedValue(mockMock)

      const result = await sut.toggleEnabled(mockMock.id, false)

      expect(result).toEqual(mockMock)
      expect(prismaClientMock.mock.update).toHaveBeenCalledWith({
        where: { id: mockMock.id },
        data: { enabled: false },
      })
    })
  })

  describe('updateResponse', () => {
    it('should update mock response', async () => {
      const { sut, prismaClientMock } = makeSut()
      const mockMock = mockMockModel()
      prismaClientMock.mock.update.mockResolvedValue(mockMock)

      const result = await sut.updateResponse(
        mockMock.id,
        201,
        { 'Content-Type': 'application/json' },
        { data: 'updated' },
      )

      expect(result).toEqual(mockMock)
      expect(prismaClientMock.mock.update).toHaveBeenCalledWith({
        where: { id: mockMock.id },
        data: {
          statusCode: 201,
          headers: { 'Content-Type': 'application/json' },
          body: { data: 'updated' },
        },
      })
    })
  })

  describe('countByEndpoint', () => {
    it('should count mocks by endpoint', async () => {
      const { sut, prismaClientMock } = makeSut()
      prismaClientMock.mock.count.mockResolvedValue(5)

      const result = await sut.countByEndpoint('endpoint-id')

      expect(result).toBe(5)
      expect(prismaClientMock.mock.count).toHaveBeenCalledWith({
        where: { endpointId: 'endpoint-id' },
      })
    })
  })

  describe('deleteByEndpointId', () => {
    it('should delete all mocks from an endpoint', async () => {
      const { sut, prismaClientMock } = makeSut()
      const batchPayload: Prisma.BatchPayload = { count: 3 }
      prismaClientMock.mock.deleteMany.mockResolvedValue(batchPayload)

      const result = await sut.deleteByEndpointId('endpoint-id')

      expect(result).toEqual(batchPayload)
      expect(prismaClientMock.mock.deleteMany).toHaveBeenCalledWith({
        where: { endpointId: 'endpoint-id' },
      })
    })
  })

  describe('inherited methods', () => {
    it('should find mock by id', async () => {
      const { sut, prismaClientMock } = makeSut()
      const mockMock = mockMockModel()
      prismaClientMock.mock.findUnique.mockResolvedValue(mockMock)

      const result = await sut.findById(mockMock.id)

      expect(result).toEqual(mockMock)
    })

    it('should delete a mock', async () => {
      const { sut, prismaClientMock } = makeSut()
      const mockMock = mockMockModel()
      prismaClientMock.mock.delete.mockResolvedValue(mockMock)

      const result = await sut.delete(mockMock.id)

      expect(result).toEqual(mockMock)
    })
  })
})
