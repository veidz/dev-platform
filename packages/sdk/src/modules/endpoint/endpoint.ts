import type {
  CreateEndpointDto,
  Endpoint,
  UpdateEndpointDto,
} from '@dev-platform/types'

import type { BaseClient } from '@/client/http'

import type {
  ListEndpointsResponse,
  TestEndpointRequest,
  TestEndpointResponse,
} from './endpoint.types'

class EndpointModule {
  constructor(private readonly client: BaseClient) {}

  async list(apiId: string): Promise<ListEndpointsResponse> {
    return this.client
      .get('endpoints', {
        searchParams: { apiId },
      })
      .json()
  }

  async get(id: string): Promise<Endpoint> {
    return this.client.get(`endpoints/${id}`).json()
  }

  async create(data: CreateEndpointDto): Promise<Endpoint> {
    return this.client.post('endpoints', { json: data }).json()
  }

  async update(id: string, data: UpdateEndpointDto): Promise<Endpoint> {
    return this.client.patch(`endpoints/${id}`, { json: data }).json()
  }

  async delete(id: string): Promise<void> {
    await this.client.delete(`endpoints/${id}`).json()
  }

  async test(
    id: string,
    request: TestEndpointRequest,
  ): Promise<TestEndpointResponse> {
    return this.client.post(`endpoints/${id}/test`, { json: request }).json()
  }

  async duplicate(id: string, path: string): Promise<Endpoint> {
    return this.client
      .post(`endpoints/${id}/duplicate`, { json: { path } })
      .json()
  }
}

export { EndpointModule }
