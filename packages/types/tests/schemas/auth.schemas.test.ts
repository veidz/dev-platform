import { loginSchema } from '@/schemas/auth.schemas'

describe('Auth Schemas', () => {
  describe('loginSchema', () => {
    it('should validate correct login data', () => {
      const data = {
        email: 'user@example.com',
        password: 'password123',
      }

      const result = loginSchema.safeParse(data)
      expect(result.success).toBe(true)
    })

    it('should reject invalid email', () => {
      const data = {
        email: 'invalid-email',
        password: 'password123',
      }

      const result = loginSchema.safeParse(data)
      expect(result.success).toBe(false)
    })

    it('should reject empty password', () => {
      const data = {
        email: 'user@example.com',
        password: '',
      }

      const result = loginSchema.safeParse(data)
      expect(result.success).toBe(false)
    })
  })
})
