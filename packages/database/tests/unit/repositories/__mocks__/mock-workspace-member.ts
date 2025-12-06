import type { Role, WorkspaceMember } from '@prisma/client'

import { faker } from '@/__mocks__/faker-adapter'

const mockWorkspaceMemberModel = (
  overrides: Partial<WorkspaceMember> = {},
): WorkspaceMember => ({
  id: faker.string.nanoid(),
  workspaceId: faker.string.nanoid(),
  userId: faker.string.nanoid(),
  role: 'DEVELOPER' as Role,
  joinedAt: faker.date.past(),
  ...overrides,
})

const mockWorkspaceMemberModels = (
  count: number = 2,
  overrides: Partial<WorkspaceMember> = {},
): WorkspaceMember[] =>
  Array.from({ length: count }, () => mockWorkspaceMemberModel(overrides))

export { mockWorkspaceMemberModel, mockWorkspaceMemberModels }
