import { describe, expect, it } from '@jest/globals'
import { HTTPError, NormalizedOptions, TimeoutError } from 'ky'

import { faker } from '@/__mocks__/faker-adapter'
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
    new Request(faker.internet.url()),
    {} as NormalizedOptions,
  )
}

describe('errors', () => {
  describe('SDKError', () => {
    it('should create base SDKError with message and status code', () => {
      const message = faker.lorem.sentence()
      const statusCode = faker.internet.httpStatusCode({
        types: ['clientError'],
      })
      const error = new SDKError(message, statusCode)

      expect(error).toBeInstanceOf(Error)
      expect(error).toBeInstanceOf(SDKError)
      expect(error.message).toBe(message)
      expect(error.statusCode).toBe(statusCode)
      expect(error.name).toBe('SDKError')
    })

    it('should create SDKError without status code', () => {
      const message = faker.lorem.sentence()
      const error = new SDKError(message)

      expect(error.statusCode).toBeUndefined()
      expect(error.originalError).toBeUndefined()
    })

    it('should store original error', () => {
      const originalError = new Error(faker.lorem.sentence())
      const message = faker.lorem.sentence()
      const statusCode = faker.internet.httpStatusCode({
        types: ['serverError'],
      })
      const error = new SDKError(message, statusCode, originalError)

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
      const message = faker.lorem.sentence()
      const error = new AuthenticationError(message)

      expect(error.message).toBe(message)
      expect(error.statusCode).toBe(401)
    })

    it('should store original error', () => {
      const originalError = new Error(faker.lorem.sentence())
      const message = faker.lorem.sentence()
      const error = new AuthenticationError(message, originalError)

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
      const message = faker.lorem.sentence()
      const error = new AuthorizationError(message)

      expect(error.message).toBe(message)
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
      const message = faker.lorem.sentence()
      const error = new NotFoundError(message)

      expect(error.message).toBe(message)
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
      const message = faker.lorem.sentence()
      const errors = {
        [faker.lorem.word()]: [faker.lorem.sentence()],
        [faker.lorem.word()]: [faker.lorem.sentence()],
      }
      const error = new ValidationError(message, errors)

      expect(error.message).toBe(message)
      expect(error.errors).toEqual(errors)
    })

    it('should create ValidationError without errors object', () => {
      const message = faker.lorem.sentence()
      const error = new ValidationError(message)

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
      const message = faker.lorem.sentence()
      const retryAfter = faker.number.int({ min: 1, max: 3600 })
      const error = new RateLimitError(message, retryAfter)

      expect(error.message).toBe(message)
      expect(error.retryAfter).toBe(retryAfter)
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
      const message = faker.lorem.sentence()
      const error = new ServerError(message)

      expect(error.message).toBe(message)
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
      const message = faker.lorem.sentence()
      const error = new NetworkError(message)

      expect(error.message).toBe(message)
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
      const message = faker.lorem.sentence()
      const error = new RequestTimeoutError(message)

      expect(error.message).toBe(message)
    })
  })

  describe('parseErrorResponse', () => {
    it('should parse TimeoutError', async () => {
      const timeoutError = new TimeoutError(new Request(faker.internet.url()))
      const result = await parseErrorResponse(timeoutError)

      expect(result).toBeInstanceOf(RequestTimeoutError)
      expect(result.message).toBe('Request timed out')
      expect(result.originalError).toBe(timeoutError)
    })

    it('should parse HTTPError with 401 status', async () => {
      const message = faker.lorem.sentence()
      const response = new Response(JSON.stringify({ message }), {
        status: 401,
      })
      const httpError = createHTTPError(response)
      const result = await parseErrorResponse(httpError)

      expect(result).toBeInstanceOf(AuthenticationError)
      expect(result.message).toBe(message)
    })

    it('should parse HTTPError with 403 status', async () => {
      const errorMessage = faker.lorem.sentence()
      const response = new Response(JSON.stringify({ error: errorMessage }), {
        status: 403,
      })
      const httpError = createHTTPError(response)
      const result = await parseErrorResponse(httpError)

      expect(result).toBeInstanceOf(AuthorizationError)
      expect(result.message).toBe(errorMessage)
    })

    it('should parse HTTPError with 404 status', async () => {
      const message = faker.lorem.sentence()
      const response = new Response(JSON.stringify({ message }), {
        status: 404,
      })
      const httpError = createHTTPError(response)
      const result = await parseErrorResponse(httpError)

      expect(result).toBeInstanceOf(NotFoundError)
      expect(result.message).toBe(message)
    })

    it('should parse HTTPError with 422 status and validation errors', async () => {
      const message = faker.lorem.sentence()
      const field = faker.lorem.word()
      const errorMsg = faker.lorem.sentence()
      const errors = { [field]: [errorMsg] }
      const response = new Response(
        JSON.stringify({
          message,
          errors,
        }),
        { status: 422 },
      )
      const httpError = createHTTPError(response)
      const result = await parseErrorResponse(httpError)

      expect(result).toBeInstanceOf(ValidationError)
      expect(result.message).toBe(message)
      expect((result as ValidationError).errors).toEqual(errors)
    })

    it('should parse HTTPError with 429 status and Retry-After header', async () => {
      const message = faker.lorem.sentence()
      const retryAfter = faker.number.int({ min: 1, max: 3600 })
      const response = new Response(JSON.stringify({ message }), {
        status: 429,
        headers: { 'Retry-After': retryAfter.toString() },
      })
      const httpError = createHTTPError(response)
      const result = await parseErrorResponse(httpError)

      expect(result).toBeInstanceOf(RateLimitError)
      expect(result.message).toBe(message)
      expect((result as RateLimitError).retryAfter).toBe(retryAfter)
    })

    it('should parse HTTPError with 429 status without Retry-After header', async () => {
      const message = faker.lorem.sentence()
      const response = new Response(JSON.stringify({ message }), {
        status: 429,
      })
      const httpError = createHTTPError(response)
      const result = await parseErrorResponse(httpError)

      expect(result).toBeInstanceOf(RateLimitError)
      expect((result as RateLimitError).retryAfter).toBeUndefined()
    })

    it('should parse HTTPError with 500 status', async () => {
      const message = faker.lorem.sentence()
      const response = new Response(JSON.stringify({ message }), {
        status: 500,
      })
      const httpError = createHTTPError(response)
      const result = await parseErrorResponse(httpError)

      expect(result).toBeInstanceOf(ServerError)
      expect(result.message).toBe(message)
    })

    it('should parse HTTPError with 502 status', async () => {
      const message = faker.lorem.sentence()
      const response = new Response(JSON.stringify({ message }), {
        status: 502,
      })
      const httpError = createHTTPError(response)
      const result = await parseErrorResponse(httpError)

      expect(result).toBeInstanceOf(ServerError)
    })

    it('should parse HTTPError with 503 status', async () => {
      const message = faker.lorem.sentence()
      const response = new Response(JSON.stringify({ message }), {
        status: 503,
      })
      const httpError = createHTTPError(response)
      const result = await parseErrorResponse(httpError)

      expect(result).toBeInstanceOf(ServerError)
    })

    it('should parse HTTPError with 504 status', async () => {
      const message = faker.lorem.sentence()
      const response = new Response(JSON.stringify({ message }), {
        status: 504,
      })
      const httpError = createHTTPError(response)
      const result = await parseErrorResponse(httpError)

      expect(result).toBeInstanceOf(ServerError)
    })

    it('should parse HTTPError with 418 status', async () => {
      const message = faker.lorem.sentence()
      const statusCode = 418
      const response = new Response(JSON.stringify({ message }), {
        status: statusCode,
      })
      const httpError = createHTTPError(response)
      const result = await parseErrorResponse(httpError)

      expect(result).toBeInstanceOf(SDKError)
      expect(result.message).toBe(message)
      expect(result.statusCode).toBe(statusCode)
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

    it('should parse generic Error', async () => {
      const message = faker.lorem.sentence()
      const genericError = new Error(message)
      const result = await parseErrorResponse(genericError)

      expect(result).toBeInstanceOf(NetworkError)
      expect(result.message).toBe(message)
      expect(result.originalError).toBe(genericError)
    })

    it('should parse unknown error type', async () => {
      const unknownError = { some: 'object' }
      const result = await parseErrorResponse(unknownError)

      expect(result).toBeInstanceOf(SDKError)
      expect(result.message).toBe('An unknown error occurred')
      expect(result.originalError).toBe(unknownError)
    })

    it('should fallback to HTTPError message when no error data', async () => {
      const response = new Response(null, {
        status: 400,
        statusText: 'Bad Request',
      })
      const httpError = createHTTPError(response)
      const result = await parseErrorResponse(httpError)

      expect(result.message).toBe('Bad Request')
    })

    it('should fallback to "Unknown error" when no message available', async () => {
      const response = new Response(JSON.stringify({}), { status: 400 })
      const httpError = createHTTPError(response)
      Object.defineProperty(httpError, 'message', { value: '' })
      const result = await parseErrorResponse(httpError)

      expect(result.message).toBe('Unknown error')
    })
  })
})
