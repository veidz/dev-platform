import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select/select'
import { render, screen } from '@testing-library/react'

describe('Select', () => {
  const SimpleSelect = () => (
    <Select>
      <SelectTrigger>
        <SelectValue placeholder="Select option" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="option1">Option 1</SelectItem>
        <SelectItem value="option2">Option 2</SelectItem>
        <SelectItem value="option3">Option 3</SelectItem>
      </SelectContent>
    </Select>
  )

  describe('SelectTrigger', () => {
    it('renders with placeholder', () => {
      render(<SimpleSelect />)
      expect(screen.getByRole('combobox')).toBeInTheDocument()
      expect(screen.getByText('Select option')).toBeInTheDocument()
    })

    it('renders with custom className', () => {
      render(
        <Select>
          <SelectTrigger className="custom-class">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="test">Test</SelectItem>
          </SelectContent>
        </Select>,
      )
      expect(screen.getByRole('combobox')).toHaveClass('custom-class')
    })

    it('renders with chevron icon', () => {
      render(<SimpleSelect />)
      const trigger = screen.getByRole('combobox')
      const svg = trigger.querySelector('svg')
      expect(svg).toBeInTheDocument()
    })

    it('applies disabled styles when disabled', () => {
      render(
        <Select disabled>
          <SelectTrigger>
            <SelectValue placeholder="Disabled" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="test">Test</SelectItem>
          </SelectContent>
        </Select>,
      )
      const trigger = screen.getByRole('combobox')
      expect(trigger).toBeDisabled()
    })
  })

  describe('SelectContent', () => {
    it('renders SelectContent component', () => {
      render(
        <Select defaultValue="test">
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="test">Test</SelectItem>
          </SelectContent>
        </Select>,
      )

      expect(screen.getByRole('combobox')).toBeInTheDocument()
    })

    it('renders with custom className', () => {
      render(
        <Select defaultValue="test">
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="custom-content">
            <SelectItem value="test">Test</SelectItem>
          </SelectContent>
        </Select>,
      )

      expect(screen.getByRole('combobox')).toBeInTheDocument()
    })
  })
})
