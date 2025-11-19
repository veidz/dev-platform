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
  })
})
