# Workspace Dashboard

## Contexto

Dashboard principal com seleção de workspace, settings e gerenciamento de membros.

## Dependências

- 02-auth-pages.md completo

## Checkboxes

### Estrutura

- [ ] `src/app/(dashboard)/page.tsx`
- [ ] `src/app/(dashboard)/settings/page.tsx`
- [ ] `src/app/(dashboard)/settings/members/page.tsx`

### Components - Dashboard

- [ ] `src/components/dashboard/WorkspaceSwitcher.tsx`
- [ ] `src/components/dashboard/StatsCard.tsx`
- [ ] `src/components/dashboard/RecentActivity.tsx`

### Components - Settings

- [ ] `src/components/settings/WorkspaceForm.tsx`
- [ ] `src/components/settings/MembersList.tsx`
- [ ] `src/components/settings/InviteMemberDialog.tsx`

### Hooks

- [ ] `src/hooks/useWorkspaces.ts` (React Query)
- [ ] `src/hooks/useMembers.ts`

### Testes

- [ ] `tests/unit/web/dashboard/WorkspaceSwitcher.test.tsx`
- [ ] `tests/unit/web/settings/MembersList.test.tsx`

### Validação

- [ ] Dashboard exibe stats
- [ ] Workspace switcher funciona
- [ ] Convidar membro funciona
- [ ] `pnpm test` (100% coverage)

## Arquivos Criados

```
src/
├── app/(dashboard)/
│   ├── page.tsx
│   └── settings/
│       ├── page.tsx
│       └── members/page.tsx
├── components/
│   ├── dashboard/
│   └── settings/
└── hooks/
    ├── useWorkspaces.ts
    └── useMembers.ts
```

## Próximo Passo

→ [04-api-management.md](./04-api-management.md)
