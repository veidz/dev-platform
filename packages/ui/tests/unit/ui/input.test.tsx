import { Input } from '@/components/ui/input'
import { describe, expect, it } from '@jest/globals'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createRef } from 'react'

describe('Input', () => {
  describe('rendering', () => {
    it('should render as input element', () => {
      render(<Input placeholder="Test input" />)
      const input = screen.getByPlaceholderText('Test input')
      expect(input.tagName).toBe('INPUT')
    })

    it('should apply default classes', () => {
      render(<Input />)
      const input = screen.getByRole('textbox')
      expect(input.className).toContain('flex')
      expect(input.className).toContain('h-9')
      expect(input.className).toContain('rounded-md')
    })
  })

  describe('types', () => {
    it('should render text type by default', () => {
      render(<Input />)
      const input = screen.getByRole('textbox')
      expect(input.getAttribute('type')).toBeNull()
    })

    it('should render email type', () => {
      render(<Input type="email" placeholder="email" />)
      const input = screen.getByPlaceholderText('email')
      expect(input.getAttribute('type')).toBe('email')
    })

    it('should render password type', () => {
      render(<Input type="password" placeholder="password" />)
      const input = screen.getByPlaceholderText('password')
      expect(input.getAttribute('type')).toBe('password')
    })

    it('should render number type', () => {
      render(<Input type="number" placeholder="number" />)
      const input = screen.getByPlaceholderText('number')
      expect(input.getAttribute('type')).toBe('number')
    })

    it('should render tel type', () => {
      render(<Input type="tel" placeholder="phone" />)
      const input = screen.getByPlaceholderText('phone')
      expect(input.getAttribute('type')).toBe('tel')
    })

    it('should render search type', () => {
      render(<Input type="search" placeholder="search" />)
      const input = screen.getByPlaceholderText('search')
      expect(input.getAttribute('type')).toBe('search')
    })
  })

  describe('interactions', () => {
    it('should handle value changes', async () => {
      const user = userEvent.setup()
      render(<Input placeholder="Type here" />)
      const input = screen.getByPlaceholderText('Type here') as HTMLInputElement

      await user.type(input, 'Hello World')
      expect(input.value).toBe('Hello World')
    })

    it('should handle onChange callback', async () => {
      const handleChange = jest.fn()
      const user = userEvent.setup()
      render(<Input onChange={handleChange} placeholder="test" />)
      const input = screen.getByPlaceholderText('test')

      await user.type(input, 'a')
      expect(handleChange).toHaveBeenCalled()
    })

    it('should handle onFocus callback', async () => {
      const handleFocus = jest.fn()
      const user = userEvent.setup()
      render(<Input onFocus={handleFocus} placeholder="test" />)
      const input = screen.getByPlaceholderText('test')

      await user.click(input)
      expect(handleFocus).toHaveBeenCalledTimes(1)
    })

    it('should handle onBlur callback', async () => {
      const handleBlur = jest.fn()
      const user = userEvent.setup()
      render(<Input onBlur={handleBlur} placeholder="test" />)
      const input = screen.getByPlaceholderText('test')

      await user.click(input)
      await user.tab()
      expect(handleBlur).toHaveBeenCalledTimes(1)
    })

    it('does not accept input when disabled', async () => {
      const user = userEvent.setup()
      render(<Input disabled placeholder="disabled" />)
      const input = screen.getByPlaceholderText('disabled') as HTMLInputElement

      await user.type(input, 'test')
      expect(input.value).toBe('')
    })
  })

  describe('states', () => {
    it('should apply disabled state', () => {
      render(<Input disabled placeholder="disabled" />)
      const input = screen.getByPlaceholderText('disabled')
      expect(input.hasAttribute('disabled')).toBe(true)
      expect(input.className).toContain('disabled:opacity-50')
    })

    it('should apply readonly state', () => {
      render(<Input readOnly placeholder="readonly" />)
      const input = screen.getByPlaceholderText('readonly')
      expect(input.hasAttribute('readonly')).toBe(true)
    })

    it('should apply required state', () => {
      render(<Input required placeholder="required" />)
      const input = screen.getByPlaceholderText('required')
      expect(input.hasAttribute('required')).toBe(true)
    })
  })

  describe('custom props', () => {
    it('should accept custom className', () => {
      render(<Input className="custom-class" placeholder="test" />)
      const input = screen.getByPlaceholderText('test')
      expect(input.className).toContain('custom-class')
    })

    it('should accept value prop', () => {
      render(<Input value="preset value" onChange={() => {}} />)
      const input = screen.getByRole('textbox') as HTMLInputElement
      expect(input.value).toBe('preset value')
    })

    it('should accept defaultValue prop', () => {
      render(<Input defaultValue="default" />)
      const input = screen.getByRole('textbox') as HTMLInputElement
      expect(input.value).toBe('default')
    })

    it('should accept maxLength prop', () => {
      render(<Input maxLength={10} placeholder="max10" />)
      const input = screen.getByPlaceholderText('max10')
      expect(input.getAttribute('maxLength')).toBe('10')
    })

    it('should accept pattern prop', () => {
      render(<Input pattern="[0-9]*" placeholder="numbers" />)
      const input = screen.getByPlaceholderText('numbers')
      expect(input.getAttribute('pattern')).toBe('[0-9]*')
    })

    it('should accept name prop', () => {
      render(<Input name="username" placeholder="test" />)
      const input = screen.getByPlaceholderText('test')
      expect(input.getAttribute('name')).toBe('username')
    })

    it('should accept id prop', () => {
      render(<Input id="email-input" placeholder="test" />)
      const input = screen.getByPlaceholderText('test')
      expect(input.getAttribute('id')).toBe('email-input')
    })

    it('should accept aria-label', () => {
      render(<Input aria-label="Search input" />)
      const input = screen.getByRole('textbox', { name: /search input/i })
      expect(input).toBeDefined()
    })

    it('should accept aria-describedby', () => {
      render(<Input aria-describedby="helper-text" placeholder="test" />)
      const input = screen.getByPlaceholderText('test')
      expect(input.getAttribute('aria-describedby')).toBe('helper-text')
    })

    it('should forward ref correctly', () => {
      const ref = createRef<HTMLInputElement>()
      render(<Input ref={ref} />)
      expect(ref.current).toBeDefined()
      expect(ref.current?.tagName).toBe('INPUT')
    })
  })

  describe('focus management', () => {
    it('should be focused programmatically', () => {
      const ref = createRef<HTMLInputElement>()
      render(<Input ref={ref} />)
      ref.current?.focus()
      expect(document.activeElement).toBe(ref.current)
    })

    it('should apply focus-visible ring styles', () => {
      render(<Input placeholder="test" />)
      const input = screen.getByPlaceholderText('test')
      expect(input.className).toContain('focus-visible:ring-1')
    })
  })
})
