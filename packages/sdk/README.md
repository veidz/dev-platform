# @dev-platform/sdk

SDK TypeScript para interagir com a API da Dev Platform.

## Instalação

```bash
pnpm add @dev-platform/sdk
```

## Quick Start

### Importação

```typescript
import { DevPlatformSDK, createSDK } from '@dev-platform/sdk'

// Ou import default
import DevPlatformSDK from '@dev-platform/sdk'
```

### Inicialização

```typescript
const sdk = createSDK({
  baseUrl: 'https://api.dev-platform.com',
  apiKey: 'your-api-key', // Opcional
  timeout: 10000, // Opcional (default: 10s)
  retry: {
    limit: 3, // Opcional (default: 3)
    statusCodes: [408, 429, 500, 502, 503, 504], // Opcional
  },
})
```

### Autenticação

```typescript
// Login
const { user, tokens } = await sdk.auth.login({
  email: 'user@example.com',
  password: 'password123',
})

// Tokens são automaticamente armazenados
console.log('Authenticated:', await sdk.isAuthenticated())

// Register
const { user, tokens } = await sdk.auth.register({
  name: 'John Doe',
  email: 'john@example.com',
  password: 'securePass123',
})

// Logout
await sdk.auth.logout()
await sdk.clearTokens()
```

### Workspaces

```typescript
// Listar workspaces
const { workspaces, total } = await sdk.workspace.list()

// Criar workspace
const workspace = await sdk.workspace.create({
  name: 'My Workspace',
  slug: 'my-workspace',
  description: 'Workspace description',
})

// Obter workspace
const workspace = await sdk.workspace.get('workspace-id')

// Atualizar workspace
const updated = await sdk.workspace.update('workspace-id', {
  name: 'Updated Name',
})

// Convidar membro
const member = await sdk.workspace.inviteMember('workspace-id', {
  email: 'member@example.com',
  role: 'DEVELOPER',
})

// Deletar workspace
await sdk.workspace.delete('workspace-id')
```

### APIs

```typescript
// Listar APIs
const { apis, total } = await sdk.api.list('workspace-id')

// Criar API
const api = await sdk.api.create({
  workspaceId: 'workspace-id',
  name: 'My API',
  description: 'API description',
  baseUrl: 'https://api.example.com',
  version: '1.0.0',
})

// Importar OpenAPI spec
const { api, endpointsCreated } = await sdk.api.importOpenApi({
  workspaceId: 'workspace-id',
  spec: openApiSpec, // string ou objeto
})

// Exportar OpenAPI spec
const spec = await sdk.api.exportOpenApi('api-id')

// Duplicar API
const duplicate = await sdk.api.duplicate('api-id', 'New API Name')
```

### Endpoints

```typescript
// Listar endpoints
const { endpoints, total } = await sdk.endpoint.list('api-id')

// Criar endpoint
const endpoint = await sdk.endpoint.create({
  apiId: 'api-id',
  path: '/users/:id',
  method: 'GET',
  description: 'Get user by ID',
  responseSchema: { type: 'object', properties: {} },
})

// Testar endpoint
const result = await sdk.endpoint.test('endpoint-id', {
  headers: { 'X-Custom': 'value' },
  queryParams: { limit: '10' },
  body: { data: 'test' },
})

console.log('Status:', result.statusCode)
console.log('Response Time:', result.responseTimeMs, 'ms')
```

### Mocks

```typescript
// Criar mock
const mock = await sdk.mock.create({
  endpointId: 'endpoint-id',
  name: 'Success Response',
  statusCode: 200,
  body: { message: 'Success' },
  delayType: 'FIXED',
  delayMs: 100,
})

// Enable/disable mock
await sdk.mock.enable('mock-id')
await sdk.mock.disable('mock-id')

// Criar scenario
const scenario = await sdk.mock.createScenario({
  endpointId: 'endpoint-id',
  name: 'Happy Path',
  mockIds: ['mock-1', 'mock-2'],
})

// Ativar scenario
await sdk.mock.activateScenario('scenario-id')
```

### Analytics

```typescript
// Obter métricas
const { metrics, aggregations } = await sdk.analytics.getMetrics({
  apiId: 'api-id',
  startDate: new Date('2025-01-01'),
  endDate: new Date('2025-01-31'),
  period: 'day',
})

// Obter logs
const { logs, total } = await sdk.analytics.getLogs({
  endpointId: 'endpoint-id',
  startDate: new Date('2025-01-01'),
  endDate: new Date('2025-01-31'),
  statusCode: 200,
  page: 1,
  limit: 50,
})

// Top endpoints
const { endpoints } = await sdk.analytics.getTopEndpoints('api-id')

// Criar alert rule
const rule = await sdk.analytics.createAlertRule({
  workspaceId: 'workspace-id',
  name: 'High Error Rate',
  type: 'ERROR_RATE',
  condition: { threshold: 0.05 },
  severity: 'WARNING',
  webhookUrl: 'https://webhook.example.com',
})
```

## Error Handling

```typescript
import {
  AuthenticationError,
  ValidationError,
  NotFoundError,
  RateLimitError,
} from '@dev-platform/sdk'

try {
  await sdk.auth.login(credentials)
} catch (error) {
  if (error instanceof AuthenticationError) {
    console.error('Authentication failed:', error.message)
  } else if (error instanceof ValidationError) {
    console.error('Validation errors:', error.errors)
  } else if (error instanceof NotFoundError) {
    console.error('Resource not found')
  } else if (error instanceof RateLimitError) {
    console.error('Rate limit exceeded. Retry after:', error.retryAfter)
  }
}
```

## Refresh Token Automático

O SDK automaticamente:

- Injeta o access token em todas as requests
- Detecta erros 401 (Unauthorized)
- Renova o token usando o refresh token
- Retenta a request original
- Limpa os tokens se o refresh falhar

```typescript
// Callback customizado para erro de autenticação
const sdk = createSDK(
  { baseUrl: 'https://api.dev-platform.com' },
  {
    onAuthError: async (error) => {
      console.error('Auth error, redirecting to login...')
      window.location.href = '/login'
    },
  },
)
```

## Storage

Por padrão:

- **Browser**: `LocalStorage` (persistente)
- **Node.js/SSR**: `MemoryStorage` (em memória)

## Tipos

Todos os tipos são exportados e podem ser usados:

```typescript
import type {
  SDKConfig,
  LoginResponse,
  Workspace,
  API,
  Endpoint,
  Mock,
} from '@dev-platform/sdk'
```

## Utilitários

```typescript
import { buildQueryParams } from '@dev-platform/sdk'

const params = buildQueryParams({
  page: 1,
  limit: 10,
  sortBy: 'createdAt',
  sortOrder: 'desc',
  status: 'active',
})
// { page: '1', limit: '10', sortBy: 'createdAt', sortOrder: 'desc', status: 'active' }
```
