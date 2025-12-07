import { faker } from '@/__mocks__/faker-adapter'
import { UserRepository } from '@/repositories/user'
import {
  createPrismaClientMock,
  mockUserModel,
  mockUserWithMemberships,
  mockUserWithOwnedWorkspaces,
  PrismaClientMock,
} from '@/tests/repositories/__mocks__'

type SutTypes = {
  sut: UserRepository
  prismaClientMock: PrismaClientMock
}

const makeSut = (): SutTypes => {
  const prismaClientMock = createPrismaClientMock()
  const sut = new UserRepository(prismaClientMock)
  return {
    sut,
    prismaClientMock,
  }
}

describe('UserRepository', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('findByEmail', () => {
    it('should find user by email', async () => {
      const { sut, prismaClientMock } = makeSut()
      const mockUser = mockUserModel()
      prismaClientMock.user.findUnique.mockResolvedValue(mockUser)

      const result = await sut.findByEmail(mockUser.email)

      expect(result).toEqual(mockUser)
      expect(prismaClientMock.user.findUnique).toHaveBeenCalledWith({
        where: { email: mockUser.email },
      })
    })

    it('should return null when user not found', async () => {
      const { sut, prismaClientMock } = makeSut()
      prismaClientMock.user.findUnique.mockResolvedValue(null)

      const result = await sut.findByEmail('nonexistent@email.com')

      expect(result).toBeNull()
    })
  })

  describe('findWithOwnedWorkspaces', () => {
    it('should find user with owned workspaces included', async () => {
      const { sut, prismaClientMock } = makeSut()
      const userWithWorkspaces = mockUserWithOwnedWorkspaces()
      prismaClientMock.user.findUnique.mockResolvedValue(userWithWorkspaces)

      const result = await sut.findWithOwnedWorkspaces(userWithWorkspaces.id)

      expect(result).toEqual(userWithWorkspaces)
      expect(prismaClientMock.user.findUnique).toHaveBeenCalledWith({
        where: { id: userWithWorkspaces.id },
        include: { ownedWorkspaces: true },
      })
    })
  })

  describe('findWithMemberships', () => {
    it('should find user with memberships included', async () => {
      const { sut, prismaClientMock } = makeSut()
      const userWithMemberships = mockUserWithMemberships()
      prismaClientMock.user.findUnique.mockResolvedValue(userWithMemberships)

      const result = await sut.findWithMemberships(userWithMemberships.id)

      expect(result).toEqual(userWithMemberships)
      expect(prismaClientMock.user.findUnique).toHaveBeenCalledWith({
        where: { id: userWithMemberships.id },
        include: { memberships: { include: { workspace: true } } },
      })
    })
  })

  describe('emailExists', () => {
    it('should return true when email exists', async () => {
      const { sut, prismaClientMock } = makeSut()
      prismaClientMock.user.count.mockResolvedValue(1)

      const result = await sut.emailExists('test@email.com')

      expect(result).toBe(true)
      expect(prismaClientMock.user.count).toHaveBeenCalledWith({
        where: { email: 'test@email.com' },
      })
    })

    it('should return false when email does not exist', async () => {
      const { sut, prismaClientMock } = makeSut()
      prismaClientMock.user.count.mockResolvedValue(0)

      const result = await sut.emailExists('new@email.com')

      expect(result).toBe(false)
    })
  })

  describe('updatePassword', () => {
    it('should update user password', async () => {
      const { sut, prismaClientMock } = makeSut()
      const mockUser = mockUserModel()
      const newPasswordHash = faker.string.uuid()
      const updatedUser = { ...mockUser, password: newPasswordHash }
      prismaClientMock.user.update.mockResolvedValue(updatedUser)

      const result = await sut.updatePassword(mockUser.id, newPasswordHash)

      expect(result).toEqual(updatedUser)
      expect(prismaClientMock.user.update).toHaveBeenCalledWith({
        where: { id: mockUser.id },
        data: { password: newPasswordHash },
      })
    })
  })

  describe('verifyEmail', () => {
    it('should verify user email', async () => {
      const { sut, prismaClientMock } = makeSut()
      const mockUser = mockUserModel({ emailVerified: false })
      const verifiedUser = { ...mockUser, emailVerified: true }
      prismaClientMock.user.update.mockResolvedValue(verifiedUser)

      const result = await sut.verifyEmail(mockUser.id)

      expect(result).toEqual(verifiedUser)
      expect(prismaClientMock.user.update).toHaveBeenCalledWith({
        where: { id: mockUser.id },
        data: { emailVerified: true },
      })
    })
  })

  describe('inherited methods', () => {
    it('should create a user', async () => {
      const { sut, prismaClientMock } = makeSut()
      const mockUser = mockUserModel()
      prismaClientMock.user.create.mockResolvedValue(mockUser)

      const result = await sut.create({
        name: mockUser.name,
        email: mockUser.email,
        password: mockUser.password,
        avatar: mockUser.avatar,
      })

      expect(result).toEqual(mockUser)
      expect(prismaClientMock.user.create).toHaveBeenCalled()
    })

    it('should find a user by id', async () => {
      const { sut, prismaClientMock } = makeSut()
      const mockUser = mockUserModel()
      prismaClientMock.user.findUnique.mockResolvedValue(mockUser)

      const result = await sut.findById(mockUser.id)

      expect(result).toEqual(mockUser)
      expect(prismaClientMock.user.findUnique).toHaveBeenCalledWith({
        where: { id: mockUser.id },
      })
    })
  })
})
