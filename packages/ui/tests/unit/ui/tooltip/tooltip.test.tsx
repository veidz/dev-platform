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
})
