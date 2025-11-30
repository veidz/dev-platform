# Deployment - Production

## Contexto

Deploy final para produção com monitoramento completo, backups e estratégia de zero-downtime.

## Dependências

- Todas as phases anteriores completas
- Staging testado e validado
- Domínio personalizado configurado (opcional)

## Checkboxes

### Pre-Production Checklist

**Validações obrigatórias antes de deploy:**

- [ ] Todos smoke tests passando em staging ✅
- [ ] Cobertura de testes >= 80% ✅
- [ ] Security audit completo ✅
- [ ] Performance benchmarks aceitáveis ✅
- [ ] Documentação atualizada ✅
- [ ] Secrets de produção configurados ✅
- [ ] Backup strategy definida ✅
- [ ] Monitoring configurado ✅
- [ ] Rollback plan documentado ✅
- [ ] Team aprovação (code review) ✅

### Railway - Production Setup

**Criar projeto production:**

- [ ] Criar projeto `dev-platform-production`
- [ ] Adicionar services (mesma estrutura do staging)
- [ ] Configurar PostgreSQL com backup automático
- [ ] Configurar Redis com persistência

**Configurar variáveis de produção:**

```bash
# Database (usar variáveis do Railway)
DATABASE_URL=${{Postgres.DATABASE_URL}}
REDIS_URL=${{Redis.REDIS_URL}}

# Security
JWT_SECRET=<strong-random-secret-256-bits>
JWT_EXPIRES_IN=7d
CORS_ORIGINS=https://app.devplatform.com,https://www.devplatform.com

# API Keys
OPENAI_API_KEY=<production-key>
QDRANT_URL=<production-qdrant-url>
QDRANT_API_KEY=<production-key>

# Monitoring
SENTRY_DSN=<production-dsn>
SENTRY_ENVIRONMENT=production

# Email (exemplo: SendGrid)
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASSWORD=<sendgrid-api-key>

# Rate Limiting
RATE_LIMIT_MAX=100
RATE_LIMIT_WINDOW_MS=60000
```

- [ ] Configurar env vars para todos services
- [ ] Validar secrets não estão no código
- [ ] Usar Railway secrets para dados sensíveis

**Custom Domains:**

- [ ] api-gateway: `api.devplatform.com`
- [ ] mock-server: `mock.devplatform.com`
- [ ] analytics: `analytics.devplatform.com`
- [ ] ai-service: `ai.devplatform.com`

- [ ] Configurar DNS records (CNAME)
- [ ] Configurar SSL certificates (auto via Railway)
- [ ] Testar domínios

### Vercel - Production Setup

**Configurar production deployment:**

```json
// vercel.json (production)
{
  "git": {
    "deploymentEnabled": {
      "main": true
    }
  },
  "env": {
    "NEXT_PUBLIC_API_URL": "https://api.devplatform.com",
    "NEXT_PUBLIC_ENVIRONMENT": "production",
    "NEXT_PUBLIC_SENTRY_DSN": "@sentry-dsn"
  },
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        },
        {
          "key": "Strict-Transport-Security",
          "value": "max-age=31536000; includeSubDomains"
        }
      ]
    }
  ],
  "redirects": [
    {
      "source": "/",
      "has": [{ "type": "host", "value": "www.devplatform.com" }],
      "destination": "https://app.devplatform.com",
      "permanent": true
    }
  ]
}
```

- [ ] Atualizar `vercel.json` para production
- [ ] Configurar custom domain: `app.devplatform.com`
- [ ] Configurar redirects (www → app)
- [ ] Testar SSL e headers de segurança

### Database Migrations - Production

**Workflow protegido:**

```yaml
name: Production Migration

on:
  workflow_dispatch:
    inputs:
      confirm:
        description: 'Type "MIGRATE PRODUCTION" to confirm'
        required: true

jobs:
  migrate:
    runs-on: ubuntu-latest
    if: github.event.inputs.confirm == 'MIGRATE PRODUCTION'

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '22'

      - name: Install pnpm
        uses: pnpm/action-setup@v3
        with:
          version: 10

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Backup database
        run: |
          pg_dump $PROD_DATABASE_URL > backup-$(date +%Y%m%d-%H%M%S).sql
        env:
          PROD_DATABASE_URL: ${{ secrets.PROD_DATABASE_URL }}

      - name: Run migrations
        run: pnpm prisma migrate deploy
        env:
          DATABASE_URL: ${{ secrets.PROD_DATABASE_URL }}

      - name: Notify team
        uses: 8398a7/action-slack@v3
        with:
          status: ${{ job.status }}
          text: 'Production migration completed ✅'
          webhook_url: ${{ secrets.SLACK_WEBHOOK }}
```

- [ ] Criar `.github/workflows/prod-migration.yml`
- [ ] Testar dry-run
- [ ] Documentar rollback de migrations

### Production Deploy Workflow

```yaml
name: Deploy Production

on:
  push:
    branches: [main]
    paths:
      - 'apps/**'
      - 'packages/**'

jobs:
  pre-deploy-checks:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Run tests
        run: pnpm test

      - name: Security audit
        run: pnpm audit --production

      - name: Check test coverage
        run: |
          COVERAGE=$(pnpm test:cov | grep 'Statements' | awk '{print $3}' | sed 's/%//')
          if [ "$COVERAGE" -lt 80 ]; then
            echo "Coverage $COVERAGE% is below 80%"
            exit 1
          fi

  deploy-backend:
    needs: pre-deploy-checks
    runs-on: ubuntu-latest
    strategy:
      matrix:
        service:
          [api-gateway, api-management, mock-server, analytics, ai-service]
      max-parallel: 1 # Deploy um por vez

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Deploy ${{ matrix.service }}
        run: railway up --service=${{ matrix.service }} --environment=production
        env:
          RAILWAY_TOKEN: ${{ secrets.RAILWAY_TOKEN }}

      - name: Wait for deployment
        run: sleep 30

      - name: Health check
        run: |
          curl -f https://${{ matrix.service }}.railway.app/health || exit 1

      - name: Rollback on failure
        if: failure()
        run: railway rollback --service=${{ matrix.service }}

  deploy-frontend:
    needs: deploy-backend
    runs-on: ubuntu-latest

    steps:
      - name: Deploy to Vercel
        run: vercel deploy --prod --token=${{ secrets.VERCEL_TOKEN }}

      - name: Smoke test production
        run: pnpm smoke-test
        env:
          BASE_URL: https://app.devplatform.com

  notify:
    needs: [deploy-backend, deploy-frontend]
    runs-on: ubuntu-latest
    if: always()

    steps:
      - name: Notify team
        uses: 8398a7/action-slack@v3
        with:
          status: ${{ job.status }}
          text: '🚀 Production deployment ${{ job.status }}'
          webhook_url: ${{ secrets.SLACK_WEBHOOK }}
```

- [ ] Criar `.github/workflows/deploy-production.yml`
- [ ] Configurar Slack webhook
- [ ] Testar deploy (commit direto ou merge manual para main)

### Backup Strategy

**Automated backups:**

```bash
#!/bin/bash
# scripts/backup-production.sh

set -e

BACKUP_DIR="/backups/$(date +%Y%m%d)"
mkdir -p $BACKUP_DIR

# Backup PostgreSQL
echo "📦 Backing up database..."
pg_dump $PROD_DATABASE_URL > $BACKUP_DIR/postgres-$(date +%H%M%S).sql

# Backup Redis (RDB snapshot)
echo "📦 Backing up Redis..."
redis-cli --rdb $BACKUP_DIR/redis-$(date +%H%M%S).rdb

# Upload to S3 (opcional)
if [ ! -z "$AWS_S3_BUCKET" ]; then
  aws s3 sync $BACKUP_DIR s3://$AWS_S3_BUCKET/backups/$(date +%Y%m%d)/
fi

# Keep only last 30 days
find /backups -type d -mtime +30 -exec rm -rf {} +

echo "✅ Backup complete!"
```

- [ ] Criar `scripts/backup-production.sh`
- [ ] Configurar cron job (diário às 3am)
- [ ] Testar restore de backup

**Railway automatic backups:**

- [ ] Habilitar backups automáticos no PostgreSQL plugin
- [ ] Configurar retention (7 dias)
- [ ] Testar restore

### Monitoring & Observability

**Sentry - Error Tracking:**

```typescript
// apps/api-gateway/src/main.ts
import * as Sentry from '@sentry/node'

if (process.env.NODE_ENV === 'production') {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.SENTRY_ENVIRONMENT,
    tracesSampleRate: 0.1, // 10% das transactions
  })
}
```

- [ ] Instalar `@sentry/node` em todos serviços
- [ ] Configurar Sentry no main.ts
- [ ] Configurar source maps upload
- [ ] Testar error capture

**Uptime Monitoring:**

- [ ] Configurar UptimeRobot para todos endpoints
- [ ] Alertas via email/Slack se down > 2min
- [ ] Status page público (optional)

**Logs Centralizados:**

- [ ] Configurar Railway logs streaming
- [ ] Setup log aggregation (Datadog/Logtail)
- [ ] Definir log retention (30 dias)

**Metrics Dashboard:**

- [ ] Configurar Grafana Cloud (free tier)
- [ ] Importar métricas do Railway
- [ ] Dashboards: requests/s, latency, errors
- [ ] Alertas: error rate > 5%, latency p95 > 1s

### Performance Optimization

**CDN Setup (Vercel):**

- [ ] Vercel CDN configurado automaticamente
- [ ] Verificar cache headers
- [ ] Testar edge caching

**Database Optimization:**

- [ ] Criar índices em queries lentos
- [ ] Configurar connection pooling
- [ ] Enable query caching no Prisma

**Redis Optimization:**

- [ ] Configurar eviction policy (allkeys-lru)
- [ ] Set memory limit apropriado
- [ ] Monitor hit rate (target > 80%)

### Security Hardening

**Rate Limiting:**

- [ ] Configurar rate limits por IP
- [ ] Configurar rate limits por user
- [ ] Implementar CAPTCHA para signup/login

**CORS:**

- [ ] Configurar origins específicos (não usar \*)
- [ ] Verificar credentials handling
- [ ] Testar CORS em produção

**Secrets Management:**

- [ ] Rotacionar JWT secret
- [ ] Rotacionar database password
- [ ] Rotacionar API keys

**Security Headers:**

- [ ] X-Content-Type-Options: nosniff
- [ ] X-Frame-Options: DENY
- [ ] Strict-Transport-Security (HSTS)
- [ ] Content-Security-Policy

### Incident Response Plan

**Runbook:**

````markdown
# Incident Response Runbook

## 1. Identify Issue

- Check Sentry for errors
- Check uptime monitoring alerts
- Check user reports

## 2. Assess Severity

- P0: Service completely down
- P1: Critical feature broken
- P2: Non-critical feature broken
- P3: Minor issue

## 3. Immediate Actions (P0/P1)

- Notify team via Slack
- Check recent deployments (rollback if needed)
- Check logs for errors
- Scale up resources if needed

## 4. Rollback Procedure

```bash
# Backend rollback
railway rollback --service=api-gateway --environment=production

# Frontend rollback
vercel rollback --token=$VERCEL_TOKEN
```
````

## 5. Post-Mortem

- Root cause analysis
- Action items to prevent recurrence
- Update monitoring/alerts

````

- [ ] Criar documento de incident response
- [ ] Treinar team no processo
- [ ] Definir on-call rotation

### Post-Deploy Validation

**Smoke Tests Production:**

```typescript
// Executar após cada deploy
const tests = [
  { name: 'Health Check', url: '/health' },
  { name: 'Auth Login', url: '/auth/login', method: 'POST' },
  { name: 'List APIs', url: '/apis', auth: true },
  { name: 'Mock Server', url: 'https://mock.devplatform.com/health' },
  { name: 'AI Service', url: 'https://ai.devplatform.com/health' },
];

// Rodar automaticamente após deploy
````

- [ ] Executar smoke tests após deploy
- [ ] Verificar métricas (latency, error rate)
- [ ] Monitorar por 15 minutos
- [ ] Confirmar rollout completo

### Documentation

**Production Runbook:**

- [ ] Documentar URLs de produção
- [ ] Documentar credenciais de acesso
- [ ] Documentar procedimentos de deploy
- [ ] Documentar troubleshooting comum
- [ ] Documentar contatos de emergência

**User Documentation:**

- [ ] Atualizar docs com URL de produção
- [ ] Criar guia de getting started
- [ ] Criar FAQs
- [ ] Vídeos de tutorial (opcional)

### Validação Final

- [ ] Deploy production sem erros ✅
- [ ] Todos services healthy ✅
- [ ] Custom domains funcionando ✅
- [ ] SSL válido ✅
- [ ] Smoke tests passando ✅
- [ ] Monitoring ativo ✅
- [ ] Backups automáticos ✅
- [ ] Error tracking funcionando ✅
- [ ] Performance aceitável ✅
- [ ] Security headers corretos ✅

## 🎉 Produção Completa!

**URLs Finais:**

- Frontend: https://app.devplatform.com
- API: https://api.devplatform.com
- Mock: https://mock.devplatform.com
- Status: https://status.devplatform.com (opcional)

## Recursos

- [Railway Production Best Practices](https://docs.railway.app/deploy/deployments)
- [Vercel Production Checklist](https://vercel.com/docs/production-checklist)
- [PostgreSQL Backup Strategies](https://www.postgresql.org/docs/current/backup.html)
- [Sentry Node.js Guide](https://docs.sentry.io/platforms/node/)

---

## 🏆 Roadmap Completo!
