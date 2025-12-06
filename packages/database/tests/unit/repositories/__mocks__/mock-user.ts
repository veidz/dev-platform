import type { User } from '@prisma/client'

import { faker } from '@/__mocks__/faker-adapter'

const mockUserModel = (overrides: Partial<User> = {}): User => ({
  id: faker.string.nanoid(),
  email: faker.internet.email(),
  name: faker.person.fullName(),
  password: faker.string.alphanumeric(60),
  avatar: null,
  emailVerified: false,
  createdAt: faker.date.past(),
  updatedAt: faker.date.recent(),
  ...overrides,
})

const mockUserModels = (
  count: number = 2,
  overrides: Partial<User> = {},
): User[] => Array.from({ length: count }, () => mockUserModel(overrides))

export { mockUserModel, mockUserModels }
