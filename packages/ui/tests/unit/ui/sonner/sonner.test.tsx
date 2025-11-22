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

    it('should display toast with description', async () => {
      const user = userEvent.setup()

      render(
        <div>
          <Toaster />
          <Button
            onClick={() =>
              toast('Title', {
                description: 'Description text',
              })
            }
          >
            Show Toast
          </Button>
        </div>,
      )

      await user.click(screen.getByText('Show Toast'))

      await waitFor(() => {
        expect(screen.getByText('Title')).toBeInTheDocument()
        expect(screen.getByText('Description text')).toBeInTheDocument()
      })
    })
  })

  describe('Toast Types', () => {
    it('should display success toast', async () => {
      const user = userEvent.setup()

      render(
        <div>
          <Toaster />
          <Button onClick={() => toast.success('Success message')}>
            Show Success
          </Button>
        </div>,
      )

      await user.click(screen.getByText('Show Success'))

      await waitFor(() => {
        expect(screen.getByText('Success message')).toBeInTheDocument()
      })
    })

    it('should display error toast', async () => {
      const user = userEvent.setup()

      render(
        <div>
          <Toaster />
          <Button onClick={() => toast.error('Error message')}>
            Show Error
          </Button>
        </div>,
      )

      await user.click(screen.getByText('Show Error'))

      await waitFor(() => {
        expect(screen.getByText('Error message')).toBeInTheDocument()
      })
    })

    it('should display warning toast', async () => {
      const user = userEvent.setup()

      render(
        <div>
          <Toaster />
          <Button onClick={() => toast.warning('Warning message')}>
            Show Warning
          </Button>
        </div>,
      )

      await user.click(screen.getByText('Show Warning'))

      await waitFor(() => {
        expect(screen.getByText('Warning message')).toBeInTheDocument()
      })
    })

    it('should display info toast', async () => {
      const user = userEvent.setup()

      render(
        <div>
          <Toaster />
          <Button onClick={() => toast.info('Info message')}>Show Info</Button>
        </div>,
      )

      await user.click(screen.getByText('Show Info'))

      await waitFor(() => {
        expect(screen.getByText('Info message')).toBeInTheDocument()
      })
    })
  })

  describe('Toast Actions', () => {
    it('should render toast with action button', async () => {
      const user = userEvent.setup()
      const actionCallback = jest.fn()

      render(
        <div>
          <Toaster />
          <Button
            onClick={() =>
              toast('Message', {
                action: {
                  label: 'Undo',
                  onClick: actionCallback,
                },
              })
            }
          >
            Show Toast
          </Button>
        </div>,
      )

      await user.click(screen.getByText('Show Toast'))

      await waitFor(() => {
        expect(screen.getByText('Undo')).toBeInTheDocument()
      })

      await user.click(screen.getByText('Undo'))

      expect(actionCallback).toHaveBeenCalled()
    })

    it('should render toast with cancel button', async () => {
      const user = userEvent.setup()
      const cancelCallback = jest.fn()

      render(
        <div>
          <Toaster />
          <Button
            onClick={() =>
              toast('Message', {
                cancel: {
                  label: 'Cancel',
                  onClick: cancelCallback,
                },
              })
            }
          >
            Show Toast
          </Button>
        </div>,
      )

      await user.click(screen.getByText('Show Toast'))

      await waitFor(() => {
        expect(screen.getByText('Cancel')).toBeInTheDocument()
      })

      await user.click(screen.getByText('Cancel'))

      expect(cancelCallback).toHaveBeenCalled()
    })
  })

  describe('Toast Promise', () => {
    it('should handle promise states', async () => {
      const user = userEvent.setup()

      render(
        <div>
          <Toaster />
          <Button
            onClick={() => {
              const promise = (): Promise<string> =>
                new Promise((resolve) =>
                  setTimeout(() => resolve('Success'), 100),
                )

              toast.promise(promise, {
                loading: 'Loading...',
                success: 'Success message',
                error: 'Error message',
              })
            }}
          >
            Show Promise
          </Button>
        </div>,
      )

      await user.click(screen.getByText('Show Promise'))

      await waitFor(() => {
        expect(screen.getByText('Loading...')).toBeInTheDocument()
      })

      await waitFor(
        () => {
          expect(screen.getByText('Success message')).toBeInTheDocument()
        },
        { timeout: 2000 },
      )
    })
  })

  describe('Toast Dismissal', () => {
    it('should allow dismissing toast', async () => {
      const user = userEvent.setup()

      render(
        <div>
          <Toaster />
          <Button onClick={() => toast('Dismissible toast')}>Show Toast</Button>
        </div>,
      )

      await user.click(screen.getByText('Show Toast'))

      await waitFor(() => {
        expect(screen.getByText('Dismissible toast')).toBeInTheDocument()
      })

      const closeButton = document.querySelector('[data-close-button]')
      if (closeButton) {
        await user.click(closeButton)

        await waitFor(() => {
          expect(
            screen.queryByText('Dismissible toast'),
          ).not.toBeInTheDocument()
        })
      }
    })

    it('should respect dismissible prop', async () => {
      const user = userEvent.setup()

      render(
        <div>
          <Toaster />
          <Button
            onClick={() => toast('Non-dismissible', { dismissible: false })}
          >
            Show Toast
          </Button>
        </div>,
      )

      await user.click(screen.getByText('Show Toast'))

      await waitFor(() => {
        expect(screen.getByText('Non-dismissible')).toBeInTheDocument()
      })

      const closeButton = document.querySelector('[data-close-button]')
      expect(closeButton).not.toBeInTheDocument()
    })
  })

  describe('Toast Duration', () => {
    it('should auto-dismiss after duration', async () => {
      const user = userEvent.setup()

      render(
        <div>
          <Toaster />
          <Button onClick={() => toast('Auto dismiss', { duration: 500 })}>
            Show Toast
          </Button>
        </div>,
      )

      await user.click(screen.getByText('Show Toast'))

      await waitFor(() => {
        expect(screen.getByText('Auto dismiss')).toBeInTheDocument()
      })

      await waitFor(
        () => {
          expect(screen.queryByText('Auto dismiss')).not.toBeInTheDocument()
        },
        { timeout: 1000 },
      )
    })
  })
})
