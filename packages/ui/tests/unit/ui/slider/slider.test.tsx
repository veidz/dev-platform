import { Slider } from '@/components/ui/slider'
import { render, screen } from '@testing-library/react'

describe('Slider', () => {
  describe('Rendering', () => {
    it('should render slider with default value', () => {
      render(<Slider defaultValue={[50]} max={100} />)
      const slider = screen.getByRole('slider')
      expect(slider).toBeInTheDocument()
      expect(slider).toHaveAttribute('aria-valuenow', '50')
    })
  })
})
