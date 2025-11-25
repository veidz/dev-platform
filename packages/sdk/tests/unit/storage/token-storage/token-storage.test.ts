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
  })
})
