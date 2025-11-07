# Phase 0 – Setup Inicial

Índice dos documentos desta fase. Ordem obrigatória.

## Objetivo
Preparar monorepo e tooling base (lint, format, testes, configs TS) para desenvolvimento consistente.

## Arquivos
- [01-monorepo.md](./01-monorepo.md) – Estrutura Turborepo + workspaces pnpm
- [02-tooling.md](./02-tooling.md) – ESLint, Prettier, Husky, lint-staged
- [03-base-configs.md](./03-base-configs.md) – tsconfig, jest, scripts validate/test

## Critério de Conclusão da Fase
- Monorepo instala sem erros
- Scripts `pnpm validate` e `pnpm test` funcionam
- Hooks de commit ativos

## Próxima Fase
Ir para [Phase 1 – Shared Packages](../01-shared/README.md)
