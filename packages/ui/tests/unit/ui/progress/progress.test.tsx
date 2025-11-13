import { Progress } from '@/components/ui/progress'
import { render, screen } from '@testing-library/react'

describe('Progress', () => {
  describe('Rendering', () => {
    it('should render progress bar', () => {
      render(<Progress value={50} />)

      const progressBar = screen.getByRole('progressbar')
      expect(progressBar).toBeInTheDocument()
    })

    it('should render with default value of 0', () => {
      render(<Progress />)

      const progressBar = screen.getByRole('progressbar')
      expect(progressBar).toHaveAttribute('aria-valuenow', '0')
    })

    it('should render with custom className', () => {
      render(<Progress value={50} className="custom-class" />)

      const progressBar = screen.getByRole('progressbar')
      expect(progressBar).toHaveClass('custom-class')
    })

    it('should render indicator element', () => {
      const { container } = render(<Progress value={50} />)

      const indicator = container.querySelector('[data-state]')
      expect(indicator).toBeInTheDocument()
    })
  })

  describe('Value Updates', () => {
    it('should display correct value', () => {
      render(<Progress value={33} />)

      const progressBar = screen.getByRole('progressbar')
      expect(progressBar).toHaveAttribute('aria-valuenow', '33')
    })

    it('should update value when prop changes', () => {
      const { rerender } = render(<Progress value={25} />)

      let progressBar = screen.getByRole('progressbar')
      expect(progressBar).toHaveAttribute('aria-valuenow', '25')

      rerender(<Progress value={75} />)

      progressBar = screen.getByRole('progressbar')
      expect(progressBar).toHaveAttribute('aria-valuenow', '75')
    })

    it('should handle 0% value', () => {
      render(<Progress value={0} />)

      const progressBar = screen.getByRole('progressbar')
      expect(progressBar).toHaveAttribute('aria-valuenow', '0')
    })

    it('should handle 100% value', () => {
      render(<Progress value={100} />)

      const progressBar = screen.getByRole('progressbar')
      expect(progressBar).toHaveAttribute('aria-valuenow', '100')
    })

    it('should handle decimal values', () => {
      render(<Progress value={33.33} />)

      const progressBar = screen.getByRole('progressbar')
      expect(progressBar).toHaveAttribute('aria-valuenow', '33.33')
    })
  })

  describe('Max Prop', () => {
    it('should have default max of 100', () => {
      render(<Progress value={50} />)

      const progressBar = screen.getByRole('progressbar')
      expect(progressBar).toHaveAttribute('aria-valuemax', '100')
    })

    it('should accept custom max value', () => {
      render(<Progress value={50} max={200} />)

      const progressBar = screen.getByRole('progressbar')
      expect(progressBar).toHaveAttribute('aria-valuemax', '200')
    })

    it('should calculate percentage correctly with custom max', () => {
      render(<Progress value={25} max={50} />)

      const progressBar = screen.getByRole('progressbar')
      expect(progressBar).toHaveAttribute('aria-valuenow', '25')
      expect(progressBar).toHaveAttribute('aria-valuemax', '50')
    })
  })

  describe('Indeterminate State', () => {
    it('should handle null value for indeterminate state', () => {
      render(<Progress value={null} />)

      const progressBar = screen.getByRole('progressbar')
      expect(progressBar).toBeInTheDocument()
    })

    it('should not have aria-valuenow when indeterminate', () => {
      render(<Progress value={null} />)

      const progressBar = screen.getByRole('progressbar')
      expect(progressBar).not.toHaveAttribute('aria-valuenow')
    })

    it('should have correct data-state when indeterminate', () => {
      const { container } = render(<Progress value={null} />)

      const indicator = container.querySelector('[data-state="indeterminate"]')
      expect(indicator).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('should have progressbar role', () => {
      render(<Progress value={50} />)

      const progressBar = screen.getByRole('progressbar')
      expect(progressBar).toBeInTheDocument()
    })
  })
})
