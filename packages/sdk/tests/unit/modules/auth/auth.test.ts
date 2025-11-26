import type {
  AuthTokens,
  ForgotPasswordDto,
  LoginCredentials,
  RegisterDto,
  ResetPasswordDto,
  User,
} from '@dev-platform/types'
import { describe, expect, it, jest } from '@jest/globals'
import { mockDeep } from 'jest-mock-extended'

import type { BaseClient } from '@/client/http'
import { AuthModule } from '@/modules/auth/auth'
import type { LoginResponse, RegisterResponse } from '@/modules/auth/auth.types'

describe('AuthModule', () => {
  const mockClient = mockDeep<BaseClient>()
  const authModule = new AuthModule(mockClient)

  const mockUser: User = {
    id: 'user-123',
    email: 'test@example.com',
    name: 'Test User',
    emailVerified: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  }

  const mockTokens: AuthTokens = {
    accessToken: 'access-token-123',
    refreshToken: 'refresh-token-456',
    expiresIn: 900,
  }

  describe('login', () => {
    it('should login with valid credentials', async () => {
      const credentials: LoginCredentials = {
        email: 'test@example.com',
        password: 'password123',
      }

      const expectedResponse: LoginResponse = {
        user: mockUser,
        tokens: mockTokens,
      }

      mockClient.post.mockReturnValue({
        json: jest
          .fn<() => Promise<LoginResponse>>()
          .mockResolvedValue(expectedResponse),
      } as never)

      const result = await authModule.login(credentials)

      expect(mockClient.post).toHaveBeenCalledWith('auth/login', {
        json: credentials,
      })
      expect(result).toEqual(expectedResponse)
    })

    it('should pass credentials correctly', async () => {
      const credentials: LoginCredentials = {
        email: 'user@test.com',
        password: 'securePass',
      }

      mockClient.post.mockReturnValue({
        json: jest.fn<() => Promise<LoginResponse>>().mockResolvedValue({
          user: mockUser,
          tokens: mockTokens,
        }),
      } as never)

      await authModule.login(credentials)

      expect(mockClient.post).toHaveBeenCalledWith('auth/login', {
        json: credentials,
      })
    })
  })

  describe('register', () => {
    it('should register new user', async () => {
      const registerData: RegisterDto = {
        email: 'newuser@example.com',
        password: 'password123',
        name: 'New User',
      }

      const expectedResponse: RegisterResponse = {
        user: {
          ...mockUser,
          email: registerData.email,
          name: registerData.name,
        },
        tokens: mockTokens,
      }

      mockClient.post.mockReturnValue({
        json: jest
          .fn<() => Promise<RegisterResponse>>()
          .mockResolvedValue(expectedResponse),
      } as never)

      const result = await authModule.register(registerData)

      expect(mockClient.post).toHaveBeenCalledWith('auth/register', {
        json: registerData,
      })
      expect(result).toEqual(expectedResponse)
    })

    it('should pass all registration data', async () => {
      const registerData: RegisterDto = {
        email: 'test@test.com',
        password: 'pass123',
        name: 'Test',
      }

      mockClient.post.mockReturnValue({
        json: jest.fn<() => Promise<RegisterResponse>>().mockResolvedValue({
          user: mockUser,
          tokens: mockTokens,
        }),
      } as never)

      await authModule.register(registerData)

      expect(mockClient.post).toHaveBeenCalledWith('auth/register', {
        json: registerData,
      })
    })
  })

  describe('logout', () => {
    it('should logout user', async () => {
      mockClient.post.mockReturnValue({
        json: jest.fn<() => Promise<void>>().mockResolvedValue(undefined),
      } as never)

      await authModule.logout()

      expect(mockClient.post).toHaveBeenCalledWith('auth/logout')
    })

    it('should return void', async () => {
      mockClient.post.mockReturnValue({
        json: jest.fn<() => Promise<void>>().mockResolvedValue(undefined),
      } as never)

      const result = await authModule.logout()

      expect(result).toBeUndefined()
    })
  })

  describe('refreshToken', () => {
    it('should refresh access token', async () => {
      const refreshToken = 'refresh-token-789'
      const expectedTokens: AuthTokens = {
        accessToken: 'new-access-token',
        refreshToken: 'new-refresh-token',
        expiresIn: 900,
      }

      mockClient.post.mockReturnValue({
        json: jest
          .fn<() => Promise<AuthTokens>>()
          .mockResolvedValue(expectedTokens),
      } as never)

      const result = await authModule.refreshToken(refreshToken)

      expect(mockClient.post).toHaveBeenCalledWith('auth/refresh', {
        json: { refreshToken },
      })
      expect(result).toEqual(expectedTokens)
    })

    it('should pass refresh token correctly', async () => {
      const refreshToken = 'token-123'

      mockClient.post.mockReturnValue({
        json: jest
          .fn<() => Promise<AuthTokens>>()
          .mockResolvedValue(mockTokens),
      } as never)

      await authModule.refreshToken(refreshToken)

      expect(mockClient.post).toHaveBeenCalledWith('auth/refresh', {
        json: { refreshToken },
      })
    })
  })

  describe('forgotPassword', () => {
    it('should send forgot password email', async () => {
      const forgotPasswordData: ForgotPasswordDto = {
        email: 'user@example.com',
      }

      mockClient.post.mockReturnValue({
        json: jest.fn<() => Promise<void>>().mockResolvedValue(undefined),
      } as never)

      await authModule.forgotPassword(forgotPasswordData)

      expect(mockClient.post).toHaveBeenCalledWith('auth/forgot-password', {
        json: forgotPasswordData,
      })
    })

    it('should return void', async () => {
      const forgotPasswordData: ForgotPasswordDto = {
        email: 'test@test.com',
      }

      mockClient.post.mockReturnValue({
        json: jest.fn<() => Promise<void>>().mockResolvedValue(undefined),
      } as never)

      const result = await authModule.forgotPassword(forgotPasswordData)

      expect(result).toBeUndefined()
    })
  })

  describe('resetPassword', () => {
    it('should reset password with token', async () => {
      const resetData: ResetPasswordDto = {
        token: 'reset-token-123',
        password: 'newPassword123',
      }

      const expectedResponse = { message: 'Password reset successfully' }

      mockClient.post.mockReturnValue({
        json: jest
          .fn<() => Promise<{ message: string }>>()
          .mockResolvedValue(expectedResponse),
      } as never)

      const result = await authModule.resetPassword(resetData)

      expect(mockClient.post).toHaveBeenCalledWith('auth/reset-password', {
        json: resetData,
      })
      expect(result).toEqual(expectedResponse)
    })

    it('should return success message', async () => {
      const resetData: ResetPasswordDto = {
        token: 'token-456',
        password: 'pass123',
      }

      const message = { message: 'Success' }

      mockClient.post.mockReturnValue({
        json: jest
          .fn<() => Promise<{ message: string }>>()
          .mockResolvedValue(message),
      } as never)

      const result = await authModule.resetPassword(resetData)

      expect(result).toHaveProperty('message')
      expect(result.message).toBe('Success')
    })
  })

  describe('verifyEmail', () => {
    it('should verify email with token', async () => {
      const token = 'verify-token-123'
      const expectedResponse = { message: 'Email verified successfully' }

      mockClient.post.mockReturnValue({
        json: jest
          .fn<() => Promise<{ message: string }>>()
          .mockResolvedValue(expectedResponse),
      } as never)

      const result = await authModule.verifyEmail(token)

      expect(mockClient.post).toHaveBeenCalledWith('auth/verify-email', {
        json: { token },
      })
      expect(result).toEqual(expectedResponse)
    })

    it('should return success message', async () => {
      const token = 'token-789'
      const message = { message: 'Verified' }

      mockClient.post.mockReturnValue({
        json: jest
          .fn<() => Promise<{ message: string }>>()
          .mockResolvedValue(message),
      } as never)

      const result = await authModule.verifyEmail(token)

      expect(result).toHaveProperty('message')
      expect(result.message).toBe('Verified')
    })
  })

  describe('resendVerificationEmail', () => {
    it('should resend verification email', async () => {
      const email = 'user@example.com'
      const expectedResponse = { message: 'Verification email sent' }

      mockClient.post.mockReturnValue({
        json: jest
          .fn<() => Promise<{ message: string }>>()
          .mockResolvedValue(expectedResponse),
      } as never)

      const result = await authModule.resendVerificationEmail(email)

      expect(mockClient.post).toHaveBeenCalledWith('auth/resend-verification', {
        json: { email },
      })
      expect(result).toEqual(expectedResponse)
    })

    it('should return success message', async () => {
      const email = 'test@test.com'
      const message = { message: 'Sent' }

      mockClient.post.mockReturnValue({
        json: jest
          .fn<() => Promise<{ message: string }>>()
          .mockResolvedValue(message),
      } as never)

      const result = await authModule.resendVerificationEmail(email)

      expect(result).toHaveProperty('message')
      expect(result.message).toBe('Sent')
    })
  })
})
