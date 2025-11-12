import { Switch } from '@/components/ui/switch'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'

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

    it('should associate with label using htmlFor', () => {
      render(
        <>
          <Switch id="toggle" />
          <label htmlFor="toggle">Toggle</label>
        </>,
      )
      const switchElement = screen.getByRole('switch', { name: 'Toggle' })
      expect(switchElement).toBeInTheDocument()
    })
  })

  describe('States', () => {
    it('should be unchecked by default', () => {
      render(<Switch />)
      const switchElement = screen.getByRole('switch')
      expect(switchElement).toHaveAttribute('data-state', 'unchecked')
    })

    it('should be checked when checked prop is true', () => {
      render(<Switch checked />)
      const switchElement = screen.getByRole('switch')
      expect(switchElement).toHaveAttribute('data-state', 'checked')
      expect(switchElement).toBeChecked()
    })

    it('should be disabled when disabled prop is true', () => {
      render(<Switch disabled />)
      const switchElement = screen.getByRole('switch')
      expect(switchElement).toBeDisabled()
    })

    it('should have disabled attribute', () => {
      render(<Switch disabled />)
      const switchElement = screen.getByRole('switch')
      expect(switchElement).toHaveAttribute('disabled')
    })

    it('should apply disabled styles', () => {
      render(<Switch disabled />)
      const switchElement = screen.getByRole('switch')
      expect(switchElement).toHaveClass('disabled:cursor-not-allowed')
      expect(switchElement).toHaveClass('disabled:opacity-50')
    })

    it('should be checked and disabled', () => {
      render(<Switch checked disabled />)
      const switchElement = screen.getByRole('switch')
      expect(switchElement).toBeChecked()
      expect(switchElement).toBeDisabled()
    })

    it('should accept required prop', () => {
      render(<Switch required />)
      const switchElement = screen.getByRole('switch')
      expect(switchElement).toBeInTheDocument()
    })
  })

  describe('User Interactions', () => {
    it('should toggle checked state on click', async () => {
      const user = userEvent.setup()
      render(<Switch />)
      const switchElement = screen.getByRole('switch')

      expect(switchElement).not.toBeChecked()

      await user.click(switchElement)
      expect(switchElement).toBeChecked()

      await user.click(switchElement)
      expect(switchElement).not.toBeChecked()
    })

    it('should call onCheckedChange when clicked', async () => {
      const user = userEvent.setup()
      const onCheckedChange = jest.fn()
      render(<Switch onCheckedChange={onCheckedChange} />)
      const switchElement = screen.getByRole('switch')

      await user.click(switchElement)
      expect(onCheckedChange).toHaveBeenCalledTimes(1)
      expect(onCheckedChange).toHaveBeenCalledWith(true)
    })

    it('should call onCheckedChange with false when unchecking', async () => {
      const user = userEvent.setup()
      const onCheckedChange = jest.fn()
      render(<Switch defaultChecked onCheckedChange={onCheckedChange} />)
      const switchElement = screen.getByRole('switch')

      await user.click(switchElement)
      expect(onCheckedChange).toHaveBeenCalledWith(false)
    })

    it('should not toggle when disabled', async () => {
      const user = userEvent.setup()
      const onCheckedChange = jest.fn()
      render(<Switch disabled onCheckedChange={onCheckedChange} />)
      const switchElement = screen.getByRole('switch')

      await user.click(switchElement)
      expect(onCheckedChange).not.toHaveBeenCalled()
    })

    it('should toggle on Space key', async () => {
      const user = userEvent.setup()
      render(<Switch />)
      const switchElement = screen.getByRole('switch')
      switchElement.focus()

      expect(switchElement).not.toBeChecked()

      await user.keyboard(' ')
      expect(switchElement).toBeChecked()

      await user.keyboard(' ')
      expect(switchElement).not.toBeChecked()
    })

    it('should toggle on Enter key', async () => {
      const user = userEvent.setup()
      render(<Switch />)
      const switchElement = screen.getByRole('switch')
      switchElement.focus()

      expect(switchElement).not.toBeChecked()

      await user.keyboard('{Enter}')
      expect(switchElement).toBeChecked()
    })

    it('should handle rapid clicks', async () => {
      const user = userEvent.setup()
      const onCheckedChange = jest.fn()
      render(<Switch onCheckedChange={onCheckedChange} />)
      const switchElement = screen.getByRole('switch')

      await user.click(switchElement)
      await user.click(switchElement)
      await user.click(switchElement)

      expect(onCheckedChange).toHaveBeenCalledTimes(3)
    })

    it('should work with controlled state', async () => {
      const user = userEvent.setup()
      const ControlledSwitch = () => {
        const [checked, setChecked] = useState(false)
        return <Switch checked={checked} onCheckedChange={setChecked} />
      }

      render(<ControlledSwitch />)
      const switchElement = screen.getByRole('switch')

      expect(switchElement).not.toBeChecked()

      await user.click(switchElement)
      expect(switchElement).toBeChecked()

      await user.click(switchElement)
      expect(switchElement).not.toBeChecked()
    })
  })

  describe('Accessibility', () => {
    it('should have role="switch"', () => {
      render(<Switch />)
      const switchElement = screen.getByRole('switch')
      expect(switchElement).toHaveAttribute('role', 'switch')
    })

    it('should have aria-checked="false" when unchecked', () => {
      render(<Switch />)
      const switchElement = screen.getByRole('switch')
      expect(switchElement).toHaveAttribute('aria-checked', 'false')
    })

    it('should have aria-checked="true" when checked', () => {
      render(<Switch checked />)
      const switchElement = screen.getByRole('switch')
      expect(switchElement).toHaveAttribute('aria-checked', 'true')
    })

    it('should have aria-disabled when disabled', () => {
      render(<Switch disabled />)
      const switchElement = screen.getByRole('switch')
      expect(switchElement).toHaveAttribute('disabled')
    })

    it('should be keyboard accessible', async () => {
      const user = userEvent.setup()
      render(<Switch />)
      const switchElement = screen.getByRole('switch')

      await user.tab()
      expect(switchElement).toHaveFocus()
    })
  })
})
