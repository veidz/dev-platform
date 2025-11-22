export enum Role {
  OWNER = 'OWNER',
  ADMIN = 'ADMIN',
  DEVELOPER = 'DEVELOPER',
  VIEWER = 'VIEWER',
}

export interface Workspace {
  id: string
  name: string
  slug: string
  description?: string
  ownerId: string
  createdAt: Date
  updatedAt: Date
}

export interface WorkspaceMember {
  id: string
  workspaceId: string
  userId: string
  role: Role
  user: {
    id: string
    name: string
    email: string
    avatar?: string
  }
  joinedAt: Date
}

export interface Permissions {
  canCreateApi: boolean
  canUpdateApi: boolean
  canDeleteApi: boolean
  canInviteMembers: boolean
  canRemoveMembers: boolean
  canUpdateRoles: boolean
  canDeleteWorkspace: boolean
}

export const RolePermissions: Record<Role, Permissions> = {
  [Role.OWNER]: {
    canCreateApi: true,
    canUpdateApi: true,
    canDeleteApi: true,
    canInviteMembers: true,
    canRemoveMembers: true,
    canUpdateRoles: true,
    canDeleteWorkspace: true,
  },
  [Role.ADMIN]: {
    canCreateApi: true,
    canUpdateApi: true,
    canDeleteApi: true,
    canInviteMembers: true,
    canRemoveMembers: true,
    canUpdateRoles: false,
    canDeleteWorkspace: false,
  },
  [Role.DEVELOPER]: {
    canCreateApi: true,
    canUpdateApi: true,
    canDeleteApi: false,
    canInviteMembers: false,
    canRemoveMembers: false,
    canUpdateRoles: false,
    canDeleteWorkspace: false,
  },
  [Role.VIEWER]: {
    canCreateApi: false,
    canUpdateApi: false,
    canDeleteApi: false,
    canInviteMembers: false,
    canRemoveMembers: false,
    canUpdateRoles: false,
    canDeleteWorkspace: false,
  },
}

export interface CreateWorkspaceDto {
  name: string
  slug: string
  description?: string
}

export interface UpdateWorkspaceDto {
  name?: string
  description?: string
}

export interface InviteMemberDto {
  email: string
  role: Role
}

export interface UpdateMemberRoleDto {
  role: Role
}
