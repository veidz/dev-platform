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

    it('should return errors for invalid data', () => {
      const data = {
        email: 'invalid-email',
        password: '',
      }

      const result = validate(loginSchema, data)

      expect(result.success).toBe(false)
      expect(result.data).toBeUndefined()
      expect(result.errors).toBeDefined()
      expect(result.errors!.length).toBeGreaterThan(0)
    })

    it('should format error fields correctly', () => {
      const data = {
        email: 'invalid',
        password: '',
      }

      const result = validate(loginSchema, data)

      expect(result.success).toBe(false)
      expect(result.errors).toBeDefined()
      expect(result.errors!.some((err) => err.field === 'email')).toBe(true)
      expect(result.errors!.some((err) => err.field === 'password')).toBe(true)
    })
  })
})
