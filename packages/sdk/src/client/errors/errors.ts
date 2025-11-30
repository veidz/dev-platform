import { HTTPError, TimeoutError } from 'ky'

import type { ErrorResponse } from './errors.types'

class SDKError extends Error {
  constructor(
    message: string,
    public readonly statusCode?: number,
    public readonly originalError?: unknown,
  ) {
    super(message)
    this.name = 'SDKError'
    Object.setPrototypeOf(this, SDKError.prototype)
  }
}

class AuthenticationError extends SDKError {
  constructor(message = 'Authentication failed', originalError?: unknown) {
    super(message, 401, originalError)
    this.name = 'AuthenticationError'
    Object.setPrototypeOf(this, AuthenticationError.prototype)
  }
}

class AuthorizationError extends SDKError {
  constructor(message = 'Access forbidden', originalError?: unknown) {
    super(message, 403, originalError)
    this.name = 'AuthorizationError'
    Object.setPrototypeOf(this, AuthorizationError.prototype)
  }
}

class NotFoundError extends SDKError {
  constructor(message = 'Resource not found', originalError?: unknown) {
    super(message, 404, originalError)
    this.name = 'NotFoundError'
    Object.setPrototypeOf(this, NotFoundError.prototype)
  }
}

class ValidationError extends SDKError {
  constructor(
    message = 'Validation failed',
    public readonly errors?: Record<string, string[]>,
    originalError?: unknown,
  ) {
    super(message, 422, originalError)
    this.name = 'ValidationError'
    Object.setPrototypeOf(this, ValidationError.prototype)
  }
}

class RateLimitError extends SDKError {
  constructor(
    message = 'Rate limit exceeded',
    public readonly retryAfter?: number,
    originalError?: unknown,
  ) {
    super(message, 429, originalError)
    this.name = 'RateLimitError'
    Object.setPrototypeOf(this, RateLimitError.prototype)
  }
}

class ServerError extends SDKError {
  constructor(message = 'Internal server error', originalError?: unknown) {
    super(message, 500, originalError)
    this.name = 'ServerError'
    Object.setPrototypeOf(this, ServerError.prototype)
  }
}

class NetworkError extends SDKError {
  constructor(message = 'Network error', originalError?: unknown) {
    super(message, undefined, originalError)
    this.name = 'NetworkError'
    Object.setPrototypeOf(this, NetworkError.prototype)
  }
}

class RequestTimeoutError extends SDKError {
  constructor(message = 'Request timeout', originalError?: unknown) {
    super(message, 408, originalError)
    this.name = 'RequestTimeoutError'
    Object.setPrototypeOf(this, RequestTimeoutError.prototype)
  }
}

const parseErrorResponse = async (error: unknown): Promise<SDKError> => {
  if (error instanceof TimeoutError) {
    return new RequestTimeoutError('Request timed out', error)
  }

  if (error instanceof HTTPError) {
    const statusCode = error.response.status
    let errorData: ErrorResponse | undefined

    try {
      errorData = (await error.response.json()) as ErrorResponse
    } catch {
      // Response não é JSON ou não pode ser parseada
    }

    const message =
      errorData?.message || errorData?.error || error.message || 'Unknown error'

    switch (statusCode) {
      case 401:
        return new AuthenticationError(message, error)
      case 403:
        return new AuthorizationError(message, error)
      case 404:
        return new NotFoundError(message, error)
      case 422:
        return new ValidationError(message, errorData?.errors, error)
      case 429: {
        const retryAfter = error.response.headers.get('Retry-After')
        return new RateLimitError(
          message,
          retryAfter ? parseInt(retryAfter, 10) : undefined,
          error,
        )
      }
      case 500:
      case 502:
      case 503:
      case 504:
        return new ServerError(message, error)
      default:
        return new SDKError(message, statusCode, error)
    }
  }

  if (error instanceof Error) {
    return new NetworkError(error.message, error)
  }

  return new SDKError('An unknown error occurred', undefined, error)
}

export {
  AuthenticationError,
  AuthorizationError,
  NetworkError,
  NotFoundError,
  parseErrorResponse,
  RateLimitError,
  RequestTimeoutError,
  SDKError,
  ServerError,
  ValidationError,
}
