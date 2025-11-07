# Mock Server - Servidor HTTP de Mocks

## Contexto

Endpoint público que intercepta requests e retorna mocks baseados em scenarios ou geração automática.

## Dependências

- 02-mock-generator.md completo
- 03-scenario-management.md completo

## Checkboxes

### Pesquisa

- [ ] Estudar wildcards no NestJS (@All decorator)
- [ ] Analisar como extrair path params dinâmicos
- [ ] Revisar headers CORS para public access

### Server Module

- [ ] Criar `src/modules/server/server.module.ts`
- [ ] Criar `src/modules/server/server.service.ts`
- [ ] Criar `src/modules/server/server.controller.ts`
- [ ] Registrar no app.module.ts

### Public Mock URL Structure

Formato: `https://mock-server.com/:workspaceId/:apiId/:method/:path*`

Exemplos:

- `GET /clxy123/api456/GET/users` → mock de GET /users
- `POST /clxy123/api456/POST/users` → mock de POST /users
- `GET /clxy123/api456/GET/users/123/posts` → nested paths

### Server Service - Core Logic

```typescript
class ServerService {
  // Resolve qual mock retornar para um request
  async resolveMock(
    workspaceId: string,
    apiId: string,
    method: string,
    path: string,
    headers?: Record<string, string>
  ): Promise<MockResponse>

  // Busca scenario ativo via header X-Mock-Scenario
  async findScenarioByName(
    endpointId: string,
    scenarioName: string
  ): Promise<MockScenario | null>

  // Aplica delay se configurado
  async applyDelay(delayMs: number): Promise<void>

  // Loga request para analytics
  async logMockRequest(data: MockRequestLog): Promise<void>
}
```

### Resolve Mock Algorithm

```typescript
async resolveMock(
  workspaceId: string,
  apiId: string,
  method: string,
  path: string,
  headers?: Record<string, string>
): Promise<MockResponse> {
  // 1. Buscar endpoint no database
  const endpoint = await this.prisma.endpoint.findFirst({
    where: {
      api: {
        id: apiId,
        workspace: { id: workspaceId }
      },
      method: method.toUpperCase(),
      path: this.normalizePath(path)
    },
    include: {
      mockScenarios: {
        where: { isActive: true }
      }
    }
  });

  if (!endpoint) {
    throw new NotFoundException('Endpoint not found');
  }

  // 2. Verificar se request especifica scenario via header
  const scenarioName = headers?.['x-mock-scenario'];
  let scenario: MockScenario | null = null;

  if (scenarioName) {
    scenario = endpoint.mockScenarios.find(s => s.name === scenarioName);
  }

  // 3. Se não especificado, usar scenario default
  if (!scenario) {
    scenario = endpoint.mockScenarios.find(s => s.isDefault);
  }

  // 4. Se tiver scenario, retornar response customizada
  if (scenario) {
    return {
      statusCode: scenario.statusCode,
      headers: scenario.headers || {},
      body: scenario.body,
      delay: scenario.delay
    };
  }

  // 5. Senão, gerar mock automático do schema
  const generatedBody = await this.generatorService
    .generateMockForEndpoint(endpoint.id);

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: generatedBody,
    delay: 0
  };
}
```

### Path Normalization

```typescript
private normalizePath(path: string): string {
  // Remove leading/trailing slashes
  let normalized = path.replace(/^\/+|\/+$/g, '');

  // Converte path params: /users/123 → /users/:id
  // (depende de como paths são armazenados no DB)

  return `/${normalized}`;
}
```

### Apply Delay

```typescript
async applyDelay(delayMs: number): Promise<void> {
  if (delayMs > 0) {
    await new Promise(resolve => setTimeout(resolve, delayMs));
  }
}
```

### Server Controller - Wildcard Handler

```typescript
@Controller()
export class ServerController {
  // Captura TODOS requests
  @All(":workspaceId/:apiId/:method/*")
  async handleMockRequest(
    @Param("workspaceId") workspaceId: string,
    @Param("apiId") apiId: string,
    @Param("method") method: string,
    @Req() req: Request,
    @Res() res: Response,
    @Headers() headers: Record<string, string>
  ) {
    try {
      // Extrair path completo (tudo após /:method/)
      const fullPath = req.path
      const pathAfterMethod = fullPath.split(`/${method}/`)[1] || ""

      // Resolver qual mock retornar
      const mockResponse = await this.serverService.resolveMock(
        workspaceId,
        apiId,
        method,
        pathAfterMethod,
        headers
      )

      // Aplicar delay se configurado
      if (mockResponse.delay > 0) {
        await this.serverService.applyDelay(mockResponse.delay)
      }

      // Log para analytics (fire-and-forget)
      this.serverService
        .logMockRequest({
          workspaceId,
          apiId,
          method,
          path: pathAfterMethod,
          statusCode: mockResponse.statusCode,
          timestamp: new Date(),
        })
        .catch((err) => this.logger.error("Failed to log request", err))

      // Retornar mock response
      res
        .status(mockResponse.statusCode)
        .set(mockResponse.headers)
        .json(mockResponse.body)
    } catch (error) {
      if (error instanceof NotFoundException) {
        res.status(404).json({
          error: "Mock endpoint not found",
          message: "No matching endpoint found for this request",
        })
      } else {
        this.logger.error("Error serving mock", error)
        res.status(500).json({
          error: "Internal mock server error",
        })
      }
    }
  }
}
```

### CORS Configuration

- [ ] Habilitar CORS para todos requests públicos
- [ ] Configurar headers permitidos:
  ```typescript
  app.enableCors({
    origin: "*", // Public access
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-Mock-Scenario", // Custom header
    ],
    credentials: false,
  })
  ```

### Custom Headers Support

Headers especiais que o mock server reconhece:

- **X-Mock-Scenario**: Nome do scenario a usar
  - Exemplo: `X-Mock-Scenario: Server Error`
- **X-Mock-Delay**: Override delay (ms)
  - Exemplo: `X-Mock-Delay: 2000`
- **X-Mock-Status**: Override status code
  - Exemplo: `X-Mock-Status: 201`

```typescript
// No resolveMock, verificar custom headers
if (headers["x-mock-delay"]) {
  mockResponse.delay = parseInt(headers["x-mock-delay"])
}

if (headers["x-mock-status"]) {
  mockResponse.statusCode = parseInt(headers["x-mock-status"])
}
```

### Analytics Logging

```typescript
interface MockRequestLog {
  workspaceId: string;
  apiId: string;
  method: string;
  path: string;
  statusCode: number;
  scenarioUsed?: string;
  delay: number;
  timestamp: Date;
}

async logMockRequest(data: MockRequestLog): Promise<void> {
  // Enviar evento para Analytics Service via Redis Pub/Sub
  await this.eventEmitter.emit('mock.request', data);

  // Ou salvar diretamente no DB (table MockRequestLog)
  // Decisão: usar eventos para desacoplar
}
```

### Error Scenarios

- [ ] Endpoint não encontrado → 404 com mensagem clara
- [ ] Workspace/API inválido → 404
- [ ] Scenario especificado não existe → usar default
- [ ] Delay excede MAX_MOCK_DELAY_MS → usar max
- [ ] Erro na geração de mock → 500

### Rate Limiting (Opcional)

- [ ] Limitar requests por IP: 100/min
- [ ] Usar Redis para tracking
- [ ] Response: 429 Too Many Requests

### Health Check da Public URL

- [ ] `GET /health/mock` - verifica se mock server está funcionando
- [ ] Retornar exemplo de mock URL para docs

### Documentation Endpoint

- [ ] `GET /:workspaceId/:apiId/docs`
- [ ] Retornar lista de endpoints disponíveis para mock
- [ ] Incluir exemplos de URLs
- [ ] Listar scenarios disponíveis

```typescript
@Get(':workspaceId/:apiId/docs')
async getMockDocs(
  @Param('workspaceId') workspaceId: string,
  @Param('apiId') apiId: string
) {
  const endpoints = await this.prisma.endpoint.findMany({
    where: {
      api: {
        id: apiId,
        workspace: { id: workspaceId }
      }
    },
    include: {
      mockScenarios: {
        where: { isActive: true }
      }
    }
  });

  return {
    baseUrl: `${process.env.MOCK_SERVER_PUBLIC_URL}/${workspaceId}/${apiId}`,
    endpoints: endpoints.map(e => ({
      method: e.method,
      path: e.path,
      mockUrl: `${baseUrl}/${e.method}${e.path}`,
      scenarios: e.mockScenarios.map(s => s.name)
    }))
  };
}
```

### Testes Unitários

- [ ] `tests/unit/server/server.service.spec.ts`
- [ ] Test resolveMock:
  - [ ] Scenario especificado via header
  - [ ] Scenario default
  - [ ] Geração automática (sem scenarios)
  - [ ] Endpoint não encontrado
- [ ] Test path normalization
- [ ] Test custom headers override
- [ ] Mock Prisma, GeneratorService

### Testes Integração

- [ ] `tests/integration/server/mock-server.spec.ts`
- [ ] Setup: Criar workspace, API, endpoints, scenarios
- [ ] GET /:workspace/:api/GET/users
  - [ ] Retorna mock default
  - [ ] Status 200
- [ ] GET com header X-Mock-Scenario: Not Found
  - [ ] Retorna scenario específico
  - [ ] Status 404
- [ ] POST /:workspace/:api/POST/users
  - [ ] Gera mock automático se sem scenarios
- [ ] Verificar delay aplicado
- [ ] Endpoint inexistente → 404

### Documentação

- [ ] README explicando:
  - [ ] Como usar mock server
  - [ ] Formato de URLs
  - [ ] Headers customizados
  - [ ] Como criar scenarios
  - [ ] Exemplos com cURL, Postman, JavaScript

### Validação

- [ ] Mock server responde em URL pública
- [ ] Scenarios customizados funcionam
- [ ] Geração automática funciona
- [ ] Delay é aplicado
- [ ] Logs são enviados para analytics
- [ ] `pnpm test` 100% coverage

## Próximo Passo

→ [05-tests-e2e.md](./05-tests-e2e.md) - Testes E2E completos
