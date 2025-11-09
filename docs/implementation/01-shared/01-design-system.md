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

- [x] Button (manual com CVA variants)
- [x] Input (manual)
- [x] Card (6 subcomponentes)
- [x] Label (manual)
- [ ] `npx shadcn@latest add dialog`
- [ ] `npx shadcn@latest add dropdown-menu`
- [ ] `npx shadcn@latest add table`
- [ ] `npx shadcn@latest add toast`
- [ ] `npx shadcn@latest add form`

### Componentes Customizados

- [ ] Criar `src/components/CodeEditor/` (Monaco wrapper)
- [ ] Criar `src/components/DataTable/` (virtualizado)
- [ ] Criar `src/components/Chart/` (Recharts wrapper)
- [ ] Criar tipos em `.types.ts` para cada

### Storybook Setup

- [x] Executar: `npx storybook@latest init` (v10.0.6)
- [x] Vite + React configurado
- [x] Configurar Tailwind no Storybook (viteFinal com alias @/)
- [x] `.storybook/preview.ts` criado

### Storybook Config

- [x] Importar globals.css no preview
- [x] Configurar backgrounds (light/dark)
- [ ] Adicionar viewports customizados
- [ ] Configurar addons adicionais

### Stories Base

- [x] Criar `Button.stories.tsx` (9 variants)
- [x] Criar `Input.stories.tsx` (5 variants)
- [x] Criar `Card.stories.tsx` (4 variants)
- [x] Criar `Label.stories.tsx` (4 variants)
- [ ] Criar `Dialog.stories.tsx`
- [ ] Criar `Form.stories.tsx`

### Stories Customizados

- [ ] Criar `CodeEditor.stories.tsx`
- [ ] Criar `DataTable.stories.tsx`
- [ ] Criar `Chart.stories.tsx`
- [ ] Adicionar variants e exemplos

### Design Tokens

- [ ] Criar `src/tokens/colors.ts`
- [ ] Criar `src/tokens/spacing.ts`
- [ ] Criar `src/tokens/typography.ts`
- [ ] Exportar em `src/tokens/index.ts`

### Theme Provider

- [ ] Criar `src/providers/ThemeProvider.tsx`
- [ ] Implementar dark/light toggle
- [ ] Persistir em localStorage
- [ ] Exportar hook `useTheme()`

### Exports

- [x] Criar `src/index.ts` principal
- [x] Exportar todos componentes UI base (Button, Input, Card, Label)
- [ ] Exportar componentes customizados (CodeEditor, DataTable, Chart)
- [ ] Exportar theme provider e tokens

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

### Testes

- [ ] Criar `tests/unit/ui/Button.test.tsx`
- [ ] Criar `tests/unit/ui/Input.test.tsx`
- [ ] Instalar `@testing-library/react@latest`
- [ ] Instalar `@testing-library/jest-dom@latest`
- [ ] Configurar jest para React

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
│   ├── providers/
│   │   └── ThemeProvider.tsx
│   ├── tokens/
│   │   ├── colors.ts
│   │   ├── spacing.ts
│   │   └── index.ts
│   ├── globals.css
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

## Exemplo: ThemeProvider.tsx

```typescript
import { createContext, useContext, useEffect, useState } from "react"

type Theme = "dark" | "light" | "system"

type ThemeContextType = {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    return (localStorage.getItem("theme") as Theme) || "system"
  })

  useEffect(() => {
    const root = window.document.documentElement
    root.classList.remove("light", "dark")

    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light"
      root.classList.add(systemTheme)
      return
    }

    root.classList.add(theme)
  }, [theme])

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) throw new Error("useTheme must be used within ThemeProvider")
  return context
}
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

## Próximo Passo

→ [02-types-validation.md](./02-types-validation.md)
