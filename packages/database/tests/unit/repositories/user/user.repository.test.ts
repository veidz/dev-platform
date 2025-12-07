import { UserRepository } from '@/repositories/user'
import {
  createPrismaClientMock,
  mockUserModel,
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
  })
})
