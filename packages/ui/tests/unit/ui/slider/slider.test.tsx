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

    it('should render range slider with two thumbs', () => {
      render(<Slider defaultValue={[25, 75]} max={100} />)
      const sliders = screen.getAllByRole('slider')
      expect(sliders).toHaveLength(2)
      expect(sliders[0]).toHaveAttribute('aria-valuenow', '25')
      expect(sliders[1]).toHaveAttribute('aria-valuenow', '75')
    })

    it('should render with custom className', () => {
      render(
        <Slider
          defaultValue={[50]}
          max={100}
          className="custom-class"
          data-testid="slider-root"
        />,
      )
      const slider = screen.getByTestId('slider-root')
      expect(slider).toHaveClass('custom-class')
    })

    it('should render with min and max attributes', () => {
      render(<Slider defaultValue={[20]} min={10} max={50} />)
      const slider = screen.getByRole('slider')
      expect(slider).toHaveAttribute('aria-valuemin', '10')
      expect(slider).toHaveAttribute('aria-valuemax', '50')
    })
  })
})
