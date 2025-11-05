# ADR-009: Estratégia de Integração de Inteligência Artificial

## Contexto

**Dev Platform** requer features de IA para diferenciação competitiva e automação de tarefas repetitivas. Casos de uso identificados: auto-geração de documentação, chat assistant context-aware, code generation (SDKs, tests), e semantic search sobre APIs/schemas.

Requisitos técnicos:

- Latência de resposta <3s para queries simples
- Custo controlado (budget ~$50/mês em produção inicial)
- Context awareness (acesso a APIs, schemas, logs do workspace)
- Respostas factualmente corretas (evitar hallucinations)
- Escalabilidade para múltiplos workspaces concorrentes

Mercado de trabalho: 70%+ das vagas para desenvolvedores pleno/sênior mencionam experiência com IA/LLMs como diferencial.

## Decisão

Implementar **arquitetura RAG (Retrieval-Augmented Generation)** com os seguintes componentes:

- **LLM**: OpenAI GPT-4o-mini (primary) com fallback para Anthropic Claude 3.5 Haiku
- **Embeddings**: OpenAI text-embedding-3-small
- **Vector Database**: Qdrant (self-hosted ou cloud)
- **Orchestration**: LangChain para RAG pipeline
- **Streaming**: Server-Sent Events para respostas incrementais

### Justificativa Técnica

**RAG Architecture:**

Retrieval-Augmented Generation resolve problema fundamental de LLMs: falta de conhecimento específico do domínio e dados desatualizados. Pipeline:

1. **Indexação** (offline):

   - Documentos (schemas OpenAPI, descrições de endpoints, logs) → chunks semânticos
   - Chunks → embeddings via text-embedding-3-small (1536 dimensões)
   - Embeddings armazenados em Qdrant com metadata (workspace_id, api_id, timestamp)

2. **Retrieval** (runtime):

   - Query usuário → embedding
   - Semantic search em Qdrant (cosine similarity)
   - Top-K documentos relevantes (K=3-5) recuperados

3. **Augmentation**:

   - Context construído: query + documentos recuperados + system prompt
   - Context injection via prompt engineering

4. **Generation**:
   - LLM gera resposta baseada em context
   - Streaming via SSE para UX responsiva

**Escolha de Modelos:**

**GPT-4o-mini** (primary):

- Custo: $0.150/1M input tokens, $0.600/1M output tokens (4x mais barato que GPT-4o)
- Latência: ~500ms para respostas de 200 tokens
- Context window: 128k tokens (suficiente para schemas grandes)
- Capacidades: Excelente para code generation, seguir instruções técnicas
- Streaming nativo: Suporte SSE built-in

**Claude 3.5 Haiku** (fallback):

- Custo: $0.25/1M input tokens, $1.25/1M output tokens
- Uso: Quando GPT-4o-mini retorna erro ou rate limit
- Vantagem: Melhor reasoning em queries complexas

**text-embedding-3-small**:

- Custo: $0.02/1M tokens (62x mais barato que ada-002)
- Dimensões: 1536 (balanço entre qualidade e storage)
- Performance: MTEB score 62.3% (suficiente para semantic search)
- Latência: <100ms para batch de 10 documents

**Qdrant Vector Database:**

Vantagens técnicas:

- Written in Rust: Alta performance, baixo memory footprint
- HNSW index: Approximate nearest neighbor search em <10ms p99
- Metadata filtering: Query por workspace_id sem scan completo
- Docker-friendly: Deploy simples no Railway
- Payload storage: Armazena texto original junto com embedding (evita joins)

Alternativas descartadas:

- **Pinecone**: SaaS excelente mas custo (~$70/mês free tier limitations)
- **Chroma**: Python-only, performance degrada >100k vectors
- **Weaviate**: Feature-rich mas complexidade operacional maior

**LangChain Orchestration:**

Framework abstrai complexidade do RAG pipeline:

```typescript
// Simplified architecture
const vectorStore = new QdrantVectorStore(embeddings, config)
const retriever = vectorStore.asRetriever({ k: 5 })

const chain = ConversationalRetrievalQAChain.fromLLM(llm, retriever, {
  returnSourceDocuments: true,
})

const response = await chain.call({
  question: userQuery,
  chat_history: conversationHistory,
})
```

### Prompt Engineering Strategy

**System Prompts:**

```typescript
const SYSTEM_PROMPT = `You are an AI assistant specialized in API documentation and development.

CONTEXT: You have access to the user's API schemas, endpoint descriptions, and usage logs.

GUIDELINES:
- Answer based ONLY on provided context (retrieved documents)
- If information is not in context, say "I don't have enough information"
- Provide code examples when relevant (curl, JavaScript, Python)
- Be concise but technical - assume user is a Dev
- Format responses in Markdown

RETRIEVED CONTEXT:
{context}

USER QUERY: {query}`
```

**Prompt Patterns:**

- Few-shot learning: Incluir 2-3 exemplos de boas respostas
- Chain-of-thought: Para debugging queries ("Let's analyze step by step...")
- Constraint enforcement: "Never make up API endpoints not in context"

### Caching Strategy

**Embedding Caching:**

- Cache embeddings de schemas/docs em Redis (TTL: 24h)
- Invalidação ao atualizar API
- Reduz custos em 80% para documentos estáveis

**LLM Response Caching:**

- Cache respostas para queries frequentes (Redis, TTL: 1h)
- Key: hash(query + context_ids)
- Hit rate esperado: 40-50% em produção

**Prompt Caching (OpenAI):**

- System prompt cacheado automaticamente
- Reduz latência em 50% e custo em 50% para prompts >1024 tokens

### Cost Management

**Budget Projection:**

Assumindo 1000 queries/dia:

- Embeddings: 500 docs _ 500 tokens _ $0.02/1M = $0.005/dia
- LLM calls: 1000 queries _ (2k input + 300 output) _ $0.75/1M = $1.725/dia
- **Total: ~$52/mês** (within budget)

Rate limiting: 100 queries/usuário/dia para evitar abuse.

### Security & Privacy

**Data Isolation:**

- Row-level filtering em Qdrant via workspace_id
- Embeddings não contêm dados sensíveis (são vectors numéricos)
- Logs de queries armazenados para auditoria

**PII Handling:**

- Detecção de PII antes de enviar para LLM (regex patterns)
- Masking de tokens sensíveis (API keys, emails)

### Alternatives Considered

**Fine-tuning LLM:**

- Custo alto (OpenAI fine-tuning: $8/1M tokens training)
- Difícil manter atualizado com mudanças constantes em APIs
- RAG mais flexível e cost-effective

**Embeddings Open-Source (sentence-transformers):**

- all-MiniLM-L6-v2: Gratuito mas qualidade inferior (~57% MTEB)
- Self-hosting requer GPU para latência aceitável
- OpenAI API mais simples e confiável

**Vector DB Postgres (pgvector):**

- Conveniente (reutiliza Neon Postgres)
- Performance inferior para >100k vectors
- Sem HNSW index nativo (apenas IVFFlat)

## Consequências

### Positivas

**Diferencial Competitivo:**

- Feature set único vs Postman/Insomnia (não têm AI integrado)
- Demonstra expertise em IA para portfólio/entrevistas

**Dev Productivity:**

- Auto-geração de docs economiza 60-70% tempo de documentação
- Chat assistant reduz tempo de onboarding de novos devs

**Qualidade de Dados:**

- RAG reduz hallucinations em 80-90% vs LLM puro
- Respostas citam fontes (retrieved documents)

**Escalabilidade:**

- Vector database suporta milhões de embeddings
- Horizontal scaling via Qdrant clustering

### Negativas

**Custo Operacional:**

- $50-100/mês em API calls (OpenAI)
- Qdrant Cloud: $25/mês (ou self-host em Railway)
- Total: $75-125/mês para produção inicial

**Complexidade Técnica:**

- RAG pipeline tem múltiplos pontos de falha
- Debugging de qualidade de respostas não-determinístico
- Requer expertise em prompt engineering

**Latência:**

- Embedding + retrieval + LLM: 2-3s total
- Maior que respostas determinísticas (queries SQL: <50ms)
- Mitigado via streaming (perceived latency menor)

**Vendor Lock-in:**

- Dependência de OpenAI API (mitigado via fallback Anthropic)
- Embeddings OpenAI não compatíveis com outros providers
- Migração requer re-embedding de todo corpus

### Estratégias de Mitigação

**Cost Control:**

- Rate limiting agressivo (100 queries/user/day)
- Caching multi-layer (Redis + prompt cache)
- Monitoramento de custos com alertas (>$10/dia)

**Quality Assurance:**

- A/B testing de prompts
- Human feedback loop (thumbs up/down)
- Retrieval quality metrics (recall@5, MRR)

**Reliability:**

- Fallback LLM (Claude) se OpenAI falha
- Circuit breaker pattern
- Graceful degradation (feature desabilitada se AI indisponível)

**Performance:**

- Embeddings pré-computados e cacheados
- Batch processing de documentos offline
- Streaming SSE para UX responsiva

## Referências

- [OpenAI Embeddings Guide](https://platform.openai.com/docs/guides/embeddings)
- [RAG Best Practices](https://python.langchain.com/docs/tutorials/rag/)
- [Qdrant Documentation](https://qdrant.tech/documentation/)
- [Production RAG Systems](https://www.pinecone.io/learn/retrieval-augmented-generation/)
- [LangChain RAG](https://js.langchain.com/docs/tutorials/rag)
- [Vector Database Comparison](https://benchmark.vectorview.ai/vectordbs.html)
- [Prompt Engineering Guide](https://www.promptingguide.ai/)
- [OpenAI GPT-4o-mini Pricing](https://openai.com/api/pricing/)
