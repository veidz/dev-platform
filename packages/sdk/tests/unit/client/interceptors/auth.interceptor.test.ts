import { beforeEach, describe, expect, it, jest } from '@jest/globals'
import { mockDeep } from 'jest-mock-extended'
import { HTTPError, type NormalizedOptions } from 'ky'

import {
  createAuthInterceptor,
  createTokenRefreshInterceptor,
} from '@/client/interceptors/auth.interceptor'
import type { AuthInterceptorOptions } from '@/client/interceptors/auth.interceptor.types'
import type { TokenStorage } from '@/storage/token-storage'

describe('interceptors', () => {
  describe('createAuthInterceptor', () => {
    let tokenStorage: TokenStorage
    let options: AuthInterceptorOptions

    beforeEach(() => {
      tokenStorage = mockDeep<TokenStorage>()
      options = { tokenStorage }
    })

    it('should add Authorization header when access token exists', async () => {
      const mockRequest = new Request('http://test.com')
      jest
        .spyOn(tokenStorage, 'getAccessToken')
        .mockResolvedValue('access-token-123')

      const interceptor = createAuthInterceptor(options)
      await interceptor(mockRequest, mockDeep<NormalizedOptions>(), {
        retryCount: 0,
      })

      expect(mockRequest.headers.get('Authorization')).toBe(
        'Bearer access-token-123',
      )
    })

    it('should not add Authorization header when no access token', async () => {
      const mockRequest = new Request('http://test.com')
      jest.spyOn(tokenStorage, 'getAccessToken').mockResolvedValue(null)

      const interceptor = createAuthInterceptor(options)
      await interceptor(mockRequest, mockDeep<NormalizedOptions>(), {
        retryCount: 0,
      })

      expect(mockRequest.headers.get('Authorization')).toBeNull()
    })

    it('should replace existing Authorization header', async () => {
      const mockRequest = new Request('http://test.com', {
        headers: { Authorization: 'Bearer old-token' },
      })
      jest.spyOn(tokenStorage, 'getAccessToken').mockResolvedValue('new-token')

      const interceptor = createAuthInterceptor(options)
      await interceptor(mockRequest, mockDeep<NormalizedOptions>(), {
        retryCount: 0,
      })

      expect(mockRequest.headers.get('Authorization')).toBe('Bearer new-token')
    })
  })

  describe('createTokenRefreshInterceptor', () => {
    let tokenStorage: TokenStorage
    let options: AuthInterceptorOptions
    let mockHttpError: HTTPError

    beforeEach(() => {
      tokenStorage = mockDeep<TokenStorage>()
      options = { tokenStorage }

      const response = new Response(null, { status: 401 })
      mockHttpError = new HTTPError(
        response,
        new Request('http://test.com'),
        mockDeep<NormalizedOptions>(),
      )
    })

    it('should throw error immediately if status is not 401', async () => {
      const response = new Response(null, { status: 403 })
      const error403 = new HTTPError(
        response,
        new Request('http://test.com'),
        mockDeep<NormalizedOptions>(),
      )

      const interceptor = createTokenRefreshInterceptor(options)

      await expect(interceptor(error403)).rejects.toThrow(error403)
    })

    it('should throw error if onTokenRefresh is not provided', async () => {
      const onAuthError = jest.fn<(error: HTTPError) => Promise<void>>()
      options.onAuthError = onAuthError

      const interceptor = createTokenRefreshInterceptor(options)

      await expect(interceptor(mockHttpError)).rejects.toThrow(mockHttpError)
      expect(onAuthError).toHaveBeenCalledWith(mockHttpError)
    })

    it('should throw error if onTokenRefresh is not provided and no onAuthError', async () => {
      const interceptor = createTokenRefreshInterceptor(options)

      await expect(interceptor(mockHttpError)).rejects.toThrow(mockHttpError)
    })

    it('should refresh tokens successfully', async () => {
      const onTokenRefresh =
        jest.fn<() => Promise<{ accessToken: string; refreshToken: string }>>()
      onTokenRefresh.mockResolvedValue({
        accessToken: 'new-access',
        refreshToken: 'new-refresh',
      })
      options.onTokenRefresh = onTokenRefresh

      const interceptor = createTokenRefreshInterceptor(options)
      await interceptor(mockHttpError)

      expect(onTokenRefresh).toHaveBeenCalledTimes(1)
      expect(tokenStorage.setAccessToken).toHaveBeenCalledWith('new-access')
      expect(tokenStorage.setRefreshToken).toHaveBeenCalledWith('new-refresh')
    })

    it('should clear tokens and call onAuthError on refresh failure', async () => {
      const refreshError = new Error('Refresh failed')
      const onTokenRefresh =
        jest.fn<() => Promise<{ accessToken: string; refreshToken: string }>>()
      onTokenRefresh.mockRejectedValue(refreshError)
      const onAuthError = jest.fn<(error: HTTPError) => Promise<void>>()
      options.onTokenRefresh = onTokenRefresh
      options.onAuthError = onAuthError

      const interceptor = createTokenRefreshInterceptor(options)

      await expect(interceptor(mockHttpError)).rejects.toThrow(refreshError)
      expect(tokenStorage.clearTokens).toHaveBeenCalled()
      expect(onAuthError).toHaveBeenCalledWith(mockHttpError)
    })
  })
})
