import type { Api, User, Workspace, WorkspaceMember } from '@prisma/client'

import { faker } from '@/__mocks__/faker-adapter'

type WorkspaceWithApis = Workspace & { apis: Api[] }
type WorkspaceWithOwner = Workspace & { owner: User }
type MemberWithUser = WorkspaceMember & { user: User }
type WorkspaceWithMembers = Workspace & { members: MemberWithUser[] }

const mockWorkspaceModel = (overrides: Partial<Workspace> = {}): Workspace => ({
  id: faker.string.nanoid(),
  name: faker.company.name(),
  slug: faker.helpers.slugify(faker.company.name()),
  description: faker.lorem.sentence(),
  ownerId: faker.string.nanoid(),
  createdAt: faker.date.past(),
  updatedAt: faker.date.recent(),
  ...overrides,
})

const mockWorkspaceModels = (
  count: number = 2,
  overrides: Partial<Workspace> = {},
): Workspace[] =>
  Array.from({ length: count }, () => mockWorkspaceModel(overrides))

const mockWorkspaceWithApis = (
  workspaceOverrides: Partial<Workspace> = {},
  apis: Api[] = [],
): WorkspaceWithApis => ({
  ...mockWorkspaceModel(workspaceOverrides),
  apis,
})

const mockWorkspaceWithOwner = (
  workspaceOverrides: Partial<Workspace> = {},
  ownerOverrides: Partial<User> = {},
): WorkspaceWithOwner => {
  const workspace = mockWorkspaceModel(workspaceOverrides)
  return {
    ...workspace,
    owner: {
      id: workspace.ownerId,
      email: faker.internet.email(),
      name: faker.person.fullName(),
      password: faker.string.alphanumeric(60),
      avatar: null,
      emailVerified: false,
      createdAt: faker.date.past(),
      updatedAt: faker.date.recent(),
      ...ownerOverrides,
    },
  }
}

const mockWorkspaceWithMembers = (
  workspaceOverrides: Partial<Workspace> = {},
  members: MemberWithUser[] = [],
): WorkspaceWithMembers => ({
  ...mockWorkspaceModel(workspaceOverrides),
  members,
})

export type {
  MemberWithUser,
  WorkspaceWithApis,
  WorkspaceWithMembers,
  WorkspaceWithOwner,
}
export {
  mockWorkspaceModel,
  mockWorkspaceModels,
  mockWorkspaceWithApis,
  mockWorkspaceWithMembers,
  mockWorkspaceWithOwner,
}
