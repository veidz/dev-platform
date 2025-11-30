# Testing Guide

Estratégia de testes e boas práticas.

## Pirâmide de Testes

- Unit: 60%
- Integration: 30%
- E2E: 10%

## Requisitos

- Cobertura 100% (branches, functions, lines, statements)
- Testes não devem depender da ordem de execução
- Nomes de testes descritivos com `arrange/act/assert`

## Ferramentas

- Jest para unit/integration
- Playwright para e2e

## Estrutura de Pastas

```
/ tests
  /unit
  /integration
  /e2e
```

## Dicas

- Mockar dependências externas em unit
- Testes de integração com banco isolado
- E2E só para fluxos críticos

> Documento inicial; expandir com exemplos conforme módulos forem implementados.
