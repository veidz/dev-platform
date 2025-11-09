import { Button } from '@/components/ui/button'
import { describe, expect, it } from '@jest/globals'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

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

  describe('variants', () => {
    it('renders default variant', () => {
      render(<Button variant="default">Default</Button>)
      const button = screen.getByRole('button')
      expect(button.className).toContain('bg-primary')
      expect(button.className).toContain('text-primary-foreground')
    })

    it('renders destructive variant', () => {
      render(<Button variant="destructive">Delete</Button>)
      const button = screen.getByRole('button')
      expect(button.className).toContain('bg-destructive')
    })

    it('renders outline variant', () => {
      render(<Button variant="outline">Outline</Button>)
      const button = screen.getByRole('button')
      expect(button.className).toContain('border-2')
    })

    it('renders secondary variant', () => {
      render(<Button variant="secondary">Secondary</Button>)
      const button = screen.getByRole('button')
      expect(button.className).toContain('bg-secondary')
    })

    it('renders ghost variant', () => {
      render(<Button variant="ghost">Ghost</Button>)
      const button = screen.getByRole('button')
      expect(button.className).toContain('hover:bg-accent/20')
    })

    it('renders link variant', () => {
      render(<Button variant="link">Link</Button>)
      const button = screen.getByRole('button')
      expect(button.className).toContain('underline-offset-4')
    })
  })

  describe('sizes', () => {
    it('renders default size', () => {
      render(<Button size="default">Default Size</Button>)
      const button = screen.getByRole('button')
      expect(button.className).toContain('h-9')
      expect(button.className).toContain('px-4')
    })

    it('renders small size', () => {
      render(<Button size="sm">Small</Button>)
      const button = screen.getByRole('button')
      expect(button.className).toContain('h-8')
      expect(button.className).toContain('px-3')
    })

    it('renders large size', () => {
      render(<Button size="lg">Large</Button>)
      const button = screen.getByRole('button')
      expect(button.className).toContain('h-10')
      expect(button.className).toContain('px-8')
    })

    it('renders icon size', () => {
      render(<Button size="icon">🔍</Button>)
      const button = screen.getByRole('button')
      expect(button.className).toContain('h-9')
      expect(button.className).toContain('w-9')
    })
  })

  describe('interactions', () => {
    it('handles click events', async () => {
      const handleClick = jest.fn()
      const user = userEvent.setup()

      render(<Button onClick={handleClick}>Click</Button>)
      const button = screen.getByRole('button')

      await user.click(button)
      expect(handleClick).toHaveBeenCalledTimes(1)
    })

    it('does not trigger click when disabled', async () => {
      const handleClick = jest.fn()
      const user = userEvent.setup()

      render(
        <Button onClick={handleClick} disabled>
          Disabled
        </Button>,
      )
      const button = screen.getByRole('button')

      await user.click(button)
      expect(handleClick).not.toHaveBeenCalled()
    })

    it('applies disabled styles', () => {
      render(<Button disabled>Disabled</Button>)
      const button = screen.getByRole('button')
      expect(button.hasAttribute('disabled')).toBe(true)
      expect(button.className).toContain('disabled:opacity-50')
    })
  })
})
