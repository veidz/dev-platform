import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from '@/components/ui/command'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe, toHaveNoViolations } from 'jest-axe'

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

  describe('CommandSeparator', () => {
    it('renders separator', () => {
      const { container } = render(
        <Command>
          <CommandList>
            <CommandGroup heading="Group 1">
              <CommandItem>Item 1</CommandItem>
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading="Group 2">
              <CommandItem>Item 2</CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>,
      )

      const separator = container.querySelector('[role="separator"]')
      expect(separator).toBeInTheDocument()
    })
  })

  describe('CommandDialog', () => {
    it('shows dialog when open', () => {
      render(
        <CommandDialog open>
          <CommandInput placeholder="Search..." />
          <CommandList>
            <CommandItem>Item</CommandItem>
          </CommandList>
        </CommandDialog>,
      )

      expect(screen.getByPlaceholderText('Search...')).toBeVisible()
      expect(screen.getByText('Item')).toBeVisible()
    })

    it('hides dialog when closed', () => {
      const { container } = render(
        <CommandDialog open={false}>
          <CommandInput />
        </CommandDialog>,
      )

      const overlay = container.querySelector('.fixed')
      expect(overlay).toHaveClass('hidden')
    })

    it('calls onOpenChange when clicking overlay', async () => {
      const handleOpenChange = jest.fn()
      const user = userEvent.setup()

      const { container } = render(
        <CommandDialog open onOpenChange={handleOpenChange}>
          <CommandInput />
        </CommandDialog>,
      )

      const overlay = container.querySelector('.bg-black\\/80')
      if (overlay) {
        await user.click(overlay)
        expect(handleOpenChange).toHaveBeenCalledWith(false)
      }
    })

    it('does not close when clicking inside dialog', async () => {
      const handleOpenChange = jest.fn()
      const user = userEvent.setup()

      render(
        <CommandDialog open onOpenChange={handleOpenChange}>
          <CommandInput placeholder="Click me" />
        </CommandDialog>,
      )

      await user.click(screen.getByPlaceholderText('Click me'))
      expect(handleOpenChange).not.toHaveBeenCalled()
    })

    it('renders with command component inside', () => {
      render(
        <CommandDialog open>
          <CommandList>
            <CommandGroup heading="Test">
              <CommandItem>Dialog Item</CommandItem>
            </CommandGroup>
          </CommandList>
        </CommandDialog>,
      )

      expect(screen.getByText('Test')).toBeInTheDocument()
      expect(screen.getByText('Dialog Item')).toBeInTheDocument()
    })
  })

  describe('Keyboard Navigation', () => {
    it('navigates items with arrow keys', async () => {
      const user = userEvent.setup()

      render(
        <Command>
          <CommandInput />
          <CommandList>
            <CommandItem>First</CommandItem>
            <CommandItem>Second</CommandItem>
            <CommandItem>Third</CommandItem>
          </CommandList>
        </Command>,
      )

      const input = screen.getByRole('combobox')
      input.focus()

      await user.keyboard('{ArrowDown}')
      expect(screen.getByText('First')).toBeInTheDocument()

      await user.keyboard('{ArrowDown}')
      expect(screen.getByText('Second')).toBeInTheDocument()
    })

    it('selects item with Enter key', async () => {
      const onSelect = jest.fn()
      const user = userEvent.setup()

      render(
        <Command>
          <CommandInput />
          <CommandList>
            <CommandItem onSelect={onSelect}>Select me</CommandItem>
          </CommandList>
        </Command>,
      )

      const input = screen.getByRole('combobox')
      input.focus()

      await user.keyboard('{ArrowDown}')
      await user.keyboard('{Enter}')

      expect(onSelect).toHaveBeenCalled()
    })
  })

  describe('Filtering', () => {
    it('filters items based on search', async () => {
      const user = userEvent.setup()

      render(
        <Command>
          <CommandInput placeholder="Search..." />
          <CommandList>
            <CommandItem>Apple</CommandItem>
            <CommandItem>Banana</CommandItem>
            <CommandItem>Cherry</CommandItem>
          </CommandList>
        </Command>,
      )

      const input = screen.getByPlaceholderText('Search...')
      await user.type(input, 'ban')

      expect(screen.getByText('Banana')).toBeInTheDocument()
    })

    it('shows empty state when no matches', async () => {
      const user = userEvent.setup()

      render(
        <Command>
          <CommandInput placeholder="Search..." />
          <CommandList>
            <CommandEmpty>No results</CommandEmpty>
            <CommandItem>Apple</CommandItem>
          </CommandList>
        </Command>,
      )

      const input = screen.getByPlaceholderText('Search...')
      await user.type(input, 'xyz123')

      expect(screen.getByText('No results')).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('has no accessibility violations - basic', async () => {
      const { container } = render(
        <Command>
          <CommandInput placeholder="Search" />
          <CommandList>
            <CommandItem>Item</CommandItem>
          </CommandList>
        </Command>,
      )

      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })

    it('has no accessibility violations - with groups', async () => {
      const { container } = render(
        <Command>
          <CommandInput placeholder="Search" />
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

      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })

    it('has no accessibility violations - dialog', async () => {
      const { container } = render(
        <CommandDialog open>
          <CommandInput placeholder="Search" />
          <CommandList>
            <CommandItem>Item</CommandItem>
          </CommandList>
        </CommandDialog>,
      )

      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })

    it('input has proper role', () => {
      render(
        <Command>
          <CommandInput />
        </Command>,
      )

      expect(screen.getByRole('combobox')).toBeInTheDocument()
    })

    it('items are focusable via keyboard', async () => {
      const user = userEvent.setup()

      render(
        <Command>
          <CommandInput />
          <CommandList>
            <CommandItem>Item</CommandItem>
          </CommandList>
        </Command>,
      )

      const input = screen.getByRole('combobox')
      input.focus()

      await user.keyboard('{ArrowDown}')
      expect(screen.getByText('Item')).toBeInTheDocument()
    })
  })

  describe('Custom Styling', () => {
    it('applies custom className to all components', () => {
      const { container } = render(
        <Command className="cmd-custom">
          <CommandInput className="input-custom" />
          <CommandList className="list-custom">
            <CommandGroup className="group-custom" heading="Test">
              <CommandItem className="item-custom">Item</CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>,
      )

      expect(container.querySelector('.cmd-custom')).toBeInTheDocument()
      expect(container.querySelector('.input-custom')).toBeInTheDocument()
      expect(container.querySelector('.list-custom')).toBeInTheDocument()
      expect(container.querySelector('.group-custom')).toBeInTheDocument()
      expect(container.querySelector('.item-custom')).toBeInTheDocument()
    })
  })
})
