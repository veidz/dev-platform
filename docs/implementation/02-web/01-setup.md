# Next.js 16 Setup - App Router

## Contexto

Criar aplicação Next.js 16 com App Router, React 19, Turbopack e integração com packages compartilhados.

## Dependências

- Phase 0 completo
- Phase 1 completo

## Checkboxes

### Pesquisa

- [ ] Docs Next.js 16 (https://nextjs.org/docs)
- [ ] App Router guide
- [ ] Verificar versão no npm

### Criar App

- [ ] Navegar para `apps/`
- [ ] Executar `npx create-next-app@latest web`
- [ ] Escolher: TypeScript, App Router, Tailwind, src/ directory
- [ ] Move para estrutura monorepo

### Instalar Packages Compartilhados

- [ ] `pnpm add @dev-platform/ui@workspace:*`
- [ ] `pnpm add @dev-platform/shared@workspace:*`
- [ ] `pnpm add @dev-platform/sdk@workspace:*`

### Dependencies Adicionais

- [ ] `pnpm add next-themes@latest`
- [ ] `pnpm add zustand@latest`
- [ ] `pnpm add @tanstack/react-query@latest`
- [ ] `pnpm add socket.io-client@latest`
- [ ] `pnpm add react-hook-form@latest`
- [ ] `pnpm add @hookform/resolvers@latest`

### TypeScript Config

- [ ] Atualizar tsconfig para usar paths do monorepo
- [ ] Adicionar references para packages
- [ ] Configurar jsx: preserve

### Tailwind Config

- [ ] Importar preset de @dev-platform/ui
- [ ] Configurar content paths
- [ ] Dark mode: class

### Estrutura de Diretórios

- [ ] Criar `src/app/` (já existe)
- [ ] Criar `src/components/`
- [ ] Criar `src/lib/`
- [ ] Criar `src/hooks/`
- [ ] Criar `src/providers/`
- [ ] Criar `src/stores/`

### Providers

- [ ] Criar `src/providers/ThemeProvider.tsx`
- [ ] Criar `src/providers/QueryProvider.tsx`
- [ ] Criar `src/providers/AuthProvider.tsx`
- [ ] Wrapper em `src/providers/index.tsx`

### Layout Root

- [ ] Atualizar `src/app/layout.tsx`
- [ ] Importar globals.css da UI package
- [ ] Adicionar providers
- [ ] Configurar metadata

### Stores - Auth

- [ ] Criar `src/stores/auth.store.ts` (Zustand)
- [ ] State: user, tokens, isAuthenticated
- [ ] Actions: login, logout, refresh

### Stores - Workspace

- [ ] Criar `src/stores/workspace.store.ts`
- [ ] State: current workspace, list
- [ ] Actions: switch, update

### Lib - SDK Instance

- [ ] Criar `src/lib/sdk.ts`
- [ ] Instanciar DevPlatformSDK
- [ ] Configurar baseURL (env)

### Lib - Utils

- [ ] Criar `src/lib/utils.ts`
- [ ] cn() helper (clsx + tailwind-merge)
- [ ] formatDate, formatCurrency helpers

### Hooks - useAuth

- [ ] Criar `src/hooks/useAuth.ts`
- [ ] Wrapper do auth store
- [ ] useUser, useIsAuthenticated

### Hooks - useWorkspace

- [ ] Criar `src/hooks/useWorkspace.ts`
- [ ] Wrapper do workspace store

### Environment Variables

- [ ] Criar `.env.example`
- [ ] NEXT_PUBLIC_API_URL
- [ ] NEXT_PUBLIC_WS_URL

### Middleware

- [ ] Criar `src/middleware.ts`
- [ ] Proteger rotas autenticadas
- [ ] Redirect se não autenticado

### Home Page

- [ ] Criar `src/app/page.tsx`
- [ ] Landing page básica
- [ ] Links para login/register

### Layout Dashboard

- [ ] Criar `src/app/(dashboard)/layout.tsx`
- [ ] Sidebar navigation
- [ ] Header com user menu

### Components - Layout

- [ ] Criar `src/components/layout/Sidebar.tsx`
- [ ] Criar `src/components/layout/Header.tsx`
- [ ] Criar `src/components/layout/UserMenu.tsx`

### Scripts

- [ ] `"dev": "next dev --turbopack"`
- [ ] `"build": "next build"`
- [ ] `"start": "next start"`
- [ ] `"lint": "next lint"`

### Turbo Config

- [ ] Atualizar turbo.json com app web
- [ ] Task outputs: .next/\*\*

### Testes

- [ ] Criar `tests/unit/web/layout/Sidebar.test.tsx`
- [ ] Criar `tests/unit/web/hooks/useAuth.test.ts`
- [ ] Configurar jest para Next.js

### Validação

- [ ] `pnpm dev` (app inicia)
- [ ] Navegar localhost:3000
- [ ] Hot reload funciona
- [ ] `pnpm build` (sem erros)
- [ ] `pnpm lint` (zero warnings)
- [ ] `pnpm test` (testes passam)

## Arquivos Criados

```
apps/web/
├── src/
│   ├── app/
│   │   ├── (dashboard)/
│   │   │   └── layout.tsx
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   └── layout/
│   ├── providers/
│   │   ├── ThemeProvider.tsx
│   │   ├── QueryProvider.tsx
│   │   └── index.tsx
│   ├── stores/
│   │   ├── auth.store.ts
│   │   └── workspace.store.ts
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   └── useWorkspace.ts
│   ├── lib/
│   │   ├── sdk.ts
│   │   └── utils.ts
│   └── middleware.ts
├── .env.example
├── next.config.ts
├── tailwind.config.ts
└── package.json
```

## Exemplo: auth.store.ts

```typescript
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User, AuthTokens } from '@dev-platform/shared'

type AuthState = {
  user: User | null
  tokens: AuthTokens | null
  isAuthenticated: boolean
  login: (tokens: AuthTokens, user: User) => void
  logout: () => void
  updateUser: (user: User) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      tokens: null,
      isAuthenticated: false,
      login: (tokens, user) => set({ tokens, user, isAuthenticated: true }),
      logout: () => set({ user: null, tokens: null, isAuthenticated: false }),
      updateUser: (user) => set({ user }),
    }),
    { name: 'auth-storage' },
  ),
)
```

## Recursos

- [Next.js 16 Docs](https://nextjs.org/docs)
- [App Router](https://nextjs.org/docs/app)
- [Zustand](https://zustand-demo.pmnd.rs)
- [React Query](https://tanstack.com/query/latest)

## Próximo Passo

→ [02-auth-pages.md](./02-auth-pages.md)
