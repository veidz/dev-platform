import type { Alert, AlertSeverity, Prisma } from '@prisma/client'

import { faker } from '@/__mocks__/faker-adapter'
import { AlertRepository } from '@/repositories/analytics'
import {
  createPrismaClientMock,
  mockAlertModel,
  PrismaClientMock,
} from '@/tests/repositories/__mocks__'

type SutTypes = {
  sut: AlertRepository
  prismaClientMock: PrismaClientMock
}

const makeSut = (): SutTypes => {
  const prismaClientMock = createPrismaClientMock()
  const sut = new AlertRepository(prismaClientMock)
  return {
    sut,
    prismaClientMock,
  }
}

describe('AlertRepository', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('findByRuleId', () => {
    it('should find alerts by rule id', async () => {
      const { sut, prismaClientMock } = makeSut()
      const ruleId = faker.string.nanoid()
      const mockAlerts = [mockAlertModel({ ruleId })]
      prismaClientMock.alert.findMany.mockResolvedValue(mockAlerts)

      const result = await sut.findByRuleId(ruleId)

      expect(result).toEqual(mockAlerts)
      expect(prismaClientMock.alert.findMany).toHaveBeenCalledWith({
        where: { ruleId },
        orderBy: { createdAt: 'desc' },
      })
    })
  })

  describe('findTriggered', () => {
    it('should find triggered alerts', async () => {
      const { sut, prismaClientMock } = makeSut()
      const mockAlerts = [mockAlertModel({ triggered: true })]
      prismaClientMock.alert.findMany.mockResolvedValue(mockAlerts)

      const result = await sut.findTriggered()

      expect(result).toEqual(mockAlerts)
      expect(prismaClientMock.alert.findMany).toHaveBeenCalledWith({
        where: { triggered: true },
        orderBy: { createdAt: 'desc' },
      })
    })
  })

  describe('findBySeverity', () => {
    it('should find alerts by severity', async () => {
      const { sut, prismaClientMock } = makeSut()
      const severity: AlertSeverity = 'CRITICAL'
      const mockAlerts = [mockAlertModel({ severity })]
      prismaClientMock.alert.findMany.mockResolvedValue(mockAlerts)

      const result = await sut.findBySeverity(severity)

      expect(result).toEqual(mockAlerts)
      expect(prismaClientMock.alert.findMany).toHaveBeenCalledWith({
        where: { severity },
        orderBy: { createdAt: 'desc' },
      })
    })
  })

  describe('findWithRule', () => {
    it('should find an alert with its rule', async () => {
      const { sut, prismaClientMock } = makeSut()
      const mockAlert = mockAlertModel()
      const alertWithRule = {
        ...mockAlert,
        rule: { id: mockAlert.ruleId },
      }

      prismaClientMock.alert.findUnique.mockResolvedValue(
        alertWithRule as unknown as Alert,
      )

      const result = await sut.findWithRule(mockAlert.id)

      expect(result).toEqual(alertWithRule)
      expect(prismaClientMock.alert.findUnique).toHaveBeenCalledWith({
        where: { id: mockAlert.id },
        include: { rule: true },
      })
    })
  })

  describe('resolve', () => {
    it('should resolve an alert', async () => {
      const { sut, prismaClientMock } = makeSut()
      const mockAlert = mockAlertModel({ triggered: false })
      prismaClientMock.alert.update.mockResolvedValue(mockAlert)

      const result = await sut.resolve(mockAlert.id)

      expect(result).toEqual(mockAlert)
      expect(prismaClientMock.alert.update).toHaveBeenCalledWith({
        where: { id: mockAlert.id },
        data: { triggered: false, resolvedAt: expect.any(Date) },
      })
    })
  })

  describe('countByRuleId', () => {
    it('should count alerts by rule', async () => {
      const { sut, prismaClientMock } = makeSut()
      prismaClientMock.alert.count.mockResolvedValue(10)

      const result = await sut.countByRuleId('rule-id')

      expect(result).toBe(10)
      expect(prismaClientMock.alert.count).toHaveBeenCalledWith({
        where: { ruleId: 'rule-id' },
      })
    })
  })

  describe('countTriggered', () => {
    it('should count triggered alerts', async () => {
      const { sut, prismaClientMock } = makeSut()
      prismaClientMock.alert.count.mockResolvedValue(3)

      const result = await sut.countTriggered()

      expect(result).toBe(3)
      expect(prismaClientMock.alert.count).toHaveBeenCalledWith({
        where: { triggered: true },
      })
    })
  })

  describe('deleteByRuleId', () => {
    it('should delete all alerts for a rule', async () => {
      const { sut, prismaClientMock } = makeSut()
      const batchPayload: Prisma.BatchPayload = { count: 5 }
      prismaClientMock.alert.deleteMany.mockResolvedValue(batchPayload)

      const result = await sut.deleteByRuleId('rule-id')

      expect(result).toEqual(batchPayload)
      expect(prismaClientMock.alert.deleteMany).toHaveBeenCalledWith({
        where: { ruleId: 'rule-id' },
      })
    })
  })

  describe('inherited methods', () => {
    it('should create an alert', async () => {
      const { sut, prismaClientMock } = makeSut()
      const mockAlert = mockAlertModel()
      prismaClientMock.alert.create.mockResolvedValue(mockAlert)

      const result = await sut.create({
        rule: { connect: { id: mockAlert.ruleId } },
        severity: mockAlert.severity,
        message: mockAlert.message,
        triggered: mockAlert.triggered,
      })

      expect(result).toEqual(mockAlert)
      expect(prismaClientMock.alert.create).toHaveBeenCalled()
    })

    it('should find an alert by id', async () => {
      const { sut, prismaClientMock } = makeSut()
      const mockAlert = mockAlertModel()
      prismaClientMock.alert.findUnique.mockResolvedValue(mockAlert)

      const result = await sut.findById(mockAlert.id)

      expect(result).toEqual(mockAlert)
      expect(prismaClientMock.alert.findUnique).toHaveBeenCalledWith({
        where: { id: mockAlert.id },
      })
    })
  })
})
