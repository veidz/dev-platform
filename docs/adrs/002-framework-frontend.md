# ADR-002: Seleção de Framework Frontend

## Contexto

Frontend do **Dev Platform** requer server-side rendering, geração estática, otimização edge e capacidades real-time. Deve suportar integração Monaco Editor, visualizações complexas de dados e conexões WebSocket, mantendo Time to Interactive abaixo de 200ms.

Requisitos:

- Desenvolvimento type-safe end-to-end
- Bundle splitting e code streaming otimizados
- Assets estáticos otimizados para CDN
- Features de colaboração real-time
- Páginas de documentação SEO-friendly

## Decisão

Adotar **Next.js 16** com App Router e React 19.

### Justificativa Técnica

**Melhorias de Performance:**
Next.js 16 introduz mudanças arquiteturais que entregam ganhos mensuráveis de performance:

- Turbopack como bundler padrão: builds de produção 2-5x mais rápidos, Fast Refresh 10x mais rápido
- Layout deduplication: layouts compartilhados baixados uma vez entre múltiplas páginas (reduz transferência de rede em ~40% em páginas com muitos links)
- Incremental prefetching: Apenas faz prefetch de conteúdo não cacheado, reduzindo requests redundantes
- Suporte nativo a TypeScript para `next.config.ts` com `--experimental-next-config-strip-types`

**Integração React 19.2:**

- View Transitions API para animações suaves de página sem frameworks JavaScript
- `useEffectEvent()` para extrair lógica não-reativa de Effects
- Componente `<Activity>` para rendering em background com preservação de estado
- React Compiler (estável, opt-in) para memoização automática de componentes

**Cache Components (anteriormente PPR):**
Nova diretiva `"use cache"` habilita caching explícito em nível de componente/função:

```typescript
"use cache"
async function fetchUserData(id: string) {
  // Cacheado automaticamente com chaves geradas pelo compilador
}
```

Elimina confusão de caching implícito de versões anteriores do App Router. Desenvolvedores explicitamente optam por comportamento de cache.

**Experiência Aprimorada do Desenvolvedor:**

- Logging de requests melhorado separa fase Compile (Turbopack) de fase Render (React)
- Métricas de build mostram timing preciso para type checking TypeScript, geração de páginas, otimização
- Melhores overlays de erro com source maps e stack traces
- Suporte nativo para `params` async em páginas

**Alinhamento com Ecossistema Vercel:**

- Deploy zero-config para Vercel Edge Network
- Injeção automática de variáveis de ambiente
- Preview deployments por branch git
- Tracking integrado de Web Vitals

### Alternativas Consideradas

**Vite + React:**
Performance superior em cold start mas requer configuração manual de SSR. Falta convenções do Next.js para routing, data fetching e middleware. Ecossistema de build tooling ainda amadurecendo comparado ao Next.js.

**Remix:**
Primitivas server-side fortes mas ecossistema menor. Falta suporte nativo para geração estática. Adquirido pela Shopify com roadmap independente incerto.

**Astro:**
Excelente para sites content-heavy com arquitetura islands. Insuficiente para gerenciamento complexo de estado de aplicação e features real-time.

## Consequências

### Positivas

**Performance de Build:**

- Servidor de desenvolvimento inicia em <1s com Turbopack
- Updates HMR em <50ms (melhoria de 10x sobre Webpack)
- Builds de produção completam 2-3x mais rápido com otimização paralela

**Performance de Runtime:**

- First Contentful Paint <1s em conexão 3G
- Time to Interactive <1.5s com code splitting adequado
- Layout shifts minimizados através de streaming SSR

**Produtividade do Desenvolvedor:**

- Routing type-safe com convenção do diretório `app/`
- Routing baseado em arquivos elimina configuração de router
- Server Components reduzem bundle do cliente em 30-40%
- Codemods disponíveis para migração automatizada

**Otimização SEO:**

- Metadata server-rendered para todas páginas
- Geração automática de sitemap
- Tags OpenGraph sem client-side rendering

### Negativas

**Curva de Aprendizado:**

- Modelo mental do App Router difere do Pages Router
- Boundary Server/Client Component requer entendimento
- Comportamento de caching precisa gerenciamento explícito com Cache Components

**Tamanho de Bundle:**

- Bundle base React 19: ~45KB (gzipped)
- Runtime Next.js adiciona ~80KB (overhead de framework)
- Aceitável para complexidade da aplicação, problemático para sites estáticos

**Breaking Changes:**

- `middleware.ts` renomeado para `proxy.ts`
- `params` async agora obrigatório (era síncrono)
- Mudanças no comportamento padrão do `next/image`
- Requisito mínimo Node.js 20.9+

### Estratégias de Mitigação

**Budget de Performance:**
Monitorar Core Web Vitals com Vercel Analytics. Definir thresholds:

- LCP <2.5s
- FID <100ms
- CLS <0.1

**Caminho de Migração:**
Usar CLI codemod do Next.js para upgrades automatizados:

```bash
npx @next/codemod@latest upgrade latest
```

**Documentação:**
Manter architecture decision records para padrões do App Router e estratégias de caching.

## Referências

- [Lançamento Next.js 16](https://nextjs.org/blog/next-16)
- [Estabilidade Turbopack](https://turbo.build/pack/docs)
- [Anúncio React 19.2](https://react.dev/blog/2024/12/05/react-19)
- [Documentação Cache Components](https://nextjs.org/docs/app/api-reference/directives/use-cache)
- [Benchmarks Performance Next.js](https://nextjs.org/docs/app/building-your-application/optimizing)
- [Vercel Edge Network](https://vercel.com/docs/edge-network/overview)
