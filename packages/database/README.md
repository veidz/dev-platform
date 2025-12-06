# @dev-platform/database

Pacote de banco de dados com Prisma ORM para a Dev Platform.

## 📦 Instalação

```bash
pnpm install
```

## 🔧 Setup

### Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
DATABASE_URL="postgresql://devplatform:devplatform@localhost:5432/devplatform"
```

### Gerar Prisma Client

```bash
pnpm db:generate
```

### Executar Migrations

```bash
# Desenvolvimento (cria migration + aplica)
pnpm db:migrate

# Produção (aplica migrations existentes)
pnpm db:migrate:deploy
```

### Seed do Banco

```bash
pnpm db:seed
```

## 🚀 Uso

```typescript
import { prisma } from '@dev-platform/database'

// Criar usuário
const user = await prisma.user.create({
  data: {
    email: 'user@example.com',
    name: 'João Silva',
    password: 'hashed-password',
  },
})

// Buscar workspace
const workspace = await prisma.workspace.findUnique({
  where: { slug: 'meu-workspace' },
  include: {
    members: true,
    apis: true,
  },
})
```

## 📋 Schema

### Models

- **User** - Contas de usuários
- **RefreshToken** - Tokens JWT de refresh
- **Workspace** - Workspaces multi-tenant
- **WorkspaceMember** - Membros do workspace com roles
- **Api** - Definições de APIs
- **Endpoint** - Endpoints de APIs
- **Mock** - Respostas mock
- **MockScenario** - Cenários de mock
- **RequestLog** - Logs de requisições (analytics)
- **AlertRule** - Regras de alertas
- **Alert** - Alertas disparados

### Enums

- **Role** - OWNER, ADMIN, DEVELOPER, VIEWER
- **ApiStatus** - ACTIVE, INACTIVE, DEPRECATED
- **HttpMethod** - GET, POST, PUT, PATCH, DELETE, HEAD, OPTIONS
- **MockDelayType** - FIXED, RANGE, NONE
- **AlertSeverity** - INFO, WARNING, ERROR, CRITICAL
- **AlertRuleType** - THRESHOLD, ANOMALY, ERROR_RATE

## 📝 Scripts

| Script             | Descrição                           |
| ------------------ | ----------------------------------- |
| `pnpm build`       | Build do pacote + gerar tipos       |
| `pnpm db:generate` | Gerar Prisma client                 |
| `pnpm db:push`     | Push schema para DB (sem migration) |
| `pnpm db:migrate`  | Criar e executar migrations         |
| `pnpm db:studio`   | Abrir Prisma Studio                 |
| `pnpm db:seed`     | Popular banco com dados iniciais    |
| `pnpm db:reset`    | Resetar banco de dados              |
| `pnpm test`        | Executar testes                     |
| `pnpm test:cov`    | Executar testes com coverage        |

## 🛠️ Desenvolvimento

```bash
# Iniciar containers Docker (PostgreSQL)
pnpm docker:up

# Gerar Prisma client
pnpm db:generate

# Aplicar migrations
pnpm db:migrate

# Abrir Prisma Studio
pnpm db:studio
```
