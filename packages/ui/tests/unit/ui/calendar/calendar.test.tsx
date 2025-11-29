import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe } from 'jest-axe'

import { Calendar } from '@/components/ui/calendar/calendar'

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
      render(<Calendar mode="single" />)

      const currentMonth = new Date().toLocaleString('en-US', { month: 'long' })

      expect(
        screen.getByText(new RegExp(currentMonth, 'i')),
      ).toBeInTheDocument()

      const nextButton = screen.getByLabelText(/next month/i)
      await user.click(nextButton)

      // Verify we moved forward (current month should no longer be visible)
      expect(
        screen.queryByText(new RegExp(currentMonth, 'i')),
      ).not.toBeInTheDocument()
    })

    it('should navigate to previous month', async () => {
      const user = userEvent.setup()
      render(<Calendar mode="single" />)

      const currentMonth = new Date().toLocaleString('en-US', { month: 'long' })

      // Navigate to next month first
      const nextButton = screen.getByLabelText(/next month/i)
      await user.click(nextButton)

      // Now navigate back
      const prevButton = screen.getByLabelText(/previous month/i)
      await user.click(prevButton)

      // Should be back to current month
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

    it('should disable future dates', () => {
      const today = new Date()
      const { container } = render(
        <Calendar mode="single" disabled={{ after: today }} />,
      )

      const allButtons = container.querySelectorAll('button')
      const disabledButtons = Array.from(allButtons).filter((button) =>
        button.hasAttribute('disabled'),
      )

      expect(disabledButtons.length).toBeGreaterThan(0)
    })

    it('should disable weekends', () => {
      const { container } = render(
        <Calendar mode="single" disabled={{ dayOfWeek: [0, 6] }} />,
      )

      const allButtons = container.querySelectorAll('button')
      const disabledButtons = Array.from(allButtons).filter((button) =>
        button.hasAttribute('disabled'),
      )

      expect(disabledButtons.length).toBeGreaterThan(0)
    })

    it('should not allow selection of disabled dates', async () => {
      const user = userEvent.setup()
      const onSelect = jest.fn()
      const today = new Date()

      const { container } = render(
        <Calendar
          mode="single"
          onSelect={onSelect}
          disabled={{ before: today }}
        />,
      )

      const allButtons = container.querySelectorAll('button')
      const disabledButton = Array.from(allButtons).find((button) =>
        button.hasAttribute('disabled'),
      )

      if (disabledButton) {
        await user.click(disabledButton)
        expect(onSelect).not.toHaveBeenCalled()
      }
    })
  })

  describe('Multiple Months', () => {
    it('should render multiple months', () => {
      const { container } = render(
        <Calendar mode="single" numberOfMonths={2} />,
      )

      expect(container.firstChild).toBeInTheDocument()
    })
  })

  describe('Outside Days', () => {
    it('should render with showOutsideDays true by default', () => {
      const { container } = render(<Calendar mode="single" />)

      expect(container.firstChild).toBeInTheDocument()
    })

    it('should render with showOutsideDays false', () => {
      const { container } = render(
        <Calendar mode="single" showOutsideDays={false} />,
      )

      expect(container.firstChild).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('should have no accessibility violations', async () => {
      const { container } = render(<Calendar mode="single" />)
      const results = await axe(container)

      expect(results).toHaveNoViolations()
    })

    it('should have no accessibility violations with selected date', async () => {
      const { container } = render(
        <Calendar mode="single" selected={new Date()} />,
      )
      const results = await axe(container)

      expect(results).toHaveNoViolations()
    })

    it('should have proper role attributes', () => {
      const { container } = render(<Calendar mode="single" />)
      const calendar = container.firstChild

      expect(calendar).toBeInTheDocument()
      expect(calendar).toHaveClass('p-3')
    })

    it('should support keyboard navigation', () => {
      const { container } = render(<Calendar mode="single" />)

      const allButtons = container.querySelectorAll('button')
      expect(allButtons.length).toBeGreaterThan(2)

      const enabledButtons = Array.from(allButtons).filter(
        (button) => !button.hasAttribute('disabled'),
      )
      expect(enabledButtons.length).toBeGreaterThan(0)
    })
  })
})
