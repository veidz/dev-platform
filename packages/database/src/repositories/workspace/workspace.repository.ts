import type { Prisma, PrismaClient, Workspace } from '@prisma/client'

import { AbstractRepository } from '../base'

class WorkspaceRepository extends AbstractRepository<
  Workspace,
  Prisma.WorkspaceCreateInput,
  Prisma.WorkspaceUpdateInput,
  Prisma.WorkspaceWhereInput,
  Prisma.WorkspaceWhereUniqueInput,
  Prisma.WorkspaceOrderByWithRelationInput
> {
  constructor(prisma: PrismaClient) {
    super(prisma)
  }

  protected get model(): PrismaClient['workspace'] {
    return this.prisma.workspace
  }

  protected getIdWhereClause(id: string): Prisma.WorkspaceWhereUniqueInput {
    return { id }
  }

  async findBySlug(slug: string): Promise<Workspace | null> {
    return this.prisma.workspace.findUnique({ where: { slug } })
  }

  async findByOwnerId(ownerId: string): Promise<Workspace[]> {
    return this.prisma.workspace.findMany({
      where: { ownerId },
      orderBy: { createdAt: 'desc' },
    })
  }

  async findWithApis(id: string): Promise<Workspace | null> {
    return this.prisma.workspace.findUnique({
      where: { id },
      include: { apis: true },
    })
  }

  async findWithOwner(id: string): Promise<Workspace | null> {
    return this.prisma.workspace.findUnique({
      where: { id },
      include: { owner: true },
    })
  }

  async findWithMembers(id: string): Promise<Workspace | null> {
    return this.prisma.workspace.findUnique({
      where: { id },
      include: { members: { include: { user: true } } },
    })
  }

  async slugExists(slug: string): Promise<boolean> {
    const count = await this.prisma.workspace.count({ where: { slug } })
    return count > 0
  }

  async countByOwner(ownerId: string): Promise<number> {
    return this.prisma.workspace.count({ where: { ownerId } })
  }
}

export { WorkspaceRepository }
