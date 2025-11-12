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
  })
})
