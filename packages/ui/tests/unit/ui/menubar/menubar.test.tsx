import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from '@/components/ui/menubar/menubar'
import { render, screen } from '@testing-library/react'

describe('Menubar', () => {
  describe('Rendering', () => {
    it('should render menubar', () => {
      render(
        <Menubar>
          <MenubarMenu>
            <MenubarTrigger>File</MenubarTrigger>
            <MenubarContent>
              <MenubarItem>New</MenubarItem>
            </MenubarContent>
          </MenubarMenu>
        </Menubar>,
      )

      expect(screen.getByText('File')).toBeInTheDocument()
    })
  })
})
