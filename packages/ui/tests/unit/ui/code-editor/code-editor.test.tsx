import * as React from 'react'

import { render, screen, waitFor } from '@testing-library/react'

import { CodeEditor } from '@/components/ui/code-editor'

jest.mock('@monaco-editor/react', () => {
  return {
    __esModule: true,
    default: ({
      height,
      width,
      language,
      defaultLanguage,
      value,
      defaultValue,
      theme,
      options,
      onMount,
      beforeMount,
    }: any) => {
      React.useEffect(() => {
        if (beforeMount) {
          beforeMount()
        }
        if (onMount) {
          const mockEditor = {
            getValue: () => value || defaultValue || '',
            getModel: () => ({
              getLanguageId: () => language || defaultLanguage,
            }),
          }
          onMount(mockEditor, {})
        }
      }, [beforeMount, onMount, value, defaultValue, language, defaultLanguage])

      const displayLanguage = defaultLanguage || language

      return (
        <div
          data-testid="monaco-editor"
          data-height={height}
          data-width={width}
          data-language={displayLanguage}
          data-theme={theme}
          data-readonly={options?.readOnly}
          data-fontsize={options?.fontSize}
          data-minimap-enabled={options?.minimap?.enabled}
          data-line-numbers={options?.lineNumbers}
          data-scroll-beyond-last-line={options?.scrollBeyondLastLine}
          data-automatic-layout={options?.automaticLayout}
          data-tab-size={options?.tabSize}
          style={{ height, width }}
        >
          {value || defaultValue}
        </div>
      )
    },
  }
})

describe('CodeEditor Component', () => {
  describe('Basic Rendering', () => {
    it('should render code editor with default props', () => {
      render(<CodeEditor />)

      const editor = screen.getByTestId('monaco-editor')
      expect(editor).toBeInTheDocument()
    })

    it('should render with custom default value', () => {
      const customValue = 'console.log("Hello World")'

      render(<CodeEditor defaultValue={customValue} />)

      const editor = screen.getByTestId('monaco-editor')
      expect(editor).toHaveTextContent(customValue)
    })

    it('should render with controlled value', () => {
      const value = 'const x = 42'

      render(<CodeEditor value={value} />)

      const editor = screen.getByTestId('monaco-editor')
      expect(editor).toHaveTextContent(value)
    })

    it('should render with custom loading text', () => {
      render(<CodeEditor loading="Please wait..." />)

      expect(screen.getByTestId('monaco-editor')).toBeInTheDocument()
    })
  })

  describe('Language Support', () => {
    it('should render with default javascript language', () => {
      render(<CodeEditor />)

      const editor = screen.getByTestId('monaco-editor')
      expect(editor).toHaveAttribute('data-language', 'javascript')
    })

    it('should render with custom language', () => {
      render(<CodeEditor language="typescript" />)

      const editor = screen.getByTestId('monaco-editor')
      expect(editor).toHaveAttribute('data-language', 'typescript')
    })

    it('should render with python language', () => {
      render(<CodeEditor language="python" />)

      const editor = screen.getByTestId('monaco-editor')
      expect(editor).toHaveAttribute('data-language', 'python')
    })

    it('should render with json language', () => {
      render(<CodeEditor language="json" />)

      const editor = screen.getByTestId('monaco-editor')
      expect(editor).toHaveAttribute('data-language', 'json')
    })

    it('should prioritize defaultLanguage over language', () => {
      render(<CodeEditor language="javascript" defaultLanguage="typescript" />)

      const editor = screen.getByTestId('monaco-editor')
      expect(editor).toHaveAttribute('data-language', 'typescript')
    })
  })

  describe('Theme Support', () => {
    it('should render with default vs-dark theme', () => {
      render(<CodeEditor />)

      const editor = screen.getByTestId('monaco-editor')
      expect(editor).toHaveAttribute('data-theme', 'vs-dark')
    })

    it('should render with light theme', () => {
      render(<CodeEditor theme="light" />)

      const editor = screen.getByTestId('monaco-editor')
      expect(editor).toHaveAttribute('data-theme', 'light')
    })

    it('should render with vs theme', () => {
      render(<CodeEditor theme="vs" />)

      const editor = screen.getByTestId('monaco-editor')
      expect(editor).toHaveAttribute('data-theme', 'vs')
    })
  })

  describe('Dimensions', () => {
    it('should render with default height', () => {
      render(<CodeEditor />)

      const editor = screen.getByTestId('monaco-editor')
      expect(editor).toHaveAttribute('data-height', '400px')
      expect(editor).toHaveStyle({ height: '400px' })
    })

    it('should render with custom height as string', () => {
      render(<CodeEditor height="600px" />)

      const editor = screen.getByTestId('monaco-editor')
      expect(editor).toHaveAttribute('data-height', '600px')
      expect(editor).toHaveStyle({ height: '600px' })
    })

    it('should render with custom height as number', () => {
      render(<CodeEditor height={500} />)

      const editor = screen.getByTestId('monaco-editor')
      expect(editor).toHaveAttribute('data-height', '500')
    })

    it('should render with default width', () => {
      render(<CodeEditor />)

      const editor = screen.getByTestId('monaco-editor')
      expect(editor).toHaveAttribute('data-width', '100%')
      expect(editor).toHaveStyle({ width: '100%' })
    })

    it('should render with custom width', () => {
      render(<CodeEditor width="500px" />)

      const editor = screen.getByTestId('monaco-editor')
      expect(editor).toHaveAttribute('data-width', '500px')
      expect(editor).toHaveStyle({ width: '500px' })
    })
  })

  describe('Editor Options', () => {
    it('should apply default editor options', () => {
      render(<CodeEditor />)

      const editor = screen.getByTestId('monaco-editor')
      expect(editor).toHaveAttribute('data-readonly', 'false')
      expect(editor).toHaveAttribute('data-minimap-enabled', 'false')
      expect(editor).toHaveAttribute('data-fontsize', '14')
      expect(editor).toHaveAttribute('data-line-numbers', 'on')
      expect(editor).toHaveAttribute('data-scroll-beyond-last-line', 'false')
      expect(editor).toHaveAttribute('data-automatic-layout', 'true')
      expect(editor).toHaveAttribute('data-tab-size', '2')
    })

    it('should apply readOnly option', () => {
      render(<CodeEditor readOnly />)

      const editor = screen.getByTestId('monaco-editor')
      expect(editor).toHaveAttribute('data-readonly', 'true')
    })

    it('should merge custom options with defaults', () => {
      render(
        <CodeEditor
          options={{
            fontSize: 16,
            tabSize: 4,
            lineNumbers: 'off',
          }}
        />,
      )

      const editor = screen.getByTestId('monaco-editor')
      expect(editor).toHaveAttribute('data-fontsize', '16')
      expect(editor).toHaveAttribute('data-tab-size', '4')
      expect(editor).toHaveAttribute('data-line-numbers', 'off')

      expect(editor).toHaveAttribute('data-minimap-enabled', 'false')
      expect(editor).toHaveAttribute('data-automatic-layout', 'true')
    })

    it('should override minimap option', () => {
      render(
        <CodeEditor
          options={{
            minimap: { enabled: true },
          }}
        />,
      )

      const editor = screen.getByTestId('monaco-editor')
      expect(editor).toHaveAttribute('data-minimap-enabled', 'true')
    })
  })

  describe('Callbacks', () => {
    it('should call onChange callback', () => {
      const handleChange = jest.fn()

      render(<CodeEditor onChange={handleChange} />)

      expect(screen.getByTestId('monaco-editor')).toBeInTheDocument()
    })

    it('should call onMount callback', async () => {
      const handleMount = jest.fn()

      render(<CodeEditor onMount={handleMount} />)

      await waitFor(() => {
        expect(handleMount).toHaveBeenCalled()
      })
    })

    it('should call beforeMount callback', async () => {
      const handleBeforeMount = jest.fn()

      render(<CodeEditor beforeMount={handleBeforeMount} />)

      await waitFor(() => {
        expect(handleBeforeMount).toHaveBeenCalled()
      })
    })

    it('should provide editor instance in onMount', async () => {
      const handleMount = jest.fn()

      render(<CodeEditor value="test code" onMount={handleMount} />)

      await waitFor(() => {
        expect(handleMount).toHaveBeenCalled()
        const [editorInstance] = handleMount.mock.calls[0]
        expect(editorInstance.getValue()).toBe('test code')
      })
    })
  })

  describe('Styling', () => {
    it('should apply default border and rounded classes', () => {
      const { container } = render(<CodeEditor />)

      const wrapper = container.firstChild as HTMLElement
      expect(wrapper).toHaveClass('overflow-hidden')
      expect(wrapper).toHaveClass('rounded-md')
      expect(wrapper).toHaveClass('border')
      expect(wrapper).toHaveClass('border-border')
    })

    it('should apply custom className', () => {
      const { container } = render(<CodeEditor className="custom-editor" />)

      const wrapper = container.firstChild as HTMLElement
      expect(wrapper).toHaveClass('custom-editor')
      expect(wrapper).toHaveClass('overflow-hidden')
      expect(wrapper).toHaveClass('rounded-md')
    })

    it('should merge custom className with default classes', () => {
      const { container } = render(
        <CodeEditor className="my-custom-class another-class" />,
      )

      const wrapper = container.firstChild as HTMLElement
      expect(wrapper).toHaveClass('my-custom-class')
      expect(wrapper).toHaveClass('another-class')
      expect(wrapper).toHaveClass('border')
      expect(wrapper).toHaveClass('rounded-md')
    })
  })

  describe('Ref Forwarding', () => {
    it('should forward ref to wrapper div', () => {
      const ref = React.createRef<HTMLDivElement>()

      render(<CodeEditor ref={ref} />)

      expect(ref.current).toBeInstanceOf(HTMLDivElement)
      expect(ref.current).toHaveClass('overflow-hidden')
    })

    it('should allow ref access to DOM element', () => {
      const ref = React.createRef<HTMLDivElement>()

      render(<CodeEditor ref={ref} className="test-ref" />)

      expect(ref.current?.className).toContain('test-ref')
    })
  })

  describe('Edge Cases', () => {
    it('should render with empty value', () => {
      render(<CodeEditor value="" />)

      const editor = screen.getByTestId('monaco-editor')
      expect(editor).toBeInTheDocument()
    })

    it('should render with multiline code', () => {
      const multilineCode = `function hello() {
  console.log("Hello")
  return true
}`

      render(<CodeEditor value={multilineCode} />)

      const editor = screen.getByTestId('monaco-editor')
      expect(editor).toHaveTextContent('function hello()')
    })

    it('should handle very long single line code', () => {
      const longCode = 'const x = ' + '1 + '.repeat(1000) + '1'

      render(<CodeEditor value={longCode} />)

      const editor = screen.getByTestId('monaco-editor')
      expect(editor).toBeInTheDocument()
    })

    it('should update when value prop changes', () => {
      const { rerender } = render(<CodeEditor value="initial value" />)

      let editor = screen.getByTestId('monaco-editor')
      expect(editor).toHaveTextContent('initial value')

      rerender(<CodeEditor value="updated value" />)

      editor = screen.getByTestId('monaco-editor')
      expect(editor).toHaveTextContent('updated value')
    })
  })

  describe('Display Name', () => {
    it('should have correct display name', () => {
      expect(CodeEditor.displayName).toBe('CodeEditor')
    })
  })
})
