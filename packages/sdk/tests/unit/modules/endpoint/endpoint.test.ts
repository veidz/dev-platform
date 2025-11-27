import type { Endpoint } from '@dev-platform/types'
import { HttpMethod } from '@dev-platform/types'
import { describe, expect, it } from '@jest/globals'
import { mockDeep } from 'jest-mock-extended'

import { faker } from '@/__mocks__/faker-adapter'
import type { BaseClient } from '@/client/http'
import { EndpointModule } from '@/modules/endpoint/endpoint'
import type { ListEndpointsResponse } from '@/modules/endpoint/endpoint.types'

describe('EndpointModule', () => {
  const mockClient = mockDeep<BaseClient>()
  const endpointModule = new EndpointModule(mockClient)

  const createMockEndpoint = (overrides?: Partial<Endpoint>): Endpoint => ({
    id: faker.string.uuid(),
    apiId: faker.string.uuid(),
    path: '/users',
    method: HttpMethod.GET,
    description: faker.lorem.sentence(),
    requestSchema: undefined,
    responseSchema: undefined,
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent(),
    ...overrides,
  })

  describe('list', () => {
    it('should list endpoints for an API', async () => {
      const apiId = faker.string.uuid()
      const mockResponse: ListEndpointsResponse = {
        endpoints: [
          createMockEndpoint({ apiId, path: '/users' }),
          createMockEndpoint({ apiId, path: '/users/{id}' }),
        ],
        total: 2,
      }

      mockClient.get.mockReturnValue({
        json: () => Promise.resolve(mockResponse),
      } as never)

      const result = await endpointModule.list(apiId)

      expect(mockClient.get).toHaveBeenCalledWith('endpoints', {
        searchParams: { apiId },
      })
      expect(result).toEqual(mockResponse)
      expect(result.endpoints).toHaveLength(2)
      expect(result.total).toBe(2)
    })

    it('should return empty list when API has no endpoints', async () => {
      const apiId = faker.string.uuid()
      const mockResponse: ListEndpointsResponse = {
        endpoints: [],
        total: 0,
      }

      mockClient.get.mockReturnValue({
        json: () => Promise.resolve(mockResponse),
      } as never)

      const result = await endpointModule.list(apiId)

      expect(mockClient.get).toHaveBeenCalledWith('endpoints', {
        searchParams: { apiId },
      })
      expect(result.endpoints).toHaveLength(0)
      expect(result.total).toBe(0)
    })
  })

  describe('get', () => {
    it('should get endpoint by id', async () => {
      const endpointId = faker.string.uuid()
      const mockEndpoint = createMockEndpoint({
        id: endpointId,
        path: '/users/{id}',
        responseSchema: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: 'string' },
          },
        },
      })

      mockClient.get.mockReturnValue({
        json: () => Promise.resolve(mockEndpoint),
      } as never)

      const result = await endpointModule.get(endpointId)

      expect(mockClient.get).toHaveBeenCalledWith(`endpoints/${endpointId}`)
      expect(result).toEqual(mockEndpoint)
      expect(result.id).toBe(endpointId)
    })
  })

  describe('create', () => {
    it('should create endpoint with minimal data', async () => {
      const apiId = faker.string.uuid()
      const createData = {
        apiId,
        path: '/products',
        method: HttpMethod.POST,
        description: 'Create product',
      }

      const mockEndpoint = createMockEndpoint({
        ...createData,
      })

      mockClient.post.mockReturnValue({
        json: () => Promise.resolve(mockEndpoint),
      } as never)

      const result = await endpointModule.create(createData)

      expect(mockClient.post).toHaveBeenCalledWith('endpoints', {
        json: createData,
      })
      expect(result).toEqual(mockEndpoint)
    })
  })
})
