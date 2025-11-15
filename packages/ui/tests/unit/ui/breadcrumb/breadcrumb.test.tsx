import { render, screen } from '@testing-library/react'

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb/breadcrumb'

describe('Breadcrumb', () => {
  describe('Rendering', () => {
    it('should render breadcrumb navigation', () => {
      render(
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>,
      )

      expect(screen.getByRole('navigation')).toBeInTheDocument()
    })

    it('should render multiple breadcrumb items', () => {
      render(
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/docs">Docs</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Current</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>,
      )

      expect(screen.getByText('Home')).toBeInTheDocument()
      expect(screen.getByText('Docs')).toBeInTheDocument()
      expect(screen.getByText('Current')).toBeInTheDocument()
    })

    it('should apply custom className to Breadcrumb', () => {
      render(
        <Breadcrumb className="custom-breadcrumb">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbPage>Home</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>,
      )

      const nav = screen.getByRole('navigation')
      expect(nav).toHaveClass('custom-breadcrumb')
    })
  })

  describe('BreadcrumbList', () => {
    it('should render as ordered list', () => {
      render(
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbPage>Home</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>,
      )

      expect(screen.getByRole('list')).toBeInTheDocument()
    })

    it('should apply custom className to BreadcrumbList', () => {
      render(
        <Breadcrumb>
          <BreadcrumbList className="custom-list">
            <BreadcrumbItem>
              <BreadcrumbPage>Home</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>,
      )

      const list = screen.getByRole('list')
      expect(list).toHaveClass('custom-list')
    })
  })

  describe('BreadcrumbItem', () => {
    it('should render list item', () => {
      render(
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbPage>Home</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>,
      )

      expect(screen.getByRole('listitem')).toBeInTheDocument()
    })

    it('should apply custom className to BreadcrumbItem', () => {
      render(
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem className="custom-item">
              <BreadcrumbPage>Home</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>,
      )

      const item = screen.getByRole('listitem')
      expect(item).toHaveClass('custom-item')
    })
  })

  describe('BreadcrumbLink', () => {
    it('should render link with href', () => {
      render(
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>,
      )

      const link = screen.getByRole('link', { name: 'Home' })
      expect(link).toBeInTheDocument()
      expect(link).toHaveAttribute('href', '/')
    })

    it('should apply custom className to BreadcrumbLink', () => {
      render(
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/" className="custom-link">
                Home
              </BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>,
      )

      const link = screen.getByRole('link')
      expect(link).toHaveClass('custom-link')
    })

    it('should support asChild pattern', () => {
      render(
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <button type="button">Custom Button</button>
              </BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>,
      )

      expect(
        screen.getByRole('button', { name: 'Custom Button' }),
      ).toBeInTheDocument()
    })
  })
})
