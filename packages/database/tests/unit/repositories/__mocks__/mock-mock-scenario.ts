import type { MockScenario } from '@prisma/client'

import { faker } from '@/__mocks__/faker-adapter'

const mockMockScenarioModel = (
  overrides: Partial<MockScenario> = {},
): MockScenario => ({
  id: faker.string.nanoid(),
  endpointId: faker.string.nanoid(),
  name: faker.lorem.word(),
  description: faker.lorem.sentence(),
  active: true,
  createdAt: faker.date.past(),
  updatedAt: faker.date.recent(),
  ...overrides,
})

const mockMockScenarioModels = (
  count: number = 2,
  overrides: Partial<MockScenario> = {},
): MockScenario[] =>
  Array.from({ length: count }, () => mockMockScenarioModel(overrides))

export { mockMockScenarioModel, mockMockScenarioModels }
