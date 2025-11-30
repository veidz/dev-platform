import { z } from 'zod'

import { Role } from '../types/workspace.types'

const slugSchema = z
  .string()
  .min(3, 'Slug deve ter no mínimo 3 caracteres')
  .max(50, 'Slug deve ter no máximo 50 caracteres')
  .regex(
    /^[a-z0-9-]+$/,
    'Slug deve conter apenas letras minúsculas, números e hífens',
  )

const createWorkspaceSchema = z.object({
  name: z
    .string()
    .min(3, 'Nome deve ter no mínimo 3 caracteres')
    .max(100, 'Nome deve ter no máximo 100 caracteres'),
  slug: slugSchema,
  description: z.string().max(500).optional(),
})

const updateWorkspaceSchema = z.object({
  name: z.string().min(3).max(100).optional(),
  description: z.string().max(500).optional(),
})

const inviteMemberSchema = z.object({
  email: z.string().email('Email inválido'),
  role: z.enum([Role.OWNER, Role.ADMIN, Role.DEVELOPER, Role.VIEWER], {
    message: 'Role inválido',
  }),
})

const updateMemberRoleSchema = z.object({
  role: z.enum([Role.OWNER, Role.ADMIN, Role.DEVELOPER, Role.VIEWER], {
    message: 'Role inválido',
  }),
})

type CreateWorkspaceInput = z.infer<typeof createWorkspaceSchema>
type UpdateWorkspaceInput = z.infer<typeof updateWorkspaceSchema>
type InviteMemberInput = z.infer<typeof inviteMemberSchema>
type UpdateMemberRoleInput = z.infer<typeof updateMemberRoleSchema>

export {
  createWorkspaceSchema,
  inviteMemberSchema,
  updateMemberRoleSchema,
  updateWorkspaceSchema,
}
export type {
  CreateWorkspaceInput,
  InviteMemberInput,
  UpdateMemberRoleInput,
  UpdateWorkspaceInput,
}
