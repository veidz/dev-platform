import { Separator } from '@/components/ui/separator'
import { render } from '@testing-library/react'

describe('Separator', () => {
  describe('Rendering', () => {
    it('should render separator element', () => {
      const { container } = render(<Separator />)

      const separator = container.querySelector('[data-orientation]')
      expect(separator).toBeInTheDocument()
    })

    it('should render with custom className', () => {
      const { container } = render(<Separator className="custom-class" />)

      const separator = container.querySelector('[data-orientation]')
      expect(separator).toHaveClass('custom-class')
    })

    it('should apply default styles', () => {
      const { container } = render(<Separator />)

      const separator = container.querySelector('[data-orientation]')
      expect(separator).toHaveClass('shrink-0', 'bg-border')
    })
  })

  describe('Orientation', () => {
    it('should render horizontal by default', () => {
      const { container } = render(<Separator />)

      const separator = container.querySelector('[data-orientation]')
      expect(separator).toHaveAttribute('data-orientation', 'horizontal')
    })
  })
})
