import { Skeleton } from '@/components/ui/skeleton/skeleton'
import { render } from '@testing-library/react'

describe('Skeleton', () => {
  describe('Rendering', () => {
    it('should render skeleton element', () => {
      const { container } = render(<Skeleton />)
      const skeleton = container.querySelector('div')

      expect(skeleton).toBeInTheDocument()
    })
  })
})
