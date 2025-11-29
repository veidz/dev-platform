import type { AuthTokens } from '@dev-platform/types'
import { beforeEach, describe, expect, it, jest } from '@jest/globals'

import { faker } from '@/__mocks__/faker-adapter'
import { createBaseClient } from '@/client/http'
import { DevPlatformSDK } from '@/sdk'
import type { SDKConfig, SDKOptions } from '@/types'

jest.mock('@/client/http')

describe('DevPlatformSDK', () => {
  let config: SDKConfig
  let sdk: DevPlatformSDK
  let capturedOnTokenRefresh: (() => Promise<AuthTokens>) | undefined

  const createMockTokens = (overrides?: Partial<AuthTokens>): AuthTokens => ({
    accessToken: faker.string.alphanumeric(32),
    refreshToken: faker.string.alphanumeric(32),
    expiresIn: 3600,
    ...overrides,
  })

  beforeEach(() => {
    jest.clearAllMocks()
    capturedOnTokenRefresh = undefined
    ;(createBaseClient as jest.Mock<any>).mockImplementation(
      (_config: any, options?: SDKOptions) => {
        if (options?.onTokenRefresh) {
          capturedOnTokenRefresh = options.onTokenRefresh as any
        }
        return {
          get: jest.fn(),
          post: jest.fn(),
          put: jest.fn(),
          patch: jest.fn(),
          delete: jest.fn(),
        }
      },
    )

    config = {
      baseUrl: faker.internet.url(),
    }
    sdk = new DevPlatformSDK(config)
  })

  describe('constructor', () => {
    it('should initialize all modules', () => {
      expect(sdk.auth).toBeDefined()
      expect(sdk.workspace).toBeDefined()
      expect(sdk.api).toBeDefined()
      expect(sdk.endpoint).toBeDefined()
      expect(sdk.mock).toBeDefined()
      expect(sdk.analytics).toBeDefined()
    })

    it('should use MemoryTokenStorage in Node.js environment', () => {
      const nodeSdk = new DevPlatformSDK(config)
      expect(nodeSdk).toBeDefined()
    })

    it('should use LocalStorageTokenStorage in browser environment', () => {
      const originalWindow = globalThis.window

      Object.defineProperty(globalThis, 'window', {
        value: {},
        writable: true,
        configurable: true,
      })

      const browserSdk = new DevPlatformSDK(config)
      expect(browserSdk).toBeDefined()

      if (originalWindow === undefined) {
        delete (globalThis as any).window
      } else {
        globalThis.window = originalWindow
      }
    })
  })

  describe('setTokens', () => {
    it('should store access and refresh tokens', async () => {
      const tokens = createMockTokens()

      await sdk.setTokens(tokens)

      const accessToken = await sdk.getAccessToken()
      const refreshToken = await sdk.getRefreshToken()

      expect(accessToken).toBe(tokens.accessToken)
      expect(refreshToken).toBe(tokens.refreshToken)
    })
  })

  describe('getAccessToken', () => {
    it('should return access token when set', async () => {
      const token = faker.string.alphanumeric(32)
      await sdk.setTokens(createMockTokens({ accessToken: token }))

      const result = await sdk.getAccessToken()

      expect(result).toBe(token)
    })

    it('should return null when no token set', async () => {
      const result = await sdk.getAccessToken()

      expect(result).toBeNull()
    })
  })

  describe('getRefreshToken', () => {
    it('should return refresh token when set', async () => {
      const token = faker.string.alphanumeric(32)
      await sdk.setTokens(createMockTokens({ refreshToken: token }))

      const result = await sdk.getRefreshToken()

      expect(result).toBe(token)
    })
  })
})
