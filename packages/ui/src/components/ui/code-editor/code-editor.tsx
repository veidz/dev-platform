import Editor from '@monaco-editor/react'
import { forwardRef, useMemo } from 'react'

import { cn } from '@/lib/utils'

import type { CodeEditorProps } from './code-editor.types'

export const CodeEditor = forwardRef<HTMLDivElement, CodeEditorProps>(
  (
    {
      value,
      defaultValue = '// Start coding...',
      language = 'javascript',
      defaultLanguage,
      theme = 'vs-dark',
      height = '400px',
      width = '100%',
      readOnly = false,
      line,
      loading = 'Loading editor...',
      options = {},
      onChange,
      onMount,
      beforeMount,
      className,
    },
    ref,
  ) => {
    const editorOptions = useMemo(
      () => ({
        readOnly,
        minimap: { enabled: false },
        fontSize: 14,
        lineNumbers: 'on' as const,
        scrollBeyondLastLine: false,
        automaticLayout: true,
        tabSize: 2,
        ...options,
      }),
      [readOnly, options],
    )

    return (
      <div
        ref={ref}
        className={cn(
          'overflow-hidden rounded-md border border-border',
          className,
        )}
      >
        <Editor
          height={height}
          width={width}
          defaultLanguage={defaultLanguage || language}
          defaultValue={defaultValue}
          value={value}
          language={language}
          theme={theme}
          line={line}
          loading={loading}
          options={editorOptions}
          onChange={onChange}
          onMount={onMount}
          beforeMount={beforeMount}
        />
      </div>
    )
  },
)

CodeEditor.displayName = 'CodeEditor'
