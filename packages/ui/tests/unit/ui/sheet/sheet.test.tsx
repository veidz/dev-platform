import { render, screen } from '@testing-library/react'

import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet/sheet'

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
  })
})
