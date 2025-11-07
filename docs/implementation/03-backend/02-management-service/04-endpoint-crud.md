# Endpoint CRUD

## Contexto

Gerenciamento de endpoints: métodos HTTP, schemas, parâmetros.

## Dependências

- 03-api-crud.md completo

## Checkboxes

### Pesquisa

- [ ] JSON Schema validation
- [ ] HTTP methods best practices

### Module Structure

- [ ] Criar `src/endpoint/endpoint.module.ts`
- [ ] Criar `src/endpoint/endpoint.service.ts`
- [ ] Criar `src/endpoint/endpoint.controller.ts`
- [ ] Criar `src/endpoint/endpoint.types.ts`

### DTOs

- [ ] Criar `src/endpoint/dto/create-endpoint.dto.ts`
- [ ] Criar `src/endpoint/dto/update-endpoint.dto.ts`

### Endpoint Service - CRUD

- [ ] Method `findAll(apiId)` - lista endpoints da API
- [ ] Method `findOne(id)` - detalhe
- [ ] Method `create(dto, apiId)` - cria endpoint
- [ ] Method `update(id, dto)` - atualiza
- [ ] Method `remove(id)` - deleta

### HTTP Methods Support

- [ ] GET, POST, PUT, PATCH, DELETE
- [ ] OPTIONS, HEAD (opcional)
- [ ] Enum HttpMethod

### Path Parameters

- [ ] Support `:param` syntax
- [ ] Array de params esperados
- [ ] Tipo de cada param (string, number, uuid)
- [ ] Required/optional

### Query Parameters

- [ ] Array de query params
- [ ] Type, required, default value
- [ ] Schema JSON para validação

### Request Body Schema

- [ ] JSON Schema para body
- [ ] Support Content-Type (json, form-data)
- [ ] Examples de payloads
- [ ] Validar schema ao criar

### Response Schemas

- [ ] Array de responses (por status code)
- [ ] 200, 201, 400, 401, 404, 500
- [ ] Schema JSON por status
- [ ] Examples de responses

### Headers

- [ ] Custom headers esperados
- [ ] Authorization requirements
- [ ] Content-Type

### Controller - Endpoints

- [ ] GET /endpoints?apiId=X
- [ ] GET /endpoints/:id
- [ ] POST /endpoints
- [ ] PATCH /endpoints/:id
- [ ] DELETE /endpoints/:id
- [ ] POST /endpoints/:id/test (test endpoint)

### Validation Rules

- [ ] Path: must start with /
- [ ] Method: must be valid HTTP method
- [ ] Unique (apiId + method + path)

### Schema Validation

- [ ] Install ajv@latest (JSON Schema validator)
- [ ] Validate request/response schemas
- [ ] Return errors se schema inválido

### Auto-generate Examples

- [ ] Use faker para gerar exemplos
- [ ] Baseado no schema
- [ ] Method `generateExample(schema)`

### Test Endpoint

- [ ] Endpoint para testar (send real request)
- [ ] Retorna response + timing
- [ ] Salva em history (opcional)

### Grouping/Tags

- [ ] Agrupar endpoints por tag
- [ ] Filter by tag
- [ ] Ordenação customizada

### Error Handling

- [ ] NotFoundException
- [ ] ConflictException (duplicate path+method)
- [ ] BadRequestException (schema inválido)

### Testes Unitários

- [ ] `tests/unit/management-service/endpoint/endpoint.service.test.ts`
- [ ] Test create valida schema
- [ ] Test duplicate path+method → error
- [ ] Mock Prisma

### Testes Integração

- [ ] `tests/integration/management-service/endpoint/endpoint.controller.test.ts`
- [ ] GET /endpoints (200)
- [ ] POST /endpoints (201)
- [ ] POST com schema inválido (400)
- [ ] PATCH /endpoints/:id (200)
- [ ] DELETE /endpoints/:id (200)

### Documentação

- [ ] Swagger decorators
- [ ] Exemplos de schemas
- [ ] Explicar structure de endpoint

### Validação

- [ ] CRUD funciona
- [ ] Schema validation funciona
- [ ] Unique constraint funciona
- [ ] `pnpm test` (100% coverage)

## Arquivos Criados

```
src/endpoint/
├── endpoint.module.ts
├── endpoint.service.ts
├── endpoint.controller.ts
├── endpoint.types.ts
└── dto/
    ├── create-endpoint.dto.ts
    └── update-endpoint.dto.ts

tests/
├── unit/management-service/endpoint/
│   └── endpoint.service.test.ts
└── integration/management-service/endpoint/
    └── endpoint.controller.test.ts
```

## Exemplo: endpoint.service.ts

```typescript
import { Injectable, ConflictException } from '@nestjs/common'
import { PrismaService } from '@/shared/prisma.service'
import Ajv from 'ajv'
import type { CreateEndpointDto } from './dto/create-endpoint.dto'

@Injectable()
export class EndpointService {
  private ajv = new Ajv()

  constructor(private prisma: PrismaService) {}

  async create(dto: CreateEndpointDto, apiId: string) {
    // Valida request schema
    if (dto.requestSchema) {
      const valid = this.ajv.validateSchema(dto.requestSchema)
      if (!valid) {
        throw new BadRequestException('Invalid request schema')
      }
    }

    // Check unique path+method
    const existing = await this.prisma.endpoint.findFirst({
      where: {
        apiId,
        path: dto.path,
        method: dto.method,
      },
    })

    if (existing) {
      throw new ConflictException('Endpoint already exists')
    }

    return this.prisma.endpoint.create({
      data: {
        ...dto,
        apiId,
      },
    })
  }

  async findAll(apiId: string) {
    return this.prisma.endpoint.findMany({
      where: { apiId },
      orderBy: [{ path: 'asc' }, { method: 'asc' }],
    })
  }
}
```

## Exemplo: Prisma Schema

```prisma
model Endpoint {
  id             String      @id @default(cuid())
  apiId          String
  path           String      // /users/:id
  method         HttpMethod
  summary        String?
  description    String?
  tags           String[]

  // Request
  pathParams     Json?       // [{ name: "id", type: "string", required: true }]
  queryParams    Json?
  headers        Json?
  requestSchema  Json?       // JSON Schema

  // Response
  responses      Json?       // { "200": { schema: {...}, example: {...} } }

  createdAt      DateTime    @default(now())
  updatedAt      DateTime    @updatedAt

  api            API         @relation(fields: [apiId], references: [id], onDelete: Cascade)

  @@unique([apiId, path, method])
  @@index([apiId])
}

enum HttpMethod {
  GET
  POST
  PUT
  PATCH
  DELETE
  OPTIONS
  HEAD
}
```

## Exemplo: create-endpoint.dto.ts

```typescript
import { IsString, IsEnum, IsOptional, IsObject } from 'class-validator'
import { HttpMethod } from '@prisma/client'

export class CreateEndpointDto {
  @IsString()
  path: string

  @IsEnum(HttpMethod)
  method: HttpMethod

  @IsString()
  @IsOptional()
  summary?: string

  @IsString()
  @IsOptional()
  description?: string

  @IsObject()
  @IsOptional()
  requestSchema?: object

  @IsObject()
  @IsOptional()
  responses?: object
}
```

## Recursos

- [JSON Schema](https://json-schema.org)
- [Ajv Validator](https://ajv.js.org)
- [HTTP Methods](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods)

## Próximo Passo

→ [05-openapi-parser.md](./05-openapi-parser.md)
