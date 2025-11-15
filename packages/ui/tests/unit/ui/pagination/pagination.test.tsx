import { render, screen } from '@testing-library/react'

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from '@/components/ui/pagination/pagination'

describe('Pagination', () => {
  describe('Rendering', () => {
    it('should render pagination navigation', () => {
      render(
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationLink href="#">1</PaginationLink>
            </PaginationItem>
          </PaginationContent>
        </Pagination>,
      )

      expect(screen.getByRole('navigation')).toBeInTheDocument()
    })
  })
})
