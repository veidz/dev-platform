import type { HTTPError } from 'ky'

import type { TokenStorage } from '@/storage/token-storage'

interface AuthInterceptorOptions {
  tokenStorage: TokenStorage
  onTokenRefresh?: () => Promise<{ accessToken: string; refreshToken: string }>
  onAuthError?: (error: HTTPError) => void | Promise<void>
}

export { type AuthInterceptorOptions }
