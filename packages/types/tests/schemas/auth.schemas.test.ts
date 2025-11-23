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
  })
})
