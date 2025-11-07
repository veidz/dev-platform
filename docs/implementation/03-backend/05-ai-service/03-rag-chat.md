# AI Service - RAG Chat Assistant

## Contexto

Chat assistant context-aware que usa RAG (Retrieval-Augmented Generation) para responder perguntas sobre APIs do workspace.

## Dependências

- 02-embeddings-indexing.md completo
- Search service funcionando
- OpenAI GPT-4o-mini configurado

## Checkboxes

### Pesquisa

- [ ] Estudar LangChain ConversationalRetrievalQA
- [ ] Revisar prompt engineering para RAG
- [ ] Analisar Server-Sent Events (SSE) para streaming

### Chat Module

- [ ] Criar `src/modules/chat/chat.module.ts`
- [ ] Criar `src/modules/chat/chat.service.ts`
- [ ] Criar `src/modules/chat/chat.controller.ts`
- [ ] Registrar no app.module.ts

### System Prompts

```typescript
const SYSTEM_PROMPT = `You are an AI assistant specialized in API documentation and development.

CONTEXT: You have access to the user's API schemas, endpoint descriptions, and usage logs through a knowledge base.

GUIDELINES:
- Answer questions about APIs, endpoints, parameters, and responses
- Provide code examples when relevant
- Reference specific endpoints when answering
- If information is not in context, say so clearly
- Be concise but complete
- Use markdown formatting for code

AVAILABLE CONTEXT:
{context}

CONVERSATION HISTORY:
{chat_history}

USER QUESTION: {question}`
```

### Chat Service - RAG Pipeline

```typescript
@Injectable()
export class ChatService {
  constructor(
    private searchService: SearchService,
    private openai: OpenAIService,
    private prisma: PrismaService
  ) {}

  async chat(
    conversationId: string,
    message: string,
    workspaceId: string
  ): AsyncGenerator<string> {
    // 1. Buscar contexto relevante (RAG retrieval)
    const context = await this.searchService.search(
      message,
      workspaceId,
      5 // top 5 documentos
    )

    // 2. Buscar histórico da conversa
    const history = await this.getConversationHistory(conversationId)

    // 3. Construir prompt
    const prompt = this.buildPrompt(message, context, history)

    // 4. Gerar resposta com streaming
    const stream = await this.openai.getClient().chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        ...history.map((m) => ({ role: m.role, content: m.content })),
        { role: "user", content: prompt },
      ],
      stream: true,
      temperature: 0.7,
      max_tokens: 2000,
    })

    // 5. Stream chunks
    let fullResponse = ""

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || ""
      fullResponse += content
      yield content
    }

    // 6. Salvar mensagens no histórico
    await this.saveMessages(conversationId, message, fullResponse, context)
  }

  private buildPrompt(
    question: string,
    context: SearchResult[],
    history: ChatMessage[]
  ): string {
    const contextText = context
      .map((c) => `[${c.metadata.type}] ${c.text}`)
      .join("\n\n")

    return SYSTEM_PROMPT.replace(
      "{context}",
      contextText || "No context available"
    )
      .replace("{chat_history}", this.formatHistory(history))
      .replace("{question}", question)
  }

  private formatHistory(messages: ChatMessage[]): string {
    return messages
      .slice(-5) // Últimas 5 mensagens
      .map((m) => `${m.role}: ${m.content}`)
      .join("\n")
  }

  private async getConversationHistory(
    conversationId: string
  ): Promise<ChatMessage[]> {
    return this.prisma.chatMessage.findMany({
      where: { conversationId },
      orderBy: { createdAt: "asc" },
      take: 10, // Últimas 10 mensagens
    })
  }

  private async saveMessages(
    conversationId: string,
    userMessage: string,
    assistantMessage: string,
    sources: SearchResult[]
  ): Promise<void> {
    await this.prisma.chatMessage.createMany({
      data: [
        {
          conversationId,
          role: "user",
          content: userMessage,
        },
        {
          conversationId,
          role: "assistant",
          content: assistantMessage,
          metadata: {
            sources: sources.map((s) => ({
              type: s.metadata.type,
              sourceId: s.metadata.sourceId,
              score: s.score,
            })),
          },
        },
      ],
    })
  }
}
```

### Conversation Management

```typescript
// Criar nova conversa
async createConversation(
  userId: string,
  workspaceId: string
): Promise<ChatConversation> {
  return this.prisma.chatConversation.create({
    data: {
      userId,
      workspaceId
    }
  });
}

// Listar conversas do usuário
async listConversations(
  userId: string,
  workspaceId: string
): Promise<ChatConversation[]> {
  return this.prisma.chatConversation.findMany({
    where: {
      userId,
      workspaceId
    },
    include: {
      messages: {
        take: 1,
        orderBy: { createdAt: 'desc' }
      }
    },
    orderBy: { updatedAt: 'desc' }
  });
}

// Deletar conversa
async deleteConversation(id: string): Promise<void> {
  await this.prisma.chatConversation.delete({
    where: { id }
  });
}
```

### Chat Controller - SSE Streaming

```typescript
@Controller("chat")
@UseGuards(JwtAuthGuard)
export class ChatController {
  constructor(private chatService: ChatService) {}

  @Sse("stream")
  async streamChat(
    @Query("conversationId") conversationId: string,
    @Query("message") message: string,
    @CurrentUser() user
  ): Promise<Observable<MessageEvent>> {
    return new Observable((subscriber) => {
      ;(async () => {
        try {
          const stream = this.chatService.chat(
            conversationId,
            message,
            user.workspaceId
          )

          for await (const chunk of stream) {
            subscriber.next({
              data: { chunk },
            } as MessageEvent)
          }

          subscriber.complete()
        } catch (error) {
          subscriber.error(error)
        }
      })()
    })
  }

  @Post("conversations")
  async createConversation(@CurrentUser() user) {
    return this.chatService.createConversation(user.id, user.workspaceId)
  }

  @Get("conversations")
  async listConversations(@CurrentUser() user) {
    return this.chatService.listConversations(user.id, user.workspaceId)
  }

  @Get("conversations/:id")
  async getConversation(@Param("id") id: string) {
    return this.prisma.chatConversation.findUnique({
      where: { id },
      include: {
        messages: {
          orderBy: { createdAt: "asc" },
        },
      },
    })
  }

  @Delete("conversations/:id")
  async deleteConversation(@Param("id") id: string) {
    return this.chatService.deleteConversation(id)
  }
}
```

### Auto-Title Generation

```typescript
// Gerar título da conversa baseado na primeira mensagem
async generateConversationTitle(
  conversationId: string
): Promise<void> {
  const firstMessage = await this.prisma.chatMessage.findFirst({
    where: { conversationId, role: 'user' },
    orderBy: { createdAt: 'asc' }
  });

  if (!firstMessage) return;

  const response = await this.openai.getClient().chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: 'Generate a short title (max 50 chars) for this conversation:'
      },
      {
        role: 'user',
        content: firstMessage.content
      }
    ],
    max_tokens: 20
  });

  const title = response.choices[0].message.content;

  await this.prisma.chatConversation.update({
    where: { id: conversationId },
    data: { title }
  });
}
```

### Testes Unitários

- [ ] `tests/unit/chat/chat.service.spec.ts`
- [ ] Test buildPrompt
- [ ] Test formatHistory
- [ ] Test saveMessages
- [ ] Mock OpenAI, SearchService, Prisma

### Testes Integração

- [ ] `tests/integration/chat/chat.spec.ts`
- [ ] Setup: Criar conversa, indexar documentos
- [ ] Enviar mensagem via SSE
- [ ] Verificar streaming chunks
- [ ] Verificar mensagens salvas
- [ ] Verificar sources metadata

### Validação

- [ ] Chat responde perguntas relevantes ✅
- [ ] Contexto recuperado corretamente (RAG) ✅
- [ ] Streaming SSE funciona ✅
- [ ] Histórico salvo ✅
- [ ] Sources incluídas em metadata ✅
- [ ] `pnpm test` 100% coverage ✅

## Próximo Passo

→ [04-ai-generation.md](./04-ai-generation.md) - Code & docs generation
