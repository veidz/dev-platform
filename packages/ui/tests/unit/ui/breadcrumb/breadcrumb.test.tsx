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
  })
})
