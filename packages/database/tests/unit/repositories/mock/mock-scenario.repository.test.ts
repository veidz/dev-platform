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
})
