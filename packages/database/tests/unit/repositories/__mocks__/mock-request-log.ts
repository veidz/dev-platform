import type { RequestLog } from '@prisma/client'

import { faker } from '@/__mocks__/faker-adapter'

const mockRequestLogModel = (
  overrides: Partial<RequestLog> = {},
): RequestLog => ({
  id: faker.string.nanoid(),
  endpointId: faker.string.nanoid(),
  method: 'GET',
  path: '/test',
  statusCode: 200,
  responseTimeMs: faker.number.int({ min: 10, max: 1000 }),
  requestHeaders: {},
  requestBody: null,
  responseHeaders: {},
  responseBody: { success: true },
  ipAddress: '192.168.1.1',
  userAgent: 'Mozilla/5.0',
  timestamp: faker.date.recent(),
  ...overrides,
})

const mockRequestLogModels = (
  count: number = 2,
  overrides: Partial<RequestLog> = {},
): RequestLog[] =>
  Array.from({ length: count }, () => mockRequestLogModel(overrides))

export { mockRequestLogModel, mockRequestLogModels }
