import { Role } from '@prisma/client'

import { faker } from '@/__mocks__/faker-adapter'
import { prismaMock } from '@/tests/setup'

const createMockWorkspace = (overrides = {}) => ({
  id: faker.string.nanoid(),
  name: faker.company.name(),
  slug: faker.helpers.slugify(faker.company.name()).toLowerCase(),
  description: faker.lorem.sentence(),
  ownerId: faker.string.nanoid(),
  createdAt: faker.date.past(),
  updatedAt: faker.date.recent(),
  ...overrides,
})

const createMockWorkspaceMember = (overrides = {}) => ({
  id: faker.string.nanoid(),
  workspaceId: faker.string.nanoid(),
  userId: faker.string.nanoid(),
  role: faker.helpers.arrayElement(Object.values(Role)),
  joinedAt: faker.date.past(),
  ...overrides,
})

describe('Workspace model', () => {
  it('should create a workspace', async () => {
    const mockWorkspace = createMockWorkspace()

    prismaMock.workspace.create.mockResolvedValue(mockWorkspace)

    const result = await prismaMock.workspace.create({
      data: {
        name: mockWorkspace.name,
        slug: mockWorkspace.slug,
        description: mockWorkspace.description,
        ownerId: mockWorkspace.ownerId,
      },
    })

    expect(result).toEqual(mockWorkspace)
  })
})
