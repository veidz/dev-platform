import ky, {
  type BeforeRequestHook,
  HTTPError,
  type KyInstance,
  type Options,
} from 'ky'

import { parseErrorResponse } from '@/client/errors'
import type { SDKConfig, SDKOptions } from '@/types/config.types'

import {
  createAuthInterceptor,
  createTokenRefreshInterceptor,
} from '../interceptors'

const createBaseClient = (
  config: SDKConfig,
  options?: SDKOptions,
): KyInstance => {
  const beforeRequestHooks: BeforeRequestHook[] = []

  if (options?.tokenStorage) {
    beforeRequestHooks.push(
      createAuthInterceptor({
        tokenStorage: options.tokenStorage,
        onTokenRefresh: options.onTokenRefresh,
        onAuthError: options.onAuthError,
      }),
    )
  }

  const defaultOptions: Options = {
    prefixUrl: config.baseUrl,
    timeout: config.timeout ?? 10000,
    retry: {
      limit: config.retry?.limit ?? 3,
      methods: ['get', 'post', 'put', 'patch', 'delete'],
      statusCodes: config.retry?.statusCodes ?? [
        408, 413, 429, 500, 502, 503, 504,
      ],
      maxRetryAfter: config.retry?.maxRetryAfter ?? 60000,
    },
    headers: {
      'Content-Type': 'application/json',
      ...(config.apiKey && { 'X-API-Key': config.apiKey }),
    },
    hooks: {
      beforeRequest: beforeRequestHooks,
      beforeError: [
        async (error): Promise<HTTPError> => {
          const sdkError = await parseErrorResponse(error)
          throw sdkError
        },
      ],
    },
  }

  const client = ky.create(defaultOptions)

  if (options?.tokenStorage && options?.onTokenRefresh) {
    const tokenRefreshInterceptor = createTokenRefreshInterceptor({
      tokenStorage: options.tokenStorage,
      onTokenRefresh: options.onTokenRefresh,
      onAuthError: options.onAuthError,
    })

    return client.extend({
      hooks: {
        beforeRetry: [
          async ({ error }): Promise<void> => {
            if (error instanceof HTTPError) {
              await tokenRefreshInterceptor(error)
            }
          },
        ],
      },
    })
  }

  return client
}

type BaseClient = KyInstance

export { createBaseClient }
export type { BaseClient }
