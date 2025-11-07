# Management Service - Setup

## Contexto

Serviço para gerenciar workspaces, APIs e endpoints.

## Dependências

- Phase 0 completo

## Checkboxes

### Criar App

- [ ] `npx @nestjs/cli new management-service`
- [ ] Escolher pnpm
- [ ] Mover para apps/

### Dependencies

- [ ] `pnpm add @prisma/client@latest`
- [ ] `pnpm add prisma@latest -D`
- [ ] `pnpm add @dev-platform/shared@workspace:*`
- [ ] `pnpm add redis@latest ioredis@latest`

### Prisma Setup

- [ ] `npx prisma init`
- [ ] Configurar DATABASE_URL (.env)
- [ ] Criar schema (User, Workspace, WorkspaceMember, API, Endpoint)

### Prisma Schema

- [ ] Model Workspace (id, name, createdAt)
- [ ] Model WorkspaceMember (userId, workspaceId, role)
- [ ] Model API (id, workspaceId, name, baseUrl, version)
- [ ] Model Endpoint (id, apiId, method, path, schema)

### Migrations

- [ ] `npx prisma migrate dev --name init`
- [ ] `npx prisma generate`

### Redis Client

- [ ] `src/shared/redis.client.ts`
- [ ] Connection + health check

### Scripts

- [ ] `"dev": "nest start --watch"`
- [ ] `"build": "nest build"`

### Testes

- [ ] `tests/unit/management-service/prisma.test.ts`

### Validação

- [ ] `pnpm dev` inicia
- [ ] Prisma Studio funciona
- [ ] `pnpm test` (100%)

→ [02-workspace-crud.md](./02-workspace-crud.md)
