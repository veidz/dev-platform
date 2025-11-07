# Workspace CRUD

## Contexto

CRUD completo de workspaces com RBAC e multi-tenancy.

## Dependências

- 01-setup.md completo

## Checkboxes

### Pesquisa

- [ ] Prisma relations (https://www.prisma.io/docs/concepts/components/prisma-schema/relations)
- [ ] Row-Level Security patterns

### Module Structure

- [ ] Criar `src/workspace/workspace.module.ts`
- [ ] Criar `src/workspace/workspace.service.ts`
- [ ] Criar `src/workspace/workspace.controller.ts`
- [ ] Criar `src/workspace/workspace.types.ts`

### DTOs

- [ ] Criar `src/workspace/dto/create-workspace.dto.ts`
- [ ] Criar `src/workspace/dto/update-workspace.dto.ts`
- [ ] Criar `src/workspace/dto/invite-member.dto.ts`
- [ ] Validar com class-validator ou Zod

### Workspace Service - CRUD

- [ ] Method `findAll(userId)` - lista workspaces do user
- [ ] Method `findOne(id, userId)` - verifica ownership
- [ ] Method `create(dto, userId)` - cria + adiciona user como Owner
- [ ] Method `update(id, dto, userId)` - verifica permission
- [ ] Method `remove(id, userId)` - verifica Owner role

### Members Management

- [ ] Method `inviteMember(workspaceId, email, role)` - envia convite
- [ ] Method `removeMember(workspaceId, userId)` - remove member
- [ ] Method `updateMemberRole(workspaceId, userId, newRole)`
- [ ] Method `getMembers(workspaceId)` - lista membros

### Role Enum

- [ ] OWNER (full access, can delete workspace)
- [ ] ADMIN (manage members, manage APIs)
- [ ] DEV (create/edit APIs, limited delete)
- [ ] VIEWER (read-only)

### RBAC Guards

- [ ] Criar `src/workspace/guards/workspace-access.guard.ts`
- [ ] Check if user is member of workspace
- [ ] Check if user has required role

### Row-Level Security

- [ ] Prisma middleware para filtrar por workspace
- [ ] User só vê seus workspaces
- [ ] Joins automáticos com WorkspaceMember

### Controller - Endpoints

- [ ] GET /workspaces (lista do user)
- [ ] GET /workspaces/:id
- [ ] POST /workspaces
- [ ] PATCH /workspaces/:id
- [ ] DELETE /workspaces/:id
- [ ] GET /workspaces/:id/members
- [ ] POST /workspaces/:id/members (invite)
- [ ] DELETE /workspaces/:id/members/:userId
- [ ] PATCH /workspaces/:id/members/:userId/role

### Validation Rules

- [ ] Name: required, min 2 chars, max 50
- [ ] Email invite: valid email format
- [ ] Role: must be valid enum value
- [ ] Owner não pode sair do workspace
- [ ] Owner não pode ter role alterado

### Error Handling

- [ ] NotFoundException se workspace não existe
- [ ] ForbiddenException se user não tem acesso
- [ ] ConflictException se member já existe
- [ ] BadRequestException para validações

### Invite System (Básico)

- [ ] Criar `src/workspace/invite.service.ts`
- [ ] Gerar token de convite (JWT ou UUID)
- [ ] Armazenar em tabela Invite (pending)
- [ ] Endpoint para aceitar convite
- [ ] Expiração de 7 dias

### Activity Log

- [ ] Log creation de workspace
- [ ] Log member invite/remove
- [ ] Log role changes
- [ ] Tabela opcional WorkspaceActivity

### Cache Strategy

- [ ] Cache lista de workspaces (Redis)
- [ ] Key: `user:${userId}:workspaces`
- [ ] TTL: 5 minutos
- [ ] Invalidar on create/update/delete

### Testes Unitários

- [ ] `tests/unit/management-service/workspace/workspace.service.test.ts`
- [ ] Test findAll retorna só workspaces do user
- [ ] Test create adiciona user como Owner
- [ ] Test update verifica permissions
- [ ] Test delete verifica Owner role
- [ ] Mock Prisma

### Testes Integração

- [ ] `tests/integration/management-service/workspace/workspace.controller.test.ts`
- [ ] GET /workspaces (200, lista correta)
- [ ] POST /workspaces (201, workspace criado)
- [ ] PATCH /workspaces/:id (200, atualizado)
- [ ] DELETE /workspaces/:id (200, deletado)
- [ ] DELETE sem ser owner (403)
- [ ] Invite member (201)
- [ ] Remove member (200)

### Testes RBAC

- [ ] Viewer não pode editar workspace
- [ ] Dev não pode deletar workspace
- [ ] Admin pode convidar membros
- [ ] Owner pode fazer tudo

### Documentação

- [ ] Swagger decorators em endpoints
- [ ] Exemplos de requests/responses
- [ ] Explicar sistema de roles

### Validação

- [ ] CRUD completo funciona
- [ ] RLS funciona (user A não vê workspace de user B)
- [ ] Invite system funciona
- [ ] `pnpm test` (100% coverage)

## Arquivos Criados

```
src/workspace/
├── workspace.module.ts
├── workspace.service.ts
├── workspace.controller.ts
├── workspace.types.ts
├── invite.service.ts
├── dto/
│   ├── create-workspace.dto.ts
│   ├── update-workspace.dto.ts
│   └── invite-member.dto.ts
└── guards/
    └── workspace-access.guard.ts

tests/
├── unit/management-service/workspace/
│   └── workspace.service.test.ts
└── integration/management-service/workspace/
    └── workspace.controller.test.ts
```

## Exemplo: workspace.service.ts

```typescript
import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from "@nestjs/common"
import { PrismaService } from "@/shared/prisma.service"
import type { CreateWorkspaceDto } from "./dto/create-workspace.dto"

@Injectable()
export class WorkspaceService {
  constructor(private prisma: PrismaService) {}

  async findAll(userId: string) {
    return this.prisma.workspace.findMany({
      where: {
        members: {
          some: { userId },
        },
      },
      include: {
        members: {
          select: {
            role: true,
            user: {
              select: { id: true, name: true, email: true },
            },
          },
        },
      },
    })
  }

  async create(dto: CreateWorkspaceDto, userId: string) {
    return this.prisma.workspace.create({
      data: {
        name: dto.name,
        members: {
          create: {
            userId,
            role: "OWNER",
          },
        },
      },
    })
  }

  async remove(id: string, userId: string) {
    // Verifica se user é owner
    const member = await this.prisma.workspaceMember.findUnique({
      where: {
        workspaceId_userId: { workspaceId: id, userId },
      },
    })

    if (!member || member.role !== "OWNER") {
      throw new ForbiddenException("Only owners can delete workspace")
    }

    return this.prisma.workspace.delete({ where: { id } })
  }
}
```

## Exemplo: Prisma Schema

```prisma
model Workspace {
  id        String   @id @default(cuid())
  name      String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  members   WorkspaceMember[]
  apis      API[]
}

model WorkspaceMember {
  id          String   @id @default(cuid())
  workspaceId String
  userId      String
  role        Role     @default(DEV)
  createdAt   DateTime @default(now())

  workspace   Workspace @relation(fields: [workspaceId], references: [id], onDelete: Cascade)
  user        User      @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([workspaceId, userId])
  @@index([userId])
}

enum Role {
  OWNER
  ADMIN
  DEV
  VIEWER
}
```

## Recursos

- [Prisma Relations](https://www.prisma.io/docs/concepts/components/prisma-schema/relations)
- [NestJS Guards](https://docs.nestjs.com/guards)
- [RBAC Pattern](https://en.wikipedia.org/wiki/Role-based_access_control)

## Próximo Passo

→ [03-api-crud.md](./03-api-crud.md)
