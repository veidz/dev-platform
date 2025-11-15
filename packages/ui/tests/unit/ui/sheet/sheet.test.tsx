import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import {
  Sheet,
  SheetContent,
  SheetDescription,
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
  })
})
