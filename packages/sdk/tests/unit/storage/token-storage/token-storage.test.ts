import { beforeEach, describe, expect, it } from '@jest/globals'

import { MemoryTokenStorage } from '@/storage/token-storage'

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
  })
})
