import { ErrorCode } from '@/constants/errors'
import { error, success } from '@/utils/response'

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
  })
})
