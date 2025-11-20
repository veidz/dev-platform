import {
  Menubar,
  MenubarCheckboxItem,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from '@/components/ui/menubar/menubar'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

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

    it('should render multiple menus', () => {
      render(
        <Menubar>
          <MenubarMenu>
            <MenubarTrigger>File</MenubarTrigger>
            <MenubarContent>
              <MenubarItem>New</MenubarItem>
            </MenubarContent>
          </MenubarMenu>
          <MenubarMenu>
            <MenubarTrigger>Edit</MenubarTrigger>
            <MenubarContent>
              <MenubarItem>Undo</MenubarItem>
            </MenubarContent>
          </MenubarMenu>
        </Menubar>,
      )

      expect(screen.getByText('File')).toBeInTheDocument()
      expect(screen.getByText('Edit')).toBeInTheDocument()
    })

    it('should not render menu content initially', () => {
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

      expect(screen.queryByText('New')).not.toBeInTheDocument()
    })

    it('should render with custom className', () => {
      const { container } = render(
        <Menubar className="custom-class">
          <MenubarMenu>
            <MenubarTrigger>File</MenubarTrigger>
            <MenubarContent>
              <MenubarItem>New</MenubarItem>
            </MenubarContent>
          </MenubarMenu>
        </Menubar>,
      )

      const menubar = container.firstChild
      expect(menubar).toHaveClass('custom-class')
    })
  })

  describe('Interaction', () => {
    it('should open menu on trigger click', async () => {
      const user = userEvent.setup()

      render(
        <Menubar>
          <MenubarMenu>
            <MenubarTrigger>File</MenubarTrigger>
            <MenubarContent>
              <MenubarItem>New</MenubarItem>
              <MenubarItem>Save</MenubarItem>
            </MenubarContent>
          </MenubarMenu>
        </Menubar>,
      )

      await user.click(screen.getByText('File'))

      await waitFor(() => {
        expect(screen.getByText('New')).toBeInTheDocument()
        expect(screen.getByText('Save')).toBeInTheDocument()
      })
    })

    it('should close menu when clicking menu item', async () => {
      const user = userEvent.setup()
      const onSelect = jest.fn()

      render(
        <Menubar>
          <MenubarMenu>
            <MenubarTrigger>File</MenubarTrigger>
            <MenubarContent>
              <MenubarItem onSelect={onSelect}>New</MenubarItem>
            </MenubarContent>
          </MenubarMenu>
        </Menubar>,
      )

      await user.click(screen.getByText('File'))

      await waitFor(() => {
        expect(screen.getByText('New')).toBeInTheDocument()
      })

      await user.click(screen.getByText('New'))

      expect(onSelect).toHaveBeenCalled()

      await waitFor(() => {
        expect(screen.queryByText('New')).not.toBeInTheDocument()
      })
    })

    it('should close menu when pressing escape', async () => {
      const user = userEvent.setup()

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

      await user.click(screen.getByText('File'))

      await waitFor(() => {
        expect(screen.getByText('New')).toBeInTheDocument()
      })

      await user.keyboard('{Escape}')

      await waitFor(() => {
        expect(screen.queryByText('New')).not.toBeInTheDocument()
      })
    })

    it('should handle disabled items', async () => {
      const user = userEvent.setup()
      const onSelect = jest.fn()

      render(
        <Menubar>
          <MenubarMenu>
            <MenubarTrigger>File</MenubarTrigger>
            <MenubarContent>
              <MenubarItem disabled onSelect={onSelect}>
                Disabled
              </MenubarItem>
            </MenubarContent>
          </MenubarMenu>
        </Menubar>,
      )

      await user.click(screen.getByText('File'))

      await waitFor(() => {
        expect(screen.getByText('Disabled')).toBeInTheDocument()
      })

      await user.click(screen.getByText('Disabled'))

      expect(onSelect).not.toHaveBeenCalled()
    })
  })

  describe('Checkbox Items', () => {
    it('should render checkbox items', async () => {
      const user = userEvent.setup()

      render(
        <Menubar>
          <MenubarMenu>
            <MenubarTrigger>View</MenubarTrigger>
            <MenubarContent>
              <MenubarCheckboxItem checked={true}>Checked</MenubarCheckboxItem>
              <MenubarCheckboxItem checked={false}>
                Unchecked
              </MenubarCheckboxItem>
            </MenubarContent>
          </MenubarMenu>
        </Menubar>,
      )

      await user.click(screen.getByText('View'))

      await waitFor(() => {
        expect(screen.getByText('Checked')).toBeInTheDocument()
        expect(screen.getByText('Unchecked')).toBeInTheDocument()
      })
    })
  })
})
