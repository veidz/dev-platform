# Analytics Service - Alertas e Webhooks

## Contexto

Sistema de alertas que monitora métricas e dispara notificações (email, Slack, webhooks) quando thresholds são atingidos.

## Dependências

- 04-metrics-api.md completo
- Prisma model: Alert
- BullMQ queue para webhooks

## Checkboxes

### Pesquisa

- [ ] Estudar padrões de alerting systems
- [ ] Revisar retry strategies para webhooks
- [ ] Analisar bibliotecas de email (Nodemailer, Resend)

### Alerts Module

- [ ] Criar `src/modules/alerts/alerts.module.ts`
- [ ] Criar `src/modules/alerts/alerts.service.ts`
- [ ] Criar `src/modules/alerts/alerts.controller.ts`
- [ ] Criar `src/jobs/alerts.processor.ts`
- [ ] Registrar no app.module.ts

### Webhooks Module

- [ ] Criar `src/modules/webhooks/webhooks.module.ts`
- [ ] Criar `src/modules/webhooks/webhooks.service.ts`
- [ ] Criar `src/jobs/webhooks.processor.ts`

### Dependencies

```bash
pnpm add nodemailer
pnpm add @nestjs/axios axios
pnpm add -D @types/nodemailer
```

### Alert DTOs

```typescript
// dto/create-alert.dto.ts
export class CreateAlertDto {
  @IsString()
  name: string

  @IsOptional()
  @IsString()
  description?: string

  @IsString()
  workspaceId: string

  @IsOptional()
  @IsString()
  apiId?: string

  @IsOptional()
  @IsString()
  endpointId?: string

  @IsEnum(["error_rate", "latency_p95", "request_count", "latency_avg"])
  metric: "error_rate" | "latency_p95" | "request_count" | "latency_avg"

  @IsEnum(["gt", "lt", "gte", "lte", "eq"])
  operator: "gt" | "lt" | "gte" | "lte" | "eq"

  @IsNumber()
  threshold: number

  @IsNumber()
  @Min(1)
  @Max(60)
  timeWindowMin: number

  @IsArray()
  @IsEnum(["email", "slack", "webhook"], { each: true })
  channels: ("email" | "slack" | "webhook")[]

  @IsOptional()
  @IsUrl()
  webhookUrl?: string

  @IsOptional()
  @IsEmail()
  email?: string

  @IsOptional()
  @IsUrl()
  slackWebhook?: string
}

export class UpdateAlertDto extends PartialType(CreateAlertDto) {}
```

### Alerts Service - CRUD

```typescript
@Injectable()
export class AlertsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: CreateAlertDto): Promise<Alert> {
    // Validar que workspace existe e user tem acesso
    await this.validateWorkspaceAccess(userId, dto.workspaceId)

    return this.prisma.alert.create({
      data: {
        ...dto,
        userId,
      },
    })
  }

  async findAll(workspaceId: string): Promise<Alert[]> {
    return this.prisma.alert.findMany({
      where: { workspaceId },
      orderBy: { createdAt: "desc" },
    })
  }

  async findOne(id: string): Promise<Alert> {
    const alert = await this.prisma.alert.findUnique({ where: { id } })
    if (!alert) throw new NotFoundException("Alert not found")
    return alert
  }

  async update(id: string, dto: UpdateAlertDto): Promise<Alert> {
    return this.prisma.alert.update({
      where: { id },
      data: dto,
    })
  }

  async delete(id: string): Promise<void> {
    await this.prisma.alert.delete({ where: { id } })
  }

  async toggleActive(id: string): Promise<Alert> {
    const alert = await this.findOne(id)
    return this.prisma.alert.update({
      where: { id },
      data: { isActive: !alert.isActive },
    })
  }
}
```

### Alert Evaluation Logic

```typescript
async evaluateAlert(alert: Alert): Promise<boolean> {
  const now = new Date();
  const startTime = subMinutes(now, alert.timeWindowMin);

  // Buscar metrics buckets da janela de tempo
  const buckets = await this.prisma.metricsBucket.findMany({
    where: {
      workspaceId: alert.workspaceId,
      ...(alert.apiId && { apiId: alert.apiId }),
      ...(alert.endpointId && { endpointId: alert.endpointId }),
      bucketTimestamp: {
        gte: startTime,
        lte: now
      }
    }
  });

  if (buckets.length === 0) return false;

  // Calcular métrica atual
  const currentValue = this.calculateMetricValue(alert.metric, buckets);

  // Avaliar condição
  return this.evaluateCondition(currentValue, alert.operator, alert.threshold);
}

private calculateMetricValue(metric: string, buckets: MetricsBucket[]): number {
  const totalRequests = sum(buckets.map(b => b.requestCount));
  const totalErrors = sum(buckets.map(b => b.errorCount));
  const totalLatency = sum(buckets.map(b => Number(b.totalLatencyMs)));

  switch (metric) {
    case 'error_rate':
      return totalRequests > 0 ? (totalErrors / totalRequests) * 100 : 0;

    case 'latency_avg':
      return totalRequests > 0 ? totalLatency / totalRequests : 0;

    case 'latency_p95':
      // Usar maxLatencyMs dos buckets como aproximação
      const latencies = buckets.map(b => b.maxLatencyMs).sort((a, b) => a - b);
      const p95Index = Math.floor(latencies.length * 0.95);
      return latencies[p95Index] || 0;

    case 'request_count':
      return totalRequests;

    default:
      return 0;
  }
}

private evaluateCondition(value: number, operator: string, threshold: number): boolean {
  switch (operator) {
    case 'gt': return value > threshold;
    case 'lt': return value < threshold;
    case 'gte': return value >= threshold;
    case 'lte': return value <= threshold;
    case 'eq': return value === threshold;
    default: return false;
  }
}
```

### Alert Checker Job

```typescript
// jobs/alerts.processor.ts
@Processor('alerts')
export class AlertsProcessor {
  constructor(
    private alertsService: AlertsService,
    private notificationsService: NotificationsService
  ) {}

  @Process('check-alerts')
  async checkAlerts() {
    const activeAlerts = await this.prisma.alert.findMany({
      where: { isActive: true }
    });

    for (const alert of activeAlerts) {
      const triggered = await this.alertsService.evaluateAlert(alert);

      if (triggered) {
        await this.notificationsService.sendNotification(alert);
      }
    }
  }
}

// Agendar verificação a cada 5 minutos
@Cron('*/5 * * * *')
async scheduleAlertChecks() {
  await this.alertsQueue.add('check-alerts', {});
}
```

### Notifications Service

```typescript
@Injectable()
export class NotificationsService {
  constructor(
    private webhooksService: WebhooksService,
    private emailService: EmailService,
    private slackService: SlackService
  ) {}

  async sendNotification(alert: Alert): Promise<void> {
    const message = this.buildAlertMessage(alert)

    // Enviar para todos channels configurados
    await Promise.allSettled([
      ...(alert.channels.includes("email")
        ? [this.emailService.sendAlert(alert, message)]
        : []),

      ...(alert.channels.includes("slack")
        ? [this.slackService.sendAlert(alert, message)]
        : []),

      ...(alert.channels.includes("webhook")
        ? [this.webhooksService.trigger(alert, message)]
        : []),
    ])
  }

  private buildAlertMessage(alert: Alert): string {
    return `🚨 Alert: ${alert.name}
    
Metric: ${alert.metric}
Condition: ${alert.operator} ${alert.threshold}
Time Window: ${alert.timeWindowMin} minutes

Description: ${alert.description || "N/A"}

View details: https://platform.com/analytics`
  }
}
```

### Webhooks Service

```typescript
@Injectable()
export class WebhooksService {
  constructor(
    @InjectQueue("webhooks") private webhooksQueue: Queue,
    private httpService: HttpService
  ) {}

  async trigger(alert: Alert, message: string): Promise<void> {
    if (!alert.webhookUrl) return

    // Adicionar à fila para retry automático
    await this.webhooksQueue.add(
      "send",
      {
        url: alert.webhookUrl,
        payload: {
          alertId: alert.id,
          alertName: alert.name,
          message,
          timestamp: new Date().toISOString(),
        },
      },
      {
        attempts: 3,
        backoff: {
          type: "exponential",
          delay: 2000,
        },
      }
    )
  }
}

// Processor
@Processor("webhooks")
export class WebhooksProcessor {
  @Process("send")
  async sendWebhook(job: Job<{ url: string; payload: any }>) {
    const { url, payload } = job.data

    try {
      const response = await this.httpService
        .post(url, payload, {
          timeout: 10000,
          headers: {
            "Content-Type": "application/json",
            "User-Agent": "DevPlatform-Webhooks/1.0",
          },
        })
        .toPromise()

      if (response.status >= 200 && response.status < 300) {
        this.logger.log(`Webhook sent successfully to ${url}`)
        return { success: true }
      } else {
        throw new Error(`Webhook returned status ${response.status}`)
      }
    } catch (error) {
      this.logger.error(`Webhook failed: ${url}`, error)
      throw error // Trigger retry
    }
  }
}
```

### Email Service

```typescript
@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter

  constructor(private config: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: config.get("SMTP_HOST"),
      port: config.get("SMTP_PORT"),
      auth: {
        user: config.get("SMTP_USER"),
        pass: config.get("SMTP_PASS"),
      },
    })
  }

  async sendAlert(alert: Alert, message: string): Promise<void> {
    if (!alert.email) return

    await this.transporter.sendMail({
      from: '"DevPlatform Alerts" <alerts@devplatform.com>',
      to: alert.email,
      subject: `🚨 Alert: ${alert.name}`,
      text: message,
      html: this.buildHtmlEmail(alert, message),
    })
  }

  private buildHtmlEmail(alert: Alert, message: string): string {
    return `
      <h2>🚨 Alert Triggered</h2>
      <p><strong>${alert.name}</strong></p>
      <pre>${message}</pre>
      <a href="https://platform.com/analytics">View Dashboard</a>
    `
  }
}
```

### Slack Service

```typescript
@Injectable()
export class SlackService {
  constructor(private httpService: HttpService) {}

  async sendAlert(alert: Alert, message: string): Promise<void> {
    if (!alert.slackWebhook) return

    const payload = {
      text: message,
      blocks: [
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: `*🚨 ${alert.name}*\n\n${message}`,
          },
        },
        {
          type: "actions",
          elements: [
            {
              type: "button",
              text: { type: "plain_text", text: "View Dashboard" },
              url: "https://platform.com/analytics",
            },
          ],
        },
      ],
    }

    await this.httpService.post(alert.slackWebhook, payload).toPromise()
  }
}
```

### Alert History (Opcional)

```prisma
model AlertHistory {
  id          String   @id @default(cuid())
  alert       Alert    @relation(fields: [alertId], references: [id], onDelete: Cascade)
  alertId     String

  triggeredAt DateTime @default(now())
  metricValue Float
  message     String
  channels    Json     // Quais channels foram notificados

  @@index([alertId, triggeredAt])
}
```

- [ ] Adicionar ao schema
- [ ] Salvar histórico quando alert dispara
- [ ] Endpoint para listar histórico: `GET /alerts/:id/history`

### Alert Controller

```typescript
@Controller("alerts")
@UseGuards(JwtAuthGuard)
export class AlertsController {
  @Post()
  create(@CurrentUser() user, @Body() dto: CreateAlertDto) {
    return this.alertsService.create(user.id, dto)
  }

  @Get()
  findAll(@Query("workspaceId") workspaceId: string) {
    return this.alertsService.findAll(workspaceId)
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.alertsService.findOne(id)
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() dto: UpdateAlertDto) {
    return this.alertsService.update(id, dto)
  }

  @Delete(":id")
  delete(@Param("id") id: string) {
    return this.alertsService.delete(id)
  }

  @Patch(":id/toggle")
  toggleActive(@Param("id") id: string) {
    return this.alertsService.toggleActive(id)
  }

  @Post(":id/test")
  async testAlert(@Param("id") id: string) {
    const alert = await this.alertsService.findOne(id)
    await this.notificationsService.sendNotification(alert)
    return { success: true, message: "Test notification sent" }
  }
}
```

### Rate Limiting (Anti-Spam)

```typescript
// Não enviar mesmo alerta mais que 1x a cada 15 minutos
private alertCooldowns = new Map<string, Date>();

async sendNotification(alert: Alert): Promise<void> {
  const cooldownKey = alert.id;
  const lastSent = this.alertCooldowns.get(cooldownKey);

  if (lastSent && differenceInMinutes(new Date(), lastSent) < 15) {
    this.logger.log(`Alert ${alert.id} is in cooldown, skipping`);
    return;
  }

  // Enviar notificação...

  this.alertCooldowns.set(cooldownKey, new Date());
}
```

### Testes Unitários

- [ ] `tests/unit/alerts/alerts.service.spec.ts`
- [ ] Test create/update/delete
- [ ] Test evaluateAlert:
  - [ ] error_rate > threshold → triggered
  - [ ] latency_avg < threshold → not triggered
- [ ] Test evaluateCondition (gt, lt, eq, etc)
- [ ] Mock Prisma

### Testes Integração

- [ ] `tests/integration/alerts/alerts.spec.ts`
- [ ] POST /alerts - criar alert
- [ ] GET /alerts?workspaceId=X
- [ ] PATCH /alerts/:id/toggle
- [ ] POST /alerts/:id/test - enviar notificação teste
- [ ] Verificar webhook enviado (mock HTTP server)
- [ ] Verificar email enviado (mock SMTP)

### Documentação

- [ ] README explicando:
  - [ ] Como configurar alertas
  - [ ] Métricas disponíveis
  - [ ] Operadores suportados
  - [ ] Exemplos de alertas comuns
  - [ ] Como testar webhooks

### Environment Variables

```env
# Email (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=alerts@devplatform.com
SMTP_PASS=

# Slack (optional)
SLACK_DEFAULT_WEBHOOK=

# Webhooks
WEBHOOK_TIMEOUT_MS=10000
WEBHOOK_MAX_RETRIES=3
```

### Validação

- [ ] Criar alert com sucesso ✅
- [ ] Alert dispara quando condição atendida ✅
- [ ] Webhook enviado com retry ✅
- [ ] Email enviado ✅
- [ ] Slack notificado ✅
- [ ] Cooldown previne spam ✅
- [ ] Test endpoint funciona ✅
- [ ] `pnpm test` 100% coverage ✅

## Próximo Passo

✅ **Analytics Service Completo!**

→ [05-ai-service/01-setup.md](../05-ai-service/01-setup.md) - AI Service
