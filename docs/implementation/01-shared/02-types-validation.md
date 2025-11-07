# Shared Types e Validation - Zod

## Contexto

Criar pacote de tipos TypeScript compartilhados e schemas Zod para validação runtime.

## Dependências

- Phase 0 completo

## Checkboxes

### Pesquisa

- [ ] Docs Zod (https://zod.dev)
- [ ] TypeScript utility types
- [ ] Verificar versão Zod no npm

### Criar Package

- [ ] Criar `packages/shared/`
- [ ] Executar `pnpm init`
- [ ] Configurar name: `@dev-platform/shared`

### TypeScript Config

- [ ] Criar `tsconfig.json` estendendo base
- [ ] Configurar `composite: true`
- [ ] Configurar `declaration: true`

### Instalar Dependencies

- [ ] `pnpm add zod@latest`
- [ ] `pnpm add -D @types/node@latest`

### Domain Types - Auth

- [ ] Criar `src/types/auth.types.ts`
- [ ] User, LoginCredentials, AuthTokens
- [ ] RegisterDto, ForgotPasswordDto
- [ ] JwtPayload

### Domain Types - Workspace

- [ ] Criar `src/types/workspace.types.ts`
- [ ] Workspace, WorkspaceMember
- [ ] Role enum (Owner, Admin, Dev, Viewer)
- [ ] Permissions

### Domain Types - API

- [ ] Criar `src/types/api.types.ts`
- [ ] API, Endpoint, Schema
- [ ] HttpMethod enum
- [ ] ApiVersion, ApiStatus

### Domain Types - Mock

- [ ] Criar `src/types/mock.types.ts`
- [ ] Mock, MockScenario
- [ ] MockResponse, MockDelay

### Domain Types - Analytics

- [ ] Criar `src/types/analytics.types.ts`
- [ ] RequestLog, Metric
- [ ] Alert, AlertRule
- [ ] TimeSeriesData

### Zod Schemas - Auth

- [ ] Criar `src/schemas/auth.schemas.ts`
- [ ] loginSchema (email, password validation)
- [ ] registerSchema (password strength)
- [ ] Helpers: isEmail, isStrongPassword

### Zod Schemas - Workspace

- [ ] Criar `src/schemas/workspace.schemas.ts`
- [ ] createWorkspaceSchema
- [ ] inviteMemberSchema
- [ ] updateRoleSchema

### Zod Schemas - API

- [ ] Criar `src/schemas/api.schemas.ts`
- [ ] createApiSchema
- [ ] createEndpointSchema
- [ ] OpenAPI schema validator

### Zod Schemas - Mock

- [ ] Criar `src/schemas/mock.schemas.ts`
- [ ] createMockSchema
- [ ] mockResponseSchema

### Validation Utils

- [ ] Criar `src/utils/validation.ts`
- [ ] `validate<T>(schema, data)` helper
- [ ] Error formatter (Zod → user-friendly)
- [ ] Type guards

### Constants

- [ ] Criar `src/constants/http.ts`
- [ ] Status codes, methods
- [ ] Headers constants
- [ ] Content types

### Constants - Auth

- [ ] Criar `src/constants/auth.ts`
- [ ] Token expiry times
- [ ] Password requirements
- [ ] OAuth providers

### Constants - Errors

- [ ] Criar `src/constants/errors.ts`
- [ ] Error codes enum
- [ ] Error messages map
- [ ] HTTP error templates

### Utility Types

- [ ] Criar `src/types/utils.types.ts`
- [ ] Pagination<T>, ApiResponse<T>
- [ ] ErrorResponse, SuccessResponse
- [ ] DeepPartial<T>, Nullable<T>

### Response Formatters

- [ ] Criar `src/utils/response.ts`
- [ ] `success<T>(data, message?)` helper
- [ ] `error(code, message, details?)` helper
- [ ] Type-safe wrappers

### Type Guards

- [ ] Criar `src/guards/type-guards.ts`
- [ ] `isApiError(value)` guard
- [ ] `isAuthError(value)` guard
- [ ] Generic `isOfType<T>` factory

### Exports

- [ ] Criar `src/index.ts`
- [ ] Export all types
- [ ] Export all schemas
- [ ] Export constants, utils

### Package.json Config

- [ ] main: `dist/index.js`
- [ ] module: `dist/index.mjs`
- [ ] types: `dist/index.d.ts`
- [ ] exports configuration

### Build Config

- [ ] Instalar `tsup@latest`
- [ ] Criar `tsup.config.ts`
- [ ] Format: esm + cjs
- [ ] dts: true, splitting: false

### Scripts

- [ ] `"build": "tsup"`
- [ ] `"dev": "tsup --watch"`
- [ ] `"typecheck": "tsc --noEmit"`

### Testes - Schemas

- [ ] Criar `tests/unit/shared/auth.schemas.test.ts`
- [ ] Testar validações (valid/invalid cases)
- [ ] Testar error messages
- [ ] 100% coverage

### Testes - Utils

- [ ] Criar `tests/unit/shared/validation.test.ts`
- [ ] Testar helpers
- [ ] Testar type guards
- [ ] Testar formatters

### Documentação

- [ ] Criar `README.md`
- [ ] Documentar types principais
- [ ] Exemplos de uso schemas
- [ ] Lista todos exports

### Validação

- [ ] `pnpm build` (sem erros)
- [ ] `pnpm typecheck` (zero erros)
- [ ] `pnpm test` (100% coverage)
- [ ] Import em outro package funciona

## Arquivos Criados

```
packages/shared/
├── src/
│   ├── types/
│   │   ├── auth.types.ts
│   │   ├── workspace.types.ts
│   │   ├── api.types.ts
│   │   ├── mock.types.ts
│   │   ├── analytics.types.ts
│   │   └── utils.types.ts
│   ├── schemas/
│   │   ├── auth.schemas.ts
│   │   ├── workspace.schemas.ts
│   │   ├── api.schemas.ts
│   │   └── mock.schemas.ts
│   ├── constants/
│   │   ├── http.ts
│   │   ├── auth.ts
│   │   └── errors.ts
│   ├── utils/
│   │   ├── validation.ts
│   │   └── response.ts
│   ├── guards/
│   │   └── type-guards.ts
│   └── index.ts
├── tests/unit/shared/
├── tsup.config.ts
├── package.json
└── README.md
```

## Exemplo: auth.types.ts

```typescript
export type User = {
  id: string
  email: string
  name: string
  workspaces: string[]
  createdAt: Date
}

export type LoginCredentials = {
  email: string
  password: string
}

export type AuthTokens = {
  accessToken: string
  refreshToken: string
}

export type JwtPayload = {
  sub: string
  email: string
  workspaceId: string
  role: string
  iat: number
  exp: number
}
```

## Exemplo: auth.schemas.ts

```typescript
import { z } from "zod"

export const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(8, "Senha deve ter no mínimo 8 caracteres"),
})

export const registerSchema = z
  .object({
    email: z.string().email("Email inválido"),
    name: z.string().min(2, "Nome muito curto"),
    password: z
      .string()
      .min(12, "Senha deve ter no mínimo 12 caracteres")
      .regex(/[A-Z]/, "Senha deve conter maiúscula")
      .regex(/[a-z]/, "Senha deve conter minúscula")
      .regex(/[0-9]/, "Senha deve conter número"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Senhas não conferem",
    path: ["confirmPassword"],
  })

export type LoginDto = z.infer<typeof loginSchema>
export type RegisterDto = z.infer<typeof registerSchema>
```

## Exemplo: validation.ts

```typescript
import { z } from "zod"

export function validate<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; errors: string[] } {
  const result = schema.safeParse(data)

  if (result.success) {
    return { success: true, data: result.data }
  }

  const errors = result.error.errors.map((err) => {
    return `${err.path.join(".")}: ${err.message}`
  })

  return { success: false, errors }
}
```

## Exemplo: response.ts

```typescript
export type ApiResponse<T> =
  | {
      success: true
      data: T
      message?: string
    }
  | {
      success: false
      error: {
        code: string
        message: string
        details?: unknown
      }
    }

export function success<T>(data: T, message?: string): ApiResponse<T> {
  return { success: true, data, message }
}

export function error(
  code: string,
  message: string,
  details?: unknown
): ApiResponse<never> {
  return { success: false, error: { code, message, details } }
}
```

## Recursos

- [Zod Documentation](https://zod.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [Type Guards](https://www.typescriptlang.org/docs/handbook/2/narrowing.html)

## Próximo Passo

→ [03-sdk-client.md](./03-sdk-client.md)
