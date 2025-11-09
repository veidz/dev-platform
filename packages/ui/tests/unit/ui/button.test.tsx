import { Button } from '@/components/ui/button'
import { describe, expect, it } from '@jest/globals'
import { render, screen } from '@testing-library/react'

describe('Button', () => {
  describe('rendering', () => {
    it('renders children correctly', () => {
      render(<Button>Click me</Button>)
      const element = screen.getByText('Click me')
      expect(element).toBeDefined()
      expect(element.textContent).toBe('Click me')
    })

    it('renders as button element by default', () => {
      render(<Button>Test</Button>)
      const button = screen.getByRole('button', { name: /test/i })
      expect(button.tagName).toBe('BUTTON')
    })

    it('applies default variant classes', () => {
      render(<Button>Default</Button>)
      const button = screen.getByRole('button')
      expect(button.className).toContain('bg-primary')
    })
  })
})
