import type { PrismaClient } from '@prisma/client'

import { faker } from '@/__mocks__/faker-adapter'
import {
  AbstractRepository,
  DEFAULT_LIMIT,
  DEFAULT_PAGE,
  MAX_LIMIT,
} from '@/repositories/base'
import {
  createPrismaClientMock,
  PrismaClientMock,
} from '@/tests/repositories/__mocks__'

type TestEntity = {
  id: string
  name: string
  createdAt: Date
}

type TestEntityCreateInput = {
  name: string
}

type TestEntityUpdateInput = {
  name?: string
}

type TestEntityWhereInput = {
  id?: string
  name?: string
}

type TestEntityWhereUniqueInput = {
  id: string
}

type TestEntityOrderByInput = {
  name?: 'asc' | 'desc'
  createdAt?: 'asc' | 'desc'
}

class AbstractRepositoryStub extends AbstractRepository<
  TestEntity,
  TestEntityCreateInput,
  TestEntityUpdateInput,
  TestEntityWhereInput,
  TestEntityWhereUniqueInput,
  TestEntityOrderByInput
> {
  protected modelMock = {
    create: jest.fn(),
    findUnique: jest.fn(),
    findMany: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    count: jest.fn(),
  }

  protected get model(): PrismaClient['user'] {
    return this.modelMock as unknown as PrismaClient['user']
  }

  protected getIdWhereClause(id: string): TestEntityWhereUniqueInput {
    return { id }
  }

  getModelMock(): typeof this.modelMock {
    return this.modelMock
  }
}

type SutTypes = {
  sut: AbstractRepositoryStub
  prismaClientMock: PrismaClientMock
  modelMock: ReturnType<AbstractRepositoryStub['getModelMock']>
}

const makeSut = (): SutTypes => {
  const prismaClientMock = createPrismaClientMock()
  const sut = new AbstractRepositoryStub(prismaClientMock)
  const modelMock = sut.getModelMock()
  return {
    sut,
    prismaClientMock,
    modelMock,
  }
}

const mockTestEntity = (overrides?: Partial<TestEntity>): TestEntity => ({
  id: faker.string.nanoid(),
  name: faker.company.name(),
  createdAt: faker.date.recent(),
  ...overrides,
})

describe('AbstractRepository', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('create', () => {
    it('should create an entity', async () => {
      const { sut, modelMock } = makeSut()
      const mockEntity = mockTestEntity()
      modelMock.create.mockResolvedValue(mockEntity)

      const result = await sut.create({ name: mockEntity.name })

      expect(result).toEqual(mockEntity)
      expect(modelMock.create).toHaveBeenCalledWith({
        data: { name: mockEntity.name },
      })
    })
  })

  describe('findById', () => {
    it('should find entity by id', async () => {
      const { sut, modelMock } = makeSut()
      const mockEntity = mockTestEntity()
      modelMock.findUnique.mockResolvedValue(mockEntity)

      const result = await sut.findById(mockEntity.id)

      expect(result).toEqual(mockEntity)
      expect(modelMock.findUnique).toHaveBeenCalledWith({
        where: { id: mockEntity.id },
      })
    })

    it('should return null when entity not found', async () => {
      const { sut, modelMock } = makeSut()
      modelMock.findUnique.mockResolvedValue(null)

      const result = await sut.findById('non-existent-id')

      expect(result).toBeNull()
    })
  })

  describe('findUnique', () => {
    it('should find entity by unique constraint', async () => {
      const { sut, modelMock } = makeSut()
      const mockEntity = mockTestEntity()
      modelMock.findUnique.mockResolvedValue(mockEntity)

      const result = await sut.findUnique({ id: mockEntity.id })

      expect(result).toEqual(mockEntity)
      expect(modelMock.findUnique).toHaveBeenCalledWith({
        where: { id: mockEntity.id },
      })
    })
  })

  describe('findMany', () => {
    it('should find entities with pagination', async () => {
      const { sut, modelMock } = makeSut()
      const mockEntities = [mockTestEntity(), mockTestEntity()]
      modelMock.findMany.mockResolvedValue(mockEntities)
      modelMock.count.mockResolvedValue(20)

      const result = await sut.findMany({ page: 1, limit: 10 })

      expect(result.data).toEqual(mockEntities)
      expect(result.meta).toEqual({
        total: 20,
        page: 1,
        limit: 10,
        totalPages: 2,
        hasNextPage: true,
        hasPreviousPage: false,
      })
      expect(modelMock.findMany).toHaveBeenCalledWith({
        where: undefined,
        orderBy: undefined,
        skip: 0,
        take: 10,
      })
    })

    it('should apply where filter', async () => {
      const { sut, modelMock } = makeSut()
      const mockEntities = [mockTestEntity({ name: 'Test' })]
      modelMock.findMany.mockResolvedValue(mockEntities)
      modelMock.count.mockResolvedValue(1)

      const result = await sut.findMany({
        where: { name: 'Test' },
        page: 1,
        limit: 10,
      })

      expect(result.data).toEqual(mockEntities)
      expect(modelMock.findMany).toHaveBeenCalledWith({
        where: { name: 'Test' },
        orderBy: undefined,
        skip: 0,
        take: 10,
      })
    })

    it('should apply orderBy', async () => {
      const { sut, modelMock } = makeSut()
      const mockEntities = [mockTestEntity()]
      modelMock.findMany.mockResolvedValue(mockEntities)
      modelMock.count.mockResolvedValue(1)

      await sut.findMany({
        orderBy: { name: 'asc' },
        page: 1,
        limit: 10,
      })

      expect(modelMock.findMany).toHaveBeenCalledWith({
        where: undefined,
        orderBy: { name: 'asc' },
        skip: 0,
        take: 10,
      })
    })

    it('should use default pagination when not provided', async () => {
      const { sut, modelMock } = makeSut()
      modelMock.findMany.mockResolvedValue([])
      modelMock.count.mockResolvedValue(0)

      const result = await sut.findMany()

      expect(result.meta.page).toBe(1)
      expect(result.meta.limit).toBe(20)
      expect(modelMock.findMany).toHaveBeenCalledWith({
        where: undefined,
        orderBy: undefined,
        skip: 0,
        take: 20,
      })
    })

    it('should calculate correct skip value', async () => {
      const { sut, modelMock } = makeSut()
      modelMock.findMany.mockResolvedValue([])
      modelMock.count.mockResolvedValue(50)

      await sut.findMany({ page: 3, limit: 10 })

      expect(modelMock.findMany).toHaveBeenCalledWith({
        where: undefined,
        orderBy: undefined,
        skip: 20,
        take: 10,
      })
    })

    it('should limit max results to 100', async () => {
      const { sut, modelMock } = makeSut()
      modelMock.findMany.mockResolvedValue([])
      modelMock.count.mockResolvedValue(0)

      await sut.findMany({ page: 1, limit: 1000 })

      expect(modelMock.findMany).toHaveBeenCalledWith({
        where: undefined,
        orderBy: undefined,
        skip: 0,
        take: 100,
      })
    })

    it('should normalize page to minimum of 1', async () => {
      const { sut, modelMock } = makeSut()
      modelMock.findMany.mockResolvedValue([])
      modelMock.count.mockResolvedValue(0)

      await sut.findMany({ page: -1, limit: 10 })

      expect(modelMock.findMany).toHaveBeenCalledWith({
        where: undefined,
        orderBy: undefined,
        skip: 0,
        take: 10,
      })
    })
  })

  describe('findAll', () => {
    it('should find all entities without pagination', async () => {
      const { sut, modelMock } = makeSut()
      const mockEntities = [mockTestEntity(), mockTestEntity()]
      modelMock.findMany.mockResolvedValue(mockEntities)

      const result = await sut.findAll()

      expect(result).toEqual(mockEntities)
      expect(modelMock.findMany).toHaveBeenCalledWith({
        where: undefined,
      })
    })

    it('should apply where filter', async () => {
      const { sut, modelMock } = makeSut()
      const mockEntities = [mockTestEntity({ name: 'Test' })]
      modelMock.findMany.mockResolvedValue(mockEntities)

      const result = await sut.findAll({ name: 'Test' })

      expect(result).toEqual(mockEntities)
      expect(modelMock.findMany).toHaveBeenCalledWith({
        where: { name: 'Test' },
      })
    })
  })

  describe('update', () => {
    it('should update an entity', async () => {
      const { sut, modelMock } = makeSut()
      const mockEntity = mockTestEntity()
      const updatedEntity = { ...mockEntity, name: 'Updated' }
      modelMock.update.mockResolvedValue(updatedEntity)

      const result = await sut.update(mockEntity.id, { name: 'Updated' })

      expect(result).toEqual(updatedEntity)
      expect(modelMock.update).toHaveBeenCalledWith({
        where: { id: mockEntity.id },
        data: { name: 'Updated' },
      })
    })
  })

  describe('delete', () => {
    it('should delete an entity', async () => {
      const { sut, modelMock } = makeSut()
      const mockEntity = mockTestEntity()
      modelMock.delete.mockResolvedValue(mockEntity)

      const result = await sut.delete(mockEntity.id)

      expect(result).toEqual(mockEntity)
      expect(modelMock.delete).toHaveBeenCalledWith({
        where: { id: mockEntity.id },
      })
    })
  })

  describe('count', () => {
    it('should count entities', async () => {
      const { sut, modelMock } = makeSut()
      modelMock.count.mockResolvedValue(10)

      const result = await sut.count()

      expect(result).toBe(10)
      expect(modelMock.count).toHaveBeenCalledWith({
        where: undefined,
      })
    })

    it('should count entities with filter', async () => {
      const { sut, modelMock } = makeSut()
      modelMock.count.mockResolvedValue(5)

      const result = await sut.count({ name: 'Test' })

      expect(result).toBe(5)
      expect(modelMock.count).toHaveBeenCalledWith({
        where: { name: 'Test' },
      })
    })
  })

  describe('exists', () => {
    it('should return true when entity exists', async () => {
      const { sut, modelMock } = makeSut()
      modelMock.count.mockResolvedValue(1)

      const result = await sut.exists({ name: 'Test' })

      expect(result).toBe(true)
      expect(modelMock.count).toHaveBeenCalledWith({
        where: { name: 'Test' },
      })
    })

    it('should return false when entity does not exist', async () => {
      const { sut, modelMock } = makeSut()
      modelMock.count.mockResolvedValue(0)

      const result = await sut.exists({ name: 'NonExistent' })

      expect(result).toBe(false)
    })
  })

  describe('exported constants', () => {
    it('should export default pagination constants', () => {
      expect(DEFAULT_PAGE).toBe(1)
      expect(DEFAULT_LIMIT).toBe(20)
      expect(MAX_LIMIT).toBe(100)
    })
  })
})
