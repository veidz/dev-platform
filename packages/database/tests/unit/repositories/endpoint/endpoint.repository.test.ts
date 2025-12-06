import { faker } from '@/__mocks__/faker-adapter'
import { EndpointRepository } from '@/repositories/endpoint'
import {
  createPrismaClientMock,
  mockEndpointModel,
  PrismaClientMock,
} from '@/tests/repositories/__mocks__'

type SutTypes = {
  sut: EndpointRepository
  prismaClientMock: PrismaClientMock
}

const makeSut = (): SutTypes => {
  const prismaClientMock = createPrismaClientMock()
  const sut = new EndpointRepository(prismaClientMock)
  return {
    sut,
    prismaClientMock,
  }
}

describe('EndpointRepository', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('findByApiId', () => {
    it('should find endpoints by api id', async () => {
      const { sut, prismaClientMock } = makeSut()
      const apiId = faker.string.nanoid()
      const mockEndpoints = [
        mockEndpointModel({ apiId }),
        mockEndpointModel({ apiId }),
      ]
      prismaClientMock.endpoint.findMany.mockResolvedValue(mockEndpoints)

      const result = await sut.findByApiId(apiId)

      expect(result).toEqual(mockEndpoints)
      expect(prismaClientMock.endpoint.findMany).toHaveBeenCalledWith({
        where: { apiId },
        orderBy: { path: 'asc' },
      })
    })
  })
})
