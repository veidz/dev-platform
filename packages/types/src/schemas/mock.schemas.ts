import { z } from 'zod'

import { MockDelayType } from '../types/mock.types'

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

const createMockSchema = z
  .object({
    endpointId: z.string().regex(UUID_REGEX, 'Endpoint ID inválido'),
    name: z.string().min(3).max(100),
    description: z.string().max(500).optional(),
    statusCode: z.number().int().min(100).max(599),
    headers: z.record(z.string(), z.string()).optional(),
    body: z.union([z.record(z.string(), z.unknown()), z.string()]),
    delayType: z.enum(
      [MockDelayType.NONE, MockDelayType.FIXED, MockDelayType.RANGE],
      { message: 'Tipo de delay inválido' },
    ),
    delayMs: z.number().int().min(0).max(30000).optional(),
    delayMinMs: z.number().int().min(0).max(30000).optional(),
    delayMaxMs: z.number().int().min(0).max(30000).optional(),
  })
  .refine(
    (data) => {
      if (data.delayType === MockDelayType.FIXED) {
        return data.delayMs !== undefined
      }
      if (data.delayType === MockDelayType.RANGE) {
        return (
          data.delayMinMs !== undefined &&
          data.delayMaxMs !== undefined &&
          data.delayMinMs < data.delayMaxMs
        )
      }
      return true
    },
    {
      message: 'Configuração de delay inválida para o tipo selecionado',
    },
  )

const updateMockSchema = z.object({
  name: z.string().min(3).max(100).optional(),
  description: z.string().max(500).optional(),
  statusCode: z.number().int().min(100).max(599).optional(),
  headers: z.record(z.string(), z.string()).optional(),
  body: z.union([z.record(z.string(), z.unknown()), z.string()]).optional(),
  delayType: z
    .enum([MockDelayType.NONE, MockDelayType.FIXED, MockDelayType.RANGE], {
      message: 'Tipo de delay inválido',
    })
    .optional(),
  delayMs: z.number().int().min(0).max(30000).optional(),
  delayMinMs: z.number().int().min(0).max(30000).optional(),
  delayMaxMs: z.number().int().min(0).max(30000).optional(),
  enabled: z.boolean().optional(),
})

const createScenarioSchema = z.object({
  endpointId: z.string().regex(UUID_REGEX, 'Endpoint ID inválido'),
  name: z.string().min(3).max(100),
  description: z.string().max(500).optional(),
  mockIds: z
    .array(z.string().regex(UUID_REGEX))
    .min(1, 'Pelo menos 1 mock é necessário'),
})

type CreateMockInput = z.infer<typeof createMockSchema>
type UpdateMockInput = z.infer<typeof updateMockSchema>
type CreateScenarioInput = z.infer<typeof createScenarioSchema>

export { createMockSchema, createScenarioSchema, updateMockSchema }
export type { CreateMockInput, CreateScenarioInput, UpdateMockInput }
