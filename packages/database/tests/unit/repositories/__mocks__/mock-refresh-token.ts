import type { RefreshToken } from '@prisma/client'

import { faker } from '@/__mocks__/faker-adapter'

const mockRefreshTokenModel = (
  overrides: Partial<RefreshToken> = {},
): RefreshToken => ({
  id: faker.string.nanoid(),
  userId: faker.string.nanoid(),
  token: faker.string.alphanumeric(64),
  expiresAt: faker.date.future(),
  createdAt: faker.date.past(),
  ...overrides,
})

const mockRefreshTokenModels = (
  count: number = 2,
  overrides: Partial<RefreshToken> = {},
): RefreshToken[] =>
  Array.from({ length: count }, () => mockRefreshTokenModel(overrides))

export { mockRefreshTokenModel, mockRefreshTokenModels }
