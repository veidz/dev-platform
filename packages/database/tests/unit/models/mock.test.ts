import { randWord } from '@ngneat/falso'
import { MockDelayType } from '@prisma/client'

import { faker } from '@/__mocks__/faker-adapter'
import { prismaMock } from '@/tests/setup'

const createMockData = (overrides = {}) => ({
  id: faker.string.nanoid(),
  endpointId: faker.string.nanoid(),
  name: randWord({ length: 2 }).join(' '),
  description: null,
  statusCode: faker.helpers.arrayElement([200, 201, 204, 400, 404, 500]),
  headers: { 'Content-Type': 'application/json' },
  body: { data: faker.lorem.word() },
  delayType: MockDelayType.NONE,
  delayMs: null,
  delayMinMs: null,
  delayMaxMs: null,
  enabled: true,
  createdAt: faker.date.past(),
  updatedAt: faker.date.recent(),
  ...overrides,
})

describe('Mock model', () => {
  it('should create a mock', async () => {
    const mockData = createMockData()

    prismaMock.mock.create.mockResolvedValue(mockData)

    const result = await prismaMock.mock.create({
      data: {
        endpointId: mockData.endpointId,
        name: mockData.name,
        statusCode: mockData.statusCode,
        headers: mockData.headers,
        body: mockData.body,
        delayType: mockData.delayType,
      },
    })

    expect(result).toEqual(mockData)
    expect(result.delayType).toBe(MockDelayType.NONE)
  })
})
