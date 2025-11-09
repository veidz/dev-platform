# Mock Server - Gerenciamento de Scenarios

## Contexto

Permite criar scenarios customizados (success, error, edge cases) com respostas específicas por endpoint.

## Dependências

- 02-mock-generator.md completo
- Prisma model: MockScenario

## Checkboxes

### Prisma Schema Update

Adicionar model MockScenario:

```prisma
model MockScenario {
  id          String   @id @default(cuid())
  name        String   // "Success", "Not Found", "Server Error"
  description String?

  endpoint    Endpoint @relation(fields: [endpointId], references: [id], onDelete: Cascade)
  endpointId  String

  statusCode  Int      @default(200)
  headers     Json?    // Custom headers
  body        Json     // Response body
  delay       Int      @default(0) // ms

  isDefault   Boolean  @default(false) // Scenario padrão
  isActive    Boolean  @default(true)

  createdBy   User     @relation(fields: [userId], references: [id])
  userId      String

  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@index([endpointId])
  @@index([userId])
}
```

- [ ] Adicionar ao schema.prisma
- [ ] `pnpm prisma generate`
- [ ] `pnpm prisma migrate dev --name add-mock-scenarios`

### Scenario Module

- [ ] Criar `src/modules/scenario/scenario.module.ts`
- [ ] Criar `src/modules/scenario/scenario.service.ts`
- [ ] Criar `src/modules/scenario/scenario.controller.ts`
- [ ] Registrar no app.module.ts

### DTOs

**CreateScenarioDto:**

```typescript
export class CreateScenarioDto {
  @IsString()
  name: string

  @IsOptional()
  @IsString()
  description?: string

  @IsString()
  endpointId: string

  @IsNumber()
  @Min(100)
  @Max(599)
  statusCode: number

  @IsOptional()
  @IsObject()
  headers?: Record<string, string>

  @IsObject()
  body: any

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(10000)
  delay?: number

  @IsOptional()
  @IsBoolean()
  isDefault?: boolean
}
```

**UpdateScenarioDto:**

- [ ] Usar `PartialType(CreateScenarioDto)`

**QueryScenariosDto:**

```typescript
export class QueryScenariosDto {
  @IsOptional()
  @IsString()
  endpointId?: string

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  isActive?: boolean
}
```

### Scenario Service - CRUD

```typescript
class ScenarioService {
  // Criar scenario
  create(userId: string, dto: CreateScenarioDto): Promise<MockScenario>

  // Listar scenarios de um endpoint
  findByEndpoint(endpointId: string): Promise<MockScenario[]>

  // Buscar scenario específico
  findOne(id: string): Promise<MockScenario>

  // Buscar scenario default de um endpoint
  findDefault(endpointId: string): Promise<MockScenario | null>

  // Atualizar scenario
  update(id: string, dto: UpdateScenarioDto): Promise<MockScenario>

  // Deletar scenario
  delete(id: string): Promise<void>

  // Ativar/desativar scenario
  toggleActive(id: string): Promise<MockScenario>

  // Definir como default
  setAsDefault(id: string): Promise<MockScenario>
}
```

### Create Scenario Implementation

```typescript
async create(userId: string, dto: CreateScenarioDto): Promise<MockScenario> {
  // Se isDefault = true, desativar default anterior
  if (dto.isDefault) {
    await this.prisma.mockScenario.updateMany({
      where: { endpointId: dto.endpointId, isDefault: true },
      data: { isDefault: false }
    });
  }

  return this.prisma.mockScenario.create({
    data: {
      ...dto,
      userId
    }
  });
}
```

### Set as Default Implementation

```typescript
async setAsDefault(id: string): Promise<MockScenario> {
  const scenario = await this.findOne(id);

  // Remover default de outros
  await this.prisma.mockScenario.updateMany({
    where: {
      endpointId: scenario.endpointId,
      isDefault: true,
      id: { not: id }
    },
    data: { isDefault: false }
  });

  // Definir este como default
  return this.prisma.mockScenario.update({
    where: { id },
    data: { isDefault: true }
  });
}
```

### findDefault Implementation

```typescript
async findDefault(endpointId: string): Promise<MockScenario | null> {
  return this.prisma.mockScenario.findFirst({
    where: {
      endpointId,
      isDefault: true,
      isActive: true
    }
  });
}
```

### Scenario Controller - Endpoints

```typescript
@Controller('scenarios')
@UseGuards(JwtAuthGuard)
export class ScenarioController {
  @Post()
  create(@CurrentUser() user, @Body() dto: CreateScenarioDto) {
    return this.service.create(user.id, dto)
  }

  @Get()
  findAll(@Query() query: QueryScenariosDto) {
    if (query.endpointId) {
      return this.service.findByEndpoint(query.endpointId)
    }
    // retornar todos scenarios do user
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id)
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateScenarioDto) {
    return this.service.update(id, dto)
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.service.delete(id)
  }

  @Patch(':id/toggle')
  toggleActive(@Param('id') id: string) {
    return this.service.toggleActive(id)
  }

  @Patch(':id/set-default')
  setAsDefault(@Param('id') id: string) {
    return this.service.setAsDefault(id)
  }
}
```

### Scenario Templates (Seed)

Criar templates comuns para facilitar:

```typescript
const SCENARIO_TEMPLATES = [
  {
    name: 'Success',
    statusCode: 200,
    description: 'Successful response',
  },
  {
    name: 'Created',
    statusCode: 201,
    description: 'Resource created successfully',
  },
  {
    name: 'Bad Request',
    statusCode: 400,
    body: { error: 'Invalid request parameters' },
  },
  {
    name: 'Unauthorized',
    statusCode: 401,
    body: { error: 'Authentication required' },
  },
  {
    name: 'Forbidden',
    statusCode: 403,
    body: { error: 'Insufficient permissions' },
  },
  {
    name: 'Not Found',
    statusCode: 404,
    body: { error: 'Resource not found' },
  },
  {
    name: 'Server Error',
    statusCode: 500,
    body: { error: 'Internal server error' },
  },
  {
    name: 'Slow Response',
    statusCode: 200,
    delay: 3000,
    description: 'Simulates slow API',
  },
]
```

- [ ] Endpoint para listar templates: `GET /scenarios/templates`
- [ ] Criar scenario a partir de template

### Scenario Validation

- [ ] Validar que statusCode está entre 100-599
- [ ] Validar que delay não excede MAX_MOCK_DELAY_MS
- [ ] Validar que body é JSON válido
- [ ] Validar que endpointId existe
- [ ] Impedir deletar scenario se é o único default

### Authorization Guards

- [ ] Apenas criador ou admin do workspace pode:
  - [ ] Atualizar scenario
  - [ ] Deletar scenario
  - [ ] Ativar/desativar scenario
- [ ] Qualquer membro do workspace pode:
  - [ ] Listar scenarios
  - [ ] Visualizar scenario

### Testes Unitários

- [ ] `tests/unit/scenario/scenario.service.spec.ts`
- [ ] Test create:
  - [ ] Cria scenario básico
  - [ ] isDefault remove default anterior
- [ ] Test setAsDefault:
  - [ ] Remove default de outros
  - [ ] Define novo como default
- [ ] Test findDefault
- [ ] Test toggleActive
- [ ] Mock Prisma calls

### Testes Integração

- [ ] `tests/integration/scenario/scenario.spec.ts`
- [ ] POST /scenarios - criar scenario
- [ ] GET /scenarios?endpointId=X - listar
- [ ] PATCH /scenarios/:id - atualizar
- [ ] DELETE /scenarios/:id - deletar
- [ ] PATCH /scenarios/:id/set-default
- [ ] Verificar authorization (403 se não autorizado)

### Documentação Swagger

- [ ] Decorators @ApiTags, @ApiOperation
- [ ] Schemas de DTOs
- [ ] Exemplos de request/response
- [ ] Status codes possíveis

### Validação

- [ ] Criar scenario com sucesso
- [ ] Listar scenarios de endpoint
- [ ] Atualizar scenario
- [ ] Deletar scenario
- [ ] Definir scenario como default
- [ ] Apenas 1 scenario default por endpoint
- [ ] `pnpm test` 100% coverage

## Próximo Passo

→ [04-mock-server-http.md](./04-mock-server-http.md) - Servir mocks via HTTP
