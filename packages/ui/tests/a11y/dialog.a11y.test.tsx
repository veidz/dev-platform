import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { describe, expect, it } from '@jest/globals'
import { render } from '@testing-library/react'
import { axe, toHaveNoViolations } from 'jest-axe'

expect.extend(toHaveNoViolations)

describe('Dialog Accessibility', () => {
  it('should not have violations with closed dialog', async () => {
    const { container } = render(
      <Dialog>
        <DialogTrigger asChild>
          <Button>Open Dialog</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Dialog Title</DialogTitle>
            <DialogDescription>Dialog description text</DialogDescription>
          </DialogHeader>
          <p>Dialog content goes here.</p>
          <DialogFooter>
            <Button>Cancel</Button>
            <Button>Confirm</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>,
    )
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  it('should not have violations with dialog title and description', async () => {
    const { container } = render(
      <Dialog>
        <DialogTrigger asChild>
          <Button>Open</Button>
        </DialogTrigger>
        <DialogContent aria-describedby="dialog-description">
          <DialogHeader>
            <DialogTitle>Confirm Action</DialogTitle>
            <DialogDescription id="dialog-description">
              Are you sure you want to continue with this action?
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>,
    )
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  it('should not have violations with dialog containing form', async () => {
    const { container } = render(
      <Dialog>
        <DialogTrigger asChild>
          <Button>Edit Profile</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
            <DialogDescription>
              Update your profile information
            </DialogDescription>
          </DialogHeader>
          <form>
            <label htmlFor="name">Name</label>
            <input id="name" type="text" />
            <label htmlFor="email-dialog">Email</label>
            <input id="email-dialog" type="email" />
          </form>
          <DialogFooter>
            <Button type="button">Cancel</Button>
            <Button type="submit">Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>,
    )
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
})
