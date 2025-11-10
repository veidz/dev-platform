import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { describe, expect, it } from '@jest/globals'
import { render } from '@testing-library/react'
import { axe, toHaveNoViolations } from 'jest-axe'

expect.extend(toHaveNoViolations)

describe('Form Accessibility', () => {
  it('should not have violations with label and input', async () => {
    const { container } = render(
      <div>
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" placeholder="Enter your email" />
      </div>,
    )
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  it('should not have violations with required input', async () => {
    const { container } = render(
      <div>
        <Label htmlFor="required-field">Required Field *</Label>
        <Input
          id="required-field"
          required
          aria-required="true"
          placeholder="Required"
        />
      </div>,
    )
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
})
