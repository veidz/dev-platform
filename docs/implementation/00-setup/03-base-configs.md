# Base Configs - TypeScript e Jest

## Contexto

Configurar TypeScript strict mode e Jest para testes unitários, integração e E2E.

## Dependências

- 01-monorepo.md completo
- 02-tooling.md completo

## Checkboxes

### Pesquisa

- [ ] Docs TypeScript (https://www.typescriptlang.org/docs/)
- [ ] Docs Jest (https://jestjs.io/docs/getting-started)
- [ ] Docs ts-jest (https://kulshekhar.github.io/ts-jest/)
- [ ] Verificar últimas versões no npm

### TypeScript Base Config

- [ ] Instalar: `pnpm add -D typescript@latest`
- [ ] Executar: `pnpm tsc --init`
- [ ] Criar `tsconfig.base.json` na raiz
- [ ] Configurar para monorepo (paths, references)

### TypeScript Strict Config

- [ ] `"strict": true`
- [ ] `"noImplicitAny": true`
- [ ] `"strictNullChecks": true`
- [ ] `"strictFunctionTypes": true`
- [ ] `"noUnusedLocals": true`
- [ ] `"noUnusedParameters": true`
- [ ] `"noImplicitReturns": true`

### TypeScript Module Config

- [ ] `"target": "ES2022"`
- [ ] `"module": "commonjs"` (Node) ou `"esnext"` (Next.js)
- [ ] `"moduleResolution": "bundler"`
- [ ] `"esModuleInterop": true`
- [ ] `"resolveJsonModule": true`

### TypeScript Path Aliases

- [ ] Configurar `baseUrl: "."`
- [ ] Adicionar paths: `"@/*": ["src/*"]`
- [ ] Adicionar paths: `"@shared/*": ["packages/shared/src/*"]`
- [ ] Adicionar paths: `"@ui/*": ["packages/ui/src/*"]`

### Jest Setup

- [ ] Instalar: `pnpm add -D jest@latest`
- [ ] Instalar: `pnpm add -D ts-jest@latest`
- [ ] Instalar: `pnpm add -D @types/jest@latest`
- [ ] Executar: `pnpm jest --init` (escolher TypeScript)

### Jest Base Config

- [ ] Criar `jest.config.base.ts` na raiz
- [ ] Preset: `ts-jest`
- [ ] testEnvironment: `node`
- [ ] Configurar collectCoverage
- [ ] Configurar coverageThreshold (100%)

### Jest Coverage Config

- [ ] `coverageThreshold.global.branches: 100`
- [ ] `coverageThreshold.global.functions: 100`
- [ ] `coverageThreshold.global.lines: 100`
- [ ] `coverageThreshold.global.statements: 100`

### Jest Path Mapping

- [ ] Configurar moduleNameMapper para path aliases
- [ ] `"^@/(.*)$": "<rootDir>/src/$1"`
- [ ] `"^@shared/(.*)$": "<rootDir>/packages/shared/src/$1"`
- [ ] `"^@ui/(.*)$": "<rootDir>/packages/ui/src/$1"`

### Jest Test Structure

- [ ] testMatch: `["**/tests/**/*.test.ts"]`
- [ ] Separar unit, integration, e2e
- [ ] collectCoverageFrom: `["src/**/*.ts"]`
- [ ] coveragePathIgnorePatterns: `["node_modules", "dist", "tests"]`

### TypeScript Project References

- [ ] Criar `tsconfig.json` em cada workspace
- [ ] Estender `tsconfig.base.json`
- [ ] Configurar `references` entre projetos
- [ ] Configurar `composite: true` para libs

### Config para Apps Next.js

- [ ] Criar `tsconfig.json` específico em apps/web
- [ ] Incluir tipos Next.js
- [ ] jsx: `preserve`
- [ ] Incluir: `.next`, `next-env.d.ts`

### Config para Apps NestJS

- [ ] Criar `tsconfig.json` específico por serviço
- [ ] Incluir decorators: `experimentalDecorators: true`
- [ ] Incluir metadata: `emitDecoratorMetadata: true`
- [ ] outDir: `dist`

### Scripts Package.json

- [ ] Adicionar `"typecheck": "tsc --noEmit"`
- [ ] Adicionar `"test:unit": "jest --testPathPattern=unit"`
- [ ] Adicionar `"test:integration": "jest --testPathPattern=integration"`
- [ ] Adicionar `"test:e2e": "jest --testPathPattern=e2e"`
- [ ] Adicionar `"test:cov": "jest --coverage"`

### Turbo Config

- [ ] Atualizar turbo.json com task "typecheck"
- [ ] Task test com outputs: `["coverage/**"]`
- [ ] Adicionar dependsOn para typecheck antes de test

### Playwright Setup (E2E)

- [ ] Instalar: `pnpm add -D @playwright/test@latest`
- [ ] Executar: `pnpm playwright install`
- [ ] Criar `playwright.config.ts` na raiz
- [ ] Configurar baseURL, browsers, screenshots

### Playwright Config

- [ ] testDir: `tests/e2e`
- [ ] Browsers: chromium, firefox, webkit
- [ ] screenshots: `only-on-failure`
- [ ] video: `retain-on-failure`
- [ ] Configurar webServer (next dev)

### Testes Dummy

- [ ] Criar `tests/unit/dummy.test.ts` (teste simples)
- [ ] Criar `tests/integration/dummy.test.ts`
- [ ] Criar `tests/e2e/dummy.test.ts` (Playwright)
- [ ] Todos devem passar

### Documentação

- [ ] Atualizar README com comandos test
- [ ] Documentar estrutura de testes esperada
- [ ] Adicionar badges de coverage (futuro)

### Validação

- [ ] `pnpm typecheck` (zero erros)
- [ ] `pnpm test:unit` (dummy tests passam)
- [ ] `pnpm test:integration` (dummy tests passam)
- [ ] `pnpm test:e2e` (dummy tests passam)
- [ ] `pnpm test:cov` (100% coverage nos dummy)
- [ ] `pnpm validate` (tudo passa)

## Arquivos Criados

```
dev-platform/
├── tsconfig.base.json
├── jest.config.base.ts
├── playwright.config.ts
├── tests/
│   ├── unit/
│   │   └── dummy.test.ts
│   ├── integration/
│   │   └── dummy.test.ts
│   └── e2e/
│       └── dummy.test.ts
└── package.json (scripts adicionados)
```

## Exemplo: tsconfig.base.json

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "commonjs",
    "lib": ["ES2022"],
    "moduleResolution": "bundler",
    "esModuleInterop": true,
    "strict": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@shared/*": ["packages/shared/src/*"],
      "@ui/*": ["packages/ui/src/*"]
    }
  },
  "exclude": ["node_modules", "dist", ".turbo", ".next"]
}
```

## Exemplo: jest.config.base.ts

```typescript
import type { Config } from "jest"

const config: Config = {
  preset: "ts-jest",
  testEnvironment: "node",
  roots: ["<rootDir>"],
  testMatch: ["**/tests/**/*.test.ts"],
  collectCoverageFrom: [
    "src/**/*.ts",
    "!src/**/*.types.ts",
    "!src/**/index.ts",
  ],
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100,
    },
  },
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    "^@shared/(.*)$": "<rootDir>/packages/shared/src/$1",
    "^@ui/(.*)$": "<rootDir>/packages/ui/src/$1",
  },
  coveragePathIgnorePatterns: [
    "/node_modules/",
    "/dist/",
    "/tests/",
    ".types.ts$",
  ],
}

export default config
```

## Exemplo: playwright.config.ts

```typescript
import { defineConfig, devices } from "@playwright/test"

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: "html",
  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "firefox",
      use: { ...devices["Desktop Firefox"] },
    },
  ],
  webServer: {
    command: "pnpm dev",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
  },
})
```

## Exemplo: Teste Dummy Unit

```typescript
// tests/unit/dummy.test.ts
describe("Dummy Test", () => {
  it("should pass", () => {
    expect(1 + 1).toBe(2)
  })

  it("should handle strings", () => {
    expect("hello").toBe("hello")
  })
})
```

## Exemplo: Teste Dummy E2E

```typescript
// tests/e2e/dummy.test.ts
import { test, expect } from "@playwright/test"

test("homepage loads", async ({ page }) => {
  await page.goto("/")
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

✅ **Phase 0 completo!**

→ [Phase 1: Shared Packages](../01-shared/01-design-system.md)
