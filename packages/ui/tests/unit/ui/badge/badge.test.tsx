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

    it('should render secondary variant', () => {
      render(<Badge variant="secondary">Secondary</Badge>)
      const badge = screen.getByText('Secondary')
      expect(badge).toHaveClass('bg-secondary')
      expect(badge).toHaveClass('text-secondary-foreground')
    })

    it('should render destructive variant', () => {
      render(<Badge variant="destructive">Destructive</Badge>)
      const badge = screen.getByText('Destructive')
      expect(badge).toHaveClass('bg-destructive')
      expect(badge).toHaveClass('text-destructive-foreground')
    })

    it('should render outline variant', () => {
      render(<Badge variant="outline">Outline</Badge>)
      const badge = screen.getByText('Outline')
      expect(badge).toHaveClass('text-foreground')
    })

    it('should render success variant', () => {
      render(<Badge variant="success">Success</Badge>)
      const badge = screen.getByText('Success')
      expect(badge).toHaveClass('bg-green-500')
      expect(badge).toHaveClass('text-white')
    })

    it('should render warning variant', () => {
      render(<Badge variant="warning">Warning</Badge>)
      const badge = screen.getByText('Warning')
      expect(badge).toHaveClass('bg-yellow-500')
      expect(badge).toHaveClass('text-white')
    })

    it('should render info variant', () => {
      render(<Badge variant="info">Info</Badge>)
      const badge = screen.getByText('Info')
      expect(badge).toHaveClass('bg-blue-500')
      expect(badge).toHaveClass('text-white')
    })

    it('should use default variant when not specified', () => {
      render(<Badge>Default Variant</Badge>)
      const badge = screen.getByText('Default Variant')
      expect(badge).toHaveClass('bg-primary')
    })
  })

  describe('Styling', () => {
    it('should have base styles', () => {
      render(<Badge>Badge</Badge>)
      const badge = screen.getByText('Badge')
      expect(badge).toHaveClass('inline-flex')
      expect(badge).toHaveClass('items-center')
      expect(badge).toHaveClass('rounded-full')
      expect(badge).toHaveClass('border')
      expect(badge).toHaveClass('px-2.5')
      expect(badge).toHaveClass('py-0.5')
      expect(badge).toHaveClass('text-xs')
      expect(badge).toHaveClass('font-semibold')
    })

    it('should have transition styles', () => {
      render(<Badge>Badge</Badge>)
      const badge = screen.getByText('Badge')
      expect(badge).toHaveClass('transition-colors')
    })

    it('should have focus styles', () => {
      render(<Badge>Badge</Badge>)
      const badge = screen.getByText('Badge')
      expect(badge).toHaveClass('focus:outline-none')
      expect(badge).toHaveClass('focus:ring-2')
      expect(badge).toHaveClass('focus:ring-ring')
      expect(badge).toHaveClass('focus:ring-offset-2')
    })
  })

  describe('HTML Attributes', () => {
    it('should accept data attributes', () => {
      render(<Badge data-testid="custom-badge">Badge</Badge>)
      expect(screen.getByTestId('custom-badge')).toBeInTheDocument()
    })

    it('should accept aria attributes', () => {
      render(<Badge aria-label="Status badge">Badge</Badge>)
      const badge = screen.getByLabelText('Status badge')
      expect(badge).toBeInTheDocument()
    })

    it('should accept id attribute', () => {
      render(<Badge id="badge-id">Badge</Badge>)
      const badge = screen.getByText('Badge')
      expect(badge).toHaveAttribute('id', 'badge-id')
    })

    it('should accept role attribute', () => {
      render(<Badge role="status">Badge</Badge>)
      const badge = screen.getByText('Badge')
      expect(badge).toHaveAttribute('role', 'status')
    })
  })

  describe('Content', () => {
    it('should render with text content', () => {
      render(<Badge>Text Content</Badge>)
      expect(screen.getByText('Text Content')).toBeInTheDocument()
    })

    it('should render with JSX content', () => {
      render(
        <Badge>
          <span>Prefix</span> Text
        </Badge>,
      )
      expect(screen.getByText('Prefix')).toBeInTheDocument()
      expect(screen.getByText(/Text/)).toBeInTheDocument()
    })

    it('should render with numeric content', () => {
      render(<Badge>{42}</Badge>)
      expect(screen.getByText('42')).toBeInTheDocument()
    })

    it('should render with empty content', () => {
      const { container } = render(<Badge />)
      const badge = container.firstChild
      expect(badge).toBeInTheDocument()
      expect(badge).toBeEmptyDOMElement()
    })
  })

  describe('Event Handlers', () => {
    it('should handle onClick event', () => {
      const handleClick = jest.fn()
      render(<Badge onClick={handleClick}>Clickable</Badge>)

      const badge = screen.getByText('Clickable')
      badge.click()

      expect(handleClick).toHaveBeenCalledTimes(1)
    })

    it('should accept onMouseEnter handler', () => {
      const handleMouseEnter = jest.fn()
      const { container } = render(
        <Badge onMouseEnter={handleMouseEnter}>Hoverable</Badge>,
      )

      expect(container.firstChild).toBeInTheDocument()
    })

    it('should accept onMouseLeave handler', () => {
      const handleMouseLeave = jest.fn()
      const { container } = render(
        <Badge onMouseLeave={handleMouseLeave}>Hoverable</Badge>,
      )

      expect(container.firstChild).toBeInTheDocument()
    })
  })

  describe('Edge Cases', () => {
    it('should handle very long text', () => {
      const longText = 'A'.repeat(100)
      render(<Badge>{longText}</Badge>)
      expect(screen.getByText(longText)).toBeInTheDocument()
    })

    it('should handle special characters', () => {
      render(<Badge>{'<>&"\'`'}</Badge>)
      expect(screen.getByText('<>&"\'`')).toBeInTheDocument()
    })
  })
})
