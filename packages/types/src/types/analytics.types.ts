export enum AlertSeverity {
  INFO = 'INFO',
  WARNING = 'WARNING',
  ERROR = 'ERROR',
  CRITICAL = 'CRITICAL',
}

export enum AlertRuleType {
  THRESHOLD = 'THRESHOLD',
  ANOMALY = 'ANOMALY',
  ERROR_RATE = 'ERROR_RATE',
}

export interface RequestLog {
  id: string
  endpointId: string
  method: string
  path: string
  statusCode: number
  responseTimeMs: number
  requestHeaders: Record<string, string>
  requestBody?: Record<string, unknown>
  responseHeaders: Record<string, string>
  responseBody?: Record<string, unknown>
  ipAddress: string
  userAgent: string
  timestamp: Date
}

export interface Metric {
  id: string
  endpointId: string
  name: string
  value: number
  unit: string
  timestamp: Date
}

export interface TimeSeriesData {
  timestamp: Date
  value: number
}

export interface Alert {
  id: string
  ruleId: string
  severity: AlertSeverity
  message: string
  triggered: boolean
  resolvedAt?: Date
  createdAt: Date
}

export interface AlertRule {
  id: string
  workspaceId: string
  name: string
  description?: string
  type: AlertRuleType
  condition: Record<string, unknown>
  threshold?: number
  severity: AlertSeverity
  webhookUrl?: string
  enabled: boolean
  createdAt: Date
  updatedAt: Date
}

export interface LogFilters {
  startDate?: Date
  endDate?: Date
  endpointId?: string
  method?: string
  statusCode?: number
  minResponseTime?: number
  maxResponseTime?: number
}

export interface MetricAggregation {
  period: 'hour' | 'day' | 'week' | 'month'
  avg: number
  min: number
  max: number
  count: number
}

export interface CreateAlertRuleDto {
  workspaceId: string
  name: string
  description?: string
  type: AlertRuleType
  condition: Record<string, unknown>
  threshold?: number
  severity: AlertSeverity
  webhookUrl?: string
}

export interface UpdateAlertRuleDto {
  name?: string
  description?: string
  condition?: Record<string, unknown>
  threshold?: number
  severity?: AlertSeverity
  webhookUrl?: string
  enabled?: boolean
}
