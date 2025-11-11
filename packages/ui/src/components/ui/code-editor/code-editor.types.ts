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
  value?: string
  defaultValue?: string
  language?: CodeEditorLanguage
  defaultLanguage?: CodeEditorLanguage
  theme?: CodeEditorTheme
  height?: string | number
  width?: string | number
  readOnly?: boolean
  line?: number
  loading?: React.ReactNode
  options?: editor.IStandaloneEditorConstructionOptions
  onChange?: OnChange
  onMount?: OnMount
  beforeMount?: BeforeMount
  className?: string
}
