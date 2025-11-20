import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from '@/components/ui/context-menu/context-menu'
import { render, screen } from '@testing-library/react'

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
  })
})
