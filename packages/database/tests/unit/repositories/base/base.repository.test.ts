import { PrismaClient } from '@prisma/client'
import { DeepMockProxy, mockDeep } from 'jest-mock-extended'

import type { FindManyOptions, PaginatedResult } from '@/repositories/base'
import {
  AbstractRepository,
  DEFAULT_LIMIT,
  DEFAULT_PAGE,
  MAX_LIMIT,
} from '@/repositories/base'

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

  describe('findById', () => {
    it('should find a record by id', async () => {
      const record: TestModel = {
        id: '1',
        name: 'Test',
        createdAt: new Date(),
      }

      mockPrismaDelegate.findUnique.mockResolvedValue(record)

      const result = await repository.findById('1')

      expect(result).toEqual(record)
      expect(mockPrismaDelegate.findUnique).toHaveBeenCalledWith({
        where: { id: '1' },
      })
    })

    it('should return null when record not found', async () => {
      mockPrismaDelegate.findUnique.mockResolvedValue(null)

      const result = await repository.findById('non-existent')

      expect(result).toBeNull()
    })
  })

  describe('findUnique', () => {
    it('should find a unique record by where condition', async () => {
      const record: TestModel = {
        id: '1',
        name: 'Test',
        createdAt: new Date(),
      }

      mockPrismaDelegate.findUnique.mockResolvedValue(record)

      const result = await repository.findUnique({ id: '1' })

      expect(result).toEqual(record)
      expect(mockPrismaDelegate.findUnique).toHaveBeenCalledWith({
        where: { id: '1' },
      })
    })
  })

  describe('findMany', () => {
    const mockRecords: TestModel[] = [
      { id: '1', name: 'Test 1', createdAt: new Date() },
      { id: '2', name: 'Test 2', createdAt: new Date() },
    ]

    it('should return paginated results with defaults', async () => {
      mockPrismaDelegate.findMany.mockResolvedValue(mockRecords)
      mockPrismaDelegate.count.mockResolvedValue(2)

      const result: PaginatedResult<TestModel> = await repository.findMany()

      expect(result.data).toEqual(mockRecords)
      expect(result.meta.page).toBe(DEFAULT_PAGE)
      expect(result.meta.limit).toBe(DEFAULT_LIMIT)
      expect(result.meta.total).toBe(2)
      expect(result.meta.totalPages).toBe(1)
      expect(result.meta.hasNextPage).toBe(false)
      expect(result.meta.hasPreviousPage).toBe(false)
      expect(mockPrismaDelegate.findMany).toHaveBeenCalledWith({
        skip: 0,
        take: DEFAULT_LIMIT,
        where: undefined,
        orderBy: undefined,
      })
    })

    it('should apply custom pagination options', async () => {
      const options: FindManyOptions<TestWhereInput, TestOrderByInput> = {
        page: 2,
        limit: 10,
        where: { name: 'Test' },
        orderBy: { createdAt: 'desc' },
      }

      mockPrismaDelegate.findMany.mockResolvedValue(mockRecords)
      mockPrismaDelegate.count.mockResolvedValue(25)

      const result = await repository.findMany(options)

      expect(result.meta.page).toBe(2)
      expect(result.meta.limit).toBe(10)
      expect(result.meta.total).toBe(25)
      expect(result.meta.totalPages).toBe(3)
      expect(result.meta.hasNextPage).toBe(true)
      expect(result.meta.hasPreviousPage).toBe(true)
      expect(mockPrismaDelegate.findMany).toHaveBeenCalledWith({
        skip: 10,
        take: 10,
        where: { name: 'Test' },
        orderBy: { createdAt: 'desc' },
      })
    })

    it('should enforce MAX_LIMIT', async () => {
      mockPrismaDelegate.findMany.mockResolvedValue([])
      mockPrismaDelegate.count.mockResolvedValue(0)

      await repository.findMany({ limit: 1000 })

      expect(mockPrismaDelegate.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ take: MAX_LIMIT }),
      )
    })

    it('should calculate correct totalPages', async () => {
      mockPrismaDelegate.findMany.mockResolvedValue([])
      mockPrismaDelegate.count.mockResolvedValue(33)

      const result = await repository.findMany({ limit: 10 })

      expect(result.meta.totalPages).toBe(4)
    })

    it('should handle empty results', async () => {
      mockPrismaDelegate.findMany.mockResolvedValue([])
      mockPrismaDelegate.count.mockResolvedValue(0)

      const result = await repository.findMany()

      expect(result.data).toEqual([])
      expect(result.meta.total).toBe(0)
      expect(result.meta.totalPages).toBe(0)
      expect(result.meta.hasNextPage).toBe(false)
      expect(result.meta.hasPreviousPage).toBe(false)
    })
  })
})
