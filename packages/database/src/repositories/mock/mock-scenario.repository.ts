import type { MockScenario, Prisma, PrismaClient } from '@prisma/client'

import { AbstractRepository } from '../base'

class MockScenarioRepository extends AbstractRepository<
  MockScenario,
  Prisma.MockScenarioCreateInput,
  Prisma.MockScenarioUpdateInput,
  Prisma.MockScenarioWhereInput,
  Prisma.MockScenarioWhereUniqueInput,
  Prisma.MockScenarioOrderByWithRelationInput
> {
  constructor(prisma: PrismaClient) {
    super(prisma)
  }

  protected get model(): PrismaClient['mockScenario'] {
    return this.prisma.mockScenario
  }

  protected getIdWhereClause(id: string): Prisma.MockScenarioWhereUniqueInput {
    return { id }
  }

  async findByEndpointId(endpointId: string): Promise<MockScenario[]> {
    return this.prisma.mockScenario.findMany({
      where: { endpointId },
      orderBy: { createdAt: 'desc' },
    })
  }

  async findActiveByEndpoint(endpointId: string): Promise<MockScenario[]> {
    return this.prisma.mockScenario.findMany({
      where: { endpointId, active: true },
      orderBy: { createdAt: 'desc' },
    })
  }

  async findByNameAndEndpoint(
    name: string,
    endpointId: string,
  ): Promise<MockScenario | null> {
    return this.prisma.mockScenario.findUnique({
      where: { endpointId_name: { endpointId, name } },
    })
  }

  async findWithEndpoint(id: string): Promise<MockScenario | null> {
    return this.prisma.mockScenario.findUnique({
      where: { id },
      include: { endpoint: true },
    })
  }

  async findWithMocks(id: string): Promise<MockScenario | null> {
    return this.prisma.mockScenario.findUnique({
      where: { id },
      include: { mocks: true },
    })
  }

  async toggleActive(id: string, active: boolean): Promise<MockScenario> {
    return this.prisma.mockScenario.update({
      where: { id },
      data: { active },
    })
  }

  async countByEndpoint(endpointId: string): Promise<number> {
    return this.prisma.mockScenario.count({ where: { endpointId } })
  }

  async deleteByEndpointId(endpointId: string): Promise<Prisma.BatchPayload> {
    return this.prisma.mockScenario.deleteMany({ where: { endpointId } })
  }
}

export { MockScenarioRepository }
