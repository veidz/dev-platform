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
  })
})
