import { describe, expect, it } from '@jest/globals'
import { HTTPError, NormalizedOptions } from 'ky'

import {
  AuthenticationError,
  AuthorizationError,
  SDKError,
} from '@/client/errors'

const createHTTPError = (response: Response) => {
  return new HTTPError(
    response,
    new Request('http://test.com'),
    {} as NormalizedOptions,
  )
}

describe('errors', () => {
  describe('SDKError', () => {
    it('should create base SDKError with message and status code', () => {
      const error = new SDKError('Test error', 400)

      expect(error).toBeInstanceOf(Error)
      expect(error).toBeInstanceOf(SDKError)
      expect(error.message).toBe('Test error')
      expect(error.statusCode).toBe(400)
      expect(error.name).toBe('SDKError')
    })

    it('should create SDKError without status code', () => {
      const error = new SDKError('Test error')

      expect(error.statusCode).toBeUndefined()
      expect(error.originalError).toBeUndefined()
    })

    it('should store original error', () => {
      const originalError = new Error('Original')
      const error = new SDKError('Wrapped', 500, originalError)

      expect(error.originalError).toBe(originalError)
    })
  })

  describe('AuthenticationError', () => {
    it('should create AuthenticationError with default message', () => {
      const error = new AuthenticationError()

      expect(error).toBeInstanceOf(SDKError)
      expect(error.message).toBe('Authentication failed')
      expect(error.statusCode).toBe(401)
      expect(error.name).toBe('AuthenticationError')
    })

    it('should create AuthenticationError with custom message', () => {
      const error = new AuthenticationError('Invalid token')

      expect(error.message).toBe('Invalid token')
      expect(error.statusCode).toBe(401)
    })

    it('should store original error', () => {
      const originalError = new Error('Original')
      const error = new AuthenticationError('Custom', originalError)

      expect(error.originalError).toBe(originalError)
    })
  })

  describe('AuthorizationError', () => {
    it('should create AuthorizationError with default message', () => {
      const error = new AuthorizationError()

      expect(error).toBeInstanceOf(SDKError)
      expect(error.message).toBe('Access forbidden')
      expect(error.statusCode).toBe(403)
      expect(error.name).toBe('AuthorizationError')
    })

    it('should create AuthorizationError with custom message', () => {
      const error = new AuthorizationError('No permission')

      expect(error.message).toBe('No permission')
    })
  })
})
