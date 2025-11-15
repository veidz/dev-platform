import {
  Command,
  CommandInput,
  CommandItem,
  CommandList,
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
  })
})
