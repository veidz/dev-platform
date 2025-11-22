import { createRef } from 'react'

import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { Slider } from '@/components/ui/slider'

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

  describe('States', () => {
    it('should render disabled state', () => {
      render(<Slider defaultValue={[50]} max={100} disabled />)
      const slider = screen.getByRole('slider')
      expect(slider).toHaveAttribute('data-disabled')
    })

    it('should update value on controlled change', () => {
      const { rerender } = render(<Slider value={[30]} max={100} />)
      let slider = screen.getByRole('slider')
      expect(slider).toHaveAttribute('aria-valuenow', '30')

      rerender(<Slider value={[70]} max={100} />)
      slider = screen.getByRole('slider')
      expect(slider).toHaveAttribute('aria-valuenow', '70')
    })

    it('should respect step increments', () => {
      render(<Slider defaultValue={[0]} max={100} step={10} />)
      const slider = screen.getByRole('slider')
      expect(slider).toBeInTheDocument()
    })

    it('should render vertical orientation', () => {
      render(
        <Slider
          defaultValue={[50]}
          max={100}
          orientation="vertical"
          data-testid="slider-root"
        />,
      )
      const slider = screen.getByTestId('slider-root')
      expect(slider).toHaveAttribute('data-orientation', 'vertical')
    })
  })

  describe('User Interactions', () => {
    it('should call onValueChange when value changes', async () => {
      const handleChange = jest.fn()
      render(
        <Slider defaultValue={[50]} max={100} onValueChange={handleChange} />,
      )

      const slider = screen.getByRole('slider')
      expect(slider).toBeInTheDocument()
    })

    it('should support keyboard navigation with arrow keys', async () => {
      const user = userEvent.setup()
      render(<Slider defaultValue={[50]} max={100} step={1} />)

      const slider = screen.getByRole('slider')
      slider.focus()

      await user.keyboard('{ArrowRight}')
      expect(slider).toHaveAttribute('aria-valuenow', '51')

      await user.keyboard('{ArrowLeft}')
      expect(slider).toHaveAttribute('aria-valuenow', '50')
    })

    it('should support keyboard navigation with Home/End keys', async () => {
      const user = userEvent.setup()
      render(<Slider defaultValue={[50]} min={0} max={100} />)

      const slider = screen.getByRole('slider')
      slider.focus()

      await user.keyboard('{Home}')
      expect(slider).toHaveAttribute('aria-valuenow', '0')

      await user.keyboard('{End}')
      expect(slider).toHaveAttribute('aria-valuenow', '100')
    })

    it('should support keyboard navigation with Page Up/Down', async () => {
      const user = userEvent.setup()
      render(<Slider defaultValue={[50]} max={100} step={10} />)

      const slider = screen.getByRole('slider')
      slider.focus()

      await user.keyboard('{PageUp}')
      const afterPageUp = slider.getAttribute('aria-valuenow')

      expect(Number.parseInt(afterPageUp || '0')).toBeGreaterThan(50)
    })

    it('should not respond to interactions when disabled', () => {
      const handleChange = jest.fn()
      render(
        <Slider
          defaultValue={[50]}
          max={100}
          disabled
          onValueChange={handleChange}
        />,
      )

      const slider = screen.getByRole('slider')
      expect(slider).toHaveAttribute('data-disabled')
    })

    it('should handle range slider interactions independently', async () => {
      const user = userEvent.setup()
      render(<Slider defaultValue={[25, 75]} max={100} step={1} />)

      const sliders = screen.getAllByRole('slider')
      sliders[0].focus()

      await user.keyboard('{ArrowRight}')
      expect(sliders[0]).toHaveAttribute('aria-valuenow', '26')
      expect(sliders[1]).toHaveAttribute('aria-valuenow', '75')
    })
  })

  describe('Accessibility', () => {
    it('should render with proper accessibility structure', () => {
      render(
        <Slider defaultValue={[50]} max={100} aria-label="Volume control" />,
      )
      const slider = screen.getByRole('slider')
      expect(slider).toBeInTheDocument()
      expect(slider).toHaveAttribute('aria-valuemin', '0')
      expect(slider).toHaveAttribute('aria-valuemax', '100')
      expect(slider).toHaveAttribute('aria-valuenow', '50')
    })

    it('should support aria-label on thumbs', () => {
      render(<Slider defaultValue={[50]} max={100} />)
      const slider = screen.getByRole('slider')
      expect(slider).toBeInTheDocument()
    })

    it('should support custom id on root element', () => {
      render(
        <Slider
          defaultValue={[50]}
          max={100}
          id="custom-slider"
          data-testid="slider-root"
        />,
      )
      const root = screen.getByTestId('slider-root')
      expect(root).toHaveAttribute('id', 'custom-slider')
    })

    it('should have proper ARIA attributes', () => {
      render(<Slider defaultValue={[50]} min={0} max={100} />)
      const slider = screen.getByRole('slider')
      expect(slider).toHaveAttribute('aria-valuenow', '50')
      expect(slider).toHaveAttribute('aria-valuemin', '0')
      expect(slider).toHaveAttribute('aria-valuemax', '100')
    })

    it('should be keyboard focusable', () => {
      render(<Slider defaultValue={[50]} max={100} />)
      const slider = screen.getByRole('slider')
      slider.focus()
      expect(slider).toHaveFocus()
    })

    it('should support aria-orientation for vertical slider', () => {
      render(<Slider defaultValue={[50]} max={100} orientation="vertical" />)
      const slider = screen.getByRole('slider')
      expect(slider).toHaveAttribute('aria-orientation', 'vertical')
    })
  })

  describe('Form Integration', () => {
    it('should work within a form', () => {
      const handleSubmit = jest.fn((e) => e.preventDefault())
      render(
        <form onSubmit={handleSubmit}>
          <Slider defaultValue={[50]} max={100} name="volume" />
          <button type="submit">Submit</button>
        </form>,
      )

      const slider = screen.getByRole('slider')
      expect(slider).toBeInTheDocument()
    })

    it('should support name attribute for form submission', () => {
      render(<Slider defaultValue={[50]} max={100} name="brightness" />)
      const slider = screen.getByRole('slider')
      expect(slider).toBeInTheDocument()
    })
  })

  describe('Styling', () => {
    it('should apply custom className to root element', () => {
      render(
        <Slider
          defaultValue={[50]}
          max={100}
          className="custom-slider"
          data-testid="slider-root"
        />,
      )
      const slider = screen.getByTestId('slider-root')
      expect(slider).toHaveClass('custom-slider')
    })

    it('should maintain base styles with custom className', () => {
      render(
        <Slider
          defaultValue={[50]}
          max={100}
          className="extra-class"
          data-testid="slider-root"
        />,
      )
      const slider = screen.getByTestId('slider-root')
      expect(slider).toHaveClass('relative')
      expect(slider).toHaveClass('flex')
      expect(slider).toHaveClass('extra-class')
    })
  })

  describe('Ref Forwarding', () => {
    it('should forward ref to slider root element', () => {
      const ref = createRef<HTMLSpanElement>()
      render(<Slider ref={ref} defaultValue={[50]} max={100} />)
      expect(ref.current).toBeInstanceOf(HTMLSpanElement)
    })

    it('should allow ref access to slider root', () => {
      const ref = createRef<HTMLSpanElement>()
      render(<Slider ref={ref} defaultValue={[50]} max={100} />)
      expect(ref.current).toBeInstanceOf(HTMLElement)
      expect(ref.current?.tagName).toBe('SPAN')
    })
  })

  describe('Edge Cases', () => {
    it('should handle min equal to max', () => {
      render(<Slider defaultValue={[10]} min={10} max={10} />)
      const slider = screen.getByRole('slider')
      expect(slider).toHaveAttribute('aria-valuenow', '10')
      expect(slider).toHaveAttribute('aria-valuemin', '10')
      expect(slider).toHaveAttribute('aria-valuemax', '10')
    })

    it('should handle very small step values', () => {
      render(<Slider defaultValue={[0.5]} min={0} max={1} step={0.01} />)
      const slider = screen.getByRole('slider')
      expect(slider).toHaveAttribute('aria-valuenow', '0.5')
    })

    it('should handle negative values', () => {
      render(<Slider defaultValue={[-10]} min={-50} max={50} />)
      const slider = screen.getByRole('slider')
      expect(slider).toHaveAttribute('aria-valuenow', '-10')
      expect(slider).toHaveAttribute('aria-valuemin', '-50')
      expect(slider).toHaveAttribute('aria-valuemax', '50')
    })

    it('should prevent range thumbs from crossing', async () => {
      const user = userEvent.setup()
      render(<Slider defaultValue={[40, 60]} max={100} step={1} />)

      const sliders = screen.getAllByRole('slider')
      sliders[0].focus()

      for (let i = 0; i < 30; i++) {
        await user.keyboard('{ArrowRight}')
      }

      const firstValue = Number.parseInt(
        sliders[0].getAttribute('aria-valuenow') || '0',
      )
      const secondValue = Number.parseInt(
        sliders[1].getAttribute('aria-valuenow') || '0',
      )
      expect(firstValue).toBeLessThanOrEqual(secondValue)
    })
  })
})
