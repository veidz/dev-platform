import type { Api, PrismaClient } from '@prisma/client'
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
})
