import type {
  AuthTokens,
  ForgotPasswordDto,
  LoginCredentials,
  RegisterDto,
  ResetPasswordDto,
} from '@dev-platform/types'

import type { BaseClient } from '@/client/http'

import type { LoginResponse, RegisterResponse } from './auth.types'

class AuthModule {
  constructor(private readonly client: BaseClient) {}

  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    return this.client.post('auth/login', { json: credentials }).json()
  }

  async register(data: RegisterDto): Promise<RegisterResponse> {
    return this.client.post('auth/register', { json: data }).json()
  }

  async logout(): Promise<void> {
    await this.client.post('auth/logout').json()
  }

  async refreshToken(refreshToken: string): Promise<AuthTokens> {
    return this.client.post('auth/refresh', { json: { refreshToken } }).json()
  }

  async forgotPassword(data: ForgotPasswordDto): Promise<void> {
    await this.client.post('auth/forgot-password', { json: data }).json()
  }

  async resetPassword(data: ResetPasswordDto): Promise<{ message: string }> {
    return this.client
      .post('auth/reset-password', {
        json: data,
      })
      .json()
  }

  async verifyEmail(token: string): Promise<{ message: string }> {
    return this.client
      .post('auth/verify-email', {
        json: { token },
      })
      .json()
  }

  async resendVerificationEmail(email: string): Promise<{ message: string }> {
    return this.client
      .post('auth/resend-verification', {
        json: { email },
      })
      .json()
  }
}

export { AuthModule }
