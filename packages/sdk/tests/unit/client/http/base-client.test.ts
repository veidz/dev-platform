import { beforeEach, describe, expect, it, jest } from '@jest/globals'
import { mockDeep } from 'jest-mock-extended'
import ky, { HTTPError, type NormalizedOptions } from 'ky'

import { parseErrorResponse } from '@/client/errors'
import { createBaseClient } from '@/client/http/base-client'
import {
  createAuthInterceptor,
  createTokenRefreshInterceptor,
} from '@/client/interceptors'
import type { TokenStorage } from '@/storage/token-storage'
import type { SDKConfig, SDKOptions } from '@/types/config.types'

jest.mock('@/client/errors')
jest.mock('@/client/interceptors')

type MockKyInstance = {
  get: jest.Mock
  post: jest.Mock
  put: jest.Mock
  patch: jest.Mock
  delete: jest.Mock
  extend: jest.Mock
}

const createMockHTTPErrorOptions = (): NormalizedOptions => ({
  method: 'get',
  retry: { limit: 0 },
  prefixUrl: '',
  onDownloadProgress: () => {},
  onUploadProgress: () => {},
  headers: {},
  context: {},
})

describe('createBaseClient', () => {
  let mockKyInstance: MockKyInstance
  let mockExtendedInstance: MockKyInstance

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
    it('should add auth interceptor when tokenStorage is provided', () => {
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

    it('should add auth interceptor with callbacks when they are provided', () => {
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
        onTokenRefresh: mockOnTokenRefresh,
        onAuthError: mockOnAuthError,
      }

      createBaseClient(config, options)

      expect(createAuthInterceptor).toHaveBeenCalledWith({
        tokenStorage: mockTokenStorage,
        onTokenRefresh: mockOnTokenRefresh,
        onAuthError: mockOnAuthError,
      })
    })

    it('should not add auth interceptor when tokenStorage is not provided', () => {
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

  describe('token refresh interceptor integration', () => {
    it('should add token refresh interceptor when both tokenStorage and onTokenRefresh are provided', () => {
      const config: SDKConfig = {
        baseUrl: 'https://api.example.com',
      }

      const mockTokenStorage = mockDeep<TokenStorage>()
      const mockOnTokenRefresh =
        jest.fn<() => Promise<{ accessToken: string; refreshToken: string }>>()
      const mockTokenRefreshInterceptor = jest.fn()
      ;(createTokenRefreshInterceptor as jest.Mock).mockReturnValue(
        mockTokenRefreshInterceptor,
      )

      const options: SDKOptions = {
        tokenStorage: mockTokenStorage,
        onTokenRefresh: mockOnTokenRefresh,
      }

      const client = createBaseClient(config, options)

      expect(createTokenRefreshInterceptor).toHaveBeenCalledWith({
        tokenStorage: mockTokenStorage,
        onTokenRefresh: mockOnTokenRefresh,
        onAuthError: undefined,
      })

      expect(mockKyInstance.extend).toHaveBeenCalledWith({
        hooks: {
          beforeRetry: expect.any(Array),
        },
      })

      expect(client).toBe(mockExtendedInstance)
    })

    it('should add token refresh interceptor when onAuthError callback is provided', () => {
      const config: SDKConfig = {
        baseUrl: 'https://api.example.com',
      }

      const mockTokenStorage = mockDeep<TokenStorage>()
      const mockOnTokenRefresh =
        jest.fn<() => Promise<{ accessToken: string; refreshToken: string }>>()
      const mockOnAuthError = jest.fn<(error: Error) => void | Promise<void>>()
      const mockTokenRefreshInterceptor = jest.fn()
      ;(createTokenRefreshInterceptor as jest.Mock).mockReturnValue(
        mockTokenRefreshInterceptor,
      )

      const options: SDKOptions = {
        tokenStorage: mockTokenStorage,
        onTokenRefresh: mockOnTokenRefresh,
        onAuthError: mockOnAuthError,
      }

      createBaseClient(config, options)

      expect(createTokenRefreshInterceptor).toHaveBeenCalledWith({
        tokenStorage: mockTokenStorage,
        onTokenRefresh: mockOnTokenRefresh,
        onAuthError: mockOnAuthError,
      })
    })

    it('should call token refresh interceptor on beforeRetry hook with HTTPError', async () => {
      const config: SDKConfig = {
        baseUrl: 'https://api.example.com',
      }

      const mockTokenStorage = mockDeep<TokenStorage>()
      const mockOnTokenRefresh =
        jest.fn<() => Promise<{ accessToken: string; refreshToken: string }>>()
      const mockTokenRefreshInterceptor = jest.fn()
      ;(createTokenRefreshInterceptor as jest.Mock).mockReturnValue(
        mockTokenRefreshInterceptor,
      )

      const options: SDKOptions = {
        tokenStorage: mockTokenStorage,
        onTokenRefresh: mockOnTokenRefresh,
      }

      createBaseClient(config, options)

      const extendCall = (mockKyInstance.extend as jest.Mock).mock
        .calls[0][0] as {
        hooks: {
          beforeRetry: Array<(context: { error: Error }) => Promise<void>>
        }
      }
      const beforeRetryHook = extendCall.hooks.beforeRetry[0]

      const mockError = new HTTPError(
        new Response(null, { status: 401 }),
        new Request('https://api.example.com/test'),
        createMockHTTPErrorOptions(),
      )

      await beforeRetryHook({ error: mockError })

      expect(mockTokenRefreshInterceptor).toHaveBeenCalledWith(mockError)
    })

    it('should not call token refresh interceptor on beforeRetry hook with non-HTTPError', async () => {
      const config: SDKConfig = {
        baseUrl: 'https://api.example.com',
      }

      const mockTokenStorage = mockDeep<TokenStorage>()
      const mockOnTokenRefresh =
        jest.fn<() => Promise<{ accessToken: string; refreshToken: string }>>()
      const mockTokenRefreshInterceptor = jest.fn()
      ;(createTokenRefreshInterceptor as jest.Mock).mockReturnValue(
        mockTokenRefreshInterceptor,
      )

      const options: SDKOptions = {
        tokenStorage: mockTokenStorage,
        onTokenRefresh: mockOnTokenRefresh,
      }

      createBaseClient(config, options)

      const extendCall = (mockKyInstance.extend as jest.Mock).mock
        .calls[0][0] as {
        hooks: {
          beforeRetry: Array<(context: { error: Error }) => Promise<void>>
        }
      }
      const beforeRetryHook = extendCall.hooks.beforeRetry[0]

      const mockError = new Error('Generic error')

      await beforeRetryHook({ error: mockError })

      expect(mockTokenRefreshInterceptor).not.toHaveBeenCalled()
    })

    it('should not add token refresh interceptor when tokenStorage is not provided', () => {
      const config: SDKConfig = {
        baseUrl: 'https://api.example.com',
      }

      const mockOnTokenRefresh =
        jest.fn<() => Promise<{ accessToken: string; refreshToken: string }>>()

      const options: SDKOptions = {
        onTokenRefresh: mockOnTokenRefresh,
      }

      const client = createBaseClient(config, options)

      expect(createTokenRefreshInterceptor).not.toHaveBeenCalled()
      expect(mockKyInstance.extend).not.toHaveBeenCalled()
      expect(client).toBe(mockKyInstance)
    })

    it('should not add token refresh interceptor when onTokenRefresh is not provided', () => {
      const config: SDKConfig = {
        baseUrl: 'https://api.example.com',
      }

      const mockTokenStorage = mockDeep<TokenStorage>()

      const options: SDKOptions = {
        tokenStorage: mockTokenStorage,
      }

      const client = createBaseClient(config, options)

      expect(createTokenRefreshInterceptor).not.toHaveBeenCalled()
      expect(mockKyInstance.extend).not.toHaveBeenCalled()
      expect(client).toBe(mockKyInstance)
    })
  })

  describe('error handling integration', () => {
    it('should configure beforeError hook with parseErrorResponse', () => {
      const config: SDKConfig = {
        baseUrl: 'https://api.example.com',
      }

      createBaseClient(config)

      const createCall = (ky.create as jest.Mock).mock.calls[0][0] as {
        hooks: { beforeError: Array<(error: HTTPError) => Promise<HTTPError>> }
      }
      expect(createCall.hooks.beforeError).toHaveLength(1)
      expect(createCall.hooks.beforeError[0]).toEqual(expect.any(Function))
    })

    it('should call parseErrorResponse in beforeError hook and throw result', async () => {
      const config: SDKConfig = {
        baseUrl: 'https://api.example.com',
      }

      const mockError = new HTTPError(
        new Response(null, { status: 500 }),
        new Request('https://api.example.com/test'),
        createMockHTTPErrorOptions(),
      )

      const mockParsedError = new Error('Parsed error')
      ;(
        parseErrorResponse as jest.Mock<typeof parseErrorResponse>
      ).mockResolvedValue(mockParsedError)

      createBaseClient(config)

      const createCall = (ky.create as jest.Mock).mock.calls[0][0] as {
        hooks: { beforeError: Array<(error: HTTPError) => Promise<HTTPError>> }
      }
      const beforeErrorHook = createCall.hooks.beforeError[0]

      await expect(beforeErrorHook(mockError)).rejects.toThrow(mockParsedError)
      expect(parseErrorResponse).toHaveBeenCalledWith(mockError)
    })
  })

  describe('full integration scenarios', () => {
    it('should create fully configured client with all options', () => {
      const config: SDKConfig = {
        baseUrl: 'https://api.example.com',
        apiKey: 'secret-key',
        timeout: 8000,
        retry: {
          limit: 4,
          statusCodes: [503],
          maxRetryAfter: 45000,
        },
      }

      const mockTokenStorage = mockDeep<TokenStorage>()
      const mockOnTokenRefresh =
        jest.fn<() => Promise<{ accessToken: string; refreshToken: string }>>()
      const mockOnAuthError = jest.fn<(error: Error) => void | Promise<void>>()

      const options: SDKOptions = {
        tokenStorage: mockTokenStorage,
        onTokenRefresh: mockOnTokenRefresh,
        onAuthError: mockOnAuthError,
      }

      const client = createBaseClient(config, options)

      expect(ky.create).toHaveBeenCalledWith({
        prefixUrl: 'https://api.example.com',
        timeout: 8000,
        retry: {
          limit: 4,
          methods: ['get', 'post', 'put', 'patch', 'delete'],
          statusCodes: [503],
          maxRetryAfter: 45000,
        },
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': 'secret-key',
        },
        hooks: {
          beforeRequest: expect.any(Array),
          beforeError: expect.any(Array),
        },
      })

      expect(createAuthInterceptor).toHaveBeenCalledWith({
        tokenStorage: mockTokenStorage,
        onTokenRefresh: mockOnTokenRefresh,
        onAuthError: mockOnAuthError,
      })

      expect(createTokenRefreshInterceptor).toHaveBeenCalledWith({
        tokenStorage: mockTokenStorage,
        onTokenRefresh: mockOnTokenRefresh,
        onAuthError: mockOnAuthError,
      })

      expect(mockKyInstance.extend).toHaveBeenCalled()
      expect(client).toBe(mockExtendedInstance)
    })

    it('should create client without auth when tokenStorage is not provided', () => {
      const config: SDKConfig = {
        baseUrl: 'https://api.example.com',
        apiKey: 'public-key',
      }

      const client = createBaseClient(config)

      expect(createAuthInterceptor).not.toHaveBeenCalled()
      expect(createTokenRefreshInterceptor).not.toHaveBeenCalled()
      expect(mockKyInstance.extend).not.toHaveBeenCalled()
      expect(client).toBe(mockKyInstance)
    })
  })
})
