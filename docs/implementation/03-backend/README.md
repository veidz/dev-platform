# Phase 3 – Backend Microsserviços

Índice dos serviços e seus documentos.

## Objetivo

Implementar 5 serviços NestJS integrados via Redis e Postgres, com gateway e observabilidade.

## Serviços

- [01-api-gateway](./01-api-gateway/README.md) – Autenticação, rate limiting, proxy
- [02-management-service](./02-management-service/README.md) – CRUD de workspaces/APIs/endpoints
- [03-mock-server](./03-mock-server/README.md) – Geração de mocks e cenários
- [04-analytics-service](./04-analytics-service/README.md) – Ingestão de eventos e métricas
- [05-ai-service](./05-ai-service/README.md) – Embeddings, RAG e geração assistida

## Critério de Conclusão da Fase

- Serviços sobem localmente com Docker
- Gateway roteia corretamente
- Contratos documentados

## Próxima Fase

Ir para [Phase 4 – Deployment](../04-deployment/README.md)

---

[← Voltar ao índice geral de Documentação](../../README.md)
