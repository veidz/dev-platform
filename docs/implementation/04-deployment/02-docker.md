# Deployment - Docker & Docker Compose

## Contexto

Containerização de todos os serviços para desenvolvimento local e deploy consistente.

## Dependências

- Phase 3 completa
- Docker e Docker Compose instalados
- Conhecimento básico de Docker

## Checkboxes

### Pesquisa

- [ ] Revisar Docker multi-stage builds
- [ ] Estudar Docker networking para monorepos
- [ ] Analisar otimização de image size

### Root Dockerfile (Multi-stage)

Arquivo: `Dockerfile` (raiz do projeto)

```dockerfile
# syntax=docker/dockerfile:1

# Stage 1: Base com Node e pnpm
FROM node:22-alpine AS base
RUN apk add --no-cache libc6-compat
RUN corepack enable && corepack prepare pnpm@10 --activate
WORKDIR /app

# Stage 2: Dependencies
FROM base AS deps
COPY pnpm-lock.yaml ./
RUN pnpm fetch

# Stage 3: Builder
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build shared packages primeiro
RUN pnpm --filter @dev-platform/shared build
RUN pnpm --filter @dev-platform/ui build

# Pruning para reduzir tamanho
RUN pnpm prune --prod

# Stage 4: Runner (generic)
FROM base AS runner
ENV NODE_ENV=production
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nodejs
USER nodejs
WORKDIR /app

# Copiar apenas o necessário
COPY --from=builder --chown=nodejs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nodejs:nodejs /app/packages ./packages
```

- [ ] Criar `Dockerfile` na raiz

### Dockerfile por Serviço

**apps/api-gateway/Dockerfile:**

```dockerfile
FROM node:22-alpine AS base
RUN corepack enable && corepack prepare pnpm@10 --activate
WORKDIR /app

FROM base AS deps
COPY pnpm-lock.yaml ./
RUN pnpm fetch

FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN pnpm --filter @dev-platform/shared build
RUN pnpm --filter api-gateway build

FROM base AS runner
ENV NODE_ENV=production
RUN addgroup --system --gid 1001 nestjs
RUN adduser --system --uid 1001 nestjs
USER nestjs

COPY --from=builder --chown=nestjs:nestjs /app/packages ./packages
COPY --from=builder --chown=nestjs:nestjs /app/apps/api-gateway/dist ./dist
COPY --from=builder --chown=nestjs:nestjs /app/apps/api-gateway/node_modules ./node_modules
COPY --from=builder --chown=nestjs:nestjs /app/apps/api-gateway/package.json ./

EXPOSE 3000

CMD ["node", "dist/main.js"]
```

- [ ] Criar `apps/api-gateway/Dockerfile`
- [ ] Criar `apps/api-management/Dockerfile` (similar)
- [ ] Criar `apps/mock-server/Dockerfile` (similar)
- [ ] Criar `apps/analytics/Dockerfile` (similar)
- [ ] Criar `apps/ai-service/Dockerfile` (similar)

### Dockerfile Frontend (Next.js)

**apps/web/Dockerfile:**

```dockerfile
FROM node:22-alpine AS base
RUN corepack enable && corepack prepare pnpm@10 --activate

FROM base AS deps
WORKDIR /app
COPY pnpm-lock.yaml ./
RUN pnpm fetch

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build shared packages
RUN pnpm --filter @dev-platform/shared build
RUN pnpm --filter @dev-platform/ui build

# Build Next.js
RUN pnpm --filter web build

FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy public assets
COPY --from=builder /app/apps/web/public ./public

# Copy standalone build
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/static ./apps/web/.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "apps/web/server.js"]
```

- [ ] Criar `apps/web/Dockerfile`
- [ ] Adicionar `output: 'standalone'` no `next.config.ts`

### Docker Compose - Development

Arquivo: `docker-compose.dev.yml`

```yaml
version: "3.9"

services:
  postgres:
    image: postgres:16-alpine
    container_name: dev-platform-postgres
    restart: unless-stopped
    ports:
      - "5432:5432"
    environment:
      POSTGRES_USER: devplatform
      POSTGRES_PASSWORD: dev123
      POSTGRES_DB: devplatform
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U devplatform"]
      interval: 10s
      timeout: 5s
      retries: 5

  redis:
    image: redis:7-alpine
    container_name: dev-platform-redis
    restart: unless-stopped
    ports:
      - "6379:6379"
    command: redis-server --appendonly yes
    volumes:
      - redis_data:/data
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5

  qdrant:
    image: qdrant/qdrant:latest
    container_name: dev-platform-qdrant
    restart: unless-stopped
    ports:
      - "6333:6333"
    volumes:
      - qdrant_data:/qdrant/storage
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:6333/health"]
      interval: 10s
      timeout: 5s
      retries: 5

  # Opcional: pgAdmin
  pgadmin:
    image: dpage/pgadmin4:latest
    container_name: dev-platform-pgadmin
    restart: unless-stopped
    ports:
      - "5050:80"
    environment:
      PGADMIN_DEFAULT_EMAIL: admin@devplatform.com
      PGADMIN_DEFAULT_PASSWORD: admin123
    depends_on:
      - postgres

  # Opcional: Redis Commander
  redis-commander:
    image: rediscommander/redis-commander:latest
    container_name: dev-platform-redis-ui
    restart: unless-stopped
    ports:
      - "8081:8081"
    environment:
      REDIS_HOSTS: local:redis:6379
    depends_on:
      - redis

volumes:
  postgres_data:
  redis_data:
  qdrant_data:

networks:
  default:
    name: dev-platform-network
```

- [ ] Criar `docker-compose.dev.yml`
- [ ] Testar: `docker-compose -f docker-compose.dev.yml up -d`
- [ ] Verificar health checks: `docker-compose ps`

### Docker Compose - Production

Arquivo: `docker-compose.prod.yml`

```yaml
version: "3.9"

services:
  api-gateway:
    build:
      context: .
      dockerfile: apps/api-gateway/Dockerfile
    container_name: api-gateway
    restart: unless-stopped
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=${DATABASE_URL}
      - REDIS_URL=${REDIS_URL}
      - JWT_SECRET=${JWT_SECRET}
    depends_on:
      - postgres
      - redis
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  api-management:
    build:
      context: .
      dockerfile: apps/api-management/Dockerfile
    container_name: api-management
    restart: unless-stopped
    ports:
      - "3001:3001"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=${DATABASE_URL}
      - REDIS_URL=${REDIS_URL}
    depends_on:
      - postgres
      - redis

  mock-server:
    build:
      context: .
      dockerfile: apps/mock-server/Dockerfile
    container_name: mock-server
    restart: unless-stopped
    ports:
      - "3002:3002"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=${DATABASE_URL}
      - REDIS_URL=${REDIS_URL}
    depends_on:
      - postgres
      - redis

  analytics:
    build:
      context: .
      dockerfile: apps/analytics/Dockerfile
    container_name: analytics
    restart: unless-stopped
    ports:
      - "3003:3003"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=${DATABASE_URL}
      - REDIS_URL=${REDIS_URL}
    depends_on:
      - postgres
      - redis

  ai-service:
    build:
      context: .
      dockerfile: apps/ai-service/Dockerfile
    container_name: ai-service
    restart: unless-stopped
    ports:
      - "3004:3004"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=${DATABASE_URL}
      - REDIS_URL=${REDIS_URL}
      - OPENAI_API_KEY=${OPENAI_API_KEY}
      - QDRANT_URL=${QDRANT_URL}
    depends_on:
      - postgres
      - redis
      - qdrant

  web:
    build:
      context: .
      dockerfile: apps/web/Dockerfile
    container_name: web
    restart: unless-stopped
    ports:
      - "3005:3000"
    environment:
      - NODE_ENV=production
      - NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}

  postgres:
    image: postgres:16-alpine
    container_name: postgres
    restart: unless-stopped
    environment:
      POSTGRES_USER: ${DB_USER}
      POSTGRES_PASSWORD: ${DB_PASSWORD}
      POSTGRES_DB: ${DB_NAME}
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    container_name: redis
    restart: unless-stopped
    command: redis-server --appendonly yes
    volumes:
      - redis_data:/data

  qdrant:
    image: qdrant/qdrant:latest
    container_name: qdrant
    restart: unless-stopped
    volumes:
      - qdrant_data:/qdrant/storage

volumes:
  postgres_data:
  redis_data:
  qdrant_data:

networks:
  default:
    name: dev-platform-prod
```

- [ ] Criar `docker-compose.prod.yml`
- [ ] Criar `.env.prod` com variáveis de produção
- [ ] Testar build: `docker-compose -f docker-compose.prod.yml build`

### .dockerignore

```
# Dependencies
node_modules
npm-debug.log
pnpm-debug.log
yarn-error.log

# Build artifacts
dist
.next
out
build
coverage

# Environment
.env
.env.local
.env.*.local

# Git
.git
.gitignore

# IDE
.vscode
.idea
*.swp
*.swo

# Tests
**/*.test.ts
**/*.spec.ts
**/tests
**/test

# Docs
*.md
docs

# CI/CD
.github
.gitlab-ci.yml

# Misc
.DS_Store
Thumbs.db
```

- [ ] Criar `.dockerignore` na raiz

### Scripts package.json

Adicionar scripts no `package.json` raiz:

```json
{
  "scripts": {
    "docker:dev": "docker-compose -f docker-compose.dev.yml up -d",
    "docker:dev:down": "docker-compose -f docker-compose.dev.yml down",
    "docker:prod:build": "docker-compose -f docker-compose.prod.yml build",
    "docker:prod:up": "docker-compose -f docker-compose.prod.yml up -d",
    "docker:prod:down": "docker-compose -f docker-compose.prod.yml down",
    "docker:logs": "docker-compose logs -f"
  }
}
```

- [ ] Adicionar scripts ao package.json

### Otimizações

- [ ] Usar multi-stage builds para reduzir image size
- [ ] Cache layers do Docker apropriadamente
- [ ] Minimizar camadas no Dockerfile
- [ ] Usar `.dockerignore` para excluir arquivos desnecessários
- [ ] Scan images por vulnerabilidades: `docker scan <image>`

### Healthchecks

Cada serviço deve ter endpoint `/health`:

```typescript
@Get('health')
health() {
  return {
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'api-gateway'
  };
}
```

- [ ] Implementar `/health` em todos serviços
- [ ] Configurar healthchecks no docker-compose

### Validação

- [ ] `docker-compose -f docker-compose.dev.yml up -d` funciona ✅
- [ ] Todos containers healthy ✅
- [ ] Services acessíveis nas portas corretas ✅
- [ ] Build production sem erros ✅
- [ ] Image sizes otimizados (<500MB por service) ✅

## Arquivos Criados

```
├── Dockerfile (raiz)
├── .dockerignore
├── docker-compose.dev.yml
├── docker-compose.prod.yml
├── apps/
│   ├── api-gateway/Dockerfile
│   ├── api-management/Dockerfile
│   ├── mock-server/Dockerfile
│   ├── analytics/Dockerfile
│   ├── ai-service/Dockerfile
│   └── web/Dockerfile
```

## Recursos

- [Docker Docs](https://docs.docker.com)
- [Docker Compose Docs](https://docs.docker.com/compose)
- [Multi-stage builds](https://docs.docker.com/build/building/multi-stage)
- [Docker + Node.js best practices](https://github.com/nodejs/docker-node/blob/main/docs/BestPractices.md)

## Próximo Passo

→ [03-staging.md](./03-staging.md) - Deploy staging e smoke tests
