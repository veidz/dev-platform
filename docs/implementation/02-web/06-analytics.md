# Analytics Dashboard

## Contexto

Dashboard de métricas com gráficos em tempo real.

## Dependências

- 05-playground.md completo

## Checkboxes

### Estrutura

- [ ] `src/app/(dashboard)/analytics/page.tsx`

### Dependencies

- [ ] Instalar `recharts@latest`
- [ ] Instalar `date-fns@latest`

### Components

- [ ] `src/components/analytics/MetricsCards.tsx`
- [ ] `src/components/analytics/RequestsChart.tsx`
- [ ] `src/components/analytics/LatencyChart.tsx`
- [ ] `src/components/analytics/StatusCodesChart.tsx`
- [ ] `src/components/analytics/TopEndpointsTable.tsx`
- [ ] `src/components/analytics/DateRangePicker.tsx`

### Real-time Updates

- [ ] Socket.io connection
- [ ] Live metrics updates
- [ ] Auto-refresh toggle

### Filters

- [ ] Date range selector
- [ ] API filter
- [ ] Status code filter

### Hooks

- [ ] `src/hooks/useMetrics.ts`
- [ ] `src/hooks/useRealtimeMetrics.ts`

### Testes

- [ ] `tests/unit/web/analytics/RequestsChart.test.tsx`
- [ ] `tests/unit/web/analytics/MetricsCards.test.tsx`

### Validação

- [ ] Charts renderizam
- [ ] Real-time updates funcionam
- [ ] Filters funcionam
- [ ] `pnpm test` (100%)

## Próximo Passo

→ [07-e2e-tests.md](./07-e2e-tests.md)
