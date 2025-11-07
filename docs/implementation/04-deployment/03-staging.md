# Deployment - Staging Environment

## Contexto

Ambiente de staging para testes antes de produção, com smoke tests automatizados.

## Dependências

- 01-ci-cd.md completo (GitHub Actions configurado)
- 02-docker.md completo (Dockerfiles prontos)
- Railway e Vercel accounts configurados

## Checkboxes

### Pesquisa

- [ ] Revisar Railway environments
- [ ] Estudar Vercel preview deployments
- [ ] Analisar estratégias de smoke testing

### Railway - Staging Setup

**Criar projetos no Railway:**

- [ ] Criar projeto `dev-platform-staging`
- [ ] Adicionar services:
  - [ ] PostgreSQL (plugin)
  - [ ] Redis (plugin)
  - [ ] api-gateway
  - [ ] api-management
  - [ ] mock-server
  - [ ] analytics
  - [ ] ai-service

**Configurar variáveis de ambiente:**

Para cada service no Railway:

```bash
# Database
DATABASE_URL=${{Postgres.DATABASE_URL}}
REDIS_URL=${{Redis.REDIS_URL}}

# API Gateway específico
JWT_SECRET=staging-jwt-secret-change-in-prod
JWT_EXPIRES_IN=7d
CORS_ORIGINS=https://staging.devplatform.app

# AI Service específico
OPENAI_API_KEY=sk-...
QDRANT_URL=https://qdrant-staging.railway.app
QDRANT_COLLECTION=staging_documentation

# Sentry (opcional)
SENTRY_DSN=https://...@sentry.io/...
SENTRY_ENVIRONMENT=staging
```

- [ ] Configurar env vars para api-gateway
- [ ] Configurar env vars para api-management
- [ ] Configurar env vars para mock-server
- [ ] Configurar env vars para analytics
- [ ] Configurar env vars para ai-service

**Domains no Railway:**

- [ ] api-gateway: `api-staging.devplatform.app`
- [ ] api-management: `management-staging.devplatform.app`
- [ ] mock-server: `mock-staging.devplatform.app`
- [ ] analytics: `analytics-staging.devplatform.app`
- [ ] ai-service: `ai-staging.devplatform.app`

### Vercel - Staging Setup

**Configurar preview deployments:**

```json
// vercel.json
{
  "git": {
    "deploymentEnabled": {
      "main": true,
      "develop": true
    }
  },
  "env": {
    "NEXT_PUBLIC_API_URL": "https://api-staging.devplatform.app",
    "NEXT_PUBLIC_ENVIRONMENT": "staging"
  },
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Robots-Tag",
          "value": "noindex"
        }
      ]
    }
  ]
}
```

- [ ] Criar `vercel.json` no app web
- [ ] Configurar env vars no Vercel dashboard
- [ ] Testar preview deployment no PR

### Database Migrations - Staging

**Script de migration:**

```bash
#!/bin/bash
# scripts/migrate-staging.sh

set -e

echo "🔄 Running migrations on staging..."

# Set staging database URL
export DATABASE_URL=$STAGING_DATABASE_URL

# Run migrations
pnpm prisma migrate deploy

# Seed initial data (opcional)
pnpm prisma db seed

echo "✅ Staging migrations complete!"
```

- [ ] Criar `scripts/migrate-staging.sh`
- [ ] Tornar executável: `chmod +x scripts/migrate-staging.sh`
- [ ] Testar localmente (dry-run)
- [ ] Executar no Railway via workflow

### Seed Data para Staging

**Script de seed:**

```typescript
// prisma/seed.staging.ts
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Criar usuário de teste
  const testUser = await prisma.user.create({
    data: {
      email: 'test@devplatform.com',
      name: 'Test User',
      passwordHash: await hash('Test123!'),
    },
  })

  // Criar workspace de teste
  const testWorkspace = await prisma.workspace.create({
    data: {
      name: 'Test Workspace',
      slug: 'test-workspace',
      ownerId: testUser.id,
    },
  })

  // Criar API de exemplo
  const testApi = await prisma.api.create({
    data: {
      name: 'Example API',
      slug: 'example-api',
      description: 'API de exemplo para testes',
      workspaceId: testWorkspace.id,
      createdById: testUser.id,
      endpoints: {
        create: [
          {
            method: 'GET',
            path: '/users',
            description: 'Lista todos usuários',
            responseSchema: {
              type: 'array',
              items: { type: 'object' },
            },
          },
          {
            method: 'POST',
            path: '/users',
            description: 'Cria novo usuário',
            requestSchema: {
              type: 'object',
              properties: {
                name: { type: 'string' },
                email: { type: 'string' },
              },
            },
          },
        ],
      },
    },
  })

  console.log('✅ Staging data seeded!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
```

- [ ] Criar `prisma/seed.staging.ts`
- [ ] Adicionar script no package.json: `"seed:staging": "tsx prisma/seed.staging.ts"`
- [ ] Executar após migrations

### Smoke Tests

**Script de smoke test:**

```typescript
// scripts/smoke-test.ts
import axios from 'axios'

const BASE_URL =
  process.env.STAGING_URL || 'https://api-staging.devplatform.app'

interface TestResult {
  name: string
  passed: boolean
  duration: number
  error?: string
}

const tests: TestResult[] = []

async function testHealthCheck() {
  const start = Date.now()
  try {
    const res = await axios.get(`${BASE_URL}/health`)
    tests.push({
      name: 'Health Check',
      passed: res.status === 200,
      duration: Date.now() - start,
    })
  } catch (error) {
    tests.push({
      name: 'Health Check',
      passed: false,
      duration: Date.now() - start,
      error: error.message,
    })
  }
}

async function testAuthentication() {
  const start = Date.now()
  try {
    // Login com usuário de teste
    const res = await axios.post(`${BASE_URL}/auth/login`, {
      email: 'test@devplatform.com',
      password: 'Test123!',
    })
    tests.push({
      name: 'Authentication',
      passed: res.status === 200 && !!res.data.token,
      duration: Date.now() - start,
    })
    return res.data.token
  } catch (error) {
    tests.push({
      name: 'Authentication',
      passed: false,
      duration: Date.now() - start,
      error: error.message,
    })
    return null
  }
}

async function testAPIList(token: string) {
  const start = Date.now()
  try {
    const res = await axios.get(`${BASE_URL}/apis`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    tests.push({
      name: 'List APIs',
      passed: res.status === 200 && Array.isArray(res.data),
      duration: Date.now() - start,
    })
  } catch (error) {
    tests.push({
      name: 'List APIs',
      passed: false,
      duration: Date.now() - start,
      error: error.message,
    })
  }
}

async function testMockServer() {
  const start = Date.now()
  try {
    const res = await axios.get(`${process.env.MOCK_SERVER_URL}/health`)
    tests.push({
      name: 'Mock Server',
      passed: res.status === 200,
      duration: Date.now() - start,
    })
  } catch (error) {
    tests.push({
      name: 'Mock Server',
      passed: false,
      duration: Date.now() - start,
      error: error.message,
    })
  }
}

async function runSmokeTests() {
  console.log('🔥 Running smoke tests on staging...\n')

  await testHealthCheck()
  const token = await testAuthentication()

  if (token) {
    await testAPIList(token)
  }

  await testMockServer()

  // Print results
  console.log('\n📊 Test Results:\n')
  tests.forEach((test) => {
    const icon = test.passed ? '✅' : '❌'
    console.log(`${icon} ${test.name} (${test.duration}ms)`)
    if (test.error) {
      console.log(`   Error: ${test.error}`)
    }
  })

  const passed = tests.filter((t) => t.passed).length
  const total = tests.length

  console.log(`\n${passed}/${total} tests passed`)

  if (passed !== total) {
    process.exit(1)
  }
}

runSmokeTests()
```

- [ ] Criar `scripts/smoke-test.ts`
- [ ] Instalar `axios`: `pnpm add -w axios`
- [ ] Adicionar script: `"smoke-test": "tsx scripts/smoke-test.ts"`

### GitHub Workflow - Staging Deploy + Smoke Tests

```yaml
name: Deploy Staging

on:
  push:
    branches: [develop]

jobs:
  deploy-and-test:
    runs-on: ubuntu-latest

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

      - name: Install Railway CLI
        run: npm install -g @railway/cli

      - name: Deploy Backend to Staging
        run: railway up --service=api-gateway --environment=staging
        env:
          RAILWAY_TOKEN: ${{ secrets.RAILWAY_TOKEN }}

      - name: Run Database Migrations
        run: pnpm migrate:staging
        env:
          DATABASE_URL: ${{ secrets.STAGING_DATABASE_URL }}

      - name: Wait for deployment
        run: sleep 30

      - name: Run Smoke Tests
        run: pnpm smoke-test
        env:
          STAGING_URL: https://api-staging.devplatform.app
          MOCK_SERVER_URL: https://mock-staging.devplatform.app

      - name: Notify on failure
        if: failure()
        uses: 8398a7/action-slack@v3
        with:
          status: ${{ job.status }}
          text: 'Staging deployment failed! 🚨'
          webhook_url: ${{ secrets.SLACK_WEBHOOK }}
```

- [ ] Criar `.github/workflows/deploy-staging.yml`
- [ ] Testar push na branch `develop`

### Rollback Strategy

**Script de rollback:**

```bash
#!/bin/bash
# scripts/rollback-staging.sh

set -e

echo "⚠️  Rolling back staging to previous deployment..."

# Railway rollback
railway rollback --service=api-gateway --environment=staging

echo "✅ Rollback complete!"
```

- [ ] Criar `scripts/rollback-staging.sh`
- [ ] Documentar processo de rollback manual
- [ ] Testar rollback em cenário de teste

### Monitoring Staging

- [ ] Configurar Sentry para staging
- [ ] Setup alertas de erro (Slack/email)
- [ ] Configurar uptime monitoring (UptimeRobot)
- [ ] Dashboard de métricas (opcional)

### Validação

- [ ] Deploy staging via push no `develop` funciona ✅
- [ ] Migrations rodam automaticamente ✅
- [ ] Seed data presente ✅
- [ ] Smoke tests passam ✅
- [ ] Rollback funciona ✅
- [ ] Monitoring ativo ✅

## Arquivos Criados

```
├── scripts/
│   ├── migrate-staging.sh
│   ├── smoke-test.ts
│   └── rollback-staging.sh
├── prisma/
│   └── seed.staging.ts
├── vercel.json
└── .github/workflows/
    └── deploy-staging.yml
```

## Recursos

- [Railway Environments](https://docs.railway.app/develop/environments)
- [Vercel Preview Deployments](https://vercel.com/docs/deployments/preview-deployments)
- [Smoke Testing Best Practices](https://martinfowler.com/bliki/SmokeTest.html)

## Próximo Passo

→ [04-production.md](./04-production.md) - Deploy final para produção
