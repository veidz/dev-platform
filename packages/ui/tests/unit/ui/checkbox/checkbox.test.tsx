import { Checkbox } from '@/components/ui/checkbox'
import { render, screen } from '@testing-library/react'

describe('Checkbox', () => {
  describe('Rendering', () => {
    it('should render checkbox', () => {
      render(<Checkbox />)
      const checkbox = screen.getByRole('checkbox')
      expect(checkbox).toBeInTheDocument()
    })

    it('should render with aria-label', () => {
      render(<Checkbox aria-label="Accept terms" />)
      const checkbox = screen.getByRole('checkbox', { name: 'Accept terms' })
      expect(checkbox).toBeInTheDocument()
    })
  })
})
