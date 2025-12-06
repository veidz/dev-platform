import type { HttpMethod } from '@prisma/client'

import { faker } from '@/__mocks__/faker-adapter'
import { EndpointRepository } from '@/repositories/endpoint'
import {
  createPrismaClientMock,
  mockEndpointModel,
  mockEndpointWithApi,
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

  describe('findByPathAndMethod', () => {
    it('should find endpoint by path and method', async () => {
      const { sut, prismaClientMock } = makeSut()
      const mockEndpoint = mockEndpointModel()
      prismaClientMock.endpoint.findUnique.mockResolvedValue(mockEndpoint)

      const result = await sut.findByPathAndMethod(
        mockEndpoint.apiId,
        mockEndpoint.path,
        mockEndpoint.method,
      )

      expect(result).toEqual(mockEndpoint)
      expect(prismaClientMock.endpoint.findUnique).toHaveBeenCalledWith({
        where: {
          apiId_path_method: {
            apiId: mockEndpoint.apiId,
            path: mockEndpoint.path,
            method: mockEndpoint.method,
          },
        },
      })
    })

    it('should return null when endpoint not found', async () => {
      const { sut, prismaClientMock } = makeSut()
      prismaClientMock.endpoint.findUnique.mockResolvedValue(null)

      const result = await sut.findByPathAndMethod(
        'api-id',
        '/non-existent',
        'GET',
      )

      expect(result).toBeNull()
    })
  })

  describe('findByMethod', () => {
    it('should find endpoints by http method', async () => {
      const { sut, prismaClientMock } = makeSut()
      const method: HttpMethod = 'GET'
      const mockEndpoints = [
        mockEndpointModel({ method }),
        mockEndpointModel({ method }),
      ]
      prismaClientMock.endpoint.findMany.mockResolvedValue(mockEndpoints)

      const result = await sut.findByMethod(method)

      expect(result).toEqual(mockEndpoints)
      expect(prismaClientMock.endpoint.findMany).toHaveBeenCalledWith({
        where: { method },
        orderBy: { path: 'asc' },
      })
    })
  })

  describe('findWithApi', () => {
    it('should find endpoint with api included', async () => {
      const { sut, prismaClientMock } = makeSut()
      const endpointWithApi = mockEndpointWithApi()
      prismaClientMock.endpoint.findUnique.mockResolvedValue(endpointWithApi)

      const result = await sut.findWithApi(endpointWithApi.id)

      expect(result).toEqual(endpointWithApi)
      expect(prismaClientMock.endpoint.findUnique).toHaveBeenCalledWith({
        where: { id: endpointWithApi.id },
        include: { api: true },
      })
    })
  })
})
