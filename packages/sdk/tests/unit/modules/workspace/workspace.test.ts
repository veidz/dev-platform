import type {
  CreateWorkspaceDto,
  UpdateWorkspaceDto,
  Workspace,
  WorkspaceMember,
} from '@dev-platform/types'
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

  describe('get', () => {
    it('should get workspace by id', async () => {
      const workspaceId = 'workspace-123'

      mockClient.get.mockReturnValue({
        json: jest
          .fn<() => Promise<Workspace>>()
          .mockResolvedValue(mockWorkspace),
      } as never)

      const result = await workspaceModule.get(workspaceId)

      expect(mockClient.get).toHaveBeenCalledWith(`workspaces/${workspaceId}`)
      expect(result).toEqual(mockWorkspace)
    })

    it('should pass workspace id correctly', async () => {
      const workspaceId = 'workspace-456'

      mockClient.get.mockReturnValue({
        json: jest
          .fn<() => Promise<Workspace>>()
          .mockResolvedValue(mockWorkspace),
      } as never)

      await workspaceModule.get(workspaceId)

      expect(mockClient.get).toHaveBeenCalledWith(`workspaces/${workspaceId}`)
    })
  })

  describe('create', () => {
    it('should create new workspace', async () => {
      const createData: CreateWorkspaceDto = {
        name: 'New Workspace',
        slug: 'new-workspace',
        description: 'New description',
      }

      const expectedWorkspace: Workspace = {
        ...mockWorkspace,
        name: createData.name,
        description: createData.description,
      }

      mockClient.post.mockReturnValue({
        json: jest
          .fn<() => Promise<Workspace>>()
          .mockResolvedValue(expectedWorkspace),
      } as never)

      const result = await workspaceModule.create(createData)

      expect(mockClient.post).toHaveBeenCalledWith('workspaces', {
        json: createData,
      })
      expect(result).toEqual(expectedWorkspace)
    })

    it('should pass create data correctly', async () => {
      const createData: CreateWorkspaceDto = {
        name: 'Test',
        slug: 'test',
        description: 'Desc',
      }

      mockClient.post.mockReturnValue({
        json: jest
          .fn<() => Promise<Workspace>>()
          .mockResolvedValue(mockWorkspace),
      } as never)

      await workspaceModule.create(createData)

      expect(mockClient.post).toHaveBeenCalledWith('workspaces', {
        json: createData,
      })
    })
  })

  describe('update', () => {
    it('should update workspace', async () => {
      const workspaceId = 'workspace-123'
      const updateData: UpdateWorkspaceDto = {
        name: 'Updated Workspace',
        description: 'Updated description',
      }

      const expectedWorkspace: Workspace = {
        ...mockWorkspace,
        ...(updateData.name && { name: updateData.name }),
        ...(updateData.description && {
          description: updateData.description,
        }),
      }

      mockClient.patch.mockReturnValue({
        json: jest
          .fn<() => Promise<Workspace>>()
          .mockResolvedValue(expectedWorkspace),
      } as never)

      const result = await workspaceModule.update(workspaceId, updateData)

      expect(mockClient.patch).toHaveBeenCalledWith(
        `workspaces/${workspaceId}`,
        {
          json: updateData,
        },
      )
      expect(result).toEqual(expectedWorkspace)
    })

    it('should pass update data correctly', async () => {
      const workspaceId = 'workspace-456'
      const updateData: UpdateWorkspaceDto = {
        name: 'Updated',
      }

      mockClient.patch.mockReturnValue({
        json: jest
          .fn<() => Promise<Workspace>>()
          .mockResolvedValue(mockWorkspace),
      } as never)

      await workspaceModule.update(workspaceId, updateData)

      expect(mockClient.patch).toHaveBeenCalledWith(
        `workspaces/${workspaceId}`,
        {
          json: updateData,
        },
      )
    })
  })

  describe('delete', () => {
    it('should delete workspace', async () => {
      const workspaceId = 'workspace-123'

      mockClient.delete.mockReturnValue({
        json: jest.fn<() => Promise<void>>().mockResolvedValue(undefined),
      } as never)

      await workspaceModule.delete(workspaceId)

      expect(mockClient.delete).toHaveBeenCalledWith(
        `workspaces/${workspaceId}`,
      )
    })

    it('should return void', async () => {
      const workspaceId = 'workspace-456'

      mockClient.delete.mockReturnValue({
        json: jest.fn<() => Promise<void>>().mockResolvedValue(undefined),
      } as never)

      const result = await workspaceModule.delete(workspaceId)

      expect(result).toBeUndefined()
    })
  })

  describe('listMembers', () => {
    it('should list workspace members', async () => {
      const workspaceId = 'workspace-123'
      const expectedMembers = [mockMember]

      mockClient.get.mockReturnValue({
        json: jest
          .fn<() => Promise<WorkspaceMember[]>>()
          .mockResolvedValue(expectedMembers),
      } as never)

      const result = await workspaceModule.listMembers(workspaceId)

      expect(mockClient.get).toHaveBeenCalledWith(
        `workspaces/${workspaceId}/members`,
      )
      expect(result).toEqual(expectedMembers)
    })

    it('should return members array', async () => {
      const workspaceId = 'workspace-123'
      const members = [mockMember, { ...mockMember, id: 'member-456' }]

      mockClient.get.mockReturnValue({
        json: jest
          .fn<() => Promise<WorkspaceMember[]>>()
          .mockResolvedValue(members),
      } as never)

      const result = await workspaceModule.listMembers(workspaceId)

      expect(result).toHaveLength(2)
    })
  })
})
