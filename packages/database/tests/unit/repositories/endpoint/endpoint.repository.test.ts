import type { HttpMethod } from '@prisma/client'

import { faker } from '@/__mocks__/faker-adapter'
import { EndpointRepository } from '@/repositories/endpoint'
import {
  createPrismaClientMock,
  mockEndpointModel,
  mockEndpointWithApi,
  mockEndpointWithMocks,
  mockEndpointWithScenarios,
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

  describe('findWithMocks', () => {
    it('should find endpoint with mocks included', async () => {
      const { sut, prismaClientMock } = makeSut()
      const endpointWithMocks = mockEndpointWithMocks()
      prismaClientMock.endpoint.findUnique.mockResolvedValue(endpointWithMocks)

      const result = await sut.findWithMocks(endpointWithMocks.id)

      expect(result).toEqual(endpointWithMocks)
      expect(prismaClientMock.endpoint.findUnique).toHaveBeenCalledWith({
        where: { id: endpointWithMocks.id },
        include: { mocks: true },
      })
    })
  })

  describe('findWithScenarios', () => {
    it('should find endpoint with scenarios included', async () => {
      const { sut, prismaClientMock } = makeSut()
      const endpointWithScenarios = mockEndpointWithScenarios()
      prismaClientMock.endpoint.findUnique.mockResolvedValue(
        endpointWithScenarios,
      )

      const result = await sut.findWithScenarios(endpointWithScenarios.id)

      expect(result).toEqual(endpointWithScenarios)
      expect(prismaClientMock.endpoint.findUnique).toHaveBeenCalledWith({
        where: { id: endpointWithScenarios.id },
        include: { mockScenarios: true },
      })
    })
  })

  describe('pathExistsInApi', () => {
    it('should return true when path exists in api', async () => {
      const { sut, prismaClientMock } = makeSut()
      prismaClientMock.endpoint.count.mockResolvedValue(1)

      const result = await sut.pathExistsInApi('api-id', '/users', 'GET')

      expect(result).toBe(true)
      expect(prismaClientMock.endpoint.count).toHaveBeenCalledWith({
        where: { apiId: 'api-id', path: '/users', method: 'GET' },
      })
    })

    it('should return false when path does not exist in api', async () => {
      const { sut, prismaClientMock } = makeSut()
      prismaClientMock.endpoint.count.mockResolvedValue(0)

      const result = await sut.pathExistsInApi('api-id', '/non-existent', 'GET')

      expect(result).toBe(false)
    })
  })

  describe('countByApi', () => {
    it('should count endpoints in api', async () => {
      const { sut, prismaClientMock } = makeSut()
      prismaClientMock.endpoint.count.mockResolvedValue(15)

      const result = await sut.countByApi('api-id')

      expect(result).toBe(15)
      expect(prismaClientMock.endpoint.count).toHaveBeenCalledWith({
        where: { apiId: 'api-id' },
      })
    })
  })

  describe('countByMethod', () => {
    it('should count endpoints by method', async () => {
      const { sut, prismaClientMock } = makeSut()
      const method: HttpMethod = 'POST'
      prismaClientMock.endpoint.count.mockResolvedValue(25)

      const result = await sut.countByMethod(method)

      expect(result).toBe(25)
      expect(prismaClientMock.endpoint.count).toHaveBeenCalledWith({
        where: { method },
      })
    })
  })
})
