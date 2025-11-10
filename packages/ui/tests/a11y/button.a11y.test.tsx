import { Button } from '@/components/ui/button'
import { describe, expect, it } from '@jest/globals'
import { render } from '@testing-library/react'
import { axe, toHaveNoViolations } from 'jest-axe'

expect.extend(toHaveNoViolations)

describe('Button Accessibility', () => {
  it('should not have accessibility violations', async () => {
    const { container } = render(<Button>Accessible Button</Button>)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  it('should not have violations with different variants', async () => {
    const { container } = render(
      <>
        <Button variant="default">Default</Button>
        <Button variant="destructive">Destructive</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="link">Link</Button>
      </>,
    )
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  it('should not have violations when disabled', async () => {
    const { container } = render(<Button disabled>Disabled Button</Button>)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  it('should not have violations with aria-label', async () => {
    const { container } = render(<Button aria-label="Close">X</Button>)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  it('should not have violations with icon button', async () => {
    const { container } = render(
      <Button size="icon" aria-label="Search">
        🔍
      </Button>,
    )
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
})
