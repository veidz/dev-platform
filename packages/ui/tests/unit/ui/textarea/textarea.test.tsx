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
  })
})
