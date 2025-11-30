import type {
  CreateMockDto,
  CreateScenarioDto,
  Mock,
  MockScenario,
  UpdateMockDto,
} from '@dev-platform/types'

import type { BaseClient } from '@/client/http'

import type { ListMocksResponse, ListScenariosResponse } from './mock.types'

class MockModule {
  constructor(private readonly client: BaseClient) {}

  async list(endpointId: string): Promise<ListMocksResponse> {
    return this.client
      .get('mocks', {
        searchParams: { endpointId },
      })
      .json()
  }

  async get(id: string): Promise<Mock> {
    return this.client.get(`mocks/${id}`).json()
  }

  async create(data: CreateMockDto): Promise<Mock> {
    return this.client.post('mocks', { json: data }).json()
  }

  async update(id: string, data: UpdateMockDto): Promise<Mock> {
    return this.client.patch(`mocks/${id}`, { json: data }).json()
  }

  async delete(id: string): Promise<void> {
    await this.client.delete(`mocks/${id}`).json()
  }

  async enable(id: string): Promise<Mock> {
    return this.client.patch(`mocks/${id}/enable`).json()
  }

  async disable(id: string): Promise<Mock> {
    return this.client.patch(`mocks/${id}/disable`).json()
  }

  async listScenarios(endpointId: string): Promise<ListScenariosResponse> {
    return this.client
      .get('mock-scenarios', {
        searchParams: { endpointId },
      })
      .json()
  }

  async getScenario(id: string): Promise<MockScenario> {
    return this.client.get(`mock-scenarios/${id}`).json()
  }

  async createScenario(data: CreateScenarioDto): Promise<MockScenario> {
    return this.client.post('mock-scenarios', { json: data }).json()
  }

  async activateScenario(id: string): Promise<MockScenario> {
    return this.client.patch(`mock-scenarios/${id}/activate`).json()
  }

  async deactivateScenario(id: string): Promise<MockScenario> {
    return this.client.patch(`mock-scenarios/${id}/deactivate`).json()
  }

  async deleteScenario(id: string): Promise<void> {
    await this.client.delete(`mock-scenarios/${id}`).json()
  }
}

export { MockModule }
