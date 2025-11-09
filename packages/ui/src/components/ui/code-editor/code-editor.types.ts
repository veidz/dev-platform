import type { BeforeMount, OnChange, OnMount } from '@monaco-editor/react'
import type { editor } from 'monaco-editor'

export type CodeEditorLanguage =
  | 'javascript'
  | 'typescript'
  | 'json'
  | 'html'
  | 'css'
  | 'python'
  | 'markdown'
  | 'yaml'
  | 'xml'
  | 'sql'

export type CodeEditorTheme = 'vs-dark' | 'light' | 'vs'

export interface CodeEditorProps {
  /** The value of the editor (controlled) */
  value?: string
  /** Default value of the editor (uncontrolled) */
  defaultValue?: string
  /** Programming language */
  language?: CodeEditorLanguage
  /** Default language */
  defaultLanguage?: CodeEditorLanguage
  /** Editor theme */
  theme?: CodeEditorTheme
  /** Height of the editor */
  height?: string | number
  /** Width of the editor */
  width?: string | number
  /** Whether the editor is read-only */
  readOnly?: boolean
  /** Line number to jump to */
  line?: number
  /** Loading component */
  loading?: React.ReactNode
  /** Editor options */
  options?: editor.IStandaloneEditorConstructionOptions
  /** Callback when editor content changes */
  onChange?: OnChange
  /** Callback when editor is mounted */
  onMount?: OnMount
  /** Callback before editor is mounted */
  beforeMount?: BeforeMount
  /** Additional class name */
  className?: string
}
