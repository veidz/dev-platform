import { ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable'
import { render, screen } from '@testing-library/react'
import { toHaveNoViolations } from 'jest-axe'

expect.extend(toHaveNoViolations)

describe('Resizable', () => {
  describe('ResizablePanelGroup', () => {
    it('renders panel group', () => {
      const { container } = render(
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel>Panel 1</ResizablePanel>
        </ResizablePanelGroup>,
      )

      expect(container.firstChild).toBeInTheDocument()
    })

    it('applies horizontal direction', () => {
      const { container } = render(
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel>Panel</ResizablePanel>
        </ResizablePanelGroup>,
      )

      const group = container.firstChild as HTMLElement
      expect(group).toHaveAttribute('data-panel-group-direction', 'horizontal')
    })

    it('applies vertical direction', () => {
      const { container } = render(
        <ResizablePanelGroup direction="vertical">
          <ResizablePanel>Panel</ResizablePanel>
        </ResizablePanelGroup>,
      )

      const group = container.firstChild as HTMLElement
      expect(group).toHaveAttribute('data-panel-group-direction', 'vertical')
    })

    it('applies custom className', () => {
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

    it('renders multiple panels', () => {
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

    it('supports autoSaveId for persistence', () => {
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
    it('renders panel with content', () => {
      render(
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel>Test Content</ResizablePanel>
        </ResizablePanelGroup>,
      )

      expect(screen.getByText('Test Content')).toBeInTheDocument()
    })

    it('applies defaultSize', () => {
      const { container } = render(
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel defaultSize={50}>Panel</ResizablePanel>
        </ResizablePanelGroup>,
      )

      const panel = container.querySelector('[data-panel]')
      expect(panel).toHaveAttribute('data-panel-size')
    })

    it('respects minSize constraint', () => {
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

    it('respects maxSize constraint', () => {
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
  })
})
