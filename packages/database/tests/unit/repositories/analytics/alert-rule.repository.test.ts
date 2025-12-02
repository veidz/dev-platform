import type {
  AlertRule,
  AlertRuleType,
  AlertSeverity,
  Prisma,
  PrismaClient,
} from '@prisma/client'
import { DeepMockProxy, mockDeep } from 'jest-mock-extended'

import { faker } from '@/__mocks__/faker-adapter'
import { AlertRuleRepository } from '@/repositories/analytics'

const createMockAlertRule = (
  overrides: Partial<AlertRule> = {},
): AlertRule => ({
  id: faker.string.nanoid(),
  workspaceId: faker.string.nanoid(),
  name: faker.lorem.word(),
  description: null,
  type: 'ERROR_RATE',
  condition: { threshold: 50 },
  threshold: 50,
  severity: 'WARNING',
  enabled: true,
  webhookUrl: faker.internet.url(),
  createdAt: faker.date.past(),
  updatedAt: faker.date.recent(),
  ...overrides,
})

describe('AlertRuleRepository', () => {
  let repository: AlertRuleRepository
  let prismaMock: DeepMockProxy<PrismaClient>

  beforeEach(() => {
    prismaMock = mockDeep<PrismaClient>()
    repository = new AlertRuleRepository(prismaMock)
    jest.clearAllMocks()
  })

  describe('inherited methods (base repository)', () => {
    it('should create an alert rule', async () => {
      const mockRule = createMockAlertRule()
      prismaMock.alertRule.create.mockResolvedValue(mockRule)

      const result = await repository.create({
        workspace: { connect: { id: mockRule.workspaceId } },
        name: mockRule.name,
        type: mockRule.type,
        condition: mockRule.condition as Prisma.InputJsonValue,
        severity: mockRule.severity,
        enabled: mockRule.enabled,
      })

      expect(result).toEqual(mockRule)
      expect(prismaMock.alertRule.create).toHaveBeenCalled()
    })

    it('should find an alert rule by id', async () => {
      const mockRule = createMockAlertRule()
      prismaMock.alertRule.findUnique.mockResolvedValue(mockRule)

      const result = await repository.findById(mockRule.id)

      expect(result).toEqual(mockRule)
      expect(prismaMock.alertRule.findUnique).toHaveBeenCalledWith({
        where: { id: mockRule.id },
      })
    })
  })

  describe('findByWorkspaceId', () => {
    it('should find alert rules by workspace id', async () => {
      const workspaceId = faker.string.nanoid()
      const mockRules = [createMockAlertRule({ workspaceId })]
      prismaMock.alertRule.findMany.mockResolvedValue(mockRules)

      const result = await repository.findByWorkspaceId(workspaceId)

      expect(result).toEqual(mockRules)
      expect(prismaMock.alertRule.findMany).toHaveBeenCalledWith({
        where: { workspaceId },
        orderBy: { createdAt: 'desc' },
      })
    })
  })

  describe('findEnabledByWorkspace', () => {
    it('should find enabled alert rules', async () => {
      const workspaceId = faker.string.nanoid()
      const mockRules = [createMockAlertRule({ workspaceId, enabled: true })]
      prismaMock.alertRule.findMany.mockResolvedValue(mockRules)

      const result = await repository.findEnabledByWorkspace(workspaceId)

      expect(result).toEqual(mockRules)
      expect(prismaMock.alertRule.findMany).toHaveBeenCalledWith({
        where: { workspaceId, enabled: true },
        orderBy: { createdAt: 'desc' },
      })
    })
  })

  describe('findByType', () => {
    it('should find alert rules by type', async () => {
      const type: AlertRuleType = 'THRESHOLD'
      const mockRules = [createMockAlertRule({ type })]
      prismaMock.alertRule.findMany.mockResolvedValue(mockRules)

      const result = await repository.findByType(type)

      expect(result).toEqual(mockRules)
      expect(prismaMock.alertRule.findMany).toHaveBeenCalledWith({
        where: { type },
        orderBy: { createdAt: 'desc' },
      })
    })
  })

  describe('findBySeverity', () => {
    it('should find alert rules by severity', async () => {
      const severity: AlertSeverity = 'CRITICAL'
      const mockRules = [createMockAlertRule({ severity })]
      prismaMock.alertRule.findMany.mockResolvedValue(mockRules)

      const result = await repository.findBySeverity(severity)

      expect(result).toEqual(mockRules)
      expect(prismaMock.alertRule.findMany).toHaveBeenCalledWith({
        where: { severity },
        orderBy: { createdAt: 'desc' },
      })
    })
  })

  describe('findWithAlerts', () => {
    it('should find an alert rule with its alerts', async () => {
      const mockRule = createMockAlertRule()
      const ruleWithAlerts = {
        ...mockRule,
        alerts: [{ id: faker.string.nanoid() }],
      }

      prismaMock.alertRule.findUnique.mockResolvedValue(
        ruleWithAlerts as unknown as AlertRule,
      )

      const result = await repository.findWithAlerts(mockRule.id)

      expect(result).toEqual(ruleWithAlerts)
      expect(prismaMock.alertRule.findUnique).toHaveBeenCalledWith({
        where: { id: mockRule.id },
        include: { alerts: true },
      })
    })
  })

  describe('toggleEnabled', () => {
    it('should toggle alert rule enabled status', async () => {
      const mockRule = createMockAlertRule({ enabled: false })
      prismaMock.alertRule.update.mockResolvedValue(mockRule)

      const result = await repository.toggleEnabled(mockRule.id, false)

      expect(result).toEqual(mockRule)
      expect(prismaMock.alertRule.update).toHaveBeenCalledWith({
        where: { id: mockRule.id },
        data: { enabled: false },
      })
    })
  })
})
