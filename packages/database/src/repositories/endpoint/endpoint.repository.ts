import type { Endpoint, HttpMethod, Prisma, PrismaClient } from '@prisma/client'

import { AbstractRepository } from '../base'

class EndpointRepository extends AbstractRepository<
  Endpoint,
  Prisma.EndpointCreateInput,
  Prisma.EndpointUpdateInput,
  Prisma.EndpointWhereInput,
  Prisma.EndpointWhereUniqueInput,
  Prisma.EndpointOrderByWithRelationInput
> {
  constructor(prisma: PrismaClient) {
    super(prisma)
  }

  protected get model(): PrismaClient['endpoint'] {
    return this.prisma.endpoint
  }

  protected getIdWhereClause(id: string): Prisma.EndpointWhereUniqueInput {
    return { id }
  }

  async findByApiId(apiId: string): Promise<Endpoint[]> {
    return this.prisma.endpoint.findMany({
      where: { apiId },
      orderBy: { path: 'asc' },
    })
  }

  async findByPathAndMethod(
    apiId: string,
    path: string,
    method: HttpMethod,
  ): Promise<Endpoint | null> {
    return this.prisma.endpoint.findUnique({
      where: { apiId_path_method: { apiId, path, method } },
    })
  }

  async findByMethod(method: HttpMethod): Promise<Endpoint[]> {
    return this.prisma.endpoint.findMany({
      where: { method },
      orderBy: { path: 'asc' },
    })
  }

  async findWithApi(id: string): Promise<Endpoint | null> {
    return this.prisma.endpoint.findUnique({
      where: { id },
      include: { api: true },
    })
  }

  async findWithMocks(id: string): Promise<Endpoint | null> {
    return this.prisma.endpoint.findUnique({
      where: { id },
      include: { mocks: true },
    })
  }

  async findWithScenarios(id: string): Promise<Endpoint | null> {
    return this.prisma.endpoint.findUnique({
      where: { id },
      include: { mockScenarios: true },
    })
  }

  async pathExistsInApi(
    apiId: string,
    path: string,
    method: HttpMethod,
  ): Promise<boolean> {
    const count = await this.prisma.endpoint.count({
      where: { apiId, path, method },
    })
    return count > 0
  }

  async countByApi(apiId: string): Promise<number> {
    return this.prisma.endpoint.count({ where: { apiId } })
  }

  async countByMethod(method: HttpMethod): Promise<number> {
    return this.prisma.endpoint.count({ where: { method } })
  }

  async deleteByApiId(apiId: string): Promise<Prisma.BatchPayload> {
    return this.prisma.endpoint.deleteMany({ where: { apiId } })
  }
}

export { EndpointRepository }
