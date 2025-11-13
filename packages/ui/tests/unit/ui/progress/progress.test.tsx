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
  })
})
