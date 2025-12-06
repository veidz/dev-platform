import type { ApiStatus } from '@prisma/client'

import { faker } from '@/__mocks__/faker-adapter'
import { ApiRepository } from '@/repositories/api'
import {
  createPrismaClientMock,
  mockApiModel,
  PrismaClientMock,
} from '@/tests/repositories/__mocks__'

type SutTypes = {
  sut: ApiRepository
  prismaClientMock: PrismaClientMock
}

const makeSut = (): SutTypes => {
  const prismaClientMock = createPrismaClientMock()
  const sut = new ApiRepository(prismaClientMock)
  return {
    sut,
    prismaClientMock,
  }
}

describe('ApiRepository', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('findByWorkspaceId', () => {
    it('should find apis by workspace id', async () => {
      const { sut, prismaClientMock } = makeSut()
      const workspaceId = faker.string.nanoid()
      const mockApis = [
        mockApiModel({ workspaceId }),
        mockApiModel({ workspaceId }),
      ]
      prismaClientMock.api.findMany.mockResolvedValue(mockApis)

      const result = await sut.findByWorkspaceId(workspaceId)

      expect(result).toEqual(mockApis)
      expect(prismaClientMock.api.findMany).toHaveBeenCalledWith({
        where: { workspaceId },
        orderBy: { createdAt: 'desc' },
      })
    })
  })

  describe('findByNameAndWorkspace', () => {
    it('should find api by name and workspace', async () => {
      const { sut, prismaClientMock } = makeSut()
      const mockApi = mockApiModel()
      prismaClientMock.api.findUnique.mockResolvedValue(mockApi)

      const result = await sut.findByNameAndWorkspace(
        mockApi.name,
        mockApi.workspaceId,
      )

      expect(result).toEqual(mockApi)
      expect(prismaClientMock.api.findUnique).toHaveBeenCalledWith({
        where: {
          workspaceId_name: {
            workspaceId: mockApi.workspaceId,
            name: mockApi.name,
          },
        },
      })
    })

    it('should return null when api not found', async () => {
      const { sut, prismaClientMock } = makeSut()
      prismaClientMock.api.findUnique.mockResolvedValue(null)

      const result = await sut.findByNameAndWorkspace(
        'non-existent',
        'workspace-id',
      )

      expect(result).toBeNull()
    })
  })

  describe('findByStatus', () => {
    it('should find apis by status', async () => {
      const { sut, prismaClientMock } = makeSut()
      const status: ApiStatus = 'ACTIVE'
      const mockApis = [mockApiModel({ status }), mockApiModel({ status })]
      prismaClientMock.api.findMany.mockResolvedValue(mockApis)

      const result = await sut.findByStatus(status)

      expect(result).toEqual(mockApis)
      expect(prismaClientMock.api.findMany).toHaveBeenCalledWith({
        where: { status },
        orderBy: { updatedAt: 'desc' },
      })
    })
  })

  describe('findWithEndpoints', () => {
    it('should find api with endpoints included', async () => {
      const { sut, prismaClientMock } = makeSut()
      const mockApi = mockApiModel()
      prismaClientMock.api.findUnique.mockResolvedValue({
        ...mockApi,
        endpoints: [],
      })

      const result = await sut.findWithEndpoints(mockApi.id)

      expect(result).toEqual({ ...mockApi, endpoints: [] })
      expect(prismaClientMock.api.findUnique).toHaveBeenCalledWith({
        where: { id: mockApi.id },
        include: { endpoints: true },
      })
    })
  })

  describe('findWithWorkspace', () => {
    it('should find api with workspace included', async () => {
      const { sut, prismaClientMock } = makeSut()
      const mockApi = mockApiModel()
      prismaClientMock.api.findUnique.mockResolvedValue({
        ...mockApi,
        workspace: {},
      })

      const result = await sut.findWithWorkspace(mockApi.id)

      expect(result).toEqual({ ...mockApi, workspace: {} })
      expect(prismaClientMock.api.findUnique).toHaveBeenCalledWith({
        where: { id: mockApi.id },
        include: { workspace: true },
      })
    })
  })

  describe('updateStatus', () => {
    it('should update api status', async () => {
      const { sut, prismaClientMock } = makeSut()
      const mockApi = mockApiModel()
      const newStatus: ApiStatus = 'INACTIVE'
      const updatedApi = { ...mockApi, status: newStatus }
      prismaClientMock.api.update.mockResolvedValue(updatedApi)

      const result = await sut.updateStatus(mockApi.id, newStatus)

      expect(result).toEqual(updatedApi)
      expect(prismaClientMock.api.update).toHaveBeenCalledWith({
        where: { id: mockApi.id },
        data: { status: newStatus },
      })
    })
  })

  describe('nameExistsInWorkspace', () => {
    it('should return true when name exists in workspace', async () => {
      const { sut, prismaClientMock } = makeSut()
      prismaClientMock.api.count.mockResolvedValue(1)

      const result = await sut.nameExistsInWorkspace('api-name', 'workspace-id')

      expect(result).toBe(true)
      expect(prismaClientMock.api.count).toHaveBeenCalledWith({
        where: { name: 'api-name', workspaceId: 'workspace-id' },
      })
    })

    it('should return false when name does not exist in workspace', async () => {
      const { sut, prismaClientMock } = makeSut()
      prismaClientMock.api.count.mockResolvedValue(0)

      const result = await sut.nameExistsInWorkspace(
        'unique-name',
        'workspace-id',
      )

      expect(result).toBe(false)
    })
  })

  describe('countByWorkspace', () => {
    it('should count apis in workspace', async () => {
      const { sut, prismaClientMock } = makeSut()
      prismaClientMock.api.count.mockResolvedValue(5)

      const result = await sut.countByWorkspace('workspace-id')

      expect(result).toBe(5)
      expect(prismaClientMock.api.count).toHaveBeenCalledWith({
        where: { workspaceId: 'workspace-id' },
      })
    })
  })

  describe('countByStatus', () => {
    it('should count apis by status', async () => {
      const { sut, prismaClientMock } = makeSut()
      const status: ApiStatus = 'ACTIVE'
      prismaClientMock.api.count.mockResolvedValue(10)

      const result = await sut.countByStatus(status)

      expect(result).toBe(10)
      expect(prismaClientMock.api.count).toHaveBeenCalledWith({
        where: { status },
      })
    })
  })

  describe('inherited methods', () => {
    it('should create an api', async () => {
      const { sut, prismaClientMock } = makeSut()
      const mockApi = mockApiModel()
      prismaClientMock.api.create.mockResolvedValue(mockApi)

      const result = await sut.create({
        workspace: { connect: { id: mockApi.workspaceId } },
        name: mockApi.name,
        description: mockApi.description,
        baseUrl: mockApi.baseUrl,
        status: mockApi.status,
      })

      expect(result).toEqual(mockApi)
      expect(prismaClientMock.api.create).toHaveBeenCalled()
    })

    it('should find an api by id', async () => {
      const { sut, prismaClientMock } = makeSut()
      const mockApi = mockApiModel()
      prismaClientMock.api.findUnique.mockResolvedValue(mockApi)

      const result = await sut.findById(mockApi.id)

      expect(result).toEqual(mockApi)
      expect(prismaClientMock.api.findUnique).toHaveBeenCalledWith({
        where: { id: mockApi.id },
      })
    })

    it('should update an api', async () => {
      const { sut, prismaClientMock } = makeSut()
      const mockApi = mockApiModel()
      const updatedApi = { ...mockApi, name: 'Updated API' }
      prismaClientMock.api.update.mockResolvedValue(updatedApi)

      const result = await sut.update(mockApi.id, { name: 'Updated API' })

      expect(result).toEqual(updatedApi)
      expect(prismaClientMock.api.update).toHaveBeenCalledWith({
        where: { id: mockApi.id },
        data: { name: 'Updated API' },
      })
    })

    it('should delete an api', async () => {
      const { sut, prismaClientMock } = makeSut()
      const mockApi = mockApiModel()
      prismaClientMock.api.delete.mockResolvedValue(mockApi)

      const result = await sut.delete(mockApi.id)

      expect(result).toEqual(mockApi)
      expect(prismaClientMock.api.delete).toHaveBeenCalledWith({
        where: { id: mockApi.id },
      })
    })
  })
})
