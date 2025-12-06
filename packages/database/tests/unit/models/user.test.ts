import { faker } from '@/__mocks__/faker-adapter'
import { prismaMock } from '@/tests/setup'

const createMockUser = (overrides = {}) => ({
  id: faker.string.nanoid(),
  email: faker.internet.email(),
  name: faker.person.fullName(),
  password: faker.string.alphanumeric(20),
  avatar: null,
  emailVerified: false,
  createdAt: faker.date.past(),
  updatedAt: faker.date.recent(),
  ...overrides,
})

describe('User model', () => {
  it('should create a user', async () => {
    const mockUser = createMockUser()

    prismaMock.user.create.mockResolvedValue(mockUser)

    const result = await prismaMock.user.create({
      data: {
        email: mockUser.email,
        name: mockUser.name,
        password: mockUser.password,
      },
    })

    expect(result).toEqual(mockUser)
    expect(prismaMock.user.create).toHaveBeenCalledWith({
      data: {
        email: mockUser.email,
        name: mockUser.name,
        password: mockUser.password,
      },
    })
  })

  it('should find user by email', async () => {
    const mockUser = createMockUser({ emailVerified: true })

    prismaMock.user.findUnique.mockResolvedValue(mockUser)

    const result = await prismaMock.user.findUnique({
      where: { email: mockUser.email },
    })

    expect(result).toEqual(mockUser)
  })

  it('should return null for non-existent user', async () => {
    prismaMock.user.findUnique.mockResolvedValue(null)

    const result = await prismaMock.user.findUnique({
      where: { email: faker.internet.email() },
    })

    expect(result).toBeNull()
  })
})
