import type { Prisma } from '@prisma/client'

import { faker } from '@/__mocks__/faker-adapter'
import { RefreshTokenRepository } from '@/repositories/auth'
import {
  createPrismaClientMock,
  mockRefreshTokenModel,
  PrismaClientMock,
} from '@/tests/repositories/__mocks__'

type SutTypes = {
  sut: RefreshTokenRepository
  prismaClientMock: PrismaClientMock
}

const makeSut = (): SutTypes => {
  const prismaClientMock = createPrismaClientMock()
  const sut = new RefreshTokenRepository(prismaClientMock)
  return {
    sut,
    prismaClientMock,
  }
}

describe('RefreshTokenRepository', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('findByToken', () => {
    it('should find refresh token by token string', async () => {
      const { sut, prismaClientMock } = makeSut()
      const mockToken = mockRefreshTokenModel()
      prismaClientMock.refreshToken.findUnique.mockResolvedValue(mockToken)

      const result = await sut.findByToken(mockToken.token)

      expect(result).toEqual(mockToken)
      expect(prismaClientMock.refreshToken.findUnique).toHaveBeenCalledWith({
        where: { token: mockToken.token },
      })
    })

    it('should return null when token not found', async () => {
      const { sut, prismaClientMock } = makeSut()
      prismaClientMock.refreshToken.findUnique.mockResolvedValue(null)

      const result = await sut.findByToken('non-existent-token')

      expect(result).toBeNull()
    })
  })

  describe('findByUserId', () => {
    it('should find refresh tokens by user id', async () => {
      const { sut, prismaClientMock } = makeSut()
      const userId = faker.string.nanoid()
      const mockTokens = [
        mockRefreshTokenModel({ userId }),
        mockRefreshTokenModel({ userId }),
      ]
      prismaClientMock.refreshToken.findMany.mockResolvedValue(mockTokens)

      const result = await sut.findByUserId(userId)

      expect(result).toEqual(mockTokens)
      expect(prismaClientMock.refreshToken.findMany).toHaveBeenCalledWith({
        where: { userId },
        orderBy: { createdAt: 'desc' },
      })
    })
  })

  describe('findValidByUserId', () => {
    it('should find valid refresh tokens by user id', async () => {
      const { sut, prismaClientMock } = makeSut()
      const userId = faker.string.nanoid()
      const mockTokens = [mockRefreshTokenModel({ userId })]
      prismaClientMock.refreshToken.findMany.mockResolvedValue(mockTokens)

      const result = await sut.findValidByUserId(userId)

      expect(result).toEqual(mockTokens)
      expect(prismaClientMock.refreshToken.findMany).toHaveBeenCalledWith({
        where: {
          userId,
          expiresAt: { gt: expect.any(Date) },
        },
        orderBy: { createdAt: 'desc' },
      })
    })
  })

  describe('deleteByToken', () => {
    it('should delete refresh token by token string', async () => {
      const { sut, prismaClientMock } = makeSut()
      const mockToken = mockRefreshTokenModel()
      prismaClientMock.refreshToken.delete.mockResolvedValue(mockToken)

      const result = await sut.deleteByToken(mockToken.token)

      expect(result).toEqual(mockToken)
      expect(prismaClientMock.refreshToken.delete).toHaveBeenCalledWith({
        where: { token: mockToken.token },
      })
    })
  })

  describe('deleteByUserId', () => {
    it('should delete all refresh tokens for a user', async () => {
      const { sut, prismaClientMock } = makeSut()
      const batchPayload: Prisma.BatchPayload = { count: 5 }
      prismaClientMock.refreshToken.deleteMany.mockResolvedValue(batchPayload)

      const result = await sut.deleteByUserId('user-id')

      expect(result).toEqual(batchPayload)
      expect(prismaClientMock.refreshToken.deleteMany).toHaveBeenCalledWith({
        where: { userId: 'user-id' },
      })
    })
  })

  describe('deleteExpired', () => {
    it('should delete expired refresh tokens', async () => {
      const { sut, prismaClientMock } = makeSut()
      const batchPayload: Prisma.BatchPayload = { count: 10 }
      prismaClientMock.refreshToken.deleteMany.mockResolvedValue(batchPayload)

      const result = await sut.deleteExpired()

      expect(result).toEqual(batchPayload)
      expect(prismaClientMock.refreshToken.deleteMany).toHaveBeenCalledWith({
        where: { expiresAt: { lt: expect.any(Date) } },
      })
    })
  })

  describe('countByUserId', () => {
    it('should count refresh tokens by user id', async () => {
      const { sut, prismaClientMock } = makeSut()
      prismaClientMock.refreshToken.count.mockResolvedValue(3)

      const result = await sut.countByUserId('user-id')

      expect(result).toBe(3)
      expect(prismaClientMock.refreshToken.count).toHaveBeenCalledWith({
        where: { userId: 'user-id' },
      })
    })
  })

  describe('inherited methods', () => {
    it('should create a refresh token', async () => {
      const { sut, prismaClientMock } = makeSut()
      const mockToken = mockRefreshTokenModel()
      prismaClientMock.refreshToken.create.mockResolvedValue(mockToken)

      const result = await sut.create({
        user: { connect: { id: mockToken.userId } },
        token: mockToken.token,
        expiresAt: mockToken.expiresAt,
      })

      expect(result).toEqual(mockToken)
      expect(prismaClientMock.refreshToken.create).toHaveBeenCalled()
    })

    it('should find a refresh token by id', async () => {
      const { sut, prismaClientMock } = makeSut()
      const mockToken = mockRefreshTokenModel()
      prismaClientMock.refreshToken.findUnique.mockResolvedValue(mockToken)

      const result = await sut.findById(mockToken.id)

      expect(result).toEqual(mockToken)
      expect(prismaClientMock.refreshToken.findUnique).toHaveBeenCalledWith({
        where: { id: mockToken.id },
      })
    })

    it('should delete a refresh token by id', async () => {
      const { sut, prismaClientMock } = makeSut()
      const mockToken = mockRefreshTokenModel()
      prismaClientMock.refreshToken.delete.mockResolvedValue(mockToken)

      const result = await sut.delete(mockToken.id)

      expect(result).toEqual(mockToken)
      expect(prismaClientMock.refreshToken.delete).toHaveBeenCalledWith({
        where: { id: mockToken.id },
      })
    })
  })
})
