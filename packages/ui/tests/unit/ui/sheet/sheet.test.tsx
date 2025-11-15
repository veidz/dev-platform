import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createRef } from 'react'

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet/sheet'

describe('Sheet', () => {
  describe('Rendering', () => {
    it('should render trigger button', () => {
      render(
        <Sheet>
          <SheetTrigger>Open Sheet</SheetTrigger>
          <SheetContent>Content</SheetContent>
        </Sheet>,
      )

      expect(
        screen.getByRole('button', { name: 'Open Sheet' }),
      ).toBeInTheDocument()
    })

    it('should not render content initially when closed', () => {
      render(
        <Sheet>
          <SheetTrigger>Open</SheetTrigger>
          <SheetContent>Sheet Content</SheetContent>
        </Sheet>,
      )

      expect(screen.queryByText('Sheet Content')).not.toBeInTheDocument()
    })

    it('should render content when opened', async () => {
      const user = userEvent.setup()

      render(
        <Sheet>
          <SheetTrigger>Open</SheetTrigger>
          <SheetContent>Sheet Content</SheetContent>
        </Sheet>,
      )

      await user.click(screen.getByRole('button', { name: 'Open' }))

      expect(screen.getByText('Sheet Content')).toBeInTheDocument()
    })
  })

  describe('SheetHeader', () => {
    it('should render header with title', async () => {
      const user = userEvent.setup()

      render(
        <Sheet>
          <SheetTrigger>Open</SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Sheet Title</SheetTitle>
            </SheetHeader>
          </SheetContent>
        </Sheet>,
      )

      await user.click(screen.getByRole('button', { name: 'Open' }))

      expect(screen.getByText('Sheet Title')).toBeInTheDocument()
    })

    it('should render header with description', async () => {
      const user = userEvent.setup()

      render(
        <Sheet>
          <SheetTrigger>Open</SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetDescription>Sheet Description</SheetDescription>
            </SheetHeader>
          </SheetContent>
        </Sheet>,
      )

      await user.click(screen.getByRole('button', { name: 'Open' }))

      expect(screen.getByText('Sheet Description')).toBeInTheDocument()
    })

    it('should apply custom className to header', async () => {
      const user = userEvent.setup()

      render(
        <Sheet>
          <SheetTrigger>Open</SheetTrigger>
          <SheetContent>
            <SheetHeader className="custom-header">
              <SheetTitle>Title</SheetTitle>
            </SheetHeader>
          </SheetContent>
        </Sheet>,
      )

      await user.click(screen.getByRole('button', { name: 'Open' }))

      const header = screen.getByText('Title').parentElement
      expect(header).toHaveClass('custom-header')
    })
  })

  describe('SheetFooter', () => {
    it('should render footer', async () => {
      const user = userEvent.setup()

      render(
        <Sheet>
          <SheetTrigger>Open</SheetTrigger>
          <SheetContent>
            <SheetFooter>Footer Content</SheetFooter>
          </SheetContent>
        </Sheet>,
      )

      await user.click(screen.getByRole('button', { name: 'Open' }))

      expect(screen.getByText('Footer Content')).toBeInTheDocument()
    })

    it('should apply custom className to footer', async () => {
      const user = userEvent.setup()

      render(
        <Sheet>
          <SheetTrigger>Open</SheetTrigger>
          <SheetContent>
            <SheetFooter className="custom-footer" data-testid="footer">
              Footer
            </SheetFooter>
          </SheetContent>
        </Sheet>,
      )

      await user.click(screen.getByRole('button', { name: 'Open' }))

      const footer = screen.getByTestId('footer')
      expect(footer).toHaveClass('custom-footer')
    })
  })

  describe('SheetContent', () => {
    it('should render with default side (right)', async () => {
      const user = userEvent.setup()

      render(
        <Sheet>
          <SheetTrigger>Open</SheetTrigger>
          <SheetContent data-testid="sheet-content">Content</SheetContent>
        </Sheet>,
      )

      await user.click(screen.getByRole('button', { name: 'Open' }))

      const content = screen.getByTestId('sheet-content')
      expect(content).toBeInTheDocument()
    })

    it('should render with side="left"', async () => {
      const user = userEvent.setup()

      render(
        <Sheet>
          <SheetTrigger>Open</SheetTrigger>
          <SheetContent side="left" data-testid="sheet-content">
            Content
          </SheetContent>
        </Sheet>,
      )

      await user.click(screen.getByRole('button', { name: 'Open' }))

      expect(screen.getByTestId('sheet-content')).toBeInTheDocument()
    })

    it('should render with side="top"', async () => {
      const user = userEvent.setup()

      render(
        <Sheet>
          <SheetTrigger>Open</SheetTrigger>
          <SheetContent side="top" data-testid="sheet-content">
            Content
          </SheetContent>
        </Sheet>,
      )

      await user.click(screen.getByRole('button', { name: 'Open' }))

      expect(screen.getByTestId('sheet-content')).toBeInTheDocument()
    })

    it('should render with side="bottom"', async () => {
      const user = userEvent.setup()

      render(
        <Sheet>
          <SheetTrigger>Open</SheetTrigger>
          <SheetContent side="bottom" data-testid="sheet-content">
            Content
          </SheetContent>
        </Sheet>,
      )

      await user.click(screen.getByRole('button', { name: 'Open' }))

      expect(screen.getByTestId('sheet-content')).toBeInTheDocument()
    })

    it('should apply custom className to content', async () => {
      const user = userEvent.setup()

      render(
        <Sheet>
          <SheetTrigger>Open</SheetTrigger>
          <SheetContent className="custom-content" data-testid="sheet-content">
            Content
          </SheetContent>
        </Sheet>,
      )

      await user.click(screen.getByRole('button', { name: 'Open' }))

      expect(screen.getByTestId('sheet-content')).toHaveClass('custom-content')
    })

    it('should forward ref to content', async () => {
      const user = userEvent.setup()
      const ref = createRef<HTMLDivElement>()

      render(
        <Sheet>
          <SheetTrigger>Open</SheetTrigger>
          <SheetContent ref={ref}>Content</SheetContent>
        </Sheet>,
      )

      await user.click(screen.getByRole('button', { name: 'Open' }))

      expect(ref.current).toBeInstanceOf(HTMLDivElement)
    })
  })

  describe('SheetClose', () => {
    it('should close sheet when close button is clicked', async () => {
      const user = userEvent.setup()

      render(
        <Sheet>
          <SheetTrigger>Open</SheetTrigger>
          <SheetContent>
            <SheetClose>Close Sheet</SheetClose>
            Content
          </SheetContent>
        </Sheet>,
      )

      await user.click(screen.getByRole('button', { name: 'Open' }))
      expect(screen.getByText('Content')).toBeInTheDocument()

      await user.click(screen.getByRole('button', { name: 'Close Sheet' }))

      await screen.findByRole('button', { name: 'Open' })
      expect(screen.queryByText('Content')).not.toBeInTheDocument()
    })
  })
})
