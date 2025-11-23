import { success } from '@/utils/response'

describe('Response Utils', () => {
  describe('success', () => {
    it('should create success response with data', () => {
      const data = { id: '123', name: 'Test' }

      const response = success(data)

      expect(response.success).toBe(true)
      expect(response.data).toEqual(data)
      expect(response.timestamp).toBeInstanceOf(Date)
    })
  })
})
