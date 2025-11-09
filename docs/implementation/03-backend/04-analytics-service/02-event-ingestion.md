# Analytics Serviço - Ingestão de Eventos

## Contexto

Módulo responsável por receber e processar eventos de API requests dos outros microsserviços (API Gateway, Mock Server).

## Dependências

- 01-setup.md completo
- Redis Pub/Sub configurado
- Prisma models: ApiRequestLog

## Checkboxes

### Pesquisa

- [ ] Estudar NestJS EventEmitter e MessagePattern
- [ ] Revisar padrões de ingestão de eventos high-throughput
- [ ] Analisar estratégias de batching para reduzir I/O

### Ingestion Module

- [ ] Criar `src/modules/ingestion/ingestion.module.ts`
- [ ] Criar `src/modules/ingestion/ingestion.service.ts`
- [ ] Criar `src/modules/ingestion/ingestion.controller.ts`
- [ ] Registrar no app.module.ts

### Event DTOs

```typescript
// dto/api-request-event.dto.ts
export class ApiRequestEventDto {
  @IsString()
  workspaceId: string

  @IsString()
  apiId: string

  @IsOptional()
  @IsString()
  endpointId?: string

  @IsString()
  method: string

  @IsString()
  path: string

  @IsNumber()
  @Min(100)
  @Max(599)
  statusCode: number

  @IsNumber()
  @Min(0)
  responseTimeMs: number

  @IsOptional()
  @IsString()
  userId?: string

  @IsOptional()
  @IsString()
  ipAddress?: string

  @IsOptional()
  @IsString()
  userAgent?: string

  @IsDate()
  @Type(() => Date)
  timestamp: Date
}
```

### Ingestion Service - Core

```typescript
@Injectable()
export class IngestionService {
  private eventBuffer: ApiRequestEventDto[] = []
  private readonly BATCH_SIZE = 100
  private readonly FLUSH_INTERVAL_MS = 5000 // 5 segundos

  constructor(
    private prisma: PrismaService,
    private geoipService: GeoIpService,
  ) {
    // Flush automático a cada 5 segundos
    setInterval(() => this.flushBuffer(), this.FLUSH_INTERVAL_MS)
  }

  // Adiciona evento ao buffer
  async ingestEvent(event: ApiRequestEventDto): Promise<void> {
    this.eventBuffer.push(event)

    if (this.eventBuffer.length >= this.BATCH_SIZE) {
      await this.flushBuffer()
    }
  }

  // Persiste eventos em batch
  private async flushBuffer(): Promise<void> {
    if (this.eventBuffer.length === 0) return

    const events = [...this.eventBuffer]
    this.eventBuffer = []

    try {
      // Enriquecer com GeoIP
      const enrichedEvents = await Promise.all(
        events.map((e) => this.enrichEvent(e)),
      )

      // Insert em batch
      await this.prisma.apiRequestLog.createMany({
        data: enrichedEvents,
        skipDuplicates: true,
      })

      this.logger.log(`Flushed ${events.length} events to database`)
    } catch (error) {
      this.logger.error('Failed to flush events', error)
      // Re-adicionar ao buffer para retry
      this.eventBuffer.unshift(...events)
    }
  }

  // Enriquece evento com dados adicionais
  private async enrichEvent(event: ApiRequestEventDto): Promise<any> {
    let country: string | undefined

    if (event.ipAddress) {
      country = await this.geoipService.lookup(event.ipAddress)
    }

    return {
      ...event,
      country,
    }
  }
}
```

### GeoIP Service (Opcional)

```typescript
@Injectable()
export class GeoIpService {
  private cache = new Map<string, string>()

  async lookup(ip: string): Promise<string | undefined> {
    // Verificar cache
    if (this.cache.has(ip)) {
      return this.cache.get(ip)
    }

    try {
      // Opção 1: API gratuita (ipapi.co)
      const response = await fetch(`https://ipapi.co/${ip}/country/`)
      const country = await response.text()

      // Cache por 24h
      this.cache.set(ip, country)

      return country
    } catch (error) {
      this.logger.warn(`GeoIP lookup failed for ${ip}`, error)
      return undefined
    }
  }
}
```

- [ ] Criar `src/modules/ingestion/geoip.service.ts`
- [ ] Implementar cache de IPs
- [ ] Configurar API key (se usar serviço pago)

### Event Listener - Redis Pub/Sub

```typescript
@Controller()
export class IngestionController {
  constructor(private ingestionService: IngestionService) {}

  // Listener para eventos de API Gateway
  @EventPattern('api.request.completed')
  async handleApiRequest(@Payload() data: ApiRequestEventDto) {
    await this.ingestionService.ingestEvent(data)
  }

  // Listener para eventos de Mock Server
  @EventPattern('mock.request')
  async handleMockRequest(@Payload() data: ApiRequestEventDto) {
    await this.ingestionService.ingestEvent(data)
  }
}
```

### HTTP Endpoint (Alternativa)

Caso outros serviços prefiram HTTP POST ao invés de eventos:

```typescript
@Controller('ingest')
export class IngestionController {
  @Post('event')
  async ingestViaHttp(@Body() dto: ApiRequestEventDto) {
    await this.ingestionService.ingestEvent(dto)
    return { success: true }
  }

  @Post('events/batch')
  async ingestBatch(@Body() dto: { events: ApiRequestEventDto[] }) {
    await Promise.all(
      dto.events.map((e) => this.ingestionService.ingestEvent(e)),
    )
    return { success: true, count: dto.events.length }
  }
}
```

### Batching Strategy

**Por que batching?**

- Reduz I/O no database (1 query para 100 inserts)
- Melhora throughput (10k+ eventos/segundo)
- Reduz latência de rede

**Configurações:**

```typescript
// Flush quando:
// 1. Buffer atinge BATCH_SIZE (100 eventos)
// 2. FLUSH_INTERVAL_MS passa (5 segundos)
// 3. Aplicação está sendo encerrada (graceful shutdown)
```

### Graceful Shutdown

```typescript
// ingestion.service.ts
async onModuleDestroy() {
  this.logger.log('Flushing remaining events before shutdown...');
  await this.flushBuffer();
}
```

- [ ] Implementar onModuleDestroy
- [ ] Testar shutdown gracioso

### Error Handling

- [ ] Try-catch em flushBuffer
- [ ] Re-adicionar eventos ao buffer se falhar
- [ ] Dead letter queue (DLQ) para eventos que falham 3x
- [ ] Alertar time se DLQ crescer muito

### Monitoring

```typescript
// Métricas para monitorar
;-events_ingested_total(counter) -
  events_buffer_size(gauge) -
  flush_duration_seconds(histogram) -
  geoip_lookup_errors_total(counter)
```

- [ ] Adicionar métricas Prometheus (opcional)

### Rate Limiting (Proteção)

- [ ] Limitar eventos por workspace: 1000/min
- [ ] Rejeitar se buffer > MAX_BUFFER_SIZE (10k)
- [ ] Retornar 429 Too Many Requests

### Validation

- [ ] Validar campos obrigatórios
- [ ] Validar formatos (statusCode 100-599)
- [ ] Validar timestamps (não no futuro)
- [ ] Sanitizar strings (XSS prevention)

### Testes Unitários

- [ ] `tests/unit/ingestion/ingestion.service.spec.ts`
- [ ] Test ingestEvent:
  - [ ] Adiciona ao buffer
  - [ ] Flush quando BATCH_SIZE atingido
  - [ ] Flush após FLUSH_INTERVAL_MS
- [ ] Test enrichEvent (mock GeoIP)
- [ ] Test error handling (database down)
- [ ] Mock Prisma, GeoIpService

### Testes Integração

- [ ] `tests/integration/ingestion/ingestion.spec.ts`
- [ ] POST /ingest/event → evento salvo no DB
- [ ] POST /ingest/events/batch → múltiplos eventos
- [ ] Enviar evento via Redis Pub/Sub
- [ ] Verificar batching funciona (100 eventos = 1 query)
- [ ] Verificar GeoIP lookup

### Load Testing

```typescript
// Simular 10k eventos
const events = Array(10000)
  .fill(null)
  .map(() => ({
    workspaceId: 'test',
    apiId: 'test',
    method: 'GET',
    path: '/test',
    statusCode: 200,
    responseTimeMs: 100,
    timestamp: new Date(),
  }))

const start = Date.now()
await Promise.all(events.map((e) => ingestEvent(e)))
const elapsed = Date.now() - start

console.log(`Ingested 10k events in ${elapsed}ms`)
// Objetivo: < 5 segundos
```

- [ ] Executar load test
- [ ] Verificar sem memory leaks
- [ ] Verificar database não sobrecarregado

### Documentação

- [ ] Swagger decorators
- [ ] Exemplos de eventos
- [ ] Explicar batching strategy
- [ ] Documentar event schema

### Validação

- [ ] Eventos são salvos no DB ✅
- [ ] Batching funciona (reduz queries) ✅
- [ ] GeoIP lookup funciona ✅
- [ ] Graceful shutdown funciona ✅
- [ ] Load test passa (10k eventos < 5s) ✅
- [ ] `pnpm test` 100% coverage ✅

## Próximo Passo

→ [03-aggregation-jobs.md](./03-aggregation-jobs.md) - Jobs de agregação de métricas
