# Mock Server - Setup Inicial

## Contexto

Microsserviço responsável por gerar e servir respostas mockadas baseadas em schemas OpenAPI.

## Dependências

- Phase 0 e 1 completas
- Prisma schema com models API, Endpoint, MockScenario

## Checkboxes

### Pesquisa & Planejamento

- [ ] Estudar bibliotecas de mock generation:
  - [ ] `@faker-js/faker` para dados fake
  - [ ] `json-schema-faker` para gerar JSON de schemas
  - [ ] `openapi-backend` para validação OpenAPI
- [ ] Analisar ADR-003 (NestJS) e ADR-005 (Database)
- [ ] Revisar spec técnica - seção Mock Server

### Criar Aplicação NestJS

- [ ] `cd apps && nest new mock-server`
- [ ] Selecionar package manager: `pnpm`
- [ ] Configurar tsconfig.json herdando de `@dev-platform/config/tsconfig`
- [ ] Adicionar no turbo.json pipeline

### Dependencies

```bash
pnpm add @prisma/client
pnpm add @faker-js/faker@latest
pnpm add json-schema-faker@latest
pnpm add openapi-backend@latest
pnpm add class-validator class-transformer
pnpm add @nestjs/config
pnpm add -D @types/json-schema-faker
```

### Estrutura de Diretórios

```
apps/mock-server/
├── src/
│   ├── modules/
│   │   ├── generator/      # Gerar mocks de schemas
│   │   ├── scenario/       # Gerenciar scenarios
│   │   ├── server/         # Servir mocks via HTTP
│   │   └── config/         # Configurações de mocks
│   ├── common/
│   │   ├── decorators/
│   │   ├── guards/
│   │   └── interceptors/
│   ├── app.module.ts
│   └── main.ts
├── test/
├── prisma/
│   └── schema.prisma (link simbólico)
└── package.json
```

### Configuração Base

- [ ] **main.ts**
  - [ ] Porta: 3002 (padrão) ou `process.env.MOCK_SERVER_PORT`
  - [ ] CORS habilitado (origens configuráveis)
  - [ ] Global validation pipe
  - [ ] Swagger em `/docs`
  - [ ] Global prefix: `/api/mock`

- [ ] **app.module.ts**
  - [ ] Import ConfigModule (load .env)
  - [ ] Import PrismaModule
  - [ ] Import GeneratorModule
  - [ ] Import ScenarioModule
  - [ ] Import ServerModule

### PrismaModule Setup

- [ ] Criar `src/prisma/prisma.module.ts`
- [ ] Criar `src/prisma/prisma.service.ts`
- [ ] Configurar conexão com DATABASE_URL
- [ ] Lifecycle hooks (onModuleInit, enableShutdownHooks)

### Environment Variables

- [ ] Criar `.env.example`:
  ```env
  MOCK_SERVER_PORT=3002
  DATABASE_URL=postgresql://...
  CORS_ORIGINS=http://localhost:3000
  DEFAULT_MOCK_DELAY_MS=0
  MAX_MOCK_DELAY_MS=5000
  ```

### Health Check

- [ ] Criar `src/health/health.controller.ts`
- [ ] Endpoint: `GET /health`
- [ ] Response: `{ status: 'ok', service: 'mock-server', timestamp }`
- [ ] Verificar conexão com database

### Logging

- [ ] Configurar Winston ou Pino
- [ ] Formato estruturado (JSON)
- [ ] Incluir correlation ID
- [ ] Logs: request received, mock generated, errors

### Docker

- [ ] Criar `Dockerfile`:
  - [ ] Base: node:22-alpine
  - [ ] Build stage
  - [ ] Production stage
  - [ ] Expor porta 3002
- [ ] Adicionar em `docker-compose.yml` (root):
  ```yaml
  mock-server:
    build: ./apps/mock-server
    ports:
      - '3002:3002'
    env_file:
      - ./apps/mock-server/.env
    depends_on:
      - postgres
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

### Testes Setup

- [ ] Configurar jest.config.js
- [ ] Setup teste de integração com DB de teste
- [ ] Mock environment variables

### Validação

- [ ] `pnpm install` sem erros
- [ ] `pnpm dev` inicia na porta 3002
- [ ] `GET /health` retorna 200
- [ ] `pnpm build` compila sem erros
- [ ] `pnpm lint` sem warnings
- [ ] `pnpm test` roda (mesmo sem testes ainda)

### Documentação

- [ ] README.md do mock-server:
  - [ ] Responsabilidades
  - [ ] Como rodar localmente
  - [ ] Endpoints principais
  - [ ] Environment variables

## Próximo Passo

→ [02-mock-generator.md](./02-mock-generator.md) - Implementar geração de mocks
