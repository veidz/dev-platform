import { describe, expect, it } from '@jest/globals'
import { HTTPError, NormalizedOptions } from 'ky'

import { SDKError } from '@/client/errors'

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
  })
})
