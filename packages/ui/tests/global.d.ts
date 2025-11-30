import '@testing-library/jest-dom'

declare module 'jest-axe' {
  interface AxeResults {
    violations: Array<{
      id: string
      impact?: string
      description: string
      help: string
      helpUrl: string
      nodes: Array<{
        html: string
        target: string[]
      }>
    }>
  }

  export function axe(
    container: Element,
    options?: Record<string, unknown>,
  ): Promise<AxeResults>

  export function toHaveNoViolations(): {
    toHaveNoViolations(): void
  }
}

declare global {
  namespace jest {
    interface Matchers<R = void> {
      toBeInTheDocument(): R
      toHaveAttribute(attr: string, value?: string): R
      toHaveClass(...classNames: string[]): R
      toHaveStyle(css: string | Record<string, unknown>): R
      toBeVisible(): R
      toBeDisabled(): R
      toBeEnabled(): R
      toHaveValue(value: string | number | string[]): R
      toHaveTextContent(
        text: string | RegExp,
        options?: { normalizeWhitespace: boolean },
      ): R
      toContainElement(element: HTMLElement | null): R
      toBeEmptyDOMElement(): R
      toBeInvalid(): R
      toBeRequired(): R
      toBeValid(): R
      toHaveFocus(): R
      toHaveNoViolations(): R
    }
  }
}
