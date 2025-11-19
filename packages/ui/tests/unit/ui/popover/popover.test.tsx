import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover/popover'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

describe('Popover', () => {
  describe('Rendering', () => {
    it('should render trigger button', () => {
      render(
        <Popover>
          <PopoverTrigger>Open</PopoverTrigger>
        </Popover>,
      )

      expect(screen.getByText('Open')).toBeInTheDocument()
    })

    it('should not render content initially', () => {
      render(
        <Popover>
          <PopoverTrigger>Open</PopoverTrigger>
          <PopoverContent>Content</PopoverContent>
        </Popover>,
      )

      expect(screen.queryByText('Content')).not.toBeInTheDocument()
    })

    it('should render with custom className on content', async () => {
      const user = userEvent.setup()

      render(
        <Popover>
          <PopoverTrigger>Open</PopoverTrigger>
          <PopoverContent className="custom-class">Content</PopoverContent>
        </Popover>,
      )

      await user.click(screen.getByText('Open'))

      await waitFor(() => {
        const content = screen.getByText('Content')
        expect(content).toHaveClass('custom-class')
      })
    })
  })

  describe('Interaction', () => {
    it('should open popover when trigger clicked', async () => {
      const user = userEvent.setup()

      render(
        <Popover>
          <PopoverTrigger>Open</PopoverTrigger>
          <PopoverContent>Content</PopoverContent>
        </Popover>,
      )

      await user.click(screen.getByText('Open'))

      await waitFor(() => {
        expect(screen.getByText('Content')).toBeInTheDocument()
      })
    })

    it('should close popover when clicking outside', async () => {
      const user = userEvent.setup()

      render(
        <div>
          <Popover>
            <PopoverTrigger>Open</PopoverTrigger>
            <PopoverContent>Content</PopoverContent>
          </Popover>
          <button>Outside</button>
        </div>,
      )

      await user.click(screen.getByText('Open'))

      await waitFor(() => {
        expect(screen.getByText('Content')).toBeInTheDocument()
      })

      await user.click(screen.getByText('Outside'))

      await waitFor(() => {
        expect(screen.queryByText('Content')).not.toBeInTheDocument()
      })
    })
  })
})
