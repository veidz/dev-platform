import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandShortcut,
} from '@/components/ui/command'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { toHaveNoViolations } from 'jest-axe'

expect.extend(toHaveNoViolations)

describe('Command', () => {
  describe('Rendering', () => {
    it('renders command component', () => {
      render(
        <Command>
          <CommandInput placeholder="Search..." />
          <CommandList>
            <CommandItem>Item 1</CommandItem>
          </CommandList>
        </Command>,
      )

      expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument()
      expect(screen.getByText('Item 1')).toBeInTheDocument()
    })

    it('renders with custom className', () => {
      const { container } = render(
        <Command className="custom-class">
          <CommandInput />
        </Command>,
      )

      const command = container.firstChild as HTMLElement
      expect(command).toHaveClass('custom-class')
    })

    it('renders search icon in input', () => {
      const { container } = render(
        <Command>
          <CommandInput />
        </Command>,
      )

      const icon = container.querySelector('svg')
      expect(icon).toBeInTheDocument()
    })
  })

  describe('CommandInput', () => {
    it('accepts input value', async () => {
      const user = userEvent.setup()
      render(
        <Command>
          <CommandInput placeholder="Type here..." />
        </Command>,
      )

      const input = screen.getByPlaceholderText('Type here...')
      await user.type(input, 'test query')

      expect(input).toHaveValue('test query')
    })

    it('supports controlled value', () => {
      const { rerender } = render(
        <Command>
          <CommandInput value="initial" />
        </Command>,
      )

      const input = screen.getByRole('combobox')
      expect(input).toHaveValue('initial')

      rerender(
        <Command>
          <CommandInput value="updated" />
        </Command>,
      )

      expect(input).toHaveValue('updated')
    })

    it('can be disabled', () => {
      render(
        <Command>
          <CommandInput disabled placeholder="Disabled..." />
        </Command>,
      )

      expect(screen.getByPlaceholderText('Disabled...')).toBeDisabled()
    })
  })

  describe('CommandList and CommandEmpty', () => {
    it('renders list with items', () => {
      render(
        <Command>
          <CommandList>
            <CommandItem>First</CommandItem>
            <CommandItem>Second</CommandItem>
          </CommandList>
        </Command>,
      )

      expect(screen.getByText('First')).toBeInTheDocument()
      expect(screen.getByText('Second')).toBeInTheDocument()
    })

    it('shows empty state when no results', () => {
      render(
        <Command>
          <CommandInput />
          <CommandList>
            <CommandEmpty>No results found</CommandEmpty>
          </CommandList>
        </Command>,
      )

      expect(screen.getByText('No results found')).toBeInTheDocument()
    })

    it('hides empty when items exist', () => {
      render(
        <Command>
          <CommandList>
            <CommandEmpty>Nothing here</CommandEmpty>
            <CommandItem>Something</CommandItem>
          </CommandList>
        </Command>,
      )

      expect(screen.getByText('Something')).toBeInTheDocument()
    })
  })

  describe('CommandGroup', () => {
    it('renders group with heading', () => {
      render(
        <Command>
          <CommandList>
            <CommandGroup heading="Actions">
              <CommandItem>Action 1</CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>,
      )

      expect(screen.getByText('Actions')).toBeInTheDocument()
      expect(screen.getByText('Action 1')).toBeInTheDocument()
    })

    it('renders multiple groups', () => {
      render(
        <Command>
          <CommandList>
            <CommandGroup heading="Group 1">
              <CommandItem>Item 1</CommandItem>
            </CommandGroup>
            <CommandGroup heading="Group 2">
              <CommandItem>Item 2</CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>,
      )

      expect(screen.getByText('Group 1')).toBeInTheDocument()
      expect(screen.getByText('Group 2')).toBeInTheDocument()
    })

    it('applies custom className to group', () => {
      const { container } = render(
        <Command>
          <CommandList>
            <CommandGroup heading="Custom" className="custom-group">
              <CommandItem>Item</CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>,
      )

      const group = container.querySelector('.custom-group')
      expect(group).toBeInTheDocument()
    })
  })

  describe('CommandItem', () => {
    it('renders clickable items', async () => {
      const onSelect = jest.fn()
      const user = userEvent.setup()

      render(
        <Command>
          <CommandList>
            <CommandItem onSelect={onSelect}>Click me</CommandItem>
          </CommandList>
        </Command>,
      )

      await user.click(screen.getByText('Click me'))
      expect(onSelect).toHaveBeenCalled()
    })

    it('supports disabled state', () => {
      render(
        <Command>
          <CommandList>
            <CommandItem disabled>Disabled item</CommandItem>
          </CommandList>
        </Command>,
      )

      const item = screen.getByText('Disabled item')
      expect(item).toHaveAttribute('data-disabled', 'true')
    })

    it('renders with custom value', () => {
      render(
        <Command>
          <CommandList>
            <CommandItem value="custom-value">Item</CommandItem>
          </CommandList>
        </Command>,
      )

      const item = screen.getByText('Item')
      expect(item).toHaveAttribute('data-value', 'custom-value')
    })
  })

  describe('CommandShortcut', () => {
    it('renders keyboard shortcut', () => {
      render(
        <Command>
          <CommandList>
            <CommandItem>
              Save
              <CommandShortcut>⌘S</CommandShortcut>
            </CommandItem>
          </CommandList>
        </Command>,
      )

      expect(screen.getByText('⌘S')).toBeInTheDocument()
    })

    it('applies custom className to shortcut', () => {
      render(<CommandShortcut className="custom-shortcut">⌘K</CommandShortcut>)

      expect(screen.getByText('⌘K')).toHaveClass('custom-shortcut')
    })
  })
})
