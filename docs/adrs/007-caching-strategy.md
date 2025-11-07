# ADR-007: Arquitetura de Camada de Cache

## Contexto

Plataforma serve workloads read-heavy: schemas de API buscados frequentemente, configurações de mock recuperadas por request, queries de analytics em dados históricos. Queries de database representam 60-70% da latência de requests. Requisitos: leituras de cache sub-10ms, expiração baseada em TTL, invalidação de cache em updates e cache distribuído para múltiplas instâncias de serviço.

## Decisão

**Redis** (Upstash) como cache distribuído com estratégia multi-layer.

### Arquitetura

**Layer 1 - Application Memory (In-Process):**

```typescript
@Injectable()
export class CacheService {
  private cache = new NodeCache({ stdTTL: 60 })

  get<T>(key: string): T | undefined {
    return this.cache.get<T>(key)
  }
}
```

Usar para: Dados scoped a request, configs imutáveis acessados frequentemente. TTL: 30-60s.

**Layer 2 - Redis (Distribuído):**

```typescript
await this.redis.set(key, JSON.stringify(value), 'EX', 3600)
```

Usar para: Sessões de usuário, schemas de API, resultados de queries. TTL: 5min-1hr.

**Layer 3 - Database:**
Fallback quando cache miss. Padrão read-through caching.

### Estratégias de Caching

**Read-Through:**

```typescript
async getApi(id: string): Promise<API> {
  // Verifica cache primeiro
  const cached = await this.redis.get(`api:${id}`);
  if (cached) return JSON.parse(cached);

  // Cache miss - busca do DB
  const api = await this.prisma.api.findUnique({ where: { id } });
  await this.redis.set(`api:${id}`, JSON.stringify(api), 'EX', 3600);
  return api;
}
```

**Write-Through:**

```typescript
async updateApi(id: string, data: UpdateApiDto): Promise<API> {
  const api = await this.prisma.api.update({ where: { id }, data });
  // Atualiza cache imediatamente
  await this.redis.set(`api:${id}`, JSON.stringify(api), 'EX', 3600);
  return api;
}
```

**Invalidação de Cache:**
Deleção baseada em pattern usando Redis SCAN:

```typescript
async invalidateApiCache(id: string): Promise<void> {
  await this.redis.del(`api:${id}`);
  // Invalida caches relacionados
  await this.redis.del(`api:${id}:endpoints`);
}
```

**Benefícios Upstash Redis:**

- Pricing serverless (pay-per-request)
- Replicação global (baixa latência worldwide)
- REST API (sem conexões persistentes)
- Free tier: 10k commands/day, 256MB storage
- TLS automático, sem gerenciamento de infraestrutura

### Alternativas Consideradas

**Memcached:** Protocolo mais simples mas falta estruturas de dados (lists, sets), persistência e Pub/Sub. Redis mais versátil.

**DragonflyDB:** Compatível com Redis mas requer self-hosting. Serviço gerenciado Upstash preferido.

**CDN Caching (Vercel Edge):** Excelente para assets estáticos mas insuficiente para dados dinâmicos específicos de usuário.

## Consequências

### Positivas

**Performance:** Leituras Redis: <1ms p99. Reduz carga DB em 70-80%.

**Redução de Custo:** Menos queries de database = menor uso de compute Neon.

**Escalabilidade:** Cache distribuído previne queries N+1 entre instâncias de serviço.

**Flexibilidade:** Estruturas de dados Redis habilitam caching complexo (sorted sets para rankings, lists para logs).

### Negativas

**Consistência de Cache:** Risco de dados stale se invalidação falha. Consistência eventual aceitável para maioria dos casos.

**Overhead de Memória:** Cache application-level consome heap. Monitorar uso de memória.

**Complexidade Adicionada:** Lógica de invalidação de cache aumenta superfície de código. Bugs mais difíceis de debugar.

**Custo Redis:** Pricing Upstash escala com requests. Monitorar uso para prevenir contas surpresa.

### Mitigação

**Cache Warming:** Pre-popular cache em deployment para prevenir thundering herd.

**Estratégia de TTL:** TTLs mais curtos para dados atualizados frequentemente, mais longos para dados estáveis.

**Monitoramento:** Rastrear hit ratio de cache (target >80%), uso de memória Redis e latência de operações.

**Degradação Graceful:** Aplicação funciona sem cache (fallback para DB).

## Referências

- [Padrões Caching Redis](https://redis.io/docs/manual/patterns/)
- [Upstash Redis](https://upstash.com/docs/redis)
- [NestJS Caching](https://docs.nestjs.com/techniques/caching)
- [Estratégias Cache Invalidation](https://www.prisma.io/dataguide/managing-databases/caching-strategies)
