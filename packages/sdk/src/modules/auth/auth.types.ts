import type { AuthTokens, User } from '@dev-platform/types'

interface LoginResponse {
  user: User
  tokens: AuthTokens
}

interface RegisterResponse {
  user: User
  tokens: AuthTokens
}

export { type LoginResponse, type RegisterResponse }
