import { Button } from '@/components/ui/button/button'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer/drawer'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe } from 'jest-axe'
import React from 'react'

describe('Drawer', () => {
  describe('Rendering', () => {
    it('should render drawer trigger', () => {
      render(
        <Drawer>
          <DrawerTrigger asChild>
            <Button>Open</Button>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Title</DrawerTitle>
            </DrawerHeader>
          </DrawerContent>
        </Drawer>,
      )

      expect(screen.getByText('Open')).toBeInTheDocument()
    })

    it('should not render drawer content initially', () => {
      render(
        <Drawer>
          <DrawerTrigger asChild>
            <Button>Open</Button>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Drawer Title</DrawerTitle>
            </DrawerHeader>
          </DrawerContent>
        </Drawer>,
      )

      expect(screen.queryByText('Drawer Title')).not.toBeInTheDocument()
    })

    it('should render with custom className on content', async () => {
      const user = userEvent.setup()

      render(
        <Drawer>
          <DrawerTrigger asChild>
            <Button>Open</Button>
          </DrawerTrigger>
          <DrawerContent className="custom-drawer">
            <DrawerHeader>
              <DrawerTitle>Title</DrawerTitle>
            </DrawerHeader>
          </DrawerContent>
        </Drawer>,
      )

      await user.click(screen.getByText('Open'))

      await waitFor(() => {
        const content = screen.getByRole('dialog')
        expect(content).toHaveClass('custom-drawer')
      })
    })
  })

  describe('Interaction', () => {
    it('should open drawer on trigger click', async () => {
      const user = userEvent.setup()

      render(
        <Drawer>
          <DrawerTrigger asChild>
            <Button>Open Drawer</Button>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Drawer Title</DrawerTitle>
              <DrawerDescription>Drawer Description</DrawerDescription>
            </DrawerHeader>
          </DrawerContent>
        </Drawer>,
      )

      await user.click(screen.getByText('Open Drawer'))

      await waitFor(() => {
        expect(screen.getByText('Drawer Title')).toBeInTheDocument()
        expect(screen.getByText('Drawer Description')).toBeInTheDocument()
      })
    })

    it('should close drawer when clicking close button', async () => {
      const user = userEvent.setup()

      render(
        <Drawer>
          <DrawerTrigger asChild>
            <Button>Open</Button>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Title</DrawerTitle>
            </DrawerHeader>
            <DrawerFooter>
              <DrawerClose asChild>
                <Button>Close</Button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>,
      )

      await user.click(screen.getByText('Open'))

      await waitFor(() => {
        expect(screen.getByText('Title')).toBeInTheDocument()
      })

      await user.click(screen.getByText('Close'))

      await waitFor(() => {
        const dialog = screen.getByRole('dialog')
        expect(dialog).toHaveAttribute('data-state', 'closed')
      })
    })

    it('should close drawer when pressing escape', async () => {
      const user = userEvent.setup()

      render(
        <Drawer>
          <DrawerTrigger asChild>
            <Button>Open</Button>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Title</DrawerTitle>
            </DrawerHeader>
          </DrawerContent>
        </Drawer>,
      )

      await user.click(screen.getByText('Open'))

      await waitFor(() => {
        expect(screen.getByText('Title')).toBeInTheDocument()
      })

      await user.keyboard('{Escape}')

      await waitFor(() => {
        const dialog = screen.getByRole('dialog')
        expect(dialog).toHaveAttribute('data-state', 'closed')
      })
    })
  })

  describe('Controlled State', () => {
    it('should support controlled open state', async () => {
      const user = userEvent.setup()
      const onOpenChange = jest.fn()

      const ControlledDrawer = () => {
        const [open, setOpen] = React.useState(false)

        const handleOpenChange = (newOpen: boolean) => {
          setOpen(newOpen)
          onOpenChange(newOpen)
        }

        return (
          <>
            <Button onClick={() => handleOpenChange(true)}>
              External Open
            </Button>
            <Drawer open={open} onOpenChange={handleOpenChange}>
              <DrawerContent>
                <DrawerHeader>
                  <DrawerTitle>Controlled</DrawerTitle>
                </DrawerHeader>
              </DrawerContent>
            </Drawer>
          </>
        )
      }

      render(<ControlledDrawer />)

      await user.click(screen.getByText('External Open'))

      await waitFor(() => {
        expect(screen.getByText('Controlled')).toBeInTheDocument()
        expect(onOpenChange).toHaveBeenCalledWith(true)
      })
    })

    it('should handle non-dismissible drawer', async () => {
      const user = userEvent.setup()

      render(
        <Drawer dismissible={false}>
          <DrawerTrigger asChild>
            <Button>Open</Button>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Non-Dismissible</DrawerTitle>
            </DrawerHeader>
            <DrawerFooter>
              <DrawerClose asChild>
                <Button>Close</Button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>,
      )

      await user.click(screen.getByText('Open'))

      await waitFor(() => {
        expect(screen.getByText('Non-Dismissible')).toBeInTheDocument()
      })

      await user.keyboard('{Escape}')

      await waitFor(
        () => {
          expect(screen.getByText('Non-Dismissible')).toBeInTheDocument()
        },
        { timeout: 500 },
      )
    })
  })

  describe('Content Sections', () => {
    it('should render header with title and description', async () => {
      const user = userEvent.setup()

      render(
        <Drawer>
          <DrawerTrigger asChild>
            <Button>Open</Button>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Header Title</DrawerTitle>
              <DrawerDescription>Header Description</DrawerDescription>
            </DrawerHeader>
          </DrawerContent>
        </Drawer>,
      )

      await user.click(screen.getByText('Open'))

      await waitFor(() => {
        expect(screen.getByText('Header Title')).toBeInTheDocument()
        expect(screen.getByText('Header Description')).toBeInTheDocument()
      })
    })

    it('should render footer with buttons', async () => {
      const user = userEvent.setup()

      render(
        <Drawer>
          <DrawerTrigger asChild>
            <Button>Open</Button>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Title</DrawerTitle>
            </DrawerHeader>
            <DrawerFooter>
              <Button>Submit</Button>
              <DrawerClose asChild>
                <Button variant="outline">Cancel</Button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>,
      )

      await user.click(screen.getByText('Open'))

      await waitFor(() => {
        expect(screen.getByText('Submit')).toBeInTheDocument()
        expect(screen.getByText('Cancel')).toBeInTheDocument()
      })
    })

    it('should render custom content', async () => {
      const user = userEvent.setup()

      render(
        <Drawer>
          <DrawerTrigger asChild>
            <Button>Open</Button>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Title</DrawerTitle>
            </DrawerHeader>
            <div data-testid="custom-content">Custom drawer content</div>
          </DrawerContent>
        </Drawer>,
      )

      await user.click(screen.getByText('Open'))

      await waitFor(() => {
        expect(screen.getByTestId('custom-content')).toHaveTextContent(
          'Custom drawer content',
        )
      })
    })
  })

  describe('Nested Drawers', () => {
    it('should support nested drawers', async () => {
      const user = userEvent.setup()

      render(
        <Drawer>
          <DrawerTrigger asChild>
            <Button>Open Outer</Button>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Outer Drawer</DrawerTitle>
            </DrawerHeader>
            <div>
              <Drawer>
                <DrawerTrigger asChild>
                  <Button>Open Inner</Button>
                </DrawerTrigger>
                <DrawerContent>
                  <DrawerHeader>
                    <DrawerTitle>Inner Drawer</DrawerTitle>
                  </DrawerHeader>
                </DrawerContent>
              </Drawer>
            </div>
          </DrawerContent>
        </Drawer>,
      )

      await user.click(screen.getByText('Open Outer'))

      await waitFor(() => {
        expect(screen.getByText('Outer Drawer')).toBeInTheDocument()
      })

      await user.click(screen.getByText('Open Inner'))

      await waitFor(() => {
        expect(screen.getByText('Inner Drawer')).toBeInTheDocument()
        expect(screen.getByText('Outer Drawer')).toBeInTheDocument()
      })
    })
  })

  describe('Accessibility', () => {
    it('should have no accessibility violations when closed', async () => {
      const { container } = render(
        <Drawer>
          <DrawerTrigger asChild>
            <Button>Open</Button>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Title</DrawerTitle>
            </DrawerHeader>
          </DrawerContent>
        </Drawer>,
      )

      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })

    it('should have no accessibility violations when open', async () => {
      const user = userEvent.setup()

      const { container } = render(
        <Drawer>
          <DrawerTrigger asChild>
            <Button>Open</Button>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Drawer Title</DrawerTitle>
              <DrawerDescription>Drawer Description</DrawerDescription>
            </DrawerHeader>
          </DrawerContent>
        </Drawer>,
      )

      await user.click(screen.getByText('Open'))

      await waitFor(() => {
        expect(screen.getByText('Drawer Title')).toBeInTheDocument()
      })

      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })

    it('should have proper ARIA attributes', async () => {
      const user = userEvent.setup()

      render(
        <Drawer>
          <DrawerTrigger asChild>
            <Button>Open</Button>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Title</DrawerTitle>
              <DrawerDescription>Description</DrawerDescription>
            </DrawerHeader>
          </DrawerContent>
        </Drawer>,
      )

      await user.click(screen.getByText('Open'))

      await waitFor(() => {
        const dialog = screen.getByRole('dialog')
        expect(dialog).toBeInTheDocument()
      })
    })
  })
})
