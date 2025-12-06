import type { Workspace } from '@prisma/client'

import { faker } from '@/__mocks__/faker-adapter'

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

export { mockWorkspaceModel, mockWorkspaceModels }
