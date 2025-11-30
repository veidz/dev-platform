import type { Workspace } from '@dev-platform/types'

interface ListWorkspacesResponse {
  workspaces: Workspace[]
  total: number
}

export { type ListWorkspacesResponse }
