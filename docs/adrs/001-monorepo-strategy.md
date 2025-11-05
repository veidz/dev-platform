# ADR-001: Estratégia de Monorepo com Turborepo

## Contexto

O **Dev Platform** requer desenvolvimento coordenado entre múltiplas aplicações (frontend web, API gateway, microsserviços) e pacotes compartilhados (componentes UI, tipos TypeScript, schemas de validação, SDK). Gerenciar em repositórios separados cria atrito em atualizações de dependências, complica refatorações cross-package e requer orquestração complexa de CI/CD.

Critérios de avaliação para ferramentas de monorepo:

- Performance de build e eficiência de cache
- Experiência do desenvolvedor e complexidade de onboarding
- Integração com Next.js 16 e ecossistema Vercel
- Suporte para stack tecnológico heterogêneo (Next.js, NestJS, Storybook)
- Capacidades de cache remoto para CI/CD

## Decisão

Adotar **Turborepo** como ferramenta de orquestração de monorepo.

### Justificativa Técnica

**Performance de Build:**
Turborepo utiliza builds incrementais com cache em nível de tarefa. Dados de benchmark demonstram builds de produção 2-5x mais rápidos comparado a builds sem cache, com até 10x de melhoria no Fast Refresh durante desenvolvimento. A ferramenta usa hashing baseado em conteúdo para determinar validade do cache, evitando recompilações desnecessárias.

**Arquitetura de Cache:**

- Cache local armazena outputs de tarefas no diretório `.turbo`
- Cache remoto via Vercel (free tier para times pequenos, zero configuração)
- Invalidação automática de cache baseada em análise do grafo de dependências
- Execução paralela de tarefas com escalonamento inteligente

**Vantagens de Integração:**

- Integração nativa com Vercel para deploys frontend
- Setup zero-config para projetos Next.js 16
- Compatível com `next dev --turbopack` com cache de sistema de arquivos
- Compatível com workspaces pnpm para gerenciamento de dependências

**Experiência do Desenvolvedor:**

- Superfície mínima de configuração (turbo.json)
- Definição intuitiva de pipeline de tarefas
- Output claro no terminal com métricas de duração de tarefas
- Preservação de hot reload entre pacotes

### Alternativa Considerada: Nx

Nx oferece recursos avançados (execução distribuída de tarefas, ecossistema de plugins, geração de código) mas introduz overhead cognitivo maior. Nx se destaca em cenários enterprise com 100+ pacotes e múltiplas linguagens de programação, o que excede requisitos atuais do projeto. Comparação de benchmark (repositório large-monorepo no GitHub) mostra Nx 7x mais rápido que Turborepo em casos extremos, mas essa vantagem se materializa apenas em escala (20k+ componentes).

Análise de trade-offs:

- Turborepo: Modelo mental mais simples, onboarding mais rápido, alinhamento com ecossistema Vercel
- Nx: Mais poderoso mas requer configuração de plugins, curva de aprendizado mais íngreme

Para plataforma com 4-6 microsserviços e ~10 pacotes compartilhados, simplicidade do Turborepo oferece melhor ROI.

## Consequências

### Positivas

**Eficiência de Build:**

- Duração de pipeline CI reduzida em ~60% através de cache remoto
- Iterações de desenvolvimento local se beneficiam de cache persistente entre sessões
- Execução paralela de tarefas independentes (lint, test, build)

**Qualidade de Código:**

- Configurações compartilhadas de ESLint/TypeScript aplicadas em todos pacotes
- Commits atômicos garantem que mudanças cross-package sejam testadas juntas
- Gerenciamento simplificado de versões de dependências (package.json único para devDependencies)

**Velocidade de Deploy:**

- Vercel otimiza automaticamente deploys apenas para apps alterados
- Cache remoto elimina trabalho redundante em ambiente CI
- Preview deployments para todos apps em single pull request

### Negativas

**Considerações de Escala:**

- Se projeto crescer além de 50 pacotes, migração para Nx pode ser necessária
- Sem suporte nativo para execução distribuída de tarefas entre múltiplas máquinas
- Capacidades limitadas de geração de código comparado ao Nx

**Restrições de Ferramentas:**

- Deve usar workspaces pnpm ou yarn (workspaces npm têm limitações)
- Task runners customizados requerem integração manual
- Cache remoto requer conta Vercel ou solução self-hosted

### Estratégias de Mitigação

**Caminho de Migração Futura:**
Turborepo e Nx usam estruturas de workspace compatíveis. Risco de migração é baixo se necessário.

**Monitoramento de Performance:**
Implementar tracking de duração de tarefas para identificar degradação conforme codebase cresce. Disparar avaliação do Nx se tempos de build excederem limites aceitáveis.

**Documentação:**
Manter comentários abrangentes no turbo.json explicando dependências de tarefas e estratégias de cache.

## Referências

- [Documentação Turborepo](https://turbo.build/repo/docs)
- [Performance Turbopack Next.js 16](https://nextjs.org/blog/next-16)
- [Benchmark: Nx vs Turborepo](https://github.com/vsavkin/large-monorepo)
- [Vercel Remote Caching](https://vercel.com/docs/monorepos/remote-caching)
- [Turborepo Task Pipeline](https://turbo.build/repo/docs/core-concepts/monorepos/running-tasks)
- [pnpm Workspaces](https://pnpm.io/workspaces)
