import { Input } from '@/components/ui/input'
import { describe, expect, it } from '@jest/globals'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

describe('Input', () => {
  describe('rendering', () => {
    it('renders as input element', () => {
      render(<Input placeholder="Test input" />)
      const input = screen.getByPlaceholderText('Test input')
      expect(input.tagName).toBe('INPUT')
    })

    it('applies default classes', () => {
      render(<Input />)
      const input = screen.getByRole('textbox')
      expect(input.className).toContain('flex')
      expect(input.className).toContain('h-9')
      expect(input.className).toContain('rounded-md')
    })
  })

  describe('types', () => {
    it('renders text type by default', () => {
      render(<Input />)
      const input = screen.getByRole('textbox')
      expect(input.getAttribute('type')).toBeNull()
    })

    it('renders email type', () => {
      render(<Input type="email" placeholder="email" />)
      const input = screen.getByPlaceholderText('email')
      expect(input.getAttribute('type')).toBe('email')
    })

    it('renders password type', () => {
      render(<Input type="password" placeholder="password" />)
      const input = screen.getByPlaceholderText('password')
      expect(input.getAttribute('type')).toBe('password')
    })

    it('renders number type', () => {
      render(<Input type="number" placeholder="number" />)
      const input = screen.getByPlaceholderText('number')
      expect(input.getAttribute('type')).toBe('number')
    })

    it('renders tel type', () => {
      render(<Input type="tel" placeholder="phone" />)
      const input = screen.getByPlaceholderText('phone')
      expect(input.getAttribute('type')).toBe('tel')
    })

    it('renders search type', () => {
      render(<Input type="search" placeholder="search" />)
      const input = screen.getByPlaceholderText('search')
      expect(input.getAttribute('type')).toBe('search')
    })
  })

  describe('interactions', () => {
    it('handles value changes', async () => {
      const user = userEvent.setup()
      render(<Input placeholder="Type here" />)
      const input = screen.getByPlaceholderText('Type here') as HTMLInputElement

      await user.type(input, 'Hello World')
      expect(input.value).toBe('Hello World')
    })
  })
})
