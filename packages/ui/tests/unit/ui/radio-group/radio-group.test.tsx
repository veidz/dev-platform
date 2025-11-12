import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { render, screen } from '@testing-library/react'

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
  })
})
