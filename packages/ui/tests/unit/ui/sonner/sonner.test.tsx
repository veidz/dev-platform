import { Toaster } from '@/components/ui/sonner/sonner'
import { render } from '@testing-library/react'

describe('Sonner', () => {
  describe('Rendering', () => {
    it('should render Toaster component without errors', () => {
      const { container } = render(<Toaster />)
      expect(container).toBeInTheDocument()
    })
  })
})
