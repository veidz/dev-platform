import { describe, expect, it } from '@jest/globals'
import { HTTPError, NormalizedOptions, TimeoutError } from 'ky'

import {
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
} from '@/client/errors'

const createHTTPError = (response: Response) => {
  return new HTTPError(
    response,
    new Request('http://test.com'),
    {} as NormalizedOptions,
  )
}

describe('errors', () => {
  describe('SDKError', () => {
    it('should create base SDKError with message and status code', () => {
      const error = new SDKError('Test error', 400)

      expect(error).toBeInstanceOf(Error)
      expect(error).toBeInstanceOf(SDKError)
      expect(error.message).toBe('Test error')
      expect(error.statusCode).toBe(400)
      expect(error.name).toBe('SDKError')
    })

    it('should create SDKError without status code', () => {
      const error = new SDKError('Test error')

      expect(error.statusCode).toBeUndefined()
      expect(error.originalError).toBeUndefined()
    })

    it('should store original error', () => {
      const originalError = new Error('Original')
      const error = new SDKError('Wrapped', 500, originalError)

      expect(error.originalError).toBe(originalError)
    })
  })

  describe('AuthenticationError', () => {
    it('should create AuthenticationError with default message', () => {
      const error = new AuthenticationError()

      expect(error).toBeInstanceOf(SDKError)
      expect(error.message).toBe('Authentication failed')
      expect(error.statusCode).toBe(401)
      expect(error.name).toBe('AuthenticationError')
    })

    it('should create AuthenticationError with custom message', () => {
      const error = new AuthenticationError('Invalid token')

      expect(error.message).toBe('Invalid token')
      expect(error.statusCode).toBe(401)
    })

    it('should store original error', () => {
      const originalError = new Error('Original')
      const error = new AuthenticationError('Custom', originalError)

      expect(error.originalError).toBe(originalError)
    })
  })

  describe('AuthorizationError', () => {
    it('should create AuthorizationError with default message', () => {
      const error = new AuthorizationError()

      expect(error).toBeInstanceOf(SDKError)
      expect(error.message).toBe('Access forbidden')
      expect(error.statusCode).toBe(403)
      expect(error.name).toBe('AuthorizationError')
    })

    it('should create AuthorizationError with custom message', () => {
      const error = new AuthorizationError('No permission')

      expect(error.message).toBe('No permission')
    })
  })

  describe('NotFoundError', () => {
    it('should create NotFoundError with default message', () => {
      const error = new NotFoundError()

      expect(error).toBeInstanceOf(SDKError)
      expect(error.message).toBe('Resource not found')
      expect(error.statusCode).toBe(404)
      expect(error.name).toBe('NotFoundError')
    })

    it('should create NotFoundError with custom message', () => {
      const error = new NotFoundError('User not found')

      expect(error.message).toBe('User not found')
    })
  })

  describe('ValidationError', () => {
    it('should create ValidationError with default message', () => {
      const error = new ValidationError()

      expect(error).toBeInstanceOf(SDKError)
      expect(error.message).toBe('Validation failed')
      expect(error.statusCode).toBe(422)
      expect(error.name).toBe('ValidationError')
    })

    it('should create ValidationError with errors object', () => {
      const errors = { email: ['Invalid email'], password: ['Too short'] }
      const error = new ValidationError('Invalid data', errors)

      expect(error.message).toBe('Invalid data')
      expect(error.errors).toEqual(errors)
    })

    it('should create ValidationError without errors object', () => {
      const error = new ValidationError('Invalid')

      expect(error.errors).toBeUndefined()
    })
  })

  describe('RateLimitError', () => {
    it('should create RateLimitError with default message', () => {
      const error = new RateLimitError()

      expect(error).toBeInstanceOf(SDKError)
      expect(error.message).toBe('Rate limit exceeded')
      expect(error.statusCode).toBe(429)
      expect(error.name).toBe('RateLimitError')
    })

    it('should create RateLimitError with retryAfter', () => {
      const error = new RateLimitError('Too many requests', 60)

      expect(error.message).toBe('Too many requests')
      expect(error.retryAfter).toBe(60)
    })

    it('should create RateLimitError without retryAfter', () => {
      const error = new RateLimitError()

      expect(error.retryAfter).toBeUndefined()
    })
  })

  describe('ServerError', () => {
    it('should create ServerError with default message', () => {
      const error = new ServerError()

      expect(error).toBeInstanceOf(SDKError)
      expect(error.message).toBe('Internal server error')
      expect(error.statusCode).toBe(500)
      expect(error.name).toBe('ServerError')
    })

    it('should create ServerError with custom message', () => {
      const error = new ServerError('Database error')

      expect(error.message).toBe('Database error')
    })
  })

  describe('NetworkError', () => {
    it('should create NetworkError with default message', () => {
      const error = new NetworkError()

      expect(error).toBeInstanceOf(SDKError)
      expect(error.message).toBe('Network error')
      expect(error.statusCode).toBeUndefined()
      expect(error.name).toBe('NetworkError')
    })

    it('should create NetworkError with custom message', () => {
      const error = new NetworkError('Connection lost')

      expect(error.message).toBe('Connection lost')
    })
  })

  describe('RequestTimeoutError', () => {
    it('should create RequestTimeoutError with default message', () => {
      const error = new RequestTimeoutError()

      expect(error).toBeInstanceOf(SDKError)
      expect(error.message).toBe('Request timeout')
      expect(error.statusCode).toBe(408)
      expect(error.name).toBe('RequestTimeoutError')
    })

    it('should create RequestTimeoutError with custom message', () => {
      const error = new RequestTimeoutError('Request took too long')

      expect(error.message).toBe('Request took too long')
    })
  })

  describe('parseErrorResponse', () => {
    it('should parse TimeoutError', async () => {
      const timeoutError = new TimeoutError(new Request('http://test.com'))
      const result = await parseErrorResponse(timeoutError)

      expect(result).toBeInstanceOf(RequestTimeoutError)
      expect(result.message).toBe('Request timed out')
      expect(result.originalError).toBe(timeoutError)
    })

    it('should parse HTTPError with 401 status', async () => {
      const response = new Response(
        JSON.stringify({ message: 'Invalid credentials' }),
        { status: 401 },
      )
      const httpError = createHTTPError(response)
      const result = await parseErrorResponse(httpError)

      expect(result).toBeInstanceOf(AuthenticationError)
      expect(result.message).toBe('Invalid credentials')
    })

    it('should parse HTTPError with 403 status', async () => {
      const response = new Response(JSON.stringify({ error: 'Forbidden' }), {
        status: 403,
      })
      const httpError = createHTTPError(response)
      const result = await parseErrorResponse(httpError)

      expect(result).toBeInstanceOf(AuthorizationError)
      expect(result.message).toBe('Forbidden')
    })

    it('should parse HTTPError with 404 status', async () => {
      const response = new Response(JSON.stringify({ message: 'Not found' }), {
        status: 404,
      })
      const httpError = createHTTPError(response)
      const result = await parseErrorResponse(httpError)

      expect(result).toBeInstanceOf(NotFoundError)
      expect(result.message).toBe('Not found')
    })

    it('should parse HTTPError with 422 status and validation errors', async () => {
      const response = new Response(
        JSON.stringify({
          message: 'Validation failed',
          errors: { email: ['Invalid'] },
        }),
        { status: 422 },
      )
      const httpError = createHTTPError(response)
      const result = await parseErrorResponse(httpError)

      expect(result).toBeInstanceOf(ValidationError)
      expect(result.message).toBe('Validation failed')
      expect((result as ValidationError).errors).toEqual({ email: ['Invalid'] })
    })

    it('should parse HTTPError with 429 status and Retry-After header', async () => {
      const response = new Response(
        JSON.stringify({ message: 'Too many requests' }),
        {
          status: 429,
          headers: { 'Retry-After': '120' },
        },
      )
      const httpError = createHTTPError(response)
      const result = await parseErrorResponse(httpError)

      expect(result).toBeInstanceOf(RateLimitError)
      expect(result.message).toBe('Too many requests')
      expect((result as RateLimitError).retryAfter).toBe(120)
    })

    it('should parse HTTPError with 429 status without Retry-After header', async () => {
      const response = new Response(
        JSON.stringify({ message: 'Rate limited' }),
        {
          status: 429,
        },
      )
      const httpError = createHTTPError(response)
      const result = await parseErrorResponse(httpError)

      expect(result).toBeInstanceOf(RateLimitError)
      expect((result as RateLimitError).retryAfter).toBeUndefined()
    })

    it('should parse HTTPError with 500 status', async () => {
      const response = new Response(
        JSON.stringify({ message: 'Server error' }),
        {
          status: 500,
        },
      )
      const httpError = createHTTPError(response)
      const result = await parseErrorResponse(httpError)

      expect(result).toBeInstanceOf(ServerError)
      expect(result.message).toBe('Server error')
    })

    it('should parse HTTPError with 502 status', async () => {
      const response = new Response(
        JSON.stringify({ message: 'Bad gateway' }),
        {
          status: 502,
        },
      )
      const httpError = createHTTPError(response)
      const result = await parseErrorResponse(httpError)

      expect(result).toBeInstanceOf(ServerError)
    })

    it('should parse HTTPError with 503 status', async () => {
      const response = new Response(
        JSON.stringify({ message: 'Service unavailable' }),
        { status: 503 },
      )
      const httpError = createHTTPError(response)
      const result = await parseErrorResponse(httpError)

      expect(result).toBeInstanceOf(ServerError)
    })

    it('should parse HTTPError with 504 status', async () => {
      const response = new Response(
        JSON.stringify({ message: 'Gateway timeout' }),
        { status: 504 },
      )
      const httpError = createHTTPError(response)
      const result = await parseErrorResponse(httpError)

      expect(result).toBeInstanceOf(ServerError)
    })

    it('should parse HTTPError with 418 status', async () => {
      const response = new Response(
        JSON.stringify({ message: 'Unknown error' }),
        { status: 418 },
      )
      const httpError = createHTTPError(response)
      const result = await parseErrorResponse(httpError)

      expect(result).toBeInstanceOf(SDKError)
      expect(result.message).toBe('Unknown error')
      expect(result.statusCode).toBe(418)
    })

    it('should parse HTTPError with non-JSON response', async () => {
      const response = new Response('Plain text error', {
        status: 400,
        statusText: 'Bad Request',
      })
      const httpError = createHTTPError(response)
      const result = await parseErrorResponse(httpError)

      expect(result).toBeInstanceOf(SDKError)
      expect(result.message).toBe('Bad Request')
      expect(result.statusCode).toBe(400)
    })
  })
})
