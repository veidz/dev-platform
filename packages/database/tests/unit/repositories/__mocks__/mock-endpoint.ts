import type {
  Api,
  Endpoint,
  HttpMethod,
  Mock,
  MockScenario,
} from '@prisma/client'

import { faker } from '@/__mocks__/faker-adapter'

type EndpointWithApi = Endpoint & { api: Api }
type EndpointWithMocks = Endpoint & { mocks: Mock[] }
type EndpointWithScenarios = Endpoint & { mockScenarios: MockScenario[] }

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

const mockEndpointWithApi = (
  endpointOverrides: Partial<Endpoint> = {},
  apiOverrides: Partial<Api> = {},
): EndpointWithApi => {
  const endpoint = mockEndpointModel(endpointOverrides)
  return {
    ...endpoint,
    api: {
      id: endpoint.apiId,
      workspaceId: faker.string.nanoid(),
      name: faker.lorem.word(),
      description: faker.lorem.sentence(),
      baseUrl: faker.internet.url(),
      version: '1.0.0',
      status: 'ACTIVE',
      createdAt: faker.date.past(),
      updatedAt: faker.date.recent(),
      ...apiOverrides,
    },
  }
}

const mockEndpointWithMocks = (
  endpointOverrides: Partial<Endpoint> = {},
  mocks: Mock[] = [],
): EndpointWithMocks => ({
  ...mockEndpointModel(endpointOverrides),
  mocks,
})

const mockEndpointWithScenarios = (
  endpointOverrides: Partial<Endpoint> = {},
  mockScenarios: MockScenario[] = [],
): EndpointWithScenarios => ({
  ...mockEndpointModel(endpointOverrides),
  mockScenarios,
})

export type { EndpointWithApi, EndpointWithMocks, EndpointWithScenarios }
export {
  mockEndpointModel,
  mockEndpointModels,
  mockEndpointWithApi,
  mockEndpointWithMocks,
  mockEndpointWithScenarios,
}
