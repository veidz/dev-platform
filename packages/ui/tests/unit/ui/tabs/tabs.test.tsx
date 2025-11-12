import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

describe('Tabs', () => {
  describe('Rendering', () => {
    it('should render tabs with default value', () => {
      render(
        <Tabs defaultValue="tab1">
          <TabsList>
            <TabsTrigger value="tab1">Tab 1</TabsTrigger>
            <TabsTrigger value="tab2">Tab 2</TabsTrigger>
          </TabsList>
          <TabsContent value="tab1">Content 1</TabsContent>
          <TabsContent value="tab2">Content 2</TabsContent>
        </Tabs>,
      )

      expect(screen.getByText('Tab 1')).toBeInTheDocument()
      expect(screen.getByText('Tab 2')).toBeInTheDocument()
      expect(screen.getByText('Content 1')).toBeInTheDocument()
    })

    it('should render multiple triggers', () => {
      render(
        <Tabs defaultValue="tab1">
          <TabsList>
            <TabsTrigger value="tab1">Tab 1</TabsTrigger>
            <TabsTrigger value="tab2">Tab 2</TabsTrigger>
            <TabsTrigger value="tab3">Tab 3</TabsTrigger>
          </TabsList>
          <TabsContent value="tab1">Content 1</TabsContent>
          <TabsContent value="tab2">Content 2</TabsContent>
          <TabsContent value="tab3">Content 3</TabsContent>
        </Tabs>,
      )

      expect(screen.getByText('Tab 1')).toBeInTheDocument()
      expect(screen.getByText('Tab 2')).toBeInTheDocument()
      expect(screen.getByText('Tab 3')).toBeInTheDocument()
    })

    it('should render with custom className on TabsList', () => {
      render(
        <Tabs defaultValue="tab1">
          <TabsList className="custom-list">
            <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          </TabsList>
          <TabsContent value="tab1">Content 1</TabsContent>
        </Tabs>,
      )

      const list = screen.getByRole('tablist')
      expect(list).toHaveClass('custom-list')
    })

    it('should render with custom className on TabsTrigger', () => {
      render(
        <Tabs defaultValue="tab1">
          <TabsList>
            <TabsTrigger value="tab1" className="custom-trigger">
              Tab 1
            </TabsTrigger>
          </TabsList>
          <TabsContent value="tab1">Content 1</TabsContent>
        </Tabs>,
      )

      const trigger = screen.getByRole('tab', { name: 'Tab 1' })
      expect(trigger).toHaveClass('custom-trigger')
    })

    it('should render with custom className on TabsContent', () => {
      render(
        <Tabs defaultValue="tab1">
          <TabsList>
            <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          </TabsList>
          <TabsContent value="tab1" className="custom-content">
            Content 1
          </TabsContent>
        </Tabs>,
      )

      const content = screen.getByRole('tabpanel')
      expect(content).toHaveClass('custom-content')
    })
  })

  describe('Tab Switching', () => {
    it('should switch tabs on click', async () => {
      const user = userEvent.setup()

      render(
        <Tabs defaultValue="tab1">
          <TabsList>
            <TabsTrigger value="tab1">Tab 1</TabsTrigger>
            <TabsTrigger value="tab2">Tab 2</TabsTrigger>
          </TabsList>
          <TabsContent value="tab1">Content 1</TabsContent>
          <TabsContent value="tab2">Content 2</TabsContent>
        </Tabs>,
      )

      expect(screen.getByText('Content 1')).toBeInTheDocument()
      expect(screen.queryByText('Content 2')).not.toBeInTheDocument()

      await user.click(screen.getByText('Tab 2'))

      expect(screen.queryByText('Content 1')).not.toBeInTheDocument()
      expect(screen.getByText('Content 2')).toBeInTheDocument()
    })

    it('should maintain active state on trigger', async () => {
      const user = userEvent.setup()

      render(
        <Tabs defaultValue="tab1">
          <TabsList>
            <TabsTrigger value="tab1">Tab 1</TabsTrigger>
            <TabsTrigger value="tab2">Tab 2</TabsTrigger>
          </TabsList>
          <TabsContent value="tab1">Content 1</TabsContent>
          <TabsContent value="tab2">Content 2</TabsContent>
        </Tabs>,
      )

      const tab1 = screen.getByText('Tab 1')
      const tab2 = screen.getByText('Tab 2')

      expect(tab1).toHaveAttribute('data-state', 'active')
      expect(tab2).toHaveAttribute('data-state', 'inactive')

      await user.click(tab2)

      expect(tab1).toHaveAttribute('data-state', 'inactive')
      expect(tab2).toHaveAttribute('data-state', 'active')
    })

    it('should switch between multiple tabs', async () => {
      const user = userEvent.setup()

      render(
        <Tabs defaultValue="tab1">
          <TabsList>
            <TabsTrigger value="tab1">Tab 1</TabsTrigger>
            <TabsTrigger value="tab2">Tab 2</TabsTrigger>
            <TabsTrigger value="tab3">Tab 3</TabsTrigger>
          </TabsList>
          <TabsContent value="tab1">Content 1</TabsContent>
          <TabsContent value="tab2">Content 2</TabsContent>
          <TabsContent value="tab3">Content 3</TabsContent>
        </Tabs>,
      )

      await user.click(screen.getByText('Tab 2'))
      expect(screen.getByText('Content 2')).toBeInTheDocument()

      await user.click(screen.getByText('Tab 3'))
      expect(screen.getByText('Content 3')).toBeInTheDocument()

      await user.click(screen.getByText('Tab 1'))
      expect(screen.getByText('Content 1')).toBeInTheDocument()
    })
  })

  describe('Keyboard Navigation', () => {
    it('should navigate tabs with arrow keys (horizontal)', async () => {
      const user = userEvent.setup()

      render(
        <Tabs defaultValue="tab1">
          <TabsList>
            <TabsTrigger value="tab1">Tab 1</TabsTrigger>
            <TabsTrigger value="tab2">Tab 2</TabsTrigger>
            <TabsTrigger value="tab3">Tab 3</TabsTrigger>
          </TabsList>
          <TabsContent value="tab1">Content 1</TabsContent>
          <TabsContent value="tab2">Content 2</TabsContent>
          <TabsContent value="tab3">Content 3</TabsContent>
        </Tabs>,
      )

      const tab1 = screen.getByText('Tab 1')
      tab1.focus()

      await user.keyboard('{ArrowRight}')
      expect(screen.getByText('Tab 2')).toHaveFocus()

      await user.keyboard('{ArrowRight}')
      expect(screen.getByText('Tab 3')).toHaveFocus()

      await user.keyboard('{ArrowLeft}')
      expect(screen.getByText('Tab 2')).toHaveFocus()
    })

    it('should wrap around with arrow keys', async () => {
      const user = userEvent.setup()

      render(
        <Tabs defaultValue="tab1">
          <TabsList>
            <TabsTrigger value="tab1">Tab 1</TabsTrigger>
            <TabsTrigger value="tab2">Tab 2</TabsTrigger>
          </TabsList>
          <TabsContent value="tab1">Content 1</TabsContent>
          <TabsContent value="tab2">Content 2</TabsContent>
        </Tabs>,
      )

      const tab2 = screen.getByText('Tab 2')
      tab2.focus()

      await user.keyboard('{ArrowRight}')
      expect(screen.getByText('Tab 1')).toHaveFocus()
    })

    it('should focus first tab with Home key', async () => {
      const user = userEvent.setup()

      render(
        <Tabs defaultValue="tab3">
          <TabsList>
            <TabsTrigger value="tab1">Tab 1</TabsTrigger>
            <TabsTrigger value="tab2">Tab 2</TabsTrigger>
            <TabsTrigger value="tab3">Tab 3</TabsTrigger>
          </TabsList>
          <TabsContent value="tab1">Content 1</TabsContent>
          <TabsContent value="tab2">Content 2</TabsContent>
          <TabsContent value="tab3">Content 3</TabsContent>
        </Tabs>,
      )

      const tab3 = screen.getByText('Tab 3')
      tab3.focus()

      await user.keyboard('{Home}')
      expect(screen.getByText('Tab 1')).toHaveFocus()
    })

    it('should focus last tab with End key', async () => {
      const user = userEvent.setup()

      render(
        <Tabs defaultValue="tab1">
          <TabsList>
            <TabsTrigger value="tab1">Tab 1</TabsTrigger>
            <TabsTrigger value="tab2">Tab 2</TabsTrigger>
            <TabsTrigger value="tab3">Tab 3</TabsTrigger>
          </TabsList>
          <TabsContent value="tab1">Content 1</TabsContent>
          <TabsContent value="tab2">Content 2</TabsContent>
          <TabsContent value="tab3">Content 3</TabsContent>
        </Tabs>,
      )

      const tab1 = screen.getByText('Tab 1')
      tab1.focus()

      await user.keyboard('{End}')
      expect(screen.getByText('Tab 3')).toHaveFocus()
    })
  })

  describe('Disabled State', () => {
    it('should render disabled trigger', () => {
      render(
        <Tabs defaultValue="tab1">
          <TabsList>
            <TabsTrigger value="tab1">Tab 1</TabsTrigger>
            <TabsTrigger value="tab2" disabled>
              Tab 2
            </TabsTrigger>
          </TabsList>
          <TabsContent value="tab1">Content 1</TabsContent>
          <TabsContent value="tab2">Content 2</TabsContent>
        </Tabs>,
      )

      const tab2 = screen.getByText('Tab 2')
      expect(tab2).toBeDisabled()
    })

    it('should not switch to disabled tab on click', async () => {
      const user = userEvent.setup()

      render(
        <Tabs defaultValue="tab1">
          <TabsList>
            <TabsTrigger value="tab1">Tab 1</TabsTrigger>
            <TabsTrigger value="tab2" disabled>
              Tab 2
            </TabsTrigger>
          </TabsList>
          <TabsContent value="tab1">Content 1</TabsContent>
          <TabsContent value="tab2">Content 2</TabsContent>
        </Tabs>,
      )

      await user.click(screen.getByText('Tab 2'))

      expect(screen.getByText('Content 1')).toBeInTheDocument()
      expect(screen.queryByText('Content 2')).not.toBeInTheDocument()
    })

    it('should skip disabled tabs with keyboard navigation', async () => {
      const user = userEvent.setup()

      render(
        <Tabs defaultValue="tab1">
          <TabsList>
            <TabsTrigger value="tab1">Tab 1</TabsTrigger>
            <TabsTrigger value="tab2" disabled>
              Tab 2
            </TabsTrigger>
            <TabsTrigger value="tab3">Tab 3</TabsTrigger>
          </TabsList>
          <TabsContent value="tab1">Content 1</TabsContent>
          <TabsContent value="tab2">Content 2</TabsContent>
          <TabsContent value="tab3">Content 3</TabsContent>
        </Tabs>,
      )

      const tab1 = screen.getByText('Tab 1')
      tab1.focus()

      await user.keyboard('{ArrowRight}')
      expect(screen.getByText('Tab 3')).toHaveFocus()
    })
  })

  describe('Controlled Mode', () => {
    it('should work in controlled mode', async () => {
      const user = userEvent.setup()
      const onValueChange = jest.fn()

      const { rerender } = render(
        <Tabs value="tab1" onValueChange={onValueChange}>
          <TabsList>
            <TabsTrigger value="tab1">Tab 1</TabsTrigger>
            <TabsTrigger value="tab2">Tab 2</TabsTrigger>
          </TabsList>
          <TabsContent value="tab1">Content 1</TabsContent>
          <TabsContent value="tab2">Content 2</TabsContent>
        </Tabs>,
      )

      expect(screen.getByText('Content 1')).toBeInTheDocument()

      await user.click(screen.getByText('Tab 2'))

      expect(onValueChange).toHaveBeenCalledWith('tab2')

      rerender(
        <Tabs value="tab2" onValueChange={onValueChange}>
          <TabsList>
            <TabsTrigger value="tab1">Tab 1</TabsTrigger>
            <TabsTrigger value="tab2">Tab 2</TabsTrigger>
          </TabsList>
          <TabsContent value="tab1">Content 1</TabsContent>
          <TabsContent value="tab2">Content 2</TabsContent>
        </Tabs>,
      )

      expect(screen.getByText('Content 2')).toBeInTheDocument()
    })

    it('should call onValueChange callback', async () => {
      const user = userEvent.setup()
      const onValueChange = jest.fn()

      render(
        <Tabs defaultValue="tab1" onValueChange={onValueChange}>
          <TabsList>
            <TabsTrigger value="tab1">Tab 1</TabsTrigger>
            <TabsTrigger value="tab2">Tab 2</TabsTrigger>
          </TabsList>
          <TabsContent value="tab1">Content 1</TabsContent>
          <TabsContent value="tab2">Content 2</TabsContent>
        </Tabs>,
      )

      await user.click(screen.getByText('Tab 2'))

      expect(onValueChange).toHaveBeenCalledWith('tab2')
      expect(onValueChange).toHaveBeenCalledTimes(1)
    })
  })

  describe('Accessibility', () => {
    it('should have correct ARIA roles', () => {
      render(
        <Tabs defaultValue="tab1">
          <TabsList>
            <TabsTrigger value="tab1">Tab 1</TabsTrigger>
            <TabsTrigger value="tab2">Tab 2</TabsTrigger>
          </TabsList>
          <TabsContent value="tab1">Content 1</TabsContent>
          <TabsContent value="tab2">Content 2</TabsContent>
        </Tabs>,
      )

      expect(screen.getByRole('tablist')).toBeInTheDocument()
      expect(screen.getAllByRole('tab')).toHaveLength(2)
      expect(screen.getByRole('tabpanel')).toBeInTheDocument()
    })

    it('should have correct aria-selected attributes', async () => {
      const user = userEvent.setup()

      render(
        <Tabs defaultValue="tab1">
          <TabsList>
            <TabsTrigger value="tab1">Tab 1</TabsTrigger>
            <TabsTrigger value="tab2">Tab 2</TabsTrigger>
          </TabsList>
          <TabsContent value="tab1">Content 1</TabsContent>
          <TabsContent value="tab2">Content 2</TabsContent>
        </Tabs>,
      )

      const tab1 = screen.getByText('Tab 1')
      const tab2 = screen.getByText('Tab 2')

      expect(tab1).toHaveAttribute('aria-selected', 'true')
      expect(tab2).toHaveAttribute('aria-selected', 'false')

      await user.click(tab2)

      expect(tab1).toHaveAttribute('aria-selected', 'false')
      expect(tab2).toHaveAttribute('aria-selected', 'true')
    })

    it('should have aria-controls linking tab to panel', () => {
      render(
        <Tabs defaultValue="tab1">
          <TabsList>
            <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          </TabsList>
          <TabsContent value="tab1">Content 1</TabsContent>
        </Tabs>,
      )

      const tab = screen.getByRole('tab')
      const panel = screen.getByRole('tabpanel')

      const panelId = panel.getAttribute('id')
      expect(panelId).toBeTruthy()
      expect(tab).toHaveAttribute('aria-controls', panelId!)
    })

    it('should have correct aria-orientation for vertical tabs', () => {
      render(
        <Tabs defaultValue="tab1" orientation="vertical">
          <TabsList>
            <TabsTrigger value="tab1">Tab 1</TabsTrigger>
            <TabsTrigger value="tab2">Tab 2</TabsTrigger>
          </TabsList>
          <TabsContent value="tab1">Content 1</TabsContent>
          <TabsContent value="tab2">Content 2</TabsContent>
        </Tabs>,
      )

      const tablist = screen.getByRole('tablist')
      expect(tablist).toHaveAttribute('aria-orientation', 'vertical')
    })
  })

  describe('Orientation', () => {
    it('should render horizontal tabs by default', () => {
      render(
        <Tabs defaultValue="tab1">
          <TabsList>
            <TabsTrigger value="tab1">Tab 1</TabsTrigger>
            <TabsTrigger value="tab2">Tab 2</TabsTrigger>
          </TabsList>
          <TabsContent value="tab1">Content 1</TabsContent>
          <TabsContent value="tab2">Content 2</TabsContent>
        </Tabs>,
      )

      const tablist = screen.getByRole('tablist')
      expect(tablist).toHaveAttribute('aria-orientation', 'horizontal')
    })

    it('should render vertical tabs', () => {
      render(
        <Tabs defaultValue="tab1" orientation="vertical">
          <TabsList>
            <TabsTrigger value="tab1">Tab 1</TabsTrigger>
            <TabsTrigger value="tab2">Tab 2</TabsTrigger>
          </TabsList>
          <TabsContent value="tab1">Content 1</TabsContent>
          <TabsContent value="tab2">Content 2</TabsContent>
        </Tabs>,
      )

      const tablist = screen.getByRole('tablist')
      expect(tablist).toHaveAttribute('aria-orientation', 'vertical')
    })

    it('should navigate vertical tabs with arrow up/down', async () => {
      const user = userEvent.setup()

      render(
        <Tabs defaultValue="tab1" orientation="vertical">
          <TabsList>
            <TabsTrigger value="tab1">Tab 1</TabsTrigger>
            <TabsTrigger value="tab2">Tab 2</TabsTrigger>
            <TabsTrigger value="tab3">Tab 3</TabsTrigger>
          </TabsList>
          <TabsContent value="tab1">Content 1</TabsContent>
          <TabsContent value="tab2">Content 2</TabsContent>
          <TabsContent value="tab3">Content 3</TabsContent>
        </Tabs>,
      )

      const tab1 = screen.getByText('Tab 1')
      tab1.focus()

      await user.keyboard('{ArrowDown}')
      expect(screen.getByText('Tab 2')).toHaveFocus()

      await user.keyboard('{ArrowDown}')
      expect(screen.getByText('Tab 3')).toHaveFocus()

      await user.keyboard('{ArrowUp}')
      expect(screen.getByText('Tab 2')).toHaveFocus()
    })
  })

  describe('Edge Cases', () => {
    it('should handle empty content', () => {
      render(
        <Tabs defaultValue="tab1">
          <TabsList>
            <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          </TabsList>
          <TabsContent value="tab1"></TabsContent>
        </Tabs>,
      )

      expect(screen.getByRole('tabpanel')).toBeInTheDocument()
      expect(screen.getByRole('tabpanel')).toBeEmptyDOMElement()
    })

    it('should handle single tab', () => {
      render(
        <Tabs defaultValue="tab1">
          <TabsList>
            <TabsTrigger value="tab1">Only Tab</TabsTrigger>
          </TabsList>
          <TabsContent value="tab1">Only Content</TabsContent>
        </Tabs>,
      )

      expect(screen.getByText('Only Tab')).toBeInTheDocument()
      expect(screen.getByText('Only Content')).toBeInTheDocument()
    })

    it('should handle many tabs', () => {
      render(
        <Tabs defaultValue="tab1">
          <TabsList>
            {Array.from({ length: 10 }, (_, i) => (
              <TabsTrigger key={i} value={`tab${i + 1}`}>
                Tab {i + 1}
              </TabsTrigger>
            ))}
          </TabsList>
          {Array.from({ length: 10 }, (_, i) => (
            <TabsContent key={i} value={`tab${i + 1}`}>
              Content {i + 1}
            </TabsContent>
          ))}
        </Tabs>,
      )

      expect(screen.getAllByRole('tab')).toHaveLength(10)
      expect(screen.getByText('Content 1')).toBeInTheDocument()
    })

    it('should forward ref to TabsList', () => {
      const ref = jest.fn()

      render(
        <Tabs defaultValue="tab1">
          <TabsList ref={ref}>
            <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          </TabsList>
          <TabsContent value="tab1">Content 1</TabsContent>
        </Tabs>,
      )

      expect(ref).toHaveBeenCalled()
    })

    it('should forward ref to TabsTrigger', () => {
      const ref = jest.fn()

      render(
        <Tabs defaultValue="tab1">
          <TabsList>
            <TabsTrigger value="tab1" ref={ref}>
              Tab 1
            </TabsTrigger>
          </TabsList>
          <TabsContent value="tab1">Content 1</TabsContent>
        </Tabs>,
      )

      expect(ref).toHaveBeenCalled()
    })

    it('should forward ref to TabsContent', () => {
      const ref = jest.fn()

      render(
        <Tabs defaultValue="tab1">
          <TabsList>
            <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          </TabsList>
          <TabsContent value="tab1" ref={ref}>
            Content 1
          </TabsContent>
        </Tabs>,
      )

      expect(ref).toHaveBeenCalled()
    })
  })
})
