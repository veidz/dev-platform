import type { Mock, MockScenario } from '@dev-platform/types'
import { MockDelayType } from '@dev-platform/types'
import { describe, expect, it } from '@jest/globals'
import { mockDeep } from 'jest-mock-extended'

import { faker } from '@/__mocks__/faker-adapter'
import type { BaseClient } from '@/client/http'
import { MockModule } from '@/modules/mock/mock'
import type { ListMocksResponse } from '@/modules/mock/mock.types'

describe('MockModule', () => {
  const mockClient = mockDeep<BaseClient>()
  const mockModule = new MockModule(mockClient)

  const createMockMock = (overrides?: Partial<Mock>): Mock => ({
    id: faker.string.uuid(),
    endpointId: faker.string.uuid(),
    name: faker.lorem.word(),
    description: faker.lorem.sentence(),
    enabled: faker.datatype.boolean(),
    body: { data: [] },
    statusCode: faker.number.int({ min: 200, max: 599 }),
    delayType: MockDelayType.FIXED,
    delayMs: faker.number.int({ min: 0, max: 5000 }),
    headers: {},
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent(),
    ...overrides,
  })

  const createMockScenario = (
    overrides?: Partial<MockScenario>,
  ): MockScenario => ({
    id: faker.string.uuid(),
    endpointId: faker.string.uuid(),
    name: faker.lorem.word(),
    description: faker.lorem.sentence(),
    active: faker.datatype.boolean(),
    mocks: [],
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent(),
    ...overrides,
  })

  describe('list', () => {
    it('should list mocks for an endpoint', async () => {
      const endpointId = faker.string.uuid()
      const mockResponse: ListMocksResponse = {
        mocks: [
          createMockMock({ endpointId, name: 'Success Response' }),
          createMockMock({ endpointId, name: 'Error Response' }),
        ],
        total: 2,
      }

      mockClient.get.mockReturnValue({
        json: () => Promise.resolve(mockResponse),
      } as never)

      const result = await mockModule.list(endpointId)

      expect(mockClient.get).toHaveBeenCalledWith('mocks', {
        searchParams: { endpointId },
      })
      expect(result).toEqual(mockResponse)
      expect(result.mocks).toHaveLength(2)
    })

    it('should return empty list when endpoint has no mocks', async () => {
      const endpointId = faker.string.uuid()
      const mockResponse: ListMocksResponse = {
        mocks: [],
        total: 0,
      }

      mockClient.get.mockReturnValue({
        json: () => Promise.resolve(mockResponse),
      } as never)

      const result = await mockModule.list(endpointId)

      expect(result.mocks).toHaveLength(0)
      expect(result.total).toBe(0)
    })
  })

  describe('get', () => {
    it('should get mock by id', async () => {
      const mockResponse = createMockMock()

      mockClient.get.mockReturnValue({
        json: () => Promise.resolve(mockResponse),
      } as never)

      const result = await mockModule.get(mockResponse.id)

      expect(mockClient.get).toHaveBeenCalledWith(`mocks/${mockResponse.id}`)
      expect(result).toEqual(mockResponse)
    })
  })
})
