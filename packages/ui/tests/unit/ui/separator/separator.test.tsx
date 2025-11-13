import { Separator } from '@/components/ui/separator'
import { render, screen } from '@testing-library/react'

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

    it('should render horizontal separator with correct styles', () => {
      const { container } = render(<Separator orientation="horizontal" />)

      const separator = container.querySelector('[data-orientation]')
      expect(separator).toHaveClass('h-[1px]', 'w-full')
    })

    it('should render vertical separator', () => {
      const { container } = render(<Separator orientation="vertical" />)

      const separator = container.querySelector('[data-orientation]')
      expect(separator).toHaveAttribute('data-orientation', 'vertical')
    })

    it('should render vertical separator with correct styles', () => {
      const { container } = render(<Separator orientation="vertical" />)

      const separator = container.querySelector('[data-orientation]')
      expect(separator).toHaveClass('h-full', 'w-[1px]')
    })

    it('should update orientation when prop changes', () => {
      const { container, rerender } = render(
        <Separator orientation="horizontal" />,
      )

      let separator = container.querySelector('[data-orientation]')
      expect(separator).toHaveAttribute('data-orientation', 'horizontal')

      rerender(<Separator orientation="vertical" />)

      separator = container.querySelector('[data-orientation]')
      expect(separator).toHaveAttribute('data-orientation', 'vertical')
    })
  })

  describe('Decorative', () => {
    it('should be decorative by default', () => {
      render(<Separator />)

      const separator = screen.queryByRole('separator')
      expect(separator).not.toBeInTheDocument()
    })

    it('should not have separator role when decorative', () => {
      const { container } = render(<Separator decorative={true} />)

      const separator = container.querySelector('[data-orientation]')
      expect(separator).toBeInTheDocument()
      expect(separator).toHaveAttribute('role', 'none')
    })

    it('should have separator role when not decorative', () => {
      render(<Separator decorative={false} />)

      const separator = screen.getByRole('separator')
      expect(separator).toBeInTheDocument()
    })

    it('should be accessible to screen readers when not decorative', () => {
      render(<Separator decorative={false} aria-label="Content divider" />)

      const separator = screen.getByRole('separator', {
        name: 'Content divider',
      })
      expect(separator).toBeInTheDocument()
    })
  })

  describe('ARIA Attributes', () => {
    it('should have data-orientation attribute', () => {
      render(<Separator decorative={false} orientation="horizontal" />)

      const separator = screen.getByRole('separator')
      expect(separator).toHaveAttribute('data-orientation', 'horizontal')
    })

    it('should accept aria-label', () => {
      render(<Separator decorative={false} aria-label="Section divider" />)

      const separator = screen.getByRole('separator', {
        name: 'Section divider',
      })
      expect(separator).toBeInTheDocument()
    })

    it('should accept aria-labelledby', () => {
      render(
        <div>
          <h2 id="section-title">Section Title</h2>
          <Separator decorative={false} aria-labelledby="section-title" />
        </div>,
      )

      const separator = screen.getByRole('separator')
      expect(separator).toHaveAttribute('aria-labelledby', 'section-title')
    })
  })

  describe('Ref Forwarding', () => {
    it('should forward ref correctly', () => {
      const ref = { current: null }
      const { container } = render(<Separator ref={ref} />)

      expect(ref.current).toBeInstanceOf(HTMLDivElement)
      expect(ref.current).toBe(container.querySelector('[data-orientation]'))
    })
  })
})
