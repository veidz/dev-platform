import type {
  API,
  CreateApiDto,
  ImportOpenApiDto,
  UpdateApiDto,
} from '@dev-platform/types'
import { describe, expect, it, jest } from '@jest/globals'
import { mockDeep } from 'jest-mock-extended'

import type { BaseClient } from '@/client/http'
import { ApiModule } from '@/modules/api/api'
import type {
  ImportApiResponse,
  ListApisResponse,
} from '@/modules/api/api.types'

describe('ApiModule', () => {
  const mockClient = mockDeep<BaseClient>()
  const apiModule = new ApiModule(mockClient)

  const mockApi: API = {
    id: 'api-123',
    name: 'Test API',
    description: 'Test description',
    version: '1.0.0',
    workspaceId: 'workspace-123',
    baseUrl: 'https://api.example.com',
    status: 'ACTIVE' as API['status'],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  }

  describe('list', () => {
    it('should list all APIs for workspace', async () => {
      const workspaceId = 'workspace-123'
      const expectedResponse: ListApisResponse = {
        apis: [mockApi],
        total: 1,
      }

      mockClient.get.mockReturnValue({
        json: jest
          .fn<() => Promise<ListApisResponse>>()
          .mockResolvedValue(expectedResponse),
      } as never)

      const result = await apiModule.list(workspaceId)

      expect(mockClient.get).toHaveBeenCalledWith('apis', {
        searchParams: { workspaceId },
      })
      expect(result).toEqual(expectedResponse)
    })

    it('should return APIs array and total', async () => {
      const workspaceId = 'workspace-456'
      const response: ListApisResponse = {
        apis: [mockApi, { ...mockApi, id: 'api-456' }],
        total: 2,
      }

      mockClient.get.mockReturnValue({
        json: jest
          .fn<() => Promise<ListApisResponse>>()
          .mockResolvedValue(response),
      } as never)

      const result = await apiModule.list(workspaceId)

      expect(result.apis).toHaveLength(2)
      expect(result.total).toBe(2)
    })
  })

  describe('get', () => {
    it('should get API by id', async () => {
      const apiId = 'api-123'

      mockClient.get.mockReturnValue({
        json: jest.fn<() => Promise<API>>().mockResolvedValue(mockApi),
      } as never)

      const result = await apiModule.get(apiId)

      expect(mockClient.get).toHaveBeenCalledWith(`apis/${apiId}`)
      expect(result).toEqual(mockApi)
    })

    it('should pass API id correctly', async () => {
      const apiId = 'api-456'

      mockClient.get.mockReturnValue({
        json: jest.fn<() => Promise<API>>().mockResolvedValue(mockApi),
      } as never)

      await apiModule.get(apiId)

      expect(mockClient.get).toHaveBeenCalledWith(`apis/${apiId}`)
    })
  })

  describe('create', () => {
    it('should create new API', async () => {
      const createData: CreateApiDto = {
        name: 'New API',
        description: 'New description',
        version: '1.0.0',
        workspaceId: 'workspace-123',
        baseUrl: 'https://new-api.example.com',
      }

      const expectedApi: API = {
        ...mockApi,
        name: createData.name,
        description: createData.description,
        baseUrl: createData.baseUrl,
      }

      mockClient.post.mockReturnValue({
        json: jest.fn<() => Promise<API>>().mockResolvedValue(expectedApi),
      } as never)

      const result = await apiModule.create(createData)

      expect(mockClient.post).toHaveBeenCalledWith('apis', {
        json: createData,
      })
      expect(result).toEqual(expectedApi)
    })

    it('should pass create data correctly', async () => {
      const createData: CreateApiDto = {
        name: 'Test',
        version: '2.0.0',
        workspaceId: 'workspace-789',
        baseUrl: 'https://test.com',
      }

      mockClient.post.mockReturnValue({
        json: jest.fn<() => Promise<API>>().mockResolvedValue(mockApi),
      } as never)

      await apiModule.create(createData)

      expect(mockClient.post).toHaveBeenCalledWith('apis', {
        json: createData,
      })
    })
  })

  describe('update', () => {
    it('should update API', async () => {
      const apiId = 'api-123'
      const updateData: UpdateApiDto = {
        name: 'Updated API',
        description: 'Updated description',
      }

      const expectedApi: API = {
        ...mockApi,
        ...(updateData.name && { name: updateData.name }),
        ...(updateData.description && { description: updateData.description }),
      }

      mockClient.patch.mockReturnValue({
        json: jest.fn<() => Promise<API>>().mockResolvedValue(expectedApi),
      } as never)

      const result = await apiModule.update(apiId, updateData)

      expect(mockClient.patch).toHaveBeenCalledWith(`apis/${apiId}`, {
        json: updateData,
      })
      expect(result).toEqual(expectedApi)
    })

    it('should pass update data correctly', async () => {
      const apiId = 'api-456'
      const updateData: UpdateApiDto = {
        name: 'Updated',
      }

      mockClient.patch.mockReturnValue({
        json: jest.fn<() => Promise<API>>().mockResolvedValue(mockApi),
      } as never)

      await apiModule.update(apiId, updateData)

      expect(mockClient.patch).toHaveBeenCalledWith(`apis/${apiId}`, {
        json: updateData,
      })
    })
  })

  describe('delete', () => {
    it('should delete API', async () => {
      const apiId = 'api-123'

      mockClient.delete.mockReturnValue({
        json: jest.fn<() => Promise<void>>().mockResolvedValue(undefined),
      } as never)

      await apiModule.delete(apiId)

      expect(mockClient.delete).toHaveBeenCalledWith(`apis/${apiId}`)
    })

    it('should not return a value on success', async () => {
      const apiId = 'api-456'

      mockClient.delete.mockReturnValue({
        json: jest.fn<() => Promise<void>>().mockResolvedValue(undefined),
      } as never)

      const result = await apiModule.delete(apiId)

      expect(result).toBeUndefined()
    })
  })

  describe('importOpenApi', () => {
    it('should import OpenAPI spec', async () => {
      const importData: ImportOpenApiDto = {
        workspaceId: 'workspace-123',
        spec: {
          openapi: '3.0.0',
          info: { title: 'Test API', version: '1.0.0' },
          paths: {},
        },
      }

      const expectedResponse: ImportApiResponse = {
        api: mockApi,
        endpointsCreated: 5,
      }

      mockClient.post.mockReturnValue({
        json: jest
          .fn<() => Promise<ImportApiResponse>>()
          .mockResolvedValue(expectedResponse),
      } as never)

      const result = await apiModule.importOpenApi(importData)

      expect(mockClient.post).toHaveBeenCalledWith('apis/import', {
        json: importData,
      })
      expect(result).toEqual(expectedResponse)
    })

    it('should return API and endpoints count', async () => {
      const importData: ImportOpenApiDto = {
        workspaceId: 'workspace-456',
        spec: {
          openapi: '3.0.0',
          info: { title: 'API', version: '1.0.0' },
          paths: {},
        },
      }

      const response: ImportApiResponse = {
        api: mockApi,
        endpointsCreated: 10,
      }

      mockClient.post.mockReturnValue({
        json: jest
          .fn<() => Promise<ImportApiResponse>>()
          .mockResolvedValue(response),
      } as never)

      const result = await apiModule.importOpenApi(importData)

      expect(result).toHaveProperty('api')
      expect(result).toHaveProperty('endpointsCreated')
      expect(result.endpointsCreated).toBe(10)
    })
  })

  describe('exportOpenApi', () => {
    it('should export OpenAPI spec', async () => {
      const apiId = 'api-123'
      const expectedSpec = {
        openapi: '3.0.0',
        info: { title: 'Test API', version: '1.0.0' },
        paths: {},
      }

      mockClient.get.mockReturnValue({
        json: jest
          .fn<() => Promise<Record<string, unknown>>>()
          .mockResolvedValue(expectedSpec),
      } as never)

      const result = await apiModule.exportOpenApi(apiId)

      expect(mockClient.get).toHaveBeenCalledWith(`apis/${apiId}/export`)
      expect(result).toEqual(expectedSpec)
    })

    it('should return OpenAPI spec object', async () => {
      const apiId = 'api-456'
      const spec = {
        openapi: '3.1.0',
        info: { title: 'API', version: '2.0.0' },
        paths: { '/users': {} },
      }

      mockClient.get.mockReturnValue({
        json: jest
          .fn<() => Promise<Record<string, unknown>>>()
          .mockResolvedValue(spec),
      } as never)

      const result = await apiModule.exportOpenApi(apiId)

      expect(result).toHaveProperty('openapi')
      expect(result).toHaveProperty('info')
      expect(result).toHaveProperty('paths')
    })
  })

  describe('duplicate', () => {
    it('should duplicate API with new name', async () => {
      const apiId = 'api-123'
      const newName = 'Duplicated API'

      const expectedApi: API = {
        ...mockApi,
        id: 'api-789',
        name: newName,
      }

      mockClient.post.mockReturnValue({
        json: jest.fn<() => Promise<API>>().mockResolvedValue(expectedApi),
      } as never)

      const result = await apiModule.duplicate(apiId, newName)

      expect(mockClient.post).toHaveBeenCalledWith(`apis/${apiId}/duplicate`, {
        json: { name: newName },
      })
      expect(result).toEqual(expectedApi)
    })

    it('should pass duplicate name correctly', async () => {
      const apiId = 'api-456'
      const newName = 'Copy of API'

      mockClient.post.mockReturnValue({
        json: jest.fn<() => Promise<API>>().mockResolvedValue(mockApi),
      } as never)

      await apiModule.duplicate(apiId, newName)

      expect(mockClient.post).toHaveBeenCalledWith(`apis/${apiId}/duplicate`, {
        json: { name: newName },
      })
    })
  })
})
