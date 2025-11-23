import { loginSchema } from '@/schemas/auth.schemas'
import { validate } from '@/utils/validation'

describe('Validation Utils', () => {
  describe('validate', () => {
    it('should return success for valid data', () => {
      const data = {
        email: 'user@example.com',
        password: 'password123',
      }

      const result = validate(loginSchema, data)

      expect(result.success).toBe(true)
      expect(result.data).toEqual(data)
      expect(result.errors).toBeUndefined()
    })
  })
})
