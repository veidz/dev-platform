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

    it('should have aria-label="pagination"', () => {
      render(
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationLink href="#">1</PaginationLink>
            </PaginationItem>
          </PaginationContent>
        </Pagination>,
      )

      const nav = screen.getByRole('navigation')
      expect(nav).toHaveAttribute('aria-label', 'pagination')
    })

    it('should apply custom className to Pagination', () => {
      render(
        <Pagination className="custom-pagination">
          <PaginationContent>
            <PaginationItem>
              <PaginationLink href="#">1</PaginationLink>
            </PaginationItem>
          </PaginationContent>
        </Pagination>,
      )

      const nav = screen.getByRole('navigation')
      expect(nav).toHaveClass('custom-pagination')
    })
  })

  describe('PaginationContent', () => {
    it('should render as unordered list', () => {
      render(
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationLink href="#">1</PaginationLink>
            </PaginationItem>
          </PaginationContent>
        </Pagination>,
      )

      expect(screen.getByRole('list')).toBeInTheDocument()
    })

    it('should apply custom className to PaginationContent', () => {
      render(
        <Pagination>
          <PaginationContent className="custom-content">
            <PaginationItem>
              <PaginationLink href="#">1</PaginationLink>
            </PaginationItem>
          </PaginationContent>
        </Pagination>,
      )

      const list = screen.getByRole('list')
      expect(list).toHaveClass('custom-content')
    })
  })
})
