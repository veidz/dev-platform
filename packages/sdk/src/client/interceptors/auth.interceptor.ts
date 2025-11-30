import { type BeforeRequestHook, HTTPError } from 'ky'

import type { AuthInterceptorOptions } from './auth.interceptor.types'

const createAuthInterceptor = (
  options: AuthInterceptorOptions,
): BeforeRequestHook => {
  return async (request) => {
    const accessToken = await options.tokenStorage.getAccessToken()

    if (accessToken) {
      request.headers.set('Authorization', `Bearer ${accessToken}`)
    }
  }
}

const createTokenRefreshInterceptor = (
  options: AuthInterceptorOptions,
): ((error: HTTPError) => Promise<void>) => {
  let isRefreshing = false
  let refreshPromise: Promise<void> | null = null

  return async (error: HTTPError): Promise<void> => {
    if (error.response.status !== 401) {
      throw error
    }

    if (!options.onTokenRefresh) {
      if (options.onAuthError) {
        await options.onAuthError(error)
      }
      throw error
    }

    if (isRefreshing && refreshPromise) {
      await refreshPromise
      return
    }

    isRefreshing = true
    refreshPromise = (async (): Promise<void> => {
      try {
        const tokens = await options.onTokenRefresh!()
        await options.tokenStorage.setAccessToken(tokens.accessToken)
        await options.tokenStorage.setRefreshToken(tokens.refreshToken)
      } catch (refreshError) {
        await options.tokenStorage.clearTokens()
        if (options.onAuthError) {
          await options.onAuthError(error)
        }
        throw refreshError
      } finally {
        isRefreshing = false
        refreshPromise = null
      }
    })()

    await refreshPromise
  }
}

export { createAuthInterceptor, createTokenRefreshInterceptor }
