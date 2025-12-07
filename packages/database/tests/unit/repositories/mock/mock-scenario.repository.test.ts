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
})
