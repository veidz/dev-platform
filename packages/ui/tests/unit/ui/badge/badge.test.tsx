import { Badge } from '@/components/ui/badge'
import { render, screen } from '@testing-library/react'

describe('Badge', () => {
  describe('Rendering', () => {
    it('should render with children', () => {
      render(<Badge>Test Badge</Badge>)
      expect(screen.getByText('Test Badge')).toBeInTheDocument()
    })

    it('should render with custom className', () => {
      render(<Badge className="custom-class">Badge</Badge>)
      const badge = screen.getByText('Badge')
      expect(badge).toHaveClass('custom-class')
    })

    it('should render as a div element', () => {
      const { container } = render(<Badge>Badge</Badge>)
      const badge = container.firstChild
      expect(badge).toBeInstanceOf(HTMLDivElement)
    })
  })

  describe('Variants', () => {
    it('should render default variant', () => {
      render(<Badge variant="default">Default</Badge>)
      const badge = screen.getByText('Default')
      expect(badge).toHaveClass('bg-primary')
      expect(badge).toHaveClass('text-primary-foreground')
    })
  })
})
