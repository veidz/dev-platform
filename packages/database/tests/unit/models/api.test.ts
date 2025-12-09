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

  it('should update API status', async () => {
    const mockApi = createMockApi({
      description: null,
      status: ApiStatus.DEPRECATED,
    })

    prismaMock.api.update.mockResolvedValue(mockApi)

    const result = await prismaMock.api.update({
      where: { id: mockApi.id },
      data: { status: ApiStatus.DEPRECATED },
    })

    expect(result.status).toBe(ApiStatus.DEPRECATED)
  })
})

describe('Endpoint model', () => {
  it('should create an endpoint', async () => {
    const responseSchema = { type: 'array' }
    const mockEndpoint = createMockEndpoint({
      method: HttpMethod.GET,
      responseSchema,
    })

    prismaMock.endpoint.create.mockResolvedValue(mockEndpoint)

    const result = await prismaMock.endpoint.create({
      data: {
        apiId: mockEndpoint.apiId,
        path: mockEndpoint.path,
        method: mockEndpoint.method,
        description: mockEndpoint.description,
        responseSchema,
      },
    })

    expect(result).toEqual(mockEndpoint)
    expect(result.method).toBe(HttpMethod.GET)
  })

  it('should find endpoints by API', async () => {
    const apiId = faker.string.nanoid()
    const mockEndpoints = [
      createMockEndpoint({ apiId, method: HttpMethod.GET }),
      createMockEndpoint({ apiId, method: HttpMethod.POST }),
    ]

    prismaMock.endpoint.findMany.mockResolvedValue(mockEndpoints)

    const result = await prismaMock.endpoint.findMany({
      where: { apiId },
    })

    expect(result).toHaveLength(2)
  })
})
