import type { Alert, AlertSeverity } from '@prisma/client'

import { faker } from '@/__mocks__/faker-adapter'

const mockAlertModel = (overrides: Partial<Alert> = {}): Alert => ({
  id: faker.string.nanoid(),
  ruleId: faker.string.nanoid(),
  severity: 'WARNING' as AlertSeverity,
  message: faker.lorem.sentence(),
  triggered: true,
  resolvedAt: null,
  createdAt: faker.date.recent(),
  ...overrides,
})

const mockAlertModels = (
  count: number = 2,
  overrides: Partial<Alert> = {},
): Alert[] => Array.from({ length: count }, () => mockAlertModel(overrides))

export { mockAlertModel, mockAlertModels }
