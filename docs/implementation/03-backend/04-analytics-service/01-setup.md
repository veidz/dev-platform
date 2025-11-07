# Analytics Service - Setup Inicial

## Contexto

Microsserviço responsável por coletar, agregar e exibir métricas de uso de APIs (requests, latência, erros, distribuição geográfica).

## Dependências

- Phase 0 e 1 completas
- Prisma schema com models para time-series
- Redis para agregação em tempo real

## Checkboxes

### Pesquisa & Planejamento

- [ ] Estudar TimescaleDB extension para PostgreSQL
- [ ] Revisar padrões de time-series data storage
- [ ] Analisar bibliotecas de charting (para futura integração frontend)
- [ ] Estudar agregação de métricas (BullMQ jobs)
- [ ] Revisar ADR-007 (Caching) para Redis usage

### Criar Aplicação NestJS

- [ ] `cd apps && nest new analytics`
- [ ] Selecionar package manager: `pnpm`
- [ ] Configurar tsconfig.json herdando de `@dev-platform/config/tsconfig`
- [ ] Adicionar no turbo.json pipeline

### Dependencies

```bash
pnpm add @prisma/client
pnpm add @nestjs/config
pnpm add @nestjs/bull bullmq
pnpm add ioredis
pnpm add class-validator class-transformer
pnpm add date-fns # Manipulação de datas
pnpm add -D @types/bull
```

### Estrutura de Diretórios

```
apps/analytics/
├── src/
│   ├── modules/
│   │   ├── ingestion/      # Ingestão de eventos
│   │   ├── aggregation/    # Jobs de agregação
│   │   ├── metrics/        # Cálculo de métricas
│   │   ├── alerts/         # Sistema de alertas
│   │   └── webhooks/       # Webhooks para notificações
│   ├── common/
│   │   ├── types/
│   │   ├── utils/
│   │   └── decorators/
│   ├── jobs/               # BullMQ job processors
│   ├── app.module.ts
│   └── main.ts
├── test/
├── prisma/
│   └── schema.prisma
└── package.json
```

### Configuração Base

- [ ] **main.ts**
  - [ ] Porta: 3003 (padrão) ou `process.env.ANALYTICS_PORT`
  - [ ] CORS habilitado
  - [ ] Global validation pipe
  - [ ] Swagger em `/docs`
  - [ ] Global prefix: `/api/analytics`
  - [ ] Microservice transport (Redis para eventos)

- [ ] **app.module.ts**
  - [ ] Import ConfigModule
  - [ ] Import PrismaModule
  - [ ] Import BullModule (Redis queue)
  - [ ] Import IngestionModule
  - [ ] Import AggregationModule
  - [ ] Import MetricsModule
  - [ ] Import AlertsModule
  - [ ] Import WebhooksModule

### Prisma Schema - Time-Series Tables

```prisma
// API Request Log (raw events)
model ApiRequestLog {
  id             String    @id @default(cuid())

  // Request Info
  workspaceId    String
  apiId          String
  endpointId     String?
  method         String
  path           String

  // Response Info
  statusCode     Int
  responseTimeMs Int       // Latência em ms

  // User Info
  userId         String?
  ipAddress      String?
  userAgent      String?
  country        String?   // GeoIP lookup

  // Metadata
  timestamp      DateTime  @default(now())

  // Relations
  workspace      Workspace @relation(fields: [workspaceId], references: [id], onDelete: Cascade)
  api            Api       @relation(fields: [apiId], references: [id], onDelete: Cascade)

  @@index([workspaceId, timestamp])
  @@index([apiId, timestamp])
  @@index([endpointId, timestamp])
  @@index([timestamp]) // Para time-range queries
}

// Aggregated Metrics (hourly buckets)
model MetricsBucket {
  id              String    @id @default(cuid())

  // Dimensions
  workspaceId     String
  apiId           String
  endpointId      String?
  bucketTimestamp DateTime  // Início da hora (ex: 2025-01-01T15:00:00Z)

  // Metrics
  requestCount    Int       @default(0)
  errorCount      Int       @default(0)
  totalLatencyMs  BigInt    @default(0) // Sum para cálculo de avg
  minLatencyMs    Int?
  maxLatencyMs    Int?

  // Status Code Distribution
  status2xx       Int       @default(0)
  status3xx       Int       @default(0)
  status4xx       Int       @default(0)
  status5xx       Int       @default(0)

  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt

  @@unique([workspaceId, apiId, endpointId, bucketTimestamp])
  @@index([workspaceId, bucketTimestamp])
  @@index([apiId, bucketTimestamp])
}

// Alertas configurados
model Alert {
  id             String        @id @default(cuid())
  name           String
  description    String?

  workspace      Workspace     @relation(fields: [workspaceId], references: [id], onDelete: Cascade)
  workspaceId    String

  // Target
  apiId          String?       // null = all APIs
  endpointId     String?       // null = all endpoints

  // Condition
  metric         String        // 'error_rate', 'latency_p95', 'request_count'
  operator       String        // 'gt', 'lt', 'eq'
  threshold      Float
  timeWindowMin  Int           @default(5) // Janela de tempo em minutos

  // Actions
  channels       Json          // ['email', 'slack', 'webhook']
  webhookUrl     String?

  isActive       Boolean       @default(true)

  createdBy      User          @relation(fields: [userId], references: [id])
  userId         String

  createdAt      DateTime      @default(now())
  updatedAt      DateTime      @updatedAt

  @@index([workspaceId])
  @@index([apiId])
}
```

- [ ] Adicionar ao schema.prisma
- [ ] `pnpm prisma generate`
- [ ] `pnpm prisma migrate dev --name add-analytics-tables`

### TimescaleDB Extension (Opcional)

Se usar PostgreSQL com TimescaleDB para performance de time-series:

```sql
-- No migration SQL
CREATE EXTENSION IF NOT EXISTS timescaledb;

SELECT create_hypertable(
  'ApiRequestLog',
  'timestamp',
  chunk_time_interval => INTERVAL '1 day'
);
```

- [ ] Decidir se usar TimescaleDB ou PostgreSQL vanilla
- [ ] Documentar decisão

### Redis BullMQ Setup

- [ ] Configurar BullModule:

  ```typescript
  BullModule.forRoot({
    redis: {
      host: process.env.REDIS_HOST,
      port: parseInt(process.env.REDIS_PORT),
      password: process.env.REDIS_PASSWORD,
    },
  })
  ```

- [ ] Criar queues:
  - [ ] `aggregation-queue` - Agregação de métricas
  - [ ] `alerts-queue` - Verificação de alertas
  - [ ] `webhooks-queue` - Envio de webhooks

### Environment Variables

```env
ANALYTICS_PORT=3003
DATABASE_URL=postgresql://...
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# GeoIP (opcional)
GEOIP_API_KEY=

# Webhook retry config
WEBHOOK_MAX_RETRIES=3
WEBHOOK_RETRY_DELAY_MS=1000
```

- [ ] Criar `.env.example`

### PrismaModule Setup

- [ ] Criar `src/prisma/prisma.module.ts`
- [ ] Criar `src/prisma/prisma.service.ts`
- [ ] Lifecycle hooks

### Health Check

- [ ] Criar `src/health/health.controller.ts`
- [ ] Endpoint: `GET /health`
- [ ] Verificar:
  - [ ] Database connection
  - [ ] Redis connection
  - [ ] BullMQ queues status

### Logging

- [ ] Configurar Winston/Pino
- [ ] Structured logs (JSON)
- [ ] Correlation ID propagation
- [ ] Log níveis: debug, info, warn, error

### Docker

- [ ] Criar `Dockerfile`
- [ ] Adicionar em `docker-compose.yml`:
  ```yaml
  analytics:
    build: ./apps/analytics
    ports:
      - '3003:3003'
    env_file:
      - ./apps/analytics/.env
    depends_on:
      - postgres
      - redis
  ```

### Scripts package.json

```json
{
  "scripts": {
    "dev": "nest start --watch",
    "build": "nest build",
    "start": "node dist/main",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:cov": "jest --coverage",
    "lint": "eslint src --ext .ts",
    "prisma:generate": "prisma generate"
  }
}
```

### Event Listeners Setup

Registrar listener para eventos de outros serviços:

```typescript
// main.ts
async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.REDIS,
      options: {
        host: process.env.REDIS_HOST,
        port: parseInt(process.env.REDIS_PORT),
      },
    },
  )

  await app.listen()

  // Também iniciar HTTP server
  const httpApp = await NestFactory.create(AppModule)
  await httpApp.listen(3003)
}
```

### Validação

- [ ] `pnpm install` sem erros
- [ ] `pnpm dev` inicia na porta 3003
- [ ] `GET /health` retorna 200
- [ ] BullMQ dashboard acessível (opcional)
- [ ] `pnpm build` compila
- [ ] `pnpm lint` sem warnings
- [ ] `pnpm test` roda

### Documentação

- [ ] README.md do analytics:
  - [ ] Responsabilidades
  - [ ] Arquitetura de time-series
  - [ ] Como rodar localmente
  - [ ] Jobs de agregação
  - [ ] Environment variables

## Próximo Passo

→ [02-event-ingestion.md](./02-event-ingestion.md) - Ingestão de eventos de API requests
