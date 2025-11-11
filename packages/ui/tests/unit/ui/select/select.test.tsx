import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select/select'
import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'

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

  describe('SelectItem', () => {
    it('renders with custom className', () => {
      render(
        <Select defaultValue="test">
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="test" className="custom-item">
              Test
            </SelectItem>
          </SelectContent>
        </Select>,
      )

      expect(screen.getByRole('combobox')).toBeInTheDocument()
    })

    it('renders disabled item', () => {
      render(
        <Select defaultValue="enabled">
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="enabled">Enabled</SelectItem>
            <SelectItem value="disabled" disabled>
              Disabled
            </SelectItem>
          </SelectContent>
        </Select>,
      )

      expect(screen.getByRole('combobox')).toBeInTheDocument()
    })
  })

  describe('SelectValue', () => {
    it('renders placeholder when no value selected', () => {
      render(<SimpleSelect />)
      expect(screen.getByText('Select option')).toBeInTheDocument()
    })

    it('renders selected value', async () => {
      const user = userEvent.setup()
      render(<SimpleSelect />)

      await user.click(screen.getByRole('combobox'))
      await user.click(screen.getByText('Option 1'))

      expect(screen.getByRole('combobox')).toHaveTextContent('Option 1')
    })

    it('renders with default value', () => {
      render(
        <Select defaultValue="option2">
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="option1">Option 1</SelectItem>
            <SelectItem value="option2">Option 2</SelectItem>
          </SelectContent>
        </Select>,
      )
      expect(screen.getByRole('combobox')).toHaveTextContent('Option 2')
    })
  })

  describe('SelectGroup and SelectLabel', () => {
    it('renders group with label', () => {
      render(
        <Select defaultValue="apple">
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Fruits</SelectLabel>
              <SelectItem value="apple">Apple</SelectItem>
              <SelectItem value="banana">Banana</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>,
      )

      expect(screen.getByRole('combobox')).toBeInTheDocument()
    })

    it('renders label with custom className', () => {
      render(
        <Select defaultValue="test">
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel className="custom-label">Label</SelectLabel>
              <SelectItem value="test">Test</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>,
      )

      expect(screen.getByRole('combobox')).toBeInTheDocument()
    })
  })
})
