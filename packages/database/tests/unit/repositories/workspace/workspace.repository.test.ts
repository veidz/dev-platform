import { faker } from '@/__mocks__/faker-adapter'
import { WorkspaceRepository } from '@/repositories/workspace'
import {
  createPrismaClientMock,
  mockWorkspaceModel,
  mockWorkspaceWithApis,
  mockWorkspaceWithMembers,
  mockWorkspaceWithOwner,
  PrismaClientMock,
} from '@/tests/repositories/__mocks__'

type SutTypes = {
  sut: WorkspaceRepository
  prismaClientMock: PrismaClientMock
}

const makeSut = (): SutTypes => {
  const prismaClientMock = createPrismaClientMock()
  const sut = new WorkspaceRepository(prismaClientMock)
  return {
    sut,
    prismaClientMock,
  }
}

describe('WorkspaceRepository', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('findBySlug', () => {
    it('should find workspace by slug', async () => {
      const { sut, prismaClientMock } = makeSut()
      const mockWorkspace = mockWorkspaceModel()
      prismaClientMock.workspace.findUnique.mockResolvedValue(mockWorkspace)

      const result = await sut.findBySlug(mockWorkspace.slug)

      expect(result).toEqual(mockWorkspace)
      expect(prismaClientMock.workspace.findUnique).toHaveBeenCalledWith({
        where: { slug: mockWorkspace.slug },
      })
    })

    it('should return null when workspace not found', async () => {
      const { sut, prismaClientMock } = makeSut()
      prismaClientMock.workspace.findUnique.mockResolvedValue(null)

      const result = await sut.findBySlug('non-existent-slug')

      expect(result).toBeNull()
    })
  })

  describe('findByOwnerId', () => {
    it('should find workspaces by owner id', async () => {
      const { sut, prismaClientMock } = makeSut()
      const ownerId = faker.string.nanoid()
      const mockWorkspaces = [
        mockWorkspaceModel({ ownerId }),
        mockWorkspaceModel({ ownerId }),
      ]
      prismaClientMock.workspace.findMany.mockResolvedValue(mockWorkspaces)

      const result = await sut.findByOwnerId(ownerId)

      expect(result).toEqual(mockWorkspaces)
      expect(prismaClientMock.workspace.findMany).toHaveBeenCalledWith({
        where: { ownerId },
        orderBy: { createdAt: 'desc' },
      })
    })
  })

  describe('findWithApis', () => {
    it('should find workspace with apis included', async () => {
      const { sut, prismaClientMock } = makeSut()
      const workspaceWithApis = mockWorkspaceWithApis()
      prismaClientMock.workspace.findUnique.mockResolvedValue(workspaceWithApis)

      const result = await sut.findWithApis(workspaceWithApis.id)

      expect(result).toEqual(workspaceWithApis)
      expect(prismaClientMock.workspace.findUnique).toHaveBeenCalledWith({
        where: { id: workspaceWithApis.id },
        include: { apis: true },
      })
    })
  })

  describe('findWithOwner', () => {
    it('should find workspace with owner included', async () => {
      const { sut, prismaClientMock } = makeSut()
      const workspaceWithOwner = mockWorkspaceWithOwner()
      prismaClientMock.workspace.findUnique.mockResolvedValue(
        workspaceWithOwner,
      )

      const result = await sut.findWithOwner(workspaceWithOwner.id)

      expect(result).toEqual(workspaceWithOwner)
      expect(prismaClientMock.workspace.findUnique).toHaveBeenCalledWith({
        where: { id: workspaceWithOwner.id },
        include: { owner: true },
      })
    })
  })

  describe('findWithMembers', () => {
    it('should find workspace with members included', async () => {
      const { sut, prismaClientMock } = makeSut()
      const workspaceWithMembers = mockWorkspaceWithMembers()
      prismaClientMock.workspace.findUnique.mockResolvedValue(
        workspaceWithMembers,
      )

      const result = await sut.findWithMembers(workspaceWithMembers.id)

      expect(result).toEqual(workspaceWithMembers)
      expect(prismaClientMock.workspace.findUnique).toHaveBeenCalledWith({
        where: { id: workspaceWithMembers.id },
        include: { members: { include: { user: true } } },
      })
    })
  })

  describe('slugExists', () => {
    it('should return true when slug exists', async () => {
      const { sut, prismaClientMock } = makeSut()
      prismaClientMock.workspace.count.mockResolvedValue(1)

      const result = await sut.slugExists('existing-slug')

      expect(result).toBe(true)
      expect(prismaClientMock.workspace.count).toHaveBeenCalledWith({
        where: { slug: 'existing-slug' },
      })
    })

    it('should return false when slug does not exist', async () => {
      const { sut, prismaClientMock } = makeSut()
      prismaClientMock.workspace.count.mockResolvedValue(0)

      const result = await sut.slugExists('unique-slug')

      expect(result).toBe(false)
    })
  })

  describe('countByOwner', () => {
    it('should count workspaces by owner', async () => {
      const { sut, prismaClientMock } = makeSut()
      prismaClientMock.workspace.count.mockResolvedValue(3)

      const result = await sut.countByOwner('owner-id')

      expect(result).toBe(3)
      expect(prismaClientMock.workspace.count).toHaveBeenCalledWith({
        where: { ownerId: 'owner-id' },
      })
    })
  })

  describe('inherited methods', () => {
    it('should create a workspace', async () => {
      const { sut, prismaClientMock } = makeSut()
      const mockWorkspace = mockWorkspaceModel()
      prismaClientMock.workspace.create.mockResolvedValue(mockWorkspace)

      const result = await sut.create({
        owner: { connect: { id: mockWorkspace.ownerId } },
        name: mockWorkspace.name,
        slug: mockWorkspace.slug,
        description: mockWorkspace.description,
      })

      expect(result).toEqual(mockWorkspace)
      expect(prismaClientMock.workspace.create).toHaveBeenCalled()
    })

    it('should find a workspace by id', async () => {
      const { sut, prismaClientMock } = makeSut()
      const mockWorkspace = mockWorkspaceModel()
      prismaClientMock.workspace.findUnique.mockResolvedValue(mockWorkspace)

      const result = await sut.findById(mockWorkspace.id)

      expect(result).toEqual(mockWorkspace)
      expect(prismaClientMock.workspace.findUnique).toHaveBeenCalledWith({
        where: { id: mockWorkspace.id },
      })
    })
  })
})
