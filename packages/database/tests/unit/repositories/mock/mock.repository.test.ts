import type { Mock, Prisma, PrismaClient } from '@prisma/client'
import { DeepMockProxy, mockDeep } from 'jest-mock-extended'

import { faker } from '@/__mocks__/faker-adapter'
import { MockRepository } from '@/repositories/mock'

const createMockMock = (overrides: Partial<Mock> = {}): Mock => ({
  id: faker.string.nanoid(),
  endpointId: faker.string.nanoid(),
  name: faker.lorem.word(),
  description: faker.lorem.sentence(),
  statusCode: 200,
  headers: {},
  body: { message: 'success' },
  delayType: 'NONE',
  delayMs: null,
  delayMinMs: null,
  delayMaxMs: null,
  enabled: true,
  createdAt: faker.date.past(),
  updatedAt: faker.date.recent(),
  ...overrides,
})

describe('MockRepository', () => {
  let repository: MockRepository
  let prismaMock: DeepMockProxy<PrismaClient>

  beforeEach(() => {
    prismaMock = mockDeep<PrismaClient>()
    repository = new MockRepository(prismaMock)
    jest.clearAllMocks()
  })

  describe('findByEndpointId', () => {
    it('should find mocks by endpoint id', async () => {
      const endpointId = faker.string.nanoid()
      const mockMocks = [
        createMockMock({ endpointId }),
        createMockMock({ endpointId }),
      ]
      prismaMock.mock.findMany.mockResolvedValue(mockMocks)

      const result = await repository.findByEndpointId(endpointId)

      expect(result).toEqual(mockMocks)
      expect(prismaMock.mock.findMany).toHaveBeenCalledWith({
        where: { endpointId },
        orderBy: { createdAt: 'desc' },
      })
    })
  })

  describe('findEnabledByEndpoint', () => {
    it('should find enabled mocks by endpoint', async () => {
      const endpointId = faker.string.nanoid()
      const mockMocks = [createMockMock({ endpointId, enabled: true })]
      prismaMock.mock.findMany.mockResolvedValue(mockMocks)

      const result = await repository.findEnabledByEndpoint(endpointId)

      expect(result).toEqual(mockMocks)
      expect(prismaMock.mock.findMany).toHaveBeenCalledWith({
        where: { endpointId, enabled: true },
        orderBy: { createdAt: 'desc' },
      })
    })
  })

  describe('findWithEndpoint', () => {
    it('should find a mock with its endpoint', async () => {
      const mockMock = createMockMock()
      const mockWithEndpoint = {
        ...mockMock,
        endpoint: { id: mockMock.endpointId, path: '/test' },
      }

      prismaMock.mock.findUnique.mockResolvedValue(
        mockWithEndpoint as unknown as Mock,
      )

      const result = await repository.findWithEndpoint(mockMock.id)

      expect(result).toEqual(mockWithEndpoint)
      expect(prismaMock.mock.findUnique).toHaveBeenCalledWith({
        where: { id: mockMock.id },
        include: { endpoint: true },
      })
    })
  })

  describe('findWithScenarios', () => {
    it('should find a mock with its scenarios', async () => {
      const mockMock = createMockMock()
      const mockWithScenarios = {
        ...mockMock,
        scenarios: [{ id: faker.string.nanoid() }],
      }

      prismaMock.mock.findUnique.mockResolvedValue(
        mockWithScenarios as unknown as Mock,
      )

      const result = await repository.findWithScenarios(mockMock.id)

      expect(result).toEqual(mockWithScenarios)
      expect(prismaMock.mock.findUnique).toHaveBeenCalledWith({
        where: { id: mockMock.id },
        include: { scenarios: true },
      })
    })
  })

  describe('toggleEnabled', () => {
    it('should toggle mock enabled status', async () => {
      const mockMock = createMockMock({ enabled: false })
      prismaMock.mock.update.mockResolvedValue(mockMock)

      const result = await repository.toggleEnabled(mockMock.id, false)

      expect(result).toEqual(mockMock)
      expect(prismaMock.mock.update).toHaveBeenCalledWith({
        where: { id: mockMock.id },
        data: { enabled: false },
      })
    })
  })

  describe('updateResponse', () => {
    it('should update mock response', async () => {
      const mockMock = createMockMock()
      prismaMock.mock.update.mockResolvedValue(mockMock)

      const result = await repository.updateResponse(
        mockMock.id,
        201,
        { 'Content-Type': 'application/json' },
        { data: 'updated' },
      )

      expect(result).toEqual(mockMock)
      expect(prismaMock.mock.update).toHaveBeenCalledWith({
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
      prismaMock.mock.count.mockResolvedValue(5)

      const result = await repository.countByEndpoint('endpoint-id')

      expect(result).toBe(5)
      expect(prismaMock.mock.count).toHaveBeenCalledWith({
        where: { endpointId: 'endpoint-id' },
      })
    })
  })

  describe('deleteByEndpointId', () => {
    it('should delete all mocks from an endpoint', async () => {
      const batchPayload: Prisma.BatchPayload = { count: 3 }
      prismaMock.mock.deleteMany.mockResolvedValue(batchPayload)

      const result = await repository.deleteByEndpointId('endpoint-id')

      expect(result).toEqual(batchPayload)
      expect(prismaMock.mock.deleteMany).toHaveBeenCalledWith({
        where: { endpointId: 'endpoint-id' },
      })
    })
  })

  describe('inherited methods', () => {
    it('should find mock by id', async () => {
      const mockMock = createMockMock()
      prismaMock.mock.findUnique.mockResolvedValue(mockMock)

      const result = await repository.findById(mockMock.id)

      expect(result).toEqual(mockMock)
    })
  })
})
