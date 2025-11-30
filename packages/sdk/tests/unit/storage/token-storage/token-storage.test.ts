import { beforeEach, describe, expect, it } from '@jest/globals'

import { faker } from '@/__mocks__/faker-adapter'
import {
  LocalStorageTokenStorage,
  MemoryTokenStorage,
} from '@/storage/token-storage'

describe('token-storage', () => {
  describe('MemoryTokenStorage', () => {
    let storage: MemoryTokenStorage

    beforeEach(() => {
      storage = new MemoryTokenStorage()
    })

    it('should return null for access token initially', async () => {
      const token = await storage.getAccessToken()
      expect(token).toBeNull()
    })

    it('should return null for refresh token initially', async () => {
      const token = await storage.getRefreshToken()
      expect(token).toBeNull()
    })

    it('should store and retrieve access token', async () => {
      const accessToken = faker.string.alphanumeric(32)
      await storage.setAccessToken(accessToken)
      const token = await storage.getAccessToken()
      expect(token).toBe(accessToken)
    })

    it('should store and retrieve refresh token', async () => {
      const refreshToken = faker.string.alphanumeric(32)
      await storage.setRefreshToken(refreshToken)
      const token = await storage.getRefreshToken()
      expect(token).toBe(refreshToken)
    })

    it('should update access token', async () => {
      const oldToken = faker.string.alphanumeric(32)
      const newToken = faker.string.alphanumeric(32)
      await storage.setAccessToken(oldToken)
      await storage.setAccessToken(newToken)
      const token = await storage.getAccessToken()
      expect(token).toBe(newToken)
    })

    it('should update refresh token', async () => {
      const oldToken = faker.string.alphanumeric(32)
      const newToken = faker.string.alphanumeric(32)
      await storage.setRefreshToken(oldToken)
      await storage.setRefreshToken(newToken)
      const token = await storage.getRefreshToken()
      expect(token).toBe(newToken)
    })

    it('should clear both tokens', async () => {
      const accessToken = faker.string.alphanumeric(32)
      const refreshToken = faker.string.alphanumeric(32)
      await storage.setAccessToken(accessToken)
      await storage.setRefreshToken(refreshToken)

      await storage.clearTokens()

      const retrievedAccessToken = await storage.getAccessToken()
      const retrievedRefreshToken = await storage.getRefreshToken()

      expect(retrievedAccessToken).toBeNull()
      expect(retrievedRefreshToken).toBeNull()
    })
  })

  describe('LocalStorageTokenStorage', () => {
    let storage: LocalStorageTokenStorage
    let mockLocalStorage: Record<string, string>

    beforeEach(() => {
      mockLocalStorage = {}

      Object.defineProperty(globalThis, 'window', {
        value: {
          localStorage: {
            getItem: (key: string) => mockLocalStorage[key] ?? null,
            setItem: (key: string, value: string) =>
              (mockLocalStorage[key] = value),
            removeItem: (key: string) => delete mockLocalStorage[key],
          },
        },
        writable: true,
        configurable: true,
      })

      storage = new LocalStorageTokenStorage()
    })

    it('should return null for access token initially', async () => {
      const token = await storage.getAccessToken()
      expect(token).toBeNull()
    })

    it('should return null for refresh token initially', async () => {
      const token = await storage.getRefreshToken()
      expect(token).toBeNull()
    })

    it('should store and retrieve access token', async () => {
      const accessToken = faker.string.alphanumeric(32)
      await storage.setAccessToken(accessToken)
      const token = await storage.getAccessToken()
      expect(token).toBe(accessToken)
      expect(mockLocalStorage['dev-platform:access-token']).toBe(accessToken)
    })

    it('should store and retrieve refresh token', async () => {
      const refreshToken = faker.string.alphanumeric(32)
      await storage.setRefreshToken(refreshToken)
      const token = await storage.getRefreshToken()
      expect(token).toBe(refreshToken)
      expect(mockLocalStorage['dev-platform:refresh-token']).toBe(refreshToken)
    })

    it('should update access token', async () => {
      const oldToken = faker.string.alphanumeric(32)
      const newToken = faker.string.alphanumeric(32)
      await storage.setAccessToken(oldToken)
      await storage.setAccessToken(newToken)
      const token = await storage.getAccessToken()
      expect(token).toBe(newToken)
    })

    it('should update refresh token', async () => {
      const oldToken = faker.string.alphanumeric(32)
      const newToken = faker.string.alphanumeric(32)
      await storage.setRefreshToken(oldToken)
      await storage.setRefreshToken(newToken)
      const token = await storage.getRefreshToken()
      expect(token).toBe(newToken)
    })

    it('should clear both tokens', async () => {
      const accessToken = faker.string.alphanumeric(32)
      const refreshToken = faker.string.alphanumeric(32)
      await storage.setAccessToken(accessToken)
      await storage.setRefreshToken(refreshToken)

      await storage.clearTokens()

      const retrievedAccessToken = await storage.getAccessToken()
      const retrievedRefreshToken = await storage.getRefreshToken()

      expect(retrievedAccessToken).toBeNull()
      expect(retrievedRefreshToken).toBeNull()
      expect(mockLocalStorage['dev-platform:access-token']).toBeUndefined()
      expect(mockLocalStorage['dev-platform:refresh-token']).toBeUndefined()
    })

    it('should return null when window is undefined', async () => {
      Object.defineProperty(globalThis, 'window', {
        value: undefined,
        writable: true,
        configurable: true,
      })

      storage = new LocalStorageTokenStorage()

      const accessToken = await storage.getAccessToken()
      const refreshToken = await storage.getRefreshToken()

      expect(accessToken).toBeNull()
      expect(refreshToken).toBeNull()
    })

    it('should not store tokens when window is undefined', async () => {
      Object.defineProperty(globalThis, 'window', {
        value: undefined,
        writable: true,
        configurable: true,
      })

      storage = new LocalStorageTokenStorage()

      const accessToken = faker.string.alphanumeric(32)
      const refreshToken = faker.string.alphanumeric(32)
      await storage.setAccessToken(accessToken)
      await storage.setRefreshToken(refreshToken)

      expect(Object.keys(mockLocalStorage)).toHaveLength(0)
    })

    it('should not clear tokens when window is undefined', async () => {
      const accessToken = faker.string.alphanumeric(32)
      const refreshToken = faker.string.alphanumeric(32)
      mockLocalStorage['dev-platform:access-token'] = accessToken
      mockLocalStorage['dev-platform:refresh-token'] = refreshToken

      Object.defineProperty(globalThis, 'window', {
        value: undefined,
        writable: true,
        configurable: true,
      })

      storage = new LocalStorageTokenStorage()
      await storage.clearTokens()

      expect(mockLocalStorage['dev-platform:access-token']).toBe(accessToken)
      expect(mockLocalStorage['dev-platform:refresh-token']).toBe(refreshToken)
    })

    it('should return null when localStorage is not available', async () => {
      Object.defineProperty(globalThis, 'window', {
        value: { localStorage: null },
        writable: true,
        configurable: true,
      })

      storage = new LocalStorageTokenStorage()

      const accessToken = await storage.getAccessToken()
      const refreshToken = await storage.getRefreshToken()

      expect(accessToken).toBeNull()
      expect(refreshToken).toBeNull()
    })
  })
})
