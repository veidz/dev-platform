import { Textarea } from '@/components/ui/textarea/textarea'
import { render, screen } from '@testing-library/react'

describe('Textarea', () => {
  describe('Rendering', () => {
    it('renders textarea element', () => {
      render(<Textarea />)
      expect(screen.getByRole('textbox')).toBeInTheDocument()
    })
  })
})
