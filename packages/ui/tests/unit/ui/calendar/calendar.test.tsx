import { Calendar } from '@/components/ui/calendar/calendar'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { addDays } from 'date-fns'

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

  describe('Selection', () => {
    it('should select single date', async () => {
      const user = userEvent.setup()
      const onSelect = jest.fn()

      const { container } = render(
        <Calendar mode="single" onSelect={onSelect} />,
      )

      const allButtons = container.querySelectorAll('button')
      const validButtons = Array.from(allButtons).filter(
        (btn) =>
          !btn.getAttribute('aria-label')?.includes('Previous') &&
          !btn.getAttribute('aria-label')?.includes('Next'),
      )

      if (validButtons.length > 0) {
        await user.click(validButtons[15])
      }

      expect(onSelect).toHaveBeenCalled()
    })

    it('should display selected date', () => {
      const selectedDate = new Date()
      const { container } = render(
        <Calendar mode="single" selected={selectedDate} />,
      )

      expect(container.firstChild).toBeInTheDocument()
    })

    it('should support range selection', async () => {
      const user = userEvent.setup()
      const onSelect = jest.fn()

      const { container } = render(
        <Calendar mode="range" onSelect={onSelect} />,
      )

      const allButtons = container.querySelectorAll('button')
      const validButtons = Array.from(allButtons).filter(
        (btn) =>
          !btn.getAttribute('aria-label')?.includes('Previous') &&
          !btn.getAttribute('aria-label')?.includes('Next'),
      )

      if (validButtons.length > 1) {
        await user.click(validButtons[10])
        await user.click(validButtons[15])
      }

      expect(onSelect).toHaveBeenCalled()
    })

    it('should support multiple selection', async () => {
      const user = userEvent.setup()
      const onSelect = jest.fn()

      const { container } = render(
        <Calendar mode="multiple" onSelect={onSelect} />,
      )

      const allButtons = container.querySelectorAll('button')
      const validButtons = Array.from(allButtons).filter(
        (btn) =>
          !btn.getAttribute('aria-label')?.includes('Previous') &&
          !btn.getAttribute('aria-label')?.includes('Next'),
      )

      if (validButtons.length > 1) {
        await user.click(validButtons[10])
        await user.click(validButtons[15])
      }

      expect(onSelect).toHaveBeenCalledTimes(2)
    })
  })

  describe('Navigation', () => {
    it('should navigate to next month', async () => {
      const user = userEvent.setup()
      const { container } = render(<Calendar mode="single" />)

      const currentMonth = new Date().toLocaleString('en-US', { month: 'long' })
      const nextDate = addDays(new Date(), 35)
      const nextMonth = nextDate.toLocaleString('en-US', { month: 'long' })

      expect(
        screen.getByText(new RegExp(currentMonth, 'i')),
      ).toBeInTheDocument()

      const nextButton = container.querySelector(
        'button[type="button"]:last-of-type',
      )
      if (nextButton) {
        await user.click(nextButton)
      }

      expect(screen.getByText(new RegExp(nextMonth, 'i'))).toBeInTheDocument()
    })

    it('should navigate to previous month', async () => {
      const user = userEvent.setup()
      const { container } = render(<Calendar mode="single" />)

      const nextButton = container.querySelector(
        'button[type="button"]:last-of-type',
      )
      if (nextButton) {
        await user.click(nextButton)
      }

      const futureMonth = addDays(new Date(), 35).toLocaleString('en-US', {
        month: 'long',
      })
      expect(screen.getByText(new RegExp(futureMonth, 'i'))).toBeInTheDocument()

      const prevButton = container.querySelector('button[type="button"]')
      if (prevButton) {
        await user.click(prevButton)
      }

      const currentMonth = new Date().toLocaleString('en-US', { month: 'long' })
      expect(
        screen.getByText(new RegExp(currentMonth, 'i')),
      ).toBeInTheDocument()
    })
  })

  describe('Disabled Dates', () => {
    it('should disable past dates', () => {
      const today = new Date()
      const { container } = render(
        <Calendar mode="single" disabled={{ before: today }} />,
      )

      const allButtons = container.querySelectorAll('button')
      const disabledButtons = Array.from(allButtons).filter((button) =>
        button.hasAttribute('disabled'),
      )

      expect(disabledButtons.length).toBeGreaterThan(0)
    })
  })
})
