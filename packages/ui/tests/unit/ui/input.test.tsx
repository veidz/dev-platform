import { Input } from '@/components/ui/input'
import { describe, expect, it } from '@jest/globals'
import { render, screen } from '@testing-library/react'

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
  })
})
