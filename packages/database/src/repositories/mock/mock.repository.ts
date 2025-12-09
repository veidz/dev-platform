import type { Mock, Prisma, PrismaClient } from '@prisma/client'
import type { InputJsonValue } from '@prisma/client/runtime/library'

import { AbstractRepository } from '../base'

class MockRepository extends AbstractRepository<
  Mock,
  Prisma.MockCreateInput,
  Prisma.MockUpdateInput,
  Prisma.MockWhereInput,
  Prisma.MockWhereUniqueInput,
  Prisma.MockOrderByWithRelationInput
> {
  constructor(prisma: PrismaClient) {
    super(prisma)
  }

  protected get model(): PrismaClient['mock'] {
    return this.prisma.mock
  }

  protected getIdWhereClause(id: string): Prisma.MockWhereUniqueInput {
    return { id }
  }

  async findByEndpointId(endpointId: string): Promise<Mock[]> {
    return this.prisma.mock.findMany({
      where: { endpointId },
      orderBy: { createdAt: 'desc' },
    })
  }

  async findEnabledByEndpoint(endpointId: string): Promise<Mock[]> {
    return this.prisma.mock.findMany({
      where: { endpointId, enabled: true },
      orderBy: { createdAt: 'desc' },
    })
  }

  async findWithEndpoint(id: string): Promise<Mock | null> {
    return this.prisma.mock.findUnique({
      where: { id },
      include: { endpoint: true },
    })
  }

  async findWithScenarios(id: string): Promise<Mock | null> {
    return this.prisma.mock.findUnique({
      where: { id },
      include: { scenarios: true },
    })
  }

  async toggleEnabled(id: string, enabled: boolean): Promise<Mock> {
    return this.prisma.mock.update({
      where: { id },
      data: { enabled },
    })
  }

  async updateResponse(
    id: string,
    statusCode: number,
    headers: InputJsonValue | undefined,
    body: InputJsonValue,
  ): Promise<Mock> {
    return this.prisma.mock.update({
      where: { id },
      data: { statusCode, headers, body },
    })
  }

  async countByEndpoint(endpointId: string): Promise<number> {
    return this.prisma.mock.count({ where: { endpointId } })
  }

  async deleteByEndpointId(endpointId: string): Promise<Prisma.BatchPayload> {
    return this.prisma.mock.deleteMany({ where: { endpointId } })
  }
}

export { MockRepository }
