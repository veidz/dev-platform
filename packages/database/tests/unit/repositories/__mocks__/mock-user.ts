import type { User, Workspace, WorkspaceMember } from '@prisma/client'

import { faker } from '@/__mocks__/faker-adapter'

type UserWithOwnedWorkspaces = User & { ownedWorkspaces: Workspace[] }
type MembershipWithWorkspace = WorkspaceMember & { workspace: Workspace }
type UserWithMemberships = User & { memberships: MembershipWithWorkspace[] }

const mockUserModel = (overrides: Partial<User> = {}): User => ({
  id: faker.string.nanoid(),
  email: faker.internet.email(),
  name: faker.person.fullName(),
  password: faker.string.alphanumeric(60),
  avatar: null,
  emailVerified: false,
  createdAt: faker.date.past(),
  updatedAt: faker.date.recent(),
  ...overrides,
})

const mockUserModels = (
  count: number = 2,
  overrides: Partial<User> = {},
): User[] => Array.from({ length: count }, () => mockUserModel(overrides))

const mockUserWithOwnedWorkspaces = (
  userOverrides: Partial<User> = {},
  ownedWorkspaces: Workspace[] = [],
): UserWithOwnedWorkspaces => ({
  ...mockUserModel(userOverrides),
  ownedWorkspaces,
})

const mockUserWithMemberships = (
  userOverrides: Partial<User> = {},
  memberships: MembershipWithWorkspace[] = [],
): UserWithMemberships => ({
  ...mockUserModel(userOverrides),
  memberships,
})

export type {
  MembershipWithWorkspace,
  UserWithMemberships,
  UserWithOwnedWorkspaces,
}
export {
  mockUserModel,
  mockUserModels,
  mockUserWithMemberships,
  mockUserWithOwnedWorkspaces,
}
