# AI Serviço - Code & Docs Generation

## Contexto

Features de geração automática: documentação de endpoints, client code (SDKs), e mock scenarios.

## Dependências

- 03-rag-chat.md completo
- OpenAI GPT-4o-mini configurado

## Checkboxes

### Generation Module

- [ ] Criar `src/modules/generation/generation.module.ts`
- [ ] Criar `src/modules/generation/generation.service.ts`
- [ ] Criar `src/modules/generation/generation.controller.ts`
- [ ] Registrar no app.module.ts

### Documentation Generation

```typescript
@Injectable()
export class GenerationService {
  constructor(private openai: OpenAIService) {}

  // Gera descrição para um endpoint
  async generateEndpointDescription(endpoint: Endpoint): Promise<string> {
    const prompt = `Generate a clear, concise description for this API endpoint:

Method: ${endpoint.method}
Path: ${endpoint.path}
Parameters: ${JSON.stringify(endpoint.parameters || [])}
Request Body: ${JSON.stringify(endpoint.requestSchema || {})}
Response: ${JSON.stringify(endpoint.responseSchema || {})}

Write a 2-3 sentence description explaining what this endpoint does, what it expects, and what it returns.`

    const response = await this.openai.getClient().chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You are an API documentation expert.' },
        { role: 'user', content: prompt },
      ],
      temperature: 0.7,
      max_tokens: 200,
    })

    return response.choices[0].message.content.trim()
  }
}
```

### Code Generation - TypeScript

```typescript
async generateTypescriptClient(endpoint: Endpoint): Promise<string> {
  const prompt = `Generate a TypeScript function to call this API endpoint:

Method: ${endpoint.method}
Path: ${endpoint.path}
Parameters: ${JSON.stringify(endpoint.parameters || [])}
Request Body: ${JSON.stringify(endpoint.requestSchema || {})}
Response: ${JSON.stringify(endpoint.responseSchema || {})}

Requirements:
- Use fetch API
- Include TypeScript types
- Handle errors properly
- Add JSDoc comments

Generate only the code, no explanations.`;

  const response = await this.openai.getClient().chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: 'You are an expert TypeScript developer. Generate clean, type-safe code.'
      },
      { role: 'user', content: prompt }
    ],
    temperature: 0.3, // Lower temp for consistent code
    max_tokens: 1000
  });

  return response.choices[0].message.content.trim();
}
```

### Code Generation - Python

```typescript
async generatePythonClient(endpoint: Endpoint): Promise<string> {
  const prompt = `Generate a Python function using requests library:

Method: ${endpoint.method}
Path: ${endpoint.path}
Parameters: ${JSON.stringify(endpoint.parameters || [])}
Request Body: ${JSON.stringify(endpoint.requestSchema || {})}
Response: ${JSON.stringify(endpoint.responseSchema || {})}

Requirements:
- Use requests library
- Include type hints (Python 3.9+)
- Handle errors with try/except
- Add docstring

Generate only the code.`;

  const response = await this.openai.getClient().chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: 'You are an expert Python developer.'
      },
      { role: 'user', content: prompt }
    ],
    temperature: 0.3,
    max_tokens: 1000
  });

  return response.choices[0].message.content.trim();
}
```

### Mock Scenarios Generation

```typescript
async generateMockScenarios(endpoint: Endpoint): Promise<MockScenario[]> {
  const prompt = `Generate 3-5 realistic mock scenarios for this endpoint:

Method: ${endpoint.method}
Path: ${endpoint.path}
Response Schema: ${JSON.stringify(endpoint.responseSchema || {})}

Generate scenarios:
1. Success (200)
2. Created (201) if POST
3. Bad Request (400)
4. Not Found (404)
5. Server Error (500)

For each scenario, provide:
- name (string)
- statusCode (number)
- body (JSON object matching schema)

Return as JSON array.`;

  const response = await this.openai.getClient().chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: 'You are an API testing expert. Generate realistic mock data.'
      },
      { role: 'user', content: prompt }
    ],
    response_format: { type: 'json_object' },
    temperature: 0.7,
    max_tokens: 1500
  });

  const scenarios = JSON.parse(response.choices[0].message.content);
  return scenarios.scenarios || [];
}
```

### Generation Controller

```typescript
@Controller('generation')
@UseGuards(JwtAuthGuard)
export class GenerationController {
  constructor(private generationService: GenerationService) {}

  @Post('endpoint/:id/description')
  async generateDescription(@Param('id') id: string) {
    const endpoint = await this.prisma.endpoint.findUnique({
      where: { id },
    })

    const description =
      await this.generationService.generateEndpointDescription(endpoint)

    // Opcionalmente, salvar no endpoint
    await this.prisma.endpoint.update({
      where: { id },
      data: { description },
    })

    return { description }
  }

  @Get('endpoint/:id/code')
  async generateCode(
    @Param('id') id: string,
    @Query('language') language: 'typescript' | 'python' | 'go',
  ) {
    const endpoint = await this.prisma.endpoint.findUnique({
      where: { id },
    })

    let code: string

    switch (language) {
      case 'typescript':
        code = await this.generationService.generateTypescriptClient(endpoint)
        break
      case 'python':
        code = await this.generationService.generatePythonClient(endpoint)
        break
      default:
        throw new BadRequestException('Unsupported language')
    }

    return { code, language }
  }

  @Post('endpoint/:id/mock-scenarios')
  async generateMockScenarios(@Param('id') id: string) {
    const endpoint = await this.prisma.endpoint.findUnique({
      where: { id },
    })

    const scenarios =
      await this.generationService.generateMockScenarios(endpoint)

    return { scenarios }
  }

  @Post('api/:id/generate-docs')
  async generateAPIDocumentation(@Param('id') id: string) {
    const api = await this.prisma.api.findUnique({
      where: { id },
      include: { endpoints: true },
    })

    // Gerar descrições para todos endpoints sem descrição
    const updates = await Promise.all(
      api.endpoints
        .filter((e) => !e.description)
        .map(async (endpoint) => {
          const description =
            await this.generationService.generateEndpointDescription(endpoint)

          await this.prisma.endpoint.update({
            where: { id: endpoint.id },
            data: { description },
          })

          return { endpointId: endpoint.id, description }
        }),
    )

    return {
      success: true,
      generated: updates.length,
      updates,
    }
  }
}
```

### Caching Generated Code

```typescript
// Cache código gerado por 1 hora
async generateCode(
  endpointId: string,
  language: string
): Promise<string> {
  const cacheKey = `code:${endpointId}:${language}`;

  const cached = await this.cache.get<string>(cacheKey);
  if (cached) return cached;

  const code = await this.generate(endpointId, language);

  await this.cache.set(cacheKey, code, 3600); // 1h TTL

  return code;
}
```

### Testes Unitários

- [ ] `tests/unit/generation/generation.service.spec.ts`
- [ ] Test generateEndpointDescription
- [ ] Test generateTypescriptClient
- [ ] Test generatePythonClient
- [ ] Test generateMockScenarios
- [ ] Mock OpenAI API

### Testes Integração

- [ ] `tests/integration/generation/generation.spec.ts`
- [ ] POST /generation/endpoint/:id/description
- [ ] GET /generation/endpoint/:id/code?language=typescript
- [ ] Verificar código válido (syntax check)
- [ ] POST /generation/endpoint/:id/mock-scenarios
- [ ] Verificar scenarios válidos

### Validação

- [ ] Descrições geradas são relevantes ✅
- [ ] Código gerado é válido sintaticamente ✅
- [ ] Mock scenarios são realistas ✅
- [ ] Cache funciona ✅
- [ ] `pnpm test` 100% coverage ✅

## Próximo Passo

→ [05-tests-e2e.md](./05-tests-e2e.md) - Testes E2E completos do AI Service
