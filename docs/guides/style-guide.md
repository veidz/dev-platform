# Style Guide

Padrões de código e estilo para o Dev Platform.

## Objetivo

Definir diretrizes para consistência, legibilidade e mantenibilidade do código em todo o monorepo.

## Princípios

- KISS (Keep It Simple, Stupid)
- Clean Code: nomes descritivos, sem abreviações internas
- Sem acoplamento desnecessário, preferir composição a herança quando aplicável

## Convenções Gerais

- Máximo 100 caracteres por linha
- Funções até 50 linhas (extraia se maior)
- Arquivos até 300 linhas (divida em módulos)
- Tipagem explícita (sem `any`)

## Nomenclatura

- Use nomes descritivos mesmo que longos
- Evite nomes genéricos como `data`, `info`, `handle`
- Prefira verbos para funções: `calculateTotal`, `fetchUserProfile`

## Organizaçao

- Separar tipos em arquivos `*.types.ts`
- Não colocar testes dentro de `src/`

## Linters e Formatters

- ESLint + Prettier obrigatórios
- Corrija todos os avisos e erros antes de commitar

> Este documento é vivo e deve ser ajustado conforme novas decisões.
