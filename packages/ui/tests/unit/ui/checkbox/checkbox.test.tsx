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

    it('should render unchecked by default', () => {
      render(<Checkbox />)
      const checkbox = screen.getByRole('checkbox')
      expect(checkbox).not.toBeChecked()
    })

    it('should render checked when defaultChecked is true', () => {
      render(<Checkbox defaultChecked />)
      const checkbox = screen.getByRole('checkbox')
      expect(checkbox).toBeChecked()
    })

    it('should render with custom className', () => {
      render(<Checkbox className="custom-class" />)
      const checkbox = screen.getByRole('checkbox')
      expect(checkbox).toHaveClass('custom-class')
    })

    it('should render with id', () => {
      render(<Checkbox id="terms" />)
      const checkbox = screen.getByRole('checkbox')
      expect(checkbox).toHaveAttribute('id', 'terms')
    })
  })
})
