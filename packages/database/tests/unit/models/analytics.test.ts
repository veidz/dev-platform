import { randFloat, randIp, randUserAgent, randWord } from '@ngneat/falso'
import { AlertRuleType, AlertSeverity, HttpMethod } from '@prisma/client'

import { faker } from '@/__mocks__/faker-adapter'
import { prismaMock } from '@/tests/setup'

const createMockAlertRule = (overrides = {}) => ({
  id: faker.string.nanoid(),
  workspaceId: faker.string.nanoid(),
  name: randWord({ length: 3 }).join(' '),
  description: null,
  type: faker.helpers.arrayElement(Object.values(AlertRuleType)),
  condition: { statusCode: { gte: faker.number.int({ min: 400, max: 599 }) } },
  threshold: randFloat({ min: 1, max: 100, fraction: 1 }),
  severity: faker.helpers.arrayElement(Object.values(AlertSeverity)),
  webhookUrl: faker.internet.url(),
  enabled: true,
  createdAt: faker.date.past(),
  updatedAt: faker.date.recent(),
  ...overrides,
})

const createMockRequestLog = (overrides = {}) => ({
  id: faker.string.nanoid(),
  endpointId: faker.string.nanoid(),
  method: faker.helpers.arrayElement(Object.values(HttpMethod)),
  path: `/${faker.lorem.word()}`,
  statusCode: faker.helpers.arrayElement([200, 201, 204, 400, 404, 500]),
  responseTimeMs: faker.number.int({ min: 10, max: 5000 }),
  requestHeaders: { Authorization: `Bearer ${faker.string.alphanumeric(32)}` },
  requestBody: null,
  responseHeaders: { 'Content-Type': 'application/json' },
  responseBody: { data: faker.lorem.word() },
  ipAddress: randIp(),
  userAgent: randUserAgent(),
  timestamp: faker.date.recent(),
  ...overrides,
})

describe('AlertRule model', () => {
  it('should create an alert rule', async () => {
    const mockRule = createMockAlertRule({
      type: AlertRuleType.ERROR_RATE,
      severity: AlertSeverity.CRITICAL,
    })

    prismaMock.alertRule.create.mockResolvedValue(mockRule)

    const result = await prismaMock.alertRule.create({
      data: {
        workspaceId: mockRule.workspaceId,
        name: mockRule.name,
        type: mockRule.type,
        condition: mockRule.condition,
        threshold: mockRule.threshold,
        severity: mockRule.severity,
        webhookUrl: mockRule.webhookUrl,
      },
    })

    expect(result).toEqual(mockRule)
    expect(result.type).toBe(AlertRuleType.ERROR_RATE)
    expect(result.severity).toBe(AlertSeverity.CRITICAL)
  })
})
