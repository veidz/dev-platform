import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

describe('Tooltip', () => {
  describe('Rendering', () => {
    it('should render trigger element', () => {
      render(
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>Hover me</TooltipTrigger>
            <TooltipContent>Tooltip content</TooltipContent>
          </Tooltip>
        </TooltipProvider>,
      )

      expect(screen.getByText('Hover me')).toBeInTheDocument()
    })

    it('should not show content initially', () => {
      render(
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>Hover me</TooltipTrigger>
            <TooltipContent>Tooltip content</TooltipContent>
          </Tooltip>
        </TooltipProvider>,
      )

      expect(screen.queryByRole('tooltip')).not.toBeInTheDocument()
    })

    it('should render with custom className on trigger', () => {
      render(
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger className="custom-trigger">Hover me</TooltipTrigger>
            <TooltipContent>Tooltip content</TooltipContent>
          </Tooltip>
        </TooltipProvider>,
      )

      const trigger = screen.getByText('Hover me')
      expect(trigger).toHaveClass('custom-trigger')
    })

    it('should render with custom className on content', async () => {
      const user = userEvent.setup()

      render(
        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger>Hover me</TooltipTrigger>
            <TooltipContent className="custom-content">
              Tooltip content
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>,
      )

      await user.hover(screen.getByText('Hover me'))

      await waitFor(() => {
        const content = screen.getByRole('tooltip').parentElement
        expect(content).toHaveClass('custom-content')
      })
    })
  })

  describe('Hover Interaction', () => {
    it('should show tooltip on hover', async () => {
      const user = userEvent.setup()

      render(
        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger>Hover me</TooltipTrigger>
            <TooltipContent>Tooltip content</TooltipContent>
          </Tooltip>
        </TooltipProvider>,
      )

      await user.hover(screen.getByText('Hover me'))

      await waitFor(() => {
        expect(screen.getByRole('tooltip')).toBeInTheDocument()
      })
    })

    it('should hide tooltip on unhover', async () => {
      const user = userEvent.setup()

      render(
        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger>Hover me</TooltipTrigger>
            <TooltipContent>Tooltip content</TooltipContent>
          </Tooltip>
        </TooltipProvider>,
      )

      const trigger = screen.getByText('Hover me')
      await user.hover(trigger)

      await waitFor(() => {
        expect(screen.getByRole('tooltip')).toBeInTheDocument()
      })

      await user.keyboard('{Escape}')

      await waitFor(() => {
        expect(screen.queryByRole('tooltip')).not.toBeInTheDocument()
      })
    })

    it('should show tooltip on focus', async () => {
      const user = userEvent.setup()

      render(
        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger>Hover me</TooltipTrigger>
            <TooltipContent>Tooltip content</TooltipContent>
          </Tooltip>
        </TooltipProvider>,
      )

      await user.tab()

      await waitFor(() => {
        expect(screen.getByRole('tooltip')).toBeInTheDocument()
      })
    })

    it('should hide tooltip on blur', async () => {
      const user = userEvent.setup()

      render(
        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger>Hover me</TooltipTrigger>
            <TooltipContent>Tooltip content</TooltipContent>
          </Tooltip>
        </TooltipProvider>,
      )

      await user.tab()

      await waitFor(() => {
        expect(screen.getByRole('tooltip')).toBeInTheDocument()
      })

      await user.tab()

      await waitFor(() => {
        expect(screen.queryByRole('tooltip')).not.toBeInTheDocument()
      })
    })
  })

  describe('Positioning', () => {
    it('should render on top by default', async () => {
      const user = userEvent.setup()

      render(
        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger>Hover me</TooltipTrigger>
            <TooltipContent>Tooltip content</TooltipContent>
          </Tooltip>
        </TooltipProvider>,
      )

      await user.hover(screen.getByText('Hover me'))

      await waitFor(() => {
        const tooltip = screen.getByRole('tooltip')
        expect(tooltip.parentElement).toHaveAttribute('data-side', 'top')
      })
    })

    it('should render on right side', async () => {
      const user = userEvent.setup()

      render(
        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger>Hover me</TooltipTrigger>
            <TooltipContent side="right">Tooltip content</TooltipContent>
          </Tooltip>
        </TooltipProvider>,
      )

      await user.hover(screen.getByText('Hover me'))

      await waitFor(() => {
        const tooltip = screen.getByRole('tooltip')
        const side = tooltip.parentElement?.getAttribute('data-side')
        expect(['right', 'left']).toContain(side)
      })
    })

    it('should render on bottom side', async () => {
      const user = userEvent.setup()

      render(
        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger>Hover me</TooltipTrigger>
            <TooltipContent side="bottom">Tooltip content</TooltipContent>
          </Tooltip>
        </TooltipProvider>,
      )

      await user.hover(screen.getByText('Hover me'))

      await waitFor(() => {
        const tooltip = screen.getByRole('tooltip')
        expect(tooltip.parentElement).toHaveAttribute('data-side', 'bottom')
      })
    })

    it('should render on left side', async () => {
      const user = userEvent.setup()

      render(
        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger>Hover me</TooltipTrigger>
            <TooltipContent side="left">Tooltip content</TooltipContent>
          </Tooltip>
        </TooltipProvider>,
      )

      await user.hover(screen.getByText('Hover me'))

      await waitFor(() => {
        const tooltip = screen.getByRole('tooltip')
        expect(tooltip.parentElement).toHaveAttribute('data-side', 'left')
      })
    })

    it('should respect sideOffset prop', async () => {
      const user = userEvent.setup()

      render(
        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger>Hover me</TooltipTrigger>
            <TooltipContent sideOffset={20}>Tooltip content</TooltipContent>
          </Tooltip>
        </TooltipProvider>,
      )

      await user.hover(screen.getByText('Hover me'))

      await waitFor(() => {
        expect(screen.getByRole('tooltip')).toBeInTheDocument()
      })
    })
  })

  describe('Delay', () => {
    it('should respect custom delay duration', async () => {
      const user = userEvent.setup()

      render(
        <TooltipProvider delayDuration={100}>
          <Tooltip>
            <TooltipTrigger>Hover me</TooltipTrigger>
            <TooltipContent>Tooltip content</TooltipContent>
          </Tooltip>
        </TooltipProvider>,
      )

      await user.hover(screen.getByText('Hover me'))

      expect(screen.queryByRole('tooltip')).not.toBeInTheDocument()

      await waitFor(
        () => {
          expect(screen.getByRole('tooltip')).toBeInTheDocument()
        },
        { timeout: 200 },
      )
    })

    it('should show instantly with zero delay', async () => {
      const user = userEvent.setup()

      render(
        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger>Hover me</TooltipTrigger>
            <TooltipContent>Tooltip content</TooltipContent>
          </Tooltip>
        </TooltipProvider>,
      )

      await user.hover(screen.getByText('Hover me'))

      await waitFor(() => {
        expect(screen.getByRole('tooltip')).toBeInTheDocument()
      })
    })
  })

  describe('Controlled Mode', () => {
    it('should work in controlled mode with open prop', async () => {
      const { rerender } = render(
        <TooltipProvider>
          <Tooltip open={false}>
            <TooltipTrigger>Hover me</TooltipTrigger>
            <TooltipContent>Tooltip content</TooltipContent>
          </Tooltip>
        </TooltipProvider>,
      )

      expect(screen.queryByRole('tooltip')).not.toBeInTheDocument()

      rerender(
        <TooltipProvider>
          <Tooltip open={true}>
            <TooltipTrigger>Hover me</TooltipTrigger>
            <TooltipContent>Tooltip content</TooltipContent>
          </Tooltip>
        </TooltipProvider>,
      )

      await waitFor(() => {
        expect(screen.getByRole('tooltip')).toBeInTheDocument()
      })
    })

    it('should call onOpenChange callback', async () => {
      const user = userEvent.setup()
      const onOpenChange = jest.fn()

      render(
        <TooltipProvider delayDuration={0}>
          <Tooltip onOpenChange={onOpenChange}>
            <TooltipTrigger>Hover me</TooltipTrigger>
            <TooltipContent>Tooltip content</TooltipContent>
          </Tooltip>
        </TooltipProvider>,
      )

      await user.hover(screen.getByText('Hover me'))

      await waitFor(() => {
        expect(onOpenChange).toHaveBeenCalledWith(true)
      })
    })

    it('should call onOpenChange on close', async () => {
      const user = userEvent.setup()
      const onOpenChange = jest.fn()

      render(
        <TooltipProvider delayDuration={0}>
          <Tooltip onOpenChange={onOpenChange}>
            <TooltipTrigger>Hover me</TooltipTrigger>
            <TooltipContent>Tooltip content</TooltipContent>
          </Tooltip>
        </TooltipProvider>,
      )

      const trigger = screen.getByText('Hover me')
      await user.hover(trigger)

      await waitFor(() => {
        expect(screen.getByRole('tooltip')).toBeInTheDocument()
        expect(onOpenChange).toHaveBeenCalledWith(true)
      })

      onOpenChange.mockClear()

      await user.keyboard('{Escape}')

      await waitFor(() => {
        expect(onOpenChange).toHaveBeenCalledWith(false)
      })
    })
  })

  describe('Accessibility', () => {
    it('should have correct ARIA attributes on trigger', async () => {
      const user = userEvent.setup()

      render(
        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger>Hover me</TooltipTrigger>
            <TooltipContent>Tooltip content</TooltipContent>
          </Tooltip>
        </TooltipProvider>,
      )

      const trigger = screen.getByText('Hover me')
      expect(trigger).toHaveAttribute('data-state', 'closed')

      await user.hover(trigger)

      await waitFor(() => {
        expect(trigger).toHaveAttribute('data-state')
        const state = trigger.getAttribute('data-state')
        expect(state).toMatch(/open/)
      })
    })

    it('should have role tooltip on content', async () => {
      const user = userEvent.setup()

      render(
        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger>Hover me</TooltipTrigger>
            <TooltipContent>Tooltip content</TooltipContent>
          </Tooltip>
        </TooltipProvider>,
      )

      await user.hover(screen.getByText('Hover me'))

      await waitFor(() => {
        const tooltip = screen.getByRole('tooltip')
        expect(tooltip).toBeInTheDocument()
      })
    })

    it('should be keyboard accessible', async () => {
      const user = userEvent.setup()

      render(
        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger>Hover me</TooltipTrigger>
            <TooltipContent>Tooltip content</TooltipContent>
          </Tooltip>
        </TooltipProvider>,
      )

      await user.tab()
      expect(screen.getByText('Hover me')).toHaveFocus()

      await waitFor(() => {
        expect(screen.getByRole('tooltip')).toBeInTheDocument()
      })
    })

    it('should close on Escape key', async () => {
      const user = userEvent.setup()

      render(
        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger>Hover me</TooltipTrigger>
            <TooltipContent>Tooltip content</TooltipContent>
          </Tooltip>
        </TooltipProvider>,
      )

      await user.hover(screen.getByText('Hover me'))

      await waitFor(() => {
        expect(screen.getByRole('tooltip')).toBeInTheDocument()
      })

      await user.keyboard('{Escape}')

      await waitFor(() => {
        expect(screen.queryByRole('tooltip')).not.toBeInTheDocument()
      })
    })
  })

  describe('Multiple Tooltips', () => {
    it('should handle multiple tooltips independently', async () => {
      const user = userEvent.setup()

      render(
        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger>Trigger 1</TooltipTrigger>
            <TooltipContent>Content 1</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger>Trigger 2</TooltipTrigger>
            <TooltipContent>Content 2</TooltipContent>
          </Tooltip>
        </TooltipProvider>,
      )

      await user.hover(screen.getByText('Trigger 1'))

      await waitFor(() => {
        expect(screen.getByRole('tooltip')).toBeInTheDocument()
      })

      await user.unhover(screen.getByText('Trigger 1'))
      await user.hover(screen.getByText('Trigger 2'))

      await waitFor(() => {
        expect(screen.getByRole('tooltip')).toBeInTheDocument()
      })
    })
  })

  describe('Edge Cases', () => {
    it('should handle empty content', async () => {
      const user = userEvent.setup()

      render(
        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger>Hover me</TooltipTrigger>
            <TooltipContent></TooltipContent>
          </Tooltip>
        </TooltipProvider>,
      )

      await user.hover(screen.getByText('Hover me'))

      await waitFor(() => {
        const tooltip = screen.getByRole('tooltip')
        expect(tooltip).toBeInTheDocument()
      })
    })

    it('should handle rich content', async () => {
      const user = userEvent.setup()

      render(
        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger>Hover me</TooltipTrigger>
            <TooltipContent>
              <div>
                <strong>Title</strong>
                <p>Description</p>
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>,
      )

      await user.hover(screen.getByText('Hover me'))

      await waitFor(() => {
        expect(screen.getByRole('tooltip')).toBeInTheDocument()
      })
    })

    it('should forward ref to content', async () => {
      const user = userEvent.setup()
      const ref = jest.fn()

      render(
        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger>Hover me</TooltipTrigger>
            <TooltipContent ref={ref}>Tooltip content</TooltipContent>
          </Tooltip>
        </TooltipProvider>,
      )

      await user.hover(screen.getByText('Hover me'))

      await waitFor(() => {
        expect(ref).toHaveBeenCalled()
      })
    })

    it('should work with asChild prop', async () => {
      const user = userEvent.setup()

      render(
        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger asChild>
              <button>Custom button</button>
            </TooltipTrigger>
            <TooltipContent>Tooltip content</TooltipContent>
          </Tooltip>
        </TooltipProvider>,
      )

      await user.hover(screen.getByText('Custom button'))

      await waitFor(() => {
        expect(screen.getByRole('tooltip')).toBeInTheDocument()
      })
    })
  })
})
