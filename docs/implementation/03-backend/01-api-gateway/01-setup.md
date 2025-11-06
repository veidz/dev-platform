# API Gateway - Setup

## Contexto

Gateway principal: autenticação, rate limiting e roteamento para microsserviços.

## Dependências

- Phase 0 completo

## Checkboxes

### Pesquisa

- [ ] NestJS CLI docs
- [ ] Verificar versões npm

### Criar App

- [ ] `npx @nestjs/cli new api-gateway`
- [ ] Escolher pnpm
- [ ] Mover para apps/

### Dependencies

- [ ] `pnpm add @nestjs/passport@latest`
- [ ] `pnpm add @nestjs/jwt@latest`
- [ ] `pnpm add passport-jwt@latest`
- [ ] `pnpm add @nestjs/throttler@latest`
- [ ] `pnpm add redis@latest ioredis@latest`
- [ ] `pnpm add @dev-platform/shared@workspace:*`

### Estrutura

- [ ] `src/auth/`
- [ ] `src/proxy/`
- [ ] `src/shared/`

### Config

- [ ] `src/config/app.config.ts`
- [ ] Environment variables

### Redis Client

- [ ] `src/shared/redis.client.ts`
- [ ] Connection e health check

### Scripts

- [ ] `"dev": "nest start --watch"`
- [ ] `"build": "nest build"`

### Testes

- [ ] `tests/unit/api-gateway/redis.client.test.ts`

### Validação

- [ ] `pnpm dev` inicia
- [ ] Health check /health retorna 200
- [ ] `pnpm test` (100%)

## Próximo Passo

→ [02-auth-module.md](./02-auth-module.md)
