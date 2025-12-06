import type { Api, ApiStatus, Prisma, PrismaClient } from '@prisma/client'

import { AbstractRepository } from '../base'

class ApiRepository extends AbstractRepository<
  Api,
  Prisma.ApiCreateInput,
  Prisma.ApiUpdateInput,
  Prisma.ApiWhereInput,
  Prisma.ApiWhereUniqueInput,
  Prisma.ApiOrderByWithRelationInput
> {
  constructor(prisma: PrismaClient) {
    super(prisma)
  }

  protected get model(): PrismaClient['api'] {
    return this.prisma.api
  }

  protected getIdWhereClause(id: string): Prisma.ApiWhereUniqueInput {
    return { id }
  }

  async findByWorkspaceId(workspaceId: string): Promise<Api[]> {
    return this.prisma.api.findMany({
      where: { workspaceId },
      orderBy: { createdAt: 'desc' },
    })
  }

  async findByNameAndWorkspace(
    name: string,
    workspaceId: string,
  ): Promise<Api | null> {
    return this.prisma.api.findUnique({
      where: { workspaceId_name: { workspaceId, name } },
    })
  }

  async findByStatus(status: ApiStatus): Promise<Api[]> {
    return this.prisma.api.findMany({
      where: { status },
      orderBy: { updatedAt: 'desc' },
    })
  }

  async findWithEndpoints(id: string): Promise<Api | null> {
    return this.prisma.api.findUnique({
      where: { id },
      include: { endpoints: true },
    })
  }

  async findWithWorkspace(id: string): Promise<Api | null> {
    return this.prisma.api.findUnique({
      where: { id },
      include: { workspace: true },
    })
  }

  async updateStatus(id: string, status: ApiStatus): Promise<Api> {
    return this.prisma.api.update({
      where: { id },
      data: { status },
    })
  }

  async nameExistsInWorkspace(
    name: string,
    workspaceId: string,
  ): Promise<boolean> {
    const count = await this.prisma.api.count({
      where: { name, workspaceId },
    })
    return count > 0
  }

  async countByWorkspace(workspaceId: string): Promise<number> {
    return this.prisma.api.count({ where: { workspaceId } })
  }

  async countByStatus(status: ApiStatus): Promise<number> {
    return this.prisma.api.count({ where: { status } })
  }
}

export { ApiRepository }
