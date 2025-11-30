import { z } from 'zod'

import { AlertRuleType, AlertSeverity } from '../types/analytics.types'

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

const URL_REGEX =
  /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)$/

const createAlertRuleSchema = z.object({
  workspaceId: z.string().regex(UUID_REGEX, 'Workspace ID inválido'),
  name: z.string().min(3).max(100),
  description: z.string().max(500).optional(),
  type: z.enum(
    [AlertRuleType.THRESHOLD, AlertRuleType.ANOMALY, AlertRuleType.ERROR_RATE],
    { message: 'Tipo de alerta inválido' },
  ),
  condition: z.record(z.string(), z.unknown()),
  threshold: z.number().optional(),
  severity: z.enum(
    [
      AlertSeverity.INFO,
      AlertSeverity.WARNING,
      AlertSeverity.ERROR,
      AlertSeverity.CRITICAL,
    ],
    { message: 'Severidade inválida' },
  ),
  webhookUrl: z.string().regex(URL_REGEX, 'Webhook URL inválida').optional(),
})

const updateAlertRuleSchema = z.object({
  name: z.string().min(3).max(100).optional(),
  description: z.string().max(500).optional(),
  condition: z.record(z.string(), z.unknown()).optional(),
  threshold: z.number().optional(),
  severity: z
    .enum(
      [
        AlertSeverity.INFO,
        AlertSeverity.WARNING,
        AlertSeverity.ERROR,
        AlertSeverity.CRITICAL,
      ],
      { message: 'Severidade inválida' },
    )
    .optional(),
  webhookUrl: z.string().regex(URL_REGEX, 'Webhook URL inválida').optional(),
  enabled: z.boolean().optional(),
})

const logFiltersSchema = z.object({
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
  endpointId: z.string().regex(UUID_REGEX).optional(),
  method: z.string().optional(),
  statusCode: z.number().int().min(100).max(599).optional(),
  minResponseTime: z.number().int().min(0).optional(),
  maxResponseTime: z.number().int().min(0).optional(),
})

type CreateAlertRuleInput = z.infer<typeof createAlertRuleSchema>
type UpdateAlertRuleInput = z.infer<typeof updateAlertRuleSchema>
type LogFiltersInput = z.infer<typeof logFiltersSchema>

export { createAlertRuleSchema, logFiltersSchema, updateAlertRuleSchema }
export type { CreateAlertRuleInput, LogFiltersInput, UpdateAlertRuleInput }
