import { Calendar } from '@/components/ui/calendar/calendar'
import { render } from '@testing-library/react'

describe('Calendar', () => {
  describe('Rendering', () => {
    it('should render calendar component', () => {
      const { container } = render(<Calendar mode="single" />)
      const calendar = container.firstChild

      expect(calendar).toBeInTheDocument()
    })
  })
})
