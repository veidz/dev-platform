import type { TokenStorage } from '@/storage/token-storage'

interface SDKConfig {
  baseUrl: string
  apiKey?: string
  timeout?: number
  retry?: RetryConfig
}

interface RetryConfig {
  limit?: number
  methods?: string[]
  statusCodes?: number[]
  maxRetryAfter?: number
}

interface SDKOptions {
  tokenStorage?: TokenStorage
  onTokenRefresh?: () => Promise<{ accessToken: string; refreshToken: string }>
  onAuthError?: (error: Error) => void | Promise<void>
}

export type { RetryConfig, SDKConfig, SDKOptions }
