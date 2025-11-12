import { Switch } from '@/components/ui/switch'
import { render, screen } from '@testing-library/react'

describe('Switch', () => {
  describe('Rendering', () => {
    it('should render switch', () => {
      render(<Switch />)
      const switchElement = screen.getByRole('switch')
      expect(switchElement).toBeInTheDocument()
    })
  })
})
