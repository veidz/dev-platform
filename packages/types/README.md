# @dev-platform/types

Tipos TypeScript compartilhados e schemas de validação Zod para a plataforma Dev Platform.

## 📦 Instalação

```bash
pnpm add @dev-platform/types
```

## 🎯 Funcionalidades

- **Tipos TypeScript**: Interfaces e tipos para todas as entidades do domínio
- **Schemas Zod**: Validação runtime type-safe
- **Constantes**: HTTP status, métodos, códigos de erro
- **Utils**: Helpers para validação e formatação de respostas
- **Type Guards**: Funções para validação de tipos em runtime

## 📚 Exports

### Types

- **Auth**: `User`, `LoginCredentials`, `AuthTokens`, `RegisterDto`, `JwtPayload`
- **Workspace**: `Workspace`, `WorkspaceMember`, `Role`, `Permissions`
- **API**: `API`, `Endpoint`, `HttpMethod`, `ApiStatus`, `Schema`
- **Mock**: `Mock`, `MockScenario`, `MockDelayType`, `MockResponse`
- **Analytics**: `RequestLog`, `Metric`, `Alert`, `AlertRule`, `TimeSeriesData`
- **Utils**: `Pagination<T>`, `ApiResponse<T>`, `ErrorResponse`, `DeepPartial<T>`

### Schemas (Zod)

- **Auth**: `loginSchema`, `registerSchema`, `forgotPasswordSchema`, `resetPasswordSchema`
- **Workspace**: `createWorkspaceSchema`, `inviteMemberSchema`, `updateMemberRoleSchema`
- **API**: `createApiSchema`, `createEndpointSchema`, `importOpenApiSchema`
- **Mock**: `createMockSchema`, `updateMockSchema`, `createScenarioSchema`
- **Analytics**: `createAlertRuleSchema`, `logFiltersSchema`

### Constants

- `HTTP_STATUS`: Códigos HTTP (200, 404, 500, etc)
- `HTTP_METHODS`: Métodos HTTP (GET, POST, etc)
- `CONTENT_TYPES`: Content-Types comuns
- `HEADERS`: Headers HTTP padrão
- `TOKEN_EXPIRY`: Tempos de expiração de tokens
- `PASSWORD_REQUIREMENTS`: Requisitos de senha
- `ErrorCode`: Enum com códigos de erro
- `ERROR_MESSAGES`: Mensagens de erro traduzidas

### Utils

- `validate<T>(schema, data)`: Valida dados com Zod schema
- `validateOrThrow<T>(schema, data)`: Valida ou lança exception
- `success<T>(data, message?)`: Cria resposta de sucesso
- `error(code, message, details?)`: Cria resposta de erro
- `isSuccessResponse<T>(response)`: Type guard para sucesso
- `isErrorResponse<T>(response)`: Type guard para erro

### Guards

- `isApiError(value)`: Verifica se é erro de API
- `isAuthError(value)`: Verifica se é erro de auth
- `isValidationError(value)`: Verifica se é erro de validação
- `hasProperty<K>(obj, key)`: Verifica propriedade
- `isNonNull<T>(value)`: Verifica não-null/undefined

## 🚀 Exemplos de Uso

### Validação com Zod

```typescript
import { loginSchema, type LoginInput } from '@dev-platform/types'

// Validação básica
const result = loginSchema.safeParse({
  email: 'user@example.com',
  password: 'password123',
})

if (result.success) {
  const data: LoginInput = result.data
  console.log('Valid:', data)
} else {
  console.error('Errors:', result.error.issues)
}

// Validação com helper
import { validate } from '@dev-platform/types'

const validationResult = validate(loginSchema, formData)
if (!validationResult.success) {
  console.error(validationResult.errors)
}

// Validação ou throw
import { validateOrThrow } from '@dev-platform/types'

try {
  const data = validateOrThrow(loginSchema, formData)
  // data é type-safe aqui
} catch (error) {
  if (error instanceof ValidationException) {
    console.error(error.errors)
  }
}
```

### Formatação de Respostas

```typescript
import { success, error, ErrorCode } from '@dev-platform/types'

// Resposta de sucesso
const response = success({ id: '123', name: 'User' })
// { success: true, data: {...}, timestamp: Date }

// Resposta de erro
const errorResponse = error(ErrorCode.NOT_FOUND, 'Usuário não encontrado', {
  userId: '123',
})
// { success: false, error: { code, message, details }, timestamp: Date }
```

### Type Guards

```typescript
import { isApiError, isAuthError, hasProperty } from '@dev-platform/types'

// Verificar erro de API
if (isApiError(response.error)) {
  console.log(response.error.code)
  console.log(response.error.message)
}

// Verificar erro de autenticação
if (isAuthError(error)) {
  // Redirecionar para login
  redirectToLogin()
}

// Verificar propriedade
const obj: unknown = { name: 'John' }
if (hasProperty(obj, 'name')) {
  // TypeScript sabe que obj.name existe
  console.log(obj.name)
}
```

### Uso de Tipos

```typescript
import type { User, Workspace, Role } from '@dev-platform/types'

// Tipo User
const user: User = {
  id: '123',
  email: 'user@example.com',
  name: 'John Doe',
  emailVerified: true,
  createdAt: new Date(),
  updatedAt: new Date(),
}

// Role enum
const memberRole: Role = Role.DEVELOPER

// Workspace
const workspace: Workspace = {
  id: '456',
  name: 'My Workspace',
  slug: 'my-workspace',
  ownerId: user.id,
  createdAt: new Date(),
  updatedAt: new Date(),
}
```

### Paginação

```typescript
import type { Pagination, ApiResponse } from '@dev-platform/types'

// Resposta paginada
const paginatedResponse: Pagination<User> = {
  data: [user1, user2],
  total: 100,
  page: 1,
  pageSize: 10,
  totalPages: 10,
}

// Resposta de API genérica
const apiResponse: ApiResponse<User[]> = {
  success: true,
  data: [user1, user2],
  timestamp: new Date(),
}
```

### Constantes HTTP

```typescript
import {
  HTTP_STATUS,
  HTTP_METHODS,
  CONTENT_TYPES,
  HEADERS,
} from '@dev-platform/types'

// Status codes
if (response.status === HTTP_STATUS.NOT_FOUND) {
  console.error('Not found')
}

// Headers
const headers = {
  [HEADERS.CONTENT_TYPE]: CONTENT_TYPES.JSON,
  [HEADERS.AUTHORIZATION]: `Bearer ${token}`,
}
```

### Validação de Senha

```typescript
import { registerSchema, PASSWORD_REQUIREMENTS } from '@dev-platform/types'

// Validar registro com senha forte
const result = registerSchema.safeParse({
  email: 'user@example.com',
  password: 'StrongPass123', // Min 8 chars, 1 uppercase, 1 lowercase, 1 number
  name: 'John Doe',
})

// Requisitos de senha
console.log(PASSWORD_REQUIREMENTS.MIN_LENGTH) // 8
console.log(PASSWORD_REQUIREMENTS.REQUIRE_UPPERCASE) // true
```

## 🧪 Testes

```bash
# Rodar todos os testes
pnpm test

# Com coverage
pnpm jest --coverage

# Watch mode
pnpm jest --watch
```

**Coverage Atual**: 98.93% statements, 96.55% branches, 100% functions, 100% lines

## 🏗️ Build

```bash
# Build production
pnpm build

# Build com watch
pnpm dev

# Type checking
pnpm typecheck
```

## 📖 Schema Examples

### Login Schema

```typescript
import { loginSchema } from '@dev-platform/types'

// Valid
loginSchema.parse({
  email: 'user@example.com',
  password: 'anypassword',
})

// Invalid - email
loginSchema.parse({
  email: 'invalid-email',
  password: 'password',
}) // Throws ZodError

// Invalid - empty password
loginSchema.parse({
  email: 'user@example.com',
  password: '',
}) // Throws ZodError
```

### Register Schema

```typescript
import { registerSchema } from '@dev-platform/types'

// Valid
registerSchema.parse({
  email: 'user@example.com',
  password: 'StrongPass123',
  name: 'John Doe',
})

// Invalid - weak password
registerSchema.parse({
  email: 'user@example.com',
  password: 'weak',
  name: 'John',
}) // Throws ZodError: password must have uppercase, lowercase, number
```

### Create API Schema

```typescript
import { createApiSchema } from '@dev-platform/types'

// Valid
createApiSchema.parse({
  workspaceId: '123e4567-e89b-12d3-a456-426614174000',
  name: 'My API',
  baseUrl: 'https://api.example.com',
  version: '1.0.0',
  description: 'Optional description',
})

// Invalid - version format
createApiSchema.parse({
  workspaceId: '...',
  name: 'My API',
  baseUrl: 'https://api.example.com',
  version: 'v1', // Must be x.y.z format
}) // Throws ZodError
```

## 🔧 Error Handling

```typescript
import {
  ErrorCode,
  ERROR_MESSAGES,
  HTTP_ERROR_TEMPLATES,
} from '@dev-platform/types'

// Error code enum
const code = ErrorCode.UNAUTHORIZED

// Mensagem traduzida
const message = ERROR_MESSAGES[code] // "Não autorizado"

// Template de erro HTTP
const template = HTTP_ERROR_TEMPLATES[401]
// { code: 'UNAUTHORIZED', message: 'Não autorizado' }
```

## 📝 Type Inference

```typescript
import { loginSchema, type LoginInput } from '@dev-platform/types'

// Inferir tipo do schema
type Login = LoginInput
// Equivalente a:
// type Login = {
//   email: string
//   password: string
// }

// Usar com z.infer
import { z } from 'zod'
type InferredLogin = z.infer<typeof loginSchema>
```

## 🎨 Utility Types

```typescript
import type { DeepPartial, Nullable, AsyncResult } from '@dev-platform/types'

// DeepPartial - todos os campos opcionais recursivamente
type PartialUser = DeepPartial<User>

// Nullable - tipo ou null
type NullableUser = Nullable<User>

// AsyncResult - Either monad para async
type UserResult = AsyncResult<User, Error>
const result: UserResult = { success: true, data: user }
// ou
const error: UserResult = { success: false, error: new Error('Not found') }
```
