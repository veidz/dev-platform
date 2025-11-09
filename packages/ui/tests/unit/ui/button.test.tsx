import { Button } from '@/components/ui/button'
import { describe, expect, it } from '@jest/globals'
import { render, screen } from '@testing-library/react'

describe('Button', () => {
  it('renders correctly', () => {
    render(<Button>Click me</Button>)
    const element = screen.getByText('Click me')
    expect(element).toBeDefined()
    expect(element.textContent).toBe('Click me')
  })
})
