# Design System - Shadcn/ui + Storybook

## Contexto

Criar pacote de componentes UI compartilhado usando Shadcn/ui (Radix + Tailwind) e documentar com Storybook.

## Dependências

- Phase 0 completo

## Checkboxes

### Pesquisa

- [x] Docs Shadcn/ui (https://ui.shadcn.com)
- [x] Docs Storybook (https://storybook.js.org)
- [x] Docs Tailwind CSS (https://tailwindcss.com)
- [x] Verificar versões no npm

### Criar Package

- [x] Navegar para `packages/`
- [x] Criar `packages/ui/`
- [x] Executar `pnpm init` em packages/ui
- [x] Configurar name: `@dev-platform/ui`

### TypeScript Config

- [x] Criar `tsconfig.json` estendendo base
- [x] Configurar `composite: true` (removido - conflito com tsup)
- [x] Configurar `declarationMap: true`
- [x] jsx: `react-jsx`

### Tailwind Setup

- [x] Instalar: `pnpm add -D tailwindcss@latest` (4.1.17)
- [x] Instalar: `pnpm add -D postcss@latest` (8.5.6)
- [x] Instalar: `pnpm add -D autoprefixer@latest` (10.4.21)
- [x] Criar configs manualmente (não usamos init)

### Tailwind Config

- [x] Configurar content paths
- [x] Adicionar theme colors customizados (HSL system)
- [x] Configurar dark mode (class strategy)
- [x] Criar `globals.css` base

### Shadcn/ui Init

- [x] Criamos componentes manualmente seguindo pattern Shadcn
- [x] Configurado com Radix UI + CVA + Tailwind
- [x] Path: `src/components/ui`
- [x] Utility function `cn()` implementada

### Instalar Componentes Base

- [x] Button (manual com CVA variants - 9 stories)
- [x] Input (manual - 6 stories incluindo Phone BR)
- [x] Card (6 subcomponentes - 4 stories)
- [x] Label (manual atualizado com @radix-ui/react-label - 4 stories)
- [x] Dialog (@radix-ui/react-dialog - 4 stories)
- [x] Dropdown Menu (@radix-ui/react-dropdown-menu - 6 stories)
- [x] Table (HTML + Tailwind - 4 stories)
- [x] Toast (@radix-ui/react-toast + useToast hook - 5 stories com Success/Info/Destructive)
- [x] Form (react-hook-form + zod + @radix-ui/react-label/slot - 2 stories)

### Componentes Customizados

- [x] Criar `src/components/CodeEditor/` (Monaco wrapper)
- [x] Criar `src/components/DataTable/` (virtualizado)
- [x] Criar `src/components/Chart/` (Recharts wrapper)
- [x] Criar tipos em `.types.ts` para cada

### Storybook Setup

- [x] Executar: `npx storybook@latest init` (v10.0.6)
- [x] Vite + React configurado
- [x] Configurar Tailwind no Storybook (viteFinal com alias @/)
- [x] `.storybook/preview.ts` criado

### Storybook Config

- [x] Importar globals.css no preview
- [x] Configurar backgrounds (light/dark)
- [x] Configurado com dark theme por padrão
- [ ] Adicionar viewports customizados (opcional)
- [ ] Configurar addons adicionais (opcional)

### Stories Base

- [x] Criar `Button.stories.tsx` (9 variants)
- [x] Criar `Input.stories.tsx` (6 variants - adicionado Phone BR)
- [x] Criar `Card.stories.tsx` (4 variants)
- [x] Criar `Label.stories.tsx` (4 variants)
- [x] Criar `Dialog.stories.tsx` (4 variants: Default, WithFooter, CustomWidth, Scrollable)
- [x] Criar `DropdownMenu.stories.tsx` (6 variants: Default, WithShortcuts, WithCheckboxes, WithRadioGroup, WithSubMenu, Destructive)
- [x] Criar `Table.stories.tsx` (4 variants: Default, WithFooter, Simple, WithStatusBadges)
- [x] Criar `Toast.stories.tsx` (5 variants: Default, WithAction, Destructive, Success, Info, Multiple)
- [x] Criar `Form.stories.tsx` (2 variants: ProfileForm, Login)

### Stories Customizados

- [x] Criar `CodeEditor.stories.tsx` (9 stories)
- [x] Criar `DataTable.stories.tsx` (8 stories)
- [x] Criar `Chart.stories.tsx` (14 stories)
- [x] Adicionar variants e exemplos

### Design Tokens

- [x] Criar `src/tokens/colors.ts`
- [x] Criar `src/tokens/spacing.ts`
- [x] Criar `src/tokens/typography.ts`
- [x] Exportar em `src/tokens/index.ts`

### Exports

- [x] Criar `src/index.ts` principal
- [x] Exportar todos componentes UI base (Button, Input, Card, Label, Dialog, DropdownMenu, Table, Toast, Form)
- [x] Exportar ~70+ named exports incluindo componentes, tipos e utilities
- [x] Exportar componentes customizados (CodeEditor, DataTable, Chart)
- [x] Exportar tokens (colors, spacing, typography com tipos)

### Package.json Config

- [x] main: `dist/index.js`
- [x] module: `dist/index.mjs`
- [x] types: `dist/index.d.ts`
- [x] exports com subpaths (. e ./styles)
- [x] peerDependencies: react ^18.0.0 || ^19.0.0, react-dom

### Build Config

- [x] Instalar: `pnpm add -D tsup@latest` (8.3.5)
- [x] Criar `tsup.config.ts`
- [x] Configurar entry: `src/index.ts`
- [x] Format: esm + cjs
- [x] dts: true

### Scripts

- [x] `"storybook": "storybook dev -p 6007"`
- [x] `"build": "tsup"` (DTS incluído no tsup)
- [x] `"build-storybook": "storybook build"`
- [x] `"lint": "eslint src/"`
- [x] `"format": "prettier --write ."`
- [x] `"format:check": "prettier --check ."`
- [x] `"typecheck": "tsc -p tsconfig.json --noEmit"`

### Testes

- [x] Instalar `@testing-library/react@latest` (16.3.0)
- [x] Instalar `@testing-library/jest-dom@latest` (6.9.1)
- [x] Instalar `@testing-library/user-event@latest` (14.6.1)
- [x] Instalar `jest@latest` (30.2.0) + `ts-jest` (29.4.5)
- [x] Instalar `jest-environment-jsdom@latest` (30.2.0)
- [x] Configurar jest.config.ts com 100% coverage threshold
- [x] Criar tests/setup.ts com jest-dom
- [x] Criar tests/unit/ui/ directory
- [x] Criar `tests/unit/ui/button.test.tsx` (24 testes - 100% coverage)
- [x] Criar `tests/unit/ui/input.test.tsx` (29 testes - 100% coverage)

### Accessibility Tests

- [ ] Instalar `jest-axe@latest`
- [ ] Testar Button com axe
- [ ] Testar Form inputs com axe
- [ ] Testar Dialog (focus trap) com axe

### Documentação

- [ ] Criar `README.md` do package
- [ ] Documentar como usar componentes
- [ ] Adicionar link para Storybook
- [ ] Listar componentes disponíveis

### Validação

- [ ] `pnpm build` (compila sem erros)
- [ ] `pnpm dev` (Storybook abre)
- [ ] Testar todos componentes no Storybook
- [ ] `pnpm test` (100% coverage)
- [ ] Importar em outro package (smoke test)

## Arquivos Criados

```
packages/ui/
├── src/
│   ├── components/
│   │   ├── ui/              # Shadcn components
│   │   │   ├── button.tsx
│   │   │   ├── input.tsx
│   │   │   ├── card.tsx
│   │   │   └── ...
│   │   ├── CodeEditor/
│   │   │   ├── CodeEditor.tsx
│   │   │   └── CodeEditor.types.ts
│   │   ├── DataTable/
│   │   └── Chart/
│   ├── tokens/
│   │   ├── colors.ts
│   │   ├── spacing.ts
│   │   ├── typography.ts
│   │   └── index.ts
│   ├── lib/
│   │   └── utils.ts
│   ├── styles/
│   │   └── globals.css
│   └── index.ts
├── .storybook/
│   ├── main.ts
│   └── preview.ts
├── stories/
│   ├── Button.stories.tsx
│   └── ...
├── tests/
│   └── unit/ui/
├── tsup.config.ts
├── tailwind.config.ts
├── package.json
└── README.md
```

## Exemplo: tsup.config.ts

```typescript
import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  external: ['react', 'react-dom'],
})
```

## Exemplo: Button.test.tsx

```typescript
import { render, screen } from "@testing-library/react"
import { axe } from "jest-axe"
import { Button } from "@/components/ui/button"

describe("Button", () => {
  it("renders correctly", () => {
    render(<Button>Click me</Button>)
    expect(screen.getByText("Click me")).toBeInTheDocument()
  })

  it("handles click events", async () => {
    const handleClick = jest.fn()
    render(<Button onClick={handleClick}>Click</Button>)

    screen.getByText("Click").click()
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it("has no accessibility violations", async () => {
    const { container } = render(<Button>Accessible</Button>)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
})
```

## Recursos

- [Shadcn/ui Docs](https://ui.shadcn.com)
- [Storybook Install](https://storybook.js.org/docs/get-started/install)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Radix UI](https://www.radix-ui.com)
- [tsup](https://tsup.egoist.dev)

## Correções e Melhorias Aplicadas

### Organização de Arquivos

- ✅ Componentes reorganizados em estrutura de pastas (ComponentName/component-name.tsx + stories + index.ts)

### Tooling Fixes

- ✅ ESLint/Prettier conflict resolvido (disabled simple-import-sort/exports)
- ✅ React 19 deprecation fix (React.ElementRef → React.ComponentRef em todos componentes)

### Melhorias de Componentes

- ✅ Toast: Adicionados variants success (green) e info (blue) com cores distintas
- ✅ Input: Placeholder de telefone atualizado para formato brasileiro (11) 98765-4321
- ✅ Label: Atualizado para usar @radix-ui/react-label

### Build Output

- ✅ ESM: 28.34 KB
- ✅ CJS: 32.55 KB
- ✅ DTS: 12.45 KB
- ✅ 29+ stories no Storybook
- ✅ Zero erros TypeScript
- ✅ Zero warnings de lint

## Status Atual

**✅ Completo - 11 Componentes Base:**

1. Button (9 stories)
2. Input (6 stories)
3. Card (4 stories)
4. Label (4 stories)
5. Dialog (4 stories)
6. Dropdown Menu (6 stories)
7. Table (4 stories)
8. Toast (5 stories)
9. Form (2 stories)

**🔲 Pendente - Componentes Customizados:**

- CodeEditor (Monaco wrapper)
- DataTable (virtualizado)
- Chart (Recharts wrapper)

**✅ Completo - Design System:**

- Design Tokens (colors, spacing, typography)

**🔲 Pendente - Storybook:**

- Viewports customizados (opcional)

**🔲 Pendente - Testes:**

- Unit tests (100% coverage)
- Integration tests
- Accessibility tests (jest-axe)

## Próximo Passo

→ [02-types-validation.md](./02-types-validation.md)
