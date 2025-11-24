import { beforeEach, describe, expect, it, jest } from '@jest/globals'
import { mockDeep } from 'jest-mock-extended'
import { type NormalizedOptions } from 'ky'

import { createAuthInterceptor } from '@/client/interceptors/auth.interceptor'
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
  })
})
