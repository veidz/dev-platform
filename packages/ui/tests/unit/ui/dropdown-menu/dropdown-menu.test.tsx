import { describe, expect, it } from '@jest/globals'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu/dropdown-menu'

describe('DropdownMenu', () => {
  describe('DropdownMenu component', () => {
    it('should render trigger button', () => {
      render(
        <DropdownMenu>
          <DropdownMenuTrigger>Open Menu</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Item 1</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>,
      )

      expect(screen.getByText('Open Menu')).toBeDefined()
    })

    it('should open menu when trigger is clicked', async () => {
      const user = userEvent.setup()

      render(
        <DropdownMenu>
          <DropdownMenuTrigger>Open</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Menu Item</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>,
      )

      const trigger = screen.getByText('Open')
      await user.click(trigger)

      await waitFor(() => {
        expect(screen.getByText('Menu Item')).toBeDefined()
      })
    })

    it('should render with custom trigger component', () => {
      render(
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">Custom Trigger</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Item</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>,
      )

      const trigger = screen.getByRole('button')
      expect(trigger.textContent).toBe('Custom Trigger')
    })
  })

  describe('DropdownMenuContent component', () => {
    it('should render content when menu is open', async () => {
      const user = userEvent.setup()

      render(
        <DropdownMenu>
          <DropdownMenuTrigger>Open</DropdownMenuTrigger>
          <DropdownMenuContent>Test Content</DropdownMenuContent>
        </DropdownMenu>,
      )

      await user.click(screen.getByText('Open'))

      await waitFor(() => {
        expect(screen.getByText('Test Content')).toBeDefined()
      })
    })

    it('should apply default classes', async () => {
      const user = userEvent.setup()

      render(
        <DropdownMenu>
          <DropdownMenuTrigger>Open</DropdownMenuTrigger>
          <DropdownMenuContent data-testid="content">
            Content
          </DropdownMenuContent>
        </DropdownMenu>,
      )

      await user.click(screen.getByText('Open'))

      await waitFor(() => {
        const content = screen.getByTestId('content')
        expect(content.className).toContain('z-50')
        expect(content.className).toContain('min-w-32')
        expect(content.className).toContain('rounded-md')
      })
    })

    it('should merge custom className', async () => {
      const user = userEvent.setup()

      render(
        <DropdownMenu>
          <DropdownMenuTrigger>Open</DropdownMenuTrigger>
          <DropdownMenuContent className="custom-content" data-testid="content">
            Content
          </DropdownMenuContent>
        </DropdownMenu>,
      )

      await user.click(screen.getByText('Open'))

      await waitFor(() => {
        const content = screen.getByTestId('content')
        expect(content.className).toContain('custom-content')
        expect(content.className).toContain('z-50')
      })
    })

    it('should forward ref', async () => {
      const user = userEvent.setup()
      const ref = { current: null }

      render(
        <DropdownMenu>
          <DropdownMenuTrigger>Open</DropdownMenuTrigger>
          <DropdownMenuContent ref={ref}>Content</DropdownMenuContent>
        </DropdownMenu>,
      )

      await user.click(screen.getByText('Open'))

      await waitFor(() => {
        expect(ref.current).not.toBeNull()
      })
    })
  })

  describe('DropdownMenuItem component', () => {
    it('should render menu item', async () => {
      const user = userEvent.setup()

      render(
        <DropdownMenu>
          <DropdownMenuTrigger>Open</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Menu Item</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>,
      )

      await user.click(screen.getByText('Open'))

      await waitFor(() => {
        expect(screen.getByText('Menu Item')).toBeDefined()
      })
    })

    it('should apply default classes', async () => {
      const user = userEvent.setup()

      render(
        <DropdownMenu>
          <DropdownMenuTrigger>Open</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Item</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>,
      )

      await user.click(screen.getByText('Open'))

      await waitFor(() => {
        const item = screen.getByText('Item')
        expect(item.className).toContain('flex')
        expect(item.className).toContain('cursor-pointer')
        expect(item.className).toContain('rounded-sm')
      })
    })

    it('should apply inset class', async () => {
      const user = userEvent.setup()

      render(
        <DropdownMenu>
          <DropdownMenuTrigger>Open</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem inset>Inset Item</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>,
      )

      await user.click(screen.getByText('Open'))

      await waitFor(() => {
        const item = screen.getByText('Inset Item')
        expect(item.className).toContain('pl-8')
      })
    })

    it('should merge custom className', async () => {
      const user = userEvent.setup()

      render(
        <DropdownMenu>
          <DropdownMenuTrigger>Open</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem className="custom-item">Item</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>,
      )

      await user.click(screen.getByText('Open'))

      await waitFor(() => {
        const item = screen.getByText('Item')
        expect(item.className).toContain('custom-item')
        expect(item.className).toContain('flex')
      })
    })

    it('should forward ref', async () => {
      const user = userEvent.setup()
      const ref = { current: null }

      render(
        <DropdownMenu>
          <DropdownMenuTrigger>Open</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem ref={ref}>Item</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>,
      )

      await user.click(screen.getByText('Open'))

      await waitFor(() => {
        expect(ref.current).not.toBeNull()
      })
    })
  })

  describe('DropdownMenuCheckboxItem component', () => {
    it('should render checkbox item', async () => {
      const user = userEvent.setup()

      render(
        <DropdownMenu>
          <DropdownMenuTrigger>Open</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuCheckboxItem>Checkbox</DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>,
      )

      await user.click(screen.getByText('Open'))

      await waitFor(() => {
        expect(screen.getByText('Checkbox')).toBeDefined()
      })
    })

    it('should apply default classes', async () => {
      const user = userEvent.setup()

      render(
        <DropdownMenu>
          <DropdownMenuTrigger>Open</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuCheckboxItem>Item</DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>,
      )

      await user.click(screen.getByText('Open'))

      await waitFor(() => {
        const item = screen.getByText('Item')
        expect(item.className).toContain('flex')
        expect(item.className).toContain('pl-8')
      })
    })

    it('should handle checked state', async () => {
      const user = userEvent.setup()

      render(
        <DropdownMenu>
          <DropdownMenuTrigger>Open</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuCheckboxItem checked>
              Checked Item
            </DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>,
      )

      await user.click(screen.getByText('Open'))

      await waitFor(() => {
        const item = screen.getByText('Checked Item')
        expect(item).toBeDefined()
        expect(item.getAttribute('data-state')).toBe('checked')
      })
    })

    it('should forward ref', async () => {
      const user = userEvent.setup()
      const ref = { current: null }

      render(
        <DropdownMenu>
          <DropdownMenuTrigger>Open</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuCheckboxItem ref={ref}>Item</DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>,
      )

      await user.click(screen.getByText('Open'))

      await waitFor(() => {
        expect(ref.current).not.toBeNull()
      })
    })
  })

  describe('DropdownMenuRadioGroup and DropdownMenuRadioItem', () => {
    it('should render radio group', async () => {
      const user = userEvent.setup()

      render(
        <DropdownMenu>
          <DropdownMenuTrigger>Open</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuRadioGroup value="option1">
              <DropdownMenuRadioItem value="option1">
                Option 1
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="option2">
                Option 2
              </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>,
      )

      await user.click(screen.getByText('Open'))

      await waitFor(() => {
        expect(screen.getByText('Option 1')).toBeDefined()
        expect(screen.getByText('Option 2')).toBeDefined()
      })
    })

    it('should apply default classes to radio item', async () => {
      const user = userEvent.setup()

      render(
        <DropdownMenu>
          <DropdownMenuTrigger>Open</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuRadioGroup>
              <DropdownMenuRadioItem value="opt">
                Radio Option
              </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>,
      )

      await user.click(screen.getByText('Open'))

      await waitFor(() => {
        const item = screen.getByText('Radio Option')
        expect(item.className).toContain('flex')
        expect(item.className).toContain('pl-8')
      })
    })

    it('should show selected state', async () => {
      const user = userEvent.setup()

      render(
        <DropdownMenu>
          <DropdownMenuTrigger>Open</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuRadioGroup value="selected">
              <DropdownMenuRadioItem value="selected">
                Selected
              </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>,
      )

      await user.click(screen.getByText('Open'))

      await waitFor(() => {
        const item = screen.getByText('Selected')
        expect(item.getAttribute('data-state')).toBe('checked')
      })
    })

    it('should forward ref', async () => {
      const user = userEvent.setup()
      const ref = { current: null }

      render(
        <DropdownMenu>
          <DropdownMenuTrigger>Open</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuRadioGroup>
              <DropdownMenuRadioItem value="opt" ref={ref}>
                Option
              </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>,
      )

      await user.click(screen.getByText('Open'))

      await waitFor(() => {
        expect(ref.current).not.toBeNull()
      })
    })
  })

  describe('DropdownMenuLabel component', () => {
    it('should render label', async () => {
      const user = userEvent.setup()

      render(
        <DropdownMenu>
          <DropdownMenuTrigger>Open</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>My Label</DropdownMenuLabel>
          </DropdownMenuContent>
        </DropdownMenu>,
      )

      await user.click(screen.getByText('Open'))

      await waitFor(() => {
        expect(screen.getByText('My Label')).toBeDefined()
      })
    })

    it('should apply default classes', async () => {
      const user = userEvent.setup()

      render(
        <DropdownMenu>
          <DropdownMenuTrigger>Open</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Label</DropdownMenuLabel>
          </DropdownMenuContent>
        </DropdownMenu>,
      )

      await user.click(screen.getByText('Open'))

      await waitFor(() => {
        const label = screen.getByText('Label')
        expect(label.className).toContain('px-2')
        expect(label.className).toContain('font-semibold')
      })
    })

    it('should apply inset class', async () => {
      const user = userEvent.setup()

      render(
        <DropdownMenu>
          <DropdownMenuTrigger>Open</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel inset>Inset Label</DropdownMenuLabel>
          </DropdownMenuContent>
        </DropdownMenu>,
      )

      await user.click(screen.getByText('Open'))

      await waitFor(() => {
        const label = screen.getByText('Inset Label')
        expect(label.className).toContain('pl-8')
      })
    })

    it('should forward ref', async () => {
      const user = userEvent.setup()
      const ref = { current: null }

      render(
        <DropdownMenu>
          <DropdownMenuTrigger>Open</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel ref={ref}>Label</DropdownMenuLabel>
          </DropdownMenuContent>
        </DropdownMenu>,
      )

      await user.click(screen.getByText('Open'))

      await waitFor(() => {
        expect(ref.current).not.toBeNull()
      })
    })
  })

  describe('DropdownMenuSeparator component', () => {
    it('should render separator', async () => {
      const user = userEvent.setup()

      render(
        <DropdownMenu>
          <DropdownMenuTrigger>Open</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Item 1</DropdownMenuItem>
            <DropdownMenuSeparator data-testid="separator" />
            <DropdownMenuItem>Item 2</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>,
      )

      await user.click(screen.getByText('Open'))

      await waitFor(() => {
        const separator = screen.getByTestId('separator')
        expect(separator).toBeDefined()
      })
    })

    it('should apply default classes', async () => {
      const user = userEvent.setup()

      render(
        <DropdownMenu>
          <DropdownMenuTrigger>Open</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuSeparator data-testid="separator" />
          </DropdownMenuContent>
        </DropdownMenu>,
      )

      await user.click(screen.getByText('Open'))

      await waitFor(() => {
        const separator = screen.getByTestId('separator')
        expect(separator.className).toContain('h-px')
        expect(separator.className).toContain('bg-muted')
      })
    })

    it('should forward ref', async () => {
      const user = userEvent.setup()
      const ref = { current: null }

      render(
        <DropdownMenu>
          <DropdownMenuTrigger>Open</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuSeparator ref={ref} />
          </DropdownMenuContent>
        </DropdownMenu>,
      )

      await user.click(screen.getByText('Open'))

      await waitFor(() => {
        expect(ref.current).not.toBeNull()
      })
    })
  })

  describe('DropdownMenuShortcut component', () => {
    it('should render shortcut', async () => {
      const user = userEvent.setup()

      render(
        <DropdownMenu>
          <DropdownMenuTrigger>Open</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>
              Save
              <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>,
      )

      await user.click(screen.getByText('Open'))

      await waitFor(() => {
        expect(screen.getByText('⌘S')).toBeDefined()
      })
    })

    it('should apply default classes', async () => {
      const user = userEvent.setup()

      render(
        <DropdownMenu>
          <DropdownMenuTrigger>Open</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>
              Action
              <DropdownMenuShortcut>⌘K</DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>,
      )

      await user.click(screen.getByText('Open'))

      await waitFor(() => {
        const shortcut = screen.getByText('⌘K')
        expect(shortcut.className).toContain('ml-auto')
        expect(shortcut.className).toContain('text-xs')
        expect(shortcut.className).toContain('opacity-60')
      })
    })
  })

  describe('DropdownMenuSub components', () => {
    it('should render submenu trigger', async () => {
      const user = userEvent.setup()

      render(
        <DropdownMenu>
          <DropdownMenuTrigger>Open</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>More Options</DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                <DropdownMenuItem>Sub Item</DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuSub>
          </DropdownMenuContent>
        </DropdownMenu>,
      )

      await user.click(screen.getByText('Open'))

      await waitFor(() => {
        expect(screen.getByText('More Options')).toBeDefined()
      })
    })

    it('should apply default classes to SubTrigger', async () => {
      const user = userEvent.setup()

      render(
        <DropdownMenu>
          <DropdownMenuTrigger>Open</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>Submenu</DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                <DropdownMenuItem>Item</DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuSub>
          </DropdownMenuContent>
        </DropdownMenu>,
      )

      await user.click(screen.getByText('Open'))

      await waitFor(() => {
        const trigger = screen.getByText('Submenu')
        expect(trigger.className).toContain('flex')
        expect(trigger.className).toContain('cursor-pointer')
      })
    })

    it('should apply inset class to SubTrigger', async () => {
      const user = userEvent.setup()

      render(
        <DropdownMenu>
          <DropdownMenuTrigger>Open</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger inset>
                Inset Submenu
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                <DropdownMenuItem>Item</DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuSub>
          </DropdownMenuContent>
        </DropdownMenu>,
      )

      await user.click(screen.getByText('Open'))

      await waitFor(() => {
        const trigger = screen.getByText('Inset Submenu')
        expect(trigger.className).toContain('pl-8')
      })
    })

    it('should forward ref to SubTrigger', async () => {
      const user = userEvent.setup()
      const ref = { current: null }

      render(
        <DropdownMenu>
          <DropdownMenuTrigger>Open</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger ref={ref}>Submenu</DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                <DropdownMenuItem>Item</DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuSub>
          </DropdownMenuContent>
        </DropdownMenu>,
      )

      await user.click(screen.getByText('Open'))

      await waitFor(() => {
        expect(ref.current).not.toBeNull()
      })
    })

    it('should forward ref to SubContent', async () => {
      const user = userEvent.setup()
      const ref = { current: null }

      render(
        <DropdownMenu>
          <DropdownMenuTrigger>Open</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>Submenu</DropdownMenuSubTrigger>
              <DropdownMenuSubContent ref={ref}>
                <DropdownMenuItem>Item</DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuSub>
          </DropdownMenuContent>
        </DropdownMenu>,
      )

      await user.click(screen.getByText('Open'))

      await waitFor(() => {
        expect(screen.getByText('Submenu')).toBeDefined()
      })
    })
  })

  describe('DropdownMenuGroup component', () => {
    it('should render grouped items', async () => {
      const user = userEvent.setup()

      render(
        <DropdownMenu>
          <DropdownMenuTrigger>Open</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuGroup>
              <DropdownMenuItem>Group Item 1</DropdownMenuItem>
              <DropdownMenuItem>Group Item 2</DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>,
      )

      await user.click(screen.getByText('Open'))

      await waitFor(() => {
        expect(screen.getByText('Group Item 1')).toBeDefined()
        expect(screen.getByText('Group Item 2')).toBeDefined()
      })
    })
  })

  describe('DropdownMenu composition', () => {
    it('should render complete dropdown menu', async () => {
      const user = userEvent.setup()

      render(
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button>Open Menu</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                Profile
                <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>,
      )

      await user.click(screen.getByText('Open Menu'))

      await waitFor(() => {
        expect(screen.getByText('My Account')).toBeDefined()
        expect(screen.getByText('Profile')).toBeDefined()
        expect(screen.getByText('⇧⌘P')).toBeDefined()
        expect(screen.getByText('Settings')).toBeDefined()
        expect(screen.getByText('Logout')).toBeDefined()
      })
    })

    it('should render dropdown with checkboxes', async () => {
      const user = userEvent.setup()

      render(
        <DropdownMenu>
          <DropdownMenuTrigger>Options</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuCheckboxItem checked>
              Show Toolbar
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem>Show Sidebar</DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>,
      )

      await user.click(screen.getByText('Options'))

      await waitFor(() => {
        expect(screen.getByText('Show Toolbar')).toBeDefined()
        expect(screen.getByText('Show Sidebar')).toBeDefined()
      })
    })

    it('should render dropdown with radio group', async () => {
      const user = userEvent.setup()

      render(
        <DropdownMenu>
          <DropdownMenuTrigger>Theme</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuRadioGroup value="light">
              <DropdownMenuRadioItem value="light">Light</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="dark">Dark</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="system">
                System
              </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>,
      )

      await user.click(screen.getByText('Theme'))

      await waitFor(() => {
        expect(screen.getByText('Light')).toBeDefined()
        expect(screen.getByText('Dark')).toBeDefined()
        expect(screen.getByText('System')).toBeDefined()
      })
    })
  })
})
