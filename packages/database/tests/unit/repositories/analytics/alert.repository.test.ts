import type { Alert, PrismaClient } from '@prisma/client'
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

  describe('inherited methods (base repository)', () => {
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
})
