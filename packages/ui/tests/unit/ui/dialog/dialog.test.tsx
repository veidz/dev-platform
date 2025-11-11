import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { describe, expect, it } from '@jest/globals'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

describe('Dialog', () => {
  describe('Dialog component', () => {
    it('should render trigger button', () => {
      render(
        <Dialog>
          <DialogTrigger>Open Dialog</DialogTrigger>
          <DialogContent>Dialog Content</DialogContent>
        </Dialog>,
      )

      expect(screen.getByText('Open Dialog')).toBeDefined()
    })

    it('should open dialog when trigger is clicked', async () => {
      const user = userEvent.setup()

      render(
        <Dialog>
          <DialogTrigger>Open</DialogTrigger>
          <DialogContent>
            <DialogTitle>Dialog Title</DialogTitle>
            <DialogDescription>Dialog Description</DialogDescription>
          </DialogContent>
        </Dialog>,
      )

      const trigger = screen.getByText('Open')
      await user.click(trigger)

      expect(screen.getByText('Dialog Title')).toBeDefined()
      expect(screen.getByText('Dialog Description')).toBeDefined()
    })

    it('should render with custom trigger component', () => {
      render(
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline">Custom Trigger</Button>
          </DialogTrigger>
          <DialogContent>Content</DialogContent>
        </Dialog>,
      )

      const trigger = screen.getByRole('button')
      expect(trigger.textContent).toBe('Custom Trigger')
    })
  })

  describe('DialogContent component', () => {
    it('should render content when dialog is open', async () => {
      const user = userEvent.setup()

      render(
        <Dialog>
          <DialogTrigger>Open</DialogTrigger>
          <DialogContent>Test Content</DialogContent>
        </Dialog>,
      )

      await user.click(screen.getByText('Open'))
      expect(screen.getByText('Test Content')).toBeDefined()
    })

    it('should render close button', async () => {
      const user = userEvent.setup()

      render(
        <Dialog>
          <DialogTrigger>Open</DialogTrigger>
          <DialogContent>Content</DialogContent>
        </Dialog>,
      )

      await user.click(screen.getByText('Open'))
      const closeButton = screen.getByRole('button', { name: /close/i })
      expect(closeButton).toBeDefined()
    })

    it('should apply custom className', async () => {
      const user = userEvent.setup()

      render(
        <Dialog>
          <DialogTrigger>Open</DialogTrigger>
          <DialogContent className="custom-dialog">Content</DialogContent>
        </Dialog>,
      )

      await user.click(screen.getByText('Open'))
      const content = screen.getByRole('dialog')
      expect(content.className).toContain('custom-dialog')
    })
  })

  describe('DialogHeader component', () => {
    it('should render header content', async () => {
      const user = userEvent.setup()

      render(
        <Dialog>
          <DialogTrigger>Open</DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Header Title</DialogTitle>
            </DialogHeader>
          </DialogContent>
        </Dialog>,
      )

      await user.click(screen.getByText('Open'))
      expect(screen.getByText('Header Title')).toBeDefined()
    })

    it('should apply default classes', async () => {
      const user = userEvent.setup()

      render(
        <Dialog>
          <DialogTrigger>Open</DialogTrigger>
          <DialogContent>
            <DialogHeader>Header</DialogHeader>
          </DialogContent>
        </Dialog>,
      )

      await user.click(screen.getByText('Open'))
      const header = screen.getByText('Header')
      expect(header.className).toContain('flex')
      expect(header.className).toContain('flex-col')
    })

    it('should merge custom className', async () => {
      const user = userEvent.setup()

      render(
        <Dialog>
          <DialogTrigger>Open</DialogTrigger>
          <DialogContent>
            <DialogHeader className="custom-header">Header</DialogHeader>
          </DialogContent>
        </Dialog>,
      )

      await user.click(screen.getByText('Open'))
      const header = screen.getByText('Header')
      expect(header.className).toContain('custom-header')
    })
  })

  describe('DialogTitle component', () => {
    it('should render title', async () => {
      const user = userEvent.setup()

      render(
        <Dialog>
          <DialogTrigger>Open</DialogTrigger>
          <DialogContent>
            <DialogTitle>My Title</DialogTitle>
          </DialogContent>
        </Dialog>,
      )

      await user.click(screen.getByText('Open'))
      expect(screen.getByText('My Title')).toBeDefined()
    })

    it('should apply default classes', async () => {
      const user = userEvent.setup()

      render(
        <Dialog>
          <DialogTrigger>Open</DialogTrigger>
          <DialogContent>
            <DialogTitle>Title</DialogTitle>
          </DialogContent>
        </Dialog>,
      )

      await user.click(screen.getByText('Open'))
      const title = screen.getByText('Title')
      expect(title.className).toContain('text-lg')
      expect(title.className).toContain('font-semibold')
    })

    it('should merge custom className', async () => {
      const user = userEvent.setup()

      render(
        <Dialog>
          <DialogTrigger>Open</DialogTrigger>
          <DialogContent>
            <DialogTitle className="text-2xl">Title</DialogTitle>
          </DialogContent>
        </Dialog>,
      )

      await user.click(screen.getByText('Open'))
      const title = screen.getByText('Title')
      expect(title.className).toContain('text-2xl')
    })
  })

  describe('DialogDescription component', () => {
    it('should render description', async () => {
      const user = userEvent.setup()

      render(
        <Dialog>
          <DialogTrigger>Open</DialogTrigger>
          <DialogContent>
            <DialogDescription>My Description</DialogDescription>
          </DialogContent>
        </Dialog>,
      )

      await user.click(screen.getByText('Open'))
      expect(screen.getByText('My Description')).toBeDefined()
    })

    it('should apply default classes', async () => {
      const user = userEvent.setup()

      render(
        <Dialog>
          <DialogTrigger>Open</DialogTrigger>
          <DialogContent>
            <DialogDescription>Description</DialogDescription>
          </DialogContent>
        </Dialog>,
      )

      await user.click(screen.getByText('Open'))
      const desc = screen.getByText('Description')
      expect(desc.className).toContain('text-sm')
      expect(desc.className).toContain('text-muted-foreground')
    })

    it('should merge custom className', async () => {
      const user = userEvent.setup()

      render(
        <Dialog>
          <DialogTrigger>Open</DialogTrigger>
          <DialogContent>
            <DialogDescription className="text-base">
              Description
            </DialogDescription>
          </DialogContent>
        </Dialog>,
      )

      await user.click(screen.getByText('Open'))
      const desc = screen.getByText('Description')
      expect(desc.className).toContain('text-base')
    })
  })

  describe('DialogFooter component', () => {
    it('should render footer content', async () => {
      const user = userEvent.setup()

      render(
        <Dialog>
          <DialogTrigger>Open</DialogTrigger>
          <DialogContent>
            <DialogFooter>Footer Content</DialogFooter>
          </DialogContent>
        </Dialog>,
      )

      await user.click(screen.getByText('Open'))
      expect(screen.getByText('Footer Content')).toBeDefined()
    })

    it('should apply default classes', async () => {
      const user = userEvent.setup()

      render(
        <Dialog>
          <DialogTrigger>Open</DialogTrigger>
          <DialogContent>
            <DialogFooter>Footer</DialogFooter>
          </DialogContent>
        </Dialog>,
      )

      await user.click(screen.getByText('Open'))
      const footer = screen.getByText('Footer')
      expect(footer.className).toContain('flex')
    })

    it('should merge custom className', async () => {
      const user = userEvent.setup()

      render(
        <Dialog>
          <DialogTrigger>Open</DialogTrigger>
          <DialogContent>
            <DialogFooter className="justify-start">Footer</DialogFooter>
          </DialogContent>
        </Dialog>,
      )

      await user.click(screen.getByText('Open'))
      const footer = screen.getByText('Footer')
      expect(footer.className).toContain('justify-start')
    })
  })

  describe('Dialog composition', () => {
    it('should render complete dialog', async () => {
      const user = userEvent.setup()

      render(
        <Dialog>
          <DialogTrigger>Open Full Dialog</DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Complete Dialog</DialogTitle>
              <DialogDescription>This is a complete dialog</DialogDescription>
            </DialogHeader>
            <div>Main Content Area</div>
            <DialogFooter>
              <Button>Cancel</Button>
              <Button>Confirm</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>,
      )

      await user.click(screen.getByText('Open Full Dialog'))

      expect(screen.getByText('Complete Dialog')).toBeDefined()
      expect(screen.getByText('This is a complete dialog')).toBeDefined()
      expect(screen.getByText('Main Content Area')).toBeDefined()
      expect(screen.getByText('Cancel')).toBeDefined()
      expect(screen.getByText('Confirm')).toBeDefined()
    })

    it('should work with minimal composition', async () => {
      const user = userEvent.setup()

      render(
        <Dialog>
          <DialogTrigger>Open</DialogTrigger>
          <DialogContent>
            <DialogTitle>Simple</DialogTitle>
          </DialogContent>
        </Dialog>,
      )

      await user.click(screen.getByText('Open'))
      expect(screen.getByText('Simple')).toBeDefined()
    })
  })
})
