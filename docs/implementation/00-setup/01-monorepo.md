# Monorepo Setup com Turborepo

## Contexto

Configurar estrutura inicial do monorepo usando Turborepo + pnpm workspaces. Este é o primeiro passo obrigatório antes de qualquer desenvolvimento.

## Dependências

- Node.js 22+
- pnpm 10+ instalado globalmente

## Checkboxes

### Pesquisa e Preparação

- [ ] Pesquisar docs oficiais do Turborepo (https://turbo.build/repo/docs)
- [ ] Pesquisar docs do pnpm workspaces (https://pnpm.io/workspaces)
- [ ] Verificar última versão do turbo no npm
- [ ] Verificar última versão do pnpm

### Inicialização do Projeto

- [ ] Criar diretório `dev-platform/`
- [ ] Executar `pnpm init` na raiz
- [ ] Instalar Turborepo: `pnpm add -D turbo@latest`
- [ ] Criar arquivo `pnpm-workspace.yaml`

### Estrutura de Diretórios

- [ ] Criar pasta `apps/`
- [ ] Criar pasta `packages/`
- [ ] Criar pasta `tests/` (unit, integration, e2e)
- [ ] Criar pasta `docs/`
- [ ] Criar pasta `.github/workflows/`

### Configuração Turborepo

- [ ] Criar `turbo.json` com pipeline básico
- [ ] Definir tasks: lint, test, build, dev
- [ ] Configurar dependências entre tasks
- [ ] Configurar cache local e remoto (Vercel)

### Scripts Package.json

- [ ] Adicionar script `dev` (turbo dev)
- [ ] Adicionar script `build` (turbo build)
- [ ] Adicionar script `lint` (turbo lint)
- [ ] Adicionar script `test` (turbo test)
- [ ] Adicionar script `validate` (lint + test + build)
- [ ] Adicionar script `clean` (remove node_modules, .turbo, dist)

### Gitignore

- [ ] Criar `.gitignore` com: node_modules, .turbo, dist, .env\*
- [ ] Adicionar arquivos de IDE (\*.vscode, .idea)
- [ ] Adicionar logs e cache

### Documentação

- [ ] Criar `README.md` básico na raiz
- [ ] Adicionar instruções de instalação
- [ ] Adicionar comandos disponíveis
- [ ] Adicionar estrutura de pastas

### Validação

- [ ] Executar `pnpm install` (deve instalar sem erros)
- [ ] Executar `pnpm dev` (deve rodar sem erros - mesmo sem apps)
- [ ] Executar `pnpm build` (deve passar mesmo sem apps)
- [ ] Verificar que `.turbo/` foi criado (cache)

## Arquivos Criados

```
dev-platform/
├── package.json           # Scripts principais
├── pnpm-workspace.yaml    # Config workspaces
├── turbo.json            # Config Turborepo
├── .gitignore            # Git ignore rules
├── README.md             # Documentação básica
├── apps/                 # Aplicações (vazio por enquanto)
├── packages/             # Pacotes compartilhados (vazio)
├── tests/                # Testes (vazio)
│   ├── unit/
│   ├── integration/
│   └── e2e/
├── docs/                 # Documentação
└── .github/
    └── workflows/        # CI/CD (vazio)
```

## Exemplo de Configuração

### pnpm-workspace.yaml

```yaml
packages:
  - "apps/*"
  - "packages/*"
```

### turbo.json (básico)

```json
{
  "$schema": "https://turbo.build/schema.json",
  "globalDependencies": ["**/.env.*local"],
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "dist/**", "build/**"]
    },
    "lint": {
      "cache": false
    },
    "test": {
      "cache": false
    },
    "dev": {
      "cache": false,
      "persistent": true
    }
  }
}
```

### package.json (scripts)

```json
{
  "name": "dev-platform",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "turbo dev",
    "build": "turbo build",
    "lint": "turbo lint",
    "test": "turbo test",
    "validate": "turbo lint test build",
    "clean": "turbo clean && rm -rf node_modules .turbo"
  },
  "devDependencies": {
    "turbo": "^2.3.3"
  },
  "packageManager": "pnpm@10.20.0"
}
```

## Recursos

- [Turborepo Docs](https://turbo.build/repo/docs)
- [pnpm Workspaces](https://pnpm.io/workspaces)
- [Turborepo Quickstart](https://turbo.build/repo/docs/getting-started)
- [Monorepo Best Practices](https://turbo.build/repo/docs/handbook)

## Próximo Passo

Após completar todos checkboxes e validar, avançar para:
→ [02-tooling.md](./02-tooling.md) (ESLint, Prettier, Husky)
