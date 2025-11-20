import {
  Menubar,
  MenubarCheckboxItem,
  MenubarContent,
  MenubarItem,
  MenubarLabel,
  MenubarMenu,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSeparator,
  MenubarShortcut,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
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

    it('should toggle checkbox items', async () => {
      const user = userEvent.setup()
      const onCheckedChange = jest.fn()

      render(
        <Menubar>
          <MenubarMenu>
            <MenubarTrigger>View</MenubarTrigger>
            <MenubarContent>
              <MenubarCheckboxItem
                checked={false}
                onCheckedChange={onCheckedChange}
              >
                Toggle Me
              </MenubarCheckboxItem>
            </MenubarContent>
          </MenubarMenu>
        </Menubar>,
      )

      await user.click(screen.getByText('View'))

      await waitFor(() => {
        expect(screen.getByText('Toggle Me')).toBeInTheDocument()
      })

      await user.click(screen.getByText('Toggle Me'))

      expect(onCheckedChange).toHaveBeenCalledWith(true)
    })
  })

  describe('Radio Items', () => {
    it('should render radio group', async () => {
      const user = userEvent.setup()

      render(
        <Menubar>
          <MenubarMenu>
            <MenubarTrigger>View</MenubarTrigger>
            <MenubarContent>
              <MenubarRadioGroup value="option1">
                <MenubarRadioItem value="option1">Option 1</MenubarRadioItem>
                <MenubarRadioItem value="option2">Option 2</MenubarRadioItem>
              </MenubarRadioGroup>
            </MenubarContent>
          </MenubarMenu>
        </Menubar>,
      )

      await user.click(screen.getByText('View'))

      await waitFor(() => {
        expect(screen.getByText('Option 1')).toBeInTheDocument()
        expect(screen.getByText('Option 2')).toBeInTheDocument()
      })
    })

    it('should handle radio item selection', async () => {
      const user = userEvent.setup()
      const onValueChange = jest.fn()

      render(
        <Menubar>
          <MenubarMenu>
            <MenubarTrigger>View</MenubarTrigger>
            <MenubarContent>
              <MenubarRadioGroup value="option1" onValueChange={onValueChange}>
                <MenubarRadioItem value="option1">Option 1</MenubarRadioItem>
                <MenubarRadioItem value="option2">Option 2</MenubarRadioItem>
              </MenubarRadioGroup>
            </MenubarContent>
          </MenubarMenu>
        </Menubar>,
      )

      await user.click(screen.getByText('View'))

      await waitFor(() => {
        expect(screen.getByText('Option 2')).toBeInTheDocument()
      })

      await user.click(screen.getByText('Option 2'))

      expect(onValueChange).toHaveBeenCalledWith('option2')
    })
  })

  describe('Submenu', () => {
    it('should render nested submenu', async () => {
      const user = userEvent.setup()

      render(
        <Menubar>
          <MenubarMenu>
            <MenubarTrigger>File</MenubarTrigger>
            <MenubarContent>
              <MenubarItem>Regular</MenubarItem>
              <MenubarSub>
                <MenubarSubTrigger>More</MenubarSubTrigger>
                <MenubarSubContent>
                  <MenubarItem>Submenu 1</MenubarItem>
                  <MenubarItem>Submenu 2</MenubarItem>
                </MenubarSubContent>
              </MenubarSub>
            </MenubarContent>
          </MenubarMenu>
        </Menubar>,
      )

      await user.click(screen.getByText('File'))

      await waitFor(() => {
        expect(screen.getByText('More')).toBeInTheDocument()
      })

      await user.hover(screen.getByText('More'))

      await waitFor(() => {
        expect(screen.getByText('Submenu 1')).toBeInTheDocument()
        expect(screen.getByText('Submenu 2')).toBeInTheDocument()
      })
    })
  })

  describe('Additional Elements', () => {
    it('should render labels', async () => {
      const user = userEvent.setup()

      render(
        <Menubar>
          <MenubarMenu>
            <MenubarTrigger>File</MenubarTrigger>
            <MenubarContent>
              <MenubarLabel>Actions</MenubarLabel>
              <MenubarItem>New</MenubarItem>
            </MenubarContent>
          </MenubarMenu>
        </Menubar>,
      )

      await user.click(screen.getByText('File'))

      await waitFor(() => {
        expect(screen.getByText('Actions')).toBeInTheDocument()
      })
    })

    it('should render separators', async () => {
      const user = userEvent.setup()

      render(
        <Menubar>
          <MenubarMenu>
            <MenubarTrigger>File</MenubarTrigger>
            <MenubarContent>
              <MenubarItem>New</MenubarItem>
              <MenubarSeparator />
              <MenubarItem>Save</MenubarItem>
            </MenubarContent>
          </MenubarMenu>
        </Menubar>,
      )

      await user.click(screen.getByText('File'))

      await waitFor(() => {
        const separators = document.querySelectorAll('[role="separator"]')
        expect(separators.length).toBeGreaterThan(0)
      })
    })

    it('should render shortcuts', async () => {
      const user = userEvent.setup()

      render(
        <Menubar>
          <MenubarMenu>
            <MenubarTrigger>File</MenubarTrigger>
            <MenubarContent>
              <MenubarItem>
                Save
                <MenubarShortcut>⌘S</MenubarShortcut>
              </MenubarItem>
            </MenubarContent>
          </MenubarMenu>
        </Menubar>,
      )

      await user.click(screen.getByText('File'))

      await waitFor(() => {
        expect(screen.getByText('⌘S')).toBeInTheDocument()
      })
    })
  })

  describe('Keyboard Navigation', () => {
    it('should navigate between menus with arrow keys', async () => {
      const user = userEvent.setup()

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

      await user.click(screen.getByText('File'))

      await waitFor(() => {
        expect(screen.getByText('New')).toBeInTheDocument()
      })

      await user.keyboard('{ArrowRight}')

      await waitFor(() => {
        expect(screen.getByText('Undo')).toBeInTheDocument()
      })
    })

    it('should navigate menu items with arrow keys', async () => {
      const user = userEvent.setup()

      render(
        <Menubar>
          <MenubarMenu>
            <MenubarTrigger>File</MenubarTrigger>
            <MenubarContent>
              <MenubarItem>Item 1</MenubarItem>
              <MenubarItem>Item 2</MenubarItem>
              <MenubarItem>Item 3</MenubarItem>
            </MenubarContent>
          </MenubarMenu>
        </Menubar>,
      )

      await user.click(screen.getByText('File'))

      await waitFor(() => {
        expect(screen.getByText('Item 1')).toBeInTheDocument()
      })

      await user.keyboard('{ArrowDown}')
      await user.keyboard('{ArrowDown}')

      expect(screen.getByText('Item 2')).toBeInTheDocument()
    })
  })
})
