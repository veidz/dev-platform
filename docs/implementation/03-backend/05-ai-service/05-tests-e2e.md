# AI Service - Testes End-to-End

## Contexto

Testes completos cobrindo todo fluxo de AI features: indexação, RAG, chat, geração.

## Dependências

- Todos módulos anteriores (01-04) completos
- OpenAI API mock configurado
- Qdrant test instance

## Checkboxes

### Test Infrastructure Setup

- [ ] Criar `test/e2e/ai-service.e2e-spec.ts`
- [ ] Configurar TestingModule completo
- [ ] Setup Qdrant test collection
- [ ] Mock OpenAI API calls
- [ ] Seed test data

### Mock OpenAI API

```typescript
// Mock OpenAI para testes
class MockOpenAIService {
  getClient() {
    return {
      embeddings: {
        create: jest.fn().mockResolvedValue({
          data: [{ embedding: Array(1536).fill(0.1) }],
        }),
      },
      chat: {
        completions: {
          create: jest.fn().mockResolvedValue({
            choices: [{ message: { content: "Mocked AI response" } }],
          }),
        },
      },
    }
  }
}
```

### Test Suite 1: Embeddings & Indexing

```typescript
describe("Embeddings & Indexing (E2E)", () => {
  let api: Api
  let endpoint: Endpoint

  beforeEach(async () => {
    api = await prisma.api.create({
      data: {
        name: "Test API",
        workspaceId: workspace.id,
        createdById: user.id,
      },
    })

    endpoint = await prisma.endpoint.create({
      data: {
        method: "GET",
        path: "/users",
        description: "Get all users",
        apiId: api.id,
        responseSchema: { type: "array" },
      },
    })
  })

  it("should generate embeddings", async () => {
    const text = "Test document"

    const response = await request(app.getHttpServer())
      .post("/api/ai/embeddings/generate")
      .send({ text })
      .expect(200)

    expect(response.body.embedding).toHaveLength(1536)
  })

  it("should index API", async () => {
    await request(app.getHttpServer())
      .post(`/api/ai/indexing/api/${api.id}`)
      .expect(201)

    // Verificar no Qdrant
    const indexed = await prisma.documentIndex.findMany({
      where: { workspaceId: workspace.id },
    })

    expect(indexed.length).toBeGreaterThan(0)
  })

  it("should search indexed documents", async () => {
    // Indexar primeiro
    await indexingService.indexAPI(api.id)

    // Buscar
    const response = await request(app.getHttpServer())
      .get("/api/ai/search")
      .query({
        query: "users endpoint",
        workspaceId: workspace.id,
      })
      .expect(200)

    expect(response.body.results).toBeInstanceOf(Array)
    expect(response.body.results[0]).toHaveProperty("text")
    expect(response.body.results[0]).toHaveProperty("score")
  })
})
```

### Test Suite 2: Chat & RAG

```typescript
describe("Chat & RAG (E2E)", () => {
  let conversation: ChatConversation

  beforeEach(async () => {
    // Indexar dados de teste
    await indexingService.indexAPI(api.id)

    // Criar conversa
    conversation = await prisma.chatConversation.create({
      data: {
        userId: user.id,
        workspaceId: workspace.id,
      },
    })
  })

  it("should create conversation", async () => {
    const response = await request(app.getHttpServer())
      .post("/api/ai/chat/conversations")
      .set("Authorization", `Bearer ${authToken}`)
      .expect(201)

    expect(response.body).toHaveProperty("id")
    expect(response.body.userId).toBe(user.id)
  })

  it("should stream chat response", async () => {
    const chunks: string[] = []

    // SSE client
    const eventSource = new EventSource(
      `${baseURL}/api/ai/chat/stream?conversationId=${conversation.id}&message=What endpoints are available?`
    )

    await new Promise((resolve) => {
      eventSource.onmessage = (event) => {
        const data = JSON.parse(event.data)
        chunks.push(data.chunk)
      }

      eventSource.onerror = () => {
        eventSource.close()
        resolve()
      }
    })

    expect(chunks.length).toBeGreaterThan(0)

    // Verificar mensagens salvas
    const messages = await prisma.chatMessage.findMany({
      where: { conversationId: conversation.id },
    })

    expect(messages).toHaveLength(2) // user + assistant
    expect(messages[0].role).toBe("user")
    expect(messages[1].role).toBe("assistant")
  })

  it("should include sources in response", async () => {
    await chatService.chat(
      conversation.id,
      "Tell me about the users endpoint",
      workspace.id
    )

    const assistantMsg = await prisma.chatMessage.findFirst({
      where: {
        conversationId: conversation.id,
        role: "assistant",
      },
    })

    expect(assistantMsg.metadata).toHaveProperty("sources")
    expect(assistantMsg.metadata.sources).toBeInstanceOf(Array)
  })

  it("should list conversations", async () => {
    // Criar múltiplas conversas
    await prisma.chatConversation.createMany({
      data: [
        { userId: user.id, workspaceId: workspace.id },
        { userId: user.id, workspaceId: workspace.id },
      ],
    })

    const response = await request(app.getHttpServer())
      .get("/api/ai/chat/conversations")
      .set("Authorization", `Bearer ${authToken}`)
      .expect(200)

    expect(response.body).toHaveLength(3) // incluindo beforeEach
  })
})
```

### Test Suite 3: Generation

```typescript
describe("Generation (E2E)", () => {
  it("should generate endpoint description", async () => {
    const response = await request(app.getHttpServer())
      .post(`/api/ai/generation/endpoint/${endpoint.id}/description`)
      .set("Authorization", `Bearer ${authToken}`)
      .expect(200)

    expect(response.body.description).toBeTruthy()
    expect(response.body.description.length).toBeGreaterThan(10)

    // Verificar salvo no DB
    const updated = await prisma.endpoint.findUnique({
      where: { id: endpoint.id },
    })
    expect(updated.description).toBe(response.body.description)
  })

  it("should generate TypeScript code", async () => {
    const response = await request(app.getHttpServer())
      .get(`/api/ai/generation/endpoint/${endpoint.id}/code`)
      .query({ language: "typescript" })
      .set("Authorization", `Bearer ${authToken}`)
      .expect(200)

    expect(response.body.code).toContain("fetch")
    expect(response.body.code).toContain("interface")
    expect(response.body.language).toBe("typescript")
  })

  it("should generate Python code", async () => {
    const response = await request(app.getHttpServer())
      .get(`/api/ai/generation/endpoint/${endpoint.id}/code`)
      .query({ language: "python" })
      .set("Authorization", `Bearer ${authToken}`)
      .expect(200)

    expect(response.body.code).toContain("requests")
    expect(response.body.code).toContain("def ")
  })

  it("should generate mock scenarios", async () => {
    const response = await request(app.getHttpServer())
      .post(`/api/ai/generation/endpoint/${endpoint.id}/mock-scenarios`)
      .set("Authorization", `Bearer ${authToken}`)
      .expect(200)

    expect(response.body.scenarios).toBeInstanceOf(Array)
    expect(response.body.scenarios.length).toBeGreaterThan(2)

    const scenario = response.body.scenarios[0]
    expect(scenario).toHaveProperty("name")
    expect(scenario).toHaveProperty("statusCode")
    expect(scenario).toHaveProperty("body")
  })
})
```

### Test Suite 4: Integration Flow

```typescript
describe("Complete AI Flow (E2E)", () => {
  it("should complete full AI lifecycle", async () => {
    // 1. Criar API e endpoint
    const api = await prisma.api.create({
      data: {
        name: "Payments API",
        workspaceId: workspace.id,
        createdById: user.id,
      },
    })

    const endpoint = await prisma.endpoint.create({
      data: {
        method: "POST",
        path: "/payments",
        apiId: api.id,
        requestSchema: {
          type: "object",
          properties: {
            amount: { type: "number" },
            currency: { type: "string" },
          },
        },
      },
    })

    // 2. Gerar descrição automática
    const descRes = await request(app.getHttpServer())
      .post(`/api/ai/generation/endpoint/${endpoint.id}/description`)
      .set("Authorization", `Bearer ${authToken}`)
      .expect(200)

    expect(descRes.body.description).toBeTruthy()

    // 3. Indexar API
    await request(app.getHttpServer())
      .post(`/api/ai/indexing/api/${api.id}`)
      .expect(201)

    // 4. Criar conversa e perguntar sobre API
    const convRes = await request(app.getHttpServer())
      .post("/api/ai/chat/conversations")
      .set("Authorization", `Bearer ${authToken}`)
      .expect(201)

    const conversationId = convRes.body.id

    // 5. Chat perguntando sobre payments endpoint
    const chatRes = await chatService.chat(
      conversationId,
      "How do I create a payment?",
      workspace.id
    )

    // Coletar resposta
    let fullResponse = ""
    for await (const chunk of chatRes) {
      fullResponse += chunk
    }

    expect(fullResponse).toBeTruthy()
    expect(fullResponse.toLowerCase()).toContain("payment")

    // 6. Gerar código client
    const codeRes = await request(app.getHttpServer())
      .get(`/api/ai/generation/endpoint/${endpoint.id}/code`)
      .query({ language: "typescript" })
      .set("Authorization", `Bearer ${authToken}`)
      .expect(200)

    expect(codeRes.body.code).toContain("/payments")
  })
})
```

### Cost Tracking Test

```typescript
it("should track AI usage and costs", async () => {
  const initialLogs = await prisma.aiUsageLog.count()

  // Fazer múltiplas operações AI
  await generationService.generateEndpointDescription(endpoint)
  await chatService.chat(conversation.id, "test", workspace.id)

  const finalLogs = await prisma.aiUsageLog.count()

  expect(finalLogs).toBeGreaterThan(initialLogs)

  const logs = await prisma.aiUsageLog.findMany({
    where: { workspaceId: workspace.id },
  })

  expect(logs[0]).toHaveProperty("model")
  expect(logs[0]).toHaveProperty("tokensUsed")
  expect(logs[0]).toHaveProperty("cost")
})
```

### Performance Test

```typescript
it("should handle concurrent requests", async () => {
  const requests = Array(20)
    .fill(null)
    .map(() => indexingService.indexAPI(api.id))

  const start = Date.now()
  await Promise.all(requests)
  const elapsed = Date.now() - start

  // 20 indexações devem completar em < 10 segundos
  expect(elapsed).toBeLessThan(10000)
})
```

### Coverage Report

- [ ] `pnpm test:cov` no ai-service
- [ ] Verificar 100% coverage em todos services
- [ ] Report HTML em `coverage/lcov-report/index.html`

### CI Integration

```yaml
- name: Test AI Service
  run: |
    cd apps/ai-service
    pnpm test:cov
    pnpm test:e2e
  env:
    OPENAI_API_KEY: ${{ secrets.OPENAI_API_KEY }}
```

### Validação Final

- [ ] Embeddings gerados ✅
- [ ] Indexação funciona ✅
- [ ] Search retorna relevante ✅
- [ ] Chat RAG funciona ✅
- [ ] Streaming SSE funciona ✅
- [ ] Geração de código válida ✅
- [ ] Geração de docs relevante ✅
- [ ] Mock scenarios realistas ✅
- [ ] `pnpm test` 100% coverage ✅

## Próximo Passo

✅ **AI Service Completo!**

→ [04-deployment/01-setup.md](../../04-deployment/01-setup.md) - Deployment
