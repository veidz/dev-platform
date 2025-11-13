import { Separator } from '@/components/ui/separator'
import { render } from '@testing-library/react'

describe('Separator', () => {
  describe('Rendering', () => {
    it('should render separator element', () => {
      const { container } = render(<Separator />)

      const separator = container.querySelector('[data-orientation]')
      expect(separator).toBeInTheDocument()
    })
  })
})
