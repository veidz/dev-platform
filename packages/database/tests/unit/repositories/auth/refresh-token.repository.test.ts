import type { Prisma, PrismaClient, RefreshToken } from '@prisma/client'
import { DeepMockProxy, mockDeep } from 'jest-mock-extended'

import { faker } from '@/__mocks__/faker-adapter'
import { RefreshTokenRepository } from '@/repositories/auth'

const createMockRefreshToken = (
  overrides: Partial<RefreshToken> = {},
): RefreshToken => ({
  id: faker.string.nanoid(),
  userId: faker.string.nanoid(),
  token: faker.string.alphanumeric(64),
  expiresAt: faker.date.future(),
  createdAt: faker.date.past(),
  ...overrides,
})

describe('RefreshTokenRepository', () => {
  let repository: RefreshTokenRepository
  let prismaMock: DeepMockProxy<PrismaClient>

  beforeEach(() => {
    prismaMock = mockDeep<PrismaClient>()
    repository = new RefreshTokenRepository(prismaMock)
    jest.clearAllMocks()
  })

  describe('findByToken', () => {
    it('should find a refresh token by token', async () => {
      const mockToken = createMockRefreshToken()
      prismaMock.refreshToken.findUnique.mockResolvedValue(mockToken)

      const result = await repository.findByToken(mockToken.token)

      expect(result).toEqual(mockToken)
      expect(prismaMock.refreshToken.findUnique).toHaveBeenCalledWith({
        where: { token: mockToken.token },
      })
    })

    it('should return null when token not found', async () => {
      prismaMock.refreshToken.findUnique.mockResolvedValue(null)

      const result = await repository.findByToken('non-existent')

      expect(result).toBeNull()
    })
  })

  describe('findByUserId', () => {
    it('should find refresh tokens by user id', async () => {
      const userId = faker.string.nanoid()
      const mockTokens = [
        createMockRefreshToken({ userId }),
        createMockRefreshToken({ userId }),
      ]
      prismaMock.refreshToken.findMany.mockResolvedValue(mockTokens)

      const result = await repository.findByUserId(userId)

      expect(result).toEqual(mockTokens)
      expect(prismaMock.refreshToken.findMany).toHaveBeenCalledWith({
        where: { userId },
        orderBy: { createdAt: 'desc' },
      })
    })
  })

  describe('findValidByUserId', () => {
    it('should find valid (non-expired) refresh tokens', async () => {
      const userId = faker.string.nanoid()
      const mockTokens = [createMockRefreshToken({ userId })]
      prismaMock.refreshToken.findMany.mockResolvedValue(mockTokens)

      const result = await repository.findValidByUserId(userId)

      expect(result).toEqual(mockTokens)
      expect(prismaMock.refreshToken.findMany).toHaveBeenCalledWith({
        where: {
          userId,
          expiresAt: { gt: expect.any(Date) },
        },
        orderBy: { createdAt: 'desc' },
      })
    })
  })

  describe('deleteByToken', () => {
    it('should delete a refresh token by token', async () => {
      const mockToken = createMockRefreshToken()
      prismaMock.refreshToken.delete.mockResolvedValue(mockToken)

      const result = await repository.deleteByToken(mockToken.token)

      expect(result).toEqual(mockToken)
      expect(prismaMock.refreshToken.delete).toHaveBeenCalledWith({
        where: { token: mockToken.token },
      })
    })
  })

  describe('deleteByUserId', () => {
    it('should delete all refresh tokens for a user', async () => {
      const batchPayload: Prisma.BatchPayload = { count: 3 }
      prismaMock.refreshToken.deleteMany.mockResolvedValue(batchPayload)

      const result = await repository.deleteByUserId('user-id')

      expect(result).toEqual(batchPayload)
      expect(prismaMock.refreshToken.deleteMany).toHaveBeenCalledWith({
        where: { userId: 'user-id' },
      })
    })
  })
})
