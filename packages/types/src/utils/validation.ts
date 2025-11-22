import { type ZodSchema } from 'zod'

import { ErrorCode } from '../constants/errors'

interface ValidationError {
  field: string
  message: string
}

interface ValidationResult<T> {
  success: boolean
  data?: T
  errors?: ValidationError[]
}

const validate = <T>(
  schema: ZodSchema<T>,
  data: unknown,
): ValidationResult<T> => {
  const result = schema.safeParse(data)

  if (result.success) {
    return {
      success: true,
      data: result.data,
    }
  }

  return {
    success: false,
    errors: result.error.issues.map((err) => ({
      field: err.path.join('.'),
      message: err.message,
    })),
  }
}

const formatZodError = (errors: ValidationError[]): string => {
  return errors.map((err) => `${err.field}: ${err.message}`).join(', ')
}

class ValidationException extends Error {
  code: ErrorCode = ErrorCode.VALIDATION_ERROR
  errors: ValidationError[]

  constructor(errors: ValidationError[]) {
    super(formatZodError(errors))
    this.name = 'ValidationException'
    this.errors = errors
  }
}

const validateOrThrow = <T>(schema: ZodSchema<T>, data: unknown): T => {
  const result = validate(schema, data)

  if (!result.success) {
    throw new ValidationException(result.errors!)
  }

  return result.data!
}

export { formatZodError, validate, validateOrThrow, ValidationException }
export type { ValidationError, ValidationResult }
