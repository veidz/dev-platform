import type {
  API,
  CreateApiDto,
  ImportOpenApiDto,
  UpdateApiDto,
} from '@dev-platform/types'

import type { BaseClient } from '@/client/http'

import type { ImportApiResponse, ListApisResponse } from './api.types'

class ApiModule {
  constructor(private readonly client: BaseClient) {}

  async list(workspaceId: string): Promise<ListApisResponse> {
    return this.client
      .get('apis', {
        searchParams: { workspaceId },
      })
      .json()
  }

  async get(id: string): Promise<API> {
    return this.client.get(`apis/${id}`).json()
  }

  async create(data: CreateApiDto): Promise<API> {
    return this.client.post('apis', { json: data }).json()
  }

  async update(id: string, data: UpdateApiDto): Promise<API> {
    return this.client.patch(`apis/${id}`, { json: data }).json()
  }

  async delete(id: string): Promise<void> {
    await this.client.delete(`apis/${id}`).json()
  }

  async importOpenApi(data: ImportOpenApiDto): Promise<ImportApiResponse> {
    return this.client.post('apis/import', { json: data }).json()
  }

  async exportOpenApi(id: string): Promise<Record<string, unknown>> {
    return this.client.get(`apis/${id}/export`).json()
  }

  async duplicate(id: string, name: string): Promise<API> {
    return this.client.post(`apis/${id}/duplicate`, { json: { name } }).json()
  }
}

export { ApiModule }
