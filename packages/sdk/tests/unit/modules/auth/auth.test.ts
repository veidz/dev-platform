import type { AuthTokens, LoginCredentials, User } from '@dev-platform/types'
import { describe, expect, it, jest } from '@jest/globals'
import { mockDeep } from 'jest-mock-extended'

import type { BaseClient } from '@/client/http'
import { AuthModule } from '@/modules/auth/auth'
import type { LoginResponse } from '@/modules/auth/auth.types'

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
    })
  })
})
