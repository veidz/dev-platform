interface TokenStorage {
  getAccessToken(): Promise<string | null>
  setAccessToken(token: string): Promise<void>
  getRefreshToken(): Promise<string | null>
  setRefreshToken(token: string): Promise<void>
  clearTokens(): Promise<void>
}

export { type TokenStorage }
