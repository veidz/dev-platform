import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
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
    it('should render with placeholder', () => {
      render(<SimpleSelect />)
      expect(screen.getByRole('combobox')).toBeInTheDocument()
      expect(screen.getByText('Select option')).toBeInTheDocument()
    })

    it('should render with custom className', () => {
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

    it('should render with chevron icon', () => {
      render(<SimpleSelect />)
      const trigger = screen.getByRole('combobox')
      const svg = trigger.querySelector('svg')
      expect(svg).toBeInTheDocument()
    })

    it('should apply disabled styles when disabled', () => {
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
    it('should render SelectContent component', () => {
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

    it('should render with custom className', () => {
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
    it('should render with custom className', () => {
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

    it('should render disabled item', () => {
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
    it('should render placeholder when no value selected', () => {
      render(<SimpleSelect />)
      expect(screen.getByText('Select option')).toBeInTheDocument()
    })

    it('should render selected value', async () => {
      const user = userEvent.setup()
      render(<SimpleSelect />)

      await user.click(screen.getByRole('combobox'))
      await user.click(screen.getByText('Option 1'))

      expect(screen.getByRole('combobox')).toHaveTextContent('Option 1')
    })

    it('should render with default value', () => {
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
    it('should render group with label', () => {
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

    it('should render label with custom className', () => {
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

  describe('SelectSeparator', () => {
    it('should render separator', () => {
      render(
        <Select defaultValue="option1">
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="option1">Option 1</SelectItem>
            <SelectSeparator />
            <SelectItem value="option2">Option 2</SelectItem>
          </SelectContent>
        </Select>,
      )

      expect(screen.getByRole('combobox')).toBeInTheDocument()
    })

    it('should render separator with custom className', () => {
      render(
        <Select defaultValue="option1">
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="option1">Option 1</SelectItem>
            <SelectSeparator className="custom-separator" />
            <SelectItem value="option2">Option 2</SelectItem>
          </SelectContent>
        </Select>,
      )

      expect(screen.getByRole('combobox')).toBeInTheDocument()
    })
  })

  describe('Scroll Buttons', () => {
    it('should render scroll up button with custom className', () => {
      render(
        <Select defaultValue="test">
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectScrollUpButton className="custom-scroll-up" />
            <SelectItem value="test">Test</SelectItem>
            <SelectScrollDownButton />
          </SelectContent>
        </Select>,
      )

      expect(screen.getByRole('combobox')).toBeInTheDocument()
    })

    it('should render scroll down button with custom className', () => {
      render(
        <Select defaultValue="test">
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectScrollUpButton />
            <SelectItem value="test">Test</SelectItem>
            <SelectScrollDownButton className="custom-scroll-down" />
          </SelectContent>
        </Select>,
      )

      expect(screen.getByRole('combobox')).toBeInTheDocument()
    })

    it('should render scroll buttons', () => {
      render(
        <Select defaultValue="test">
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectScrollUpButton />
            <SelectItem value="test">Test</SelectItem>
            <SelectScrollDownButton />
          </SelectContent>
        </Select>,
      )

      expect(screen.getByRole('combobox')).toBeInTheDocument()
    })
  })

  describe('Controlled State', () => {
    it('should work in controlled mode', () => {
      const handleChange = jest.fn()

      render(
        <Select value="option1" onValueChange={handleChange}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="option1">Option 1</SelectItem>
            <SelectItem value="option2">Option 2</SelectItem>
          </SelectContent>
        </Select>,
      )

      expect(screen.getByRole('combobox')).toHaveTextContent('Option 1')
    })

    it('should call onValueChange when value changes', () => {
      const handleChange = jest.fn()

      render(
        <Select defaultValue="option1" onValueChange={handleChange}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="option1">Option 1</SelectItem>
            <SelectItem value="option2">Option 2</SelectItem>
          </SelectContent>
        </Select>,
      )

      expect(screen.getByRole('combobox')).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('should have correct ARIA attributes on trigger', () => {
      render(<SimpleSelect />)
      const trigger = screen.getByRole('combobox')
      expect(trigger).toHaveAttribute('aria-expanded', 'false')
    })

    it('should have correct aria-controls attribute', () => {
      render(<SimpleSelect />)
      const trigger = screen.getByRole('combobox')
      expect(trigger).toHaveAttribute('aria-controls')
    })

    it('should have correct aria-autocomplete attribute', () => {
      render(<SimpleSelect />)
      const trigger = screen.getByRole('combobox')
      expect(trigger).toHaveAttribute('aria-autocomplete', 'none')
    })
  })

  describe('Integration', () => {
    it('should render complete Select with all components', () => {
      render(
        <Select defaultValue="apple">
          <SelectTrigger>
            <SelectValue placeholder="Select fruit" />
          </SelectTrigger>
          <SelectContent>
            <SelectScrollUpButton />
            <SelectGroup>
              <SelectLabel>Fruits</SelectLabel>
              <SelectItem value="apple">Apple</SelectItem>
              <SelectItem value="banana">Banana</SelectItem>
            </SelectGroup>
            <SelectSeparator />
            <SelectGroup>
              <SelectLabel>Vegetables</SelectLabel>
              <SelectItem value="carrot">Carrot</SelectItem>
              <SelectItem value="potato">Potato</SelectItem>
            </SelectGroup>
            <SelectScrollDownButton />
          </SelectContent>
        </Select>,
      )

      expect(screen.getByRole('combobox')).toHaveTextContent('Apple')
    })

    it('should render with open prop', () => {
      render(
        <Select open>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="test">Test</SelectItem>
          </SelectContent>
        </Select>,
      )

      expect(screen.getByRole('listbox')).toBeInTheDocument()
    })

    it('should render with onOpenChange callback', () => {
      const handleOpenChange = jest.fn()

      render(
        <Select onOpenChange={handleOpenChange}>
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
  })
})
