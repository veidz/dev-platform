import { ErrorCode } from '../../src/constants/errors'
import { isApiError, isAuthError } from '../../src/guards/type-guards'

describe('Type Guards', () => {
  describe('isApiError', () => {
    it('should return true for valid error object', () => {
      const error = {
        code: 'NOT_FOUND',
        message: 'Resource not found',
      }

      expect(isApiError(error)).toBe(true)
    })

    it('should return false for object without code', () => {
      const error = {
        message: 'Error message',
      }

      expect(isApiError(error)).toBe(false)
    })

    it('should return false for object without message', () => {
      const error = {
        code: 'ERROR_CODE',
      }

      expect(isApiError(error)).toBe(false)
    })

    it('should return false for null', () => {
      expect(isApiError(null)).toBe(false)
    })

    it('should return false for non-object', () => {
      expect(isApiError('string')).toBe(false)
      expect(isApiError(123)).toBe(false)
      expect(isApiError(true)).toBe(false)
    })

    it('should return false for object with non-string code', () => {
      const error = {
        code: 123,
        message: 'Error message',
      }

      expect(isApiError(error)).toBe(false)
    })

    it('should return false for object with non-string message', () => {
      const error = {
        code: 'ERROR_CODE',
        message: 123,
      }

      expect(isApiError(error)).toBe(false)
    })

    it('should return false for undefined', () => {
      expect(isApiError(undefined)).toBe(false)
    })
  })

  describe('isAuthError', () => {
    it('should return true for INVALID_CREDENTIALS error', () => {
      const error = {
        code: ErrorCode.INVALID_CREDENTIALS,
        message: 'Invalid credentials',
      }

      expect(isAuthError(error)).toBe(true)
    })

    it('should return true for UNAUTHORIZED error', () => {
      const error = {
        code: ErrorCode.UNAUTHORIZED,
        message: 'Unauthorized',
      }

      expect(isAuthError(error)).toBe(true)
    })

    it('should return true for TOKEN_EXPIRED error', () => {
      const error = {
        code: ErrorCode.TOKEN_EXPIRED,
        message: 'Token expired',
      }

      expect(isAuthError(error)).toBe(true)
    })

    it('should return true for TOKEN_INVALID error', () => {
      const error = {
        code: ErrorCode.TOKEN_INVALID,
        message: 'Token invalid',
      }

      expect(isAuthError(error)).toBe(true)
    })

    it('should return true for EMAIL_NOT_VERIFIED error', () => {
      const error = {
        code: ErrorCode.EMAIL_NOT_VERIFIED,
        message: 'Email not verified',
      }

      expect(isAuthError(error)).toBe(true)
    })

    it('should return false for non-auth error', () => {
      const error = {
        code: ErrorCode.NOT_FOUND,
        message: 'Not found',
      }

      expect(isAuthError(error)).toBe(false)
    })

    it('should return false for invalid error object', () => {
      expect(isAuthError({ message: 'error' })).toBe(false)
    })

    it('should return false for null', () => {
      expect(isAuthError(null)).toBe(false)
    })

    it('should return false for non-object', () => {
      expect(isAuthError('string')).toBe(false)
      expect(isAuthError(123)).toBe(false)
    })
  })
})
