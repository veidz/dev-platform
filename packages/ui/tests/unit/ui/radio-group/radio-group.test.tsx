import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

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
  })
})
