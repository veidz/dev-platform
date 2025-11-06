# API Management - CRUD e Editor

## Contexto

Páginas para gerenciar APIs, endpoints e documentação com editor Monaco.

## Dependências

- 03-workspace.md completo

## Checkboxes

### Estrutura

- [ ] `src/app/(dashboard)/apis/page.tsx`
- [ ] `src/app/(dashboard)/apis/[id]/page.tsx`
- [ ] `src/app/(dashboard)/apis/[id]/endpoints/page.tsx`
- [ ] `src/app/(dashboard)/apis/[id]/editor/page.tsx`

### Components

- [ ] `src/components/apis/ApiCard.tsx`
- [ ] `src/components/apis/ApiForm.tsx`
- [ ] `src/components/apis/EndpointList.tsx`
- [ ] `src/components/apis/EndpointForm.tsx`
- [ ] `src/components/apis/DocsEditor.tsx` (Monaco)

### Monaco Setup

- [ ] Instalar `@monaco-editor/react@latest`
- [ ] Wrapper component com syntax highlighting
- [ ] JSON/YAML schemas
- [ ] Autocomplete

### Hooks

- [ ] `src/hooks/useApis.ts`
- [ ] `src/hooks/useEndpoints.ts`
- [ ] `src/hooks/useOpenApiImport.ts`

### Import OpenAPI

- [ ] Dialog para upload
- [ ] Parser OpenAPI spec
- [ ] Preview antes de importar

### Testes

- [ ] `tests/unit/web/apis/ApiForm.test.tsx`
- [ ] `tests/unit/web/apis/DocsEditor.test.tsx`

### Validação

- [ ] CRUD APIs funciona
- [ ] CRUD Endpoints funciona
- [ ] Editor Monaco funciona
- [ ] Import OpenAPI funciona
- [ ] `pnpm test` (100%)

## Próximo Passo

→ [05-playground.md](./05-playground.md)
