import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from '@/components/ui/context-menu/context-menu'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

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
  })
})
