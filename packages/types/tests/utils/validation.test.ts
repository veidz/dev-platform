import { loginSchema } from '@/schemas/auth.schemas'
import {
  formatZodError,
  validate,
  validateOrThrow,
  ValidationException,
} from '@/utils/validation'

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
      expect(result.errors!.some((error) => error.field === 'email')).toBe(true)
      expect(result.errors!.some((error) => error.field === 'password')).toBe(
        true,
      )
    })
  })

  describe('formatZodError', () => {
    it('should format single error', () => {
      const errors = [{ field: 'email', message: 'Email inválido' }]

      const formatted = formatZodError(errors)

      expect(formatted).toBe('email: Email inválido')
    })

    it('should format multiple errors', () => {
      const errors = [
        { field: 'email', message: 'Email inválido' },
        { field: 'password', message: 'Senha é obrigatória' },
      ]

      const formatted = formatZodError(errors)

      expect(formatted).toBe(
        'email: Email inválido, password: Senha é obrigatória',
      )
    })
  })

  describe('ValidationException', () => {
    it('should create exception with errors', () => {
      const errors = [{ field: 'email', message: 'Email inválido' }]

      const exception = new ValidationException(errors)

      expect(exception.name).toBe('ValidationException')
      expect(exception.errors).toEqual(errors)
      expect(exception.message).toBe('email: Email inválido')
      expect(exception.code).toBe('VALIDATION_ERROR')
    })
  })

  describe('validateOrThrow', () => {
    it('should return data for valid input', () => {
      const data = {
        email: 'user@example.com',
        password: 'password123',
      }

      const result = validateOrThrow(loginSchema, data)

      expect(result).toEqual(data)
    })

    it('should throw ValidationException for invalid input', () => {
      const data = {
        email: 'invalid',
        password: '',
      }

      expect(() => validateOrThrow(loginSchema, data)).toThrow(
        ValidationException,
      )
    })

    it('should throw with correct error details', () => {
      const data = {
        email: 'invalid',
        password: '',
      }

      try {
        validateOrThrow(loginSchema, data)
        fail('Should have thrown')
      } catch (error) {
        expect(error).toBeInstanceOf(ValidationException)
        const validationError = error as ValidationException
        expect(validationError.errors.length).toBeGreaterThan(0)
        expect(validationError.code).toBe('VALIDATION_ERROR')
      }
    })
  })
})
