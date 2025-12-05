import type { Mock, PrismaClient } from '@prisma/client'
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
})
