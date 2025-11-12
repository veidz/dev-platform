import { Switch } from '@/components/ui/switch'
import { render, screen } from '@testing-library/react'

describe('Switch', () => {
  describe('Rendering', () => {
    it('should render switch', () => {
      render(<Switch />)
      const switchElement = screen.getByRole('switch')
      expect(switchElement).toBeInTheDocument()
    })

    it('should render with aria-label', () => {
      render(<Switch aria-label="Toggle feature" />)
      const switchElement = screen.getByRole('switch', {
        name: 'Toggle feature',
      })
      expect(switchElement).toBeInTheDocument()
    })

    it('should render unchecked by default', () => {
      render(<Switch />)
      const switchElement = screen.getByRole('switch')
      expect(switchElement).not.toBeChecked()
    })

    it('should render checked when defaultChecked is true', () => {
      render(<Switch defaultChecked />)
      const switchElement = screen.getByRole('switch')
      expect(switchElement).toBeChecked()
    })

    it('should render with custom className', () => {
      render(<Switch className="custom-class" />)
      const switchElement = screen.getByRole('switch')
      expect(switchElement).toHaveClass('custom-class')
    })

    it('should render with id', () => {
      render(<Switch id="airplane-mode" />)
      const switchElement = screen.getByRole('switch')
      expect(switchElement).toHaveAttribute('id', 'airplane-mode')
    })
  })
})
