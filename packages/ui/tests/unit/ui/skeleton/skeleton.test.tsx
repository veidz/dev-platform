import { Skeleton } from '@/components/ui/skeleton/skeleton'
import { render } from '@testing-library/react'

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
})
