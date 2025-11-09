# Monorepo Setup com Turborepo

## Contexto

Configurar estrutura inicial do monorepo usando Turborepo + pnpm workspaces. Este é o primeiro passo obrigatório antes de qualquer desenvolvimento.

## Dependências

- Node.js 22+
- pnpm 10+ instalado globalmente

## Checkboxes

### Pesquisa e Preparação

- [x] Pesquisar docs oficiais do Turborepo (https://turbo.build/repo/docs)
- [x] Pesquisar docs do pnpm workspaces (https://pnpm.io/workspaces)
- [x] Verificar última versão do turbo no npm
- [x] Verificar última versão do pnpm

### Inicialização do Projeto

- [x] Criar diretório `dev-platform/`
- [x] Executar `pnpm init` na raiz
- [x] Instalar Turborepo: `pnpm add -D turbo@<versão fixada>`
- [x] Criar arquivo `pnpm-workspace.yaml`

### Estrutura de Diretórios

- [x] Criar pasta `apps/`
- [x] Criar pasta `packages/`
- [ ] Criar pasta de `tests/` por serviço dentro de `apps/<serviço>/tests/` (unit, integration, e2e) — será feito no scaffold de cada serviço
- [x] Criar pasta `docs/`
- [x] Criar pasta `.github/workflows/`

### Configuração Turborepo

- [x] Criar `turbo.json` com pipeline básico
- [x] Definir tasks: lint, test, build, dev (e typecheck)
- [x] Configurar dependências entre tasks
- [ ] Configurar cache remoto (Vercel) — pendente até definir credenciais/projeto

### Scripts Package.json

- [x] Adicionar script `dev` (turbo dev)
- [x] Adicionar script `build` (turbo build)
- [x] Adicionar script `lint` (turbo lint)
- [x] Adicionar script `test` (turbo test)
- [x] Adicionar script `validate` (somente lint + prettier check)
- [x] Adicionar script `clean` (remove node_modules, .turbo, dist)

### Gitignore

- [x] Criar `.gitignore` com: node_modules, .turbo, dist, .env\*
- [x] Adicionar arquivos de IDE (\*.vscode, .idea)
- [x] Adicionar logs e cache

### Documentação

- [x] Criar `README.md` básico na raiz
- [x] Adicionar instruções de instalação
- [x] Adicionar comandos disponíveis
- [x] Adicionar estrutura de pastas

### Validação

- [x] Executar `pnpm install` (deve instalar sem erros)
- [x] Executar `pnpm dev` (deve rodar sem erros - mesmo sem apps)
- [x] Executar `pnpm build` (deve passar mesmo sem apps)
- [x] Verificar que `.turbo/` foi criado (cache)

## Arquivos Criados

```
dev-platform/
├── package.json           # Scripts principais
├── pnpm-workspace.yaml    # Config workspaces
├── turbo.json             # Config Turborepo
├── .gitignore            # Git ignore rules
├── README.md             # Documentação básica
├── apps/                 # Aplicações (vazio por enquanto)
├── packages/             # Pacotes compartilhados (vazio)
│
│  # Os diretórios de testes serão criados por serviço
│  # Exemplo (quando os serviços forem criados):
│  # apps/api-gateway/tests/{unit,integration,e2e}
│  # apps/management-service/tests/{unit,integration,e2e}
├── docs/                 # Documentação
└── .github/
    └── workflows/        # CI/CD (vazio)
```

## Exemplo de Configuração

### pnpm-workspace.yaml

```yaml
packages:
  - 'apps/*'
  - 'packages/*'
```

### turbo.json (básico)

```json
{
  "$schema": "https://turborepo.com/schema.json",
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", "build/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "lint": {},
    "typecheck": {},
    "test": {
      "dependsOn": ["^build"]
    },
    "test:cov": {
      "dependsOn": ["^build"],
      "outputs": ["coverage/**"]
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
  "type": "module",
  "scripts": {
    "dev": "turbo dev",
    "build": "turbo build",
    "lint": "turbo lint",
    "test": "turbo test",
    "format": "prettier --write .",
    "format:check": "prettier --check .",
    "validate": "pnpm -w lint && pnpm -w format:check",
    "clean": "rm -rf node_modules .turbo packages/*/dist apps/*/dist"
  },
  "devDependencies": {
    "turbo": "2.6.0"
  },
  "packageManager": "pnpm@10.0.0"
}

> Nota: `validate` foca apenas em qualidade de código (ESLint + Prettier check) para feedback rápido em PRs. Testes e build são executados em workflows separados (`tests.yml`).
```

## Recursos

- [Turborepo Docs](https://turbo.build/repo/docs)
- [pnpm Workspaces](https://pnpm.io/workspaces)
- [Turborepo Quickstart](https://turbo.build/repo/docs/getting-started)
- [Monorepo Best Practices](https://turbo.build/repo/docs/handbook)

## Próximo Passo

Após completar todos checkboxes e validar, avançar para:
→ [02-tooling.md](./02-tooling.md) (ESLint, Prettier, Husky)
