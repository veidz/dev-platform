import type { Alert, AlertSeverity, Prisma, PrismaClient } from '@prisma/client'

import { AbstractRepository } from '../base'

class AlertRepository extends AbstractRepository<
  Alert,
  Prisma.AlertCreateInput,
  Prisma.AlertUpdateInput,
  Prisma.AlertWhereInput,
  Prisma.AlertWhereUniqueInput,
  Prisma.AlertOrderByWithRelationInput
> {
  constructor(prisma: PrismaClient) {
    super(prisma)
  }

  protected get model(): PrismaClient['alert'] {
    return this.prisma.alert
  }

  protected getIdWhereClause(id: string): Prisma.AlertWhereUniqueInput {
    return { id }
  }

  async findByRuleId(ruleId: string): Promise<Alert[]> {
    return this.prisma.alert.findMany({
      where: { ruleId },
      orderBy: { createdAt: 'desc' },
    })
  }

  async findTriggered(): Promise<Alert[]> {
    return this.prisma.alert.findMany({
      where: { triggered: true },
      orderBy: { createdAt: 'desc' },
    })
  }

  async findBySeverity(severity: AlertSeverity): Promise<Alert[]> {
    return this.prisma.alert.findMany({
      where: { severity },
      orderBy: { createdAt: 'desc' },
    })
  }

  async findWithRule(id: string): Promise<Alert | null> {
    return this.prisma.alert.findUnique({
      where: { id },
      include: { rule: true },
    })
  }

  async resolve(id: string): Promise<Alert> {
    return this.prisma.alert.update({
      where: { id },
      data: { triggered: false, resolvedAt: new Date() },
    })
  }

  async countByRuleId(ruleId: string): Promise<number> {
    return this.prisma.alert.count({ where: { ruleId } })
  }

  async countTriggered(): Promise<number> {
    return this.prisma.alert.count({ where: { triggered: true } })
  }

  async deleteByRuleId(ruleId: string): Promise<Prisma.BatchPayload> {
    return this.prisma.alert.deleteMany({ where: { ruleId } })
  }
}

export { AlertRepository }
