import type { Workspace, WorkspaceMember } from '@dev-platform/types'
import { describe, expect, it, jest } from '@jest/globals'
import { mockDeep } from 'jest-mock-extended'

import type { BaseClient } from '@/client/http'
import { WorkspaceModule } from '@/modules/workspace/workspace'
import type { ListWorkspacesResponse } from '@/modules/workspace/workspace.types'

describe('WorkspaceModule', () => {
  const mockClient = mockDeep<BaseClient>()
  const workspaceModule = new WorkspaceModule(mockClient)

  const mockWorkspace: Workspace = {
    id: 'workspace-123',
    name: 'Test Workspace',
    slug: 'test-workspace',
    description: 'Test description',
    ownerId: 'user-123',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  }

  const mockMember: WorkspaceMember = {
    id: 'member-123',
    workspaceId: 'workspace-123',
    userId: 'user-456',
    role: 'DEVELOPER' as WorkspaceMember['role'],
    user: {
      id: 'user-456',
      name: 'Test User',
      email: 'test@example.com',
    },
    joinedAt: new Date('2024-01-01'),
  }

  describe('list', () => {
    it('should list all workspaces', async () => {
      const expectedResponse: ListWorkspacesResponse = {
        workspaces: [mockWorkspace],
        total: 1,
      }

      mockClient.get.mockReturnValue({
        json: jest
          .fn<() => Promise<ListWorkspacesResponse>>()
          .mockResolvedValue(expectedResponse),
      } as never)

      const result = await workspaceModule.list()

      expect(mockClient.get).toHaveBeenCalledWith('workspaces')
      expect(result).toEqual(expectedResponse)
    })

    it('should return workspaces array and total', async () => {
      const response: ListWorkspacesResponse = {
        workspaces: [mockWorkspace, { ...mockWorkspace, id: 'workspace-456' }],
        total: 2,
      }

      mockClient.get.mockReturnValue({
        json: jest
          .fn<() => Promise<ListWorkspacesResponse>>()
          .mockResolvedValue(response),
      } as never)

      const result = await workspaceModule.list()

      expect(result.workspaces).toHaveLength(2)
      expect(result.total).toBe(2)
    })
  })
})
