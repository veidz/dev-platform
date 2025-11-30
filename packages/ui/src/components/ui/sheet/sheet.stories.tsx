import { useState } from 'react'

import type { Meta, StoryObj } from '@storybook/react-vite'

import { Button } from '../button'
import { Input } from '../input'
import { Label } from '../label'
import { Textarea } from '../textarea'

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from './sheet'

const meta = {
  title: 'UI/Sheet',
  component: Sheet,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Sheet>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">Open Sheet</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Edit profile</SheetTitle>
          <SheetDescription>
            Make changes to your profile here. Click save when you're done.
          </SheetDescription>
        </SheetHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input id="name" value="Pedro Duarte" className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              Username
            </Label>
            <Input id="username" value="@peduarte" className="col-span-3" />
          </div>
        </div>
        <SheetFooter>
          <SheetClose asChild>
            <Button type="submit">Save changes</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  ),
}

export const Left: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">Open Left Sheet</Button>
      </SheetTrigger>
      <SheetContent side="left">
        <SheetHeader>
          <SheetTitle>Navigation</SheetTitle>
          <SheetDescription>
            Navigate through your application using the menu below.
          </SheetDescription>
        </SheetHeader>
        <nav className="grid gap-2 py-4">
          <Button variant="ghost" className="justify-start">
            Dashboard
          </Button>
          <Button variant="ghost" className="justify-start">
            Projects
          </Button>
          <Button variant="ghost" className="justify-start">
            Team
          </Button>
          <Button variant="ghost" className="justify-start">
            Settings
          </Button>
        </nav>
      </SheetContent>
    </Sheet>
  ),
}

export const Top: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">Open Top Sheet</Button>
      </SheetTrigger>
      <SheetContent side="top">
        <SheetHeader>
          <SheetTitle>Notifications</SheetTitle>
          <SheetDescription>You have 3 unread notifications.</SheetDescription>
        </SheetHeader>
        <div className="grid gap-4 py-4">
          <div className="rounded-lg border p-3">
            <p className="text-sm font-medium">New message received</p>
            <p className="text-xs text-muted-foreground">2 minutes ago</p>
          </div>
          <div className="rounded-lg border p-3">
            <p className="text-sm font-medium">Your order has been shipped</p>
            <p className="text-xs text-muted-foreground">1 hour ago</p>
          </div>
          <div className="rounded-lg border p-3">
            <p className="text-sm font-medium">Welcome to our platform!</p>
            <p className="text-xs text-muted-foreground">Yesterday</p>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  ),
}

export const Bottom: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">Open Bottom Sheet</Button>
      </SheetTrigger>
      <SheetContent side="bottom">
        <SheetHeader>
          <SheetTitle>Quick Actions</SheetTitle>
          <SheetDescription>
            Perform quick actions from anywhere in the app.
          </SheetDescription>
        </SheetHeader>
        <div className="grid grid-cols-3 gap-4 py-4">
          <Button variant="outline">New Project</Button>
          <Button variant="outline">Upload File</Button>
          <Button variant="outline">Share</Button>
          <Button variant="outline">Export</Button>
          <Button variant="outline">Print</Button>
          <Button variant="outline">Settings</Button>
        </div>
      </SheetContent>
    </Sheet>
  ),
}

export const WithForm: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button>Add Contact</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>New Contact</SheetTitle>
          <SheetDescription>
            Add a new contact to your address book.
          </SheetDescription>
        </SheetHeader>
        <form className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="firstName">First Name</Label>
            <Input id="firstName" placeholder="John" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="lastName">Last Name</Label>
            <Input id="lastName" placeholder="Doe" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="john@example.com" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="phone">Phone</Label>
            <Input id="phone" type="tel" placeholder="+1 (555) 000-0000" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea id="notes" placeholder="Additional information..." />
          </div>
        </form>
        <SheetFooter>
          <SheetClose asChild>
            <Button variant="outline">Cancel</Button>
          </SheetClose>
          <Button type="submit">Save Contact</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  ),
}

export const Scrollable: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">Open Scrollable Sheet</Button>
      </SheetTrigger>
      <SheetContent className="overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Terms of Service</SheetTitle>
          <SheetDescription>
            Please read our terms of service carefully.
          </SheetDescription>
        </SheetHeader>
        <div className="space-y-4 py-4 text-sm">
          {Array.from({ length: 20 }, (_, i) => (
            <div key={i}>
              <h4 className="mb-2 font-semibold">Section {i + 1}</h4>
              <p className="text-muted-foreground">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris
                nisi ut aliquip ex ea commodo consequat.
              </p>
            </div>
          ))}
        </div>
        <SheetFooter>
          <SheetClose asChild>
            <Button>I Agree</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  ),
}

export const Controlled: Story = {
  render: () => {
    const [open, setOpen] = useState(false)

    return (
      <>
        <div className="mb-4 text-sm text-muted-foreground">
          Sheet is: {open ? 'Open' : 'Closed'}
        </div>
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="outline">Toggle Sheet</Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Controlled Sheet</SheetTitle>
              <SheetDescription>
                This sheet's state is controlled by React state.
              </SheetDescription>
            </SheetHeader>
            <div className="grid gap-4 py-4">
              <p className="text-sm">
                You can control the sheet's open state programmatically.
              </p>
              <Button onClick={() => setOpen(false)}>Close Sheet</Button>
            </div>
          </SheetContent>
        </Sheet>
      </>
    )
  },
}

export const WithCustomClose: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">Open Sheet</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Confirm Action</SheetTitle>
          <SheetDescription>
            Are you sure you want to proceed with this action?
          </SheetDescription>
        </SheetHeader>
        <div className="py-4">
          <p className="text-sm text-muted-foreground">
            This action cannot be undone. Please confirm that you want to
            continue.
          </p>
        </div>
        <SheetFooter className="gap-2">
          <SheetClose asChild>
            <Button variant="outline">Cancel</Button>
          </SheetClose>
          <SheetClose asChild>
            <Button variant="destructive">Confirm</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  ),
}

export const NoHeader: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">Open Simple Sheet</Button>
      </SheetTrigger>
      <SheetContent>
        <div className="flex h-full items-center justify-center">
          <div className="text-center">
            <h3 className="mb-2 text-lg font-semibold">Simple Content</h3>
            <p className="text-sm text-muted-foreground">
              A sheet without explicit header and footer components.
            </p>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  ),
}

export const CustomStyling: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button>Open Styled Sheet</Button>
      </SheetTrigger>
      <SheetContent className="border-l-4 border-l-primary bg-linear-to-b from-background to-muted">
        <SheetHeader>
          <SheetTitle className="text-2xl text-primary">
            Custom Styled Sheet
          </SheetTitle>
          <SheetDescription className="text-base">
            This sheet has custom styling applied.
          </SheetDescription>
        </SheetHeader>
        <div className="space-y-4 py-6">
          <div className="rounded-lg bg-background p-4 shadow-sm">
            <p className="text-sm">
              You can customize the appearance of the sheet using className
              props.
            </p>
          </div>
          <div className="rounded-lg bg-background p-4 shadow-sm">
            <p className="text-sm">
              Apply gradients, borders, shadows, and more to match your design
              system.
            </p>
          </div>
        </div>
        <SheetFooter>
          <SheetClose asChild>
            <Button className="w-full">Got it!</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  ),
}
