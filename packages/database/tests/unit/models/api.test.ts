import { randSemver } from '@ngneat/falso'
import { ApiStatus, HttpMethod } from '@prisma/client'
import type { JsonValue } from '@prisma/client/runtime/library'

import { faker } from '@/__mocks__/faker-adapter'
import { prismaMock } from '@/tests/setup'

const createMockApi = (overrides = {}) => ({
  id: faker.string.nanoid(),
  workspaceId: faker.string.nanoid(),
  name: faker.lorem.word(),
  description: faker.lorem.sentence(),
  baseUrl: faker.internet.url(),
  version: randSemver(),
  status: ApiStatus.ACTIVE,
  createdAt: faker.date.past(),
  updatedAt: faker.date.recent(),
  ...overrides,
})

const createMockEndpoint = (overrides = {}) => ({
  id: faker.string.nanoid(),
  apiId: faker.string.nanoid(),
  path: `/${faker.lorem.word()}`,
  method: faker.helpers.arrayElement(Object.values(HttpMethod)),
  description: faker.lorem.sentence(),
  requestSchema: null as JsonValue,
  responseSchema: null as JsonValue,
  headers: null as JsonValue,
  queryParams: null as JsonValue,
  createdAt: faker.date.past(),
  updatedAt: faker.date.recent(),
  ...overrides,
})

describe('Api model', () => {
  it('should create an API', async () => {
    const mockApi = createMockApi()

    prismaMock.api.create.mockResolvedValue(mockApi)

    const result = await prismaMock.api.create({
      data: {
        workspaceId: mockApi.workspaceId,
        name: mockApi.name,
        description: mockApi.description,
        baseUrl: mockApi.baseUrl,
        version: mockApi.version,
      },
    })

    expect(result).toEqual(mockApi)
    expect(result.status).toBe(ApiStatus.ACTIVE)
  })
})
