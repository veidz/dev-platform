import { Skeleton } from '@/components/ui/skeleton/skeleton'
import { render } from '@testing-library/react'
import { axe } from 'jest-axe'

describe('Skeleton', () => {
  describe('Rendering', () => {
    it('should render skeleton element', () => {
      const { container } = render(<Skeleton />)
      const skeleton = container.querySelector('div')

      expect(skeleton).toBeInTheDocument()
    })

    it('should render with custom className', () => {
      const { container } = render(<Skeleton className="custom-class" />)
      const skeleton = container.querySelector('div')

      expect(skeleton).toHaveClass('custom-class')
    })

    it('should render multiple skeletons', () => {
      const { container } = render(
        <div data-testid="wrapper">
          <Skeleton />
          <Skeleton />
          <Skeleton />
        </div>,
      )
      const skeletons = container.querySelectorAll(
        '[data-testid="wrapper"] > div',
      )

      expect(skeletons).toHaveLength(3)
    })
  })

  describe('Animation', () => {
    it('should have animate-pulse class', () => {
      const { container } = render(<Skeleton />)
      const skeleton = container.querySelector('div')

      expect(skeleton).toHaveClass('animate-pulse')
    })

    it('should have rounded-md class', () => {
      const { container } = render(<Skeleton />)
      const skeleton = container.querySelector('div')

      expect(skeleton).toHaveClass('rounded-md')
    })

    it('should have bg-muted class', () => {
      const { container } = render(<Skeleton />)
      const skeleton = container.querySelector('div')

      expect(skeleton).toHaveClass('bg-muted')
    })
  })

  describe('Sizing', () => {
    it('should support custom width', () => {
      const { container } = render(<Skeleton className="w-64" />)
      const skeleton = container.querySelector('div')

      expect(skeleton).toHaveClass('w-64')
    })

    it('should support custom height', () => {
      const { container } = render(<Skeleton className="h-32" />)
      const skeleton = container.querySelector('div')

      expect(skeleton).toHaveClass('h-32')
    })

    it('should support custom dimensions', () => {
      const { container } = render(<Skeleton className="h-24 w-24" />)
      const skeleton = container.querySelector('div')

      expect(skeleton).toHaveClass('h-24', 'w-24')
    })
  })

  describe('Composition', () => {
    it('should render card skeleton composition', () => {
      const { container } = render(
        <div data-testid="wrapper">
          <Skeleton className="h-12 w-12 rounded-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-3 w-3/4" />
        </div>,
      )
      const skeletons = container.querySelectorAll(
        '[data-testid="wrapper"] > div',
      )

      expect(skeletons).toHaveLength(3)
      expect(skeletons[0]).toHaveClass('rounded-full')
    })

    it('should render list skeleton composition', () => {
      const { container } = render(
        <div data-testid="wrapper">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-full" />
          ))}
        </div>,
      )
      const skeletons = container.querySelectorAll(
        '[data-testid="wrapper"] > div',
      )

      expect(skeletons).toHaveLength(5)
    })

    it('should render table skeleton composition', () => {
      const { container } = render(
        <div data-testid="wrapper">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>,
      )
      const skeletons = container.querySelectorAll(
        '[data-testid="wrapper"] > div',
      )

      expect(skeletons).toHaveLength(3)
      skeletons.forEach((skeleton) => {
        expect(skeleton).toHaveClass('h-10', 'w-full')
      })
    })
  })

  describe('HTML Attributes', () => {
    it('should support data attributes', () => {
      const { container } = render(<Skeleton data-testid="skeleton-test" />)
      const skeleton = container.querySelector('div')

      expect(skeleton).toHaveAttribute('data-testid', 'skeleton-test')
    })

    it('should support aria-busy attribute', () => {
      const { container } = render(<Skeleton aria-busy="true" />)
      const skeleton = container.querySelector('div')

      expect(skeleton).toHaveAttribute('aria-busy', 'true')
    })

    it('should support role attribute', () => {
      const { container } = render(<Skeleton role="status" />)
      const skeleton = container.querySelector('div')

      expect(skeleton).toHaveAttribute('role', 'status')
    })
  })

  describe('Accessibility', () => {
    it('should have no accessibility violations', async () => {
      const { container } = render(<Skeleton />)
      const results = await axe(container)

      expect(results).toHaveNoViolations()
    })

    it('should have no accessibility violations with role status', async () => {
      const { container } = render(<Skeleton role="status" />)
      const results = await axe(container)

      expect(results).toHaveNoViolations()
    })
  })
})
