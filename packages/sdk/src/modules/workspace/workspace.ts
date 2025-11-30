import type {
  CreateWorkspaceDto,
  InviteMemberDto,
  UpdateMemberRoleDto,
  UpdateWorkspaceDto,
  Workspace,
  WorkspaceMember,
} from '@dev-platform/types'

import type { BaseClient } from '@/client/http'

import type { ListWorkspacesResponse } from './workspace.types'

class WorkspaceModule {
  constructor(private readonly client: BaseClient) {}

  async list(): Promise<ListWorkspacesResponse> {
    return this.client.get('workspaces').json()
  }

  async get(id: string): Promise<Workspace> {
    return this.client.get(`workspaces/${id}`).json()
  }

  async create(data: CreateWorkspaceDto): Promise<Workspace> {
    return this.client.post('workspaces', { json: data }).json()
  }

  async update(id: string, data: UpdateWorkspaceDto): Promise<Workspace> {
    return this.client.patch(`workspaces/${id}`, { json: data }).json()
  }

  async delete(id: string): Promise<void> {
    await this.client.delete(`workspaces/${id}`).json()
  }

  async listMembers(workspaceId: string): Promise<WorkspaceMember[]> {
    return this.client.get(`workspaces/${workspaceId}/members`).json()
  }

  async inviteMember(
    workspaceId: string,
    data: InviteMemberDto,
  ): Promise<WorkspaceMember> {
    return this.client
      .post(`workspaces/${workspaceId}/members`, { json: data })
      .json()
  }

  async updateMemberRole(
    workspaceId: string,
    memberId: string,
    data: UpdateMemberRoleDto,
  ): Promise<WorkspaceMember> {
    return this.client
      .patch(`workspaces/${workspaceId}/members/${memberId}`, { json: data })
      .json()
  }

  async removeMember(workspaceId: string, memberId: string): Promise<void> {
    await this.client
      .delete(`workspaces/${workspaceId}/members/${memberId}`)
      .json()
  }

  async leave(workspaceId: string): Promise<void> {
    await this.client.post(`workspaces/${workspaceId}/leave`).json()
  }
}

export { WorkspaceModule }
