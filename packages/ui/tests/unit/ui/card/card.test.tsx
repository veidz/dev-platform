import { describe, expect, it } from '@jest/globals'
import { render } from '@testing-library/react'

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

describe('Card', () => {
  describe('Card component', () => {
    it('should render correctly', () => {
      const { container } = render(<Card>Card content</Card>)
      const card = container.firstChild as HTMLElement
      expect(card).toBeDefined()
      expect(card.textContent).toBe('Card content')
    })

    it('should apply default classes', () => {
      const { container } = render(<Card>Content</Card>)
      const card = container.firstChild as HTMLElement
      expect(card.className).toContain('rounded-xl')
      expect(card.className).toContain('border')
      expect(card.className).toContain('bg-card')
      expect(card.className).toContain('shadow')
    })

    it('should merge custom className', () => {
      const { container } = render(
        <Card className="custom-class">Content</Card>,
      )
      const card = container.firstChild as HTMLElement
      expect(card.className).toContain('custom-class')
      expect(card.className).toContain('rounded-xl')
    })

    it('should forward ref', () => {
      const ref = { current: null }
      render(<Card ref={ref}>Content</Card>)
      expect(ref.current).toBeDefined()
    })

    it('should pass through HTML attributes', () => {
      const { container } = render(
        <Card data-testid="card" aria-label="Test card">
          Content
        </Card>,
      )
      const card = container.firstChild as HTMLElement
      expect(card.getAttribute('data-testid')).toBe('card')
      expect(card.getAttribute('aria-label')).toBe('Test card')
    })
  })

  describe('CardHeader component', () => {
    it('should render correctly', () => {
      const { container } = render(<CardHeader>Header content</CardHeader>)
      const header = container.firstChild as HTMLElement
      expect(header).toBeDefined()
      expect(header.textContent).toBe('Header content')
    })

    it('should apply default classes', () => {
      const { container } = render(<CardHeader>Content</CardHeader>)
      const header = container.firstChild as HTMLElement
      expect(header.className).toContain('flex')
      expect(header.className).toContain('flex-col')
      expect(header.className).toContain('space-y-1.5')
      expect(header.className).toContain('p-6')
    })

    it('should merge custom className', () => {
      const { container } = render(
        <CardHeader className="custom-header">Content</CardHeader>,
      )
      const header = container.firstChild as HTMLElement
      expect(header.className).toContain('custom-header')
      expect(header.className).toContain('flex')
    })

    it('should forward ref', () => {
      const ref = { current: null }
      render(<CardHeader ref={ref}>Content</CardHeader>)
      expect(ref.current).toBeDefined()
    })
  })

  describe('CardTitle component', () => {
    it('should render correctly', () => {
      const { container } = render(<CardTitle>Title text</CardTitle>)
      const title = container.firstChild as HTMLElement
      expect(title).toBeDefined()
      expect(title.textContent).toBe('Title text')
    })

    it('should apply default classes', () => {
      const { container } = render(<CardTitle>Title</CardTitle>)
      const title = container.firstChild as HTMLElement
      expect(title.className).toContain('font-semibold')
      expect(title.className).toContain('leading-none')
      expect(title.className).toContain('tracking-tight')
    })

    it('should merge custom className', () => {
      const { container } = render(
        <CardTitle className="text-3xl">Title</CardTitle>,
      )
      const title = container.firstChild as HTMLElement
      expect(title.className).toContain('text-3xl')
      expect(title.className).toContain('font-semibold')
    })

    it('should forward ref', () => {
      const ref = { current: null }
      render(<CardTitle ref={ref}>Title</CardTitle>)
      expect(ref.current).toBeDefined()
    })
  })

  describe('CardDescription component', () => {
    it('should render correctly', () => {
      const { container } = render(
        <CardDescription>Description text</CardDescription>,
      )
      const description = container.firstChild as HTMLElement
      expect(description).toBeDefined()
      expect(description.textContent).toBe('Description text')
    })

    it('should apply default classes', () => {
      const { container } = render(<CardDescription>Desc</CardDescription>)
      const description = container.firstChild as HTMLElement
      expect(description.className).toContain('text-sm')
      expect(description.className).toContain('text-muted-foreground')
    })

    it('should merge custom className', () => {
      const { container } = render(
        <CardDescription className="text-lg">Desc</CardDescription>,
      )
      const description = container.firstChild as HTMLElement
      expect(description.className).toContain('text-lg')
      expect(description.className).toContain('text-muted-foreground')
    })

    it('should forward ref', () => {
      const ref = { current: null }
      render(<CardDescription ref={ref}>Desc</CardDescription>)
      expect(ref.current).toBeDefined()
    })
  })

  describe('CardContent component', () => {
    it('should render correctly', () => {
      const { container } = render(<CardContent>Main content</CardContent>)
      const content = container.firstChild as HTMLElement
      expect(content).toBeDefined()
      expect(content.textContent).toBe('Main content')
    })

    it('should apply default classes', () => {
      const { container } = render(<CardContent>Content</CardContent>)
      const content = container.firstChild as HTMLElement
      expect(content.className).toContain('p-6')
      expect(content.className).toContain('pt-0')
    })

    it('should merge custom className', () => {
      const { container } = render(
        <CardContent className="bg-gray-100">Content</CardContent>,
      )
      const content = container.firstChild as HTMLElement
      expect(content.className).toContain('bg-gray-100')
      expect(content.className).toContain('p-6')
    })

    it('should forward ref', () => {
      const ref = { current: null }
      render(<CardContent ref={ref}>Content</CardContent>)
      expect(ref.current).toBeDefined()
    })
  })

  describe('CardFooter component', () => {
    it('should render correctly', () => {
      const { container } = render(<CardFooter>Footer content</CardFooter>)
      const footer = container.firstChild as HTMLElement
      expect(footer).toBeDefined()
      expect(footer.textContent).toBe('Footer content')
    })

    it('should apply default classes', () => {
      const { container } = render(<CardFooter>Footer</CardFooter>)
      const footer = container.firstChild as HTMLElement
      expect(footer.className).toContain('flex')
      expect(footer.className).toContain('items-center')
      expect(footer.className).toContain('p-6')
      expect(footer.className).toContain('pt-0')
    })

    it('should merge custom className', () => {
      const { container } = render(
        <CardFooter className="justify-end">Footer</CardFooter>,
      )
      const footer = container.firstChild as HTMLElement
      expect(footer.className).toContain('justify-end')
      expect(footer.className).toContain('flex')
    })

    it('should forward ref', () => {
      const ref = { current: null }
      render(<CardFooter ref={ref}>Footer</CardFooter>)
      expect(ref.current).toBeDefined()
    })
  })

  describe('Card composition', () => {
    it('should render complete card with all subcomponents', () => {
      const { container } = render(
        <Card>
          <CardHeader>
            <CardTitle>Card Title</CardTitle>
            <CardDescription>Card Description</CardDescription>
          </CardHeader>
          <CardContent>Main Content</CardContent>
          <CardFooter>Footer Content</CardFooter>
        </Card>,
      )

      const card = container.firstChild as HTMLElement
      expect(card.textContent).toContain('Card Title')
      expect(card.textContent).toContain('Card Description')
      expect(card.textContent).toContain('Main Content')
      expect(card.textContent).toContain('Footer Content')
    })

    it('should work with partial composition', () => {
      const { container } = render(
        <Card>
          <CardHeader>
            <CardTitle>Title Only</CardTitle>
          </CardHeader>
          <CardContent>Content Only</CardContent>
        </Card>,
      )

      const card = container.firstChild as HTMLElement
      expect(card.textContent).toContain('Title Only')
      expect(card.textContent).toContain('Content Only')
      expect(card.textContent).not.toContain('Footer')
    })
  })
})
