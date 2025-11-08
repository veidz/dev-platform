# OpenAPI Parser

## Contexto

Import de especificações OpenAPI/Swagger para criar APIs e endpoints automaticamente.

## Dependências

- 04-endpoint-crud.md completo

## Checkboxes

### Pesquisa

- [ ] OpenAPI 3.0 spec (https://swagger.io/specification/)
- [ ] Swagger Parser docs (https://github.com/APIDevTools/swagger-parser)

### Dependencies

- [ ] `pnpm add swagger-parser@latest`
- [ ] `pnpm add @apidevtools/swagger-parser@latest`
- [ ] `pnpm add js-yaml@latest` (YAML support)

### Module Structure

- [ ] Criar `src/import/import.module.ts`
- [ ] Criar `src/import/openapi-parser.service.ts`
- [ ] Criar `src/import/import.controller.ts`

### Parser Service

- [ ] Method `parse(spec)` - valida e parseia
- [ ] Method `extractApiInfo(spec)` - info, version, servers
- [ ] Method `extractEndpoints(spec)` - paths + operations
- [ ] Method `extractSchemas(spec)` - components/schemas

### Validation

- [ ] Validate OpenAPI 3.0 spec
- [ ] Check required fields
- [ ] Return detailed errors se inválido

### Extract API Info

- [ ] info.title → API name
- [ ] info.description → description
- [ ] info.version → version
- [ ] servers[0].url → baseUrl

### Extract Endpoints

- [ ] Iterar paths object
- [ ] Para cada path + method:
  - [ ] path → endpoint.path
  - [ ] method → endpoint.method
  - [ ] summary → endpoint.summary
  - [ ] description → endpoint.description
  - [ ] parameters → pathParams, queryParams
  - [ ] requestBody → requestSchema
  - [ ] responses → responses object

### Transform Schemas

- [ ] Convert OpenAPI schema → JSON Schema
- [ ] Handle $ref references
- [ ] Dereference schemas

### Import Flow

- [ ] Parse spec
- [ ] Create API (transaction)
- [ ] Create all endpoints (batch)
- [ ] Return summary (API id, X endpoints created)

### Error Handling

- [ ] Invalid spec → BadRequestException
- [ ] Parsing error → detailed message
- [ ] Duplicate API name → ConflictException

### Support Formats

- [ ] JSON
- [ ] YAML
- [ ] Auto-detect format

### Import Options

- [ ] Overwrite existing (opcional)
- [ ] Merge with existing (adicionar endpoints)
- [ ] Dry-run (preview without creating)

### Controller Endpoint

- [ ] POST /import/openapi
- [ ] Body: { spec: string, workspaceId: string, options?: {...} }
- [ ] File upload (multipart/form-data)

### Preview Mode

- [ ] Parse sem criar no DB
- [ ] Return API + endpoints que seriam criados
- [ ] User confirma antes de criar

### Testes Unitários

- [ ] `tests/unit/management-service/import/openapi-parser.test.ts`
- [ ] Test parse valid spec
- [ ] Test parse invalid spec → error
- [ ] Test extractApiInfo
- [ ] Test extractEndpoints
- [ ] Mock specs fixtures

### Testes Integração

- [ ] `tests/integration/management-service/import/import.controller.test.ts`
- [ ] POST /import/openapi (201, API criada)
- [ ] POST com spec inválido (400)
- [ ] POST com YAML (201)
- [ ] Test preview mode

### Test Fixtures

- [ ] Criar `tests/fixtures/openapi-valid.json`
- [ ] Criar `tests/fixtures/openapi-invalid.json`
- [ ] Criar `tests/fixtures/openapi.yaml`

### Documentação

- [ ] Swagger decorator
- [ ] Exemplo de spec válido
- [ ] Explicar opções de import

### Validação

- [ ] Import JSON funciona
- [ ] Import YAML funciona
- [ ] Validation funciona
- [ ] Endpoints são criados corretamente
- [ ] `pnpm test` (100% coverage)

## Arquivos Criados

```
src/import/
├── import.module.ts
├── openapi-parser.service.ts
└── import.controller.ts

tests/
├── unit/management-service/import/
│   └── openapi-parser.test.ts
├── integration/management-service/import/
│   └── import.controller.test.ts
└── fixtures/
    ├── openapi-valid.json
    ├── openapi-invalid.json
    └── openapi.yaml
```

## Exemplo: openapi-parser.service.ts

```typescript
import { Injectable, BadRequestException } from '@nestjs/common'
import SwaggerParser from '@apidevtools/swagger-parser'
import type { OpenAPIV3 } from 'openapi-types'

@Injectable()
export class OpenApiParserService {
  async parse(spec: string | object): Promise<OpenAPIV3.Document> {
    try {
      const api = await SwaggerParser.validate(spec)
      return api as OpenAPIV3.Document
    } catch (error) {
      throw new BadRequestException(`Invalid OpenAPI spec: ${error.message}`)
    }
  }

  extractApiInfo(spec: OpenAPIV3.Document) {
    return {
      name: spec.info.title,
      description: spec.info.description,
      version: spec.info.version,
      baseUrl: spec.servers?.[0]?.url || '',
    }
  }

  extractEndpoints(spec: OpenAPIV3.Document) {
    const endpoints = []

    for (const [path, pathItem] of Object.entries(spec.paths)) {
      if (!pathItem) continue

      const operations = ['get', 'post', 'put', 'patch', 'delete'] as const

      for (const method of operations) {
        const operation = pathItem[method]
        if (!operation) continue

        endpoints.push({
          path,
          method: method.toUpperCase(),
          summary: operation.summary,
          description: operation.description,
          tags: operation.tags || [],
          pathParams: this.extractParams(operation.parameters, 'path'),
          queryParams: this.extractParams(operation.parameters, 'query'),
          requestSchema: this.extractRequestBody(operation.requestBody),
          responses: this.extractResponses(operation.responses),
        })
      }
    }

    return endpoints
  }

  private extractParams(params: any[] | undefined, location: 'path' | 'query') {
    if (!params) return []
    return params
      .filter((p) => p.in === location)
      .map((p) => ({
        name: p.name,
        type: p.schema?.type || 'string',
        required: p.required || false,
        description: p.description,
      }))
  }

  private extractRequestBody(requestBody: any) {
    if (!requestBody?.content?.['application/json']?.schema) {
      return null
    }
    return requestBody.content['application/json'].schema
  }

  private extractResponses(responses: any) {
    const result: Record<string, any> = {}
    for (const [status, response] of Object.entries(responses)) {
      result[status] = {
        description: (response as any).description,
        schema: (response as any).content?.['application/json']?.schema,
      }
    }
    return result
  }
}
```

## Exemplo: import.controller.ts

```typescript
import { Controller, Post, Body } from '@nestjs/common'
import { OpenApiParserService } from './openapi-parser.service'
import { ApiService } from '../api/api.service'
import { EndpointService } from '../endpoint/endpoint.service'

@Controller('import')
export class ImportController {
  constructor(
    private parser: OpenApiParserService,
    private apiService: ApiService,
    private endpointService: EndpointService,
  ) {}

  @Post('openapi')
  async importOpenApi(@Body() body: { spec: any; workspaceId: string }) {
    // Parse spec
    const spec = await this.parser.parse(body.spec)

    // Extract API info
    const apiInfo = this.parser.extractApiInfo(spec)
    const endpoints = this.parser.extractEndpoints(spec)

    // Create API
    const api = await this.apiService.create(apiInfo, body.workspaceId)

    // Create endpoints (batch)
    const createdEndpoints = await Promise.all(
      endpoints.map((ep) => this.endpointService.create(ep, api.id)),
    )

    return {
      api,
      endpointsCreated: createdEndpoints.length,
    }
  }
}
```

## Exemplo: openapi-valid.json (fixture)

```json
{
  "openapi": "3.0.0",
  "info": {
    "title": "User API",
    "version": "1.0.0",
    "description": "API for user management"
  },
  "servers": [{ "url": "https://api.example.com" }],
  "paths": {
    "/users": {
      "get": {
        "summary": "List users",
        "responses": {
          "200": {
            "description": "Success",
            "content": {
              "application/json": {
                "schema": {
                  "type": "array",
                  "items": { "$ref": "#/components/schemas/User" }
                }
              }
            }
          }
        }
      }
    }
  },
  "components": {
    "schemas": {
      "User": {
        "type": "object",
        "properties": {
          "id": { "type": "string" },
          "name": { "type": "string" }
        }
      }
    }
  }
}
```

## Recursos

- [OpenAPI 3.0 Specification](https://swagger.io/specification/)
- [Swagger Parser (GitHub)](https://github.com/APIDevTools/swagger-parser)
- [OpenAPI Types](https://github.com/kogosoftwarellc/open-api/tree/master/packages/openapi-types)

## Próximo Passo

✅ **Management Service completo!**

→ [Mock Server](../03-mock-server/01-setup.md)
