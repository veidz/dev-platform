import { Checkbox } from '@/components/ui/checkbox'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

describe('Checkbox', () => {
  describe('Rendering', () => {
    it('should render checkbox', () => {
      render(<Checkbox />)
      const checkbox = screen.getByRole('checkbox')
      expect(checkbox).toBeInTheDocument()
    })

    it('should render with aria-label', () => {
      render(<Checkbox aria-label="Accept terms" />)
      const checkbox = screen.getByRole('checkbox', { name: 'Accept terms' })
      expect(checkbox).toBeInTheDocument()
    })

    it('should render unchecked by default', () => {
      render(<Checkbox />)
      const checkbox = screen.getByRole('checkbox')
      expect(checkbox).not.toBeChecked()
    })

    it('should render checked when defaultChecked is true', () => {
      render(<Checkbox defaultChecked />)
      const checkbox = screen.getByRole('checkbox')
      expect(checkbox).toBeChecked()
    })

    it('should render with custom className', () => {
      render(<Checkbox className="custom-class" />)
      const checkbox = screen.getByRole('checkbox')
      expect(checkbox).toHaveClass('custom-class')
    })

    it('should render with id', () => {
      render(<Checkbox id="terms" />)
      const checkbox = screen.getByRole('checkbox')
      expect(checkbox).toHaveAttribute('id', 'terms')
    })

    it('should associate with label using htmlFor', () => {
      render(
        <>
          <Checkbox id="accept" />
          <label htmlFor="accept">Accept</label>
        </>,
      )
      const checkbox = screen.getByRole('checkbox', { name: 'Accept' })
      expect(checkbox).toBeInTheDocument()
    })
  })

  describe('States', () => {
    it('should be unchecked by default', () => {
      render(<Checkbox />)
      const checkbox = screen.getByRole('checkbox')
      expect(checkbox).toHaveAttribute('data-state', 'unchecked')
    })

    it('should be checked when checked prop is true', () => {
      render(<Checkbox checked />)
      const checkbox = screen.getByRole('checkbox')
      expect(checkbox).toHaveAttribute('data-state', 'checked')
      expect(checkbox).toBeChecked()
    })

    it('should be indeterminate when checked is "indeterminate"', () => {
      render(<Checkbox checked="indeterminate" />)
      const checkbox = screen.getByRole('checkbox')
      expect(checkbox).toHaveAttribute('data-state', 'indeterminate')
      expect(checkbox).toHaveAttribute('aria-checked', 'mixed')
    })

    it('should be disabled when disabled prop is true', () => {
      render(<Checkbox disabled />)
      const checkbox = screen.getByRole('checkbox')
      expect(checkbox).toBeDisabled()
    })

    it('should have disabled attribute', () => {
      render(<Checkbox disabled />)
      const checkbox = screen.getByRole('checkbox')
      expect(checkbox).toHaveAttribute('disabled')
    })

    it('should apply disabled styles', () => {
      render(<Checkbox disabled />)
      const checkbox = screen.getByRole('checkbox')
      expect(checkbox).toHaveClass('disabled:cursor-not-allowed')
      expect(checkbox).toHaveClass('disabled:opacity-50')
    })

    it('should be checked and disabled', () => {
      render(<Checkbox checked disabled />)
      const checkbox = screen.getByRole('checkbox')
      expect(checkbox).toBeChecked()
      expect(checkbox).toBeDisabled()
    })
  })

  describe('User Interactions', () => {
    it('should toggle checked state on click', async () => {
      const user = userEvent.setup()
      render(<Checkbox />)
      const checkbox = screen.getByRole('checkbox')

      expect(checkbox).not.toBeChecked()

      await user.click(checkbox)
      expect(checkbox).toBeChecked()

      await user.click(checkbox)
      expect(checkbox).not.toBeChecked()
    })

    it('should call onCheckedChange when clicked', async () => {
      const user = userEvent.setup()
      const onCheckedChange = jest.fn()
      render(<Checkbox onCheckedChange={onCheckedChange} />)
      const checkbox = screen.getByRole('checkbox')

      await user.click(checkbox)
      expect(onCheckedChange).toHaveBeenCalledTimes(1)
      expect(onCheckedChange).toHaveBeenCalledWith(true)
    })

    it('should call onCheckedChange with false when unchecking', async () => {
      const user = userEvent.setup()
      const onCheckedChange = jest.fn()
      render(<Checkbox defaultChecked onCheckedChange={onCheckedChange} />)
      const checkbox = screen.getByRole('checkbox')

      await user.click(checkbox)
      expect(onCheckedChange).toHaveBeenCalledWith(false)
    })

    it('should not toggle when disabled', async () => {
      const user = userEvent.setup()
      const onCheckedChange = jest.fn()
      render(<Checkbox disabled onCheckedChange={onCheckedChange} />)
      const checkbox = screen.getByRole('checkbox')

      await user.click(checkbox)
      expect(onCheckedChange).not.toHaveBeenCalled()
    })

    it('should toggle on Space key', async () => {
      const user = userEvent.setup()
      render(<Checkbox />)
      const checkbox = screen.getByRole('checkbox')
      checkbox.focus()

      expect(checkbox).not.toBeChecked()

      await user.keyboard(' ')
      expect(checkbox).toBeChecked()

      await user.keyboard(' ')
      expect(checkbox).not.toBeChecked()
    })
  })
})
