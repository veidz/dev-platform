import { Badge } from '@/components/ui/badge'
import { render, screen } from '@testing-library/react'

describe('Badge', () => {
  describe('Rendering', () => {
    it('should render with children', () => {
      render(<Badge>Test Badge</Badge>)
      expect(screen.getByText('Test Badge')).toBeInTheDocument()
    })
  })
})
