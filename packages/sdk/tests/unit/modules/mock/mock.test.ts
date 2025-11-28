import type {
  CreateMockDto,
  CreateScenarioDto,
  Mock,
  MockScenario,
  UpdateMockDto,
} from '@dev-platform/types'
import { MockDelayType } from '@dev-platform/types'
import { describe, expect, it } from '@jest/globals'
import { mockDeep } from 'jest-mock-extended'

import { faker } from '@/__mocks__/faker-adapter'
import type { BaseClient } from '@/client/http'
import { MockModule } from '@/modules/mock/mock'
import type {
  ListMocksResponse,
  ListScenariosResponse,
} from '@/modules/mock/mock.types'

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

  describe('create', () => {
    it('should create mock with minimal data', async () => {
      const createDto: CreateMockDto = {
        endpointId: faker.string.uuid(),
        name: 'Success Response',
        body: { message: 'OK' },
        statusCode: 200,
        delayType: MockDelayType.NONE,
      }
      const mockResponse = createMockMock(createDto)

      mockClient.post.mockReturnValue({
        json: () => Promise.resolve(mockResponse),
      } as never)

      const result = await mockModule.create(createDto)

      expect(mockClient.post).toHaveBeenCalledWith('mocks', {
        json: createDto,
      })
      expect(result).toEqual(mockResponse)
    })

    it('should create mock with all fields', async () => {
      const createDto: CreateMockDto = {
        endpointId: faker.string.uuid(),
        name: 'Custom Response',
        description: 'Response with delay and headers',
        body: { data: [1, 2, 3] },
        statusCode: 201,
        delayType: MockDelayType.FIXED,
        delayMs: 1000,
        headers: { 'X-Custom': 'value' },
      }
      const mockResponse = createMockMock(createDto)

      mockClient.post.mockReturnValue({
        json: () => Promise.resolve(mockResponse),
      } as never)

      const result = await mockModule.create(createDto)

      expect(result).toEqual(mockResponse)
      expect(result.delayMs).toBe(1000)
      expect(result.headers).toEqual({ 'X-Custom': 'value' })
    })
  })

  describe('update', () => {
    it('should update mock name', async () => {
      const id = faker.string.uuid()
      const updateDto: UpdateMockDto = {
        name: 'Updated Name',
      }
      const mockResponse = createMockMock({ id, ...updateDto })

      mockClient.patch.mockReturnValue({
        json: () => Promise.resolve(mockResponse),
      } as never)

      const result = await mockModule.update(id, updateDto)

      expect(mockClient.patch).toHaveBeenCalledWith(`mocks/${id}`, {
        json: updateDto,
      })
      expect(result.name).toBe('Updated Name')
    })

    it('should update mock body and status code', async () => {
      const id = faker.string.uuid()
      const updateDto: UpdateMockDto = {
        body: { error: 'Not Found' },
        statusCode: 404,
      }
      const mockResponse = createMockMock({ id, ...updateDto })

      mockClient.patch.mockReturnValue({
        json: () => Promise.resolve(mockResponse),
      } as never)

      const result = await mockModule.update(id, updateDto)

      expect(result.statusCode).toBe(404)
      expect(result.body).toEqual({ error: 'Not Found' })
    })

    it('should update mock delay', async () => {
      const id = faker.string.uuid()
      const updateDto: UpdateMockDto = {
        delayMs: 2000,
      }
      const mockResponse = createMockMock({ id, delayMs: 2000 })

      mockClient.patch.mockReturnValue({
        json: () => Promise.resolve(mockResponse),
      } as never)

      const result = await mockModule.update(id, updateDto)

      expect(result.delayMs).toBe(2000)
    })
  })

  describe('delete', () => {
    it('should delete mock', async () => {
      const id = faker.string.uuid()

      mockClient.delete.mockReturnValue({
        json: () => Promise.resolve(),
      } as never)

      await mockModule.delete(id)

      expect(mockClient.delete).toHaveBeenCalledWith(`mocks/${id}`)
    })

    it('should not throw when deleting non-existent mock', async () => {
      const id = faker.string.uuid()

      mockClient.delete.mockReturnValue({
        json: () => Promise.resolve(),
      } as never)

      await expect(mockModule.delete(id)).resolves.toBeUndefined()
    })
  })

  describe('enable', () => {
    it('should enable mock', async () => {
      const id = faker.string.uuid()
      const mockResponse = createMockMock({ id, enabled: true })

      mockClient.patch.mockReturnValue({
        json: () => Promise.resolve(mockResponse),
      } as never)

      const result = await mockModule.enable(id)

      expect(mockClient.patch).toHaveBeenCalledWith(`mocks/${id}/enable`)
      expect(result.enabled).toBe(true)
    })
  })

  describe('disable', () => {
    it('should disable mock', async () => {
      const id = faker.string.uuid()
      const mockResponse = createMockMock({ id, enabled: false })

      mockClient.patch.mockReturnValue({
        json: () => Promise.resolve(mockResponse),
      } as never)

      const result = await mockModule.disable(id)

      expect(mockClient.patch).toHaveBeenCalledWith(`mocks/${id}/disable`)
      expect(result.enabled).toBe(false)
    })
  })

  describe('listScenarios', () => {
    it('should list scenarios for an endpoint', async () => {
      const endpointId = faker.string.uuid()
      const mockResponse: ListScenariosResponse = {
        scenarios: [
          createMockScenario({ endpointId, name: 'Happy Path' }),
          createMockScenario({ endpointId, name: 'Error Scenario' }),
        ],
        total: 2,
      }

      mockClient.get.mockReturnValue({
        json: () => Promise.resolve(mockResponse),
      } as never)

      const result = await mockModule.listScenarios(endpointId)

      expect(mockClient.get).toHaveBeenCalledWith('mock-scenarios', {
        searchParams: { endpointId },
      })
      expect(result).toEqual(mockResponse)
      expect(result.scenarios).toHaveLength(2)
    })

    it('should return empty list when endpoint has no scenarios', async () => {
      const endpointId = faker.string.uuid()
      const mockResponse: ListScenariosResponse = {
        scenarios: [],
        total: 0,
      }

      mockClient.get.mockReturnValue({
        json: () => Promise.resolve(mockResponse),
      } as never)

      const result = await mockModule.listScenarios(endpointId)

      expect(result.scenarios).toHaveLength(0)
      expect(result.total).toBe(0)
    })
  })

  describe('getScenario', () => {
    it('should get scenario by id', async () => {
      const mockResponse = createMockScenario()

      mockClient.get.mockReturnValue({
        json: () => Promise.resolve(mockResponse),
      } as never)

      const result = await mockModule.getScenario(mockResponse.id)

      expect(mockClient.get).toHaveBeenCalledWith(
        `mock-scenarios/${mockResponse.id}`,
      )
      expect(result).toEqual(mockResponse)
    })
  })

  describe('createScenario', () => {
    it('should create scenario with minimal data', async () => {
      const createDto: CreateScenarioDto = {
        endpointId: faker.string.uuid(),
        name: 'Happy Path',
        mockIds: [],
      }
      const mockResponse = createMockScenario(createDto)

      mockClient.post.mockReturnValue({
        json: () => Promise.resolve(mockResponse),
      } as never)

      const result = await mockModule.createScenario(createDto)

      expect(mockClient.post).toHaveBeenCalledWith('mock-scenarios', {
        json: createDto,
      })
      expect(result).toEqual(mockResponse)
    })

    it('should create scenario with mocks', async () => {
      const mockId1 = faker.string.uuid()
      const mockId2 = faker.string.uuid()
      const createDto: CreateScenarioDto = {
        endpointId: faker.string.uuid(),
        name: 'Error Flow',
        description: 'Simulate error responses',
        mockIds: [mockId1, mockId2],
      }
      const mockResponse = createMockScenario({
        ...createDto,
        mocks: [
          createMockMock({ id: mockId1 }),
          createMockMock({ id: mockId2 }),
        ],
      })

      mockClient.post.mockReturnValue({
        json: () => Promise.resolve(mockResponse),
      } as never)

      const result = await mockModule.createScenario(createDto)

      expect(mockClient.post).toHaveBeenCalledWith('mock-scenarios', {
        json: createDto,
      })
      expect(result).toEqual(mockResponse)
      expect(result.mocks).toHaveLength(2)
    })
  })
})
