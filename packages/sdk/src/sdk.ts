import type { AuthTokens } from '@dev-platform/types'

import { createBaseClient } from './client/http'
import { AnalyticsModule } from './modules/analytics'
import { ApiModule } from './modules/api'
import { AuthModule } from './modules/auth'
import { EndpointModule } from './modules/endpoint'
import { MockModule } from './modules/mock'
import { WorkspaceModule } from './modules/workspace'
import {
  LocalStorageTokenStorage,
  MemoryTokenStorage,
  type TokenStorage,
} from './storage/token-storage'
import type { SDKConfig, SDKOptions } from './types'

class DevPlatformSDK {
  public readonly auth: AuthModule
  public readonly workspace: WorkspaceModule
  public readonly api: ApiModule
  public readonly endpoint: EndpointModule
  public readonly mock: MockModule
  public readonly analytics: AnalyticsModule

  private readonly tokenStorage: TokenStorage

  constructor(config: SDKConfig, options?: Omit<SDKOptions, 'tokenStorage'>) {
    const isBrowser = typeof window !== 'undefined'
    this.tokenStorage = isBrowser
      ? new LocalStorageTokenStorage()
      : new MemoryTokenStorage()

    const sdkOptions: SDKOptions = {
      tokenStorage: this.tokenStorage,
      onTokenRefresh: () => this.handleTokenRefresh(),
      onAuthError: options?.onAuthError,
    }

    const client = createBaseClient(config, sdkOptions)

    this.auth = new AuthModule(client)
    this.workspace = new WorkspaceModule(client)
    this.api = new ApiModule(client)
    this.endpoint = new EndpointModule(client)
    this.mock = new MockModule(client)
    this.analytics = new AnalyticsModule(client)
  }

  async setTokens(tokens: AuthTokens): Promise<void> {
    await this.tokenStorage.setAccessToken(tokens.accessToken)
    await this.tokenStorage.setRefreshToken(tokens.refreshToken)
  }

  async getAccessToken(): Promise<string | null> {
    return this.tokenStorage.getAccessToken()
  }

  async getRefreshToken(): Promise<string | null> {
    return this.tokenStorage.getRefreshToken()
  }

  async clearTokens(): Promise<void> {
    await this.tokenStorage.clearTokens()
  }

  async isAuthenticated(): Promise<boolean> {
    const accessToken = await this.tokenStorage.getAccessToken()
    return !!accessToken
  }

  private async handleTokenRefresh(): Promise<AuthTokens> {
    const refreshToken = await this.tokenStorage.getRefreshToken()
    if (!refreshToken) {
      throw new Error('No refresh token available')
    }

    const tokens = await this.auth.refreshToken(refreshToken)
    return tokens
  }
}

const createSDK = (
  config: SDKConfig,
  options?: Omit<SDKOptions, 'tokenStorage'>,
): DevPlatformSDK => {
  return new DevPlatformSDK(config, options)
}

export { createSDK, DevPlatformSDK }
