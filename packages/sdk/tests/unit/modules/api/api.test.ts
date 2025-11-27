import type { API } from '@dev-platform/types'
import { describe, expect, it, jest } from '@jest/globals'
import { mockDeep } from 'jest-mock-extended'

import type { BaseClient } from '@/client/http'
import { ApiModule } from '@/modules/api/api'
import type { ListApisResponse } from '@/modules/api/api.types'

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
  })
})
