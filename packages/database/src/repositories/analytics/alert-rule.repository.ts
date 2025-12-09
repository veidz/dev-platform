import type {
  AlertRule,
  AlertRuleType,
  AlertSeverity,
  Prisma,
  PrismaClient,
} from '@prisma/client'

import { AbstractRepository } from '../base'

class AlertRuleRepository extends AbstractRepository<
  AlertRule,
  Prisma.AlertRuleCreateInput,
  Prisma.AlertRuleUpdateInput,
  Prisma.AlertRuleWhereInput,
  Prisma.AlertRuleWhereUniqueInput,
  Prisma.AlertRuleOrderByWithRelationInput
> {
  constructor(prisma: PrismaClient) {
    super(prisma)
  }

  protected get model(): PrismaClient['alertRule'] {
    return this.prisma.alertRule
  }

  protected getIdWhereClause(id: string): Prisma.AlertRuleWhereUniqueInput {
    return { id }
  }

  async findByWorkspaceId(workspaceId: string): Promise<AlertRule[]> {
    return this.prisma.alertRule.findMany({
      where: { workspaceId },
      orderBy: { createdAt: 'desc' },
    })
  }

  async findEnabledByWorkspace(workspaceId: string): Promise<AlertRule[]> {
    return this.prisma.alertRule.findMany({
      where: { workspaceId, enabled: true },
      orderBy: { createdAt: 'desc' },
    })
  }

  async findByType(type: AlertRuleType): Promise<AlertRule[]> {
    return this.prisma.alertRule.findMany({
      where: { type },
      orderBy: { createdAt: 'desc' },
    })
  }

  async findBySeverity(severity: AlertSeverity): Promise<AlertRule[]> {
    return this.prisma.alertRule.findMany({
      where: { severity },
      orderBy: { createdAt: 'desc' },
    })
  }

  async findWithAlerts(id: string): Promise<AlertRule | null> {
    return this.prisma.alertRule.findUnique({
      where: { id },
      include: { alerts: true },
    })
  }

  async toggleEnabled(id: string, enabled: boolean): Promise<AlertRule> {
    return this.prisma.alertRule.update({
      where: { id },
      data: { enabled },
    })
  }

  async countByWorkspace(workspaceId: string): Promise<number> {
    return this.prisma.alertRule.count({ where: { workspaceId } })
  }
}

export { AlertRuleRepository }
