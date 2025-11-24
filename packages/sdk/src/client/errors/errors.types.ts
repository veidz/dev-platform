interface ErrorResponse {
  message?: string
  error?: string
  errors?: Record<string, string[]>
  statusCode?: number
}

export { type ErrorResponse }
