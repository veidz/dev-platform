# Tooling Setup - ESLint (Flat), Prettier, Husky, Lint-staged

## Contexto

Configurar ferramentas de qualidade de código: linting, formatação e pre-commit hooks.

## Dependências

- 01-monorepo.md completo

## Checkboxes

### Pesquisa

- [x] Docs ESLint (https://eslint.org/docs/latest/use/getting-started)
- [x] Docs Prettier (https://prettier.io/docs/en/)
- [x] Docs Husky (https://typicode.github.io/husky/)
- [x] Docs lint-staged (https://github.com/lint-staged/lint-staged)
- [x] Verificar versões no npm (todas fixadas, sem `latest`)

### ESLint Setup (Flat Config)

- [x] Não usar `.eslintrc.*` (usando `eslint.config.mjs`)
- [x] Instalar `eslint@9.39.1`
- [x] Instalar `@eslint/js@9.39.1`
- [x] Instalar `typescript-eslint@8.46.3`
- [x] Adicionar plugins: `eslint-plugin-import`, `eslint-plugin-simple-import-sort`, `eslint-plugin-unused-imports`
- [x] Criar `eslint.config.mjs` na raiz

### ESLint Rules

- [x] `"no-console": "warn"`
- [x] `"@typescript-eslint/no-explicit-any": "error"`
- [x] `"@typescript-eslint/explicit-function-return-type": "warn"`
- [x] `unused-imports/no-unused-imports: "error"`
- [x] `simple-import-sort/imports: "warn"` e `simple-import-sort/exports: "warn"`
- [x] `.eslintignore` (node_modules, dist, build, .turbo, coverage)

### Prettier Setup

- [x] Instalar: `prettier@3.6.2`
- [x] Criar `.prettierrc` na raiz (sem extensão .json)
- [x] Configurar regras conforme specs

### Prettier Config

- [x] `"semi": false`
- [x] `"singleQuote": true`
- [x] `"trailingComma": "all"`
- [x] `"tabWidth": 2`
- [x] `"printWidth": 80`
- [x] `"arrowParens": "always"`
- [x] `"endOfLine": "lf"`

### Prettier Ignore

- [x] Criar `.prettierignore`
- [x] Adicionar: node_modules, dist, .turbo, .next, pnpm-lock.yaml

### ESLint + Prettier Integration

- [x] Instalar `eslint-config-prettier` (desativa regras conflitantes)
- [x] Verificar ausência de conflitos (OK)

### Husky Setup

- [x] Executar `npx husky init`
- [x] `.husky/` criado
- [x] `prepare` script presente em `package.json`

### Lint-staged Setup

- [x] Instalar: `lint-staged@16.2.6`
- [x] Config em `package.json`
- [x] TS: eslint --fix + prettier write
- [x] JSON/MD: prettier write

### Pre-commit Hook

- [x] `.husky/pre-commit` chama `pnpm lint-staged`
- [x] Executável (inicializado pelo husky init)
- [x] Testado (commits anteriores passaram pelo hook)

### Scripts Package.json

- [x] `"lint": "turbo lint"` (agrega lint nos pacotes)
- [x] `"lint:fix": "turbo lint -- --fix"`
- [x] `"format": "prettier --write ."`
- [x] `"format:check": "prettier --check ."`
  > Pode-se adicionar script `lint:fix` futuramente se conveniente.

### Turbo Config

- [x] Task `lint` definida nos pacotes
- [x] Lint roda via turbo (cache ainda aproveitado; decisão: manter para velocidade)
- [x] `format` não gerenciada pelo turbo (executa diretamente)

### VSCode Settings (Opcional)

- [x] Criar `.vscode/settings.json`
- [x] formatOnSave
- [x] ESLint auto-fix
- [x] Extensões recomendadas

### Documentação

- [x] Atualizar README.md com comandos lint/format/lint:fix
  > Hooks locais são obrigatórios; não documentamos desativação.

### Testes

- [x] Arquivo com erros (usado em validações manuais, não versionado)
- [x] `pnpm lint` falha em caso de erro (verificado)
- [x] `pnpm lint:fix`
- [x] `pnpm format` formata
- [x] Commit dispara hook

### Validação

- [x] `pnpm lint` (zero erros após ajustes)
- [x] `pnpm format:check` (passando)
- [x] Commit aciona hook
- [x] Hook bloqueia commit com erros (Husky + lint-staged)

## Arquivos Criados

```
dev-platform/
├── eslint.config.mjs
├── .eslintignore
├── .prettierrc
├── .prettierignore
├── .husky/
│   ├── pre-commit
│   └── commit-msg
└── package.json (scripts + lint-staged)
```

## Exemplo: eslint.config.mjs (flat)

```javascript
// @ts-check
import js from '@eslint/js'
import importPlugin from 'eslint-plugin-import'
import simpleImportSort from 'eslint-plugin-simple-import-sort'
import unusedImports from 'eslint-plugin-unused-imports'
import tseslint from 'typescript-eslint'

export default [
  { ignores: ['node_modules', 'dist', 'build', '.turbo', 'coverage'] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    plugins: {
      import: importPlugin,
      'simple-import-sort': simpleImportSort,
      'unused-imports': unusedImports,
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/explicit-function-return-type': 'warn',
      'no-console': 'warn',
      'unused-imports/no-unused-imports': 'error',
      'simple-import-sort/imports': 'warn',
      'simple-import-sort/exports': 'warn',
    },
  },
]
```

## Exemplo: .prettierrc

```json
{
  "semi": false,
  "singleQuote": true,
  "trailingComma": "all",
  "tabWidth": 2,
  "printWidth": 80,
  "arrowParens": "always",
  "endOfLine": "lf"
}
```

## Exemplo: lint-staged config

```json
{
  "lint-staged": {
    "*.{ts,tsx}": ["eslint --fix", "prettier --write"],
    "*.{json,md}": ["prettier --write"]
  }
}
```

## Exemplo: .husky/pre-commit

```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

pnpm lint-staged
```

## Exemplo: .vscode/settings.json

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  },
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[typescriptreact]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  }
}
```

## Recursos

- [ESLint Getting Started](https://eslint.org/docs/latest/use/getting-started)
- [Prettier Options](https://prettier.io/docs/en/options.html)
- [Husky Docs](https://typicode.github.io/husky/)
- [lint-staged](https://github.com/lint-staged/lint-staged)
- [ESLint + Prettier](https://prettier.io/docs/en/integrating-with-linters.html)

## Próximo Passo

→ Iniciar scaffold de `apps/web` (Next.js) aplicando lint + format já configurados.
