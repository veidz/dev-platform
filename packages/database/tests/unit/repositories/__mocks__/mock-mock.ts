import type { Mock } from '@prisma/client'

import { faker } from '@/__mocks__/faker-adapter'

const mockMockModel = (overrides: Partial<Mock> = {}): Mock => ({
  id: faker.string.nanoid(),
  endpointId: faker.string.nanoid(),
  name: faker.lorem.word(),
  description: faker.lorem.sentence(),
  statusCode: 200,
  headers: {},
  body: { message: 'success' },
  delayType: 'NONE',
  delayMs: null,
  delayMinMs: null,
  delayMaxMs: null,
  enabled: true,
  createdAt: faker.date.past(),
  updatedAt: faker.date.recent(),
  ...overrides,
})

const mockMockModels = (
  count: number = 2,
  overrides: Partial<Mock> = {},
): Mock[] => Array.from({ length: count }, () => mockMockModel(overrides))

export { mockMockModel, mockMockModels }
