import { Textarea } from '@/components/ui/textarea/textarea'
import { render, screen } from '@testing-library/react'

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
  })
})
