import { Button } from '@/components/ui/button/button'
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer/drawer'
import { render, screen } from '@testing-library/react'

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
  })
})
