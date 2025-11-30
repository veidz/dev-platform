# ADR-005: Seleção de Banco de Dados e ORM

## Contexto

Plataforma requer dados relacionais (usuários, APIs, endpoints) com garantias ACID, suporte JSON para schemas flexíveis (specs OpenAPI, configurações de mock) e connection pooling para microsserviços. Deve suportar: joins complexos, full-text search, row-level security (multi-tenancy) e gerenciamento de migrations.

## Decisão

**PostgreSQL 16** (Neon serverless) com **Prisma ORM**.

### Justificativa Técnica

**Vantagens PostgreSQL:**

- Tipo JSONB para armazenamento de schema flexível com indexação
- Row-Level Security (RLS) para isolamento multi-tenant
- Indexação avançada (B-tree, GiST, GIN) para performance
- Full-text search sem dependências externas
- Ecossistema maduro e ampla experiência de deployment

**Benefícios Neon Serverless:**

- Scaling automático (0-compute quando idle)
- Branch databases por git branch (preview environments)
- Connection pooling built-in (PgBouncer)
- Free tier generoso: 0.5GB storage, 191 compute hours/mês
- Cold starts sub-segundo

**Prisma ORM:**

- Cliente de database type-safe gerado do schema
- Migrations declarativas via `prisma migrate`
- Introspection para databases existentes
- Análise de otimização de queries
- Middleware hooks para logging, soft deletes, RLS

```prisma
model Workspace {
  id        String   @id @default(cuid())
  name      String
  members   Member[]
  apis      API[]
  createdAt DateTime @default(now())

  @@index([createdAt])
}
```

**Performance:**

- Connection pooling reduz latência (<5ms tempo de conexão)
- Prepared statements previnem SQL injection
- Eager loading previne queries N+1
- Query batching reduz roundtrips

### Alternativas Consideradas

**TimescaleDB:** Excelente para time-series (logs analytics) mas desnecessário para dados relacionais. Considerar para Analytics Service separadamente.

**MongoDB:** Flexibilidade de schema atraente mas falta performance de joins, transações entre collections mais fracas e modelagem de dados relacionais pesada.

**TypeORM:** Feature-rich mas padrão active record encoraja fat models. Data mapper pattern verboso. Cliente gerado do Prisma mais limpo.

**Drizzle ORM:** Lightweight, API SQL-like mas ecossistema menor. Migrations menos maduras que Prisma.

## Consequências

### Positivas

**Type Safety:** Types do Prisma Client derivados do schema. Validação runtime automática.

**Experiência do Desenvolvedor:** `prisma studio` fornece GUI de DB. Abordagem schema-first auto-documenta.

**Multi-Tenancy:** Políticas RLS forçam isolamento de dados sem lógica de aplicação.

**Gerenciamento de Migrations:** Migrations declarativas rastreiam mudanças de schema. Rollback suportado.

### Negativas

**Vendor Lock-in:** Schema Prisma proprietário (não SQL). Migração para queries SQL raw requer reescrita.

**Tamanho de Bundle:** Prisma Client 2-3MB. Aceitável para backend, problemático para edge.

**Queries Complexas:** Fallback para SQL raw necessário para analytics avançado. Prisma menos expressivo que Knex/Kysely.

### Mitigação

**Monitoramento de Performance:** Habilitar query logging Prisma. Monitorar queries lentas (>100ms). Adicionar indexes proativamente.

**Limites de Conexão:** Free tier Neon: 100 conexões concorrentes. Monitorar uso, implementar queueing se excedido.

**Estratégia de Backup:** Neon fornece backups automatizados. Implementar jobs de export adicionais para compliance.

## Referências

- [Documentação Prisma](https://www.prisma.io/docs)
- [Performance JSONB PostgreSQL](https://www.postgresql.org/docs/current/datatype-json.html)
- [Neon Serverless](https://neon.tech/docs)
- [Row-Level Security](https://www.postgresql.org/docs/current/ddl-rowsecurity.html)
- [Best Practices Prisma](https://www.prisma.io/docs/orm/prisma-client/queries/query-optimization-performance)
