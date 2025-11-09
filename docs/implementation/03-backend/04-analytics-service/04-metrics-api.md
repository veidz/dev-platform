# Analytics Serviço - API de Métricas

## Contexto

Endpoints HTTP para consultar métricas agregadas e gerar dashboards/relatórios.

## Dependências

- 03-aggregation-jobs.md completo
- MetricsBucket populado com dados

## Checkboxes

### Pesquisa

- [ ] Estudar queries de time-series eficientes
- [ ] Revisar padrões de dashboard APIs
- [ ] Analisar formatos de resposta para charting

### Metrics Module

- [ ] Criar `src/modules/metrics/metrics.module.ts`
- [ ] Criar `src/modules/metrics/metrics.service.ts`
- [ ] Criar `src/modules/metrics/metrics.controller.ts`
- [ ] Registrar no app.module.ts

### Query DTOs

```typescript
// dto/metrics-query.dto.ts
export class MetricsQueryDto {
  @IsString()
  workspaceId: string

  @IsOptional()
  @IsString()
  apiId?: string

  @IsOptional()
  @IsString()
  endpointId?: string

  @IsDateString()
  startDate: string // ISO format

  @IsDateString()
  endDate: string

  @IsOptional()
  @IsEnum(['hour', 'day', 'week', 'month'])
  granularity?: 'hour' | 'day' | 'week' | 'month'
}

export class TimeSeriesQueryDto extends MetricsQueryDto {
  @IsEnum(['requests', 'errors', 'latency'])
  metric: 'requests' | 'errors' | 'latency'
}

export class TopEndpointsQueryDto {
  @IsString()
  workspaceId: string

  @IsOptional()
  @IsString()
  apiId?: string

  @IsDateString()
  startDate: string

  @IsDateString()
  endDate: string

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number = 10

  @IsOptional()
  @IsEnum(['requests', 'errors', 'latency'])
  sortBy?: 'requests' | 'errors' | 'latency' = 'requests'
}
```

### Metrics Service - Overview

```typescript
@Injectable()
export class MetricsService {
  constructor(private prisma: PrismaService) {}

  // Métricas gerais do workspace
  async getOverview(query: MetricsQueryDto): Promise<MetricsOverview> {
    const buckets = await this.fetchBuckets(query)

    return {
      totalRequests: sum(buckets.map((b) => b.requestCount)),
      totalErrors: sum(buckets.map((b) => b.errorCount)),
      errorRate: this.calculateErrorRate(buckets),
      avgLatencyMs: this.calculateAvgLatency(buckets),
      p95LatencyMs: this.calculateP95Latency(buckets),
      statusCodeDistribution: this.calculateStatusDistribution(buckets),
    }
  }

  private async fetchBuckets(query: MetricsQueryDto) {
    return this.prisma.metricsBucket.findMany({
      where: {
        workspaceId: query.workspaceId,
        ...(query.apiId && { apiId: query.apiId }),
        ...(query.endpointId && { endpointId: query.endpointId }),
        bucketTimestamp: {
          gte: new Date(query.startDate),
          lte: new Date(query.endDate),
        },
      },
      orderBy: { bucketTimestamp: 'asc' },
    })
  }

  private calculateErrorRate(buckets: MetricsBucket[]): number {
    const totalRequests = sum(buckets.map((b) => b.requestCount))
    const totalErrors = sum(buckets.map((b) => b.errorCount))

    return totalRequests > 0 ? (totalErrors / totalRequests) * 100 : 0
  }

  private calculateAvgLatency(buckets: MetricsBucket[]): number {
    const totalLatency = sum(buckets.map((b) => Number(b.totalLatencyMs)))
    const totalRequests = sum(buckets.map((b) => b.requestCount))

    return totalRequests > 0 ? totalLatency / totalRequests : 0
  }

  private calculateP95Latency(buckets: MetricsBucket[]): number {
    // Aproximação: usar maxLatencyMs dos buckets
    const latencies = buckets.map((b) => b.maxLatencyMs).sort((a, b) => a - b)
    const p95Index = Math.floor(latencies.length * 0.95)

    return latencies[p95Index] || 0
  }

  private calculateStatusDistribution(buckets: MetricsBucket[]) {
    return {
      '2xx': sum(buckets.map((b) => b.status2xx)),
      '3xx': sum(buckets.map((b) => b.status3xx)),
      '4xx': sum(buckets.map((b) => b.status4xx)),
      '5xx': sum(buckets.map((b) => b.status5xx)),
    }
  }
}
```

### Time Series Endpoint

```typescript
async getTimeSeries(query: TimeSeriesQueryDto): Promise<TimeSeriesData> {
  const buckets = await this.fetchBuckets(query);

  const dataPoints = buckets.map(bucket => ({
    timestamp: bucket.bucketTimestamp,
    value: this.extractMetricValue(bucket, query.metric)
  }));

  return {
    metric: query.metric,
    granularity: query.granularity || 'hour',
    data: dataPoints
  };
}

private extractMetricValue(bucket: MetricsBucket, metric: string): number {
  switch (metric) {
    case 'requests':
      return bucket.requestCount;
    case 'errors':
      return bucket.errorCount;
    case 'latency':
      return bucket.requestCount > 0
        ? Number(bucket.totalLatencyMs) / bucket.requestCount
        : 0;
    default:
      return 0;
  }
}
```

### Top Endpoints Ranking

```typescript
async getTopEndpoints(query: TopEndpointsQueryDto): Promise<EndpointRanking[]> {
  const buckets = await this.prisma.metricsBucket.groupBy({
    by: ['endpointId'],
    where: {
      workspaceId: query.workspaceId,
      ...(query.apiId && { apiId: query.apiId }),
      bucketTimestamp: {
        gte: new Date(query.startDate),
        lte: new Date(query.endDate)
      }
    },
    _sum: {
      requestCount: true,
      errorCount: true,
      totalLatencyMs: true
    },
    orderBy: {
      _sum: {
        [query.sortBy === 'requests' ? 'requestCount' :
         query.sortBy === 'errors' ? 'errorCount' : 'totalLatencyMs']: 'desc'
      }
    },
    take: query.limit
  });

  // Enriquecer com detalhes do endpoint
  return Promise.all(
    buckets.map(async (bucket) => {
      const endpoint = await this.prisma.endpoint.findUnique({
        where: { id: bucket.endpointId }
      });

      return {
        endpointId: bucket.endpointId,
        method: endpoint?.method,
        path: endpoint?.path,
        requestCount: bucket._sum.requestCount,
        errorCount: bucket._sum.errorCount,
        avgLatencyMs: bucket._sum.requestCount > 0
          ? Number(bucket._sum.totalLatencyMs) / bucket._sum.requestCount
          : 0
      };
    })
  );
}
```

### Geographic Distribution

```typescript
async getGeographicDistribution(query: MetricsQueryDto): Promise<GeoDistribution[]> {
  // Query raw logs (porque country não está em MetricsBucket)
  const result = await this.prisma.apiRequestLog.groupBy({
    by: ['country'],
    where: {
      workspaceId: query.workspaceId,
      ...(query.apiId && { apiId: query.apiId }),
      timestamp: {
        gte: new Date(query.startDate),
        lte: new Date(query.endDate)
      }
    },
    _count: true,
    orderBy: {
      _count: { country: 'desc' }
    }
  });

  return result.map(r => ({
    country: r.country || 'Unknown',
    requests: r._count
  }));
}
```

### Metrics Controller - Endpoints

```typescript
@Controller('metrics')
@UseGuards(JwtAuthGuard)
export class MetricsController {
  constructor(private metricsService: MetricsService) {}

  @Get('overview')
  async getOverview(@Query() query: MetricsQueryDto) {
    return this.metricsService.getOverview(query)
  }

  @Get('timeseries')
  async getTimeSeries(@Query() query: TimeSeriesQueryDto) {
    return this.metricsService.getTimeSeries(query)
  }

  @Get('top-endpoints')
  async getTopEndpoints(@Query() query: TopEndpointsQueryDto) {
    return this.metricsService.getTopEndpoints(query)
  }

  @Get('geographic')
  async getGeographic(@Query() query: MetricsQueryDto) {
    return this.metricsService.getGeographicDistribution(query)
  }

  @Get('error-rate')
  async getErrorRate(@Query() query: MetricsQueryDto) {
    const overview = await this.metricsService.getOverview(query)
    return { errorRate: overview.errorRate }
  }

  @Get('latency-percentiles')
  async getLatencyPercentiles(@Query() query: MetricsQueryDto) {
    // Calcular p50, p95, p99
    const buckets = await this.metricsService['fetchBuckets'](query)

    return {
      p50: this.calculatePercentile(buckets, 0.5),
      p95: this.calculatePercentile(buckets, 0.95),
      p99: this.calculatePercentile(buckets, 0.99),
    }
  }
}
```

### Caching Strategy

```typescript
// Cache métricas por 5 minutos
@Injectable()
export class MetricsService {
  constructor(@Inject(CACHE_MANAGER) private cache: Cache) {}

  async getOverview(query: MetricsQueryDto): Promise<MetricsOverview> {
    const cacheKey = `metrics:overview:${JSON.stringify(query)}`

    const cached = await this.cache.get<MetricsOverview>(cacheKey)
    if (cached) return cached

    const result = await this.computeOverview(query)

    await this.cache.set(cacheKey, result, 300) // 5min TTL

    return result
  }
}
```

- [ ] Configurar CacheModule
- [ ] Definir TTL apropriado (5min para metrics)
- [ ] Invalidar cache quando novos dados agregados

### Response Formats

**Overview:**

```json
{
  "totalRequests": 1250000,
  "totalErrors": 1250,
  "errorRate": 0.1,
  "avgLatencyMs": 245,
  "p95LatencyMs": 890,
  "statusCodeDistribution": {
    "2xx": 1200000,
    "3xx": 25000,
    "4xx": 23750,
    "5xx": 1250
  }
}
```

**Time Series:**

```json
{
  "metric": "requests",
  "granularity": "hour",
  "data": [
    { "timestamp": "2025-01-01T00:00:00Z", "value": 5000 },
    { "timestamp": "2025-01-01T01:00:00Z", "value": 5500 }
  ]
}
```

**Top Endpoints:**

```json
[
  {
    "endpointId": "ep123",
    "method": "GET",
    "path": "/users",
    "requestCount": 50000,
    "errorCount": 50,
    "avgLatencyMs": 120
  }
]
```

### Authorization Guards

```typescript
// Apenas membros do workspace podem ver métricas
@Injectable()
export class WorkspaceMemberGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest()
    const user = request.user
    const workspaceId = request.query.workspaceId

    const member = await this.prisma.workspaceMember.findFirst({
      where: {
        workspaceId,
        userId: user.id,
      },
    })

    return !!member
  }
}
```

- [ ] Aplicar guard nos endpoints sensíveis

### Export Endpoint

```typescript
@Get('export')
async exportMetrics(
  @Query() query: MetricsQueryDto,
  @Res() res: Response
) {
  const data = await this.metricsService.getTimeSeries(query);

  // Converter para CSV
  const csv = this.convertToCSV(data);

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename=metrics.csv');
  res.send(csv);
}
```

### Testes Unitários

- [ ] `tests/unit/metrics/metrics.service.spec.ts`
- [ ] Test getOverview
- [ ] Test calculateErrorRate
- [ ] Test calculateAvgLatency
- [ ] Test getTimeSeries
- [ ] Test getTopEndpoints
- [ ] Mock Prisma

### Testes Integração

- [ ] `tests/integration/metrics/metrics.spec.ts`
- [ ] Setup: Seed MetricsBucket com dados
- [ ] GET /metrics/overview
- [ ] GET /metrics/timeseries
- [ ] GET /metrics/top-endpoints
- [ ] Verificar cálculos corretos
- [ ] Verificar authorization (403 se não membro)

### Performance Optimization

```typescript
// Adicionar índices compostos
@@index([workspaceId, bucketTimestamp])
@@index([apiId, bucketTimestamp])
@@index([endpointId, bucketTimestamp])
```

- [ ] Verificar explain plans das queries
- [ ] Adicionar índices se necessário
- [ ] Benchmark queries (objetivo: < 500ms)

### Documentação Swagger

- [ ] @ApiTags('Metrics')
- [ ] @ApiOperation para cada endpoint
- [ ] Exemplos de queries
- [ ] Exemplos de responses

### Validação

- [ ] Queries retornam métricas corretas ✅
- [ ] Cache funciona (2ª chamada mais rápida) ✅
- [ ] Authorization funciona ✅
- [ ] Export CSV funciona ✅
- [ ] Performance aceitável (< 500ms) ✅
- [ ] `pnpm test` 100% coverage ✅

## Próximo Passo

→ [05-alerts-webhooks.md](./05-alerts-webhooks.md) - Sistema de alertas e webhooks
