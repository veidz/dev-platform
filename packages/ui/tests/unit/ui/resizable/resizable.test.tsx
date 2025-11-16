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
  })
})
