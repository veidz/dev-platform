# Documentação Dev Platform

Índice completo da documentação técnica e roadmap de implementação.

---

## 📖 Visão Geral

- **[README Principal](../README.md)** - Overview do projeto, quick start
- **[Especificação Técnica](./technical-spec.md)** - Arquitetura completa, stack, features

---

## 🏗️ Decisões Arquiteturais (ADRs)

Documentação de decisões técnicas fundamentais:

1. **[Estratégia de Monorepo](./adrs/001-monorepo-strategy.md)** - Turborepo
2. **[Framework Frontend](./adrs/002-framework-frontend.md)** - Next.js 16
3. **[Framework Backend](./adrs/003-framework-backend.md)** - NestJS
4. **[Comunicação Microsserviços](./adrs/004-microservices-communication.md)** - Redis Pub/Sub
5. **[Banco de Dados e ORM](./adrs/005-database-orm.md)** - PostgreSQL + Prisma
6. **[Comunicação Real-time](./adrs/006-realtime-communication.md)** - Socket.io
7. **[Estratégia de Cache](./adrs/007-caching-strategy.md)** - Redis multi-layer
8. **[Autenticação e Autorização](./adrs/008-authentication-authorization.md)** - JWT + RBAC
9. **[Integração de IA](./adrs/009-ai-strategy.md)** - RAG + GPT-4o-mini

---

## 🚀 Roadmap de Implementação

Guias passo-a-passo com checkboxes para desenvolvimento:

### [📂 Implementation Roadmap](./implementation/)

Estrutura modular dividida por fases:

- **Phase 0**: [Setup Inicial](./implementation/00-setup/) - Monorepo, tooling, configs
- **Phase 1**: [Shared Packages](./implementation/01-shared/) - Design system, types, SDK
- **Phase 2**: [Frontend (Web)](./implementation/02-web/) - Next.js app, páginas, testes
- **Phase 3**: [Backend Services](./implementation/03-backend/) - 5 microsserviços
- **Phase 4**: [Deployment](./implementation/04-deployment/) - CI/CD, staging, produção

**Cada fase contém arquivos específicos com checkboxes detalhados.**

---

## 🔧 Guias Adicionais

### Desenvolvimento

- [Style Guide](./guides/style-guide.md) _(a criar)_
- [Testing Guide](./guides/testing.md) _(a criar)_

### API

- [Autenticação](./api/authentication.md) _(a criar)_
- [Endpoints](./api/endpoints.md) _(a criar)_
- [Webhooks](./api/webhooks.md) _(a criar)_

### Deploy

- [Ambiente Local](./deployment/local.md) _(a criar)_
- [Staging](./deployment/staging.md) _(a criar)_
- [Produção](./deployment/production.md) _(a criar)_

---

## 🎯 Como Usar Esta Documentação

### Para Desenvolvedores Iniciando

1. Leia [README Principal](../README.md) - Entenda o projeto
2. Leia [Especificação Técnica](./technical-spec.md) - Arquitetura completa
3. Siga [Implementation Roadmap](./implementation/) - Implemente fase por fase

### Para Entender Decisões Técnicas

- Consulte [ADRs](./adrs/) específicos por tema

---

_Documentação viva - atualizada conforme projeto evolui_
