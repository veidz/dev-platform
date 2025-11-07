# API Gateway

## Objetivo

Centralizar autenticação, rate limiting e roteamento para os microsserviços.

## Documentos

- [01-setup.md](./01-setup.md) – Bootstrapping do serviço
- [02-auth-module.md](./02-auth-module.md) – JWT/OAuth, guards, estratégias
- [03-rate-limiting.md](./03-rate-limiting.md) – Limites por chave/IP via Redis
- [04-routing-proxy.md](./04-routing-proxy.md) – Proxy e forwarding para serviços internos

## Critério de Conclusão

- Autenticação funcional
- Rate limiting ativo
- Roteamento correto para todos serviços

---

[← Voltar ao índice de Backend](../README.md) | [Índice Geral](../../../README.md)
