import { Calendar } from '@/components/ui/calendar/calendar'
import { render, screen } from '@testing-library/react'

describe('Calendar', () => {
  describe('Rendering', () => {
    it('should render calendar component', () => {
      const { container } = render(<Calendar mode="single" />)
      const calendar = container.firstChild

      expect(calendar).toBeInTheDocument()
    })

    it('should render with custom className', () => {
      const { container } = render(
        <Calendar mode="single" className="custom-class" />,
      )

      expect(container.firstChild).toHaveClass('custom-class')
    })

    it('should render current month by default', () => {
      render(<Calendar mode="single" />)
      const currentMonth = new Date().toLocaleString('en-US', { month: 'long' })

      expect(
        screen.getByText(new RegExp(currentMonth, 'i')),
      ).toBeInTheDocument()
    })

    it('should render weekday headers', () => {
      render(<Calendar mode="single" />)

      expect(screen.getByText('Su')).toBeInTheDocument()
      expect(screen.getByText('Mo')).toBeInTheDocument()
      expect(screen.getByText('Tu')).toBeInTheDocument()
      expect(screen.getByText('We')).toBeInTheDocument()
      expect(screen.getByText('Th')).toBeInTheDocument()
      expect(screen.getByText('Fr')).toBeInTheDocument()
      expect(screen.getByText('Sa')).toBeInTheDocument()
    })

    it('should render navigation buttons', () => {
      const { container } = render(<Calendar mode="single" />)
      const buttons = container.querySelectorAll('button[type="button"]')

      expect(buttons.length).toBeGreaterThan(0)
    })
  })
})
