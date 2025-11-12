import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe } from 'jest-axe'
import { useState } from 'react'

describe('RadioGroup', () => {
  describe('Rendering', () => {
    it('should render radio group', () => {
      render(
        <RadioGroup>
          <RadioGroupItem value="option-1" />
        </RadioGroup>,
      )
      const radioGroup = screen.getByRole('radiogroup')
      expect(radioGroup).toBeInTheDocument()
    })

    it('should render multiple radio items', () => {
      render(
        <RadioGroup>
          <RadioGroupItem value="option-1" id="opt-1" />
          <RadioGroupItem value="option-2" id="opt-2" />
          <RadioGroupItem value="option-3" id="opt-3" />
        </RadioGroup>,
      )
      const radios = screen.getAllByRole('radio')
      expect(radios).toHaveLength(3)
    })

    it('should render with default value', () => {
      render(
        <RadioGroup defaultValue="option-2">
          <RadioGroupItem value="option-1" />
          <RadioGroupItem value="option-2" />
          <RadioGroupItem value="option-3" />
        </RadioGroup>,
      )
      const radios = screen.getAllByRole('radio')
      expect(radios[1]).toBeChecked()
      expect(radios[0]).not.toBeChecked()
      expect(radios[2]).not.toBeChecked()
    })

    it('should render with labels', () => {
      render(
        <RadioGroup>
          <div>
            <RadioGroupItem value="option-1" id="opt1" />
            <label htmlFor="opt1">Option 1</label>
          </div>
          <div>
            <RadioGroupItem value="option-2" id="opt2" />
            <label htmlFor="opt2">Option 2</label>
          </div>
        </RadioGroup>,
      )
      expect(screen.getByLabelText('Option 1')).toBeInTheDocument()
      expect(screen.getByLabelText('Option 2')).toBeInTheDocument()
    })

    it('should render with custom className', () => {
      render(
        <RadioGroup className="custom-class">
          <RadioGroupItem value="option-1" />
        </RadioGroup>,
      )
      const radioGroup = screen.getByRole('radiogroup')
      expect(radioGroup).toHaveClass('custom-class')
    })

    it('should render radio item with custom className', () => {
      render(
        <RadioGroup>
          <RadioGroupItem value="option-1" className="custom-item" />
        </RadioGroup>,
      )
      const radio = screen.getByRole('radio')
      expect(radio).toHaveClass('custom-item')
    })
  })

  describe('States', () => {
    it('should have only one radio checked at a time', async () => {
      const user = userEvent.setup()
      render(
        <RadioGroup>
          <RadioGroupItem value="option-1" aria-label="Option 1" />
          <RadioGroupItem value="option-2" aria-label="Option 2" />
          <RadioGroupItem value="option-3" aria-label="Option 3" />
        </RadioGroup>,
      )
      const radio1 = screen.getByLabelText('Option 1')
      const radio2 = screen.getByLabelText('Option 2')
      const radio3 = screen.getByLabelText('Option 3')

      await user.click(radio1)
      expect(radio1).toBeChecked()
      expect(radio2).not.toBeChecked()
      expect(radio3).not.toBeChecked()

      await user.click(radio2)
      expect(radio1).not.toBeChecked()
      expect(radio2).toBeChecked()
      expect(radio3).not.toBeChecked()
    })

    it('should be disabled when RadioGroup is disabled', () => {
      render(
        <RadioGroup disabled>
          <RadioGroupItem value="option-1" aria-label="Option 1" />
          <RadioGroupItem value="option-2" aria-label="Option 2" />
        </RadioGroup>,
      )
      const radios = screen.getAllByRole('radio')
      radios.forEach((radio) => {
        expect(radio).toBeDisabled()
      })
    })

    it('should disable individual radio item', () => {
      render(
        <RadioGroup>
          <RadioGroupItem value="option-1" aria-label="Option 1" />
          <RadioGroupItem value="option-2" aria-label="Option 2" disabled />
        </RadioGroup>,
      )
      const radio1 = screen.getByLabelText('Option 1')
      const radio2 = screen.getByLabelText('Option 2')
      expect(radio1).not.toBeDisabled()
      expect(radio2).toBeDisabled()
    })

    it('should apply disabled styles', () => {
      render(
        <RadioGroup>
          <RadioGroupItem value="option-1" disabled aria-label="Option 1" />
        </RadioGroup>,
      )
      const radio = screen.getByLabelText('Option 1')
      expect(radio).toHaveClass('disabled:cursor-not-allowed')
      expect(radio).toHaveClass('disabled:opacity-50')
    })

    it('should accept required prop', () => {
      render(
        <RadioGroup required>
          <RadioGroupItem value="option-1" aria-label="Option 1" />
        </RadioGroup>,
      )
      const radioGroup = screen.getByRole('radiogroup')
      expect(radioGroup).toBeInTheDocument()
    })
  })

  describe('User Interactions', () => {
    it('should select radio on click', async () => {
      const user = userEvent.setup()
      render(
        <RadioGroup>
          <RadioGroupItem value="option-1" aria-label="Option 1" />
          <RadioGroupItem value="option-2" aria-label="Option 2" />
        </RadioGroup>,
      )
      const radio1 = screen.getByLabelText('Option 1')

      expect(radio1).not.toBeChecked()

      await user.click(radio1)
      expect(radio1).toBeChecked()
    })

    it('should call onValueChange when selection changes', async () => {
      const user = userEvent.setup()
      const onValueChange = jest.fn()
      render(
        <RadioGroup onValueChange={onValueChange}>
          <RadioGroupItem value="option-1" aria-label="Option 1" />
          <RadioGroupItem value="option-2" aria-label="Option 2" />
        </RadioGroup>,
      )
      const radio1 = screen.getByLabelText('Option 1')
      const radio2 = screen.getByLabelText('Option 2')

      await user.click(radio1)
      expect(onValueChange).toHaveBeenCalledWith('option-1')

      await user.click(radio2)
      expect(onValueChange).toHaveBeenCalledWith('option-2')
      expect(onValueChange).toHaveBeenCalledTimes(2)
    })

    it('should not call onValueChange when disabled', async () => {
      const user = userEvent.setup()
      const onValueChange = jest.fn()
      render(
        <RadioGroup onValueChange={onValueChange} disabled>
          <RadioGroupItem value="option-1" aria-label="Option 1" />
        </RadioGroup>,
      )
      const radio = screen.getByLabelText('Option 1')

      await user.click(radio)
      expect(onValueChange).not.toHaveBeenCalled()
    })

    it('should navigate with arrow keys', async () => {
      const user = userEvent.setup()
      render(
        <RadioGroup>
          <RadioGroupItem value="option-1" aria-label="Option 1" />
          <RadioGroupItem value="option-2" aria-label="Option 2" />
          <RadioGroupItem value="option-3" aria-label="Option 3" />
        </RadioGroup>,
      )
      const radio1 = screen.getByLabelText('Option 1')
      const radio2 = screen.getByLabelText('Option 2')
      const radio3 = screen.getByLabelText('Option 3')

      radio1.focus()
      await user.keyboard('{ArrowDown}')
      expect(radio2).toHaveFocus()

      await user.keyboard('{ArrowDown}')
      expect(radio3).toHaveFocus()

      await user.keyboard('{ArrowUp}')
      expect(radio2).toHaveFocus()
    })

    it('should select with Space key', async () => {
      const user = userEvent.setup()
      render(
        <RadioGroup>
          <RadioGroupItem value="option-1" aria-label="Option 1" />
          <RadioGroupItem value="option-2" aria-label="Option 2" />
        </RadioGroup>,
      )
      const radio1 = screen.getByLabelText('Option 1')

      radio1.focus()
      await user.keyboard(' ')
      expect(radio1).toBeChecked()
    })

    it('should work with controlled state', async () => {
      const user = userEvent.setup()
      const ControlledRadioGroup = () => {
        const [value, setValue] = useState('option-1')
        return (
          <RadioGroup value={value} onValueChange={setValue}>
            <RadioGroupItem value="option-1" aria-label="Option 1" />
            <RadioGroupItem value="option-2" aria-label="Option 2" />
            <RadioGroupItem value="option-3" aria-label="Option 3" />
          </RadioGroup>
        )
      }

      render(<ControlledRadioGroup />)
      const radio1 = screen.getByLabelText('Option 1')
      const radio2 = screen.getByLabelText('Option 2')

      expect(radio1).toBeChecked()

      await user.click(radio2)
      expect(radio2).toBeChecked()
      expect(radio1).not.toBeChecked()
    })

    it('should not unselect when clicking selected radio', async () => {
      const user = userEvent.setup()
      render(
        <RadioGroup defaultValue="option-1">
          <RadioGroupItem value="option-1" aria-label="Option 1" />
        </RadioGroup>,
      )
      const radio = screen.getByLabelText('Option 1')

      expect(radio).toBeChecked()

      await user.click(radio)
      expect(radio).toBeChecked()
    })
  })

  describe('Accessibility', () => {
    it('should have role="radiogroup"', () => {
      render(
        <RadioGroup>
          <RadioGroupItem value="option-1" />
        </RadioGroup>,
      )
      const radioGroup = screen.getByRole('radiogroup')
      expect(radioGroup).toHaveAttribute('role', 'radiogroup')
    })

    it('should have role="radio" for each item', () => {
      render(
        <RadioGroup>
          <RadioGroupItem value="option-1" />
          <RadioGroupItem value="option-2" />
        </RadioGroup>,
      )
      const radios = screen.getAllByRole('radio')
      radios.forEach((radio) => {
        expect(radio).toHaveAttribute('role', 'radio')
      })
    })

    it('should have aria-checked attribute', () => {
      render(
        <RadioGroup defaultValue="option-2">
          <RadioGroupItem value="option-1" aria-label="Option 1" />
          <RadioGroupItem value="option-2" aria-label="Option 2" />
        </RadioGroup>,
      )
      const radio1 = screen.getByLabelText('Option 1')
      const radio2 = screen.getByLabelText('Option 2')

      expect(radio1).toHaveAttribute('aria-checked', 'false')
      expect(radio2).toHaveAttribute('aria-checked', 'true')
    })

    it('should have aria-disabled when disabled', () => {
      render(
        <RadioGroup>
          <RadioGroupItem value="option-1" disabled aria-label="Option 1" />
        </RadioGroup>,
      )
      const radio = screen.getByLabelText('Option 1')
      expect(radio).toHaveAttribute('disabled')
    })

    it('should be keyboard accessible', async () => {
      const user = userEvent.setup()
      render(
        <RadioGroup>
          <RadioGroupItem value="option-1" aria-label="Option 1" />
          <RadioGroupItem value="option-2" aria-label="Option 2" />
        </RadioGroup>,
      )
      const radio1 = screen.getByLabelText('Option 1')

      await user.tab()
      expect(radio1).toHaveFocus()
    })

    it('should not have accessibility violations', async () => {
      const { container } = render(
        <RadioGroup>
          <div>
            <RadioGroupItem value="option-1" id="test1" />
            <label htmlFor="test1">Test Label 1</label>
          </div>
          <div>
            <RadioGroupItem value="option-2" id="test2" />
            <label htmlFor="test2">Test Label 2</label>
          </div>
        </RadioGroup>,
      )
      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })
  })
})
