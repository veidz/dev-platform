import { beforeEach, describe, expect, it, jest } from '@jest/globals'
import { mockDeep } from 'jest-mock-extended'
import ky from 'ky'

import { createBaseClient } from '@/client/http/base-client'
import { createAuthInterceptor } from '@/client/interceptors'
import type { TokenStorage } from '@/storage/token-storage'
import type { SDKConfig, SDKOptions } from '@/types/config.types'

jest.mock('@/client/errors')
jest.mock('@/client/interceptors')

describe('createBaseClient', () => {
  let mockKyInstance: any
  let mockExtendedInstance: any

  beforeEach(() => {
    jest.clearAllMocks()

    mockExtendedInstance = {
      get: jest.fn(),
      post: jest.fn(),
      put: jest.fn(),
      patch: jest.fn(),
      delete: jest.fn(),
      extend: jest.fn(),
    }

    mockKyInstance = {
      get: jest.fn(),
      post: jest.fn(),
      put: jest.fn(),
      patch: jest.fn(),
      delete: jest.fn(),
      extend: jest.fn(() => mockExtendedInstance),
    }
    ;(ky.create as jest.Mock).mockReturnValue(mockKyInstance)
  })

  describe('basic configuration', () => {
    it('should create ky instance with minimal config', () => {
      const config: SDKConfig = {
        baseUrl: 'https://api.example.com',
      }

      const client = createBaseClient(config)

      expect(ky.create).toHaveBeenCalledWith({
        prefixUrl: 'https://api.example.com',
        timeout: 10000,
        retry: {
          limit: 3,
          methods: ['get', 'post', 'put', 'patch', 'delete'],
          statusCodes: [408, 413, 429, 500, 502, 503, 504],
          maxRetryAfter: 60000,
        },
        headers: {
          'Content-Type': 'application/json',
        },
        hooks: {
          beforeRequest: [],
          beforeError: expect.any(Array),
        },
      })

      expect(client).toBe(mockKyInstance)
    })

    it('should create ky instance with custom timeout', () => {
      const config: SDKConfig = {
        baseUrl: 'https://api.example.com',
        timeout: 5000,
      }

      createBaseClient(config)

      expect(ky.create).toHaveBeenCalledWith(
        expect.objectContaining({
          timeout: 5000,
        }),
      )
    })

    it('should create ky instance with API key in headers', () => {
      const config: SDKConfig = {
        baseUrl: 'https://api.example.com',
        apiKey: 'test-api-key-123',
      }

      createBaseClient(config)

      expect(ky.create).toHaveBeenCalledWith(
        expect.objectContaining({
          headers: {
            'Content-Type': 'application/json',
            'X-API-Key': 'test-api-key-123',
          },
        }),
      )
    })

    it('should create ky instance with custom retry limit', () => {
      const config: SDKConfig = {
        baseUrl: 'https://api.example.com',
        retry: {
          limit: 5,
        },
      }

      createBaseClient(config)

      expect(ky.create).toHaveBeenCalledWith(
        expect.objectContaining({
          retry: {
            limit: 5,
            methods: ['get', 'post', 'put', 'patch', 'delete'],
            statusCodes: [408, 413, 429, 500, 502, 503, 504],
            maxRetryAfter: 60000,
          },
        }),
      )
    })

    it('should create ky instance with custom retry statusCodes', () => {
      const config: SDKConfig = {
        baseUrl: 'https://api.example.com',
        retry: {
          statusCodes: [500, 502],
        },
      }

      createBaseClient(config)

      expect(ky.create).toHaveBeenCalledWith(
        expect.objectContaining({
          retry: expect.objectContaining({
            statusCodes: [500, 502],
          }),
        }),
      )
    })

    it('should create ky instance with custom retry maxRetryAfter', () => {
      const config: SDKConfig = {
        baseUrl: 'https://api.example.com',
        retry: {
          maxRetryAfter: 30000,
        },
      }

      createBaseClient(config)

      expect(ky.create).toHaveBeenCalledWith(
        expect.objectContaining({
          retry: expect.objectContaining({
            maxRetryAfter: 30000,
          }),
        }),
      )
    })
  })

  describe('auth interceptor integration', () => {
    it('should add auth interceptor when tokenStorage provided', () => {
      const config: SDKConfig = {
        baseUrl: 'https://api.example.com',
      }

      const mockTokenStorage = mockDeep<TokenStorage>()
      const mockAuthInterceptor = jest.fn()
      ;(createAuthInterceptor as jest.Mock).mockReturnValue(mockAuthInterceptor)

      const options: SDKOptions = {
        tokenStorage: mockTokenStorage,
      }

      createBaseClient(config, options)

      expect(createAuthInterceptor).toHaveBeenCalledWith({
        tokenStorage: mockTokenStorage,
        onTokenRefresh: undefined,
        onAuthError: undefined,
      })

      expect(ky.create).toHaveBeenCalledWith(
        expect.objectContaining({
          hooks: expect.objectContaining({
            beforeRequest: [mockAuthInterceptor],
          }),
        }),
      )
    })

    it('should add auth interceptor with callbacks when provided', () => {
      const config: SDKConfig = {
        baseUrl: 'https://api.example.com',
      }

      const mockTokenStorage = mockDeep<TokenStorage>()
      const mockOnTokenRefresh =
        jest.fn<() => Promise<{ accessToken: string; refreshToken: string }>>()
      const mockOnAuthError = jest.fn<(error: Error) => void | Promise<void>>()
      const mockAuthInterceptor = jest.fn()
      ;(createAuthInterceptor as jest.Mock).mockReturnValue(mockAuthInterceptor)

      const options: SDKOptions = {
        tokenStorage: mockTokenStorage,
        onTokenRefresh: mockOnTokenRefresh as any,
        onAuthError: mockOnAuthError as any,
      }

      createBaseClient(config, options)

      expect(createAuthInterceptor).toHaveBeenCalledWith({
        tokenStorage: mockTokenStorage,
        onTokenRefresh: mockOnTokenRefresh,
        onAuthError: mockOnAuthError,
      })
    })

    it('should not add auth interceptor when tokenStorage not provided', () => {
      const config: SDKConfig = {
        baseUrl: 'https://api.example.com',
      }

      createBaseClient(config)

      expect(createAuthInterceptor).not.toHaveBeenCalled()

      expect(ky.create).toHaveBeenCalledWith(
        expect.objectContaining({
          hooks: expect.objectContaining({
            beforeRequest: [],
          }),
        }),
      )
    })
  })
})
