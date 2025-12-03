import type { PrismaClient, RefreshToken } from '@prisma/client'
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
  })
})
