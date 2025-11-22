export enum ErrorCode {
  INVALID_CREDENTIALS = 'INVALID_CREDENTIALS',
  UNAUTHORIZED = 'UNAUTHORIZED',
  TOKEN_EXPIRED = 'TOKEN_EXPIRED',
  TOKEN_INVALID = 'TOKEN_INVALID',
  EMAIL_ALREADY_EXISTS = 'EMAIL_ALREADY_EXISTS',
  EMAIL_NOT_VERIFIED = 'EMAIL_NOT_VERIFIED',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  INVALID_INPUT = 'INVALID_INPUT',
  NOT_FOUND = 'NOT_FOUND',
  ALREADY_EXISTS = 'ALREADY_EXISTS',
  CONFLICT = 'CONFLICT',
  FORBIDDEN = 'FORBIDDEN',
  INSUFFICIENT_PERMISSIONS = 'INSUFFICIENT_PERMISSIONS',
  TOO_MANY_REQUESTS = 'TOO_MANY_REQUESTS',
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
  INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR',
  SERVICE_UNAVAILABLE = 'SERVICE_UNAVAILABLE',
  DATABASE_ERROR = 'DATABASE_ERROR',
  EXTERNAL_SERVICE_ERROR = 'EXTERNAL_SERVICE_ERROR',
  TIMEOUT = 'TIMEOUT',
}

export const ERROR_MESSAGES: Record<ErrorCode, string> = {
  [ErrorCode.INVALID_CREDENTIALS]: 'Email ou senha inválidos',
  [ErrorCode.UNAUTHORIZED]: 'Não autorizado',
  [ErrorCode.TOKEN_EXPIRED]: 'Token expirado',
  [ErrorCode.TOKEN_INVALID]: 'Token inválido',
  [ErrorCode.EMAIL_ALREADY_EXISTS]: 'Email já cadastrado',
  [ErrorCode.EMAIL_NOT_VERIFIED]: 'Email não verificado',
  [ErrorCode.VALIDATION_ERROR]: 'Erro de validação',
  [ErrorCode.INVALID_INPUT]: 'Dados inválidos',
  [ErrorCode.NOT_FOUND]: 'Recurso não encontrado',
  [ErrorCode.ALREADY_EXISTS]: 'Recurso já existe',
  [ErrorCode.CONFLICT]: 'Conflito de dados',
  [ErrorCode.FORBIDDEN]: 'Acesso negado',
  [ErrorCode.INSUFFICIENT_PERMISSIONS]: 'Permissões insuficientes',
  [ErrorCode.TOO_MANY_REQUESTS]: 'Muitas requisições',
  [ErrorCode.RATE_LIMIT_EXCEEDED]: 'Limite de requisições excedido',
  [ErrorCode.INTERNAL_SERVER_ERROR]: 'Erro interno do servidor',
  [ErrorCode.SERVICE_UNAVAILABLE]: 'Serviço indisponível',
  [ErrorCode.DATABASE_ERROR]: 'Erro no banco de dados',
  [ErrorCode.EXTERNAL_SERVICE_ERROR]: 'Erro no serviço externo',
  [ErrorCode.TIMEOUT]: 'Tempo de resposta excedido',
}

export interface HttpError {
  statusCode: number
  code: ErrorCode
  message: string
  details?: unknown
}

export const HTTP_ERROR_TEMPLATES: Record<
  number,
  { code: ErrorCode; message: string }
> = {
  400: { code: ErrorCode.INVALID_INPUT, message: 'Requisição inválida' },
  401: { code: ErrorCode.UNAUTHORIZED, message: 'Não autorizado' },
  403: { code: ErrorCode.FORBIDDEN, message: 'Acesso negado' },
  404: { code: ErrorCode.NOT_FOUND, message: 'Não encontrado' },
  409: { code: ErrorCode.CONFLICT, message: 'Conflito' },
  422: { code: ErrorCode.VALIDATION_ERROR, message: 'Erro de validação' },
  429: {
    code: ErrorCode.TOO_MANY_REQUESTS,
    message: 'Muitas requisições',
  },
  500: {
    code: ErrorCode.INTERNAL_SERVER_ERROR,
    message: 'Erro interno',
  },
  503: {
    code: ErrorCode.SERVICE_UNAVAILABLE,
    message: 'Serviço indisponível',
  },
}
