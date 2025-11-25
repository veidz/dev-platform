import { beforeEach, describe, expect, it } from '@jest/globals'

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
      await storage.setAccessToken('access-123')
      const token = await storage.getAccessToken()
      expect(token).toBe('access-123')
    })

    it('should store and retrieve refresh token', async () => {
      await storage.setRefreshToken('refresh-456')
      const token = await storage.getRefreshToken()
      expect(token).toBe('refresh-456')
    })

    it('should update access token', async () => {
      await storage.setAccessToken('old-access')
      await storage.setAccessToken('new-access')
      const token = await storage.getAccessToken()
      expect(token).toBe('new-access')
    })

    it('should update refresh token', async () => {
      await storage.setRefreshToken('old-refresh')
      await storage.setRefreshToken('new-refresh')
      const token = await storage.getRefreshToken()
      expect(token).toBe('new-refresh')
    })

    it('should clear both tokens', async () => {
      await storage.setAccessToken('access-123')
      await storage.setRefreshToken('refresh-456')

      await storage.clearTokens()

      const accessToken = await storage.getAccessToken()
      const refreshToken = await storage.getRefreshToken()

      expect(accessToken).toBeNull()
      expect(refreshToken).toBeNull()
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
      await storage.setAccessToken('access-123')
      const token = await storage.getAccessToken()
      expect(token).toBe('access-123')
      expect(mockLocalStorage['dev-platform:access-token']).toBe('access-123')
    })
  })
})
