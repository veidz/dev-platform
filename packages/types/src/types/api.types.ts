export enum HttpMethod {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  PATCH = 'PATCH',
  DELETE = 'DELETE',
  HEAD = 'HEAD',
  OPTIONS = 'OPTIONS',
}

export enum ApiStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  DEPRECATED = 'DEPRECATED',
}

export interface API {
  id: string
  workspaceId: string
  name: string
  description?: string
  baseUrl: string
  version: string
  status: ApiStatus
  createdAt: Date
  updatedAt: Date
}

export interface Endpoint {
  id: string
  apiId: string
  path: string
  method: HttpMethod
  description?: string
  requestSchema?: Record<string, unknown>
  responseSchema?: Record<string, unknown>
  headers?: Record<string, string>
  queryParams?: Record<string, string>
  createdAt: Date
  updatedAt: Date
}

export interface Schema {
  type: string
  properties?: Record<string, unknown>
  required?: string[]
  additionalProperties?: boolean
}

export interface ApiVersion {
  version: string
  releaseDate: Date
  deprecated: boolean
  sunsetDate?: Date
}

export interface CreateApiDto {
  workspaceId: string
  name: string
  description?: string
  baseUrl: string
  version: string
}

export interface UpdateApiDto {
  name?: string
  description?: string
  baseUrl?: string
  version?: string
  status?: ApiStatus
}

export interface CreateEndpointDto {
  apiId: string
  path: string
  method: HttpMethod
  description?: string
  requestSchema?: Record<string, unknown>
  responseSchema?: Record<string, unknown>
  headers?: Record<string, string>
  queryParams?: Record<string, string>
}

export interface UpdateEndpointDto {
  path?: string
  method?: HttpMethod
  description?: string
  requestSchema?: Record<string, unknown>
  responseSchema?: Record<string, unknown>
  headers?: Record<string, string>
  queryParams?: Record<string, string>
}

export interface ImportOpenApiDto {
  workspaceId: string
  spec: string | Record<string, unknown>
}
