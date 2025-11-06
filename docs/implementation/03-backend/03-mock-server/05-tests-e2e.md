# Mock Server - Testes End-to-End

## Contexto

Testes completos cobrindo todo fluxo: criação de scenarios, geração de mocks, e serving via HTTP.

## Dependências

- Todos módulos anteriores (01-04) completos
- Database de testes configurada
- Supertest instalado

## Checkboxes

### Test Infrastructure Setup

- [ ] Criar `test/e2e/mock-server.e2e-spec.ts`
- [ ] Configurar TestingModule com todos módulos
- [ ] Setup database de testes (beforeAll)
- [ ] Cleanup database (afterAll, afterEach)
- [ ] Seed data inicial (workspace, user, API)

### Dependencies

```bash
pnpm add -D @nestjs/testing supertest
```

### Test Database Setup

```typescript
let app: INestApplication
let prisma: PrismaService

beforeAll(async () => {
  const moduleFixture = await Test.createTestingModule({
    imports: [AppModule],
  })
    .overrideProvider(ConfigService)
    .useValue({
      get: jest.fn((key) => {
        if (key === "DATABASE_URL") {
          return process.env.TEST_DATABASE_URL
        }
        return process.env[key]
      }),
    })
    .compile()

  app = moduleFixture.createNestApplication()
  prisma = app.get<PrismaService>(PrismaService)

  await app.init()
})

afterAll(async () => {
  await prisma.$disconnect()
  await app.close()
})

afterEach(async () => {
  // Limpar tabelas específicas
  await prisma.mockScenario.deleteMany()
  await prisma.endpoint.deleteMany()
  await prisma.api.deleteMany()
})
```

### Seed Test Data

```typescript
async function seedTestData() {
  const user = await prisma.user.create({
    data: {
      email: "test@example.com",
      name: "Test User",
      passwordHash: "hashed",
    },
  })

  const workspace = await prisma.workspace.create({
    data: {
      name: "Test Workspace",
      slug: "test-ws",
      ownerId: user.id,
    },
  })

  const api = await prisma.api.create({
    data: {
      name: "Test API",
      slug: "test-api",
      workspaceId: workspace.id,
      createdById: user.id,
    },
  })

  const endpoint = await prisma.endpoint.create({
    data: {
      method: "GET",
      path: "/users",
      description: "Get all users",
      apiId: api.id,
      responseSchema: {
        type: "array",
        items: {
          type: "object",
          properties: {
            id: { type: "string" },
            name: { type: "string" },
            email: { type: "string", format: "email" },
          },
        },
      },
    },
  })

  return { user, workspace, api, endpoint }
}
```

### Test Suite 1: Mock Generation

```typescript
describe("Mock Generation (E2E)", () => {
  let endpoint: Endpoint

  beforeEach(async () => {
    const data = await seedTestData()
    endpoint = data.endpoint
  })

  it("should generate mock from schema", async () => {
    const response = await request(app.getHttpServer())
      .get(`/api/mock/generator/endpoint/${endpoint.id}`)
      .expect(200)

    expect(response.body).toBeInstanceOf(Array)
    expect(response.body[0]).toHaveProperty("id")
    expect(response.body[0]).toHaveProperty("name")
    expect(response.body[0]).toHaveProperty("email")
  })

  it("should generate multiple examples", async () => {
    const response = await request(app.getHttpServer())
      .post("/api/mock/generator/preview")
      .send({
        schema: {
          type: "object",
          properties: {
            name: { type: "string" },
          },
        },
        count: 5,
      })
      .expect(200)

    expect(response.body).toHaveLength(5)
  })

  it("should cache generated mocks", async () => {
    const start1 = Date.now()
    await request(app.getHttpServer())
      .get(`/api/mock/generator/endpoint/${endpoint.id}`)
      .expect(200)
    const time1 = Date.now() - start1

    const start2 = Date.now()
    await request(app.getHttpServer())
      .get(`/api/mock/generator/endpoint/${endpoint.id}`)
      .expect(200)
    const time2 = Date.now() - start2

    // Segunda chamada deve ser mais rápida (cache hit)
    expect(time2).toBeLessThan(time1)
  })
})
```

### Test Suite 2: Scenario Management

```typescript
describe("Scenario Management (E2E)", () => {
  let user: User
  let endpoint: Endpoint
  let authToken: string

  beforeEach(async () => {
    const data = await seedTestData()
    user = data.user
    endpoint = data.endpoint

    // Get auth token (assumindo auth implementado)
    authToken = generateTestToken(user.id)
  })

  it("should create custom scenario", async () => {
    const response = await request(app.getHttpServer())
      .post("/api/mock/scenarios")
      .set("Authorization", `Bearer ${authToken}`)
      .send({
        name: "Not Found",
        endpointId: endpoint.id,
        statusCode: 404,
        body: { error: "User not found" },
        delay: 100,
      })
      .expect(201)

    expect(response.body).toHaveProperty("id")
    expect(response.body.name).toBe("Not Found")
    expect(response.body.statusCode).toBe(404)
  })

  it("should set scenario as default", async () => {
    // Criar 2 scenarios
    const scenario1 = await prisma.mockScenario.create({
      data: {
        name: "Success",
        endpointId: endpoint.id,
        statusCode: 200,
        body: { success: true },
        userId: user.id,
        isDefault: true,
      },
    })

    const scenario2 = await prisma.mockScenario.create({
      data: {
        name: "Error",
        endpointId: endpoint.id,
        statusCode: 500,
        body: { error: true },
        userId: user.id,
      },
    })

    // Definir scenario2 como default
    await request(app.getHttpServer())
      .patch(`/api/mock/scenarios/${scenario2.id}/set-default`)
      .set("Authorization", `Bearer ${authToken}`)
      .expect(200)

    // Verificar que apenas scenario2 é default
    const scenarios = await prisma.mockScenario.findMany({
      where: { endpointId: endpoint.id },
    })

    expect(scenarios.find((s) => s.id === scenario1.id)?.isDefault).toBe(false)
    expect(scenarios.find((s) => s.id === scenario2.id)?.isDefault).toBe(true)
  })

  it("should list scenarios by endpoint", async () => {
    // Criar 3 scenarios
    await prisma.mockScenario.createMany({
      data: [
        {
          name: "Success",
          endpointId: endpoint.id,
          statusCode: 200,
          body: {},
          userId: user.id,
        },
        {
          name: "Error",
          endpointId: endpoint.id,
          statusCode: 500,
          body: {},
          userId: user.id,
        },
        {
          name: "Inactive",
          endpointId: endpoint.id,
          statusCode: 200,
          body: {},
          userId: user.id,
          isActive: false,
        },
      ],
    })

    const response = await request(app.getHttpServer())
      .get(`/api/mock/scenarios?endpointId=${endpoint.id}`)
      .set("Authorization", `Bearer ${authToken}`)
      .expect(200)

    expect(response.body).toHaveLength(3)
  })

  it("should filter active scenarios", async () => {
    await prisma.mockScenario.createMany({
      data: [
        {
          name: "Active",
          endpointId: endpoint.id,
          statusCode: 200,
          body: {},
          userId: user.id,
          isActive: true,
        },
        {
          name: "Inactive",
          endpointId: endpoint.id,
          statusCode: 200,
          body: {},
          userId: user.id,
          isActive: false,
        },
      ],
    })

    const response = await request(app.getHttpServer())
      .get(`/api/mock/scenarios?endpointId=${endpoint.id}&isActive=true`)
      .set("Authorization", `Bearer ${authToken}`)
      .expect(200)

    expect(response.body).toHaveLength(1)
    expect(response.body[0].name).toBe("Active")
  })
})
```

### Test Suite 3: Mock Server HTTP

```typescript
describe("Mock Server HTTP (E2E)", () => {
  let workspace: Workspace
  let api: Api
  let endpoint: Endpoint

  beforeEach(async () => {
    const data = await seedTestData()
    workspace = data.workspace
    api = data.api
    endpoint = data.endpoint
  })

  it("should serve auto-generated mock", async () => {
    const mockUrl = `/${workspace.id}/${api.id}/GET/users`

    const response = await request(app.getHttpServer()).get(mockUrl).expect(200)

    expect(response.body).toBeInstanceOf(Array)
    expect(response.body[0]).toHaveProperty("id")
    expect(response.body[0]).toHaveProperty("name")
    expect(response.body[0]).toHaveProperty("email")
  })

  it("should serve custom scenario via header", async () => {
    // Criar scenario de erro
    await prisma.mockScenario.create({
      data: {
        name: "Not Found",
        endpointId: endpoint.id,
        statusCode: 404,
        body: { error: "Users not found" },
        userId: workspace.ownerId,
        isActive: true,
      },
    })

    const response = await request(app.getHttpServer())
      .get(`/${workspace.id}/${api.id}/GET/users`)
      .set("X-Mock-Scenario", "Not Found")
      .expect(404)

    expect(response.body).toEqual({ error: "Users not found" })
  })

  it("should use default scenario if no header", async () => {
    // Criar scenario default
    await prisma.mockScenario.create({
      data: {
        name: "Success",
        endpointId: endpoint.id,
        statusCode: 200,
        body: { custom: "data" },
        userId: workspace.ownerId,
        isDefault: true,
        isActive: true,
      },
    })

    const response = await request(app.getHttpServer())
      .get(`/${workspace.id}/${api.id}/GET/users`)
      .expect(200)

    expect(response.body).toEqual({ custom: "data" })
  })

  it("should apply delay from scenario", async () => {
    await prisma.mockScenario.create({
      data: {
        name: "Slow",
        endpointId: endpoint.id,
        statusCode: 200,
        body: { data: "slow" },
        delay: 500,
        userId: workspace.ownerId,
        isDefault: true,
        isActive: true,
      },
    })

    const start = Date.now()
    await request(app.getHttpServer())
      .get(`/${workspace.id}/${api.id}/GET/users`)
      .expect(200)
    const elapsed = Date.now() - start

    expect(elapsed).toBeGreaterThanOrEqual(500)
  })

  it("should override delay via header", async () => {
    const start = Date.now()
    await request(app.getHttpServer())
      .get(`/${workspace.id}/${api.id}/GET/users`)
      .set("X-Mock-Delay", "1000")
      .expect(200)
    const elapsed = Date.now() - start

    expect(elapsed).toBeGreaterThanOrEqual(1000)
  })

  it("should override status code via header", async () => {
    await request(app.getHttpServer())
      .get(`/${workspace.id}/${api.id}/GET/users`)
      .set("X-Mock-Status", "201")
      .expect(201)
  })

  it("should return 404 for non-existent endpoint", async () => {
    const response = await request(app.getHttpServer())
      .get(`/${workspace.id}/${api.id}/GET/non-existent`)
      .expect(404)

    expect(response.body).toHaveProperty("error")
    expect(response.body.error).toContain("not found")
  })

  it("should handle nested paths", async () => {
    // Criar endpoint com nested path
    const nestedEndpoint = await prisma.endpoint.create({
      data: {
        method: "GET",
        path: "/users/:id/posts",
        apiId: api.id,
        responseSchema: {
          type: "array",
          items: { type: "object" },
        },
      },
    })

    const response = await request(app.getHttpServer())
      .get(`/${workspace.id}/${api.id}/GET/users/123/posts`)
      .expect(200)

    expect(response.body).toBeInstanceOf(Array)
  })
})
```

### Test Suite 4: Integration Flow

```typescript
describe("Complete Integration Flow (E2E)", () => {
  it("should complete full mock lifecycle", async () => {
    // 1. Seed initial data
    const { user, workspace, api, endpoint } = await seedTestData()
    const authToken = generateTestToken(user.id)

    // 2. Criar scenario customizado
    const createScenarioRes = await request(app.getHttpServer())
      .post("/api/mock/scenarios")
      .set("Authorization", `Bearer ${authToken}`)
      .send({
        name: "Success with Data",
        endpointId: endpoint.id,
        statusCode: 200,
        body: {
          users: [
            { id: "1", name: "Alice" },
            { id: "2", name: "Bob" },
          ],
        },
        delay: 100,
        isDefault: true,
      })
      .expect(201)

    const scenarioId = createScenarioRes.body.id

    // 3. Servir mock usando scenario default
    const mockRes = await request(app.getHttpServer())
      .get(`/${workspace.id}/${api.id}/GET/users`)
      .expect(200)

    expect(mockRes.body.users).toHaveLength(2)
    expect(mockRes.body.users[0].name).toBe("Alice")

    // 4. Criar outro scenario (erro)
    await request(app.getHttpServer())
      .post("/api/mock/scenarios")
      .set("Authorization", `Bearer ${authToken}`)
      .send({
        name: "Server Error",
        endpointId: endpoint.id,
        statusCode: 500,
        body: { error: "Internal server error" },
      })
      .expect(201)

    // 5. Usar scenario específico via header
    const errorRes = await request(app.getHttpServer())
      .get(`/${workspace.id}/${api.id}/GET/users`)
      .set("X-Mock-Scenario", "Server Error")
      .expect(500)

    expect(errorRes.body.error).toBe("Internal server error")

    // 6. Atualizar scenario default
    await request(app.getHttpServer())
      .patch(`/api/mock/scenarios/${scenarioId}`)
      .set("Authorization", `Bearer ${authToken}`)
      .send({
        body: {
          users: [{ id: "1", name: "Updated Alice" }],
        },
      })
      .expect(200)

    // 7. Verificar mock atualizado
    const updatedRes = await request(app.getHttpServer())
      .get(`/${workspace.id}/${api.id}/GET/users`)
      .expect(200)

    expect(updatedRes.body.users[0].name).toBe("Updated Alice")
  })
})
```

### Performance Tests

```typescript
describe("Performance (E2E)", () => {
  it("should handle concurrent requests", async () => {
    const { workspace, api } = await seedTestData()
    const mockUrl = `/${workspace.id}/${api.id}/GET/users`

    const requests = Array(50)
      .fill(null)
      .map(() => request(app.getHttpServer()).get(mockUrl))

    const start = Date.now()
    const responses = await Promise.all(requests)
    const elapsed = Date.now() - start

    responses.forEach((res) => {
      expect(res.status).toBe(200)
    })

    // 50 requests devem completar em < 2 segundos
    expect(elapsed).toBeLessThan(2000)
  })
})
```

### Coverage Report

- [ ] `pnpm test:cov` no mock-server
- [ ] Verificar 100% coverage em:
  - [ ] generator.service.ts
  - [ ] scenario.service.ts
  - [ ] server.service.ts
  - [ ] All controllers
- [ ] Report HTML em `coverage/lcov-report/index.html`

### CI Integration

- [ ] Adicionar em `.github/workflows/test.yml`:
  ```yaml
  - name: Test Mock Server
    run: |
      cd apps/mock-server
      pnpm test:cov
      pnpm test:e2e
  ```

### Validação Final

- [ ] Todos testes unitários passando ✅
- [ ] Todos testes integração passando ✅
- [ ] Todos testes E2E passando ✅
- [ ] Coverage 100% ✅
- [ ] `pnpm lint` sem warnings ✅
- [ ] `pnpm build` sem erros ✅
- [ ] Docker build funcionando ✅
- [ ] Documentação completa ✅

## Mock Server Completo! 🎉

**Próximo serviço:**

→ [04-analytics/01-setup.md](../../04-analytics/01-setup.md) - Analytics Service
