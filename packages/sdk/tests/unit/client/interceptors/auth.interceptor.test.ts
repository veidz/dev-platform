import { beforeEach, describe, expect, it, jest } from '@jest/globals'
import { mockDeep } from 'jest-mock-extended'
import { HTTPError, type NormalizedOptions } from 'ky'

import { faker } from '@/__mocks__/faker-adapter'
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
      const mockRequest = new Request(faker.internet.url())
      const accessToken = faker.string.alphanumeric(32)
      jest.spyOn(tokenStorage, 'getAccessToken').mockResolvedValue(accessToken)

      const interceptor = createAuthInterceptor(options)
      await interceptor(mockRequest, mockDeep<NormalizedOptions>(), {
        retryCount: 0,
      })

      expect(mockRequest.headers.get('Authorization')).toBe(
        `Bearer ${accessToken}`,
      )
    })

    it('should not add Authorization header when no access token', async () => {
      const mockRequest = new Request(faker.internet.url())
      jest.spyOn(tokenStorage, 'getAccessToken').mockResolvedValue(null)

      const interceptor = createAuthInterceptor(options)
      await interceptor(mockRequest, mockDeep<NormalizedOptions>(), {
        retryCount: 0,
      })

      expect(mockRequest.headers.get('Authorization')).toBeNull()
    })

    it('should replace existing Authorization header', async () => {
      const oldToken = faker.string.alphanumeric(32)
      const newToken = faker.string.alphanumeric(32)
      const mockRequest = new Request(faker.internet.url(), {
        headers: { Authorization: `Bearer ${oldToken}` },
      })
      jest.spyOn(tokenStorage, 'getAccessToken').mockResolvedValue(newToken)

      const interceptor = createAuthInterceptor(options)
      await interceptor(mockRequest, mockDeep<NormalizedOptions>(), {
        retryCount: 0,
      })

      expect(mockRequest.headers.get('Authorization')).toBe(
        `Bearer ${newToken}`,
      )
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
        new Request(faker.internet.url()),
        mockDeep<NormalizedOptions>(),
      )
    })

    it('should throw error immediately if status is not 401', async () => {
      const response = new Response(null, { status: 403 })
      const error403 = new HTTPError(
        response,
        new Request(faker.internet.url()),
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
      const newAccessToken = faker.string.alphanumeric(32)
      const newRefreshToken = faker.string.alphanumeric(32)
      const onTokenRefresh =
        jest.fn<() => Promise<{ accessToken: string; refreshToken: string }>>()
      onTokenRefresh.mockResolvedValue({
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      })
      options.onTokenRefresh = onTokenRefresh

      const interceptor = createTokenRefreshInterceptor(options)
      await interceptor(mockHttpError)

      expect(onTokenRefresh).toHaveBeenCalledTimes(1)
      expect(tokenStorage.setAccessToken).toHaveBeenCalledWith(newAccessToken)
      expect(tokenStorage.setRefreshToken).toHaveBeenCalledWith(newRefreshToken)
    })

    it('should clear tokens and call onAuthError on refresh failure', async () => {
      const refreshError = new Error(faker.lorem.sentence())
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

    it('should not refresh multiple times concurrently', async () => {
      const newAccessToken = faker.string.alphanumeric(32)
      const newRefreshToken = faker.string.alphanumeric(32)
      const onTokenRefresh =
        jest.fn<() => Promise<{ accessToken: string; refreshToken: string }>>()
      onTokenRefresh.mockImplementation(
        () =>
          new Promise((resolve) =>
            setTimeout(
              () =>
                resolve({
                  accessToken: newAccessToken,
                  refreshToken: newRefreshToken,
                }),
              100,
            ),
          ),
      )
      options.onTokenRefresh = onTokenRefresh

      const interceptor = createTokenRefreshInterceptor(options)

      const promise1 = interceptor(mockHttpError)
      const promise2 = interceptor(mockHttpError)
      const promise3 = interceptor(mockHttpError)

      await Promise.all([promise1, promise2, promise3])

      expect(onTokenRefresh).toHaveBeenCalledTimes(1)
    })

    it('should allow refresh after previous refresh completed', async () => {
      const newAccessToken = faker.string.alphanumeric(32)
      const newRefreshToken = faker.string.alphanumeric(32)
      const onTokenRefresh =
        jest.fn<() => Promise<{ accessToken: string; refreshToken: string }>>()
      onTokenRefresh.mockResolvedValue({
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      })
      options.onTokenRefresh = onTokenRefresh

      const interceptor = createTokenRefreshInterceptor(options)

      await interceptor(mockHttpError)
      expect(onTokenRefresh).toHaveBeenCalledTimes(1)

      await interceptor(mockHttpError)
      expect(onTokenRefresh).toHaveBeenCalledTimes(2)
    })

    it('should handle refresh failure and allow retry', async () => {
      const firstFailureMsg = faker.lorem.sentence()
      const newAccessToken = faker.string.alphanumeric(32)
      const newRefreshToken = faker.string.alphanumeric(32)
      const onTokenRefresh =
        jest.fn<() => Promise<{ accessToken: string; refreshToken: string }>>()
      onTokenRefresh
        .mockRejectedValueOnce(new Error(firstFailureMsg))
        .mockResolvedValueOnce({
          accessToken: newAccessToken,
          refreshToken: newRefreshToken,
        })
      options.onTokenRefresh = onTokenRefresh

      const interceptor = createTokenRefreshInterceptor(options)

      await expect(interceptor(mockHttpError)).rejects.toThrow(firstFailureMsg)
      expect(tokenStorage.clearTokens).toHaveBeenCalledTimes(1)

      await interceptor(mockHttpError)
      expect(onTokenRefresh).toHaveBeenCalledTimes(2)
      expect(tokenStorage.setAccessToken).toHaveBeenCalledWith(newAccessToken)
    })
  })
})
