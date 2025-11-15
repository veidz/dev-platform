import {
  Command,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { render, screen } from '@testing-library/react'
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
  })
})
