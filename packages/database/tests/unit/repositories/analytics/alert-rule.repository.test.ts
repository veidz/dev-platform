import type { AlertRule, Prisma, PrismaClient } from '@prisma/client'
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
})
