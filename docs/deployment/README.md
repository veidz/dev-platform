# Deployment

Índice dos ambientes e guias de deploy.

## Ambientes

- [Local](./local.md) – Setup local com Docker/Compose
- [Staging](./staging.md) – Fluxo de staging, smoke tests e rollback
- [Produção](./production.md) – Deploy, observabilidade e segurança

## Objetivo

Garantir entrega contínua com pipelines robustos e ambientes reproduzíveis.

## Boas Práticas

- Usar `--frozen-lockfile` nos pipelines
- Separar variáveis sensíveis por ambiente
- Testes e smoke tests como gates de deploy

---

[← Voltar ao índice geral de Documentação](../README.md)
