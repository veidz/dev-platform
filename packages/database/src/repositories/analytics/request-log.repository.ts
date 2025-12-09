import type { Prisma, PrismaClient, RequestLog } from '@prisma/client'

import { AbstractRepository } from '../base'

class RequestLogRepository extends AbstractRepository<
  RequestLog,
  Prisma.RequestLogCreateInput,
  Prisma.RequestLogUpdateInput,
  Prisma.RequestLogWhereInput,
  Prisma.RequestLogWhereUniqueInput,
  Prisma.RequestLogOrderByWithRelationInput
> {
  constructor(prisma: PrismaClient) {
    super(prisma)
  }

  protected get model(): PrismaClient['requestLog'] {
    return this.prisma.requestLog
  }

  protected getIdWhereClause(id: string): Prisma.RequestLogWhereUniqueInput {
    return { id }
  }

  async findByEndpointId(endpointId: string): Promise<RequestLog[]> {
    return this.prisma.requestLog.findMany({
      where: { endpointId },
      orderBy: { timestamp: 'desc' },
    })
  }

  async findByDateRange(
    endpointId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<RequestLog[]> {
    return this.prisma.requestLog.findMany({
      where: {
        endpointId,
        timestamp: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: { timestamp: 'desc' },
    })
  }

  async findByStatusCode(statusCode: number): Promise<RequestLog[]> {
    return this.prisma.requestLog.findMany({
      where: { statusCode },
      orderBy: { timestamp: 'desc' },
    })
  }

  async findRecentLogs(
    endpointId: string,
    limit: number,
  ): Promise<RequestLog[]> {
    return this.prisma.requestLog.findMany({
      where: { endpointId },
      orderBy: { timestamp: 'desc' },
      take: limit,
    })
  }

  async countByEndpointAndDateRange(
    endpointId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<number> {
    return this.prisma.requestLog.count({
      where: {
        endpointId,
        timestamp: {
          gte: startDate,
          lte: endDate,
        },
      },
    })
  }

  async deleteOlderThan(date: Date): Promise<Prisma.BatchPayload> {
    return this.prisma.requestLog.deleteMany({
      where: { timestamp: { lt: date } },
    })
  }

  async deleteByEndpointId(endpointId: string): Promise<Prisma.BatchPayload> {
    return this.prisma.requestLog.deleteMany({ where: { endpointId } })
  }
}

export { RequestLogRepository }
