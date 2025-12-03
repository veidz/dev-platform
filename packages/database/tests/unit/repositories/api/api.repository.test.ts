import type { Api, ApiStatus, PrismaClient } from '@prisma/client'
import { DeepMockProxy, mockDeep } from 'jest-mock-extended'

import { faker } from '@/__mocks__/faker-adapter'
import { ApiRepository } from '@/repositories/api'

const createMockApi = (overrides: Partial<Api> = {}): Api => ({
  id: faker.string.nanoid(),
  workspaceId: faker.string.nanoid(),
  name: faker.lorem.word(),
  description: faker.lorem.sentence(),
  baseUrl: faker.internet.url(),
  version: '1.0.0',
  status: 'ACTIVE',
  createdAt: faker.date.past(),
  updatedAt: faker.date.recent(),
  ...overrides,
})

describe('ApiRepository', () => {
  let repository: ApiRepository
  let prismaMock: DeepMockProxy<PrismaClient>

  beforeEach(() => {
    prismaMock = mockDeep<PrismaClient>()
    repository = new ApiRepository(prismaMock)
    jest.clearAllMocks()
  })

  describe('findByWorkspaceId', () => {
    it('should find APIs by workspace id', async () => {
      const workspaceId = faker.string.nanoid()
      const mockApis = [
        createMockApi({ workspaceId }),
        createMockApi({ workspaceId }),
      ]
      prismaMock.api.findMany.mockResolvedValue(mockApis)

      const result = await repository.findByWorkspaceId(workspaceId)

      expect(result).toEqual(mockApis)
      expect(prismaMock.api.findMany).toHaveBeenCalledWith({
        where: { workspaceId },
        orderBy: { createdAt: 'desc' },
      })
    })
  })

  describe('findByNameAndWorkspace', () => {
    it('should find an API by name and workspace', async () => {
      const mockApi = createMockApi()
      prismaMock.api.findUnique.mockResolvedValue(mockApi)

      const result = await repository.findByNameAndWorkspace(
        mockApi.name,
        mockApi.workspaceId,
      )

      expect(result).toEqual(mockApi)
      expect(prismaMock.api.findUnique).toHaveBeenCalledWith({
        where: {
          workspaceId_name: {
            workspaceId: mockApi.workspaceId,
            name: mockApi.name,
          },
        },
      })
    })
  })

  describe('findByStatus', () => {
    it('should find APIs by status', async () => {
      const status: ApiStatus = 'ACTIVE'
      const mockApis = [createMockApi({ status })]
      prismaMock.api.findMany.mockResolvedValue(mockApis)

      const result = await repository.findByStatus(status)

      expect(result).toEqual(mockApis)
      expect(prismaMock.api.findMany).toHaveBeenCalledWith({
        where: { status },
        orderBy: { updatedAt: 'desc' },
      })
    })
  })

  describe('findWithEndpoints', () => {
    it('should find an API with its endpoints', async () => {
      const mockApi = createMockApi()
      const apiWithEndpoints = {
        ...mockApi,
        endpoints: [
          {
            id: faker.string.nanoid(),
            path: '/test',
            method: 'GET',
          },
        ],
      }

      prismaMock.api.findUnique.mockResolvedValue(
        apiWithEndpoints as unknown as Api,
      )

      const result = await repository.findWithEndpoints(mockApi.id)

      expect(result).toEqual(apiWithEndpoints)
      expect(prismaMock.api.findUnique).toHaveBeenCalledWith({
        where: { id: mockApi.id },
        include: { endpoints: true },
      })
    })
  })

  describe('findWithWorkspace', () => {
    it('should find an API with its workspace', async () => {
      const mockApi = createMockApi()
      const apiWithWorkspace = {
        ...mockApi,
        workspace: {
          id: mockApi.workspaceId,
          name: faker.company.name(),
        },
      }

      prismaMock.api.findUnique.mockResolvedValue(
        apiWithWorkspace as unknown as Api,
      )

      const result = await repository.findWithWorkspace(mockApi.id)

      expect(result).toEqual(apiWithWorkspace)
      expect(prismaMock.api.findUnique).toHaveBeenCalledWith({
        where: { id: mockApi.id },
        include: { workspace: true },
      })
    })
  })

  describe('updateStatus', () => {
    it('should update API status', async () => {
      const mockApi = createMockApi({ status: 'DEPRECATED' })
      prismaMock.api.update.mockResolvedValue(mockApi)

      const result = await repository.updateStatus(mockApi.id, 'DEPRECATED')

      expect(result).toEqual(mockApi)
      expect(prismaMock.api.update).toHaveBeenCalledWith({
        where: { id: mockApi.id },
        data: { status: 'DEPRECATED' },
      })
    })
  })

  describe('nameExistsInWorkspace', () => {
    it('should return true when name exists in workspace', async () => {
      prismaMock.api.count.mockResolvedValue(1)

      const result = await repository.nameExistsInWorkspace(
        'api-name',
        'workspace-id',
      )

      expect(result).toBe(true)
      expect(prismaMock.api.count).toHaveBeenCalledWith({
        where: { name: 'api-name', workspaceId: 'workspace-id' },
      })
    })

    it('should return false when name does not exist', async () => {
      prismaMock.api.count.mockResolvedValue(0)

      const result = await repository.nameExistsInWorkspace(
        'new-api',
        'workspace-id',
      )

      expect(result).toBe(false)
    })
  })

  describe('countByWorkspace', () => {
    it('should count APIs by workspace', async () => {
      prismaMock.api.count.mockResolvedValue(5)

      const result = await repository.countByWorkspace('workspace-id')

      expect(result).toBe(5)
      expect(prismaMock.api.count).toHaveBeenCalledWith({
        where: { workspaceId: 'workspace-id' },
      })
    })
  })
})
