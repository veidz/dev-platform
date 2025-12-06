import type { Endpoint, HttpMethod } from '@prisma/client'

import { faker } from '@/__mocks__/faker-adapter'

const mockEndpointModel = (overrides: Partial<Endpoint> = {}): Endpoint => ({
  id: faker.string.nanoid(),
  apiId: faker.string.nanoid(),
  path: `/${faker.lorem.word()}`,
  method: 'GET' as HttpMethod,
  description: faker.lorem.paragraph(),
  requestSchema: null,
  responseSchema: null,
  headers: null,
  queryParams: null,
  createdAt: faker.date.past(),
  updatedAt: faker.date.recent(),
  ...overrides,
})

const mockEndpointModels = (
  count: number = 2,
  overrides: Partial<Endpoint> = {},
): Endpoint[] =>
  Array.from({ length: count }, () => mockEndpointModel(overrides))

export { mockEndpointModel, mockEndpointModels }
