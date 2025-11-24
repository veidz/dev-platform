import type { Mock, MockScenario } from '@dev-platform/types'

interface ListMocksResponse {
  mocks: Mock[]
  total: number
}

interface ListScenariosResponse {
  scenarios: MockScenario[]
  total: number
}

export { type ListMocksResponse, type ListScenariosResponse }
