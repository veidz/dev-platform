# ADR-006: Estratégia de Comunicação Real-Time

## Contexto

Plataforma requer features real-time: edição colaborativa (múltiplos usuários editando docs de API), streaming de logs de requests ao vivo e notificações instantâneas. Requisitos: comunicação bi-direcional, latência <100ms, persistência de conexão, reconexão automática e suporte multi-instância (scaling horizontal).

## Decisão

**Socket.io** com adapter Redis para comunicação cross-instance.

### Justificativa Técnica

**Vantagens Socket.io:**

- Seleção automática de transport (WebSocket → polling fallback)
- Reconexão built-in com exponential backoff
- Broadcasting baseado em rooms
- Suporte a dados binários (payloads eficientes)
- Suporte TypeScript com eventos type-safe

**Arquitetura:**

```typescript
// Server (NestJS Gateway)
@WebSocketGateway({ cors: true })
export class CollaborationGateway {
  @SubscribeMessage('join_document')
  handleJoin(client: Socket, docId: string) {
    client.join(`doc:${docId}`)
    this.server.to(`doc:${docId}`).emit('user_joined', client.id)
  }
}
```

**Redis Adapter:**
Habilita propagação de mensagens entre múltiplas instâncias de servidor. Sem adapter, mensagens alcançam apenas clientes conectados à mesma instância.

```typescript
const redisAdapter = createAdapter(pubClient, subClient)
io.adapter(redisAdapter)
```

**Características de Performance:**

- Overhead de conexão WebSocket: ~1KB por conexão
- Latência de mensagem: <50ms p99 (local), <200ms p99 (cross-region)
- Conexões concorrentes: 10k+ por instância (limites Node.js)

**Scaling Horizontal:**
Redis Pub/Sub distribui mensagens entre instâncias. Load balancer deve suportar sticky sessions para conexão inicial, mas mensagens subsequentes broadcast para todas instâncias.

### Alternativas Consideradas

**WebSocket Nativo:** Requer lógica manual de reconexão, sem transport fallback e implementação customizada de protocolo. Socket.io abstrai complexidade.

**Server-Sent Events (SSE):** Unidirecional (server → client). Insuficiente para edição colaborativa que requer fluxo bi-direcional.

**GraphQL Subscriptions:** Adiciona complexidade (subscription server, schema stitching). Overkill para eventos real-time simples.

**Pusher/Ably:** Soluções SaaS excelentes mas vendor lock-in e custo em escala. Self-hosted preferido para controle.

## Consequências

### Positivas

**Experiência do Desenvolvedor:** API simples baseada em eventos. Decorators gateway NestJS reduzem boilerplate.

**Confiabilidade:** Reconexão automática, heartbeat packets, transport fallback.

**Escalabilidade:** Redis adapter habilita scaling horizontal sem mudanças de código.

**Feature-Rich:** Rooms, namespaces, acknowledgments, dados binários.

### Negativas

**Overhead de Conexão:** Cada conexão consome memória do servidor (~10KB). 10k conexões = 100MB.

**Dependência Redis:** Falha Redis afeta features real-time (mas não API core).

**Debug:** Eventos assíncronos mais difíceis de rastrear que HTTP requests.

**Client Bundle:** Cliente Socket.io adiciona ~30KB gzipped ao bundle frontend.

### Mitigação

**Limites de Conexão:** Implementar max conexões por usuário. Monitorar contagem de conexões por instância.

**Alta Disponibilidade Redis:** Usar Redis Cluster ou Sentinel. Upstash Redis fornece solução gerenciada.

**Observabilidade:** Logar eventos de conexão/desconexão. Implementar correlation IDs para tracing de mensagens.

**Degradação Graceful:** Features core funcionam sem WebSocket (fallback para polling ou HTTP).

## Referências

- [Documentação Socket.io](https://socket.io/docs/v4/)
- [Socket.io Redis Adapter](https://socket.io/docs/v4/redis-adapter/)
- [NestJS WebSocket Gateway](https://docs.nestjs.com/websockets/gateways)
- [Performance WebSocket](https://blog.logrocket.com/websocket-tutorial-real-time-node-react/)
