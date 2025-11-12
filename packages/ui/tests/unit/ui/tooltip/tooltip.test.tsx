import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { render, screen } from '@testing-library/react'

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
  })
})
