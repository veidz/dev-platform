# Tooling Setup - ESLint, Prettier, Husky, Lint-staged

## Contexto

Configurar ferramentas de qualidade de código: linting, formatação e pre-commit hooks.

## Dependências

- 01-monorepo.md completo

## Checkboxes

### Pesquisa

- [ ] Docs ESLint (https://eslint.org/docs/latest/use/getting-started)
- [ ] Docs Prettier (https://prettier.io/docs/en/)
- [ ] Docs Husky (https://typicode.github.io/husky/)
- [ ] Docs lint-staged (https://github.com/lint-staged/lint-staged)
- [ ] Verificar últimas versões no npm

### ESLint Setup

- [ ] Executar `pnpm create @eslint/config@latest` na raiz
- [ ] Selecionar: TypeScript, Node, style guide
- [ ] Instalar `@typescript-eslint/parser@latest`
- [ ] Instalar `@typescript-eslint/eslint-plugin@latest`
- [ ] Criar `.eslintrc.json` na raiz

### ESLint Rules

- [ ] Adicionar regra: `"no-console": "warn"`
- [ ] Adicionar regra: `"@typescript-eslint/no-explicit-any": "error"`
- [ ] Adicionar regra: `"@typescript-eslint/explicit-function-return-type": "warn"`
- [ ] Criar `.eslintignore` (node_modules, dist, .turbo, .next)

### Prettier Setup

- [ ] Instalar: `pnpm add -D prettier@latest`
- [ ] Criar `.prettierrc.json` na raiz
- [ ] Configurar regras conforme specs

### Prettier Config

- [ ] `"semi": false`
- [ ] `"singleQuote": true`
- [ ] `"trailingComma": "all"`
- [ ] `"tabWidth": 2`
- [ ] `"printWidth": 80`
- [ ] `"arrowParens": "always"`
- [ ] `"endOfLine": "lf"`

### Prettier Ignore

- [ ] Criar `.prettierignore`
- [ ] Adicionar: node_modules, dist, .turbo, .next, pnpm-lock.yaml

### ESLint + Prettier Integration

- [ ] Instalar `eslint-config-prettier@latest`
- [ ] Instalar `eslint-plugin-prettier@latest`
- [ ] Adicionar "prettier" ao extends do ESLint
- [ ] Testar conflitos (não deve haver)

### Husky Setup

- [ ] Executar `npx husky init`
- [ ] Verificar que `.husky/` foi criado
- [ ] Verificar que `prepare` script foi adicionado ao package.json

### Lint-staged Setup

- [ ] Instalar: `pnpm add -D lint-staged@latest`
- [ ] Criar config no package.json ou `.lintstagedrc.json`
- [ ] Configurar para TypeScript: eslint + prettier
- [ ] Configurar para outros: prettier only

### Pre-commit Hook

- [ ] Criar/editar `.husky/pre-commit`
- [ ] Adicionar: `pnpm lint-staged`
- [ ] Tornar executável: `chmod +x .husky/pre-commit`
- [ ] Testar hook (fazer commit dummy)

### Scripts Package.json

- [ ] Adicionar `"lint": "eslint . --ext .ts,.tsx"`
- [ ] Adicionar `"lint:fix": "eslint . --ext .ts,.tsx --fix"`
- [ ] Adicionar `"format": "prettier --write \"**/*.{ts,tsx,json,md}\""`
- [ ] Adicionar `"format:check": "prettier --check \"**/*.{ts,tsx,json,md}\""`

### Turbo Config

- [ ] Atualizar turbo.json com task "lint"
- [ ] Cache: false (lint sempre roda)
- [ ] Atualizar task "format" se necessário

### VSCode Settings (Opcional)

- [ ] Criar `.vscode/settings.json`
- [ ] Configurar format on save
- [ ] Configurar ESLint auto-fix
- [ ] Adicionar extensões recomendadas

### Documentação

- [ ] Atualizar README.md com comandos lint/format
- [ ] Documentar como desabilitar hooks localmente
- [ ] Adicionar troubleshooting comum

### Testes

- [ ] Criar arquivo teste com erros de lint propositais
- [ ] Executar `pnpm lint` (deve falhar)
- [ ] Executar `pnpm lint:fix` (deve corrigir)
- [ ] Executar `pnpm format` (deve formatar)
- [ ] Fazer commit (hook deve rodar)

### Validação

- [ ] `pnpm lint` em arquivos existentes (zero erros)
- [ ] `pnpm format:check` (tudo formatado)
- [ ] Commit aciona hook corretamente
- [ ] Hook bloqueia commit com erros

## Arquivos Criados

```
dev-platform/
├── .eslintrc.json
├── .eslintignore
├── .prettierrc.json
├── .prettierignore
├── .husky/
│   ├── pre-commit
│   └── _/
├── .vscode/
│   └── settings.json
└── package.json (atualizado)
```

## Exemplo: .eslintrc.json

```json
{
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "ecmaVersion": "latest",
    "sourceType": "module"
  },
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "prettier"
  ],
  "plugins": ["@typescript-eslint"],
  "rules": {
    "no-console": "warn",
    "@typescript-eslint/no-explicit-any": "error",
    "@typescript-eslint/explicit-function-return-type": "warn"
  },
  "env": {
    "node": true,
    "es2022": true
  }
}
```

## Exemplo: .prettierrc.json

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

→ [03-base-configs.md](./03-base-configs.md) (TypeScript e Jest configs)
