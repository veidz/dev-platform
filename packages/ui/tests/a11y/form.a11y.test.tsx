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

  it('should not have violations with disabled input', async () => {
    const { container } = render(
      <div>
        <Label htmlFor="disabled-field">Disabled Field</Label>
        <Input id="disabled-field" disabled placeholder="Disabled" />
      </div>,
    )
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  it('should not have violations with aria-describedby', async () => {
    const { container } = render(
      <div>
        <Label htmlFor="password">Password</Label>
        <Input id="password" type="password" aria-describedby="password-help" />
        <span id="password-help">Must be at least 8 characters</span>
      </div>,
    )
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  it('should not have violations with multiple form fields', async () => {
    const { container } = render(
      <form>
        <div>
          <Label htmlFor="username">Username</Label>
          <Input id="username" type="text" placeholder="Enter username" />
        </div>
        <div>
          <Label htmlFor="email-form">Email</Label>
          <Input id="email-form" type="email" placeholder="Enter email" />
        </div>
        <div>
          <Label htmlFor="password-form">Password</Label>
          <Input
            id="password-form"
            type="password"
            placeholder="Enter password"
          />
        </div>
      </form>,
    )
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
})
