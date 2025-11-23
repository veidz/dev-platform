import {
  forgotPasswordSchema,
  loginSchema,
  registerSchema,
} from '@/schemas/auth.schemas'

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

    it('should convert email to lowercase', () => {
      const data = {
        email: 'USER@EXAMPLE.COM',
        password: 'password123',
      }

      const result = loginSchema.safeParse(data)
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.email).toBe('user@example.com')
      }
    })
  })

  describe('registerSchema', () => {
    it('should validate correct registration data', () => {
      const data = {
        email: 'user@example.com',
        password: 'Password1',
        name: 'John Doe',
      }

      const result = registerSchema.safeParse(data)
      expect(result.success).toBe(true)
    })

    it('should reject weak password (no uppercase)', () => {
      const data = {
        email: 'user@example.com',
        password: 'password1',
        name: 'John Doe',
      }

      const result = registerSchema.safeParse(data)
      expect(result.success).toBe(false)
    })

    it('should reject weak password (no lowercase)', () => {
      const data = {
        email: 'user@example.com',
        password: 'PASSWORD1',
        name: 'John Doe',
      }

      const result = registerSchema.safeParse(data)
      expect(result.success).toBe(false)
    })

    it('should reject weak password (no number)', () => {
      const data = {
        email: 'user@example.com',
        password: 'Password',
        name: 'John Doe',
      }

      const result = registerSchema.safeParse(data)
      expect(result.success).toBe(false)
    })

    it('should reject short password', () => {
      const data = {
        email: 'user@example.com',
        password: 'Pass1',
        name: 'John Doe',
      }

      const result = registerSchema.safeParse(data)
      expect(result.success).toBe(false)
    })

    it('should reject short name', () => {
      const data = {
        email: 'user@example.com',
        password: 'Password1',
        name: 'A',
      }

      const result = registerSchema.safeParse(data)
      expect(result.success).toBe(false)
    })

    it('should reject long name', () => {
      const data = {
        email: 'user@example.com',
        password: 'Password1',
        name: 'A'.repeat(101),
      }

      const result = registerSchema.safeParse(data)
      expect(result.success).toBe(false)
    })
  })

  describe('forgotPasswordSchema', () => {
    it('should validate correct email', () => {
      const data = { email: 'user@example.com' }

      const result = forgotPasswordSchema.safeParse(data)
      expect(result.success).toBe(true)
    })
  })
})
