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
  })
})
