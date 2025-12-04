import { PrismaClient } from '@prisma/client'
import { DeepMockProxy, mockDeep } from 'jest-mock-extended'

import { AbstractRepository } from '@/repositories/base'

interface TestModel {
  id: string
  name: string
  createdAt: Date
}

interface TestCreateInput {
  name: string
}

interface TestUpdateInput {
  name?: string
}

interface TestWhereInput {
  name?: string
}

interface TestWhereUniqueInput {
  id?: string
}

interface TestOrderByInput {
  createdAt?: 'asc' | 'desc'
}

const mockPrismaDelegate = {
  create: jest.fn(),
  findUnique: jest.fn(),
  findMany: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  count: jest.fn(),
}

class AbstractRepositoryStub extends AbstractRepository<
  TestModel,
  TestCreateInput,
  TestUpdateInput,
  TestWhereInput,
  TestWhereUniqueInput,
  TestOrderByInput
> {
  protected get model() {
    return mockPrismaDelegate as unknown as ReturnType<
      typeof this.getModelFromPrisma
    >
  }

  protected getIdWhereClause(id: string): TestWhereUniqueInput {
    return { id }
  }

  private getModelFromPrisma() {
    return mockPrismaDelegate
  }
}

describe('AbstractRepository', () => {
  let repository: AbstractRepositoryStub
  let prismaMock: DeepMockProxy<PrismaClient>

  beforeEach(() => {
    prismaMock = mockDeep<PrismaClient>()
    repository = new AbstractRepositoryStub(prismaMock)
    jest.clearAllMocks()
  })

  describe('create', () => {
    it('should create a new record', async () => {
      const createData: TestCreateInput = { name: 'Test' }
      const createdRecord: TestModel = {
        id: '1',
        name: 'Test',
        createdAt: new Date(),
      }

      mockPrismaDelegate.create.mockResolvedValue(createdRecord)

      const result = await repository.create(createData)

      expect(result).toEqual(createdRecord)
      expect(mockPrismaDelegate.create).toHaveBeenCalledWith({
        data: createData,
      })
    })
  })
})
