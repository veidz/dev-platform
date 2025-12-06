import type { Prisma, PrismaClient, User } from '@prisma/client'

import { AbstractRepository } from '../base'

class UserRepository extends AbstractRepository<
  User,
  Prisma.UserCreateInput,
  Prisma.UserUpdateInput,
  Prisma.UserWhereInput,
  Prisma.UserWhereUniqueInput,
  Prisma.UserOrderByWithRelationInput
> {
  constructor(prisma: PrismaClient) {
    super(prisma)
  }

  protected get model(): PrismaClient['user'] {
    return this.prisma.user
  }

  protected getIdWhereClause(id: string): Prisma.UserWhereUniqueInput {
    return { id }
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { email } })
  }

  async findWithOwnedWorkspaces(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { id },
      include: { ownedWorkspaces: true },
    })
  }

  async findWithMemberships(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { id },
      include: { memberships: { include: { workspace: true } } },
    })
  }

  async emailExists(email: string): Promise<boolean> {
    const count = await this.prisma.user.count({ where: { email } })
    return count > 0
  }

  async updatePassword(id: string, passwordHash: string): Promise<User> {
    return this.prisma.user.update({
      where: { id },
      data: { password: passwordHash },
    })
  }

  async verifyEmail(id: string): Promise<User> {
    return this.prisma.user.update({
      where: { id },
      data: { emailVerified: true },
    })
  }
}

export { UserRepository }
