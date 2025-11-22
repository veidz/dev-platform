import { z } from 'zod'

import { ApiStatus, HttpMethod } from '../types/api.types'

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

const URL_REGEX =
  /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)$/

const urlSchema = z.string().regex(URL_REGEX, 'URL inválida')

const createApiSchema = z.object({
  workspaceId: z.string().regex(UUID_REGEX, 'Workspace ID inválido'),
  name: z.string().min(3).max(100),
  description: z.string().max(500).optional(),
  baseUrl: urlSchema,
  version: z.string().regex(/^\d+\.\d+\.\d+$/, 'Versão inválida (use x.y.z)'),
})

const updateApiSchema = z.object({
  name: z.string().min(3).max(100).optional(),
  description: z.string().max(500).optional(),
  baseUrl: urlSchema.optional(),
  version: z
    .string()
    .regex(/^\d+\.\d+\.\d+$/, 'Versão inválida (use x.y.z)')
    .optional(),
  status: z
    .enum([ApiStatus.ACTIVE, ApiStatus.INACTIVE, ApiStatus.DEPRECATED], {
      message: 'Status inválido',
    })
    .optional(),
})

const createEndpointSchema = z.object({
  apiId: z.string().regex(UUID_REGEX, 'API ID inválido'),
  path: z.string().regex(/^\//, 'Path deve começar com /'),
  method: z.enum(
    [
      HttpMethod.GET,
      HttpMethod.POST,
      HttpMethod.PUT,
      HttpMethod.PATCH,
      HttpMethod.DELETE,
    ],
    { message: 'Método HTTP inválido' },
  ),
  description: z.string().max(500).optional(),
  requestSchema: z.record(z.string(), z.unknown()).optional(),
  responseSchema: z.record(z.string(), z.unknown()).optional(),
  headers: z.record(z.string(), z.string()).optional(),
  queryParams: z.record(z.string(), z.string()).optional(),
})

const updateEndpointSchema = z.object({
  path: z.string().regex(/^\//, 'Path deve começar com /').optional(),
  method: z
    .enum(
      [
        HttpMethod.GET,
        HttpMethod.POST,
        HttpMethod.PUT,
        HttpMethod.PATCH,
        HttpMethod.DELETE,
      ],
      { message: 'Método HTTP inválido' },
    )
    .optional(),
  description: z.string().max(500).optional(),
  requestSchema: z.record(z.string(), z.unknown()).optional(),
  responseSchema: z.record(z.string(), z.unknown()).optional(),
  headers: z.record(z.string(), z.string()).optional(),
  queryParams: z.record(z.string(), z.string()).optional(),
})

const importOpenApiSchema = z.object({
  workspaceId: z.string().regex(UUID_REGEX, 'Workspace ID inválido'),
  spec: z.union([z.string(), z.record(z.string(), z.unknown())]),
})

type CreateApiInput = z.infer<typeof createApiSchema>
type UpdateApiInput = z.infer<typeof updateApiSchema>
type CreateEndpointInput = z.infer<typeof createEndpointSchema>
type UpdateEndpointInput = z.infer<typeof updateEndpointSchema>
type ImportOpenApiInput = z.infer<typeof importOpenApiSchema>

export {
  createApiSchema,
  createEndpointSchema,
  importOpenApiSchema,
  updateApiSchema,
  updateEndpointSchema,
}
export type {
  CreateApiInput,
  CreateEndpointInput,
  ImportOpenApiInput,
  UpdateApiInput,
  UpdateEndpointInput,
}
