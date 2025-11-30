# Base Configs - TypeScript e Testes

## Contexto

Configurar TypeScript em modo estrito e definir diretrizes de testes por serviço
(unit, integration, e2e). Nesta fase não criamos configuração global de Jest na raiz;
cada app/serviço terá sua própria configuração de testes.

## Dependências

- 01-monorepo.md completo
- 02-tooling.md completo

## Checkboxes

### Pesquisa

- [x] Docs TypeScript (https://www.typescriptlang.org/docs/)
- [x] Docs Jest (https://jestjs.io/docs/getting-started)
- [x] Docs ts-jest (https://kulshekhar.github.io/ts-jest/)
- [x] Verificar últimas versões no npm

### TypeScript Base Config

- [x] Instalar (versão fixa): `pnpm add -D typescript@5.9.3`
- [x] Executar: `pnpm tsc --init`
- [x] Criar `tsconfig.base.json` na raiz
- [x] Configurar para monorepo (paths, references)

### TypeScript Strict Config

- [x] `"strict": true`
- [x] `"noImplicitAny": true`
- [x] `"strictNullChecks": true`
- [x] `"strictFunctionTypes": true`
- [x] `"noUnusedLocals": true`
- [x] `"noUnusedParameters": true`
- [x] `"noImplicitReturns": true`

### TypeScript Module Config (padrão do monorepo)

- [x] `"target": "ES2022"`
- [x] `"module": "ESNext"`
- [x] `"moduleResolution": "Node"`
- [x] `"lib": ["ES2022", "DOM"]`
- [x] `"jsx": "react-jsx"` (para apps React/Next.js)
- [x] `"esModuleInterop": true`
- [x] `"resolveJsonModule": true`

### TypeScript Path Aliases (padrão do monorepo)

- [x] Configurar `baseUrl: "."`
- [x] Adicionar paths: `"@ui/*": ["packages/ui/src/*"]`
- [x] Adicionar paths: `"@types/*": ["packages/types/src/*"]`
- [x] Adicionar paths: `"@sdk/*": ["packages/sdk/src/*"]`

### Jest Setup (por serviço)

- [x] Definir e instalar Jest por projeto (apps/ e services/) quando forem
      criados, com versões fixas.
- [x] Para projetos TypeScript usar `ts-jest` no escopo do projeto.
- [x] Não criar configuração Jest global na raiz.

### Jest Base Config (por serviço)

- [x] Criar `jest.config.ts` em cada projeto
- [x] Preset: `ts-jest`
- [x] testEnvironment: `node`
- [x] Configurar collectCoverage
- [x] Configurar coverageThreshold (100%)

### Jest Coverage Config

- [x] `coverageThreshold.global.branches: 100`
- [x] `coverageThreshold.global.functions: 100`
- [x] `coverageThreshold.global.lines: 100`
- [x] `coverageThreshold.global.statements: 100`

### Jest Path Mapping (por serviço)

- [x] Configurar `moduleNameMapper` para os aliases usados pelo projeto
- [x] Ex.: `"^@/(.*)$": "<rootDir>/src/$1"` (se o projeto usar `@/`)
- [x] Para pacotes do monorepo, importe via workspace (não mapeie `packages/*` no app)

### Estrutura de Testes (por serviço)

- [x] testMatch: `["**/tests/**/*.test.ts"]`
- [x] Separar `unit`, `integration` e `e2e` em cada projeto
- [x] `collectCoverageFrom`: `["src/**/*.ts"]`
- [x] `coveragePathIgnorePatterns`: `["node_modules", "dist", "tests"]`

### TypeScript Project References

- [x] Criar `tsconfig.json` em cada workspace
- [x] Estender `tsconfig.base.json`
- [ ] Configurar `references` entre projetos
- [ ] Configurar `composite: true` para libs

### Config para Apps Next.js

- [ ] Criar `tsconfig.json` específico em apps/web (quando criado)
- [ ] Incluir tipos Next.js
- [ ] jsx: `preserve`
- [ ] Incluir: `.next`, `next-env.d.ts`

### Config para Apps NestJS

- [x] Criar `tsconfig.json` específico por serviço
- [x] Incluir decorators: `experimentalDecorators: true`
- [x] Incluir metadata: `emitDecoratorMetadata: true`
- [x] outDir: `dist`

### Scripts Package.json

- [x] Adicionar `"typecheck": "tsc --noEmit"`
- [x] Adicionar `"test:unit": "jest --testPathPatterns=unit"`
- [x] Adicionar `"test:integration": "jest --testPathPatterns=integration"`
- [x] Adicionar `"test:e2e": "jest --testPathPatterns=e2e"`
- [x] Adicionar `"test:cov": "jest --coverage"`

### Turbo Config

- [x] Atualizar turbo.json com task "typecheck"
- [x] Task test com outputs: `["coverage/**"]`

### Playwright Setup (E2E por app web)

- [ ] Instalar no app web: `pnpm add -D @playwright/test@<versão>` (fixa) (quando app web for criado)
- [ ] Executar: `pnpm playwright install`
- [ ] Criar `playwright.config.ts` no app web
- [ ] Configurar baseURL, browsers, screenshots

### Playwright Config (exemplo app web)

- [ ] testDir: `tests/e2e`
- [ ] Browsers: chromium, firefox, webkit
- [ ] screenshots: `only-on-failure`
- [ ] video: `retain-on-failure`
- [ ] Configurar webServer (next dev)

### Testes Dummy (por projeto)

- [x] Criar `tests/unit/*.test.ts` (testes HealthController)
- [x] Criar estrutura `tests/integration/` (com .gitkeep)
- [x] Criar estrutura `tests/e2e/` (com .gitkeep)
- [x] Todos devem passar

### Documentação

- [x] Atualizar README do projeto com comandos de teste locais
- [x] Documentar estrutura de testes esperada por projeto
- [ ] Adicionar badges de coverage (futuro - quando CI configurado)

### Validação

- [x] `pnpm typecheck` (zero erros)
- [x] `pnpm test:unit` (no escopo do projeto)
- [x] `pnpm test:integration` (no escopo do projeto - sem testes ainda)
- [x] `pnpm test:e2e` (no escopo do projeto - sem testes ainda)
- [x] `pnpm test:cov` (alvo 100% por projeto)
- [x] `pnpm validate` (lint + prettier check na raiz)

## Arquivos Criados

```
dev-platform/
└── tsconfig.base.json (base do monorepo)

apps/
  web/
    ├── tsconfig.json
    ├── jest.config.ts (quando houver Jest)
    ├── playwright.config.ts (quando houver E2E)
    └── tests/{unit,integration,e2e}/ (quando aplicável)

services/
  <service-name>/
    ├── tsconfig.json
    ├── jest.config.ts
    └── tests/{unit,integration,e2e}/
```

## Exemplo: tsconfig.base.json (atual)

```jsonc
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "Node",
    "lib": ["ES2022", "DOM"],
    "jsx": "react-jsx",
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "forceConsistentCasingInFileNames": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "types": [],
    "baseUrl": ".",
    "paths": {
      "@ui/*": ["packages/ui/src/*"],
      "@types/*": ["packages/types/src/*"],
      "@sdk/*": ["packages/sdk/src/*"],
    },
  },
}
```

## Exemplo: jest.config.ts (por serviço)

```typescript
import type { Config } from 'jest'

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/tests/**/*.test.ts'],
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.types.ts',
    '!src/**/index.ts',
  ],
  coverageThreshold: {
    global: { branches: 100, functions: 100, lines: 100, statements: 100 },
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/dist/',
    '/tests/',
    '.types.ts$',
  ],
}

export default config
```

## Exemplo: playwright.config.ts (app web)

```typescript
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
  ],
  webServer: {
    command: 'pnpm dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
})
```

## Exemplo: Teste Dummy Unit (por projeto)

```typescript
// tests/unit/dummy.test.ts
describe('Dummy Test', () => {
  it('should pass', () => {
    expect(1 + 1).toBe(2)
  })

  it('should handle strings', () => {
    expect('hello').toBe('hello')
  })
})
```

## Exemplo: Teste Dummy E2E (app web)

```typescript
// tests/e2e/dummy.test.ts
import { test, expect } from '@playwright/test'

test('homepage loads', async ({ page }) => {
  await page.goto('/')
  await expect(page).toHaveTitle(/Dev Platform/)
})
```

## Recursos

- [TypeScript Config Reference](https://www.typescriptlang.org/tsconfig)
- [Jest Configuration](https://jestjs.io/docs/configuration)
- [ts-jest](https://kulshekhar.github.io/ts-jest/docs/getting-started/installation)
- [Playwright Docs](https://playwright.dev/docs/intro)
- [TypeScript Project References](https://www.typescriptlang.org/docs/handbook/project-references.html)

## Próximo Passo

→ Ao criar cada app/serviço, aplicar as diretrizes acima localmente, com
dependências e configs versionadas por projeto.
