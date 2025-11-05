# ADR-003: Framework Backend e Arquitetura de Microsserviços

## Contexto

Backend do **Dev Platform** deve suportar:

- 4-5 microsserviços independentes (API Gateway, Management, Mock Server, Analytics)
- Comunicação inter-service type-safe
- Processamento high-throughput (10k+ req/min por serviço)
- Organização consistente de código entre serviços
- Auto-geração de documentação OpenAPI

Requisitos:

- Dependency injection para testabilidade
- Arquitetura modular para isolamento de serviços
- Suporte nativo a microsserviços
- Tratamento de erros production-grade
- Hooks de observabilidade (logging, métricas, tracing)

## Decisão

Adotar **NestJS** com padrão de arquitetura modular de microsserviços.

### Justificativa Técnica

**Arquitetura do Framework:**
NestJS fornece estrutura opinativa combinando paradigmas OOP, FP e FRP. Construído sobre Express (padrão) ou Fastify, abstrai camada HTTP mantendo extensibilidade do framework.

Benefícios arquiteturais chave:

- Dependency Injection via decorators TypeScript reduz acoplamento
- Sistema de módulos habilita bounded contexts por Domain-Driven Design
- Padrão Controllers, Services, Repositories força separação de responsabilidades
- Interceptors, Guards, Pipes fornecem implementação de cross-cutting concerns

**Suporte a Microsserviços:**
Abstração nativa de transport layer para múltiplos protocolos:

```typescript
// Baseado em mensagens (Redis, NATS, MQTT)
@MessagePattern({ cmd: 'get_user' })
getUser(data: string) { }

// Baseado em eventos (async, fire-and-forget)
@EventPattern('user_created')
handleUserCreated(data: Record<string, unknown>) { }
```

Suporta TCP, Redis, NATS, RabbitMQ, Kafka, gRPC out-of-box. Padrão event-driven habilita workflows complexos sem tight coupling.

**Características de Performance:**

- Adapter Fastify: 20k+ req/sec (benchmark em Node 20)
- Cache de request/response via interceptors integrados
- Connection pooling automático (database, Redis)
- Async/await throughout, I/O non-blocking

**Experiência do Desenvolvedor:**

- CLI NestJS gera boilerplate (services, controllers, modules)
- Hot reload com `npm run start:dev`
- OpenAPI/Swagger auto-gerado de decorators
- Validação integrada via `class-validator`
- Utilitários de teste (Test.createTestingModule)

**Integração TypeScript:**

- Type checking estrito entre microsserviços
- Pacote de types compartilhados no monorepo
- DTOs com class-transformer para validação runtime
- Decorators genéricos preservam informação de tipo

### Padrão de Arquitetura: Microsserviços Modulares

**Boundaries de Serviço (DDD Bounded Contexts):**

1. **API Gateway**: Autenticação, rate limiting, roteamento de requests
2. **Management Service**: Operações CRUD para APIs, endpoints, collections
3. **Mock Server**: Geração dinâmica de respostas, handling de scenarios
4. **Analytics Service**: Ingestão de logs, agregação de métricas, alerting

Cada serviço opera independentemente com:

- Aplicação NestJS separada
- Schema de database dedicado (isolamento lógico)
- Pipeline de deployment independente
- Configuração de environment específica do serviço

**Comunicação Inter-Service:**

- Síncrona: HTTP/REST para clientes externos (API Gateway)
- Assíncrona: Redis Pub/Sub para eventos internos (loose coupling)
- Híbrida: Padrão request-response via Redis para RPC baixa latência

```typescript
// Service A emite evento
this.client.emit('api_updated', { id, changes });

// Service B processa evento
@EventPattern('api_updated')
handleApiUpdate(data: ApiUpdatedEvent) {
  // Atualiza cache local
}
```

**Tratamento de Erros:**

- Exception filters para transformação centralizada de erros
- Exceptions customizadas estendendo HttpException
- Logging automático de erros com correlation IDs
- Padrão circuit breaker para dependências externas

**Observabilidade:**

- Winston/Pino para structured logging
- Métricas Prometheus via prom-client
- Injeção de correlation ID via middleware
- Endpoints de health check (`/health`, `/metrics`)

### Alternativas Consideradas

**Express.js (Raw):**
Abstração mínima mas requer decisões arquiteturais manuais. Sem estrutura padronizada de projeto leva a codebases inconsistentes entre microsserviços. Falta padrões nativos de microsserviços.

**Fastify:**
Performance excelente mas features mínimas de framework. Requer implementação customizada de DI, validação e cross-cutting concerns. Melhor como adapter NestJS que standalone.

**Hono:**
Edge-optimized, lightweight, mas ecossistema imaturo. Ferramental insuficiente para microsserviços enterprise.

## Consequências

### Positivas

**Consistência de Código:**

- Estrutura de projeto uniforme entre todos microsserviços
- Módulos compartilhados (logging, auth, validation) via monorepo
- Fluxo de request previsível: Middleware → Guards → Interceptors → Controller → Service

**Testabilidade:**

- Dependency injection simplifica mocking
- Test utilities reduzem boilerplate
- Testes de integração via `@nestjs/testing` com supertest

**Escalabilidade:**

- Cada microsserviço escala independentemente
- Design stateless habilita scaling horizontal
- Load balancing via Kubernetes ou Railway

**Manutenibilidade:**

- Boundaries de módulo claros previnem sprawl de código
- Docs OpenAPI automáticos reduzem burden de manutenção
- TypeScript captura erros em compile time

### Negativas

**Curva de Aprendizado:**

- Decorators, DI e sistema de módulos requerem treinamento
- Complexidade de microsserviços (distributed tracing, eventual consistency)
- Mais boilerplate que frameworks minimalistas

**Tamanho de Bundle:**

- Aplicação base NestJS: ~20MB node_modules
- Dependências core (reflect-metadata, rxjs) adicionam overhead
- Aceitável para backend, problemático para serverless cold starts

**Framework Lock-in:**

- Migração para outros frameworks Node.js requer refatoração significativa
- Arquitetura baseada em decorators não transferível
- Padrões específicos NestJS (Guards, Interceptors) criam vendor dependency

### Estratégias de Mitigação

**Treinamento:**
Manter documentação interna para padrões e anti-patterns NestJS. Conduzir code reviews focados em arquitetura.

**Monitoramento de Performance:**
Implementar ferramental APM (Sentry, Datadog) para identificar gargalos. Definir SLA: latência p95 <200ms para operações síncronas.

**Desacoplamento:**
Usar Repository pattern para abstrair acesso a dados. Lógica de domínio em service layer permanece framework-agnostic.

## Referências

- [Documentação NestJS](https://docs.nestjs.com)
- [NestJS Microservices](https://docs.nestjs.com/microservices/basics)
- [Building Scalable Backend with NestJS](https://dev.to/abdulkareemtpm/building-a-scalable-backend-with-nestjs-microservices-a-blueprint-for-modern-architecture-4b7a)
- [Padrões de Arquitetura NestJS](https://medium.com/@vitaly.bexterev12/exploring-microservices-architecture-with-nestjs-popular-patterns-9fda42e6669d)
- [Domain-Driven Design com NestJS](https://www.springfuse.com/microservice-architecture-nestjs-guide/)
