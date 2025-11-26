import type {
  AuthTokens,
  ForgotPasswordDto,
  LoginCredentials,
  RegisterDto,
  User,
} from '@dev-platform/types'
import { describe, expect, it, jest } from '@jest/globals'
import { mockDeep } from 'jest-mock-extended'

import type { BaseClient } from '@/client/http'
import { AuthModule } from '@/modules/auth/auth'
import type { LoginResponse, RegisterResponse } from '@/modules/auth/auth.types'

describe('auth', () => {
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
    })
  })
})
