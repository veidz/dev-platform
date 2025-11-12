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
  })
})
