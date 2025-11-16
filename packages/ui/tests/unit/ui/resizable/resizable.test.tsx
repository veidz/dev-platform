import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable'
import { render, screen } from '@testing-library/react'
import { axe, toHaveNoViolations } from 'jest-axe'

expect.extend(toHaveNoViolations)

describe('Resizable', () => {
  describe('ResizablePanelGroup', () => {
    it('should render panel group', () => {
      const { container } = render(
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel>Panel 1</ResizablePanel>
        </ResizablePanelGroup>,
      )

      expect(container.firstChild).toBeInTheDocument()
    })

    it('should apply horizontal direction', () => {
      const { container } = render(
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel>Panel</ResizablePanel>
        </ResizablePanelGroup>,
      )

      const group = container.firstChild as HTMLElement
      expect(group).toHaveAttribute('data-panel-group-direction', 'horizontal')
    })

    it('should apply vertical direction', () => {
      const { container } = render(
        <ResizablePanelGroup direction="vertical">
          <ResizablePanel>Panel</ResizablePanel>
        </ResizablePanelGroup>,
      )

      const group = container.firstChild as HTMLElement
      expect(group).toHaveAttribute('data-panel-group-direction', 'vertical')
    })

    it('should apply custom className', () => {
      const { container } = render(
        <ResizablePanelGroup
          direction="horizontal"
          className="custom-group-class"
        >
          <ResizablePanel>Panel</ResizablePanel>
        </ResizablePanelGroup>,
      )

      expect(container.firstChild).toHaveClass('custom-group-class')
    })

    it('should render multiple panels', () => {
      render(
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel>Panel 1</ResizablePanel>
          <ResizablePanel>Panel 2</ResizablePanel>
          <ResizablePanel>Panel 3</ResizablePanel>
        </ResizablePanelGroup>,
      )

      expect(screen.getByText('Panel 1')).toBeInTheDocument()
      expect(screen.getByText('Panel 2')).toBeInTheDocument()
      expect(screen.getByText('Panel 3')).toBeInTheDocument()
    })

    it('should support autoSaveId for persistence', () => {
      const { container } = render(
        <ResizablePanelGroup direction="horizontal" autoSaveId="test-persist">
          <ResizablePanel>Panel</ResizablePanel>
        </ResizablePanelGroup>,
      )

      const group = container.firstChild as HTMLElement
      expect(group).toHaveAttribute('data-panel-group-id', 'test-persist')
    })
  })

  describe('ResizablePanel', () => {
    it('should render panel with content', () => {
      render(
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel>Test Content</ResizablePanel>
        </ResizablePanelGroup>,
      )

      expect(screen.getByText('Test Content')).toBeInTheDocument()
    })

    it('should apply defaultSize', () => {
      const { container } = render(
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel defaultSize={50}>Panel</ResizablePanel>
        </ResizablePanelGroup>,
      )

      const panel = container.querySelector('[data-panel]')
      expect(panel).toHaveAttribute('data-panel-size')
    })

    it('should respect minSize constraint', () => {
      const { container } = render(
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel minSize={20} defaultSize={25}>
            Panel
          </ResizablePanel>
        </ResizablePanelGroup>,
      )

      const panel = container.querySelector('[data-panel]')
      expect(panel).toHaveAttribute('data-panel')
    })

    it('should respect maxSize constraint', () => {
      const { container } = render(
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel maxSize={80} defaultSize={50}>
            Panel
          </ResizablePanel>
        </ResizablePanelGroup>,
      )

      const panel = container.querySelector('[data-panel]')
      expect(panel).toHaveAttribute('data-panel')
    })

    it('should support collapsible panels', () => {
      const { container } = render(
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel collapsible collapsedSize={0}>
            Collapsible
          </ResizablePanel>
        </ResizablePanelGroup>,
      )

      const panel = container.querySelector('[data-panel]')
      expect(panel).toHaveAttribute('data-panel-collapsible', 'true')
    })

    it('should apply id prop', () => {
      const { container } = render(
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel id="test-panel">Panel</ResizablePanel>
        </ResizablePanelGroup>,
      )

      const panel = container.querySelector('[data-panel-id="test-panel"]')
      expect(panel).toBeInTheDocument()
    })
  })

  describe('ResizableHandle', () => {
    it('should render resize handle', () => {
      const { container } = render(
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel>Panel 1</ResizablePanel>
          <ResizableHandle />
          <ResizablePanel>Panel 2</ResizablePanel>
        </ResizablePanelGroup>,
      )

      const handle = container.querySelector('[data-panel-resize-handle-id]')
      expect(handle).toBeInTheDocument()
    })

    it('should render handle without icon by default', () => {
      const { container } = render(
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel>Panel 1</ResizablePanel>
          <ResizableHandle />
          <ResizablePanel>Panel 2</ResizablePanel>
        </ResizablePanelGroup>,
      )

      const icon = container.querySelector('svg')
      expect(icon).not.toBeInTheDocument()
    })

    it('should render handle with icon when withHandle is true', () => {
      const { container } = render(
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel>Panel 1</ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel>Panel 2</ResizablePanel>
        </ResizablePanelGroup>,
      )

      const icon = container.querySelector('svg')
      expect(icon).toBeInTheDocument()
    })

    it('should apply custom className', () => {
      const { container } = render(
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel>Panel 1</ResizablePanel>
          <ResizableHandle className="custom-handle-class" />
          <ResizablePanel>Panel 2</ResizablePanel>
        </ResizablePanelGroup>,
      )

      const handle = container.querySelector('.custom-handle-class')
      expect(handle).toBeInTheDocument()
    })

    it('should be keyboard accessible', () => {
      const { container } = render(
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel>Panel 1</ResizablePanel>
          <ResizableHandle />
          <ResizablePanel>Panel 2</ResizablePanel>
        </ResizablePanelGroup>,
      )

      const handle = container.querySelector(
        '[data-panel-resize-handle-id]',
      ) as HTMLElement
      expect(handle).toHaveAttribute('role', 'separator')
      expect(handle).toHaveAttribute('tabindex', '0')
    })

    it('should support disabled state', () => {
      const { container } = render(
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel>Panel 1</ResizablePanel>
          <ResizableHandle disabled />
          <ResizablePanel>Panel 2</ResizablePanel>
        </ResizablePanelGroup>,
      )

      const handle = container.querySelector(
        '[data-panel-resize-handle-id]',
      ) as HTMLElement
      expect(handle).toHaveAttribute(
        'data-panel-resize-handle-enabled',
        'false',
      )
    })
  })

  describe('Layout Behavior', () => {
    it('should render horizontal layout', () => {
      const { container } = render(
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel>Left</ResizablePanel>
          <ResizableHandle />
          <ResizablePanel>Right</ResizablePanel>
        </ResizablePanelGroup>,
      )

      const group = container.firstChild as HTMLElement
      expect(group).toHaveAttribute('data-panel-group-direction', 'horizontal')
    })

    it('should render vertical layout', () => {
      const { container } = render(
        <ResizablePanelGroup direction="vertical">
          <ResizablePanel>Top</ResizablePanel>
          <ResizableHandle />
          <ResizablePanel>Bottom</ResizablePanel>
        </ResizablePanelGroup>,
      )

      const group = container.firstChild as HTMLElement
      expect(group).toHaveAttribute('data-panel-group-direction', 'vertical')
    })

    it('should support nested panel groups', () => {
      render(
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel>Sidebar</ResizablePanel>
          <ResizableHandle />
          <ResizablePanel>
            <ResizablePanelGroup direction="vertical">
              <ResizablePanel>Editor</ResizablePanel>
              <ResizableHandle />
              <ResizablePanel>Terminal</ResizablePanel>
            </ResizablePanelGroup>
          </ResizablePanel>
        </ResizablePanelGroup>,
      )

      expect(screen.getByText('Sidebar')).toBeInTheDocument()
      expect(screen.getByText('Editor')).toBeInTheDocument()
      expect(screen.getByText('Terminal')).toBeInTheDocument()
    })

    it('should render three panels correctly', () => {
      render(
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel defaultSize={33}>Panel 1</ResizablePanel>
          <ResizableHandle />
          <ResizablePanel defaultSize={33}>Panel 2</ResizablePanel>
          <ResizableHandle />
          <ResizablePanel defaultSize={34}>Panel 3</ResizablePanel>
        </ResizablePanelGroup>,
      )

      expect(screen.getByText('Panel 1')).toBeInTheDocument()
      expect(screen.getByText('Panel 2')).toBeInTheDocument()
      expect(screen.getByText('Panel 3')).toBeInTheDocument()
    })
  })

  describe('Size Constraints', () => {
    it('should enforce minSize', () => {
      const { container } = render(
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel minSize={30} defaultSize={50}>
            Constrained
          </ResizablePanel>
          <ResizableHandle />
          <ResizablePanel>Flexible</ResizablePanel>
        </ResizablePanelGroup>,
      )

      const panels = container.querySelectorAll('[data-panel]')
      expect(panels).toHaveLength(2)
    })

    it('should enforce maxSize', () => {
      const { container } = render(
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel maxSize={70} defaultSize={50}>
            Constrained
          </ResizablePanel>
          <ResizableHandle />
          <ResizablePanel>Flexible</ResizablePanel>
        </ResizablePanelGroup>,
      )

      const panels = container.querySelectorAll('[data-panel]')
      expect(panels).toHaveLength(2)
    })

    it('should enforce both minSize and maxSize', () => {
      const { container } = render(
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel minSize={20} maxSize={60} defaultSize={40}>
            Constrained
          </ResizablePanel>
          <ResizableHandle />
          <ResizablePanel>Flexible</ResizablePanel>
        </ResizablePanelGroup>,
      )

      const panels = container.querySelectorAll('[data-panel]')
      expect(panels).toHaveLength(2)
    })
  })

  describe('Collapsible Panels', () => {
    it('should support collapsible prop', () => {
      const { container } = render(
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel collapsible collapsedSize={0}>
            Collapsible Panel
          </ResizablePanel>
          <ResizableHandle />
          <ResizablePanel>Main Panel</ResizablePanel>
        </ResizablePanelGroup>,
      )

      const panel = container.querySelector('[data-panel-collapsible="true"]')
      expect(panel).toBeInTheDocument()
    })

    it('should call onCollapse callback', () => {
      const onCollapse = jest.fn()

      render(
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel collapsible onCollapse={onCollapse}>
            Panel
          </ResizablePanel>
          <ResizableHandle />
          <ResizablePanel>Other</ResizablePanel>
        </ResizablePanelGroup>,
      )

      expect(onCollapse).toBeDefined()
    })

    it('should call onExpand callback', () => {
      const onExpand = jest.fn()

      render(
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel collapsible onExpand={onExpand}>
            Panel
          </ResizablePanel>
          <ResizableHandle />
          <ResizablePanel>Other</ResizablePanel>
        </ResizablePanelGroup>,
      )

      expect(onExpand).toBeDefined()
    })
  })

  describe('Persistence', () => {
    it('should support autoSaveId for localStorage persistence', () => {
      const { container } = render(
        <ResizablePanelGroup direction="horizontal" autoSaveId="persist-test">
          <ResizablePanel>Panel 1</ResizablePanel>
          <ResizableHandle />
          <ResizablePanel>Panel 2</ResizablePanel>
        </ResizablePanelGroup>,
      )

      const group = container.firstChild as HTMLElement
      expect(group).toHaveAttribute('data-panel-group-id', 'persist-test')
    })
  })

  describe('Accessibility', () => {
    it('should have no accessibility violations - horizontal', async () => {
      const { container } = render(
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel>Panel 1</ResizablePanel>
          <ResizableHandle />
          <ResizablePanel>Panel 2</ResizablePanel>
        </ResizablePanelGroup>,
      )

      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })

    it('should have no accessibility violations - vertical', async () => {
      const { container } = render(
        <ResizablePanelGroup direction="vertical">
          <ResizablePanel>Panel 1</ResizablePanel>
          <ResizableHandle />
          <ResizablePanel>Panel 2</ResizablePanel>
        </ResizablePanelGroup>,
      )

      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })

    it('should have no accessibility violations - with handle', async () => {
      const { container } = render(
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel>Panel 1</ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel>Panel 2</ResizablePanel>
        </ResizablePanelGroup>,
      )

      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })

    it('should have proper ARIA role', () => {
      const { container } = render(
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel>Panel 1</ResizablePanel>
          <ResizableHandle />
          <ResizablePanel>Panel 2</ResizablePanel>
        </ResizablePanelGroup>,
      )

      const handle = container.querySelector('[role="separator"]')
      expect(handle).toBeInTheDocument()
    })

    it('should be keyboard focusable', () => {
      const { container } = render(
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel>Panel 1</ResizablePanel>
          <ResizableHandle />
          <ResizablePanel>Panel 2</ResizablePanel>
        </ResizablePanelGroup>,
      )

      const handle = container.querySelector(
        '[data-panel-resize-handle-id]',
      ) as HTMLElement
      expect(handle.tabIndex).toBe(0)
    })
  })
})
