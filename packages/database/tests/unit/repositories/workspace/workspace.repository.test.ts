import { faker } from '@/__mocks__/faker-adapter'
import { WorkspaceRepository } from '@/repositories/workspace'
import {
  createPrismaClientMock,
  mockWorkspaceModel,
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
})
