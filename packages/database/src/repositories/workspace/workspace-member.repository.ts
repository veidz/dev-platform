import type { Prisma, PrismaClient, WorkspaceMember } from '@prisma/client'

import { AbstractRepository } from '../base'

class WorkspaceMemberRepository extends AbstractRepository<
  WorkspaceMember,
  Prisma.WorkspaceMemberCreateInput,
  Prisma.WorkspaceMemberUpdateInput,
  Prisma.WorkspaceMemberWhereInput,
  Prisma.WorkspaceMemberWhereUniqueInput,
  Prisma.WorkspaceMemberOrderByWithRelationInput
> {
  constructor(prisma: PrismaClient) {
    super(prisma)
  }

  protected get model(): PrismaClient['workspaceMember'] {
    return this.prisma.workspaceMember
  }

  protected getIdWhereClause(
    id: string,
  ): Prisma.WorkspaceMemberWhereUniqueInput {
    return { id }
  }

  async findByWorkspaceId(workspaceId: string): Promise<WorkspaceMember[]> {
    return this.prisma.workspaceMember.findMany({
      where: { workspaceId },
      include: { user: true },
      orderBy: { joinedAt: 'desc' },
    })
  }

  async findByUserId(userId: string): Promise<WorkspaceMember[]> {
    return this.prisma.workspaceMember.findMany({
      where: { userId },
      include: { workspace: true },
      orderBy: { joinedAt: 'desc' },
    })
  }

  async findByWorkspaceAndUser(
    workspaceId: string,
    userId: string,
  ): Promise<WorkspaceMember | null> {
    return this.prisma.workspaceMember.findUnique({
      where: { workspaceId_userId: { workspaceId, userId } },
    })
  }

  async findWithUser(id: string): Promise<WorkspaceMember | null> {
    return this.prisma.workspaceMember.findUnique({
      where: { id },
      include: { user: true },
    })
  }

  async findWithWorkspace(id: string): Promise<WorkspaceMember | null> {
    return this.prisma.workspaceMember.findUnique({
      where: { id },
      include: { workspace: true },
    })
  }

  async isMember(workspaceId: string, userId: string): Promise<boolean> {
    const count = await this.prisma.workspaceMember.count({
      where: { workspaceId, userId },
    })
    return count > 0
  }

  async countByWorkspace(workspaceId: string): Promise<number> {
    return this.prisma.workspaceMember.count({ where: { workspaceId } })
  }

  async deleteByWorkspaceAndUser(
    workspaceId: string,
    userId: string,
  ): Promise<WorkspaceMember> {
    return this.prisma.workspaceMember.delete({
      where: { workspaceId_userId: { workspaceId, userId } },
    })
  }

  async deleteByWorkspaceId(workspaceId: string): Promise<Prisma.BatchPayload> {
    return this.prisma.workspaceMember.deleteMany({ where: { workspaceId } })
  }
}

export { WorkspaceMemberRepository }
