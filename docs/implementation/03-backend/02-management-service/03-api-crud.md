# API CRUD

## Contexto

Gerenciamento de APIs: CRUD, versionamento e cache.

## Dependências

- 02-workspace-crud.md completo

## Checkboxes

### Pesquisa

- [ ] OpenAPI spec format
- [ ] API versioning strategies

### Module Structure

- [ ] Criar `src/api/api.module.ts`
- [ ] Criar `src/api/api.service.ts`
- [ ] Criar `src/api/api.controller.ts`
- [ ] Criar `src/api/api.types.ts`

### DTOs

- [ ] Criar `src/api/dto/create-api.dto.ts`
- [ ] Criar `src/api/dto/update-api.dto.ts`
- [ ] Criar `src/api/dto/query-api.dto.ts` (filters)

### API Service - CRUD

- [ ] Method `findAll(workspaceId, filters)` - lista APIs
- [ ] Method `findOne(id)` - detalhe de API
- [ ] Method `create(dto, workspaceId)` - cria API
- [ ] Method `update(id, dto)` - atualiza
- [ ] Method `remove(id)` - soft delete ou hard delete
- [ ] Method `duplicate(id)` - clona API

### Versioning

- [ ] Suporte múltiplas versões (v1, v2, etc)
- [ ] Version field no schema
- [ ] Active version flag
- [ ] History de versões

### Schema Storage

- [ ] OpenAPI spec completo (JSONB)
- [ ] Validar schema ao criar/atualizar
- [ ] Support JSON e YAML
- [ ] Parser para extrair info

### Filters & Pagination

- [ ] Filter by status (active, draft, archived)
- [ ] Filter by tags
- [ ] Search by name
- [ ] Pagination (cursor-based)
- [ ] Sort by createdAt, name

### Controller - Endpoints

- [ ] GET /apis?workspaceId=X&status=active
- [ ] GET /apis/:id
- [ ] POST /apis
- [ ] PATCH /apis/:id
- [ ] DELETE /apis/:id
- [ ] POST /apis/:id/duplicate
- [ ] GET /apis/:id/versions

### Permissions Check

- [ ] Verificar se user tem acesso ao workspace
- [ ] VIEWER pode apenas listar/ver
- [ ] DEV pode criar/editar
- [ ] ADMIN/OWNER podem deletar

### Cache Strategy

- [ ] Cache GET /apis/:id (Redis)
- [ ] Key: `api:${id}`
- [ ] TTL: 10 minutos
- [ ] Invalidar on update/delete

### Cache Invalidation

- [ ] On update: del `api:${id}`
- [ ] On delete: del `api:${id}` + `workspace:${wId}:apis`
- [ ] Publish event para outros serviços (Redis Pub/Sub)

### Status Enum

- [ ] DRAFT (em construção)
- [ ] ACTIVE (produção)
- [ ] DEPRECATED (obsoleto mas ainda ativo)
- [ ] ARCHIVED (desativado)

### Tags System

- [ ] Array de strings
- [ ] Autocomplete de tags existentes
- [ ] Filter by tags (multiple OR)

### Statistics

- [ ] Count endpoints por API
- [ ] Last modified date
- [ ] Created by (userId)

### Events

- [ ] Emitir evento `api.created`
- [ ] Emitir evento `api.updated`
- [ ] Emitir evento `api.deleted`
- [ ] Usar Redis Pub/Sub ou EventEmitter

### Validation Rules

- [ ] Name: required, unique per workspace
- [ ] baseUrl: valid URL format
- [ ] Version: semver format (opcional)

### Error Handling

- [ ] NotFoundException se não existe
- [ ] ForbiddenException se sem permissão
- [ ] ConflictException se nome duplicado

### Testes Unitários

- [ ] `tests/unit/management-service/api/api.service.test.ts`
- [ ] Test findAll com filters
- [ ] Test create com workspace
- [ ] Test update invalida cache
- [ ] Test delete cascata endpoints
- [ ] Mock Prisma e Redis

### Testes Integração

- [ ] `tests/integration/management-service/api/api.controller.test.ts`
- [ ] GET /apis (200, lista filtrada)
- [ ] POST /apis (201, API criada)
- [ ] PATCH /apis/:id (200, atualizado)
- [ ] DELETE /apis/:id (200, deletado)
- [ ] Test permissions (VIEWER tenta deletar → 403)

### Testes Cache

- [ ] GET após create (cache miss)
- [ ] GET segunda vez (cache hit)
- [ ] UPDATE invalida cache
- [ ] DELETE remove do cache

### Documentação

- [ ] Swagger decorators
- [ ] Exemplos de OpenAPI specs
- [ ] Explicar versionamento

### Validação

- [ ] CRUD funciona
- [ ] Versionamento funciona
- [ ] Cache funciona e invalida corretamente
- [ ] Events são emitidos
- [ ] `pnpm test` (100% coverage)

## Arquivos Criados

```
src/api/
├── api.module.ts
├── api.service.ts
├── api.controller.ts
├── api.types.ts
└── dto/
    ├── create-api.dto.ts
    ├── update-api.dto.ts
    └── query-api.dto.ts

tests/
├── unit/management-service/api/
│   └── api.service.test.ts
└── integration/management-service/api/
    └── api.controller.test.ts
```

## Exemplo: api.service.ts

```typescript
import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '@/shared/prisma.service'
import { RedisService } from '@/shared/redis.service'
import type { CreateApiDto } from './dto/create-api.dto'

@Injectable()
export class ApiService {
  constructor(
    private prisma: PrismaService,
    private redis: RedisService,
  ) {}

  async findAll(workspaceId: string, filters?: QueryApiDto) {
    return this.prisma.aPI.findMany({
      where: {
        workspaceId,
        ...(filters?.status && { status: filters.status }),
        ...(filters?.search && {
          name: { contains: filters.search, mode: 'insensitive' },
        }),
      },
      include: {
        _count: { select: { endpoints: true } },
      },
      orderBy: { createdAt: 'desc' },
    })
  }

  async findOne(id: string) {
    // Tenta buscar do cache
    const cached = await this.redis.get(`api:${id}`)
    if (cached) return JSON.parse(cached)

    const api = await this.prisma.aPI.findUnique({
      where: { id },
      include: { endpoints: true },
    })

    if (!api) {
      throw new NotFoundException('API not found')
    }

    // Cacheia por 10 minutos
    await this.redis.setex(`api:${id}`, 600, JSON.stringify(api))
    return api
  }

  async update(id: string, dto: UpdateApiDto) {
    const updated = await this.prisma.aPI.update({
      where: { id },
      data: dto,
    })

    // Invalida cache
    await this.redis.del(`api:${id}`)

    // Emite evento
    await this.redis.publish('api.updated', JSON.stringify({ id }))

    return updated
  }

  async remove(id: string) {
    await this.prisma.aPI.delete({ where: { id } })
    await this.redis.del(`api:${id}`)
    await this.redis.publish('api.deleted', JSON.stringify({ id }))
  }
}
```

## Exemplo: Prisma Schema

```prisma
model API {
  id          String      @id @default(cuid())
  workspaceId String
  name        String
  description String?
  baseUrl     String
  version     String      @default("1.0.0")
  status      ApiStatus   @default(DRAFT)
  tags        String[]
  schema      Json?       // OpenAPI spec completo
  createdAt   DateTime    @default(now())
  updatedAt   DateTime    @updatedAt

  workspace   Workspace   @relation(fields: [workspaceId], references: [id], onDelete: Cascade)
  endpoints   Endpoint[]

  @@unique([workspaceId, name])
  @@index([workspaceId, status])
}

enum ApiStatus {
  DRAFT
  ACTIVE
  DEPRECATED
  ARCHIVED
}
```

## Recursos

- [OpenAPI Specification](https://swagger.io/specification/)
- [API Versioning Best Practices](https://learn.microsoft.com/en-us/azure/api-management/api-management-versions)
- [Redis Data Types Overview](https://redis.io/docs/latest/develop/data-types/)

## Próximo Passo

→ [04-endpoint-crud.md](./04-endpoint-crud.md)
