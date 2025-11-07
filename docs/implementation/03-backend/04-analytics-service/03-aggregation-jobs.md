# Analytics Service - Jobs de Agregação

## Contexto

Background jobs que agregam dados brutos (ApiRequestLog) em métricas consolidadas (MetricsBucket) para queries rápidas.

## Dependências

- 02-event-ingestion.md completo
- BullMQ configurado
- Prisma models: ApiRequestLog, MetricsBucket

## Checkboxes

### Pesquisa

- [ ] Estudar BullMQ job processors
- [ ] Revisar estratégias de agregação incremental
- [ ] Analisar window functions do PostgreSQL

### Aggregation Module

- [ ] Criar `src/modules/aggregation/aggregation.module.ts`
- [ ] Criar `src/modules/aggregation/aggregation.service.ts`
- [ ] Criar `src/jobs/aggregation.processor.ts`
- [ ] Registrar no app.module.ts

### BullMQ Queue Setup

```typescript
// aggregation.module.ts
@Module({
  imports: [
    BullModule.registerQueue({
      name: 'aggregation',
    }),
  ],
  providers: [AggregationService, AggregationProcessor],
  exports: [AggregationService],
})
export class AggregationModule {}
```

### Aggregation Service - Core

```typescript
@Injectable()
export class AggregationService {
  constructor(
    @InjectQueue('aggregation') private aggregationQueue: Queue,
    private prisma: PrismaService,
  ) {}

  // Agendar agregação para uma hora específica
  async scheduleAggregation(timestamp: Date): Promise<void> {
    const hourStart = startOfHour(timestamp)

    await this.aggregationQueue.add(
      'aggregate-hour',
      { hourStart: hourStart.toISOString() },
      {
        jobId: `agg-${hourStart.toISOString()}`, // Previne duplicatas
        removeOnComplete: true,
        removeOnFail: false,
      },
    )
  }

  // Agregar dados de uma hora específica
  async aggregateHour(hourStart: Date): Promise<void> {
    const hourEnd = addHours(hourStart, 1)

    // Buscar todos logs daquela hora
    const logs = await this.prisma.apiRequestLog.findMany({
      where: {
        timestamp: {
          gte: hourStart,
          lt: hourEnd,
        },
      },
    })

    if (logs.length === 0) {
      this.logger.log(`No logs to aggregate for ${hourStart.toISOString()}`)
      return
    }

    // Agrupar por dimensões (workspaceId, apiId, endpointId)
    const grouped = this.groupLogs(logs)

    // Calcular métricas para cada grupo
    const metrics = Object.entries(grouped).map(([key, logs]) => {
      const [workspaceId, apiId, endpointId] = key.split('|')
      return this.calculateMetrics(
        workspaceId,
        apiId,
        endpointId,
        logs,
        hourStart,
      )
    })

    // Upsert em batch
    await Promise.all(metrics.map((m) => this.upsertMetricsBucket(m)))

    this.logger.log(
      `Aggregated ${logs.length} logs into ${
        metrics.length
      } buckets for ${hourStart.toISOString()}`,
    )
  }

  // Agrupa logs por dimensões
  private groupLogs(logs: ApiRequestLog[]): Record<string, ApiRequestLog[]> {
    return logs.reduce(
      (acc, log) => {
        const key = `${log.workspaceId}|${log.apiId}|${log.endpointId || 'null'}`
        if (!acc[key]) acc[key] = []
        acc[key].push(log)
        return acc
      },
      {} as Record<string, ApiRequestLog[]>,
    )
  }

  // Calcula métricas agregadas
  private calculateMetrics(
    workspaceId: string,
    apiId: string,
    endpointId: string | null,
    logs: ApiRequestLog[],
    bucketTimestamp: Date,
  ) {
    const requestCount = logs.length
    const errorCount = logs.filter((l) => l.statusCode >= 500).length
    const totalLatencyMs = logs.reduce((sum, l) => sum + l.responseTimeMs, 0)

    const latencies = logs.map((l) => l.responseTimeMs).sort((a, b) => a - b)
    const minLatencyMs = latencies[0]
    const maxLatencyMs = latencies[latencies.length - 1]

    // Status code distribution
    const status2xx = logs.filter(
      (l) => l.statusCode >= 200 && l.statusCode < 300,
    ).length
    const status3xx = logs.filter(
      (l) => l.statusCode >= 300 && l.statusCode < 400,
    ).length
    const status4xx = logs.filter(
      (l) => l.statusCode >= 400 && l.statusCode < 500,
    ).length
    const status5xx = logs.filter((l) => l.statusCode >= 500).length

    return {
      workspaceId,
      apiId,
      endpointId: endpointId === 'null' ? null : endpointId,
      bucketTimestamp,
      requestCount,
      errorCount,
      totalLatencyMs: BigInt(totalLatencyMs),
      minLatencyMs,
      maxLatencyMs,
      status2xx,
      status3xx,
      status4xx,
      status5xx,
    }
  }

  // Upsert metrics bucket
  private async upsertMetricsBucket(data: any): Promise<void> {
    await this.prisma.metricsBucket.upsert({
      where: {
        workspaceId_apiId_endpointId_bucketTimestamp: {
          workspaceId: data.workspaceId,
          apiId: data.apiId,
          endpointId: data.endpointId,
          bucketTimestamp: data.bucketTimestamp,
        },
      },
      update: data,
      create: data,
    })
  }
}
```

### Job Processor

```typescript
// jobs/aggregation.processor.ts
@Processor('aggregation')
export class AggregationProcessor {
  constructor(private aggregationService: AggregationService) {}

  @Process('aggregate-hour')
  async handleAggregateHour(job: Job<{ hourStart: string }>) {
    const hourStart = new Date(job.data.hourStart)

    this.logger.log(`Processing aggregation for ${hourStart.toISOString()}`)

    await this.aggregationService.aggregateHour(hourStart)

    return { success: true, hourStart: hourStart.toISOString() }
  }
}
```

### Cron Job - Hourly Aggregation

```typescript
// aggregation.service.ts
@Cron('5 * * * *') // A cada hora, no minuto 5
async scheduleHourlyAggregation() {
  // Agregar a hora anterior
  const previousHour = subHours(startOfHour(new Date()), 1);

  await this.scheduleAggregation(previousHour);
}
```

- [ ] Install `@nestjs/schedule`
- [ ] Configurar ScheduleModule no app.module

### Backfill Job

Para agregar dados históricos:

```typescript
async backfillAggregations(startDate: Date, endDate: Date): Promise<void> {
  const hours = eachHourOfInterval({ start: startDate, end: endDate });

  this.logger.log(`Backfilling ${hours.length} hours`);

  for (const hour of hours) {
    await this.scheduleAggregation(hour);
  }
}
```

- [ ] Criar endpoint `POST /aggregation/backfill`
- [ ] Proteger com admin-only guard

### Incremental Aggregation (Opcional)

Ao invés de re-calcular tudo, atualizar incrementalmente:

```typescript
// Quando novo evento chega
@EventPattern('api.request.completed')
async handleNewRequest(@Payload() event: ApiRequestEventDto) {
  const hourStart = startOfHour(event.timestamp);

  // Incrementar metrics bucket
  await this.prisma.metricsBucket.upsert({
    where: {
      workspaceId_apiId_endpointId_bucketTimestamp: {
        workspaceId: event.workspaceId,
        apiId: event.apiId,
        endpointId: event.endpointId,
        bucketTimestamp: hourStart
      }
    },
    update: {
      requestCount: { increment: 1 },
      totalLatencyMs: { increment: event.responseTimeMs },
      minLatencyMs: { min: event.responseTimeMs },
      maxLatencyMs: { max: event.responseTimeMs },
      // Status code increments...
    },
    create: {
      // Initial values...
    }
  });
}
```

- [ ] Decidir: batch aggregation vs incremental
- [ ] Documentar trade-offs

### Data Retention

Deletar logs antigos para economizar storage:

```typescript
@Cron('0 2 * * *') // Diariamente às 2am
async cleanupOldLogs() {
  const retentionDays = 30; // Configurável
  const cutoffDate = subDays(new Date(), retentionDays);

  const deleted = await this.prisma.apiRequestLog.deleteMany({
    where: {
      timestamp: { lt: cutoffDate }
    }
  });

  this.logger.log(`Deleted ${deleted.count} old logs (before ${cutoffDate})`);
}
```

- [ ] Configurar retention policy
- [ ] Garantir metrics buckets são preservados

### Metrics Rollup (Optional)

Agregar buckets hourly → daily → monthly para queries de longo prazo:

```typescript
// Daily rollup
@Cron('0 3 * * *')
async rollupDaily() {
  const yesterday = subDays(startOfDay(new Date()), 1);

  // Somar todos hourly buckets do dia
  const hourlyBuckets = await this.prisma.metricsBucket.findMany({
    where: {
      bucketTimestamp: {
        gte: yesterday,
        lt: addDays(yesterday, 1)
      }
    }
  });

  // Agregar em daily bucket...
}
```

- [ ] Implementar se necessário para performance

### Error Handling

- [ ] Retry failed jobs (max 3 tentativas)
- [ ] Log erros com contexto
- [ ] Alertar se jobs falhando consistentemente
- [ ] Dead letter queue para jobs problemáticos

### Monitoring

```typescript
// Métricas para monitorar
;-aggregation_jobs_total(counter) -
  aggregation_duration_seconds(histogram) -
  aggregation_logs_processed_total(counter) -
  aggregation_buckets_created_total(counter)
```

### Testes Unitários

- [ ] `tests/unit/aggregation/aggregation.service.spec.ts`
- [ ] Test groupLogs
- [ ] Test calculateMetrics:
  - [ ] Request count correto
  - [ ] Error count correto
  - [ ] Latency min/max/avg corretos
  - [ ] Status code distribution correta
- [ ] Test upsertMetricsBucket
- [ ] Mock Prisma

### Testes Integração

- [ ] `tests/integration/aggregation/aggregation.spec.ts`
- [ ] Setup: Seed 1000 ApiRequestLog entries
- [ ] Executar aggregateHour
- [ ] Verificar MetricsBucket criado:
  - [ ] requestCount = 1000
  - [ ] Métricas corretas
- [ ] Executar 2x (idempotency)
- [ ] Verificar data retention cleanup

### Performance Test

```typescript
// Agregar 1 milhão de logs
const logs = Array(1_000_000)
  .fill(null)
  .map(() => ({
    workspaceId: 'test',
    apiId: 'test',
    // ...
  }))

await prisma.apiRequestLog.createMany({ data: logs })

const start = Date.now()
await aggregationService.aggregateHour(someHour)
const elapsed = Date.now() - start

console.log(`Aggregated 1M logs in ${elapsed}ms`)
// Objetivo: < 30 segundos
```

- [ ] Executar performance test
- [ ] Otimizar queries se necessário

### Documentação

- [ ] README explicando:
  - [ ] Arquitetura de agregação
  - [ ] Frequência de jobs (hourly)
  - [ ] Data retention policy
  - [ ] Como fazer backfill
  - [ ] Trade-offs de design

### Validação

- [ ] Jobs são executados no schedule ✅
- [ ] Métricas agregadas corretamente ✅
- [ ] Idempotência (rodar 2x = mesmo resultado) ✅
- [ ] Cleanup de logs antigos funciona ✅
- [ ] Performance aceitável (1M logs < 30s) ✅
- [ ] `pnpm test` 100% coverage ✅

## Próximo Passo

→ [04-metrics-api.md](./04-metrics-api.md) - API para consultar métricas
