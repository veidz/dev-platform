# Playground - Request Builder

## Contexto

Interface para testar endpoints com collections e environments.

## Dependências

- 04-api-management.md completo

## Checkboxes

### Estrutura

- [ ] `src/app/(dashboard)/playground/page.tsx`
- [ ] `src/app/(dashboard)/playground/[collectionId]/page.tsx`

### Components

- [ ] `src/components/playground/RequestBuilder.tsx`
- [ ] `src/components/playground/ResponseViewer.tsx`
- [ ] `src/components/playground/CollectionSidebar.tsx`
- [ ] `src/components/playground/EnvironmentSelector.tsx`

### Request Builder

- [ ] Method selector (GET, POST, etc)
- [ ] URL input com autocomplete
- [ ] Headers editor (key-value pairs)
- [ ] Query params editor
- [ ] Body editor (JSON, form-data)
- [ ] Auth config

### Response Viewer

- [ ] Status code display
- [ ] Headers display
- [ ] Body viewer com syntax highlighting
- [ ] Copy response button
- [ ] Save to collection button

### Collections

- [ ] Create/edit/delete collections
- [ ] Organize requests em folders
- [ ] Drag and drop

### Environments

- [ ] Variables management
- [ ] Switch entre dev/staging/prod
- [ ] Variable interpolation {{var}}

### Hooks

- [ ] `src/hooks/useSendRequest.ts`
- [ ] `src/hooks/useCollections.ts`
- [ ] `src/hooks/useEnvironments.ts`

### Testes

- [ ] `tests/unit/web/playground/RequestBuilder.test.tsx`
- [ ] `tests/unit/web/playground/ResponseViewer.test.tsx`

### Validação

- [ ] Enviar request funciona
- [ ] Collections funcionam
- [ ] Environments funcionam
- [ ] `pnpm test` (100%)

## Próximo Passo

→ [06-analytics.md](./06-analytics.md)
