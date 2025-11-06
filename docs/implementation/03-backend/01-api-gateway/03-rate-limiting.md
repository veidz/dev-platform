# API Gateway - Rate Limiting

## Contexto

Rate limiting distribuído com Redis para proteger APIs.

## Dependências

- 02-auth-module.md completo

## Checkboxes

### Pesquisa

- [ ] Docs @nestjs/throttler
- [ ] Redis rate limiting patterns
- [ ] Verificar versões npm

### Dependencies

- [ ] `pnpm add @nestjs/throttler@latest`
- [ ] `pnpm add @nestjs/throttler-storage-redis@latest`

### Throttler Module Setup

- [ ] Importar ThrottlerModule em app.module
- [ ] Configurar storage: Redis
- [ ] TTL e limit padrão (100 req/min)

### Redis Storage Adapter

- [ ] Criar `src/rate-limit/redis-throttler-storage.ts`
- [ ] Extend ThrottlerStorageService
- [ ] Usar ioredis client existente

### Global Rate Limiter

- [ ] APP_GUARD com ThrottlerGuard
- [ ] Aplicar em todas rotas por padrão
- [ ] Configurar no app.module

### Custom Decorators

- [ ] Criar `src/rate-limit/decorators/throttle-custom.decorator.ts`
- [ ] Override limit/ttl por rota
- [ ] Exemplo: @Throttle({ default: { limit: 10, ttl: 60 } })

### Rate Limit por User

- [ ] Criar `src/rate-limit/guards/user-throttle.guard.ts`
- [ ] Key: `user:${userId}`
- [ ] Limit: 1000 req/hora por user

### Rate Limit por API Key

- [ ] Guard específico para API keys
- [ ] Key: `apikey:${keyId}`
- [ ] Configurar limits por tier (free, pro, enterprise)

### Rate Limit por Workspace

- [ ] Guard para workspace
- [ ] Key: `workspace:${workspaceId}`
- [ ] Limits configuráveis por workspace

### Headers de Response

- [ ] X-RateLimit-Limit
- [ ] X-RateLimit-Remaining
- [ ] X-RateLimit-Reset
- [ ] Interceptor para adicionar headers

### Error Handling

- [ ] ThrottlerException com status 429
- [ ] Custom message: "Too many requests"
- [ ] Retry-After header

### Skip Rate Limit

- [ ] Decorator @SkipThrottle() para rotas públicas
- [ ] Health check não tem rate limit
- [ ] Admin endpoints têm limit maior

### Dashboard Redis (Opcional)

- [ ] Script para monitorar keys
- [ ] Ver usage por user/workspace
- [ ] Clean expired keys

### Testes Unitários

- [ ] `tests/unit/api-gateway/rate-limit/redis-storage.test.ts`
- [ ] Test increment counter
- [ ] Test TTL expiration
- [ ] Mock Redis

### Testes Integração

- [ ] `tests/integration/api-gateway/rate-limit/throttle.test.ts`
- [ ] Fazer 100 requests → sucesso
- [ ] Request 101 → 429
- [ ] Aguardar TTL → reset counter
- [ ] Test per-user limits

### Config Environment

- [ ] RATE_LIMIT_TTL (default 60)
- [ ] RATE_LIMIT_MAX (default 100)
- [ ] REDIS_URL para throttler

### Documentação

- [ ] Documentar limits por endpoint
- [ ] Como request API key com higher limits
- [ ] Explicar headers de rate limit

### Validação

- [ ] Global rate limit funciona
- [ ] Per-user limit funciona
- [ ] Headers corretos no response
- [ ] `pnpm test` (100% coverage)

## Arquivos Criados

```
src/rate-limit/
├── redis-throttler-storage.ts
├── guards/
│   ├── user-throttle.guard.ts
│   └── apikey-throttle.guard.ts
└── decorators/
    └── throttle-custom.decorator.ts

tests/
├── unit/api-gateway/rate-limit/
│   └── redis-storage.test.ts
└── integration/api-gateway/rate-limit/
    └── throttle.test.ts
```

## Exemplo: redis-throttler-storage.ts

```typescript
import { Injectable } from "@nestjs/common"
import { ThrottlerStorage } from "@nestjs/throttler"
import { Redis } from "ioredis"

@Injectable()
export class RedisThrottlerStorage implements ThrottlerStorage {
  constructor(private redis: Redis) {}

  async increment(
    key: string,
    ttl: number
  ): Promise<{ totalHits: number; timeToExpire: number }> {
    const multi = this.redis.multi()
    multi.incr(key)
    multi.pexpire(key, ttl)

    const [totalHits] = await multi.exec()
    const timeToExpire = await this.redis.pttl(key)

    return {
      totalHits: totalHits[1] as number,
      timeToExpire,
    }
  }
}
```

## Exemplo: app.module.ts

```typescript
import { Module } from "@nestjs/common"
import { ThrottlerModule } from "@nestjs/throttler"
import { APP_GUARD } from "@nestjs/core"
import { ThrottlerGuard } from "@nestjs/throttler"
import { RedisThrottlerStorage } from "./rate-limit/redis-throttler-storage"

@Module({
  imports: [
    ThrottlerModule.forRootAsync({
      useFactory: (redis: Redis) => ({
        throttlers: [{ ttl: 60000, limit: 100 }],
        storage: new RedisThrottlerStorage(redis),
      }),
      inject: [Redis],
    }),
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
```

## Recursos

- [NestJS Throttler](https://docs.nestjs.com/security/rate-limiting)
- [Redis Rate Limiting](https://redis.io/docs/manual/patterns/rate-limiter/)

## Próximo Passo

→ [04-routing-proxy.md](./04-routing-proxy.md)
