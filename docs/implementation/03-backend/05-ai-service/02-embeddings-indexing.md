# AI Service - Embeddings & Indexing

## Contexto

Módulo responsável por gerar embeddings de documentos (APIs, endpoints, schemas) e indexá-los no Qdrant para semantic search.

## Dependências

- 01-setup.md completo
- OpenAI embeddings API configurada
- Qdrant client funcionando

## Checkboxes

### Pesquisa

- [ ] Revisar OpenAI embeddings best practices
- [ ] Estudar chunking strategies para documentos longos
- [ ] Analisar Qdrant payload structure

### Embeddings Module

- [ ] Criar `src/modules/embeddings/embeddings.module.ts`
- [ ] Criar `src/modules/embeddings/embeddings.service.ts`
- [ ] Registrar no app.module.ts

### Embeddings Service - Core

```typescript
@Injectable()
export class EmbeddingsService {
  constructor(
    private openai: OpenAIService,
    private qdrant: QdrantService,
    private prisma: PrismaService
  ) {}

  // Gera embedding de um texto
  async generateEmbedding(text: string): Promise<number[]> {
    const response = await this.openai.getClient().embeddings.create({
      model: "text-embedding-3-small",
      input: text,
    })

    return response.data[0].embedding
  }

  // Gera embeddings em batch (até 100 por chamada)
  async generateEmbeddingsBatch(texts: string[]): Promise<number[][]> {
    const BATCH_SIZE = 100
    const batches = chunk(texts, BATCH_SIZE)

    const allEmbeddings: number[][] = []

    for (const batch of batches) {
      const response = await this.openai.getClient().embeddings.create({
        model: "text-embedding-3-small",
        input: batch,
      })

      allEmbeddings.push(...response.data.map((d) => d.embedding))
    }

    return allEmbeddings
  }
}
```

### Document Chunking Strategy

```typescript
interface DocumentChunk {
  text: string;
  metadata: {
    type: 'api' | 'endpoint' | 'schema';
    sourceId: string;
    workspaceId: string;
    chunkIndex?: number;
  };
}

// Divide documentos longos em chunks menores
chunkDocument(text: string, maxChunkSize: number = 500): string[] {
  // Split por parágrafos primeiro
  const paragraphs = text.split('\n\n');
  const chunks: string[] = [];
  let currentChunk = '';

  for (const para of paragraphs) {
    if ((currentChunk + para).length > maxChunkSize && currentChunk) {
      chunks.push(currentChunk.trim());
      currentChunk = para;
    } else {
      currentChunk += (currentChunk ? '\n\n' : '') + para;
    }
  }

  if (currentChunk) chunks.push(currentChunk.trim());

  return chunks;
}
```

### Indexing Service

```typescript
@Injectable()
export class IndexingService {
  constructor(
    private embeddings: EmbeddingsService,
    private qdrant: QdrantService,
    private prisma: PrismaService
  ) {}

  // Indexa uma API completa
  async indexAPI(apiId: string): Promise<void> {
    const api = await this.prisma.api.findUnique({
      where: { id: apiId },
      include: {
        endpoints: true,
      },
    })

    if (!api) throw new NotFoundException("API not found")

    // Gerar texto descritivo da API
    const apiText = this.buildAPIText(api)

    // Indexar API
    await this.indexDocument({
      text: apiText,
      metadata: {
        type: "api",
        sourceId: api.id,
        workspaceId: api.workspaceId,
      },
    })

    // Indexar cada endpoint
    for (const endpoint of api.endpoints) {
      await this.indexEndpoint(endpoint)
    }
  }

  // Indexa um endpoint específico
  async indexEndpoint(endpoint: any): Promise<void> {
    const endpointText = this.buildEndpointText(endpoint)

    await this.indexDocument({
      text: endpointText,
      metadata: {
        type: "endpoint",
        sourceId: endpoint.id,
        workspaceId: endpoint.api.workspaceId,
      },
    })
  }

  // Indexa um documento genérico
  private async indexDocument(doc: DocumentChunk): Promise<void> {
    // Gerar embedding
    const embedding = await this.embeddings.generateEmbedding(doc.text)

    // Gerar UUID para Qdrant
    const vectorId = uuidv4()

    // Inserir no Qdrant
    await this.qdrant.getClient().upsert(this.qdrant.getCollectionName(), {
      points: [
        {
          id: vectorId,
          vector: embedding,
          payload: {
            text: doc.text,
            ...doc.metadata,
          },
        },
      ],
    })

    // Salvar referência no DB
    await this.prisma.documentIndex.create({
      data: {
        type: doc.metadata.type,
        sourceId: doc.metadata.sourceId,
        content: doc.text,
        vectorId,
        workspaceId: doc.metadata.workspaceId,
      },
    })
  }

  // Constrói texto descritivo de uma API
  private buildAPIText(api: any): string {
    return `
API: ${api.name}
Description: ${api.description || "No description"}
Version: ${api.version || "1.0"}
Base URL: ${api.baseUrl || "N/A"}
Endpoints: ${api.endpoints.length}
    `.trim()
  }

  // Constrói texto descritivo de um endpoint
  private buildEndpointText(endpoint: any): string {
    return `
Endpoint: ${endpoint.method} ${endpoint.path}
Description: ${endpoint.description || "No description"}
Parameters: ${JSON.stringify(endpoint.parameters || [])}
Request Body: ${JSON.stringify(endpoint.requestSchema || {})}
Response: ${JSON.stringify(endpoint.responseSchema || {})}
    `.trim()
  }
}
```

### Event Listeners para Auto-Indexing

```typescript
// Quando API é criada/atualizada, indexar automaticamente
@EventPattern('api.created')
async handleAPICreated(@Payload() data: { apiId: string }) {
  await this.indexingService.indexAPI(data.apiId);
}

@EventPattern('api.updated')
async handleAPIUpdated(@Payload() data: { apiId: string }) {
  // Re-indexar
  await this.deleteAPIIndex(data.apiId);
  await this.indexingService.indexAPI(data.apiId);
}

@EventPattern('api.deleted')
async handleAPIDeleted(@Payload() data: { apiId: string }) {
  await this.deleteAPIIndex(data.apiId);
}

// Deletar índices de uma API
private async deleteAPIIndex(apiId: string): Promise<void> {
  const indexes = await this.prisma.documentIndex.findMany({
    where: { sourceId: apiId }
  });

  // Deletar do Qdrant
  await this.qdrant.getClient().delete(
    this.qdrant.getCollectionName(),
    {
      points: indexes.map(i => i.vectorId)
    }
  );

  // Deletar do DB
  await this.prisma.documentIndex.deleteMany({
    where: { sourceId: apiId }
  });
}
```

### Batch Indexing Job

```typescript
// Indexar todo workspace de uma vez
async indexWorkspace(workspaceId: string): Promise<void> {
  const apis = await this.prisma.api.findMany({
    where: { workspaceId },
    include: { endpoints: true }
  });

  this.logger.log(`Indexing ${apis.length} APIs from workspace ${workspaceId}`);

  for (const api of apis) {
    await this.indexingService.indexAPI(api.id);
  }

  this.logger.log(`Workspace ${workspaceId} indexed successfully`);
}
```

- [ ] Criar endpoint: `POST /indexing/workspace/:id`
- [ ] Proteger com admin-only guard

### Search Service

```typescript
@Injectable()
export class SearchService {
  constructor(
    private embeddings: EmbeddingsService,
    private qdrant: QdrantService
  ) {}

  // Busca semântica de documentos
  async search(
    query: string,
    workspaceId: string,
    limit: number = 5
  ): Promise<SearchResult[]> {
    // Gerar embedding da query
    const queryEmbedding = await this.embeddings.generateEmbedding(query)

    // Buscar no Qdrant
    const results = await this.qdrant
      .getClient()
      .search(this.qdrant.getCollectionName(), {
        vector: queryEmbedding,
        limit,
        filter: {
          must: [
            {
              key: "workspaceId",
              match: { value: workspaceId },
            },
          ],
        },
        with_payload: true,
      })

    return results.map((r) => ({
      text: r.payload.text as string,
      score: r.score,
      metadata: {
        type: r.payload.type as string,
        sourceId: r.payload.sourceId as string,
      },
    }))
  }
}

interface SearchResult {
  text: string
  score: number
  metadata: {
    type: string
    sourceId: string
  }
}
```

### Testes Unitários

- [ ] `tests/unit/embeddings/embeddings.service.spec.ts`
- [ ] Test generateEmbedding
- [ ] Test generateEmbeddingsBatch
- [ ] Test chunkDocument
- [ ] Mock OpenAI API

### Testes Integração

- [ ] `tests/integration/indexing/indexing.spec.ts`
- [ ] Setup: Criar API com endpoints
- [ ] Indexar API
- [ ] Verificar documentos no Qdrant
- [ ] Testar search semântico
- [ ] Verificar resultados relevantes

### Validação

- [ ] Embeddings gerados corretamente ✅
- [ ] Documentos indexados no Qdrant ✅
- [ ] Search retorna resultados relevantes ✅
- [ ] Auto-indexing funciona (eventos) ✅
- [ ] `pnpm test` 100% coverage ✅

## Próximo Passo

→ [03-rag-chat.md](./03-rag-chat.md) - RAG pipeline e chat assistant
