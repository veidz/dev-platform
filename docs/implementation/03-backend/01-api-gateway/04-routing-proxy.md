# API Gateway - Routing & Proxy

## Contexto

Proxy reverso para rotear requests aos microsserviços.

## Dependências

- 03-rate-limiting.md completo

## Checkboxes

### Pesquisa

- [ ] Docs http-proxy-middleware
- [ ] NestJS proxy patterns
- [ ] Verificar versões npm

### Dependencies

- [ ] `pnpm add http-proxy-middleware@latest`
- [ ] `pnpm add @nestjs/axios@latest`
- [ ] `pnpm add axios@latest`

### Proxy Module

- [ ] Criar `src/proxy/proxy.module.ts`
- [ ] Criar `src/proxy/proxy.service.ts`
- [ ] Criar `src/proxy/proxy.controller.ts`

### Service Discovery

- [ ] Criar `src/proxy/service-registry.ts`
- [ ] Map service names → URLs
- [ ] Environment variables para URLs

### Routes Mapping

- [ ] `/api/management/*` → management-service:3001
- [ ] `/api/mock/*` → mock-server:3002
- [ ] `/api/analytics/*` → analytics-service:3003
- [ ] `/api/ai/*` → ai-service:3004

### Proxy Controller

- [ ] Wildcard route: `@All('api/:service/*')`
- [ ] Extract service name from path
- [ ] Forward request com headers
- [ ] Return response

### Request Forwarding

- [ ] Preserve original method (GET, POST, etc)
- [ ] Forward headers (Authorization, Content-Type)
- [ ] Forward query params
- [ ] Forward body (JSON, form-data)

### Response Handling

- [ ] Stream response back to client
- [ ] Preserve status code
- [ ] Preserve headers
- [ ] Handle errors (503 if service down)

### Timeout Config

- [ ] Default timeout: 30s
- [ ] Per-service timeout override
- [ ] Timeout error: 504 Gateway Timeout

### Circuit Breaker (Opcional)

- [ ] Install @nestjs/circuit-breaker
- [ ] Open circuit se service down
- [ ] Retry logic (3 tentativas)
- [ ] Fallback response

### Health Check Aggregation

- [ ] GET /health/all
- [ ] Check all services health
- [ ] Return status map

### Load Balancing (Future)

- [ ] Round-robin entre instâncias
- [ ] Health-based routing
- [ ] Sticky sessions

### Logging

- [ ] Log incoming requests
- [ ] Log target service
- [ ] Log response time
- [ ] Correlation ID propagation

### Error Handling

- [ ] Service não encontrado → 404
- [ ] Service down → 503
- [ ] Timeout → 504
- [ ] Custom error messages

### Testes Unitários

- [ ] `tests/unit/api-gateway/proxy/service-registry.test.ts`
- [ ] Test route resolution
- [ ] Mock service URLs

### Testes Integração

- [ ] `tests/integration/api-gateway/proxy/proxy.test.ts`
- [ ] Request para /api/management/workspaces
- [ ] Verificar forward correto
- [ ] Test timeout handling
- [ ] Test service down scenario

### Mock Services (Tests)

- [ ] Criar mock servers para testes
- [ ] Simular 200, 500, timeout
- [ ] Usar nock ou msw

### Config Environment

- [ ] MANAGEMENT_SERVICE_URL
- [ ] MOCK_SERVER_URL
- [ ] ANALYTICS_SERVICE_URL
- [ ] AI_SERVICE_URL

### Documentação

- [ ] Listar rotas disponíveis
- [ ] Explicar service discovery
- [ ] Troubleshooting common issues

### Validação

- [ ] Requests são roteados corretamente
- [ ] Headers são preservados
- [ ] Health check funciona
- [ ] `pnpm test` (100% coverage)

## Arquivos Criados

```
src/proxy/
├── proxy.module.ts
├── proxy.service.ts
├── proxy.controller.ts
└── service-registry.ts

tests/
├── unit/api-gateway/proxy/
│   └── service-registry.test.ts
└── integration/api-gateway/proxy/
    └── proxy.test.ts
```

## Exemplo: service-registry.ts

```typescript
import { Injectable } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"

@Injectable()
export class ServiceRegistry {
  private services: Map<string, string>

  constructor(private config: ConfigService) {
    this.services = new Map([
      ["management", config.get("MANAGEMENT_SERVICE_URL")],
      ["mock", config.get("MOCK_SERVER_URL")],
      ["analytics", config.get("ANALYTICS_SERVICE_URL")],
      ["ai", config.get("AI_SERVICE_URL")],
    ])
  }

  getServiceUrl(name: string): string | undefined {
    return this.services.get(name)
  }

  getAllServices(): string[] {
    return Array.from(this.services.keys())
  }
}
```

## Exemplo: proxy.controller.ts

```typescript
import { All, Controller, Req, Res } from "@nestjs/common"
import { Request, Response } from "express"
import { ProxyService } from "./proxy.service"

@Controller("api")
export class ProxyController {
  constructor(private proxyService: ProxyService) {}

  @All(":service/*")
  async proxyRequest(@Req() req: Request, @Res() res: Response): Promise<void> {
    await this.proxyService.forward(req, res)
  }
}
```

## Exemplo: proxy.service.ts

```typescript
import {
  Injectable,
  NotFoundException,
  ServiceUnavailableException,
} from "@nestjs/common"
import { HttpService } from "@nestjs/axios"
import { Request, Response } from "express"
import { ServiceRegistry } from "./service-registry"
import { firstValueFrom } from "rxjs"

@Injectable()
export class ProxyService {
  constructor(private http: HttpService, private registry: ServiceRegistry) {}

  async forward(req: Request, res: Response): Promise<void> {
    const serviceName = req.params.service
    const targetUrl = this.registry.getServiceUrl(serviceName)

    if (!targetUrl) {
      throw new NotFoundException(`Service ${serviceName} not found`)
    }

    try {
      const response = await firstValueFrom(
        this.http.request({
          method: req.method,
          url: `${targetUrl}${req.path.replace(`/api/${serviceName}`, "")}`,
          headers: req.headers,
          data: req.body,
          params: req.query,
          timeout: 30000,
        })
      )

      res.status(response.status).send(response.data)
    } catch (error) {
      throw new ServiceUnavailableException(
        `Service ${serviceName} unavailable`
      )
    }
  }
}
```

## Recursos

- [http-proxy-middleware](https://github.com/chimurai/http-proxy-middleware)
- [NestJS HttpModule](https://docs.nestjs.com/techniques/http-module)
- [API Gateway Pattern](https://microservices.io/patterns/apigateway.html)

## Próximo Passo

✅ **API Gateway completo!**

→ [Management Service](../02-management-service/01-setup.md)
