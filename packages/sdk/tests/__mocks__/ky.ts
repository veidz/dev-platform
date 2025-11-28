import { jest } from '@jest/globals'

class HTTPError extends Error {
  response: Response
  request: Request
  options: any

  constructor(response: Response, request: Request, options: any = {}) {
    super(response.statusText || `HTTP Error ${response.status}`)
    this.name = 'HTTPError'
    this.response = response
    this.request = request
    this.options = options
  }
}

class TimeoutError extends Error {
  request: Request

  constructor(request: Request) {
    super('Request timed out')
    this.name = 'TimeoutError'
    this.request = request
  }
}

const createMockKyInstance = () => ({
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  patch: jest.fn(),
  delete: jest.fn(),
  extend: jest.fn(function (this: any) {
    return this
  }),
})

const ky: any = Object.assign(jest.fn(), {
  create: jest.fn(() => createMockKyInstance()),
  ...createMockKyInstance(),
})

export default ky
export { HTTPError, ky, TimeoutError }
