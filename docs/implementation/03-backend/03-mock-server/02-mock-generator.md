# Mock Server - Gerador de Mocks

## Contexto

Módulo responsável por gerar respostas mockadas automáticas baseadas em schemas JSON Schema/OpenAPI.

## Dependências

- 01-setup.md completo
- Prisma models: API, Endpoint

## Checkboxes

### Pesquisa

- [ ] Docs `json-schema-faker`
- [ ] Docs `@faker-js/faker`
- [ ] Exemplos de geração de dados fake realistas
- [ ] Estratégias de cache de mocks

### Generator Module

- [ ] Criar `src/modules/generator/generator.module.ts`
- [ ] Criar `src/modules/generator/generator.service.ts`
- [ ] Criar `src/modules/generator/generator.controller.ts`
- [ ] Registrar no app.module.ts

### Generator Service - Core

```typescript
class GeneratorService {
  // Gera mock de um schema JSON
  generateMockFromSchema(schema: JSONSchema): any

  // Gera mock de um endpoint específico
  generateMockForEndpoint(endpointId: string): Promise<any>

  // Gera múltiplos exemplos
  generateExamples(schema: JSONSchema, count: number): any[]
}
```

### json-schema-faker Configuration

- [ ] Configurar faker locale: `pt_BR`
- [ ] Customizar geradores:
  - [ ] `email`: emails realistas
  - [ ] `uuid`: UUIDs válidos
  - [ ] `date`: datas em formato ISO
  - [ ] `url`: URLs válidas
- [ ] Configurar opções:
  - [ ] `useDefaultValue`: true
  - [ ] `requiredOnly`: false (gera campos opcionais também)
  - [ ] `alwaysFakeOptionals`: true

### Faker Integration

```typescript
import { faker } from "@faker-js/faker"
import jsf from "json-schema-faker"

jsf.extend("faker", () => faker)

// Configurar locale
faker.locale = "pt_BR"
```

### Schema Type Handling

- [ ] **String types**:

  - [ ] `format: email` → faker.internet.email()
  - [ ] `format: uuid` → faker.string.uuid()
  - [ ] `format: date` → faker.date.recent()
  - [ ] `format: uri` → faker.internet.url()
  - [ ] `enum` → random choice
  - [ ] `pattern` → regex generation

- [ ] **Number types**:

  - [ ] `minimum/maximum` → respeitados
  - [ ] `multipleOf` → respeitado
  - [ ] `integer` vs `number`

- [ ] **Array types**:

  - [ ] `minItems/maxItems`
  - [ ] `uniqueItems`
  - [ ] Nested arrays

- [ ] **Object types**:
  - [ ] `required` fields
  - [ ] Nested objects
  - [ ] `additionalProperties`

### OpenAPI Schema Parsing

- [ ] Extrair schema de response de endpoint
- [ ] Suportar `$ref` (references)
- [ ] Resolver schemas compartilhados (components/schemas)
- [ ] Lidar com `oneOf`, `anyOf`, `allOf`

### Realistic Data Generation

```typescript
// Exemplos de dados realistas
{
  "type": "object",
  "properties": {
    "name": { "type": "string", "x-faker": "person.fullName" },
    "email": { "type": "string", "format": "email" },
    "age": { "type": "integer", "minimum": 18, "maximum": 100 },
    "address": {
      "type": "object",
      "properties": {
        "street": { "type": "string", "x-faker": "location.streetAddress" },
        "city": { "type": "string", "x-faker": "location.city" },
        "zipCode": { "type": "string", "x-faker": "location.zipCode" }
      }
    }
  }
}
```

### generateMockFromSchema Implementation

```typescript
async generateMockFromSchema(schema: JSONSchema): Promise<any> {
  try {
    // Configurar jsf
    jsf.option({ ... });

    // Gerar mock
    const mock = await jsf.resolve(schema);

    return mock;
  } catch (error) {
    // Fallback para objeto vazio se schema inválido
    return {};
  }
}
```

### generateMockForEndpoint Implementation

- [ ] Buscar endpoint do database:
  ```typescript
  const endpoint = await prisma.endpoint.findUnique({
    where: { id: endpointId },
    include: { api: true },
  })
  ```
- [ ] Extrair response schema (status 200)
- [ ] Se não tiver schema, retornar success genérico:
  ```json
  { "success": true, "message": "Mock response" }
  ```
- [ ] Se tiver schema, gerar mock
- [ ] Aplicar delay configurado (se houver)

### Cache de Mocks

- [ ] Install `cache-manager`
- [ ] Configurar cache em memória (TTL 5min)
- [ ] Cache key: `mock:${endpointId}`
- [ ] Invalidar cache quando endpoint atualizado

```typescript
@Injectable()
export class GeneratorService {
  constructor(@Inject(CACHE_MANAGER) private cache: Cache) {}

  async generateMockForEndpoint(id: string): Promise<any> {
    const cacheKey = `mock:${id}`
    const cached = await this.cache.get(cacheKey)
    if (cached) return cached

    const mock = await this.generateFreshMock(id)
    await this.cache.set(cacheKey, mock, 300) // 5min TTL
    return mock
  }
}
```

### Error Handling

- [ ] Try-catch em generateMockFromSchema
- [ ] Log errors com context
- [ ] Retornar fallback genérico em caso de erro
- [ ] Não expor stack traces ao cliente

### Controller - Preview Endpoint

```typescript
@Controller("generator")
export class GeneratorController {
  @Post("preview")
  async previewMock(@Body() dto: { schema: JSONSchema }) {
    return this.generatorService.generateMockFromSchema(dto.schema)
  }

  @Get("endpoint/:id")
  async generateForEndpoint(@Param("id") id: string) {
    return this.generatorService.generateMockForEndpoint(id)
  }
}
```

### DTOs

- [ ] Criar `dto/preview-mock.dto.ts`:
  ```typescript
  export class PreviewMockDto {
    @IsObject()
    schema: JSONSchema

    @IsOptional()
    @IsNumber()
    count?: number // gerar múltiplos exemplos
  }
  ```

### Testes Unitários

- [ ] `tests/unit/generator/generator.service.spec.ts`
- [ ] Test generateMockFromSchema:
  - [ ] Schema simples (string, number)
  - [ ] Schema com nested objects
  - [ ] Schema com arrays
  - [ ] Schema com enums
  - [ ] Schema com $ref
  - [ ] Schema inválido (deve retornar fallback)
- [ ] Test cache behavior
- [ ] Mock Prisma calls

### Testes Integração

- [ ] `tests/integration/generator/generator.spec.ts`
- [ ] POST /generator/preview com schema válido
- [ ] GET /generator/endpoint/:id
- [ ] Verificar dados gerados são válidos

### Documentação

- [ ] Swagger decorators nos endpoints
- [ ] Comentários JSDoc nas funções principais
- [ ] README do módulo explicando:
  - [ ] Como funciona json-schema-faker
  - [ ] Customizações de faker
  - [ ] Exemplos de schemas suportados

### Validação

- [ ] Schema válido → mock gerado
- [ ] Schema com nested objects → mock correto
- [ ] Schema com array → array gerado
- [ ] Cache funciona (2ª chamada mais rápida)
- [ ] `pnpm test` 100% coverage no generator

## Próximo Passo

→ [03-scenario-management.md](./03-scenario-management.md) - Gerenciar scenarios customizados
