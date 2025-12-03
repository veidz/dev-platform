import type { Alert, AlertSeverity, Prisma, PrismaClient } from '@prisma/client'
import { DeepMockProxy, mockDeep } from 'jest-mock-extended'

import { faker } from '@/__mocks__/faker-adapter'
import { AlertRepository } from '@/repositories/analytics'

const createMockAlert = (overrides: Partial<Alert> = {}): Alert => ({
  id: faker.string.nanoid(),
  ruleId: faker.string.nanoid(),
  severity: 'WARNING',
  message: faker.lorem.sentence(),
  triggered: true,
  resolvedAt: null,
  createdAt: faker.date.recent(),
  ...overrides,
})

describe('AlertRepository', () => {
  let repository: AlertRepository
  let prismaMock: DeepMockProxy<PrismaClient>

  beforeEach(() => {
    prismaMock = mockDeep<PrismaClient>()
    repository = new AlertRepository(prismaMock)
    jest.clearAllMocks()
  })

  describe('findByRuleId', () => {
    it('should find alerts by rule id', async () => {
      const ruleId = faker.string.nanoid()
      const mockAlerts = [createMockAlert({ ruleId })]
      prismaMock.alert.findMany.mockResolvedValue(mockAlerts)

      const result = await repository.findByRuleId(ruleId)

      expect(result).toEqual(mockAlerts)
      expect(prismaMock.alert.findMany).toHaveBeenCalledWith({
        where: { ruleId },
        orderBy: { createdAt: 'desc' },
      })
    })
  })

  describe('findTriggered', () => {
    it('should find triggered alerts', async () => {
      const mockAlerts = [createMockAlert({ triggered: true })]
      prismaMock.alert.findMany.mockResolvedValue(mockAlerts)

      const result = await repository.findTriggered()

      expect(result).toEqual(mockAlerts)
      expect(prismaMock.alert.findMany).toHaveBeenCalledWith({
        where: { triggered: true },
        orderBy: { createdAt: 'desc' },
      })
    })
  })

  describe('findBySeverity', () => {
    it('should find alerts by severity', async () => {
      const severity: AlertSeverity = 'CRITICAL'
      const mockAlerts = [createMockAlert({ severity })]
      prismaMock.alert.findMany.mockResolvedValue(mockAlerts)

      const result = await repository.findBySeverity(severity)

      expect(result).toEqual(mockAlerts)
      expect(prismaMock.alert.findMany).toHaveBeenCalledWith({
        where: { severity },
        orderBy: { createdAt: 'desc' },
      })
    })
  })

  describe('findWithRule', () => {
    it('should find an alert with its rule', async () => {
      const mockAlert = createMockAlert()
      const alertWithRule = {
        ...mockAlert,
        rule: { id: mockAlert.ruleId },
      }

      prismaMock.alert.findUnique.mockResolvedValue(
        alertWithRule as unknown as Alert,
      )

      const result = await repository.findWithRule(mockAlert.id)

      expect(result).toEqual(alertWithRule)
      expect(prismaMock.alert.findUnique).toHaveBeenCalledWith({
        where: { id: mockAlert.id },
        include: { rule: true },
      })
    })
  })

  describe('resolve', () => {
    it('should resolve an alert', async () => {
      const mockAlert = createMockAlert({ triggered: false })
      prismaMock.alert.update.mockResolvedValue(mockAlert)

      const result = await repository.resolve(mockAlert.id)

      expect(result).toEqual(mockAlert)
      expect(prismaMock.alert.update).toHaveBeenCalledWith({
        where: { id: mockAlert.id },
        data: { triggered: false, resolvedAt: expect.any(Date) },
      })
    })
  })

  describe('countByRuleId', () => {
    it('should count alerts by rule', async () => {
      prismaMock.alert.count.mockResolvedValue(10)

      const result = await repository.countByRuleId('rule-id')

      expect(result).toBe(10)
      expect(prismaMock.alert.count).toHaveBeenCalledWith({
        where: { ruleId: 'rule-id' },
      })
    })
  })

  describe('countTriggered', () => {
    it('should count triggered alerts', async () => {
      prismaMock.alert.count.mockResolvedValue(3)

      const result = await repository.countTriggered()

      expect(result).toBe(3)
      expect(prismaMock.alert.count).toHaveBeenCalledWith({
        where: { triggered: true },
      })
    })
  })

  describe('deleteByRuleId', () => {
    it('should delete all alerts for a rule', async () => {
      const batchPayload: Prisma.BatchPayload = { count: 5 }
      prismaMock.alert.deleteMany.mockResolvedValue(batchPayload)

      const result = await repository.deleteByRuleId('rule-id')

      expect(result).toEqual(batchPayload)
      expect(prismaMock.alert.deleteMany).toHaveBeenCalledWith({
        where: { ruleId: 'rule-id' },
      })
    })
  })

  describe('inherited methods', () => {
    it('should create an alert', async () => {
      const mockAlert = createMockAlert()
      prismaMock.alert.create.mockResolvedValue(mockAlert)

      const result = await repository.create({
        rule: { connect: { id: mockAlert.ruleId } },
        severity: mockAlert.severity,
        message: mockAlert.message,
        triggered: mockAlert.triggered,
      })

      expect(result).toEqual(mockAlert)
      expect(prismaMock.alert.create).toHaveBeenCalled()
    })

    it('should find an alert by id', async () => {
      const mockAlert = createMockAlert()
      prismaMock.alert.findUnique.mockResolvedValue(mockAlert)

      const result = await repository.findById(mockAlert.id)

      expect(result).toEqual(mockAlert)
      expect(prismaMock.alert.findUnique).toHaveBeenCalledWith({
        where: { id: mockAlert.id },
      })
    })
  })
})
