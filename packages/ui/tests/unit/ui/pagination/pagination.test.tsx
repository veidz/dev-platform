import { render, screen } from '@testing-library/react'
import { createRef } from 'react'

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

    it('should forward ref to PaginationContent', () => {
      const ref = createRef<HTMLUListElement>()

      render(
        <Pagination>
          <PaginationContent ref={ref}>
            <PaginationItem>
              <PaginationLink href="#">1</PaginationLink>
            </PaginationItem>
          </PaginationContent>
        </Pagination>,
      )

      expect(ref.current).toBeInstanceOf(HTMLUListElement)
      expect(ref.current?.tagName).toBe('UL')
    })
  })

  describe('PaginationItem', () => {
    it('should render list item', () => {
      render(
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationLink href="#">1</PaginationLink>
            </PaginationItem>
          </PaginationContent>
        </Pagination>,
      )

      expect(screen.getByRole('listitem')).toBeInTheDocument()
    })

    it('should apply custom className to PaginationItem', () => {
      render(
        <Pagination>
          <PaginationContent>
            <PaginationItem className="custom-item">
              <PaginationLink href="#">1</PaginationLink>
            </PaginationItem>
          </PaginationContent>
        </Pagination>,
      )

      const item = screen.getByRole('listitem')
      expect(item).toHaveClass('custom-item')
    })

    it('should forward ref to PaginationItem', () => {
      const ref = createRef<HTMLLIElement>()

      render(
        <Pagination>
          <PaginationContent>
            <PaginationItem ref={ref}>
              <PaginationLink href="#">1</PaginationLink>
            </PaginationItem>
          </PaginationContent>
        </Pagination>,
      )

      expect(ref.current).toBeInstanceOf(HTMLLIElement)
      expect(ref.current?.tagName).toBe('LI')
    })
  })
})
