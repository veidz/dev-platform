import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover/popover'
import { render, screen } from '@testing-library/react'

describe('Popover', () => {
  describe('Rendering', () => {
    it('should render trigger button', () => {
      render(
        <Popover>
          <PopoverTrigger>Open</PopoverTrigger>
        </Popover>,
      )

      expect(screen.getByText('Open')).toBeInTheDocument()
    })

    it('should not render content initially', () => {
      render(
        <Popover>
          <PopoverTrigger>Open</PopoverTrigger>
          <PopoverContent>Content</PopoverContent>
        </Popover>,
      )

      expect(screen.queryByText('Content')).not.toBeInTheDocument()
    })
  })
})
