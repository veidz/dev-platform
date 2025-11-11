import '@testing-library/jest-dom'
import { toHaveNoViolations } from 'jest-axe'

expect.extend(toHaveNoViolations)

global.ResizeObserver = class ResizeObserver {
  observe(): void {}
  unobserve(): void {}
  disconnect(): void {}
}

Element.prototype.scrollIntoView = jest.fn()

Element.prototype.hasPointerCapture = jest.fn()

Element.prototype.releasePointerCapture = jest.fn()

const originalError = console.error
const originalWarn = console.warn

beforeAll(() => {
  console.error = (...args: unknown[]) => {
    const message = String(args[0])
    if (
      message.includes('DialogContent') ||
      message.includes('DialogTitle') ||
      message.includes('aria-describedby')
    ) {
      return
    }
    originalError.call(console, ...args)
  }

  console.warn = (...args: unknown[]) => {
    const message = String(args[0])
    if (
      message.includes('DialogContent') ||
      message.includes('Description') ||
      message.includes('aria-describedby')
    ) {
      return
    }
    originalWarn.call(console, ...args)
  }
})

afterAll(() => {
  console.error = originalError
  console.warn = originalWarn
})
