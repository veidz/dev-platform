import { Button } from '@/components/ui/button/button'
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer/drawer'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

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
})
