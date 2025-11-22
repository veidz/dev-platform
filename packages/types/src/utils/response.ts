import type {
  ApiResponse,
  ErrorResponse,
  SuccessResponse,
} from '../types/utils.types'

const success = <T>(data: T, message?: string): SuccessResponse<T> => {
  return {
    success: true,
    data,
    timestamp: new Date(),
    ...(message && { message }),
  }
}

const error = (
  code: string,
  message: string,
  details?: unknown,
): ApiResponse<never> => {
  return {
    success: false,
    error: {
      code,
      message,
      details,
    },
    timestamp: new Date(),
  }
}

const createErrorResponse = (
  code: string,
  message: string,
  details?: unknown,
): ErrorResponse => {
  return {
    code,
    message,
    details,
  }
}

const isSuccessResponse = <T>(
  response: ApiResponse<T>,
): response is SuccessResponse<T> => {
  return response.success === true && 'data' in response
}

const isErrorResponse = <T>(
  response: ApiResponse<T>,
): response is ApiResponse<never> => {
  return response.success === false && 'error' in response
}

export {
  createErrorResponse,
  error,
  isErrorResponse,
  isSuccessResponse,
  success,
}
