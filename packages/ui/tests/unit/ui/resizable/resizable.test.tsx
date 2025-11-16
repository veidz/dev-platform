import { ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable'
import { render } from '@testing-library/react'
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
  })
})
