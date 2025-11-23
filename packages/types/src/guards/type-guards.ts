import { ErrorCode } from '../constants/errors'
import type { ErrorResponse } from '../types/utils.types'

const isApiError = (value: unknown): value is ErrorResponse => {
  return (
    typeof value === 'object' &&
    value !== null &&
    'code' in value &&
    'message' in value &&
    typeof (value as ErrorResponse).code === 'string' &&
    typeof (value as ErrorResponse).message === 'string'
  )
}

const isAuthError = (value: unknown): value is ErrorResponse => {
  if (!isApiError(value)) return false

  const authErrors: ErrorCode[] = [
    ErrorCode.INVALID_CREDENTIALS,
    ErrorCode.UNAUTHORIZED,
    ErrorCode.TOKEN_EXPIRED,
    ErrorCode.TOKEN_INVALID,
    ErrorCode.EMAIL_NOT_VERIFIED,
  ]

  return authErrors.includes(value.code as ErrorCode)
}

const isValidationError = (value: unknown): value is ErrorResponse => {
  if (!isApiError(value)) return false

  return (
    value.code === ErrorCode.VALIDATION_ERROR ||
    value.code === ErrorCode.INVALID_INPUT
  )
}

const isOfType =
  <T>(predicate: (value: unknown) => boolean) =>
  (value: unknown): value is T => {
    return predicate(value)
  }

const hasProperty = <K extends PropertyKey>(
  object: unknown,
  key: K,
): object is Record<K, unknown> => {
  return typeof object === 'object' && object !== null && key in object
}

const isNonNull = <T>(value: T | null | undefined): value is T => {
  return value !== null && value !== undefined
}

export {
  hasProperty,
  isApiError,
  isAuthError,
  isNonNull,
  isOfType,
  isValidationError,
}
