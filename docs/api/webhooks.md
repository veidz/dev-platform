# API - Webhooks

Guia para consumo e configuração de webhooks.

## Objetivo

Permitir integrações externas reagirem a eventos do Dev Platform.

## Eventos Planejados

- workspace.created
- workspace.updated
- api.added
- endpoint.added
- analytics.alert.triggered

## Segurança

- Assinatura HMAC no header `X-DevPlatform-Signature`
- Requisições HTTPS somente

> Detalhar exemplo de verificação de assinatura e retries após implementação.
