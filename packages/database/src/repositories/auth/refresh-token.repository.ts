import type { Prisma, PrismaClient, RefreshToken } from '@prisma/client'

import { AbstractRepository } from '../base'

class RefreshTokenRepository extends AbstractRepository<
  RefreshToken,
  Prisma.RefreshTokenCreateInput,
  Prisma.RefreshTokenUpdateInput,
  Prisma.RefreshTokenWhereInput,
  Prisma.RefreshTokenWhereUniqueInput,
  Prisma.RefreshTokenOrderByWithRelationInput
> {
  constructor(prisma: PrismaClient) {
    super(prisma)
  }

  protected get model(): PrismaClient['refreshToken'] {
    return this.prisma.refreshToken
  }

  protected getIdWhereClause(id: string): Prisma.RefreshTokenWhereUniqueInput {
    return { id }
  }

  async findByToken(token: string): Promise<RefreshToken | null> {
    return this.prisma.refreshToken.findUnique({ where: { token } })
  }

  async findByUserId(userId: string): Promise<RefreshToken[]> {
    return this.prisma.refreshToken.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    })
  }

  async findValidByUserId(userId: string): Promise<RefreshToken[]> {
    return this.prisma.refreshToken.findMany({
      where: {
        userId,
        expiresAt: { gt: new Date() },
      },
      orderBy: { createdAt: 'desc' },
    })
  }

  async deleteByToken(token: string): Promise<RefreshToken> {
    return this.prisma.refreshToken.delete({ where: { token } })
  }

  async deleteByUserId(userId: string): Promise<Prisma.BatchPayload> {
    return this.prisma.refreshToken.deleteMany({ where: { userId } })
  }

  async deleteExpired(): Promise<Prisma.BatchPayload> {
    return this.prisma.refreshToken.deleteMany({
      where: { expiresAt: { lt: new Date() } },
    })
  }

  async countByUserId(userId: string): Promise<number> {
    return this.prisma.refreshToken.count({ where: { userId } })
  }
}

export { RefreshTokenRepository }
