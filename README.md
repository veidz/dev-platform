# Developer Platform

<div align="center">

![Developer Platform](https://img.shields.io/badge/Dev-Platform-blue?style=for-the-badge)
![Next.js 16](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)
![NestJS](https://img.shields.io/badge/NestJS-latest-E0234E?style=for-the-badge&logo=nestjs)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=for-the-badge&logo=typescript)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

**A plataforma completa para gerenciamento, documentação e teste de APIs com IA integrada**

[Demo]() · [Especificação Técnica](./docs/technical-spec.md)

</div>

---

## 🎯 Sobre o Projeto

**Dev Platform** é uma solução completa para gerenciamento de APIs que combina funcionalidades de ferramentas populares como Postman, Swagger Hub e API Gateway em uma única plataforma moderna, open-source e com inteligência artificial integrada.

### O Problema

Desenvolvedores e equipes precisam de múltiplas ferramentas para:

- 📝 Documentar APIs (Swagger/OpenAPI)
- 🧪 Testar endpoints (Postman/Insomnia)
- 🎭 Criar mocks para desenvolvimento (MockServer)
- 📊 Monitorar uso e performance (Analytics)
- 🤖 Gerar código e SDKs manualmente

**Resultado**: Fragmentação, custos elevados, falta de integração e produtividade reduzida.

### A Solução

Uma plataforma unificada que centraliza todo o ciclo de vida de APIs com recursos modernos:

✨ **Documentação Inteligente** - Auto-geração de descrições e exemplos com IA  
🚀 **Playground Interativo** - Teste endpoints em tempo real com autocomplete  
🎭 **Mock Server Dinâmico** - Gere mocks automaticamente baseado em schemas  
📊 **Analytics em Tempo Real** - Monitore requests, latência e erros  
🤖 **AI Assistant** - Chat context-aware que responde sobre suas APIs  
🔧 **Code Generation** - SDKs automáticos em TypeScript, Python, Go, C#  
👥 **Colaboração Real-Time** - Edite documentação com sua equipe simultaneamente  
🔐 **Multi-Tenant Seguro** - Workspaces isolados com RBAC completo

---

## 🌟 Features Principais

### 📖 Documentação Inteligente

- Import/export OpenAPI 3.0 com um clique
- Editor visual com syntax highlighting
- Code examples em múltiplas linguagens
- Versionamento automático com changelog
- **IA**: Auto-gera descrições e sugere melhorias

### 🧪 Playground & Testing

- Ambiente de testes integrado sem sair da plataforma
- Autocomplete inteligente de payloads
- Collections e environments (dev, staging, prod)
- Histórico completo de requests
- Pre-request scripts em JavaScript
- **IA**: Sugere valores realistas baseado no schema

### 🎭 Mock Server

- Geração automática baseada em schemas
- Scenarios customizados (success, error, edge cases)
- Latency simulation
- Stateful mocks (simulação de banco de dados)
- URL pública para compartilhamento
- **IA**: Cria scenarios inteligentes

### 🤖 AI-Powered Assistant

- **RAG Architecture**: Context-aware sobre suas APIs
- Responde perguntas: "Como uso o endpoint /users?"
- Debugging assistido: "Por que recebi 500?"
- Semantic search na documentação
- Tradução automática de docs
- Geração de SDKs e testes

### 📊 Analytics & Monitoring

- Dashboard de métricas em tempo real
- Gráficos de requests, latência, status codes
- Top endpoints mais usados
- Error tracking e alertas
- Geographic distribution
- Webhooks configuráveis

### 👥 Colaboração

- Workspaces multi-tenant
- Roles: Owner, Admin, Dev, Viewer
- Edição simultânea de documentação
- Comments inline
- Activity feed
- SSO (Google, GitHub)

---

## 🏗️ Arquitetura

O projeto utiliza **arquitetura de microsserviços** com monorepo Turborepo:

```
┌─────────────┐
│   Next.js   │  Frontend (React 19 + Server Components)
│   Web App   │
└──────┬──────┘
       │
┌──────▼───────────────────────────────────────┐
│          API Gateway (NestJS)                │
│  Auth · Rate Limiting · Request Routing      │
└──────┬───────────────────────────────────────┘
       │
       ├──► Management Service  (CRUD APIs/Endpoints)
       ├──► Mock Server         (Dynamic responses)
       ├──► Analytics Service   (Metrics aggregation)
       └──► AI Service          (RAG + LLM integration)
              │
              ├─► OpenAI GPT-4o-mini (LLM)
              ├─► text-embedding-3-small (Embeddings)
              └─► Qdrant (Vector Database)
```

### Stack Tecnológico

**Frontend**

- Next.js 16 (App Router, Turbopack)
- React 19 (Server Components)
- Tailwind CSS + Shadcn/ui
- Socket.io (Real-time)

**Backend**

- NestJS (Microsserviços)
- Prisma ORM
- Redis (Cache + Pub/Sub)
- PostgreSQL (Neon serverless)

**AI/ML**

- OpenAI API (GPT-4o-mini)
- LangChain (RAG orchestration)
- Qdrant (Vector database)

**DevOps**

- Docker + Docker Compose
- GitHub Actions (CI/CD)
- Vercel (Frontend)
- Railway (Backend)

---

## 🚀 Quick Start

### Pré-requisitos

- Node.js 22+
- pnpm 10+
- Docker & Docker Compose
- Conta OpenAI (para features de IA)

### Instalação

```bash
# Clone o repositório
git clone https://github.com/veidz/dev-platform.git
cd dev-platform

# Instale as dependências
pnpm install

# Configure as variáveis de ambiente
cp .env.example .env
# Edite .env com suas credenciais (opcional para desenvolvimento inicial)
```

### Docker (Infraestrutura)

```bash
# Subir containers (PostgreSQL, Redis, Qdrant)
pnpm docker:up

# Ver status dos containers
pnpm docker:ps

# Ver logs em tempo real
pnpm docker:logs

# Parar containers
pnpm docker:down

# Reiniciar containers
pnpm docker:restart
```

Os serviços estarão disponíveis em:

- **PostgreSQL**: `localhost:5432` (user: `devplatform`, db: `devplatform`)
- **Redis**: `localhost:6379`
- **Qdrant**: `localhost:6333` (API), `localhost:6334` (gRPC)

### Desenvolvimento

```bash
# Inicie o ambiente de desenvolvimento (após Docker estar rodando)
pnpm dev
```

A aplicação estará disponível em:

- **API Gateway**: http://localhost:3001/health | http://localhost:3001/api (Swagger)
- **Management Service**: http://localhost:3002/health | http://localhost:3002/api
- **Mock Server**: http://localhost:3003/health | http://localhost:3003/api
- **Analytics Service**: http://localhost:3004/health | http://localhost:3004/api
- **AI Service**: http://localhost:3005/health | http://localhost:3005/api
- **Frontend**: http://localhost:3000 _(em breve)_

### Desenvolvimento

```bash
# Rodar todos os serviços
pnpm dev

# Rodar apenas o frontend
pnpm dev --filter=web

# Rodar apenas um microsserviço
pnpm dev --filter=api-gateway

# Build de produção
pnpm build

# Testes
pnpm test

# Lint
pnpm lint
\n+# Lint com auto-fix (todas as packages)
pnpm lint:fix
\n+# Format (escreve alterações)
pnpm format
\n+# Format (somente verificação)
pnpm format:check
\n+# Type checking global
pnpm typecheck
```

---

## 📖 Documentação

A documentação completa está disponível em [`/docs`](./docs):

- [Documentação Geral](./docs/README.md)
- [Especificação Técnica](./docs/technical-spec.md)
- [ADRs (Architecture Decision Records)](./docs/adrs)
- [API Reference](./docs/api)
- [Guides (Style/Testing)](./docs/guides/README.md)
- [Roadmap de Implementação](./docs/implementation/README.md)

---

## 🧪 Testes

```bash
# Rodar todos os testes
pnpm test

# Testes com coverage
pnpm test:cov

# Testes E2E
pnpm test:e2e

# Watch mode
pnpm test:watch
```

---

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](./LICENSE) para mais detalhes.

---

<div align="center">

**[⬆ Voltar ao topo](#developer-platform)**
