import { ErrorCode } from '@/constants/errors'
import {
  createErrorResponse,
  error,
  isErrorResponse,
  isSuccessResponse,
  success,
} from '@/utils/response'

describe('Response Utils', () => {
  describe('success', () => {
    it('should create success response with data', () => {
      const data = { id: '123', name: 'Test' }

      const response = success(data)

      expect(response.success).toBe(true)
      expect(response.data).toEqual(data)
      expect(response.timestamp).toBeInstanceOf(Date)
    })

    it('should include message when provided', () => {
      const data = { id: '123' }
      const message = 'Success message'

      const response = success(data, message)

      expect(response.success).toBe(true)
      expect(response).toHaveProperty('message', message)
    })
  })

  describe('error', () => {
    it('should create error response with code and message', () => {
      const code = ErrorCode.NOT_FOUND
      const message = 'Resource not found'

      const response = error(code, message)

      expect(response.success).toBe(false)
      expect(response.error).toBeDefined()
      expect(response.error!.code).toBe(code)
      expect(response.error!.message).toBe(message)
      expect(response.timestamp).toBeInstanceOf(Date)
    })

    it('should include details when provided', () => {
      const details = { field: 'email', reason: 'invalid format' }

      const response = error(
        ErrorCode.VALIDATION_ERROR,
        'Validation failed',
        details,
      )

      expect(response.success).toBe(false)
      expect(response.error!.details).toEqual(details)
    })
  })

  describe('createErrorResponse', () => {
    it('should create error response object', () => {
      const code = ErrorCode.UNAUTHORIZED
      const message = 'Not authorized'

      const errorResponse = createErrorResponse(code, message)

      expect(errorResponse.code).toBe(code)
      expect(errorResponse.message).toBe(message)
    })

    it('should include details when provided', () => {
      const details = { userId: '123' }

      const errorResponse = createErrorResponse(
        ErrorCode.FORBIDDEN,
        'Access denied',
        details,
      )

      expect(errorResponse.details).toEqual(details)
    })
  })

  describe('isSuccessResponse', () => {
    it('should return true for success response', () => {
      const response = success({ id: '123' })

      expect(isSuccessResponse(response)).toBe(true)
    })

    it('should return false for error response', () => {
      const response = error(ErrorCode.NOT_FOUND, 'Not found')

      expect(isSuccessResponse(response)).toBe(false)
    })
  })

  describe('isErrorResponse', () => {
    it('should return true for error response', () => {
      const response = error(ErrorCode.NOT_FOUND, 'Not found')

      expect(isErrorResponse(response)).toBe(true)
    })
  })
})
