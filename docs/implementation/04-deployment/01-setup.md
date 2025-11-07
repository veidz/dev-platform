# Deployment - CI/CD com GitHub Actions

## Contexto

Pipeline completo de CI/CD para garantir qualidade do código e deploy automatizado em staging/production.

## Dependências

- Phase 3 completa (todos microsserviços funcionando)
- Repositório GitHub configurado
- Secrets configurados no GitHub

## Checkboxes

### Pesquisa & Planejamento

- [ ] Revisar GitHub Actions docs
- [ ] Analisar workflows de monorepos (Turborepo + GitHub Actions)
- [ ] Estudar estratégias de deploy (Railway, Vercel)

### Secrets do Repositório

Configurar em GitHub Settings → Secrets:

- [ ] `DATABASE_URL` - Connection string PostgreSQL
- [ ] `REDIS_URL` - Connection string Redis
- [ ] `OPENAI_API_KEY` - API key da OpenAI
- [ ] `QDRANT_URL` - URL do Qdrant
- [ ] `RAILWAY_TOKEN` - Token do Railway (backend)
- [ ] `VERCEL_TOKEN` - Token do Vercel (frontend)
- [ ] `SENTRY_DSN` - Sentry para error tracking

### Workflow 1: CI (Testes e Lint)

Arquivo: `.github/workflows/ci.yml`

```yaml
name: CI

on:
  pull_request:
    branches: [main, develop]
  push:
    branches: [main, develop]

jobs:
  lint-and-test:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: "22"

      - name: Install pnpm
        uses: pnpm/action-setup@v3
        with:
          version: 10

      - name: Get pnpm store directory
        shell: bash
        run: |
          echo "STORE_PATH=$(pnpm store path --silent)" >> $GITHUB_ENV

      - name: Setup pnpm cache
        uses: actions/cache@v4
        with:
          path: ${{ env.STORE_PATH }}
          key: ${{ runner.os }}-pnpm-store-${{ hashFiles('**/pnpm-lock.yaml') }}
          restore-keys: |
            ${{ runner.os }}-pnpm-store-

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Lint
        run: pnpm lint

      - name: Type check
        run: pnpm type-check

      - name: Build packages
        run: pnpm build --filter=@dev-platform/shared --filter=@dev-platform/ui

      - name: Run tests
        run: pnpm test
        env:
          DATABASE_URL: postgresql://test:test@localhost:5432/test
          REDIS_URL: redis://localhost:6379

      - name: Upload coverage
        uses: codecov/codecov-action@v4
        with:
          file: ./coverage/lcov.info
          flags: unittests
```

- [ ] Criar arquivo `.github/workflows/ci.yml`
- [ ] Testar localmente com `act` (opcional)
- [ ] Fazer commit e verificar execução

### Workflow 2: Deploy Backend (Railway)

Arquivo: `.github/workflows/deploy-backend.yml`

```yaml
name: Deploy Backend

on:
  push:
    branches: [main]
    paths:
      - "apps/api-gateway/**"
      - "apps/api-management/**"
      - "apps/mock-server/**"
      - "apps/analytics/**"
      - "apps/ai-service/**"
      - "packages/shared/**"

jobs:
  deploy-services:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        service:
          - api-gateway
          - api-management
          - mock-server
          - analytics
          - ai-service

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: "22"

      - name: Install Railway CLI
        run: npm install -g @railway/cli

      - name: Deploy to Railway
        run: |
          cd apps/${{ matrix.service }}
          railway up --service=${{ matrix.service }}
        env:
          RAILWAY_TOKEN: ${{ secrets.RAILWAY_TOKEN }}

      - name: Verify deployment
        run: |
          sleep 10
          curl -f https://${{ matrix.service }}.railway.app/health || exit 1
```

- [ ] Criar arquivo `.github/workflows/deploy-backend.yml`
- [ ] Configurar projetos no Railway (1 por serviço)
- [ ] Vincular repositório ao Railway
- [ ] Testar deploy manual

### Workflow 3: Deploy Frontend (Vercel)

Arquivo: `.github/workflows/deploy-frontend.yml`

```yaml
name: Deploy Frontend

on:
  push:
    branches: [main]
    paths:
      - "apps/web/**"
      - "packages/ui/**"
      - "packages/shared/**"

jobs:
  deploy-web:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: "22"

      - name: Install Vercel CLI
        run: npm install -g vercel

      - name: Pull Vercel Environment
        run: vercel pull --yes --environment=production --token=${{ secrets.VERCEL_TOKEN }}

      - name: Build Project
        run: vercel build --prod --token=${{ secrets.VERCEL_TOKEN }}

      - name: Deploy to Vercel
        run: vercel deploy --prebuilt --prod --token=${{ secrets.VERCEL_TOKEN }}
```

- [ ] Criar arquivo `.github/workflows/deploy-frontend.yml`
- [ ] Vincular projeto Vercel ao repositório
- [ ] Configurar environment variables no Vercel
- [ ] Testar deploy

### Workflow 4: E2E Tests (Playwright)

Arquivo: `.github/workflows/e2e.yml`

```yaml
name: E2E Tests

on:
  schedule:
    - cron: "0 */6 * * *" # A cada 6 horas
  workflow_dispatch: # Manual trigger

jobs:
  e2e-tests:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: "22"

      - name: Install pnpm
        uses: pnpm/action-setup@v3
        with:
          version: 10

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Install Playwright
        run: pnpm --filter @dev-platform/web exec playwright install --with-deps

      - name: Run E2E tests
        run: pnpm --filter @dev-platform/web test:e2e
        env:
          BASE_URL: https://dev-platform.vercel.app

      - name: Upload test results
        uses: actions/upload-artifact@v4
        if: failure()
        with:
          name: playwright-report
          path: apps/web/playwright-report/
```

- [ ] Criar arquivo `.github/workflows/e2e.yml`
- [ ] Configurar Playwright no projeto web
- [ ] Testar execução local
- [ ] Verificar reports no GitHub Actions

### Workflow 5: Database Migrations

Arquivo: `.github/workflows/migrate.yml`

```yaml
name: Database Migration

on:
  workflow_dispatch:
    inputs:
      environment:
        description: "Environment to migrate"
        required: true
        type: choice
        options:
          - staging
          - production

jobs:
  migrate:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: "22"

      - name: Install pnpm
        uses: pnpm/action-setup@v3
        with:
          version: 10

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Run migrations
        run: pnpm prisma migrate deploy
        env:
          DATABASE_URL: ${{ secrets[format('DATABASE_URL_{0}', github.event.inputs.environment)] }}

      - name: Generate Prisma Client
        run: pnpm prisma generate
```

- [ ] Criar arquivo `.github/workflows/migrate.yml`
- [ ] Testar migration em staging
- [ ] Documentar processo de rollback

### Branch Protection Rules

Configurar no GitHub → Settings → Branches:

- [ ] Require pull request reviews (1 approval)
- [ ] Require status checks to pass:
  - [ ] lint-and-test
  - [ ] build
- [ ] Require branches to be up to date
- [ ] Include administrators
- [ ] Restrict who can push (protect main)

### Dependabot

Arquivo: `.github/dependabot.yml`

```yaml
version: 2
updates:
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "weekly"
    open-pull-requests-limit: 10
    groups:
      dev-dependencies:
        patterns:
          - "@types/*"
          - "eslint*"
          - "prettier"
      nestjs:
        patterns:
          - "@nestjs/*"
      react:
        patterns:
          - "react*"
          - "next"
```

- [ ] Criar `.github/dependabot.yml`
- [ ] Configurar auto-merge para patches (opcional)

### Monitoring & Alerts

- [ ] Configurar Sentry no frontend e backend
- [ ] Configurar alertas de falha no GitHub Actions
- [ ] Setup status page (opcional)

### Validação

- [ ] Pull request passa no CI ✅
- [ ] Deploy backend funciona ✅
- [ ] Deploy frontend funciona ✅
- [ ] E2E tests rodam ✅
- [ ] Migrations funcionam ✅
- [ ] Branch protection ativa ✅

## Arquivos Criados

```
.github/
├── workflows/
│   ├── ci.yml
│   ├── deploy-backend.yml
│   ├── deploy-frontend.yml
│   ├── e2e.yml
│   └── migrate.yml
└── dependabot.yml
```

## Recursos

- [GitHub Actions Docs](https://docs.github.com/actions)
- [Railway Docs](https://docs.railway.app)
- [Vercel Docs](https://vercel.com/docs)
- [Turborepo + GitHub Actions](https://turbo.build/repo/docs/ci/github-actions)

## Próximo Passo

→ [02-docker.md](./02-docker.md) - Dockerfiles e docker-compose
