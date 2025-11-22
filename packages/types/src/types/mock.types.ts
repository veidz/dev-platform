export enum MockDelayType {
  FIXED = 'FIXED',
  RANGE = 'RANGE',
  NONE = 'NONE',
}

export interface Mock {
  id: string
  endpointId: string
  name: string
  description?: string
  statusCode: number
  headers?: Record<string, string>
  body: Record<string, unknown> | string
  delayType: MockDelayType
  delayMs?: number
  delayMinMs?: number
  delayMaxMs?: number
  enabled: boolean
  createdAt: Date
  updatedAt: Date
}

export interface MockScenario {
  id: string
  endpointId: string
  name: string
  description?: string
  mocks: Mock[]
  active: boolean
  createdAt: Date
  updatedAt: Date
}

export interface MockResponse {
  statusCode: number
  headers: Record<string, string>
  body: Record<string, unknown> | string
  delay: number
}

export interface CreateMockDto {
  endpointId: string
  name: string
  description?: string
  statusCode: number
  headers?: Record<string, string>
  body: Record<string, unknown> | string
  delayType: MockDelayType
  delayMs?: number
  delayMinMs?: number
  delayMaxMs?: number
}

export interface UpdateMockDto {
  name?: string
  description?: string
  statusCode?: number
  headers?: Record<string, string>
  body?: Record<string, unknown> | string
  delayType?: MockDelayType
  delayMs?: number
  delayMinMs?: number
  delayMaxMs?: number
  enabled?: boolean
}

export interface CreateScenarioDto {
  endpointId: string
  name: string
  description?: string
  mockIds: string[]
}
