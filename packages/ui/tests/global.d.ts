import '@testing-library/jest-dom'

declare module 'expect' {
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
  }
}
