# SDK Client - TypeScript

## Contexto

Criar SDK TypeScript type-safe para consumir APIs da plataforma.

## Dependências

- Phase 0 completo
- 01-design-system.md completo
- 02-types-validation.md completo

## Checkboxes

### Pesquisa

- [ ] Docs Axios (https://axios-http.com)
- [ ] Docs ky (https://github.com/sindresorhus/ky)
- [ ] Best practices SDK design
- [ ] Verificar versões no npm

### Criar Package

- [ ] Criar `packages/sdk/`
- [ ] Executar `pnpm init`
- [ ] Configurar name: `@dev-platform/sdk`

### TypeScript Config

- [ ] Criar `tsconfig.json` estendendo base
- [ ] Configurar `composite: true`
- [ ] Adicionar reference para `@dev-platform/shared`

### Instalar Dependencies

- [ ] `pnpm add ky@latest`
- [ ] `pnpm add @dev-platform/shared@workspace:*`
- [ ] `pnpm add -D @types/node@latest`

### Client Base

- [ ] Criar `src/client/base-client.ts`
- [ ] Configurar ky instance
- [ ] Headers default (Content-Type, Accept)
- [ ] Timeout, retry logic

### Auth Interceptor

- [ ] Criar `src/client/auth.interceptor.ts`
- [ ] Injetar access token no header
- [ ] Refresh token automático (401)
- [ ] Retry request após refresh

### Error Handling

- [ ] Criar `src/client/error-handler.ts`
- [ ] Parse error responses
- [ ] Custom error classes
- [ ] Network error handling

### Auth Module

- [ ] Criar `src/modules/auth.module.ts`
- [ ] `login(credentials)` method
- [ ] `register(data)` method
- [ ] `logout()` method
- [ ] `refreshToken()` method
- [ ] `forgotPassword(email)` method

### Workspace Module

- [ ] Criar `src/modules/workspace.module.ts`
- [ ] `list()` method
- [ ] `get(id)` method
- [ ] `create(data)` method
- [ ] `update(id, data)` method
- [ ] `delete(id)` method
- [ ] `inviteMember(id, email, role)` method

### API Module

- [ ] Criar `src/modules/api.module.ts`
- [ ] `list(workspaceId)` method
- [ ] `get(id)` method
- [ ] `create(data)` method
- [ ] `update(id, data)` method
- [ ] `delete(id)` method
- [ ] `import(openApiSpec)` method

### Endpoint Module

- [ ] Criar `src/modules/endpoint.module.ts`
- [ ] `list(apiId)` method
- [ ] `get(id)` method
- [ ] `create(apiId, data)` method
- [ ] `update(id, data)` method
- [ ] `delete(id)` method
- [ ] `test(id, payload)` method

### Mock Module

- [ ] Criar `src/modules/mock.module.ts`
- [ ] `list(endpointId)` method
- [ ] `create(data)` method
- [ ] `update(id, data)` method
- [ ] `delete(id)` method

### Analytics Module

- [ ] Criar `src/modules/analytics.module.ts`
- [ ] `getMetrics(filters)` method
- [ ] `getLogs(filters)` method
- [ ] `getTopEndpoints(apiId)` method

### Main SDK Class

- [ ] Criar `src/sdk.ts`
- [ ] Constructor aceita config (baseUrl, apiKey)
- [ ] Instanciar todos modules
- [ ] Export getters: `sdk.auth`, `sdk.workspace`, etc

### Config Types

- [ ] Criar `src/types/config.types.ts`
- [ ] SDKConfig, SDKOptions
- [ ] RetryConfig, TimeoutConfig

### Token Storage

- [ ] Criar `src/storage/token-storage.ts`
- [ ] Interface abstrata
- [ ] LocalStorage implementation
- [ ] Memory implementation (SSR safe)

### Utils

- [ ] Criar `src/utils/query-builder.ts`
- [ ] Helper para construir query params
- [ ] Pagination, filters, sorting

### Exports

- [ ] Criar `src/index.ts`
- [ ] Export SDK class default
- [ ] Export tipos importantes
- [ ] Export error classes

### Build Config

- [ ] Instalar `tsup@latest`
- [ ] Criar `tsup.config.ts`
- [ ] Format: esm + cjs
- [ ] dts: true

### Scripts

- [ ] `"build": "tsup"`
- [ ] `"dev": "tsup --watch"`
- [ ] `"typecheck": "tsc --noEmit"`

### Testes - Auth Module

- [ ] Criar `tests/unit/sdk/auth.module.test.ts`
- [ ] Mock ky requests
- [ ] Testar login, register, logout
- [ ] Testar refresh automático

### Testes - API Module

- [ ] Criar `tests/unit/sdk/api.module.test.ts`
- [ ] Testar CRUD operations
- [ ] Testar error handling
- [ ] 100% coverage

### Testes - Error Handler

- [ ] Criar `tests/unit/sdk/error-handler.test.ts`
- [ ] Testar network errors
- [ ] Testar HTTP errors
- [ ] Testar error parsing

### Documentação

- [ ] Criar `README.md` completo
- [ ] Quick start example
- [ ] API reference
- [ ] Error handling guide

### Validação

- [ ] `pnpm build` (sem erros)
- [ ] `pnpm typecheck` (zero erros)
- [ ] `pnpm test` (100% coverage)
- [ ] Testar import em app real

## Arquivos Criados

```
packages/sdk/
├── src/
│   ├── client/
│   │   ├── base-client.ts
│   │   ├── auth.interceptor.ts
│   │   └── error-handler.ts
│   ├── modules/
│   │   ├── auth.module.ts
│   │   ├── workspace.module.ts
│   │   ├── api.module.ts
│   │   ├── endpoint.module.ts
│   │   ├── mock.module.ts
│   │   └── analytics.module.ts
│   ├── storage/
│   │   └── token-storage.ts
│   ├── types/
│   │   └── config.types.ts
│   ├── utils/
│   │   └── query-builder.ts
│   ├── sdk.ts
│   └── index.ts
├── tests/unit/sdk/
├── tsup.config.ts
├── package.json
└── README.md
```

## Exemplo: sdk.ts

```typescript
import { AuthModule } from './modules/auth.module'
import { WorkspaceModule } from './modules/workspace.module'
import { ApiModule } from './modules/api.module'
import type { SDKConfig } from './types/config.types'

export class DevPlatformSDK {
  public readonly auth: AuthModule
  public readonly workspace: WorkspaceModule
  public readonly api: ApiModule

  constructor(config: SDKConfig) {
    const baseClient = createBaseClient(config)

    this.auth = new AuthModule(baseClient)
    this.workspace = new WorkspaceModule(baseClient)
    this.api = new ApiModule(baseClient)
  }
}

export default DevPlatformSDK
```

## Exemplo: auth.module.ts

```typescript
import type { LoginCredentials, AuthTokens } from '@dev-platform/shared'
import type { BaseClient } from '../client/base-client'

export class AuthModule {
  constructor(private client: BaseClient) {}

  async login(credentials: LoginCredentials): Promise<AuthTokens> {
    const response = await this.client.post('auth/login', {
      json: credentials,
    })
    return response.json()
  }

  async logout(): Promise<void> {
    await this.client.post('auth/logout')
  }

  async refreshToken(): Promise<AuthTokens> {
    const response = await this.client.post('auth/refresh')
    return response.json()
  }
}
```

## Exemplo: Usage

```typescript
import DevPlatformSDK from '@dev-platform/sdk'

const sdk = new DevPlatformSDK({
  baseUrl: 'https://api.dev-platform.com',
  apiKey: 'your-api-key',
})

// Login
const tokens = await sdk.auth.login({
  email: 'user@example.com',
  password: 'secure123',
})

// List workspaces
const workspaces = await sdk.workspace.list()

// Create API
const api = await sdk.api.create({
  name: 'My API',
  baseUrl: 'https://api.myapp.com',
})
```

## Recursos

- [ky Documentation](https://github.com/sindresorhus/ky)
- [SDK Design Best Practices](https://www.npmjs.com/package/sdk-generator)
- [TypeScript SDK Patterns](https://github.com/microsoft/TypeScript/wiki/Performance)

## Próximo Passo

✅ **Phase 1 completo!**

→ [Phase 2: Frontend Web](../02-web/01-setup.md)
