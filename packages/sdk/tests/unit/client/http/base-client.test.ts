import { beforeEach, describe, expect, it, jest } from '@jest/globals'
import ky from 'ky'

import { createBaseClient } from '@/client/http/base-client'
import type { SDKConfig } from '@/types/config.types'

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
  })
})
