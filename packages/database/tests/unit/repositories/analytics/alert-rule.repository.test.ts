import type { AlertRule, AlertRuleType, AlertSeverity } from '@prisma/client'

import { faker } from '@/__mocks__/faker-adapter'
import { AlertRuleRepository } from '@/repositories/analytics'
import {
  createPrismaClientMock,
  mockAlertRuleModel,
  PrismaClientMock,
} from '@/tests/repositories/__mocks__'

type SutTypes = {
  sut: AlertRuleRepository
  prismaClientMock: PrismaClientMock
}

const makeSut = (): SutTypes => {
  const prismaClientMock = createPrismaClientMock()
  const sut = new AlertRuleRepository(prismaClientMock)
  return {
    sut,
    prismaClientMock,
  }
}

describe('AlertRuleRepository', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('findByWorkspaceId', () => {
    it('should find alert rules by workspace id', async () => {
      const { sut, prismaClientMock } = makeSut()
      const workspaceId = faker.string.nanoid()
      const mockRules = [mockAlertRuleModel({ workspaceId })]
      prismaClientMock.alertRule.findMany.mockResolvedValue(mockRules)

      const result = await sut.findByWorkspaceId(workspaceId)

      expect(result).toEqual(mockRules)
      expect(prismaClientMock.alertRule.findMany).toHaveBeenCalledWith({
        where: { workspaceId },
        orderBy: { createdAt: 'desc' },
      })
    })
  })

  describe('findEnabledByWorkspace', () => {
    it('should find enabled alert rules', async () => {
      const { sut, prismaClientMock } = makeSut()
      const workspaceId = faker.string.nanoid()
      const mockRules = [mockAlertRuleModel({ workspaceId, enabled: true })]
      prismaClientMock.alertRule.findMany.mockResolvedValue(mockRules)

      const result = await sut.findEnabledByWorkspace(workspaceId)

      expect(result).toEqual(mockRules)
      expect(prismaClientMock.alertRule.findMany).toHaveBeenCalledWith({
        where: { workspaceId, enabled: true },
        orderBy: { createdAt: 'desc' },
      })
    })
  })

  describe('findByType', () => {
    it('should find alert rules by type', async () => {
      const { sut, prismaClientMock } = makeSut()
      const type: AlertRuleType = 'THRESHOLD'
      const mockRules = [mockAlertRuleModel({ type })]
      prismaClientMock.alertRule.findMany.mockResolvedValue(mockRules)

      const result = await sut.findByType(type)

      expect(result).toEqual(mockRules)
      expect(prismaClientMock.alertRule.findMany).toHaveBeenCalledWith({
        where: { type },
        orderBy: { createdAt: 'desc' },
      })
    })
  })

  describe('findBySeverity', () => {
    it('should find alert rules by severity', async () => {
      const { sut, prismaClientMock } = makeSut()
      const severity: AlertSeverity = 'CRITICAL'
      const mockRules = [mockAlertRuleModel({ severity })]
      prismaClientMock.alertRule.findMany.mockResolvedValue(mockRules)

      const result = await sut.findBySeverity(severity)

      expect(result).toEqual(mockRules)
      expect(prismaClientMock.alertRule.findMany).toHaveBeenCalledWith({
        where: { severity },
        orderBy: { createdAt: 'desc' },
      })
    })
  })

  describe('findWithAlerts', () => {
    it('should find an alert rule with its alerts', async () => {
      const { sut, prismaClientMock } = makeSut()
      const mockRule = mockAlertRuleModel()
      const ruleWithAlerts = {
        ...mockRule,
        alerts: [{ id: faker.string.nanoid() }],
      }

      prismaClientMock.alertRule.findUnique.mockResolvedValue(
        ruleWithAlerts as unknown as AlertRule,
      )

      const result = await sut.findWithAlerts(mockRule.id)

      expect(result).toEqual(ruleWithAlerts)
      expect(prismaClientMock.alertRule.findUnique).toHaveBeenCalledWith({
        where: { id: mockRule.id },
        include: { alerts: true },
      })
    })
  })

  describe('toggleEnabled', () => {
    it('should toggle alert rule enabled status', async () => {
      const { sut, prismaClientMock } = makeSut()
      const mockRule = mockAlertRuleModel({ enabled: false })
      prismaClientMock.alertRule.update.mockResolvedValue(mockRule)

      const result = await sut.toggleEnabled(mockRule.id, false)

      expect(result).toEqual(mockRule)
      expect(prismaClientMock.alertRule.update).toHaveBeenCalledWith({
        where: { id: mockRule.id },
        data: { enabled: false },
      })
    })
  })

  describe('countByWorkspace', () => {
    it('should count alert rules by workspace', async () => {
      const { sut, prismaClientMock } = makeSut()
      prismaClientMock.alertRule.count.mockResolvedValue(5)

      const result = await sut.countByWorkspace('workspace-id')

      expect(result).toBe(5)
      expect(prismaClientMock.alertRule.count).toHaveBeenCalledWith({
        where: { workspaceId: 'workspace-id' },
      })
    })
  })

  describe('inherited methods', () => {
    it('should create an alert rule', async () => {
      const { sut, prismaClientMock } = makeSut()
      const mockRule = mockAlertRuleModel()
      prismaClientMock.alertRule.create.mockResolvedValue(mockRule)

      const result = await sut.create({
        workspace: { connect: { id: mockRule.workspaceId } },
        name: mockRule.name,
        type: mockRule.type,
        condition: mockRule.condition as object,
        severity: mockRule.severity,
        enabled: mockRule.enabled,
      })

      expect(result).toEqual(mockRule)
      expect(prismaClientMock.alertRule.create).toHaveBeenCalled()
    })

    it('should find an alert rule by id', async () => {
      const { sut, prismaClientMock } = makeSut()
      const mockRule = mockAlertRuleModel()
      prismaClientMock.alertRule.findUnique.mockResolvedValue(mockRule)

      const result = await sut.findById(mockRule.id)

      expect(result).toEqual(mockRule)
      expect(prismaClientMock.alertRule.findUnique).toHaveBeenCalledWith({
        where: { id: mockRule.id },
      })
    })
  })
})
