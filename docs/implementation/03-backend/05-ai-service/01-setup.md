# AI Serviço - Setup Inicial

## Contexto

Microsserviço responsável por features de IA: RAG-powered chat assistant, auto-geração de documentação, code generation e semantic search.

## Dependências

- Phase 0 e 1 completas
- ADR-009 (AI Strategy) implementado
- OpenAI API key
- Qdrant vector database

## Checkboxes

### Pesquisa & Planejamento

- [ ] Estudar LangChain para RAG orchestration
- [ ] Revisar OpenAI API docs (GPT-4o-mini, embeddings)
- [ ] Analisar Qdrant client (@qdrant/js-client-rest)
- [ ] Revisar ADR-009 completamente

### Criar Aplicação NestJS

- [ ] `cd apps && nest new ai-service`
- [ ] Selecionar package manager: `pnpm`
- [ ] Configurar tsconfig.json herdando de `@dev-platform/config/tsconfig`
- [ ] Adicionar no turbo.json pipeline

### Dependencies

```bash
pnpm add openai@latest
pnpm add @qdrant/js-client-rest
pnpm add langchain
pnpm add @langchain/openai
pnpm add @langchain/community
pnpm add @prisma/client
pnpm add @nestjs/config
pnpm add class-validator class-transformer
pnpm add uuid
```

### Estrutura de Diretórios

```
apps/ai-service/
├── src/
│   ├── modules/
│   │   ├── rag/              # RAG pipeline
│   │   ├── embeddings/       # Embedding generation
│   │   ├── chat/             # Chat service
│   │   ├── generation/       # Code/docs generation
│   │   └── search/           # Semantic search
│   ├── common/
│   │   ├── types/
│   │   ├── prompts/          # Prompt templates
│   │   └── utils/
│   ├── jobs/                 # Background indexing jobs
│   ├── app.module.ts
│   └── main.ts
├── test/
├── prisma/
│   └── schema.prisma
└── package.json
```

### Configuração Base

- [ ] **main.ts**
  - [ ] Porta: 3004 (padrão) ou `process.env.AI_SERVICE_PORT`
  - [ ] CORS habilitado
  - [ ] Global validation pipe
  - [ ] Swagger em `/docs`
  - [ ] Global prefix: `/api/ai`
  - [ ] SSE support para streaming responses

- [ ] **app.module.ts**
  - [ ] Import ConfigModule
  - [ ] Import PrismaModule
  - [ ] Import RAGModule
  - [ ] Import EmbeddingsModule
  - [ ] Import ChatModule
  - [ ] Import GenerationModule
  - [ ] Import SearchModule

### Environment Variables

```env
AI_SERVICE_PORT=3004
DATABASE_URL=postgresql://...

# OpenAI
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4o-mini
OPENAI_EMBEDDING_MODEL=text-embedding-3-small

# Qdrant
QDRANT_URL=http://localhost:6333
QDRANT_API_KEY=  # Opcional para cloud
QDRANT_COLLECTION=documentation

# AI Config
AI_MAX_TOKENS=2000
AI_TEMPERATURE=0.7
AI_CONTEXT_WINDOW=8000
EMBEDDING_DIMENSIONS=1536
```

- [ ] Criar `.env.example`

### Prisma Schema - Conversation Models

```prisma
model ChatConversation {
  id          String        @id @default(cuid())

  workspace   Workspace     @relation(fields: [workspaceId], references: [id], onDelete: Cascade)
  workspaceId String

  user        User          @relation(fields: [userId], references: [id])
  userId      String

  title       String?       // Auto-generated from first message

  messages    ChatMessage[]

  createdAt   DateTime      @default(now())
  updatedAt   DateTime      @updatedAt

  @@index([workspaceId, userId])
}

model ChatMessage {
  id              String            @id @default(cuid())

  role            String            // 'user' | 'assistant' | 'system'
  content         String            @db.Text

  // Metadata
  metadata        Json?             // Sources, tokens used, etc

  conversation    ChatConversation  @relation(fields: [conversationId], references: [id], onDelete: Cascade)
  conversationId  String

  createdAt       DateTime          @default(now())

  @@index([conversationId])
}

// Indexação de documentos no Qdrant
model DocumentIndex {
  id          String   @id @default(cuid())

  // Document info
  type        String   // 'api' | 'endpoint' | 'schema'
  sourceId    String   // ID do documento original
  content     String   @db.Text

  // Qdrant info
  vectorId    String   @unique // UUID no Qdrant

  workspace   Workspace @relation(fields: [workspaceId], references: [id], onDelete: Cascade)
  workspaceId String

  indexedAt   DateTime @default(now())

  @@index([workspaceId, type])
  @@index([sourceId])
}
```

- [ ] Adicionar ao schema.prisma
- [ ] `pnpm prisma generate`
- [ ] `pnpm prisma migrate dev --name add-ai-tables`

### OpenAI Client Setup

```typescript
// src/config/openai.config.ts
import { OpenAI } from 'openai'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class OpenAIService {
  private client: OpenAI

  constructor(private config: ConfigService) {
    this.client = new OpenAI({
      apiKey: config.get('OPENAI_API_KEY'),
    })
  }

  getClient(): OpenAI {
    return this.client
  }
}
```

### Qdrant Client Setup

```typescript
// src/config/qdrant.config.ts
import { QdrantClient } from '@qdrant/js-client-rest'

@Injectable()
export class QdrantService {
  private client: QdrantClient
  private readonly COLLECTION_NAME: string

  constructor(private config: ConfigService) {
    this.client = new QdrantClient({
      url: config.get('QDRANT_URL'),
      apiKey: config.get('QDRANT_API_KEY'),
    })

    this.COLLECTION_NAME = config.get('QDRANT_COLLECTION')

    this.ensureCollection()
  }

  private async ensureCollection() {
    try {
      await this.client.getCollection(this.COLLECTION_NAME)
    } catch {
      // Criar collection se não existir
      await this.client.createCollection(this.COLLECTION_NAME, {
        vectors: {
          size: 1536, // text-embedding-3-small
          distance: 'Cosine',
        },
      })
    }
  }

  getClient(): QdrantClient {
    return this.client
  }

  getCollectionName(): string {
    return this.COLLECTION_NAME
  }
}
```

### Health Check

- [ ] Criar `src/health/health.controller.ts`
- [ ] Endpoint: `GET /health`
- [ ] Verificar:
  - [ ] OpenAI API accessible
  - [ ] Qdrant connection
  - [ ] Database connection

```typescript
@Get('health')
async check() {
  const checks = await Promise.allSettled([
    this.checkOpenAI(),
    this.checkQdrant(),
    this.checkDatabase()
  ]);

  return {
    status: checks.every(c => c.status === 'fulfilled') ? 'ok' : 'degraded',
    openai: checks[0].status,
    qdrant: checks[1].status,
    database: checks[2].status
  };
}
```

### Logging

- [ ] Configurar Winston/Pino
- [ ] Structured logs (JSON)
- [ ] Log AI interactions (tokens used, latency)
- [ ] Privacy: não logar dados sensíveis do usuário

### Docker

- [ ] Criar `Dockerfile`
- [ ] Adicionar em `docker-compose.yml`:

  ```yaml
  ai-service:
    build: ./apps/ai-service
    ports:
      - '3004:3004'
    env_file:
      - ./apps/ai-service/.env
    depends_on:
      - postgres
      - qdrant

  qdrant:
    image: qdrant/qdrant:latest
    ports:
      - '6333:6333'
    volumes:
      - qdrant_data:/qdrant/storage

  volumes:
    qdrant_data:
  ```

### Scripts package.json

```json
{
  "scripts": {
    "dev": "nest start --watch",
    "build": "nest build",
    "start": "node dist/main",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:cov": "jest --coverage",
    "lint": "eslint src --ext .ts",
    "prisma:generate": "prisma generate"
  }
}
```

### Cost Monitoring

```typescript
// Trackear custos de API calls
@Injectable()
export class CostTracker {
  async trackUsage(model: string, tokens: number) {
    const cost = this.calculateCost(model, tokens)

    // Log para analytics
    await this.logger.info('AI Usage', {
      model,
      tokens,
      cost,
    })
  }

  private calculateCost(model: string, tokens: number): number {
    const rates = {
      'gpt-4o-mini': {
        input: 0.15 / 1_000_000, // $0.150 per 1M tokens
        output: 0.6 / 1_000_000,
      },
      'text-embedding-3-small': {
        input: 0.02 / 1_000_000,
      },
    }

    return tokens * (rates[model]?.input || 0)
  }
}
```

### Rate Limiting

- [ ] Limitar AI requests por workspace: 100/hour
- [ ] Limitar tokens por request: 4000
- [ ] Response: 429 com Retry-After header

### Validação

- [ ] `pnpm install` sem erros
- [ ] `pnpm dev` inicia na porta 3004
- [ ] `GET /health` retorna 200
- [ ] OpenAI client conecta
- [ ] Qdrant collection criada
- [ ] `pnpm build` compila
- [ ] `pnpm lint` sem warnings

### Documentação

- [ ] README.md do ai-service:
  - [ ] Responsabilidades
  - [ ] RAG architecture overview
  - [ ] Como rodar localmente
  - [ ] Como configurar OpenAI/Qdrant
  - [ ] Environment variables

## Próximo Passo

→ [02-embeddings-indexing.md](./02-embeddings-indexing.md) - Geração de embeddings e indexação no Qdrant
