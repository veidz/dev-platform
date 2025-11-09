import { Button } from '@/components/ui/button'
import { describe, expect, it } from '@jest/globals'
import { render, screen } from '@testing-library/react'

describe('Button', () => {
  it('renders correctly', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByText('Click me')).toBeInTheDocument()
  })
})
