import type { TokenStorage } from './token-storage.types'

class MemoryTokenStorage implements TokenStorage {
  private accessToken: string | null = null
  private refreshToken: string | null = null

  async getAccessToken(): Promise<string | null> {
    return this.accessToken
  }

  async setAccessToken(token: string): Promise<void> {
    this.accessToken = token
  }

  async getRefreshToken(): Promise<string | null> {
    return this.refreshToken
  }

  async setRefreshToken(token: string): Promise<void> {
    this.refreshToken = token
  }

  async clearTokens(): Promise<void> {
    this.accessToken = null
    this.refreshToken = null
  }
}

class LocalStorageTokenStorage implements TokenStorage {
  private readonly accessTokenKey = 'dev-platform:access-token'
  private readonly refreshTokenKey = 'dev-platform:refresh-token'

  async getAccessToken(): Promise<string | null> {
    if (typeof window === 'undefined' || !window.localStorage) {
      return null
    }
    return window.localStorage.getItem(this.accessTokenKey)
  }

  async setAccessToken(token: string): Promise<void> {
    if (typeof window === 'undefined' || !window.localStorage) {
      return
    }
    window.localStorage.setItem(this.accessTokenKey, token)
  }

  async getRefreshToken(): Promise<string | null> {
    if (typeof window === 'undefined' || !window.localStorage) {
      return null
    }
    return window.localStorage.getItem(this.refreshTokenKey)
  }

  async setRefreshToken(token: string): Promise<void> {
    if (typeof window === 'undefined' || !window.localStorage) {
      return
    }
    window.localStorage.setItem(this.refreshTokenKey, token)
  }

  async clearTokens(): Promise<void> {
    if (typeof window === 'undefined' || !window.localStorage) {
      return
    }
    window.localStorage.removeItem(this.accessTokenKey)
    window.localStorage.removeItem(this.refreshTokenKey)
  }
}

export { LocalStorageTokenStorage, MemoryTokenStorage }
