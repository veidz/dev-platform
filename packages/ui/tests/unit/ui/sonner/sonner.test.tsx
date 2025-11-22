import { Button } from '@/components/ui/button/button'
import { Toaster } from '@/components/ui/sonner/sonner'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { toast } from 'sonner'

describe('Sonner', () => {
  describe('Rendering', () => {
    it('should render Toaster component without errors', () => {
      const { container } = render(<Toaster />)
      expect(container).toBeInTheDocument()
    })

    it('should render with custom className when toast is shown', async () => {
      const user = userEvent.setup()

      render(
        <div>
          <Toaster className="custom-toaster" />
          <Button onClick={() => toast('Test')}>Show Toast</Button>
        </div>,
      )

      await user.click(screen.getByText('Show Toast'))

      await waitFor(() => {
        const toaster = document.querySelector('[data-sonner-toaster]')
        expect(toaster).toHaveClass('custom-toaster')
      })
    })

    it('should render in different positions', async () => {
      const user = userEvent.setup()

      const { rerender } = render(
        <div>
          <Toaster position="top-left" />
          <Button onClick={() => toast('Test')}>Show Toast</Button>
        </div>,
      )

      await user.click(screen.getByText('Show Toast'))

      await waitFor(() => {
        expect(
          document.querySelector('[data-sonner-toaster]'),
        ).toBeInTheDocument()
      })

      rerender(
        <div>
          <Toaster position="bottom-right" />
          <Button onClick={() => toast('Test 2')}>Show Toast</Button>
        </div>,
      )

      await user.click(screen.getByText('Show Toast'))

      await waitFor(() => {
        expect(
          document.querySelector('[data-sonner-toaster]'),
        ).toBeInTheDocument()
      })
    })
  })

  describe('Toast Display', () => {
    it('should display a toast message', async () => {
      const user = userEvent.setup()

      render(
        <div>
          <Toaster />
          <Button onClick={() => toast('Test message')}>Show Toast</Button>
        </div>,
      )

      await user.click(screen.getByText('Show Toast'))

      await waitFor(() => {
        expect(screen.getByText('Test message')).toBeInTheDocument()
      })
    })
  })
})
