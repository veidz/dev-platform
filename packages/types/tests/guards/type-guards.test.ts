import { isApiError } from '../../src/guards/type-guards'

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
  })
})
