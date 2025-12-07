import type { MockScenario, Prisma } from '@prisma/client'

import { faker } from '@/__mocks__/faker-adapter'
import { MockScenarioRepository } from '@/repositories/mock'
import {
  createPrismaClientMock,
  mockMockScenarioModel,
  PrismaClientMock,
} from '@/tests/repositories/__mocks__'

type SutTypes = {
  sut: MockScenarioRepository
  prismaClientMock: PrismaClientMock
}

const makeSut = (): SutTypes => {
  const prismaClientMock = createPrismaClientMock()
  const sut = new MockScenarioRepository(prismaClientMock)
  return {
    sut,
    prismaClientMock,
  }
}

describe('MockScenarioRepository', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('findByEndpointId', () => {
    it('should find scenarios by endpoint id', async () => {
      const { sut, prismaClientMock } = makeSut()
      const endpointId = faker.string.nanoid()
      const mockScenarios = [
        mockMockScenarioModel({ endpointId }),
        mockMockScenarioModel({ endpointId }),
      ]
      prismaClientMock.mockScenario.findMany.mockResolvedValue(mockScenarios)

      const result = await sut.findByEndpointId(endpointId)

      expect(result).toEqual(mockScenarios)
      expect(prismaClientMock.mockScenario.findMany).toHaveBeenCalledWith({
        where: { endpointId },
        orderBy: { createdAt: 'desc' },
      })
    })
  })

  describe('findActiveByEndpoint', () => {
    it('should find active scenarios by endpoint', async () => {
      const { sut, prismaClientMock } = makeSut()
      const endpointId = faker.string.nanoid()
      const mockScenarios = [
        mockMockScenarioModel({ endpointId, active: true }),
      ]
      prismaClientMock.mockScenario.findMany.mockResolvedValue(mockScenarios)

      const result = await sut.findActiveByEndpoint(endpointId)

      expect(result).toEqual(mockScenarios)
      expect(prismaClientMock.mockScenario.findMany).toHaveBeenCalledWith({
        where: { endpointId, active: true },
        orderBy: { createdAt: 'desc' },
      })
    })
  })

  describe('findByNameAndEndpoint', () => {
    it('should find a scenario by name and endpoint', async () => {
      const { sut, prismaClientMock } = makeSut()
      const mockScenario = mockMockScenarioModel()
      prismaClientMock.mockScenario.findUnique.mockResolvedValue(mockScenario)

      const result = await sut.findByNameAndEndpoint(
        mockScenario.name,
        mockScenario.endpointId,
      )

      expect(result).toEqual(mockScenario)
      expect(prismaClientMock.mockScenario.findUnique).toHaveBeenCalledWith({
        where: {
          endpointId_name: {
            endpointId: mockScenario.endpointId,
            name: mockScenario.name,
          },
        },
      })
    })
  })

  describe('findWithEndpoint', () => {
    it('should find a scenario with its endpoint', async () => {
      const { sut, prismaClientMock } = makeSut()
      const mockScenario = mockMockScenarioModel()
      const scenarioWithEndpoint = {
        ...mockScenario,
        endpoint: { id: mockScenario.endpointId },
      }

      prismaClientMock.mockScenario.findUnique.mockResolvedValue(
        scenarioWithEndpoint as unknown as MockScenario,
      )

      const result = await sut.findWithEndpoint(mockScenario.id)

      expect(result).toEqual(scenarioWithEndpoint)
      expect(prismaClientMock.mockScenario.findUnique).toHaveBeenCalledWith({
        where: { id: mockScenario.id },
        include: { endpoint: true },
      })
    })
  })

  describe('findWithMocks', () => {
    it('should find a scenario with its mocks', async () => {
      const { sut, prismaClientMock } = makeSut()
      const mockScenario = mockMockScenarioModel()
      const scenarioWithMocks = {
        ...mockScenario,
        mocks: [{ id: faker.string.nanoid() }],
      }

      prismaClientMock.mockScenario.findUnique.mockResolvedValue(
        scenarioWithMocks as unknown as MockScenario,
      )

      const result = await sut.findWithMocks(mockScenario.id)

      expect(result).toEqual(scenarioWithMocks)
      expect(prismaClientMock.mockScenario.findUnique).toHaveBeenCalledWith({
        where: { id: mockScenario.id },
        include: { mocks: true },
      })
    })
  })

  describe('toggleActive', () => {
    it('should toggle scenario active status', async () => {
      const { sut, prismaClientMock } = makeSut()
      const mockScenario = mockMockScenarioModel({ active: false })
      prismaClientMock.mockScenario.update.mockResolvedValue(mockScenario)

      const result = await sut.toggleActive(mockScenario.id, false)

      expect(result).toEqual(mockScenario)
      expect(prismaClientMock.mockScenario.update).toHaveBeenCalledWith({
        where: { id: mockScenario.id },
        data: { active: false },
      })
    })
  })

  describe('countByEndpoint', () => {
    it('should count scenarios by endpoint', async () => {
      const { sut, prismaClientMock } = makeSut()
      prismaClientMock.mockScenario.count.mockResolvedValue(3)

      const result = await sut.countByEndpoint('endpoint-id')

      expect(result).toBe(3)
      expect(prismaClientMock.mockScenario.count).toHaveBeenCalledWith({
        where: { endpointId: 'endpoint-id' },
      })
    })
  })

  describe('deleteByEndpointId', () => {
    it('should delete all scenarios from an endpoint', async () => {
      const { sut, prismaClientMock } = makeSut()
      const batchPayload: Prisma.BatchPayload = { count: 2 }
      prismaClientMock.mockScenario.deleteMany.mockResolvedValue(batchPayload)

      const result = await sut.deleteByEndpointId('endpoint-id')

      expect(result).toEqual(batchPayload)
      expect(prismaClientMock.mockScenario.deleteMany).toHaveBeenCalledWith({
        where: { endpointId: 'endpoint-id' },
      })
    })
  })
})
