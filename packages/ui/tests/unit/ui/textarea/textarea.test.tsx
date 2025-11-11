import { Textarea } from '@/components/ui/textarea/textarea'
import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'

describe('Textarea', () => {
  describe('Rendering', () => {
    it('renders textarea element', () => {
      render(<Textarea />)
      expect(screen.getByRole('textbox')).toBeInTheDocument()
    })

    it('renders with placeholder', () => {
      render(<Textarea placeholder="Enter text" />)
      expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument()
    })

    it('renders with default value', () => {
      render(<Textarea defaultValue="Default text" />)
      expect(screen.getByRole('textbox')).toHaveValue('Default text')
    })

    it('renders with controlled value', () => {
      render(<Textarea value="Controlled text" onChange={() => {}} />)
      expect(screen.getByRole('textbox')).toHaveValue('Controlled text')
    })

    it('renders with custom className', () => {
      render(<Textarea className="custom-class" />)
      expect(screen.getByRole('textbox')).toHaveClass('custom-class')
    })

    it('renders with id', () => {
      render(<Textarea id="message" />)
      expect(screen.getByRole('textbox')).toHaveAttribute('id', 'message')
    })

    it('renders with name attribute', () => {
      render(<Textarea name="description" />)
      expect(screen.getByRole('textbox')).toHaveAttribute('name', 'description')
    })

    it('renders with rows attribute', () => {
      render(<Textarea rows={10} />)
      expect(screen.getByRole('textbox')).toHaveAttribute('rows', '10')
    })

    it('renders with cols attribute', () => {
      render(<Textarea cols={50} />)
      expect(screen.getByRole('textbox')).toHaveAttribute('cols', '50')
    })
  })

  describe('States', () => {
    it('applies disabled state', () => {
      render(<Textarea disabled />)
      expect(screen.getByRole('textbox')).toBeDisabled()
    })

    it('applies disabled styles', () => {
      render(<Textarea disabled />)
      expect(screen.getByRole('textbox')).toHaveClass('disabled:opacity-50')
    })

    it('applies readonly state', () => {
      render(<Textarea readOnly />)
      expect(screen.getByRole('textbox')).toHaveAttribute('readonly')
    })

    it('applies required state', () => {
      render(<Textarea required />)
      expect(screen.getByRole('textbox')).toBeRequired()
    })

    it('applies error styles when error prop is true', () => {
      render(<Textarea error />)
      expect(screen.getByRole('textbox')).toHaveClass('border-destructive')
    })

    it('does not apply error styles when error prop is false', () => {
      render(<Textarea error={false} />)
      expect(screen.getByRole('textbox')).not.toHaveClass('border-destructive')
    })
  })

  describe('User Interactions', () => {
    it('handles text input', async () => {
      const user = userEvent.setup()
      render(<Textarea />)

      const textarea = screen.getByRole('textbox')
      await user.type(textarea, 'Hello World')

      expect(textarea).toHaveValue('Hello World')
    })

    it('handles onChange event', async () => {
      const user = userEvent.setup()
      const handleChange = jest.fn()
      render(<Textarea onChange={handleChange} />)

      const textarea = screen.getByRole('textbox')
      await user.type(textarea, 'Test')

      expect(handleChange).toHaveBeenCalled()
    })

    it('handles onFocus event', async () => {
      const user = userEvent.setup()
      const handleFocus = jest.fn()
      render(<Textarea onFocus={handleFocus} />)

      const textarea = screen.getByRole('textbox')
      await user.click(textarea)

      expect(handleFocus).toHaveBeenCalled()
    })

    it('handles onBlur event', async () => {
      const user = userEvent.setup()
      const handleBlur = jest.fn()
      render(<Textarea onBlur={handleBlur} />)

      const textarea = screen.getByRole('textbox')
      await user.click(textarea)
      await user.tab()

      expect(handleBlur).toHaveBeenCalled()
    })

    it('handles multiline input', async () => {
      const user = userEvent.setup()
      render(<Textarea />)

      const textarea = screen.getByRole('textbox')
      await user.type(textarea, 'Line 1{Enter}Line 2{Enter}Line 3')

      expect(textarea).toHaveValue('Line 1\nLine 2\nLine 3')
    })

    it('respects maxLength attribute', async () => {
      const user = userEvent.setup()
      render(<Textarea maxLength={10} />)

      const textarea = screen.getByRole('textbox')
      await user.type(textarea, 'This is a very long text')

      expect(textarea).toHaveValue('This is a ')
    })

    it('does not allow input when disabled', async () => {
      const user = userEvent.setup()
      render(<Textarea disabled />)

      const textarea = screen.getByRole('textbox')
      await user.type(textarea, 'Test')

      expect(textarea).toHaveValue('')
    })

    it('does not allow input when readonly', async () => {
      const user = userEvent.setup()
      render(<Textarea readOnly value="Read only" />)

      const textarea = screen.getByRole('textbox')
      await user.type(textarea, 'Test')

      expect(textarea).toHaveValue('Read only')
    })
  })

  describe('Accessibility', () => {
    it('has correct role', () => {
      render(<Textarea />)
      expect(screen.getByRole('textbox')).toBeInTheDocument()
    })

    it('can be labeled with aria-label', () => {
      render(<Textarea aria-label="Message input" />)
      expect(screen.getByLabelText('Message input')).toBeInTheDocument()
    })

    it('can be labeled with aria-labelledby', () => {
      render(
        <>
          <label id="message-label">Message</label>
          <Textarea aria-labelledby="message-label" />
        </>,
      )
      expect(screen.getByRole('textbox')).toHaveAttribute(
        'aria-labelledby',
        'message-label',
      )
    })

    it('can have aria-describedby', () => {
      render(
        <>
          <Textarea aria-describedby="helper-text" />
          <p id="helper-text">Helper text</p>
        </>,
      )
      expect(screen.getByRole('textbox')).toHaveAttribute(
        'aria-describedby',
        'helper-text',
      )
    })

    it('can be marked as invalid with aria-invalid', () => {
      render(<Textarea aria-invalid />)
      expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid')
    })
  })

  describe('Form Integration', () => {
    it('submits with form data', () => {
      const handleSubmit = jest.fn((e) => {
        e.preventDefault()
        const formData = new FormData(e.currentTarget)
        return formData.get('message')
      })

      render(
        <form onSubmit={handleSubmit}>
          <Textarea name="message" defaultValue="Test message" />
          <button type="submit">Submit</button>
        </form>,
      )

      const button = screen.getByRole('button')
      button.click()

      expect(handleSubmit).toHaveBeenCalled()
      const result = handleSubmit.mock.results[0].value
      expect(result).toBe('Test message')
    })

    it('works with label element', () => {
      render(
        <>
          <label htmlFor="bio">Biography</label>
          <Textarea id="bio" />
        </>,
      )

      expect(screen.getByLabelText('Biography')).toBeInTheDocument()
    })
  })

  describe('Styling', () => {
    it('applies base styles', () => {
      render(<Textarea />)
      const textarea = screen.getByRole('textbox')
      expect(textarea).toHaveClass('flex')
      expect(textarea).toHaveClass('min-h-20')
      expect(textarea).toHaveClass('w-full')
      expect(textarea).toHaveClass('rounded-md')
    })

    it('applies focus styles', () => {
      render(<Textarea />)
      expect(screen.getByRole('textbox')).toHaveClass(
        'focus-visible:outline-none',
      )
    })

    it('merges custom className with base styles', () => {
      render(<Textarea className="custom-height" />)
      const textarea = screen.getByRole('textbox')
      expect(textarea).toHaveClass('custom-height')
      expect(textarea).toHaveClass('w-full')
    })
  })

  describe('Ref Forwarding', () => {
    it('forwards ref to textarea element', () => {
      const ref = { current: null as HTMLTextAreaElement | null }
      render(<Textarea ref={ref} />)
      expect(ref.current).toBeInstanceOf(HTMLTextAreaElement)
    })
  })
})
