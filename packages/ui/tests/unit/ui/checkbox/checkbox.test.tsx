import { Checkbox } from '@/components/ui/checkbox'
import { render, screen } from '@testing-library/react'

describe('Checkbox', () => {
  describe('Rendering', () => {
    it('should render checkbox', () => {
      render(<Checkbox />)
      const checkbox = screen.getByRole('checkbox')
      expect(checkbox).toBeInTheDocument()
    })
  })
})
