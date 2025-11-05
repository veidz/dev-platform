# ADR-004: Padrão de Comunicação entre Microsserviços

## Contexto

Microsserviços do **Dev Platform** requerem comunicação síncrona (request-response) e assíncrona (event-driven). Requisitos: baixa latência (<100ms p95), tolerância a falhas, ordenação de mensagens e suporte a consistência eventual.

Cenários de comunicação:

- API Gateway → Management Service: Síncrono (operações CRUD)
- Management Service → Analytics Service: Assíncrono (event logging)
- Mock Server → Management Service: Híbrido (recuperação de config + notificações de mudança)

## Decisão

Implementar **padrão de comunicação híbrido** usando:

- **HTTP/REST** para comunicação externa client-to-gateway
- **Redis Pub/Sub** para messaging event-driven interno
- **Request-Response sobre Redis** para RPC de baixa latência entre serviços

### Justificativa Técnica

**Redis como Message Broker:**

- Performance in-memory: <1ms latência para pub/sub
- Conexão persistente reduz overhead vs HTTP
- Pattern matching para roteamento baseado em tópicos
- Expiração de mensagens baseada em TTL previne dados stale
- Clustering para alta disponibilidade

**Padrões de Comunicação:**

**1. Request-Response (RPC):**

```typescript
// Caller (Gateway)
const result = await this.client.send('create_api', payload).toPromise();

// Handler (Management Service)
@MessagePattern('create_api')
createApi(data: CreateApiDto): Promise<ApiEntity> { }
```

Usar para: Operações CRUD, recuperação de dados, requests de validação
Latência: p95 <50ms

**2. Event-Driven (Pub/Sub):**

```typescript
// Publisher
this.client.emit('api.created', { id, timestamp });

// Subscriber (múltiplos handlers possíveis)
@EventPattern('api.created')
handleApiCreated(data: ApiCreatedEvent) { }
```

Usar para: Audit logging, analytics, invalidação de cache, notificações
Fire-and-forget, sem resposta esperada

**3. HTTP/REST (Externo):**
API Gateway expõe endpoints REST para clientes. Traduz para mensagens Redis internas.

**Vantagens:**

- Redis elimina overhead HTTP (connection pooling, TLS handshake)
- Pub/sub suporta comunicação 1-to-N (evento único, múltiplos subscribers)
- Message patterns habilitam service discovery (sem URLs hardcoded)
- Backpressure handling via monitoramento de profundidade da fila Redis

### Alternativas Consideradas

**RabbitMQ:**
Feature-rich mas adiciona complexidade operacional (gestão de cluster, persistência em disco). Overkill para 4-5 serviços com throughput modesto (<10k msg/sec).

**Apache Kafka:**
Excelente para event streaming high-throughput mas requer infraestrutura significativa (Zookeeper, brokers). Melhor para >100k msg/sec com requisitos de retenção de dados.

**gRPC:**
Performance superior para RPC mas requer gerenciamento de arquivos .proto. Benefício de type safety negado por types TypeScript compartilhados no monorepo. Multiplexing HTTP/2 desnecessário dada performance Redis.

**HTTP Direto:**
Simples mas tight coupling. Service discovery requer registro externo. Connection pooling overhead em escala.

## Consequências

### Positivas

**Performance:**

- Operações in-memory Redis: latência <1ms p99
- Elimina overhead de conexão HTTP
- Protocolo binário eficiente (RESP)

**Escalabilidade:**

- Scaling horizontal via Redis Cluster
- Múltiplas instâncias de serviço subscrevem aos mesmos patterns
- Load balancing automático via round-robin Redis

**Resiliência:**

- Retry de mensagens com exponential backoff (built-in NestJS)
- Dead letter queue para mensagens falhadas
- Integração circuit breaker via @nestjs/microservices

**Experiência do Desenvolvedor:**

- Configuração única de transport entre serviços
- Contratos de mensagem type-safe via DTOs compartilhados
- Desenvolvimento local fácil (instância única Redis)

### Negativas

**Redis como SPOF:**
Falha de instância única Redis afeta todos serviços. Mitigado por Redis Sentinel ou Cluster.

**Durabilidade de Mensagens:**
Mensagens pub/sub não persistidas. Perdidas se nenhum subscriber ativo. Usar Redis Streams para entrega garantida se necessário.

**Complexidade de Debug:**
Fluxo assíncrono mais difícil de rastrear que HTTP síncrono. Requer correlation IDs e distributed tracing.

**Overhead de Rede:**
Cada serviço mantém conexão Redis. Aceitável para <10 serviços, pode requerer connection pooling em escala.

### Estratégias de Mitigação

**Alta Disponibilidade:**
Implantar Redis Cluster (3+ nodes) ou Redis Sentinel (1 master + 2 replicas) em produção. Upstash Redis oferece clustering gerenciado.

**Confiabilidade de Mensagens:**
Implementar chaves de idempotência para operações críticas. Usar Redis Streams ao invés de Pub/Sub para eventos mission-critical que requerem entrega garantida.

**Observabilidade:**
Injetar correlation IDs em todas mensagens. Integrar OpenTelemetry para distributed tracing entre boundaries de serviço.

**Gerenciamento de Conexão:**
Implementar connection pooling e health checks. Monitorar contagem de conexões Redis, uso de memória e latência de comandos.

## Referências

- [NestJS Microservices Transport](https://docs.nestjs.com/microservices/redis)
- [Documentação Redis Pub/Sub](https://redis.io/docs/interact/pubsub/)
- [Redis Streams vs Pub/Sub](https://redis.io/docs/data-types/streams/)
- [Padrões de Comunicação Microservices](https://microservices.io/patterns/communication-style/messaging.html)
- [Building Microservices com NestJS](https://amplication.com/blog/working-with-microservices-with-nestjs)
