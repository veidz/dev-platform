import type { Api, ApiStatus } from '@prisma/client'

import { faker } from '@/__mocks__/faker-adapter'

const mockApiModel = (overrides: Partial<Api> = {}): Api => ({
  id: faker.string.nanoid(),
  workspaceId: faker.string.nanoid(),
  name: faker.lorem.word(),
  description: faker.lorem.sentence(),
  baseUrl: faker.internet.url(),
  version: '1.0.0',
  status: 'ACTIVE' as ApiStatus,
  createdAt: faker.date.past(),
  updatedAt: faker.date.recent(),
  ...overrides,
})

const mockApiModels = (
  count: number = 2,
  overrides: Partial<Api> = {},
): Api[] => Array.from({ length: count }, () => mockApiModel(overrides))

export { mockApiModel, mockApiModels }
