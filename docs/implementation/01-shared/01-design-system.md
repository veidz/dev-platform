# Design System - Shadcn/ui + Storybook

## Contexto

Criar pacote de componentes UI compartilhado usando Shadcn/ui (Radix + Tailwind) e documentar com Storybook.

## Dependências

- Phase 0 completo

## Checkboxes

### Pesquisa

- [ ] Docs Shadcn/ui (https://ui.shadcn.com)
- [ ] Docs Storybook (https://storybook.js.org)
- [ ] Docs Tailwind CSS (https://tailwindcss.com)
- [ ] Verificar versões no npm

### Criar Package

- [ ] Navegar para `packages/`
- [ ] Criar `packages/ui/`
- [ ] Executar `pnpm init` em packages/ui
- [ ] Configurar name: `@dev-platform/ui`

### TypeScript Config

- [ ] Criar `tsconfig.json` estendendo base
- [ ] Configurar `composite: true`
- [ ] Configurar `declarationMap: true`
- [ ] jsx: `react-jsx`

### Tailwind Setup

- [ ] Instalar: `pnpm add -D tailwindcss@latest`
- [ ] Instalar: `pnpm add -D postcss@latest`
- [ ] Instalar: `pnpm add -D autoprefixer@latest`
- [ ] Executar: `npx tailwindcss init -p`

### Tailwind Config

- [ ] Configurar content paths
- [ ] Adicionar theme colors customizados
- [ ] Configurar dark mode (class strategy)
- [ ] Criar `globals.css` base

### Shadcn/ui Init

- [ ] Executar: `npx shadcn@latest init`
- [ ] Escolher style: Default ou New York
- [ ] Configurar baseColor
- [ ] Configurar components path: `src/components/ui`

### Instalar Componentes Base

- [ ] `npx shadcn@latest add button`
- [ ] `npx shadcn@latest add input`
- [ ] `npx shadcn@latest add card`
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

- [ ] Executar: `npx storybook@latest init`
- [ ] Escolher Vite + React
- [ ] Configurar Tailwind no Storybook
- [ ] Criar `.storybook/preview.ts`

### Storybook Config

- [ ] Importar globals.css no preview
- [ ] Configurar dark mode addon
- [ ] Adicionar viewports customizados
- [ ] Configurar backgrounds

### Stories Base

- [ ] Criar `Button.stories.tsx`
- [ ] Criar `Input.stories.tsx`
- [ ] Criar `Card.stories.tsx`
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

- [ ] Criar `src/index.ts` principal
- [ ] Exportar todos componentes UI
- [ ] Exportar componentes customizados
- [ ] Exportar theme provider e tokens

### Package.json Config

- [ ] main: `dist/index.js`
- [ ] module: `dist/index.mjs`
- [ ] types: `dist/index.d.ts`
- [ ] exports com subpaths
- [ ] peerDependencies: react, react-dom

### Build Config

- [ ] Instalar: `pnpm add -D tsup@latest`
- [ ] Criar `tsup.config.ts`
- [ ] Configurar entry: `src/index.ts`
- [ ] Format: esm + cjs
- [ ] dts: true

### Scripts

- [ ] `"dev": "storybook dev -p 6006"`
- [ ] `"build": "tsup && tsc --emitDeclarationOnly"`
- [ ] `"build:storybook": "storybook build"`
- [ ] `"lint": "eslint src/"`

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
- [Storybook for React](https://storybook.js.org/docs/react/get-started/install)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Radix UI](https://www.radix-ui.com)
- [tsup](https://tsup.egoist.dev)

## Próximo Passo

→ [02-types-validation.md](./02-types-validation.md)
