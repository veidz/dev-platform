import {
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from '@/components/ui/context-menu/context-menu'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe } from 'jest-axe'

describe('ContextMenu', () => {
  describe('Rendering', () => {
    it('should render trigger element', () => {
      render(
        <ContextMenu>
          <ContextMenuTrigger>Right click me</ContextMenuTrigger>
          <ContextMenuContent>
            <ContextMenuItem>Item 1</ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>,
      )

      expect(screen.getByText('Right click me')).toBeInTheDocument()
    })

    it('should not render content initially', () => {
      render(
        <ContextMenu>
          <ContextMenuTrigger>Right click me</ContextMenuTrigger>
          <ContextMenuContent>
            <ContextMenuItem>Item 1</ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>,
      )

      expect(screen.queryByText('Item 1')).not.toBeInTheDocument()
    })

    it('should render with custom className on content', async () => {
      const user = userEvent.setup()

      render(
        <ContextMenu>
          <ContextMenuTrigger>Right click me</ContextMenuTrigger>
          <ContextMenuContent className="custom-class">
            <ContextMenuItem>Item 1</ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>,
      )

      await user.pointer({
        keys: '[MouseRight>]',
        target: screen.getByText('Right click me'),
      })

      await waitFor(() => {
        const content = screen.getByText('Item 1').closest('[role="menu"]')
        expect(content).toHaveClass('custom-class')
      })
    })
  })

  describe('Interaction', () => {
    it('should open context menu on right click', async () => {
      const user = userEvent.setup()

      render(
        <ContextMenu>
          <ContextMenuTrigger>Right click me</ContextMenuTrigger>
          <ContextMenuContent>
            <ContextMenuItem>Item 1</ContextMenuItem>
            <ContextMenuItem>Item 2</ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>,
      )

      await user.pointer({
        keys: '[MouseRight>]',
        target: screen.getByText('Right click me'),
      })

      await waitFor(() => {
        expect(screen.getByText('Item 1')).toBeInTheDocument()
        expect(screen.getByText('Item 2')).toBeInTheDocument()
      })
    })

    it('should close menu when clicking menu item', async () => {
      const user = userEvent.setup()
      const onSelect = jest.fn()

      render(
        <ContextMenu>
          <ContextMenuTrigger>Right click me</ContextMenuTrigger>
          <ContextMenuContent>
            <ContextMenuItem onSelect={onSelect}>Item 1</ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>,
      )

      await user.pointer({
        keys: '[MouseRight>]',
        target: screen.getByText('Right click me'),
      })

      await waitFor(() => {
        expect(screen.getByText('Item 1')).toBeInTheDocument()
      })

      await user.click(screen.getByText('Item 1'))

      expect(onSelect).toHaveBeenCalled()

      await waitFor(() => {
        expect(screen.queryByText('Item 1')).not.toBeInTheDocument()
      })
    })

    it('should close menu when pressing escape', async () => {
      const user = userEvent.setup()

      render(
        <ContextMenu>
          <ContextMenuTrigger>Right click me</ContextMenuTrigger>
          <ContextMenuContent>
            <ContextMenuItem>Item 1</ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>,
      )

      await user.pointer({
        keys: '[MouseRight>]',
        target: screen.getByText('Right click me'),
      })

      await waitFor(() => {
        expect(screen.getByText('Item 1')).toBeInTheDocument()
      })

      await user.keyboard('{Escape}')

      await waitFor(() => {
        expect(screen.queryByText('Item 1')).not.toBeInTheDocument()
      })
    })

    it('should handle disabled items', async () => {
      const user = userEvent.setup()
      const onSelect = jest.fn()

      render(
        <ContextMenu>
          <ContextMenuTrigger>Right click me</ContextMenuTrigger>
          <ContextMenuContent>
            <ContextMenuItem disabled onSelect={onSelect}>
              Disabled Item
            </ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>,
      )

      await user.pointer({
        keys: '[MouseRight>]',
        target: screen.getByText('Right click me'),
      })

      await waitFor(() => {
        expect(screen.getByText('Disabled Item')).toBeInTheDocument()
      })

      await user.click(screen.getByText('Disabled Item'))

      expect(onSelect).not.toHaveBeenCalled()
    })
  })

  describe('Checkbox Items', () => {
    it('should render checkbox items', async () => {
      const user = userEvent.setup()

      render(
        <ContextMenu>
          <ContextMenuTrigger>Right click me</ContextMenuTrigger>
          <ContextMenuContent>
            <ContextMenuCheckboxItem checked={true}>
              Checked Item
            </ContextMenuCheckboxItem>
            <ContextMenuCheckboxItem checked={false}>
              Unchecked Item
            </ContextMenuCheckboxItem>
          </ContextMenuContent>
        </ContextMenu>,
      )

      await user.pointer({
        keys: '[MouseRight>]',
        target: screen.getByText('Right click me'),
      })

      await waitFor(() => {
        expect(screen.getByText('Checked Item')).toBeInTheDocument()
        expect(screen.getByText('Unchecked Item')).toBeInTheDocument()
      })
    })

    it('should toggle checkbox items', async () => {
      const user = userEvent.setup()
      const onCheckedChange = jest.fn()

      render(
        <ContextMenu>
          <ContextMenuTrigger>Right click me</ContextMenuTrigger>
          <ContextMenuContent>
            <ContextMenuCheckboxItem
              checked={false}
              onCheckedChange={onCheckedChange}
            >
              Toggle Me
            </ContextMenuCheckboxItem>
          </ContextMenuContent>
        </ContextMenu>,
      )

      await user.pointer({
        keys: '[MouseRight>]',
        target: screen.getByText('Right click me'),
      })

      await waitFor(() => {
        expect(screen.getByText('Toggle Me')).toBeInTheDocument()
      })

      await user.click(screen.getByText('Toggle Me'))

      expect(onCheckedChange).toHaveBeenCalledWith(true)
    })
  })

  describe('Radio Items', () => {
    it('should render radio group', async () => {
      const user = userEvent.setup()

      render(
        <ContextMenu>
          <ContextMenuTrigger>Right click me</ContextMenuTrigger>
          <ContextMenuContent>
            <ContextMenuRadioGroup value="option1">
              <ContextMenuRadioItem value="option1">
                Option 1
              </ContextMenuRadioItem>
              <ContextMenuRadioItem value="option2">
                Option 2
              </ContextMenuRadioItem>
            </ContextMenuRadioGroup>
          </ContextMenuContent>
        </ContextMenu>,
      )

      await user.pointer({
        keys: '[MouseRight>]',
        target: screen.getByText('Right click me'),
      })

      await waitFor(() => {
        expect(screen.getByText('Option 1')).toBeInTheDocument()
        expect(screen.getByText('Option 2')).toBeInTheDocument()
      })
    })

    it('should handle radio item selection', async () => {
      const user = userEvent.setup()
      const onValueChange = jest.fn()

      render(
        <ContextMenu>
          <ContextMenuTrigger>Right click me</ContextMenuTrigger>
          <ContextMenuContent>
            <ContextMenuRadioGroup
              value="option1"
              onValueChange={onValueChange}
            >
              <ContextMenuRadioItem value="option1">
                Option 1
              </ContextMenuRadioItem>
              <ContextMenuRadioItem value="option2">
                Option 2
              </ContextMenuRadioItem>
            </ContextMenuRadioGroup>
          </ContextMenuContent>
        </ContextMenu>,
      )

      await user.pointer({
        keys: '[MouseRight>]',
        target: screen.getByText('Right click me'),
      })

      await waitFor(() => {
        expect(screen.getByText('Option 2')).toBeInTheDocument()
      })

      await user.click(screen.getByText('Option 2'))

      expect(onValueChange).toHaveBeenCalledWith('option2')
    })
  })

  describe('Submenu', () => {
    it('should render nested submenu', async () => {
      const user = userEvent.setup()

      render(
        <ContextMenu>
          <ContextMenuTrigger>Right click me</ContextMenuTrigger>
          <ContextMenuContent>
            <ContextMenuItem>Regular Item</ContextMenuItem>
            <ContextMenuSub>
              <ContextMenuSubTrigger>More Options</ContextMenuSubTrigger>
              <ContextMenuSubContent>
                <ContextMenuItem>Submenu Item 1</ContextMenuItem>
                <ContextMenuItem>Submenu Item 2</ContextMenuItem>
              </ContextMenuSubContent>
            </ContextMenuSub>
          </ContextMenuContent>
        </ContextMenu>,
      )

      await user.pointer({
        keys: '[MouseRight>]',
        target: screen.getByText('Right click me'),
      })

      await waitFor(() => {
        expect(screen.getByText('More Options')).toBeInTheDocument()
      })

      await user.hover(screen.getByText('More Options'))

      await waitFor(() => {
        expect(screen.getByText('Submenu Item 1')).toBeInTheDocument()
        expect(screen.getByText('Submenu Item 2')).toBeInTheDocument()
      })
    })
  })

  describe('Additional Elements', () => {
    it('should render labels', async () => {
      const user = userEvent.setup()

      render(
        <ContextMenu>
          <ContextMenuTrigger>Right click me</ContextMenuTrigger>
          <ContextMenuContent>
            <ContextMenuLabel>Actions</ContextMenuLabel>
            <ContextMenuItem>Item 1</ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>,
      )

      await user.pointer({
        keys: '[MouseRight>]',
        target: screen.getByText('Right click me'),
      })

      await waitFor(() => {
        expect(screen.getByText('Actions')).toBeInTheDocument()
      })
    })

    it('should render separators', async () => {
      const user = userEvent.setup()

      render(
        <ContextMenu>
          <ContextMenuTrigger>Right click me</ContextMenuTrigger>
          <ContextMenuContent>
            <ContextMenuItem>Item 1</ContextMenuItem>
            <ContextMenuSeparator />
            <ContextMenuItem>Item 2</ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>,
      )

      await user.pointer({
        keys: '[MouseRight>]',
        target: screen.getByText('Right click me'),
      })

      await waitFor(() => {
        const separators = document.querySelectorAll('[role="separator"]')
        expect(separators.length).toBeGreaterThan(0)
      })
    })

    it('should render shortcuts', async () => {
      const user = userEvent.setup()

      render(
        <ContextMenu>
          <ContextMenuTrigger>Right click me</ContextMenuTrigger>
          <ContextMenuContent>
            <ContextMenuItem>
              Copy
              <ContextMenuShortcut>⌘C</ContextMenuShortcut>
            </ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>,
      )

      await user.pointer({
        keys: '[MouseRight>]',
        target: screen.getByText('Right click me'),
      })

      await waitFor(() => {
        expect(screen.getByText('⌘C')).toBeInTheDocument()
      })
    })
  })

  describe('Keyboard Navigation', () => {
    it('should navigate items with arrow keys', async () => {
      const user = userEvent.setup()

      render(
        <ContextMenu>
          <ContextMenuTrigger>Right click me</ContextMenuTrigger>
          <ContextMenuContent>
            <ContextMenuItem>Item 1</ContextMenuItem>
            <ContextMenuItem>Item 2</ContextMenuItem>
            <ContextMenuItem>Item 3</ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>,
      )

      await user.pointer({
        keys: '[MouseRight>]',
        target: screen.getByText('Right click me'),
      })

      await waitFor(() => {
        expect(screen.getByText('Item 1')).toBeInTheDocument()
      })

      await user.keyboard('{ArrowDown}')
      await user.keyboard('{ArrowDown}')

      expect(screen.getByText('Item 2')).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('should have no accessibility violations', async () => {
      const { container } = render(
        <ContextMenu>
          <ContextMenuTrigger>Right click me</ContextMenuTrigger>
          <ContextMenuContent>
            <ContextMenuItem>Item 1</ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>,
      )

      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })
  })
})
