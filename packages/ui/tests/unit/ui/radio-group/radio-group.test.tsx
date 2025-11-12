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
  })
})
