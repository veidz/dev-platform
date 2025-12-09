import type { AlertRule, AlertRuleType, AlertSeverity } from '@prisma/client'

import { faker } from '@/__mocks__/faker-adapter'

const mockAlertRuleModel = (overrides: Partial<AlertRule> = {}): AlertRule => ({
  id: faker.string.nanoid(),
  workspaceId: faker.string.nanoid(),
  name: faker.lorem.word(),
  description: null,
  type: 'ERROR_RATE' as AlertRuleType,
  condition: { threshold: 50 },
  threshold: 50,
  severity: 'WARNING' as AlertSeverity,
  enabled: true,
  webhookUrl: faker.internet.url(),
  createdAt: faker.date.past(),
  updatedAt: faker.date.recent(),
  ...overrides,
})

const mockAlertRuleModels = (
  count: number = 2,
  overrides: Partial<AlertRule> = {},
): AlertRule[] =>
  Array.from({ length: count }, () => mockAlertRuleModel(overrides))

export { mockAlertRuleModel, mockAlertRuleModels }
