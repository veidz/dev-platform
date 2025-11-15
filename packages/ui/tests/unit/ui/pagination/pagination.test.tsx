import { render, screen } from '@testing-library/react'
import { createRef } from 'react'

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
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

  describe('PaginationLink', () => {
    it('should render link with href', () => {
      render(
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationLink href="/page/1">1</PaginationLink>
            </PaginationItem>
          </PaginationContent>
        </Pagination>,
      )

      const link = screen.getByRole('link', { name: '1' })
      expect(link).toBeInTheDocument()
      expect(link).toHaveAttribute('href', '/page/1')
    })

    it('should mark active page with aria-current="page"', () => {
      render(
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationLink href="#" isActive>
                2
              </PaginationLink>
            </PaginationItem>
          </PaginationContent>
        </Pagination>,
      )

      const link = screen.getByRole('link', { name: '2' })
      expect(link).toHaveAttribute('aria-current', 'page')
    })

    it('should not have aria-current when not active', () => {
      render(
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationLink href="#">1</PaginationLink>
            </PaginationItem>
          </PaginationContent>
        </Pagination>,
      )

      const link = screen.getByRole('link', { name: '1' })
      expect(link).not.toHaveAttribute('aria-current')
    })

    it('should apply custom className to PaginationLink', () => {
      render(
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationLink href="#" className="custom-link">
                1
              </PaginationLink>
            </PaginationItem>
          </PaginationContent>
        </Pagination>,
      )

      const link = screen.getByRole('link')
      expect(link).toHaveClass('custom-link')
    })

    it('should apply different styles for active state', () => {
      const { rerender } = render(
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationLink href="#" isActive={false}>
                1
              </PaginationLink>
            </PaginationItem>
          </PaginationContent>
        </Pagination>,
      )

      const link = screen.getByRole('link')
      const inactiveClasses = link.className

      rerender(
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationLink href="#" isActive={true}>
                1
              </PaginationLink>
            </PaginationItem>
          </PaginationContent>
        </Pagination>,
      )

      const activeClasses = link.className
      expect(activeClasses).not.toBe(inactiveClasses)
    })
  })

  describe('PaginationPrevious', () => {
    it('should render previous button with text', () => {
      render(
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>,
      )

      expect(screen.getByText('Previous')).toBeInTheDocument()
    })

    it('should have aria-label for accessibility', () => {
      render(
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>,
      )

      const link = screen.getByLabelText('Go to previous page')
      expect(link).toBeInTheDocument()
    })

    it('should apply custom className to PaginationPrevious', () => {
      render(
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#" className="custom-prev" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>,
      )

      const link = screen.getByLabelText('Go to previous page')
      expect(link).toHaveClass('custom-prev')
    })
  })

  describe('PaginationNext', () => {
    it('should render next button with text', () => {
      render(
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationNext href="#" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>,
      )

      expect(screen.getByText('Next')).toBeInTheDocument()
    })

    it('should have aria-label for accessibility', () => {
      render(
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationNext href="#" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>,
      )

      const link = screen.getByLabelText('Go to next page')
      expect(link).toBeInTheDocument()
    })

    it('should apply custom className to PaginationNext', () => {
      render(
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationNext href="#" className="custom-next" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>,
      )

      const link = screen.getByLabelText('Go to next page')
      expect(link).toHaveClass('custom-next')
    })
  })

  describe('PaginationEllipsis', () => {
    it('should render ellipsis with hidden text', () => {
      render(
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
          </PaginationContent>
        </Pagination>,
      )

      const srText = screen.getByText('More pages')
      expect(srText).toBeInTheDocument()
      expect(srText).toHaveClass('sr-only')
    })

    it('should be aria-hidden', () => {
      const { container } = render(
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
          </PaginationContent>
        </Pagination>,
      )

      const ellipsis = container.querySelector('span[aria-hidden]')
      expect(ellipsis).toBeInTheDocument()
      expect(ellipsis).toHaveAttribute('aria-hidden')
    })

    it('should apply custom className to PaginationEllipsis', () => {
      const { container } = render(
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationEllipsis className="custom-ellipsis" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>,
      )

      const ellipsis = container.querySelector('span[aria-hidden]')
      expect(ellipsis).toHaveClass('custom-ellipsis')
    })
  })
})
